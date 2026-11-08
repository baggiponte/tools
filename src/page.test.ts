import assert from "node:assert/strict";
import { test } from "node:test";

import type { Tool } from "./catalog.ts";
import { render } from "./page.ts";

const template = `<html><head><!-- head: a · b | c --></head><body><!-- header --><main><!-- tools --></main><!-- footer --></body></html>`;
const entries: Tool[] = [
  { slug: "one", name: "one", description: "the first" },
  { slug: "two", name: "<two>", description: 'says "hi" & more' },
];

test("links every tool from the index, escaped", () => {
  const page = render(template, entries, 2026);
  assert.match(page, /<a href="\/one\/">/);
  assert.match(page, /<a href="\/two\/"><h2>&lt;two&gt;/);
  assert.match(page, /says &quot;hi&quot; &amp; more/);
  assert.match(page, /© 2026/);
});

test("fills the head with the page's own title and description", () => {
  const page = render(template, entries, 2026);
  assert.match(page, /<title>a · b<\/title>/);
  assert.match(page, /<meta name="description" content="c" \/>/);
});

test("marks the tools tab as the current section", () => {
  const page = render(template, entries, 2026);
  assert.match(page, /<a class="tab active" href="\/" aria-current="page">tools<\/a>/);
  assert.match(page, /<a class="tab" href="https:\/\/baggiponte.com\/">writing<\/a>/);
});

test("refuses a template without the shared header", () => {
  assert.throws(() => render(template.replace("<!-- header -->", ""), entries, 2026), /header/);
});
