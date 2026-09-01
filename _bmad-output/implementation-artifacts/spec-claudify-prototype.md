---
title: 'Claudify browser prototype'
type: 'feature'
created: '2026-09-01'
status: 'done'
review_loop_iteration: 0
baseline_commit: 'NO_VCS'
context:
  - '_bmad-output/planning-artifacts/prds/prd-claudify-2026-09-01/prd.md'
  - '_bmad-output/planning-artifacts/prds/prd-claudify-2026-09-01/addendum.md'
  - '_bmad-output/planning-artifacts/prds/prd-claudify-2026-09-01/reconcile-sloptrim.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Claudify needs a one-off browser gimmick that turns ordinary prose into recognizably over-engineered AI slop. Synonym replacement alone cannot produce a convincing parody.

**Approach:** Build a static app around a deterministic pipeline that protects sensitive spans, performs bounded lexical and sentence-shape rewrites, adds abstraction and qualification, restructures eligible prose, and emits one document shared by Rich and Markdown output.

## Boundaries & Constraints

**Always:** Use native browser modules with no production server, dependency, build step, account, analytics, or persistence. Expose transformation, document, serialization, tally, and scoring through a pure domain API with no DOM, fetch, clipboard, or UI-state dependencies; browser adapters and presentation depend on that API, never the reverse. Output is deterministic, deliberately less clear, mildly strained, recognizable, and mostly grammatical. Preserve URLs, email, Markdown links, code, quotations, numbers, and high-confidence names exactly. Include `error` → `meaningful correctness gap` and `task` → `disjoint implementation slice`. Cap non-marker word growth at 2.25×. Derive safe Rich and Markdown forms, tally, and score from one document and ledger.

**Ask First:** Add a package; vendor third-party code/data; weaken span identity, growth, or determinism; add a backend, proxy, telemetry, storage, or service beyond explicit URL fetches.

**Never:** Call an LLM; promise arbitrary-URL extraction; rewrite generated prose; invent factual entities/relationships; optimize for clarity at the joke's expense; ship SlopTrim, Python, source corpora, executable markup, or LinkedIn impersonation.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Pasted prose/example | Non-empty English text | Inflated document with Rich/Markdown views, tally, score, and copy | Pass unmatched fragments through safely |
| Source URL | Public HTTP(S) URL | GitHub adapter or best-effort browser extraction | Retain input; explain CORS/auth/paywall limits and recommend paste |
| Protected content | Names, numbers, links, email, quotes, or code | Byte-identical payload in both serializers | Skip unsafe local rewrites |
| Empty/hostile input | Blank or markup/script-like source | Blank is rejected; markup remains inert | Show an inline error; execute nothing |
| Limited clipboard | Rich clipboard API unavailable/rejected | Faithful plain-text fallback | Show success or failure |

</frozen-after-approval>

## Code Map

- `index.html`, `styles.css` -- accessible, responsive shell and LinkedIn-like parody preview.
- `src/app.js` -- presentation state and orchestration only; contains no transformation rules.
- `src/domain/index.js` -- stable public domain facade consumed by presentation.
- `src/domain/engine.js`, `src/domain/rules.js`, `src/domain/hash.js`, `src/domain/document.js` -- browser-independent pipeline, document, serializers, budgets, ledger, and stable variants.
- `src/browser/url.js`, `src/browser/clipboard.js`, `src/browser/render.js` -- fetch, clipboard, and safe DOM adapters around domain values.
- `test/engine.test.js` -- composition, guardrail, budget, and serializer fixtures.
- `package.json`, `README.md` -- zero-dependency commands and operating notes.

## Tasks & Acceptance

**Execution:**
- [x] `src/domain/*` -- implement a pure public domain API, nonrecursive ledger-backed pipeline, stable variants, serializers, and budgets.
- [x] `src/browser/*` -- adapt domain values to URL loading, clipboard behavior, and safe rich DOM without leaking browser concerns into the domain.
- [x] `index.html`, `styles.css`, `src/app.js` -- deliver paste/example/URL, transform, tabs, sign feedback, scoring, and copy flows without embedding transformation rules.
- [x] `test/engine.test.js`, `package.json`, `README.md` -- cover fixtures with Node built-ins and document serving and the optional oracle.

**Acceptance Criteria:**
- Given an eligible 120–300 word showcase, output uses at least four transformation classes, abundant cliché/hedge/abstraction/marketing language, bold, em dashes, negative parallelism, and deliberate clarity loss within 2.25× growth.
- Repeated identical input yields byte-identical Markdown, structure, score, tally, and ledger.
- Rich and Markdown output share wording/block order; source markup stays inert.
- The domain facade is browser-native and free of browser globals, so development tests can import it under Node and presentation can be replaced without changing the domain contract; Node is never part of the deployed runtime.
- URL success offers extracted text; failure explains browser limits without losing input.
- The optional pinned SlopTrim run reaches ≥15 families, ≥10 score-bearing families, and `heavy tells`; families 47, 48, 50, 62–68, and 71 remain absent. Default tests do not require it.

## Spec Change Log

- 2026-09-01: Implemented the static browser prototype, pure domain facade, browser adapters, and fixture suite.
- 2026-09-01: Corrected the pinned SlopTrim result parser and strengthened showcase density to pass 18 detected families, including 14 score-bearing families.
- 2026-09-01: Hardened protected-span identity, immutable document validation, conservative rewrites, bounded URL loading, stale-request invalidation, tab accessibility, and verification coverage after adversarial review.

## Design Notes

Pass order controls quality: protect; segment; apply longest phrase rules; apply at most one guarded grammar rewrite and one source-derived expansion per sentence; structure; style; restore; validate. Generated text never re-enters earlier passes. Source-and-occurrence hashing creates reproducible variation. Uncertain constructions pass through locally.

The domain dependency boundary is strict: hashing, rules, transformation, document modeling, tallying, scoring, and serialization have no DOM, fetch, clipboard, storage, or UI-state dependencies. Browser adapters depend on the public domain facade; the domain never imports an adapter.

## Verification

**Commands:**
- `npm test` -- built-in Node fixtures pass without installation.
- `npm run check` -- JavaScript modules parse.
- `SLOPTRIM_DETECT=/path/to/pinned/detect.py npm run oracle` -- optional thresholds pass or the unset detector skips explicitly.

**Manual checks:**
- Serve with `python3 -m http.server 8000`; verify all UI flows and worse-but-recognizable prose.

## Suggested Review Order

**Domain boundary**

- Start with the stable browser-independent contract consumed by every presentation layer.
  [`index.js:6`](../../src/domain/index.js#L6)

- Follow presentation orchestration to confirm dependencies point inward only.
  [`app.js:1`](../../src/app.js#L1)

- Inspect request generations and tab behavior isolated from transformation rules.
  [`state.js:2`](../../src/presentation/state.js#L2)

**Transformation pipeline**

- Review the deterministic expansion, budget fallback, and document construction sequence.
  [`engine.js:25`](../../src/domain/engine.js#L25)

- Check collision-safe protection before lexical or structural rewriting.
  [`engine.js:177`](../../src/domain/engine.js#L177)

- Review curated cliché variants and scoring categories separately from execution logic.
  [`rules.js:3`](../../src/domain/rules.js#L3)

- Confirm shared documents are validated, deeply frozen, and serializer-neutral.
  [`document.js:11`](../../src/domain/document.js#L11)

**Browser adapters and UI**

- Inspect bounded best-effort fetching and conservative article extraction.
  [`url.js:5`](../../src/browser/url.js#L5)

- Check safe recursive DOM construction from inert rich-tree values.
  [`render.js:4`](../../src/browser/render.js#L4)

- Review the accessible static two-pane interaction shell.
  [`index.html:23`](../../index.html#L23)

**Verification**

- Start adversarial fixtures with protected-span and marker-collision coverage.
  [`hardening.test.js:12`](../../test/hardening.test.js#L12)

- Review the main composition fixture and clarity-loss acceptance checks.
  [`engine.test.js:14`](../../test/engine.test.js#L14)

- Finish with the optional pinned external-oracle gate.
  [`oracle.js:8`](../../test/oracle.js#L8)
