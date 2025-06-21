# Marimo Notebooks Site

This repository contains my collection of Marimo notebooks, hosted at [notebooks.rxhulshxr.mx](https://notebooks.rxhulshxr.mx) using Cloudflare Workers.

## Project Structure

```
.
├── index.js           # Cloudflare Worker script (routing logic)
├── wrangler.jsonc     # Cloudflare Workers configuration
└── notebooks-site/    # Website content
    ├── index.html     # Landing page
    └── notebooks/     # Notebooks directory
        └── first-notebook/  # Individual notebook
```

## How to Add a New Notebook

1. Create your notebook using Marimo:
   ```bash
   marimo edit my-new-notebook.py
   ```

2. Export the notebook to WebAssembly:
   ```bash
   marimo export html-wasm my-new-notebook.py -o notebooks-site/notebooks/new-notebook --mode run --include-cloudflare
   ```

3. Add an entry to `notebooks-site/index.html`

4. Deploy:
   ```bash
   npx wrangler deploy
   ```

## Development

- The site uses Cloudflare Workers for hosting
- Each notebook is exported to WebAssembly for browser execution
- The index.js worker script handles routing and serving files

## Deployment

This site is deployed using Cloudflare Workers. To deploy updates:

1. Make your changes
2. Test locally: `npx wrangler dev`
3. Deploy: `npx wrangler deploy`

## Local Development

To run the site locally:
```bash
npx wrangler dev
```

This will start a local server that mimics the Cloudflare Workers environment.
