# onionLad.github.io

Bill's personal portfolio site — a static React app (loaded via CDN script tags and Babel standalone, no build step).

## Running locally

Opening `index.html` directly in a browser won't work: the page loads its `.jsx` components and `posts.json` over HTTP, and the `file://` protocol blocks those requests, leaving a blank page.

Instead, serve the site from the repo root with any local HTTP server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (`npx serve` works too.) Press `Ctrl+C` to stop the server.
