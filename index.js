/**
 * Cloudflare Worker for serving a directory of marimo notebooks
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Health check endpoint
    if (path.startsWith("/health")) {
      return new Response(JSON.stringify({ made: "with marimo", status: "healthy" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Serve the notebooks directory index
    if (path === "/" || path === "") {
      try {
        // Get the main index.html
        return await env.ASSETS.fetch(new Request(`${url.origin}/index.html`));
      } catch (e) {
        return new Response("Index page not found", { status: 404 });
      }
    }
    
    // Handle requests to first-notebook
    if (path.startsWith("/first-notebook")) {
      try {
        // Root request for the notebook
        if (path === "/first-notebook" || path === "/first-notebook/") {
          return await env.ASSETS.fetch(new Request(`${url.origin}/notebooks/first-notebook/index.html`));
        }
        
        // Handle assets and other files inside the notebook directory
        if (path.startsWith("/first-notebook/assets/")) {
          const assetPath = path.replace("/first-notebook/", "/notebooks/first-notebook/");
          return await env.ASSETS.fetch(new Request(`${url.origin}${assetPath}`));
        }
        
        // Handle other static files in the notebook directory (favicons, manifest, etc)
        const notebookPath = path.replace("/first-notebook/", "/notebooks/first-notebook/");
        return await env.ASSETS.fetch(new Request(`${url.origin}${notebookPath}`));
      } catch (e) {
        console.error("Error serving notebook:", e.message);
        return new Response(`Resource not found: ${path}`, { status: 404 });
      }
    }
    
    // Special handling for standalone assets requests (without notebook prefix)
    if (path.startsWith("/assets/")) {
      try {
        // Try to find the asset in the first-notebook directory
        return await env.ASSETS.fetch(new Request(`${url.origin}/notebooks/first-notebook${path}`));
      } catch (e) {
        // Try to serve from root assets directory if present
        try {
          return await env.ASSETS.fetch(request);
        } catch (e2) {
          return new Response(`Asset not found: ${path}`, { status: 404 });
        }
      }
    }
    
    // Handle favicons and other static files at root
    if (path.match(/\.(ico|png|webmanifest|json)$/)) {
      try {
        // Try to serve directly from root first
        return await env.ASSETS.fetch(request);
      } catch (e) {
        // If not found at root, try to serve from first-notebook
        try {
          return await env.ASSETS.fetch(new Request(`${url.origin}/notebooks/first-notebook${path}`));
        } catch (e2) {
          return new Response(`File not found: ${path}`, { status: 404 });
        }
      }
    }
    
    // If nothing else matched, try to serve directly from assets
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response(`Not found: ${path}`, { status: 404 });
    }
  }
};
