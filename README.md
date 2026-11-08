# tools

Small tools that run in the browser, at <https://tools.baggiponte.com>, dressed like
[baggiponte.com](https://baggiponte.com).

| tool | what it does |
| --- | --- |
| [formatter](https://tools.baggiponte.com/formatter/) | write a linkedin post with bold, italic and lists, then copy it as unicode text linkedin keeps |
| [preferiresti](https://tools.baggiponte.com/preferiresti/) | turn a would-you-rather dilemma into a 1080×1920 story and export it as a png |
| [metronomo](https://tools.baggiponte.com/metronomo/) | a metronome with time signatures, subdivisions, an accented downbeat and tap tempo |
| [accordatore](https://tools.baggiponte.com/accordatore/) | tune a six-string guitar with reference notes or the microphone |

Formatter and preferiresti used to live in their own repositories and subdomains (`formatter.baggiponte.com`,
`preferiresti.baggiponte.com`); both are archived.

## How it's built

Each tool is a folder in `site/<slug>/` with its `index.html`, `style.css` and `app.js`, plus an entry in
`src/catalog.ts`, which the index page is generated from. Pages carry comment markers (`<!-- head: title |
description -->`, `<!-- header -->`, `<!-- footer -->`, and `<!-- tools -->` on the index) that `src/build.ts`
replaces with the shared head, the blog's header and footer, and the list of tools.

The look is the blog's: `site/blog.css` is a copy of the palette, base styles, header and footer from
baggiponte/blog's `src/styles/global.css`, the fonts come from the same fontsource packages, and `site/tools.css`
adds what the tools share. When the blog's look changes, copy those sections into `site/blog.css` again.

## Develop and deploy

Node from `.node-version`, pnpm from `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm dev          # build and serve on http://localhost:8791
pnpm check        # build into dist/, package for Cloudflare and dry-run the deploy
pnpm run deploy   # upload the last build to the `tools` Worker (`pnpm deploy` is pnpm's own command)
pnpm exec playwright install chromium   # once, for pnpm test
pnpm test         # browser tests against the build (TOOLS_BASE_URL to test the live site)
```

Production is the Cloudflare Worker `tools`, deployed by Workers Builds on every push to `main`, like the blog. Its
build settings live in the Cloudflare dashboard:

| setting | value |
| --- | --- |
| Git repository | `baggiponte/tools`, production branch `main` |
| Build command | `pnpm build` |
| Deploy command | `pnpm run deploy` |
| Root directory | `/` |
| Build watch paths | all |
| Non-production branch builds | off (GitHub CI checks PRs) |

## Checks

`pnpm lint` (Biome, HTML included), `pnpm typecheck`, `pnpm test:unit`, the build with a Cloudflare dry-run, and
`pnpm test` run in CI on every PR, with Zizmor auditing the workflow and read-only permissions; `main` is checked by
Workers Builds itself. The "main branch" ruleset blocks deletion and force pushes and requires signed, linear history
plus the "Audit workflows" and "Build and dry-run deploy" checks; PRs are squash-merged. Secret scanning with push
protection covers secrets on push. Install the local hooks with `uvx --from prek==0.5.7 prek install`.
