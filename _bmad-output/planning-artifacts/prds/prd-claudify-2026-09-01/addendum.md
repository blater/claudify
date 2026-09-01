# Claudify PRD Addendum: Transformation Engineering Contract

## Purpose

This addendum establishes how a dependency-free browser implementation can create a convincing content transformation rather than a keyword-replacement toy. The core design, V1 boundaries, pipeline, execution, scoring, URL, clipboard, and verification sections are normative. Source reuse, rejected alternatives, and sources are advisory. The behavioral contract in `prd.md` wins if the documents conflict.

## 1. Core Design Decision

The Transformation Engine should compile Source Text into a structured Transformed Document and serialize that single representation into Rich Output and Markdown Output. A flat sequence of regex replacements cannot reliably coordinate grammar, paragraph structure, lists, bold ranges, or copy formats.

The Transformed Document needs only a small set of node types:

- document
- heading with level and optional emoji
- paragraph
- list with ordered/unordered kind
- list item with optional inline header
- text run with plain/bold style
- protected run

Every applied Transformation Rule records a ledger entry with rule ID, category, source range or node, and emitted node or text. The Sign Tally and Slop Score derive from this ledger instead of reanalyzing the output.

The Transformation Engine targets the PRD’s Comic Distortion Envelope. Reduced clarity, rhetorical drift, and mild grammatical strain are intentional. Each sentence normally receives at most one grammar rewrite and one expansion rewrite before typography, and the full Transformed Document stays at or below 2.25 times the Source Text word count. These guardrails prevent random or incomprehensible output; the qualitative smoke test remains the authority on whether the result is usefully worse and funny.

## 2. V1 Mechanism Boundaries

V1 does not interpret arbitrary English. It applies prevalidated, deterministic transformations and records what fired. It does not ship a parser, part-of-speech tagger, embeddings, readability model, semantic-similarity model, or runtime clarity classifier.

V1 may use only these mechanism families:

- finite phrase maps with longest-match selection and small authored inflection tables;
- conservative token and punctuation patterns for explicitly supported sentence shapes;
- nominalization and circumlocution templates such as direct verb → “serve to facilitate” or concrete relation → allowlisted association phrase;
- deterministic stacking of hedges, qualifications, parenthetical clauses, and source-derived significance language;
- external-oracle-visible pivots, filler phrases, marketing clichés, transition clusters, synonym cycling, and superficial `-ing` or outcome tails;
- detection of explicit conjunctions, colons, semicolons, and parallel comma lists;
- structured heading, list, bold, em-dash, and emoji transformations;
- per-rule, per-sentence, and per-paragraph density budgets.

No runtime component decides whether an output is less clear. The gold fixtures and paired human clarity ratings validate that these simple mechanisms reliably reduce clarity without collapsing source recognizability.

## 3. Ordered Transformation Pipeline

### Pass 1: Protect and Segment

1. Normalize line endings without normalizing punctuation or case.
2. Identify Protected Spans before rewriting: fenced and inline code, URLs, email addresses, Markdown links, quoted passages, numbers, and high-confidence names.
3. Use one bundled, conservative tokenizer contract to segment paragraphs and sentences consistently across supported browsers. Native `Intl.Segmenter` must not affect Transformation Engine output because its boundaries can vary by browser and Unicode version.
4. Tokenize words and punctuation while retaining original offsets and whitespace.

Protection is fail-safe: when a span is ambiguous, preserve it and reduce the joke locally rather than mutate the payload.

### Pass 2: Phrase-Level Semantic Mapping

Match longer phrases before shorter ones within curated concept groups; do not use fuzzy spelling similarity. A concept group contains explicit triggers and context-compatible cliché variants, for example:

- importance → pivotal, crucial, load-bearing, foundational
- use → leverage, harness, operationalize
- show → underscore, showcase, illuminate
- improve → enhance, elevate, unlock
- problem → challenge, friction point, evolving constraint
- error → meaningful correctness gap, correctness-alignment gap, behavior-level discrepancy
- task → disjoint implementation slice, bounded execution unit, independently actionable workstream
- connection → interplay, broader landscape, connective tissue

Rules define part-of-speech or sentence-shape guards, inflection behavior, priority, and allowed variants. “Any synonym” means broad authored trigger coverage within supported concept groups—not an unbounded claim of semantic understanding.

### Pass 3: Grammar-Gated Sentence Rewriting

Run authored sentence-shape recognizers over tokens. Each recognizer either returns a valid rewrite plan or does nothing.

Required recognizers:

- **Copula elevation:** safe noun-phrase constructions such as “X is a Y” can become “X serves as a Y,” “X represents a Y,” or “X stands as a Y.” Do not touch progressive verbs, passives, adjective predicates, identity-sensitive statements, or equations.
- **Possession elevation:** compatible “X has Y” constructions can become “X features Y,” “X offers Y,” or “X brings forward Y.” Preserve tense and agreement.
- **Career/state expansion:** narrowly matched biographical states such as “X was a candidate” may become “X ventured into politics as a candidate.” Never apply a domain-specific expansion without its domain cue.
- **Negative parallelism:** explicit two-part coordination can become “not only X, but also Y”; contrast can become “not merely X—it is Y.” Both parts must already exist in source meaning.
- **Rule of three:** three already-present attributes, actions, or propositions can become a triadic construction. Never manufacture a third item.
- **Indirect association:** compatible low-risk relations can become “is closely associated with” or “operates in connection with” only for pre-audited, allowlisted sentence shapes. A supporting denylist prevents rewrites of agency and causal verbs such as owns, caused, created, killed, employed, and authored.
- **Clause inflation:** a subordinate or parenthetical clause may be separated with an em dash or recast as a participial tail when subject reference remains unambiguous.
- **Controlled awkwardness:** eligible sentences may receive stacked modifiers, strained parallelism, redundant qualification, nominalization, or deliberately overloaded clause structure. Do not add random misspellings or destroy basic word order.

### Pass 4: Context-Derived Expansion

Add stylistic material only from nouns, verbs, or propositions already present in the local sentence or paragraph.

- transitions: “Additionally,” “Crucially,” “However,” “Against this evolving backdrop”
- hedges: “in many respects,” “particularly,” “increasingly,” “arguably,” but only when emphasis, temporal change, or weakened certainty is licensed by Source Text
- empty pivots and filler: “It’s worth noting that,” “A key consideration is,” “in order to,” “due to the fact that”
- participial tails: “—underscoring [existing concept]” or “—highlighting the interplay between [existing X] and [existing Y]”
- outcome tails: “, raising questions about [existing topic]” or “, paving the way for [existing action]”
- significance framing: “serves as a testament to [existing concept]” or “marks a pivotal moment in [existing process]”

Never invent expert claims, awards, public recognition, citations, future initiatives, knowledge limitations, or a third factual item merely to complete a rhetorical pattern.

### Pass 5: Structural Rewriting

Restructure content only when the Source Text supports the change:

- A colon or semicolon followed by three or more parallel items may become a vertical list.
- A sentence containing three comma-delimited parallel phrases may become a list only when a conservative parallel-item detector accepts every item.
- List items may receive short bold inline headers derived from their first meaningful noun or verb; no new factual label is invented.
- Multi-paragraph input may receive a redundant title-case heading, extractive “X and Y” section headings, valid over-sectioning, and thematic breaks derived from existing topic words.
- A heading may be followed by a short extractive echo line before the substantive paragraph.
- Two or more sentences in one paragraph may receive sentence-start transitions; repeated source referents may cycle through a fixed synonym cluster to make reference tracking worse.
- Decorative emoji may appear on occasional headings or inline headers; it should not appear on every item.
- Generated headings maintain valid hierarchy; do not skip levels or emit multiple level-one headings.

### Pass 6: Typography and Parody Density

Apply typography after wording and structure stabilize:

- Prefer spaced em dashes for eligible parentheses, asides, appositives, or high-confidence clause boundaries.
- Bold transformed cliché phrases, inline list headers, and selected significance phrases at a deliberately excessive but readable density.
- Where eligible, ensure at least one paragraph contains two em dashes and target at least two bold spans per 100 Source Text words; Comic Distortion Envelope guards take precedence over quotas.
- Normalize output punctuation consistently without altering Protected Spans.
- Enforce per-paragraph budgets so every available punctuation mark does not become an em dash and every word does not become bold.

Coordinate the passes to exaggerate the style without allowing any one pass to make the output incomprehensible.

Output should be less clear than Source Text. Deterministic proxies—longer relation phrases, more qualifications, increased nominalization, interrupted clause flow, and a nonzero controlled-awkwardness tally—support this goal, but paired human clarity ratings decide acceptance.

### Pass 7: Validate and Serialize

Before display, the engine performs structural and protected-payload checks. It does not attempt runtime proof of semantic equivalence:

1. Verify each Protected Span instance, identified by source range, is mapped exactly once and unchanged; duplicate literal values remain valid.
2. Confirm that no rule violated a protected range or any applicable high-risk guard during rewriting.
3. Reject malformed document nodes or overlapping style ranges.
4. Serialize Rich Output through DOM node creation—not `innerHTML` interpolation.
5. Serialize Markdown Output from the same Transformed Document.
6. Produce the Sign Tally and Slop Score from the applied-rule ledger.

## 4. Deterministic Variety

### Stable Variant Selection

Use a stable hash of the rule-data version, Source Text, Transformation Rule ID, original source range, and occurrence index to seed variant selection. The result remains reproducible while allowing separate occurrences to choose different variants. Rule priority and consumed ranges prevent accidental cascades. A rule may transform previously generated content only if it is configured for a named second-stage category.

### Rule Schema and Validation

Suggested Transformation Rule fields:

- stable ID and category
- trigger phrases or sentence-shape matcher
- compatible parts of speech or context guards
- replacement template variants
- inflection behavior
- priority and overlap policy
- density or per-paragraph budget
- examples and counterexamples
- provenance kind, source commit/snapshot, and source rank where externally derived

A build-time rule validator must reject duplicate IDs, unknown matcher kinds, empty triggers or variants, invalid priorities or density budgets, unsafe templates, unresolved fixture references, and malformed provenance. Deterministic generation alone does not validate the rule set.

### Eligibility Accounting

Every matcher exposes eligibility separately from rewrite selection. A frozen fixture eligibility matrix records which source ranges are eligible for which Transformation Rules. Saturation percentages are assertions over this matrix—not subjective judgments made after seeing output.

## 5. Slop Score

The Slop Score should be a transparent, weighted measure of applied transformations relative to eligible source patterns, capped at 100. Weight multi-layer changes more than repeated vocabulary swaps. For example, a sentence rewrite, genuine list conversion, or context-derived tail should contribute more than another adjective substitution.

The interface should describe the score as comedic “Claudeification intensity.” It must never resemble an AI probability or detector verdict.

## 6. URL Adapter

The Source URL adapter first maps recognized GitHub pull-request, issue, and comment URLs to CORS-enabled GitHub API endpoints and discloses that it routes those requests to `api.github.com`. Other URLs can use browser `fetch`, `DOMParser`, and conservative content selection from `article`, `main`, or `body`. It should remove scripts, styles, and navigation-like elements, then collapse whitespace before returning Source Text.

This remains best-effort. Browser CORS rules, authentication, paywalls, and bot controls make arbitrary URL support impossible without a server or third-party proxy. LinkedIn pages should be expected to fail. The failure state must direct the visitor to paste the Source Text while retaining the submitted URL for reference.

## 7. Dual Output and Clipboard

Rich Output and Markdown Output are serializers, not separately transformed strings.

- Rich Output renders safe DOM nodes and may copy both `text/html` and `text/plain` MIME types through `ClipboardItem` where supported; Claudify cannot guarantee how LinkedIn or another destination will sanitize pasted formatting.
- Markdown Output shows and copies literal Markdown.
- A browser-compatible fallback copies plain text and reports that formatting was removed.
- Output tabs or a segmented control switch between representations without rerunning the Transformation Engine.

## 8. Rule Data and Source Reuse

### load-bearing

The [load-bearing repository](https://github.com/louisabraham/load-bearing) provides a ranked vocabulary asset, a compact ten-cluster browser classifier, per-word evidence, and a narrow GitHub URL adapter, but no synonym, grammar, or syntax transformation. Claudify pins commit [`936a1547b6c099757942cf7ad3d52339140835ad`](https://github.com/louisabraham/load-bearing/tree/936a1547b6c099757942cf7ad3d52339140835ad), generated 2026-09-01. The classifier may serve as an offline evaluation oracle but should not ship in the MVP. If code or substantial data is copied, retain its [MIT license](https://github.com/louisabraham/load-bearing/blob/main/LICENSE) copyright and permission notice; do not ingest its third-party raw pull-request corpus.

The measured voice is forensic, argumentative, proof-heavy, and mechanically metaphorical—not generic marketing copy. Supported seed themes include understated certainty (`plainly`, `quietly`, `genuinely`, `deliberately`), load-path metaphors (`load-bearing`, `carries`, `holds`, `seam`, `spine`), proof language (`asserted`, `mutation-checked`, `byte-identical`, `unit-tested`, `browser-verified`), and productive hyphenated compounds. Technical or proof claims must be context-gated so Claudify never fabricates a test or measurement. Generic clichés such as `pivotal`, `landscape`, `interplay`, and `leverage` remain user/Wikipedia/manual rules rather than load-bearing findings.

A guarded compound-manufacture rule family may derive forms such as `payload-preserving`, `browser-native`, or `meaning-stable` from existing local concepts and approved morphemes.

### Liff

The user-owned `/Users/blater/src/liff` codebase demonstrates a useful shape: authoritative dictionary data, generated immutable TypeScript, strict immutable modeling, shared conformance fixtures, and a core/adapter boundary. Its TypeScript targets Node/CommonJS rather than the browser, and its production random-selection path uses `Math.random()`; Claudify therefore needs a new browser/ES-module target and its own stable hash. Reuse the architecture concept and, if worthwhile, small pure utilities only after a recorded license and provenance decision.

Do not reuse Liff’s dictionary content, generic `Entry {word, definition, references}` schema, punctuation-stripping tokenizer, or all-candidate fuzzy search. Claudify needs transformation-specific rules, exact phrase maps, retained punctuation, context guards, priorities, and deterministic variant selection. Because the Liff repository lacks a clear repository-wide license, copied code should receive an explicit provenance/license decision before public release.

### SlopTrim

Use SlopTrim commit [`4daf5ba58be10683bdbfe9125634aef02d17caa9`](https://github.com/seyedehsanhadi/sloptrim/tree/4daf5ba58be10683bdbfe9125634aef02d17caa9) as a development-only External Slop Oracle over Markdown Output. Do not ship its Python detector or redefine Claudify’s Slop Score as its score. If the detector or substantial phrase banks are vendored, preserve the Apache-2.0 license, upstream NOTICE, copyright attribution, pinned revision, and modification notices.

## 9. Verification Strategy

Maintain a frozen fixture corpus covering:

- ordinary LinkedIn-style professional prose
- technical Hacker News prose
- biographical sentences and copulas
- explicit two- and three-part coordination
- comma, semicolon, and colon enumerations
- negation, agency, ownership, causation, and chronology
- names, numbers, URLs, email addresses, quotations, Markdown links, inline code, and fenced code
- malformed or highly punctuated input
- empty, short, and 10,000-character inputs

Each Transformation Rule needs positive examples, counterexamples, expected eligibility ranges, and an expected ledger entry. Snapshot tests compare both Rich Output structure and Markdown Output. Regression fixtures exercise Protected Span identity, high-risk relationship guards, deliberate clarity loss, deterministic output, serializer equivalence, valid heading hierarchy, no executable markup, and accurate Sign Tally counts. Shared boundary fixtures verify the canonical bundled segmenter/tokenizer across all supported browsers.

### External Slop Oracle Lane

Run the pinned SlopTrim detector against Markdown Output in development or CI only. Rule fixtures assert exact expected family IDs. Eligible 120–300 word composition fixtures assert at least 15 detected families, including 10 score-bearing families, plus a minimum “heavy tells” band. Exact scores remain loose because the score is secondary to family diversity and changes when the oracle pin changes.

Preferred V1 SlopTrim families are `1, 2, 3, 5, 6, 8, 10, 16–25, 27, 31–33, 35–38, 42, 51, 54, 56–59, 69`, selected only when their source-shape guard passes. Report-only families still count as desirable surface tells but not toward the 10 score-bearing-family minimum.

Maintain separate heading-rich and no-heading list fixtures because some SlopTrim structural families conflict. Assert that forbidden families `47, 48, 50, 62–68, 71` remain absent; these cover chatbot artifacts, cutoff disclaimers, invisible or confusable characters, placeholders, citation/tool leaks, tracking parameters, malformed whitespace, and degenerate repetition. A Claudify ledger entry may trigger several SlopTrim families, so the two ledgers need not map one-to-one.

## 10. Rejected Shortcuts

- **Keyword replacement alone:** misses syntax, rhetoric, document structure, and formatting; the result reads like a thesaurus prank rather than convincing AI prose.
- **Unbounded regex cascades:** destroy grammar and repeatedly rewrite generated text.
- **Full NLP library or embedded language model:** adds weight and Runtime Dependencies disproportionate to a one-off gimmick.
- **Remote LLM:** violates determinism, privacy, cost, and no-server constraints.
- **Third-party URL proxy:** expands URL coverage by violating the architecture and privacy promise.
- **Fuzzy matching every token:** confuses spelling similarity with semantic synonymy and creates accidental rewrites.

## 11. Sources

- [load-bearing site](https://louisabraham.github.io/load-bearing/)
- [load-bearing source repository](https://github.com/louisabraham/load-bearing)
- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) — descriptive guidance, not an AI-detection standard
- [SlopTrim patterns](https://github.com/seyedehsanhadi/sloptrim/blob/4daf5ba58be10683bdbfe9125634aef02d17caa9/references/patterns.md)
- [SlopTrim detector](https://github.com/seyedehsanhadi/sloptrim/blob/4daf5ba58be10683bdbfe9125634aef02d17caa9/scripts/detect.py)
- [MDN: Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
