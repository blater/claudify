---
title: Claudify — load-bearing Source Reconciliation
status: complete
created: 2026-09-01
source_snapshot: louisabraham/load-bearing@936a1547b6c099757942cf7ad3d52339140835ad
reconciles:
  - prd.md
  - addendum.md
---

# Claudify — `load-bearing` Source Reconciliation

## 1. Scope and method

This document reconciles the user-supplied [load-bearing site](https://louisabraham.github.io/load-bearing/) and [repository](https://github.com/louisabraham/load-bearing/tree/main) against Claudify's [PRD](prd.md) and [transformation addendum](addendum.md). The repository was inspected at `936a1547b6c099757942cf7ad3d52339140835ad`; its generated analysis identifies itself as dated 2026-09-01.

The method is **extract, do not ingest**:

- extract product-relevant vocabulary families, implementation patterns, empirical signals, and constraints;
- do not copy the raw pull-request corpus, the full ranked vocabulary, the compressed classifier, or source code into Claudify by default;
- keep provenance separate between user-authored requirements, Wikipedia-derived AI-writing signs, manually authored Claudify rules, and empirically ranked `load-bearing` vocabulary;
- treat `load-bearing` as evidence about one GitHub pull-request writing cluster—not as a general-purpose thesaurus, grammar model, or proof of authorship.

Primary inspected assets:

- [`README.md`](https://github.com/louisabraham/load-bearing/blob/936a1547b6c099757942cf7ad3d52339140835ad/README.md)
- [`analysis.js`](https://github.com/louisabraham/load-bearing/blob/936a1547b6c099757942cf7ad3d52339140835ad/analysis.js)
- [`model.js`](https://github.com/louisabraham/load-bearing/blob/936a1547b6c099757942cf7ad3d52339140835ad/model.js)
- [`index.html`](https://github.com/louisabraham/load-bearing/blob/936a1547b6c099757942cf7ad3d52339140835ad/index.html)
- [`detector.html`](https://github.com/louisabraham/load-bearing/blob/936a1547b6c099757942cf7ad3d52339140835ad/detector.html)
- [`LICENSE`](https://github.com/louisabraham/load-bearing/blob/936a1547b6c099757942cf7ad3d52339140835ad/LICENSE)

## 2. Executive verdict

The PRD's core product thesis remains sound: `load-bearing` offers a valuable empirical vocabulary source, while convincing transformation still requires authored semantic, syntactic, structural, and formatting rules. The addendum is directionally correct that the source provides no synonym or syntax transformer.

Four material reconciliations are needed downstream:

1. **Correct the tone attributed to the source.** Its leading cluster is chiefly terse, forensic, adversarial, and proof-oriented. Several examples currently presented as `load-bearing` seed vocabulary are absent from its published top 1,000 words and should instead be labeled as manually authored or Wikipedia/user-derived AI clichés.
2. **Exploit its strongest omitted constructions.** The source strongly supports productive hyphenated compounds, physical load-path metaphors, proof/test language, understated intensifiers, and em-dash density. These are more distinctive than generic words such as “pivotal” or “leverage.”
3. **Recognize the full asset and browser pattern.** The repository includes not only a ranked word list but also a compact in-browser ten-cluster classifier, per-word evidence, a deterministic cross-language tokenizer contract, a narrow CORS-safe GitHub URL adapter, and real-browser regression tests. These patterns can inform Claudify without shipping the classifier.
4. **Tighten provenance and licensing.** The root MIT license requires its 2026 Louis Abraham copyright and permission notice with copied code or substantial portions. The raw corpus consists of third-party GitHub pull-request text and should not be copied. A small reviewed extraction is safer; a shipped ranked list or classifier asset should carry the MIT notice and explicit provenance.

## 3. Claim-by-claim reconciliation

| Topic | Current Claudify position | Source evidence | Reconciliation |
|---|---|---|---|
| Product role | `load-bearing` seeds vocabulary; Claudify authors synonym, grammar, syntax, expansion, and formatting rules. | The repository tokenizes unigrams, clusters descriptions, ranks words, and classifies text. It does not transform prose. | **Accurate.** Retain the boundary. Do not imply that its classifier or top-word list supplies semantic rewriting. |
| Source domain | The addendum speaks broadly of “Claude vocabulary.” | The corpus is sampled GitHub pull-request descriptions from 2025–2026, with bot/account filters and per-author caps. It is not LinkedIn, Hacker News comments, essays, or general Claude output. | **Underqualified.** Label extracted rules `github-pr/claude-cluster` and context-gate them. Do not use this source alone to define the LinkedIn mode. |
| Qualitative voice | The addendum emphasizes structural metaphors, understated certainty, operational verbs, governance vocabulary, and compositional modifiers. | The leading published list begins `plainly`, `quietly`, `nobody`, `halves`, `genuinely`, `survived`, `re-derived`, `handed`, `outright`, `nowhere`, `carries`, `owed`, `disagreed`, `rests`, `nothing`, `drew`, `deliberately`, `premise`, `ruling`, `rides`, `asserted`, `mutation-checked`, `load-bearing`, `asymmetry`. | **Partly accurate but too sanitized and too corporate.** The dominant tone is forensic, argumentative, concrete, and test/proof-heavy. Preserve that character as a technical/HN flavor. |
| Specific examples | The addendum attributes `spine`, `substrate`, `seam`, `lands`, `ships`, `holds`, `gates`, `invariant`, `verdict`, `harness`, `guard`, `best-effort`, `first-class`, `append-only`, and `in-flight` to useful source seed themes. | In the 2026-09-01 lead-cluster top 1,000: `holds` ranks 35, `seam` 168, `lands` 181, `verdict` 466, `ships` 510, `in-flight` 541, `invariant` 650, `spine` 759. `substrate`, `gates`, `harness`, `guard`, `best-effort`, `first-class`, and `append-only` are absent. | **Mixed provenance.** Keep supported items as ranked extracts. Relabel absent items as Claudify-authored vocabulary if desired; do not cite them as findings from this snapshot. |
| Generic AI clichés | The semantic map includes `pivotal`, `crucial`, `foundational`, `interplay`, `landscape`, `underscore`, `showcase`, `illuminate`, `leverage`, and `operationalize`. | None appears in the lead cluster's published top 1,000 in this snapshot. | **Not supported by this input.** They can remain because the user explicitly requested broader “signs of AI writing,” but their provenance is the user/Wikipedia/manual rule set, not `load-bearing`. |
| Em dash | Claudify must deliberately overuse em dashes. | `load-bearing` makes the em dash the sole punctuation token and reports growth from 0.2 appearances per 10,000 words in early 2024 to 123 in mid-2026. | **Strongly corroborated and underused as evidence.** Add an empirical fixture target for em-dash density, while maintaining readability and protected spans. |
| Hyphenated vocabulary | The addendum mentions compositional modifiers but has no explicit productive-compound rule class. | The tokenizer deliberately preserves hyphenated forms. High-ranked examples include `mutation-checked`, `byte-identical`, `mutation-verified`, `re-measured`, `unit-tested`, `root-caused`, `byte-exact`, `browser-verified`, `red-first`, and `unit-testable`. | **Material omission.** Add a guarded “compound manufacture” family that builds context-derived forms such as `payload-preserving`, `browser-native`, or `meaning-stable`, without changing facts. |
| Deterministic variety | Claudify uses a stable source/rule hash and frozen data. | The source seeds sampling by date, writes immutable daily files, serializes generated data, and uses exact tokenizer parity tests. Its cluster fit still has acknowledged seed sensitivity, and the published dataset changes daily. | **Directionally aligned.** Pin the commit and curated extraction. Do not fetch live `analysis.js`, and do not treat the current rank order as timeless. |
| Browser execution | The addendum calls out optional browser-side unigram scoring and dependency-free static implementation. | `detector.html` reconstructs a 20,000-word, ten-component model from a compressed 304 kB `model.js`, scores it wholly in the browser, and exposes exact per-word contributions. `index.html` and `detector.html` have no application build step. | **Underdescribed.** The browser pattern is proven and reusable conceptually. The classifier is unnecessary runtime weight for the MVP; use it only as an offline evaluation oracle if beneficial. |
| URL loading | Claudify attempts arbitrary public HTTP(S) retrieval with `fetch` and `DOMParser`. | The reference does not fetch arbitrary pages. It recognizes GitHub pull/issue/comment URLs, maps them to GitHub API endpoints that explicitly allow cross-origin browser requests, and handles 404, private, empty, 403/429, and the unauthenticated 60/hour limit. | **Important mismatch.** The source validates a specialized adapter, not generic article extraction. Add a GitHub adapter before the generic best-effort adapter; continue to make paste the reliable path. |
| Safety | Claudify requires safe DOM node construction and rich/Markdown serializers. | The reference safely puts loaded text in a textarea and escapes its own limited vocabulary before using `innerHTML`, but it does not render transformed rich user content. | **Claudify is correctly stricter.** Do not copy its string/`innerHTML` pattern into rich-output serialization. |
| Attribution/detection | Claudify explicitly rejects AI detection and model attribution. | The reference classifier says the cluster is “mostly PRs written by Claude” but offers no guarantee; it can only say text resembles the measured cluster, not who wrote it. Unknown words are dropped and short texts can be weak or unstable. | **Accurate and important.** Never expose its posterior as Claudify's Slop Score. If used in tests, name it “cluster resemblance” and keep it secondary to fidelity. |
| Runtime dependencies | Claudify must deploy with no runtime dependency. | The core pages need only bundled HTML plus generated JS data. The live site also references a domain-level analytics/counter script at `/assets/js/ph.js`; that counter is not required for core operation. | **Compatible with a caveat.** Reuse the core static pattern, not the analytics request. Bundle all Claudify assets locally. |

## 4. Product-relevant vocabulary and tone to extract

The source's lead cluster should not be reduced to a bag of fashionable nouns. Its recognizable voice comes from several interacting families.

### 4.1 Understated certainty and conversational emphasis

Representative extracts: `plainly`, `quietly`, `genuinely`, `deliberately`, `precisely`, `honestly`, `merely`, `legitimately`, `demonstrably`, `routinely`, `silently`.

Product use:

- authored adverb insertion at clause boundaries;
- careful position and punctuation variants: “Plainly, …”, “—quietly …”, “Genuinely, …”;
- density budgets so an adverb does not decorate every sentence;
- no claim-strengthening where “arguably” or “perhaps” would change certainty.

This family is closer to the source than the addendum's generic hedge list. It creates confident understatement rather than marketing hype.

### 4.2 Physical load-path and mechanical metaphors

Representative extracts: `load-bearing`, `carries`, `rests`, `holds`, `lever`, `ceiling`, `seam`, `backstop`, `chokepoint`, `ladder`, `grounds`, `wedged`, `folds`, `lands`, `gains legs`, `drives`, `settles`, `survives`.

Product use:

- map an already present dependency, boundary, constraint, transition, or responsibility to a compatible physical metaphor;
- require relationship guards: a seam requires two adjacent concepts, a backstop requires a failure/limit concept, and “carries” requires an existing responsibility or dependency;
- prefer small phrase templates over bare word swaps: “the seam between X and Y,” “X carries the Y contract,” “Y is the load-bearing part of X.”

These are semantic constructions, not interchangeable synonyms. Unguarded substitution would create nonsense.

### 4.3 Proof, measurement, and falsification language

Representative extracts: `re-derived`, `asserted`, `mutation-checked`, `provably`, `byte-identical`, `measured`, `refuted`, `unit-tested`, `checkable`, `root-caused`, `re-checked`, `empirically`, `goldens`, `falsified`, `contradicting`, `browser-verified`.

Product use:

- reserve for technical/HN content or a sentence already containing a test, measurement, comparison, invariant, or result;
- never manufacture a test, proof, benchmark, or verification event that the source did not contain;
- permit rhetorical recasting of an existing result: “the test confirms X” can become “X is now test-backed” or “the test makes X plainly checkable.”

This family is highly distinctive but also the most likely to fabricate evidence when used loosely.

### 4.4 Negation, refusal, and counterexample language

Representative extracts: `nobody`, `nowhere`, `nothing`, `worse`, `refusal`, `refused`, `disagreed`, `defect`, `vacuous`, `died`, `contradicted`, `neither`, `harmless`, `lie`.

Product use:

- use only where source negation, failure, conflict, or contrast already exists;
- combine with the user's required parallelism: “not merely X—but Y,” “X is not the guard; Y is”;
- preserve polarity exactly. This family cannot be used as generic filler.

This adversarial quality is a major part of the measured voice and is mostly absent from the current addendum's qualitative summary.

### 4.5 Productive hyphenated compounds

The source's tokenizer preserves hyphenated units precisely because they are informative. Claudify can reproduce the *construction pattern* without copying its list:

- `[existing noun]-preserving`
- `[existing noun]-aware`
- `[existing process]-backed`
- `[existing environment]-verified`
- `first-pass`, `end-to-end`, `mid-flight`, `fail-closed`, or similar only when semantically compatible

Each emitted compound must resolve both sides from the local source meaning or an approved style morpheme. This is a strong, cheap mechanism for making prose feel overengineered while remaining deterministic.

## 5. Available assets and recommended disposition

| Asset | What it actually contains | Potential Claudify use | MVP disposition |
|---|---|---|---|
| `analysis.js` | Generated summary, weekly trends, ten components, each component's ranked top 1,000 words, lift values, and per-word weekly series. About 521 kB in the inspected snapshot. | Curate a small lead-cluster shortlist with rank/lift evidence; optionally use lift as an offline prioritization signal. | **Extract a reviewed subset only.** Record commit, original rank, category, contexts, and exclusions. Do not ship the whole file. |
| `model.js` | Compressed vocabulary and ten cluster weight vectors; about 304 kB. | Offline before/after resemblance metric and per-token evidence during rule development. | **Do not ship in MVP.** It adds little user value, can be mistaken for detection, and overfits GitHub PR style. |
| `detector.html` | Dependency-free browser tokenizer, model decoder, multinomial scoring, evidence attribution, sample texts, narrow GitHub URL adapter, and clear failure states. | Architectural reference for deterministic pure functions, visible evidence, data-load failure, and GitHub API URL routing. | **Extract patterns, not code.** Reimplement only small concepts needed by Claudify. |
| `index.html` | Single-file responsive visualization with generated data loaded separately, keyboard/touch behavior, reduced-motion handling, and real-browser fixes documented in comments. | Static delivery and visual QA reference. | **Extract layout/testing lessons only.** Its dashboard design does not map directly to a text transformer. |
| Raw `data/days/*.jsonl` | Sampled third-party GitHub PR metadata and body text. | None required. | **Do not ingest, redistribute, or build fixtures from it.** Use Claudify-authored examples. |
| `tests/` | Real-browser regression suite; tokenizer parity checks compare browser and analysis implementations. | Model fixture discipline: every production bug becomes a regression; cross-implementation contracts are tested from shared strings. | **Adopt the testing pattern.** Claudify needs browser tests for rich clipboard, responsive layout, URL failures, and serializer parity. |

### Suggested extracted rule-data provenance

Every rule seeded from this source should carry fields such as:

```text
provenance.kind = "load-bearing-ranked-extract"
provenance.repository = "louisabraham/load-bearing"
provenance.commit = "936a1547b6c099757942cf7ad3d52339140835ad"
provenance.generated = "2026-09-01"
provenance.cluster = "lead/arriving"
provenance.rank = <published rank>
contexts = ["technical", "general", ...]
```

Manually authored cliches should use a different `provenance.kind`; this prevents later documentation from presenting product invention as corpus evidence.

## 6. Deterministic browser patterns worth adopting

### 6.1 Generated immutable data, bundled locally

The source keeps analysis offline and emits inert JavaScript data for a static page. Claudify can use the same separation:

- authored rule source as reviewable JSON/TypeScript;
- deterministic build-time validation and compilation;
- a bundled immutable rule snapshot loaded locally;
- no live fetch of changing vocabulary and no runtime package/CDN requirement.

Unlike `load-bearing`, Claudify's data is small enough that compression schemes and a separate dynamic script are probably unnecessary. Simplicity is preferable unless the measured bundle warrants compression.

### 6.2 One canonical tokenizer/segmenter contract

The source explicitly treats tokenizer drift as a correctness defect and checks the Python and browser implementations against identical strings. Claudify should similarly define one canonical contract for:

- protected-span scanning;
- sentence and token offsets;
- hyphens and em dashes;
- Markdown links, code, HTML-looking text, and URLs;
- normalization and serializer escaping.

Where only JavaScript/TypeScript is used, this becomes a shared core invoked by the UI, unit fixtures, and both serializers rather than duplicated implementations.

### 6.3 Evidence ledger, not opaque score

The detector decomposes its verdict into exact per-word contributions. Claudify already proposes an applied-rule ledger; this is the correct analogue. Keep the ledger as the source of truth for Sign Tally and score, and preserve source/output offsets so a developer can diagnose why each transformation fired.

### 6.4 Specialized URL adapters before generic fetch

The source succeeds with links by mapping recognized GitHub URLs to documented API endpoints that permit browser CORS. Claudify should dispatch in this order:

1. recognized GitHub pull/issue/comment URL → GitHub API adapter;
2. otherwise public HTTP(S) → generic `fetch`/`DOMParser` attempt;
3. on any CORS, authentication, rate-limit, non-text, or extraction failure → retain inputs and direct the user to paste.

This does not guarantee LinkedIn or Hacker News extraction. It merely turns a common technical-audience URL family into a genuinely supported browser-only path. If implementation effort is tightly capped, GitHub plus paste provides a more honest MVP than broad URL claims.

### 6.5 Real-browser regression tests

The reference's “every test is a bug it once had” approach is especially relevant to a static browser gimmick. Claudify should add regression cases for:

- deterministic output and rule overlap;
- paste and specialized URL loading;
- rich clipboard MIME types plus fallback;
- safe rendering of hostile HTML-looking input;
- phone widths, keyboard-only use, and reduced motion;
- data/rule snapshot load failure;
- Markdown/rich structure equivalence.

Tests may depend on development tooling; “no runtime dependencies” should not prohibit test-only dependencies that are absent from the deployed artifact.

## 7. Licensing and provenance

The repository root carries the MIT License, copyright © 2026 Louis Abraham. Its operative reuse condition is that the copyright and permission notice must accompany copies or substantial portions of the software.

Recommended handling:

- **Ideas and tiny manual extracts:** document the source and commit in Claudify's acknowledgements/rule provenance. A handful of ordinary words and general design ideas need not justify importing the full source asset.
- **Copied code or a substantial generated vocabulary/model asset:** include the complete upstream MIT notice in the distributed artifact or notices file, preserve the copyright line, and record the exact commit.
- **Raw corpus:** do not copy it. The repository has one root MIT license, but the corpus contains pull-request prose written by many third parties and no separate data-license explanation was found. Claudify has no product need for that legal/provenance ambiguity.
- **Derived curated rules:** author fresh templates, guards, examples, and counterexamples. Cite source ranks as evidence where used; do not imply the source authored Claudify's transformations.
- **Live source:** do not consume it at runtime. The analysis and ranks change as the daily corpus changes, which conflicts with Claudify's deterministic fixture contract.

The current addendum's instruction to retain the MIT notice when copying code or substantial data is directionally correct; it should be made concrete with the upstream copyright, commit pin, and a no-raw-corpus rule.

## 8. Limitations that must remain visible

1. **Domain limitation:** GitHub PR prose is a strong fit for Hacker News-adjacent technical parody and a weak fit for generic LinkedIn marketing copy.
2. **Unigram limitation:** the analysis retains no n-grams and generally strips punctuation except the em dash. It cannot evidence synonym relationships, clause templates, bold, headings, lists, emoji, or grammatical transformations.
3. **Cluster limitation:** the measured “arriving” cluster is an unsupervised grouping with acknowledged seed sensitivity. It is associated with Claude-written PRs, not labeled ground truth.
4. **Classifier limitation:** posterior-looking numbers express fit to these ten components under the model. They do not identify authorship; out-of-vocabulary words are ignored, and short inputs contain little evidence.
5. **Temporal limitation:** the repository updates daily, and ranks can move. Any product rule set needs an immutable snapshot and reviewed changelog.
6. **Semantic-fidelity limitation:** high-ranked negative and proof-oriented words can alter claims if injected blindly. Context guards and protected facts take priority over increasing resemblance.
7. **Formatting limitation:** the source empirically supports the em dash but says nothing about bold, vertical lists, headings, emoji, copula elevation, or marketing verbs. Those remain separate user/Wikipedia-driven requirements.
8. **URL limitation:** the reference's successful browser retrieval is API-specific. Generic article extraction remains subject to CORS, bot defenses, client-side rendering, authentication, and paywalls.
9. **Runtime-dependency nuance:** the live site includes an optional analytics/counter script. Claudify should omit it to uphold its stricter no-runtime-dependency and privacy promise.

## 9. Recommended downstream decisions

The PRD and addendum should remain frozen for this reconciliation task, but implementation and any later revision should apply these decisions:

1. Create a small, reviewed `load-bearing` extract—roughly dozens, not thousands, of entries—organized by the five families in §4.
2. Add provenance to rule data and remove or relabel source attribution for words absent from the pinned top 1,000.
3. Add guarded productive hyphenated-compound rules as a distinct transformation family.
4. Treat em-dash density as an empirically supported signature and fixture metric, not merely a formatting joke.
5. Add a GitHub URL adapter based on recognized URL shapes and public API endpoints before generic fetch.
6. Keep any upstream classifier out of the user-facing MVP. If used at all, run it only in development as a secondary technical-fixture diagnostic.
7. Do not optimize transformed output solely for classifier resemblance; parody recognition and factual fidelity remain the acceptance criteria.
8. Include an upstream notice if substantial code/data is copied; otherwise publish acknowledgement and exact commit provenance for the curated extraction.

## 10. Acceptance impact

No existing Functional Requirement must be removed. The reconciliation sharpens how they should be implemented:

- **FR-3 / payload preservation:** proof and negation vocabulary requires especially strict source-evidence guards.
- **FR-4 / multiple classes:** add productive compound formation within lexical/syntactic transformations and distinguish technical/HN from broad LinkedIn vocabulary.
- **FR-5 / reproducibility:** pin the source commit and compiled extract, never live data.
- **FR-8 / explain applied signs:** provenance and applied-rule categories should be inspectable, while classifier resemblance remains absent from the user-facing score.
- **FR-2 / URL loading:** specialized GitHub routing improves a high-value subset without weakening the paste fallback or CORS disclaimer.

Overall: `load-bearing` is most useful as a **ranked, empirical flavor layer and an engineering reference**. It is not the transformation engine, and its distinctive forensic voice should complement—not replace—the intentionally exaggerated LinkedIn/AI-writing clichés supplied by the user and the separate signs-of-AI source.
