# Deployment Guide

This guide explains how to deploy and manage the marimo notebooks site hosted at [notebooks.rxhulshxr.mx](https://notebooks.rxhulshxr.mx).

## Prerequisites

1. Install required tools:
   ```bash
   # Install marimo
   pip install marimo

   # Install Cloudflare Wrangler
   npm install -g wrangler

   # Install GitHub CLI (optional, for repo management)
   brew install gh  # on macOS
   ```

2. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```

## Adding a New Notebook

1. Create and edit your notebook:
   ```bash
   marimo edit my-new-notebook.py
   ```

2. Export it for web deployment:
   ```bash
   marimo export html-wasm my-new-notebook.py -o notebooks-site/notebooks/new-notebook --mode run --include-cloudflare
   ```

3. Add an entry to `notebooks-site/index.html`:
   ```html
   <li class="notebook-item">
       <a href="/new-notebook">
           <h3>Your Notebook Title</h3>
           <p>Brief description of your notebook</p>
       </a>
   </li>
   ```

4. Deploy the changes:
   ```bash
   npx wrangler deploy
   ```

## Local Development

Test changes locally before deploying:
```bash
npx wrangler dev
```

## Deployment Architecture

- **Cloudflare Workers**: Hosts the site and handles routing
- **WebAssembly**: Each notebook is compiled to WebAssembly for browser execution
- **Custom Domain**: Uses notebooks.rxhulshxr.mx subdomain
- **Edge Computing**: Deployed globally on Cloudflare's edge network

## File Structure

```
.
├── index.js           # Cloudflare Worker script (routing logic)
├── wrangler.jsonc     # Cloudflare configuration
└── notebooks-site/    # Website content
    ├── index.html     # Landing page
    └── notebooks/     # Notebooks directory
        └── first-notebook/  # Individual notebook
```

## Common Tasks

### Update Site Content
1. Make changes to notebooks or site content
2. Commit changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Deploy:
   ```bash
   npx wrangler deploy
   ```

### Modify Worker Logic
1. Edit `index.js`
2. Test locally:
   ```bash
   npx wrangler dev
   ```
3. Deploy changes:
   ```bash
   npx wrangler deploy
   ```

## Troubleshooting

1. **Notebook Not Loading**
   - Check browser console for errors
   - Verify the notebook path in index.js matches the directory structure
   - Ensure all assets are properly referenced

2. **Deployment Issues**
   - Check Cloudflare Workers logs in the dashboard
   - Verify wrangler.jsonc configuration
   - Test locally with `npx wrangler dev`

## Monitoring

Monitor your deployment through the Cloudflare Dashboard:
- Usage metrics
- Error rates
- Worker performance

