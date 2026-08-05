# Sumimi studio homepage

Static homepage for `sumimi.jp`. It acts as the studio-level directory for:

- `fairy.sumimi.jp` — current data-tool project, replacing `data.sumimi.jp`
- `research.sumimi.jp` — working notes and experiments
- `maga.sumimi.jp` — product-lead development workflow

## Preview

Serve `public/` with any static file server. For example:

```powershell
npx wrangler dev --config studio/wrangler.jsonc
```

The site has no build step or runtime dependencies. Its EN/JP language choice is stored in local browser storage.

## Deploy

From the repository root:

```powershell
npx wrangler deploy --config studio/wrangler.jsonc
```

The Cloudflare configuration claims `sumimi.jp` and `www.sumimi.jp`; verify those custom domains belong to the intended Cloudflare account before deploying.

## Design references

The accepted section concepts are stored in `design/`. They were generated with the built-in image generation workflow and use the existing Sumimi wordmark as their brand reference.
