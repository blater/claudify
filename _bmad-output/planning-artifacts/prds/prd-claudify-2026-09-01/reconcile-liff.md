# Liff Reconciliation for Claudify

## Review Scope

This reconciliation compares the user-owned Liff repository at `/Users/blater/src/liff` with `prd.md` and `addendum.md`. It is an extraction review: it identifies reusable designs and implementation lessons without importing Liff source code or dictionary content into Claudify.

Reviewed repository state:

- Commit: `e6832f02762dbdde4fd51231fc1f2543dbac46f4`
- Commit date: 2026-08-27
- Worktree: clean at review time
- Principal evidence: `README.md`, `impl/SPECIFICATION.md`, `generate_json_code.py`, `render_json_template.py`, `codegen-targets.json`, `templates/liff_dictionary.ts.tmpl`, the TypeScript core/model/normalizer/CLI, and their tests

## Executive Verdict

The PRD and addendum make the right high-level call: reuse Liff's architectural shape, not its dictionary or search behavior. Liff offers a strong precedent for an authoritative JSON dataset, checked-in generated immutable TypeScript, a separately testable core, thin adapters, deterministic generation, and shared conformance fixtures. Those patterns fit Claudify well and do not create deployed dependencies.

The main qualification is that Liff is a Node/CommonJS command-line product, not a browser library, and its core is not wholly deterministic because its production random path calls `Math.random()`. Its normalization and fuzzy-search implementation are intentionally lossy and are actively unsuitable for source-preserving transformation. Liff also provides no semantic rules, parser, protected-span mechanism, inflection, stable hashing, document AST, browser serialization, URL extraction, or clipboard implementation.

For the one-off MVP, the best balance is:

1. Extract Liff's boundaries and conformance discipline.
2. Author a Claudify-specific versioned rule schema and browser core.
3. Optionally reuse the generic JSON-to-TypeScript generator only after an explicit code-license/provenance decision.
4. Do not ingest `liff.json`, generated dictionary modules, dictionary schemas, normalization, fuzzy matching, or CLI code.

## Reconciliation Matrix

| Topic | What Liff actually does | Current PRD/addendum treatment | Reconciled decision |
|---|---|---|---|
| Architecture | Normative flow is `liff.json -> generated language data -> pure core library -> CLI adapter`. | Addendum accurately cites authoritative data, generated TypeScript, pure core, and an adapter boundary. | Adopt the boundary pattern as `rules.json -> validated/generated rule module -> pure transformation core -> browser UI/URL/clipboard adapters`. Do not treat Liff's CLI as a browser-ready adapter. |
| TypeScript target | Strict TypeScript with `readonly`, discriminated unions, `Object.freeze`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`; compiles to ES2022 CommonJS for Node. | Correctly describes generated immutable TypeScript, but does not mention the Node/CommonJS target. | Reuse the strictness and immutable-value patterns. Create a new browser/ES-module build; Liff's output cannot be dropped into a static browser page unchanged. |
| Runtime dependencies | Deployed TypeScript CLI has no npm dependencies, but requires Node. Building/testing requires Python, `tsc`, Node, and Make. There is no `package.json`. | PRD's “Runtime Dependency” definition applies after deployment and is compatible with build tooling. | Keep the deployed site dependency-free. Record that zero runtime dependencies does not prohibit build/test tools. Do not inherit Node as a deployed runtime. |
| Authoritative data | `liff.json` is source data; `codegen-targets.json` and a generic dependency-free Python template engine produce checked-in native modules. `--check` detects stale output. | Addendum recognizes authoritative dictionary data and generated immutable TypeScript. | Strong reuse opportunity: maintain authored, versioned Claudify rule data and a generated `rules-generated.ts`; include a stale-generation check. |
| Generation validation | The generic generator validates JSON/template mechanics and target-language string escaping, but it does not validate domain-specific Liff schema invariants before rendering. Many invariants are checked later in TypeScript conformance tests. | Addendum does not distinguish code generation from domain validation. | Add a Claudify-specific schema/semantic validator before generation: unique stable IDs, known categories, nonempty triggers/variants, valid priorities/budgets, resolvable references, safe templates, and positive/counterexample coverage. Generation alone is not sufficient validation. |
| Data model | Liff uses `Entry { word, partOfSpeech, definition, references }` and outcome unions for dictionary search. | Addendum explicitly rejects this schema for Claudify. | Correct. Claudify needs rule definitions, document nodes, protected runs, rewrite plans, and ledger entries. No Liff entry or result type should be carried over. |
| Immutability | Generated entries are built through frozen factories; arrays and individual references are frozen. TypeScript `readonly` adds compile-time protection. There is no generic recursive freeze utility. | “Generated immutable TypeScript” is substantially accurate. | Copy the discipline, not the exact factories. Build Claudify values immutably by construction and freeze nested arrays/records that remain observable. Do not assume a shallow top-level freeze protects a document tree. |
| Determinism | Search, scoring, ordering, and generation are deterministic. Random selection uses `Math.random()` in production and becomes deterministic only through an injected chooser seam in tests. | Addendum calls the core pure and deterministic and proposes a stable source/rule hash. | Qualify the Liff precedent: its search core is deterministic; its random path is not. Claudify must implement its own stable hash and inject or derive variant choice without `Math.random()`. Liff contains no reusable stable-hash implementation. |
| Normalization | ASCII-only lowercasing removes apostrophes and converts all other punctuation/non-ASCII runs to spaces. It intentionally discards source form and offsets. | Addendum correctly rejects Liff's punctuation-stripping tokenizer. | Do not reuse it. Claudify must retain UTF-16/code-point boundaries, punctuation, whitespace, casing, and original ranges. The useful lesson is to specify normalization explicitly and test Unicode edge cases, not to share the algorithm. |
| Search and semantics | Liff performs exact/glob/OSA Damerau-Levenshtein headword lookup with prefix score floors. It measures spelling similarity, not meaning. It has no phrase trie or semantic transformation. | Addendum correctly rejects all-candidate fuzzy search and says exact concept groups are needed. | Do not reuse `Dictionary`, OSA distance, prefix scoring, or glob logic. Implement authored longest-phrase matching and grammar/context guards. Liff offers no hidden synonym or NLP capability. |
| Core/adapters | Core modules avoid console I/O; the CLI owns arguments, formatting, status codes, and sinks. | Adapter-boundary lesson is cited. | Preserve this separation, but define three browser adapters: source URL extraction, safe DOM/Markdown rendering, and clipboard. Keep all of them out of the transformation core. |
| Tests | Shared JSON conformance and algorithm fixtures are consumed by every language. TypeScript tests use a tiny custom Node harness, source-vs-generated checks, exact outcome checks, mutation/freeze assertions, and injected nondeterminism seams. | Addendum asks for fixtures, snapshots, invariants, and a rule ledger. | Reuse the fixture/conformance strategy. Add browser-specific tests and manual compatibility checks because Liff tests do not exercise DOM, CORS/fetch, `Intl.Segmenter`, rich clipboard MIME types, or accessibility. |
| Licensing | No repository-wide `LICENSE`, `COPYING`, or `NOTICE` file was found. The README says dictionary excerpts are copyrighted by Douglas Adams and John Lloyd and claims no rights to them. | Addendum correctly warns that code reuse needs a provenance/license decision and dictionary content must not be reused. | Keep the warning. User ownership permits a deliberate licensing decision but does not erase third-party rights in dictionary text. Do not copy `liff.json` or generated dictionary files. License/attribute any selected code before public release and audit contributor history if authorship is not exclusively known. |

## Reuse Opportunities Worth Keeping

### 1. Authoritative Rule Data and Stale-Generation Checks

Liff's best direct contribution is its generic build-time data pipeline:

- a single JSON source;
- a manifest naming the input, template, and output;
- deterministic generation;
- target-language-safe TypeScript string escaping, including controls and Unicode line separators;
- a `--check` mode that fails on stale committed output;
- tests proving special characters compile and round-trip.

This can support Claudify's frozen rule snapshot without introducing a deployed dependency. A Claudify data document should include at minimum:

- `schema_version` and dataset/version identifier;
- stable rule ID and category;
- explicit trigger phrases or matcher kind;
- part-of-speech/sentence-shape/context guards;
- variants and inflection policy;
- priority, overlap/consumption policy, and paragraph density budget;
- positive examples and counterexamples, or stable references to fixture IDs;
- source/provenance metadata for externally derived vocabulary.

The generic renderer cannot validate those semantics. A dedicated validator must run before rendering and in `--check`/CI.

### 2. Strict Immutable TypeScript Modeling

Liff demonstrates useful implementation conventions:

- discriminated unions for outcomes and requests;
- `readonly` interfaces;
- factory functions that return frozen values;
- defensive copies before freezing arrays;
- exhaustive type narrowing;
- strict compiler settings that catch unchecked indexes and optional-field mistakes.

Claudify should apply those conventions to `DocumentNode`, `TextRun`, `ProtectedRun`, `RewritePlan`, `Rule`, and `LedgerEntry`. This is conceptual/model reuse; the Liff `Entry`, `Outcome`, and factory functions do not match Claudify's domain.

### 3. Pure Core with Explicit Seams

Liff keeps command-line I/O out of search logic and injects the random chooser for tests. Claudify should use the same seam discipline for:

- segmentation implementation (`Intl.Segmenter` or deterministic fallback);
- stable variant selector/hash;
- clock-free score calculation;
- URL loader;
- clipboard writer.

Unlike Liff's production random path, Claudify's variant selector must always be deterministic. Identical source text, rule data, segmentation mode, and deployed version should produce identical output.

### 4. Shared Conformance Fixtures

Liff's shared `search-cases.json` and `algorithm-cases.json` prevent implementations from silently drifting. Claudify can use parallel fixture families:

- `transformation-cases.json`: exact source, expected document/Markdown, and ledger;
- `protection-cases.json`: spans and exact round-trip invariants;
- `segmentation-cases.json`: paragraphs, sentences, tokens, punctuation, Unicode, and offsets;
- `rule-cases.json`: every rule's positives and counterexamples;
- `serializer-cases.json`: document nodes mapped to Markdown, plain text, and safe rich DOM;
- `url-extraction-cases.html`: article/main/body selection and removed elements.

As in Liff, deployed code must not fetch or parse these fixture files at runtime.

### 5. Exact Ordering and Generated-Source Conformance

Liff explicitly defines source order, tie-breaking, and source-to-generated equivalence. Claudify needs equally explicit rules:

- rules ordered by priority, then stable ID;
- phrase triggers resolved longest-first, then priority, then stable ID;
- variants selected from a stable source/rule/occurrence hash;
- ledger entries emitted in document order with stable tie-breaks;
- generated rule count, IDs, and values checked against authoritative JSON.

This avoids engine behavior depending on object enumeration accidents or unstable sort ties.

## Items That Must Not Be Reused

### Dictionary Content and Generated Dictionary Modules

`liff.json` contains third-party copyrighted dictionary excerpts. Its generated TypeScript embeds those definitions and is therefore equally unsuitable for ingestion. Claudify's non-goal in PRD §7 is correct.

### Dictionary Schema

Headwords, definitions, parts of speech, and cross-references cannot represent rule guards, rewrite templates, overlap policies, density budgets, examples, or provenance. Reusing the schema would force transformation rules into opaque definition strings.

### Normalization

Liff deliberately strips apostrophes and punctuation, lowercases ASCII, treats non-ASCII letters as separators, and loses original offsets. Those are acceptable headword-search semantics and incompatible with Claudify's payload-preservation contract.

### Fuzzy Search

Edit distance answers “is this spelling close?” rather than “does this phrase express a supported concept?” It would create exactly the accidental semantic rewrites rejected in addendum §9. Claudify requires curated phrase triggers and conservative sentence recognizers.

### Node CLI and Build Output

Liff's TypeScript compiler target is CommonJS and its launcher depends on Node. Claudify needs browser-loadable JavaScript/ES modules and DOM-facing adapters. The strict compiler options are useful; the module/launcher configuration is not.

## Gaps and Corrections to the Existing Artifacts

The gaps do not require changing the PRD's user-facing scope, but implementation planning should account for them.

### Gap 1: The Liff Core Is Not Uniformly Deterministic

The addendum's phrase “a pure deterministic core” is slightly too broad. Search and generation are deterministic, while `Dictionary.random()` and default `resolve()` use `Math.random()`. Tests inject a chooser through `randomWith`/`resolveWith`. Claudify should reuse the seam pattern but must not reuse production randomness.

### Gap 2: Liff's TypeScript Is Not Browser-Ready

The addendum omits that the TypeScript port targets ES2022 CommonJS, packages a Node launcher, and has no DOM types. Core ideas transfer, but browser delivery requires a new module target and static-page entrypoint. This is an architectural adaptation, not a copy-and-run reuse.

### Gap 3: Code Generation Does Not Supply Domain Validation

The generic renderer checks template syntax, paths, filters, and target-language literals. It does not enforce Liff's normative source invariants, and it will not enforce Claudify rule invariants. A malformed but renderable rule document could compile successfully. Claudify needs an explicit rule validator and failure tests.

### Gap 4: Liff Supplies No Transformation Primitives

There is no phrase matcher, syntax recognizer, inflector, segmenter, protected-span locator, interval conflict resolver, AST serializer, stable hash, or rule ledger in Liff. The addendum correctly proposes these components but implementation estimates must treat them as new work. Liff accelerates organization and verification, not the substance of the parody engine.

### Gap 5: License and Provenance Need an Action, Not Only a Warning

No repository-wide code license was found. The user's ownership makes reuse feasible, but public distribution still needs an explicit licensing record. Before copying any Liff code, identify the selected files and commit, confirm contributor ownership, choose the Claudify project license, and add an attribution/provenance note. The third-party dictionary content must remain excluded regardless.

## Recommended Claudify Architecture Informed by Liff

```text
authored rules.json
    -> Claudify rule validator
    -> deterministic TypeScript generation / stale check
    -> immutable rule module
    -> pure transformation pipeline
         protect + segment
         phrase matching
         grammar-gated rewrites
         context-derived expansion
         structural rewrites
         typography
         invariant validation + ledger
    -> TransformedDocument
         -> safe DOM/rich clipboard adapter
         -> Markdown/plain-text adapter
         -> Sign Tally/Slop Score projection

browser-only adapters beside, not inside, the core:
    URL fetch/extraction
    Intl.Segmenter selection/fallback
    clipboard/status UI
```

The generated rule module should contain data only. Matchers and rewrite code should stay hand-authored, reviewable, and testable. A rule may name a known matcher, but rule data should not contain executable JavaScript strings.

## Dependency Policy

The Liff precedent supports the PRD's deployed dependency policy, with one important distinction:

- **Deployed:** HTML, CSS, and browser JavaScript only; no Node, Python, package loader, remote model, API, or CDN library.
- **Build:** TypeScript and optional Python generation are acceptable because they do not ship or execute in the user's browser.
- **Tests:** Build-time test tools are acceptable, but the core deterministic conformance suite should remain runnable without network access.
- **Artifacts:** Generated rule data should be checked in or produced reproducibly during deployment; runtime must not fetch rule JSON.

If the one-off implementation wishes to avoid Python entirely, it may hand-author TypeScript rule data or create a tiny Claudify-specific build script. That is a simplicity decision, not a runtime-dependency requirement.

## Test and Acceptance Additions

Beyond the addendum's current verification strategy, implementation should include:

1. A rule-data validation test proving duplicate IDs, unknown matcher kinds, invalid priorities/budgets, empty variants, unresolved fixture references, and malformed provenance fail before generation.
2. A generated-data freshness check equivalent to Liff's `--check`.
3. A source-to-generated conformance test comparing every rule field and order, not merely rule count.
4. Tests proving identical input produces identical variant selection without stubbing `Math.random()` because the engine must never call it.
5. Tests running both `Intl.Segmenter` and fallback paths against shared expected boundaries, or a documented versioning rule if boundaries intentionally differ.
6. Browser tests/manual smoke checks for safe DOM rendering, rich/plain clipboard fallback, fetch/CORS failure presentation, keyboard operation, and current Chrome/Firefox/Safari/Edge.
7. Negative tests demonstrating that Liff-style punctuation stripping and fuzzy spelling matches are absent from the transformation path.

## Licensing and Provenance Checklist

- Do not copy `liff.json` or any generated dictionary file.
- Do not describe Liff dictionary text as user-owned code; the README attributes the excerpts to Douglas Adams and John Lloyd.
- If reusing `generate_json_code.py`, `render_json_template.py`, templates, test helpers, or TypeScript utilities, record the exact source paths and commit listed above.
- Confirm contributor ownership for copied files from repository history.
- Add a repository-wide license or file-level license grant covering copied code before publishing Claudify.
- Add a concise provenance note distinguishing code adapted from Liff from the separately licensed/frozen `load-bearing` vocabulary snapshot.
- Preserve the `load-bearing` MIT notice for copied code or substantial data, independently of the Liff decision.
- Keep a machine-readable or documented provenance field on authored rules derived from external sources.

## Final Reuse Decision

| Candidate | Decision | Reason |
|---|---|---|
| Four-layer data/core/adapter architecture | Extract | Strong fit; no code ingestion required. |
| Generic JSON template generator and TypeScript escaping | Optional direct reuse after licensing | Useful and dependency-free at runtime, but requires provenance, a domain validator, and browser-specific output templates. |
| Strict TS compiler settings and immutable factories | Extract/reimplement | Valuable conventions; exact types and CommonJS target do not fit. |
| Shared JSON conformance fixtures and test seams | Extract | Directly supports deterministic rule and serializer testing. |
| `liff.json` and generated dictionaries | Reject | Third-party copyrighted content and irrelevant domain. |
| `Entry`/reference/outcome schema | Reject | Cannot express transformation rules or document nodes. |
| ASCII normalization | Reject | Destroys punctuation, Unicode distinctions, and source ranges. |
| Fuzzy/glob search and scoring | Reject | Spelling similarity is not semantic matching. |
| CLI adapter, launcher, and CommonJS build | Reject | Node-specific and not browser deployable. |
| Random chooser | Reject; reuse only the injected-seam lesson | Production nondeterminism conflicts with FR-5. |

No user-facing requirement needs to be added or removed as a result of this review. The material changes are implementation clarifications: budget new transformation primitives, add rule-schema validation, use a browser-native module target, and turn the existing licensing warning into a pre-publication action.
