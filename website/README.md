# MAGA homepage

The homepage is a dependency-free static site in `public/`, prepared for Cloudflare Workers Static Assets.

## Local preview

Serve `public/` with any static file server.

## Cloudflare deployment

`wrangler.jsonc` points Workers Static Assets at `public/` and declares `maga.sumimi.jp` as the custom domain. After Cloudflare authentication is available, deploy from this directory with Wrangler or the official Cloudflare API tooling.
