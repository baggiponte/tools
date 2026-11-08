# General directives

* Titles, both for the site and the tools, should be lowercase.
* Work on feature branches, never directly on `main`.
* Commit frequently and atomically: each commit is one logical change.

# Tools

* Add a tool as `site/<slug>/` (`index.html`, `style.css`, `app.js`) plus an entry in `src/catalog.ts`.
* Style tools with the blog's tokens (`--paper`, `--ink`, `--accent`, …) and `site/tools.css`; never hard-code a palette or font.
* `site/blog.css` mirrors baggiponte/blog's `src/styles/global.css`: refresh it from there, don't restyle it here.

# Code

* Run `pnpm lint`, `pnpm typecheck`, `pnpm test:unit` and `pnpm test` (after `pnpm build`) after changing code.
* Write relative imports with their `.ts` extension; Node runs the build script and the unit tests without a bundler.
* Fix lint errors rather than silencing them; a `biome-ignore` needs a reason that says why the rule doesn't apply.
* Test behaviour, not the renderer restating itself: a test must be able to fail when the code is wrong.
