#!/usr/bin/env node
// Fetches the latest Substack posts and writes them to posts.json in the
// shape Content.jsx expects: { title, date, embed }.
//
// Substack's RSS feed and JSON API both sit behind a Cloudflare managed
// challenge that blocks GitHub Actions runners (datacenter IPs) with a 403
// "Just a moment..." page (cf-mitigated=challenge). We therefore try several
// sources in order of fidelity, falling through to ones with clean egress:
//   1. Substack archive JSON API — perfect titles + dates, but same Cloudflare
//      zone, so usually challenged from CI. Tried first in case it's exempt.
//   2. Substack RSS feed, parsed directly — best titles (proper CDATA casing),
//      but same Cloudflare zone, so also usually challenged from CI.
//   3. api.rss2json.com — third-party server-side RSS->JSON proxy with clean
//      egress. Reachable from CI and returns full titles + dates + links. This
//      is the source that actually works from GitHub Actions.
//   4. r.jina.ai reader proxy — last-resort third-party fetcher. Loses titles
//      (slugs only) and its free tier now 403s from busy CI IP ranges; kept as
//      a final fallback only.

import { writeFile } from "node:fs/promises";

const PUB = "https://billxia.substack.com";
const ARCHIVE_API = `${PUB}/api/v1/archive?sort=new&offset=0&limit=12`;
const RSS_FEED = `${PUB}/feed`;
const RSS2JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED)}`;
const JINA_FEED = `https://r.jina.ai/${PUB}/feed`;
const OUT_PATH = new URL("../posts.json", import.meta.url);
const MAX_POSTS = 3;
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const formatDate = (raw) => {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

const dumpFailure = async (label, res) => {
  const headers = Object.fromEntries(res.headers);
  console.error(`[${label}] Status: ${res.status} ${res.statusText}`);
  console.error(`[${label}] cf-mitigated=${res.headers.get("cf-mitigated") || "(none)"}  cf-ray=${res.headers.get("cf-ray") || "(none)"}  server=${res.headers.get("server") || "(none)"}`);
  console.error(`[${label}] Headers: ${JSON.stringify(headers, null, 2)}`);
  try {
    const body = await res.text();
    console.error(`[${label}] Body length: ${body.length}`);
    console.error(`[${label}] Body preview (first 1000 chars):\n${body.slice(0, 1000)}`);
  } catch (e) {
    console.error(`[${label}] Could not read body: ${e}`);
  }
};

const fetchWithLog = async (label, url) => {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA, accept: "*/*" } });
    console.log(`[${label}] ${res.status} ${res.statusText} (${res.headers.get("content-type") || "no content-type"})`);
    return res;
  } catch (err) {
    console.error(`[${label}] fetch threw: ${err?.name}: ${err?.message}`);
    if (err?.cause) console.error(`[${label}] cause: ${err.cause}`);
    return null;
  }
};

// --- Source 1: archive JSON API -----------------------------------------

async function fromArchiveApi() {
  const label = "archive-api";
  console.log(`[${label}] GET ${ARCHIVE_API}`);
  const res = await fetchWithLog(label, ARCHIVE_API);
  if (!res) return null;
  if (!res.ok) {
    await dumpFailure(label, res);
    return null;
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error(`[${label}] JSON parse failed: ${e}`);
    return null;
  }

  if (!Array.isArray(data)) {
    console.error(`[${label}] Expected array, got ${typeof data}`);
    return null;
  }
  console.log(`[${label}] Got ${data.length} items`);

  const posts = data
    .filter((p) => p?.title && p?.slug && p.slug !== "coming-soon" && p?.post_date)
    .slice(0, MAX_POSTS)
    .map((p) => ({
      title: p.title,
      date: formatDate(p.post_date),
      embed: p.canonical_url || `${PUB}/p/${p.slug}`,
    }));

  if (posts.length === 0) {
    console.error(`[${label}] No usable posts after filtering`);
    return null;
  }
  return posts;
}

// --- Source 2: Substack RSS feed, parsed directly -----------------------

// Pull a single tag's text out of an <item> block, unwrapping CDATA if present.
const grabTag = (block, tag) => {
  const m = block.match(
    new RegExp(`<${tag}\\b[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`),
  );
  return m ? m[1].trim() : "";
};

async function fromRssFeed() {
  const label = "rss-feed";
  console.log(`[${label}] GET ${RSS_FEED}`);
  const res = await fetchWithLog(label, RSS_FEED);
  if (!res) return null;
  if (!res.ok) {
    await dumpFailure(label, res);
    return null;
  }

  const xml = await res.text();
  console.log(`[${label}] Got ${xml.length} bytes`);

  const items = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/g)];
  console.log(`[${label}] Parsed ${items.length} items`);

  const posts = items
    .map((m) => ({
      title: grabTag(m[1], "title"),
      link: grabTag(m[1], "link"),
      pubDate: grabTag(m[1], "pubDate"),
    }))
    .filter((p) => p.title && p.link && !p.link.endsWith("/coming-soon"))
    .slice(0, MAX_POSTS)
    .map((p) => ({ title: p.title, date: formatDate(p.pubDate), embed: p.link }));

  if (posts.length === 0) {
    console.error(`[${label}] No usable posts after filtering`);
    return null;
  }
  return posts;
}

// --- Source 3: rss2json clean-egress proxy ------------------------------

async function fromRss2Json() {
  const label = "rss2json";
  console.log(`[${label}] GET ${RSS2JSON}`);
  const res = await fetchWithLog(label, RSS2JSON);
  if (!res) return null;
  if (!res.ok) {
    await dumpFailure(label, res);
    return null;
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error(`[${label}] JSON parse failed: ${e}`);
    return null;
  }

  if (data?.status !== "ok" || !Array.isArray(data.items)) {
    console.error(
      `[${label}] Bad payload: status=${data?.status} message=${data?.message || ""}`,
    );
    return null;
  }
  console.log(`[${label}] Got ${data.items.length} items`);

  const posts = data.items
    .filter((p) => p?.title && p?.link && !p.link.endsWith("/coming-soon"))
    .slice(0, MAX_POSTS)
    .map((p) => ({
      title: p.title,
      // rss2json returns "YYYY-MM-DD HH:MM:SS" in UTC with no zone marker;
      // normalize to an ISO UTC string so formatDate doesn't shift the day.
      date: formatDate(String(p.pubDate).replace(" ", "T") + "Z"),
      embed: p.link,
    }));

  if (posts.length === 0) {
    console.error(`[${label}] No usable posts after filtering`);
    return null;
  }
  return posts;
}

// --- Source 4: jina.ai reader proxy -------------------------------------

// Reconstruct a title from a slug. Lossy: punctuation is gone, and Substack
// lowercases stopwords in titles ("Intro to Epidemiology") that we can't
// distinguish from slug words. We lowercase a small set of common stopwords
// for English readability; everything else is title-cased.
const STOPWORDS = new Set(["to", "of", "the", "a", "an", "and", "or", "in", "for", "on", "at", "by", "is", "vs"]);
const titleFromSlug = (slug) =>
  slug
    .split("-")
    .map((w, i) =>
      i > 0 && STOPWORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");

async function fromJinaReader() {
  const label = "jina-reader";
  console.log(`[${label}] GET ${JINA_FEED}`);
  const res = await fetchWithLog(label, JINA_FEED);
  if (!res) return null;
  if (!res.ok) {
    await dumpFailure(label, res);
    return null;
  }

  const text = await res.text();
  console.log(`[${label}] Got ${text.length} bytes`);

  // Each post appears as:
  //   ### [](https://billxia.substack.com/p/<slug>)
  //
  //   [<url>](<url>)
  //
  //   <RFC-822 date>
  const blockRe =
    /###\s+\[\]\((https?:\/\/[^)]+\/p\/([^)]+))\)[\s\S]*?\n\s*([A-Z][a-z]{2},\s*\d{2}\s+[A-Z][a-z]{2}\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+GMT)/g;
  const matches = [...text.matchAll(blockRe)];
  console.log(`[${label}] Parsed ${matches.length} post blocks`);

  const posts = matches
    .map((m) => ({ embed: m[1], slug: m[2], pubDate: m[3] }))
    .filter((p) => p.slug !== "coming-soon")
    .slice(0, MAX_POSTS)
    .map((p) => ({
      title: titleFromSlug(p.slug),
      date: formatDate(p.pubDate),
      embed: p.embed,
    }));

  if (posts.length === 0) {
    console.error(`[${label}] No usable posts after filtering`);
    console.error(`[${label}] Body preview (first 1000 chars):\n${text.slice(0, 1000)}`);
    return null;
  }
  return posts;
}

// --- Driver -------------------------------------------------------------

const sources = [
  { name: "archive-api", run: fromArchiveApi },
  { name: "rss-feed", run: fromRssFeed },
  { name: "rss2json", run: fromRss2Json },
  { name: "jina-reader", run: fromJinaReader },
];

let posts = null;
let usedSource = null;
for (const src of sources) {
  console.log(`--- Trying source: ${src.name} ---`);
  const result = await src.run();
  if (result && result.length > 0) {
    posts = result;
    usedSource = src.name;
    break;
  }
  console.log(`--- Source ${src.name} did not yield posts, continuing ---`);
}

if (!posts) {
  // Exit 0: a failed refresh is harmless (posts.json keeps its last good
  // state and the next scheduled run retries), so don't fail the workflow.
  console.error("All sources failed; leaving posts.json untouched");
  process.exit(0);
}

await writeFile(OUT_PATH, JSON.stringify(posts, null, 2) + "\n");
console.log(`Wrote ${posts.length} posts to posts.json (via ${usedSource})`);
for (const p of posts) console.log(`  - ${p.date}  ${p.title}`);
