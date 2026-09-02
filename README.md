# Claudify

Claudify is a one-page browser parody that deterministically turns ordinary English prose into over-engineered, conspicuously AI-flavoured writing. It calls no model and has no production dependency, build step, account, analytics, storage, Node process, server component, or backend. Node is used only for development tests and checks; deployed production consists solely of the static HTML, CSS, and browser JavaScript files.

## Run it

```sh
npm test
npm run check
npm run serve
```

Then open <http://localhost:8000>. The Python command is a development convenience only: any static host works, and no application server runs in production. Native ES modules do not work reliably from `file://` URLs.

## Architecture

`src/domain/index.js` is the public domain API. Transformation, rule selection, document modeling, tallying, scoring, and Markdown/plain/rich-tree serialization are pure modules: they have no DOM, fetch, clipboard, storage, or UI-state dependencies. `src/browser/render.js` converts the inert rich tree to DOM nodes with `textContent`; the sibling URL and clipboard modules contain those browser adapters. `src/app.js` owns browser state and UI orchestration. Dependencies point from the browser adapters toward the domain, never the reverse.

The engine protects fenced, inline, tilde-fenced, and indented code; URLs (including balanced parentheses); email; Markdown links; multiline quotations; source bold spans; numbers; and high-confidence title-case or all-caps multiword names before its nonrecursive passes. A bounded, dependency-free phrase map also translates the supplied Shakespearean/archaic phrases longest-first, preserving the archaic triggers as source-side keys while using workplace-safe, Claude-like technical euphemisms for generated variants. Protected CRLF bytes remain exact. Conservative sentence-shape gates keep question force, colon and semicolon leads, and imperative mood intact; controlled awkwardness never licenses malformed punctuation or broken basic word order. A ledger records each rule application; output modes, the Sign Tally, and the comedic Slop Score all derive from the same deeply immutable transformed document. When the expansive result would exceed the 2.25× non-marker word-growth ceiling, the engine deterministically falls back to bounded grammar/lexical passes and finally unchanged prose.

URL loading is best-effort and browser-only. Recognized public GitHub issue and pull-request URLs use the disclosed `api.github.com` adapter. Other URLs are fetched directly and remain subject to CORS, authentication, paywalls, and bot controls. Browser fetches time out after 12 seconds and reject responses or extracted sources above 1,000,000 bytes. Editing, clearing, or replacing source text aborts older loads and invalidates previous output.

## Optional SlopTrim oracle

The normal test suite needs only Node. To run a separately installed, pinned SlopTrim detector against the composition fixture:

```sh
SLOPTRIM_DETECT=/absolute/path/to/sloptrim/scripts/detect.py npm run oracle
```

If `SLOPTRIM_DETECT` is unset, the command reports an explicit skip and succeeds. SlopTrim is development evidence only and is never shipped or used as the product score. The expected pin is `4daf5ba58be10683bdbfe9125634aef02d17caa9`.
