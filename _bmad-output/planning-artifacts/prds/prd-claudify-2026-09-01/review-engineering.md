# Claudify PRD Engineering Review

**Reviewer stance:** skeptical senior TypeScript/browser text-processing engineer  
**Artifacts reviewed:** `prd.md`, `addendum.md`  
**Verdict:** **Feasible as a funny, curated browser gimmick; not feasible under the current universal semantic-preservation and verification claims.** A dependency-free implementation can convincingly transform a useful set of deliberately supported sentence shapes, especially with strong fixture coverage. It cannot know that it preserved modality, agency, causation, chronology, attribution, and discourse meaning in arbitrary English without the parser or language understanding that the PRD explicitly excludes. The project should keep the multi-pass design, but narrow its contract from “understand and safely rewrite ordinary English” to “perform aggressive, deterministic rewrites on allowlisted surface patterns, with conservative fallbacks and disclosed rhetorical distortion.”

The product is a one-off gimmick. The right engineering target is a small set of transformations that reliably lands the joke on a curated corpus—not a miniature, dependency-free NLP platform.

## Severity Summary

| Severity | Finding | Effect |
|---|---|---|
| **BLOCKER** | Universal semantic preservation and Pass 7 verification require unavailable language understanding | The stated acceptance contract cannot be implemented or tested honestly |
| **MAJOR** | Several required transformations inherently change meaning or require semantic classification | “Safe” rules will either misfire or become so narrow that density quotas fail |
| **MAJOR** | Eligibility language and transformation quotas are circular or untestable | FR-4/SM-2 can pass or fail at implementer discretion |
| **MAJOR** | Cross-browser determinism conflicts with native segmentation and evergreen support | Identical input can produce different nodes and rule matches |
| **MAJOR** | Clipboard and URL success requirements exceed what a static browser app controls | Supported-browser and privacy claims can fail despite correct app code |
| **MODERATE** | The internal document/range model and supported source syntax are underspecified | Protected spans, Markdown, offsets, and serializers will disagree at edges |
| **MINOR** | The proposed validation/provenance machinery is too elaborate for a one-off gimmick | Time is likely to be spent on infrastructure rather than joke quality |

## Findings

### 1. BLOCKER — The semantic-preservation contract contradicts the architecture

FR-3 requires transformations to preserve negation, agency, ownership, causation, chronology, modality, quantifiers, certainty, attribution strength, comparison direction, evaluation polarity, and change over time. Pass 7 then says to “verify” all of these properties. No verifier is specified, and a token stream plus authored sentence-shape recognizers cannot infer these properties for unrestricted English.

Examples that are superficially similar but semantically different include:

- “The patch **is a fix**” versus “Water **is a liquid**.” Replacing both with “serves as” changes the latter from classification to function.
- “The product **has a dashboard**” versus “The patient **has cancer**.” “Features” is comic marketing language in the first and a grotesque meaning shift in the second.
- “A caused B” versus “A is associated with B.” The latter deliberately weakens causation.
- “The result may improve” versus “The result improves.” A rewrite that loses the modal creates a stronger claim even if every noun and number survives.
- “Only Alice approved it,” “Alice only approved it,” and “Alice approved only it” contain the same tokens but different scope.

These are not rare edge cases that a denylist can close. They are the normal consequences of syntactic and semantic ambiguity. Fixtures can show that selected examples remain acceptable; they cannot prove that arbitrary input preserves those relations. “Protection is fail-safe” also does not solve this because the engine has no reliable way to recognize every ambiguous span.

**Required product decision:** choose one of these honest contracts:

1. **Recommended for this gimmick:** preserve literal anchors—protected strings, entity-looking tokens, numbers, explicit negation tokens, and source proposition order—while allowing obvious rhetorical/epistemic distortion as part of the parody. State that the output may change nuance and must not be treated as a faithful rewrite.
2. Preserve meaning only for a small, explicitly documented grammar of supported surface patterns and no-op elsewhere. This is safer but may struggle to achieve the intended maximal style on varied input.

Under either choice, remove the general Pass 7 semantic verifier. Replace it with rule-local preconditions, invariants that are actually machine-checkable, snapshot fixtures, and human review of a small adversarial corpus.

### 2. MAJOR — Some transformation families are semantically unsafe by design

The current addendum treats “derived from existing concepts” as equivalent to “does not add a claim.” It is not.

- “Serves as a testament to X” asserts evidential significance that the source may not assert.
- “Marks a pivotal moment” asserts importance and temporal framing.
- “Increasingly” introduces a time trend.
- “Arguably” weakens certainty.
- “Crucially” adds evaluation; “However” adds contrast; “Additionally” adds a discourse relationship.
- “Offers” can imply availability or benefit where “has” only states possession.
- A participial tail such as “—underscoring X” assigns rhetorical significance and can attach to the wrong subject.
- “Ventured into politics” adds agency, intention, domain, and often chronology beyond “was a candidate.”
- Replacing a direct relationship with “associated with” intentionally abstracts away agency or causation.

This conflicts directly with FR-3 even if every content word in the expansion appeared locally. The user explicitly wants hedging, abstraction, significance framing, and indirect constructions, so the strict preservation promise—not the joke—is the wrong constraint.

For a lean implementation:

- Limit copula elevation to allowlisted predicate heads such as `tool`, `example`, `component`, `platform`, `method`, and `challenge`; do not treat arbitrary `X is a Y` as safe.
- Limit `has` rewrites to allowlisted product/system subjects and feature-like direct objects. Remove “brings forward.”
- Restrict negative parallelism to explicit source coordinations (`both X and Y`, `X and Y`, or an accepted semicolon pair), not inferred “compatible propositions.”
- Restrict lists to colon/semicolon enumerations first. Comma enumeration detection without parsing should be an optional, fixture-proven enhancement.
- Treat transitions, significance framing, hedges, and indirect association as intentional rhetorical distortion with strict budgets—not semantic-preserving operations.
- Drop career/state expansion from MVP. It is domain-specific, high-risk, and low-value for the joke.
- Do not manufacture `-preserving`, `-verified`, `-tested`, or similar compounds unless the source explicitly asserts that property. “Derived morphemes” can still invent a proof claim.

### 3. MAJOR — The quotas and acceptance metrics use circular eligibility

Terms such as “suitable,” “compatible,” “licensed,” “high-confidence,” “low-risk,” “eligible,” and “passes every grammar and semantic guard” are repeatedly used as denominators without operational definitions. The engine author controls the guards, so “transform at least 70% of matches that pass every guard” is tautological: a matcher can simply decline every difficult case. Conversely, “negative parallelism appears once per 150 words when a paragraph contains two compatible source propositions” asks the engine to detect propositions and compatibility without a parser.

SM-2 has the same problem: every “suitable” fixture must trigger four classes, but suitability is not recorded independently of the result. FR-3 is also tested partly by absence of errors in “reviewed fixtures,” which cannot support the universal wording of the requirement.

Replace these with an explicit fixture eligibility matrix committed before implementation. Each fixture should declare:

- expected supported pattern IDs;
- allowed transformation classes;
- forbidden rule IDs or semantic boundaries;
- exact protected substrings;
- minimum and maximum counts only where the source contains a named surface pattern;
- a manually reviewed “acceptable parody” snapshot.

A reasonable gimmick-grade target is: all gold fixtures pass their declared expectations; all adversarial fixtures preserve anchors and either no-op or match an approved snapshot; four of five reviewers recognize the style. Do not set corpus-wide percentages until a frozen corpus and denominator exist.

### 4. MAJOR — Determinism is not defined tightly enough and the proposed seed is defective

`Intl.Segmenter` is locale-sensitive implementation behavior supplied by the browser/OS. Its output can vary across browser engines and versions. That conflicts with a frozen fixture suite and the claim that identical source produces an identical Transformed Document “within a deployed version,” especially while supporting the current stable versions of four engines. An evergreen browser baseline also moves while the deployment remains unchanged.

The suggested stable hash of `Source Text + Rule ID` does not avoid repetition: every occurrence handled by the same rule receives the same variant. Include a stable occurrence key such as original UTF-16 start offset plus an occurrence ordinal (and possibly paragraph/node ID) in variant selection.

Decide one of the following:

- Use a small bundled deterministic segmenter/tokenizer as the canonical path in every browser; or
- Scope determinism to a named browser engine/version and do not claim cross-browser byte-identical output.

For this project, a simple bundled segmenter is preferable. Define offsets as UTF-16 code-unit indices into the normalized input, record the original-to-normalized line-ending map if exact source ranges matter, and test emoji, combining marks, smart quotes, abbreviations, decimals, and CRLF input. “Use native when available, fallback otherwise” guarantees two behavior paths and doubles fixture obligations for little value.

### 5. MAJOR — Clipboard behavior and “share readiness” are partly outside app control

The dual-serializer decision is sound, but SM-4 overpromises that Rich and Markdown outputs “both copy successfully in each supported browser, with equivalent wording and structure.” Clipboard APIs depend on a secure context, a user gesture, permissions, OS integration, MIME support, and destination sanitization. LinkedIn or another editor may discard `text/html`, CSS classes, heading semantics, or bold formatting. Hacker News does not become a Markdown renderer merely because Markdown text was copied.

Specify the app-controlled behavior instead:

- Deployment must use HTTPS (or localhost during development).
- On a direct user gesture, attempt `navigator.clipboard.write()` with `text/html` and `text/plain` when `ClipboardItem` and HTML clipboard writes are available.
- Generate self-contained semantic HTML (`p`, `strong`, `ul`, `li`, `h2`) rather than relying on preview CSS classes in copied markup.
- Provide a `writeText()` fallback and clearly say that formatting was downgraded.
- Keep Markdown copy as literal Markdown through `writeText()`.
- Test that the app requests the intended MIME flavors and that its own plain-text/HTML serializations contain equivalent wording. Treat formatting preservation after paste into LinkedIn, HN, Word, etc. as a small manual compatibility matrix, not a universal requirement.
- Define a plain-text serializer explicitly. A DOM `textContent` fallback can collapse list and paragraph structure unless bullets and line breaks are generated deliberately.

The UI also needs a retryable copy failure state. Do not use a hidden `contenteditable`/selection fallback unless older/insecure contexts are genuinely in scope.

### 6. MAJOR — The URL adapter contains a privacy contradiction and needs bounded behavior

The privacy requirement says only an explicit Source URL load contacts “that URL’s origin.” The GitHub adapter maps web URLs to `api.github.com`, which is a different origin. The feature can still be privacy-respecting, but the wording is false. Say that URL loading may contact a documented first-party API origin derived from the submitted host, and identify GitHub as the only MVP adapter.

Other missing decisions:

- Set a response byte limit and an extraction character limit. The 10,000-character transform ceiling does not prevent downloading or parsing a very large HTML response first.
- Require a successful status and an allowlisted textual `Content-Type`; reject binary or unsupported JSON.
- Define redirect handling and whether the final origin is disclosed.
- Define GitHub object mappings and fields: PR/issue body, comment body, and possibly title. Pull-request review comments, issue comments, and discussion comments use different endpoints. Unauthenticated API rate limits and deleted/private objects require specific error messages.
- Plain `fetch` plus `article/main/body` selection is not reliably “readable text rather than navigation.” The `body` fallback is specifically likely to include cookie banners, menus, and footers. Recast the consequence as best-effort extraction with a preview the user can edit before transformation.
- Preserve paragraphs when extracting. `textContent` plus global whitespace collapse destroys structure and will reduce heading/list transformations.
- Clarify that cross-origin failures are expected before any response metadata is readable. The error cannot always distinguish CORS from DNS, TLS, blocking, or generic network failure.

For a one-off gimmick, the cleanest MVP is paste plus the GitHub adapter. Generic URL fetch adds a large test surface and will fail on many of the URLs the target audience first tries. If retained, it should be visibly experimental and always place extracted text into the editable Source Text field before Claudifying.

### 7. MODERATE — Protected spans are useful, but the category promises are too broad

Exact protection is tractable for fenced code, inline code, URLs, email addresses, Markdown link destinations, and well-defined number forms. It is not tractable in general for “quotations” or “confidently identified names” without defining a grammar or NER strategy.

- Apostrophes, contractions, nested quotation marks, curly quotes, unmatched quotes, quoted speech across paragraphs, and inch/foot marks complicate quotation matching.
- Capitalization alone cannot distinguish names from sentence-initial common words, headings, organizations, acronyms, products, and technical identifiers.
- A Markdown link contains both visible label and destination. Protecting the entire raw token prevents useful label transformation; protecting only the URL requires a Markdown-aware representation.
- Numbers include signs, decimals, thousands separators, percentages, currencies, dates, times, versions, ranges, units, ordinals, and scientific notation. Protecting the digits but detaching a unit or comparator can still change meaning.
- HTML pasted as plain text, existing Markdown headings/lists, escaped punctuation, and autolinks are not assigned a supported-input contract.

Define the source format as **plain text with a deliberately small Markdown subset** if code and Markdown links must be honored. Write a single scanner for that subset rather than a pile of overlapping regex replacements. Protect link destinations and code payloads structurally. Treat entity-looking capitalized runs as “avoid lexical replacement” hints, not guaranteed named-entity recognition. Make the testable promise about exact syntactic protected forms, not semantic categories such as all names and all quotations.

### 8. MODERATE — The Transformed Document needs source lineage and a clear rewrite representation

The proposed node vocabulary is a good start but insufficient for the stated validation and serializers. Important missing decisions include:

- whether whitespace is explicit text or regenerated by serializers;
- how hard paragraph breaks and source soft line breaks are represented;
- whether inline code and links are first-class nodes rather than generic protected runs;
- whether headings/list items retain source ranges;
- how one source range maps to multiple output nodes after list conversion;
- how inserted text is distinguished from transformed source text;
- how the ledger records rejected and shadowed rules, not only applied rules;
- how escaping is performed for Markdown text containing `*`, `_`, backticks, brackets, backslashes, or heading/list-leading punctuation;
- how copied HTML represents thematic breaks and heading levels;
- whether the Sign Tally counts a composite rewrite once or counts its emitted bold/em-dash subeffects separately.

Use immutable nodes with stable IDs, optional source spans, origin kinds (`source`, `replacement`, `insertion`), and typed inline nodes (`text`, `strong`, `code`, `link`, `protected`). Make rule application produce a new node or token sequence plus ledger entries; never mutate and then try to reconstruct offsets. Define tally counting rules before score weights so refactors do not silently alter the score.

### 9. MODERATE — Morphology and phrase matching are more work than the PRD acknowledges

Longest-match phrase mapping is reasonable, but part-of-speech guards and “grammatical inflection” are effectively a small morphology system. English surface forms are irregular and lexically ambiguous: `use`, `record`, `object`, `lead`, and `present` can change part of speech or pronunciation by context; `has/have/had`, auxiliaries, agreement, capitalization, and possessives need explicit handling.

Do not implement a generic inflector for a one-off gimmick. Store authored surface triggers and complete replacement templates for the tense/number forms actually supported. A rule should match token sequences with left/right boundary predicates and emit an audited string or token template. This is verbose data but highly predictable, easy to snapshot, and aligned with a frozen parody dictionary.

### 10. MINOR — Some proposed infrastructure is overengineering for the stakes

The following are valuable in a maintained language product but should not block this gimmick:

- a comprehensive build-time schema validator with every listed failure mode;
- repository-wide provenance on every manually authored phrase;
- duplicate-instance source-identity proofs after arbitrary structural rewriting;
- two independent segmentation implementations with shared conformance suites;
- an offline classifier oracle;
- a generic extension architecture for matcher kinds and adapters;
- automated proof of semantic invariants that cannot actually be observed.

Keep a small rule-data type, a duplicate-ID assertion, gold/adversarial fixtures, source comments for imported vocabulary, serializer tests, and a five-person joke test. That is enough rigor for the stated lifecycle.

## Recommended Lean Architecture

The following can plausibly ship without runtime dependencies and still feel much richer than keyword replacement:

1. **Input contract:** plain English text plus a small scanner-supported Markdown subset (fenced/inline code and links). Normalize CRLF while retaining deterministic UTF-16 source spans.
2. **Canonical scanner:** one bundled paragraph/sentence/token scanner used in all browsers. It emits typed protected tokens and retains original whitespace.
3. **Rule data:** curated exact surface forms and explicit replacement templates; no generic POS tagger or inflector. Rules have IDs, priorities, occurrence budgets, typed pattern kinds, and positive/negative fixtures.
4. **Safe-ish lexical pass:** longest exact token-phrase match on unprotected tokens, with capitalization transfer and occurrence-aware deterministic variant selection.
5. **Small syntactic pass:** only literal allowlisted shapes—safe predicate-head copulas, product-feature possession, explicit two-part coordination, and colon/semicolon enumerations.
6. **Parody pass:** budgeted insertions of bold, em dashes, extractive headings, emoji, transitions, hedges, and significance phrases. Document these as rhetoric-changing parody, not meaning-preserving translation.
7. **Typed document:** immutable block/inline AST with source lineage and origin metadata. Both HTML DOM rendering and Markdown/plain-text serialization consume this AST.
8. **Validation:** exact protected-form checks, no dropped source anchors, deterministic snapshots, valid node structure, safe DOM construction, correct tally ledger, serializer wording parity, and manually accepted adversarial fixtures.
9. **Source adapter:** paste first; GitHub URLs second. Generic fetch is optional/experimental, response-bounded, editable, and never promised to extract the main article correctly.
10. **Browser shell:** static ES module output, no network calls except explicit URL loading, HTTPS deployment, feature-detected clipboard, and clear downgrade/failure feedback.

This design will not transform every sentence. It can nevertheless produce convincing output by coordinating five visible layers on the sentence shapes it does support: cliché vocabulary, a handful of reliable rhetorical rewrites, excessive typography, document restructuring, and explainable scoring.

## Acceptance-Criteria Changes Required Before Implementation

1. Replace FR-3’s universal semantic guarantees with exact protected-form/anchor guarantees plus a disclaimer about rhetorical nuance, or define a closed supported grammar.
2. Remove automated Pass 7 verification of semantic properties the engine cannot observe.
3. Replace every `suitable`/`compatible` quota with a frozen fixture eligibility matrix and named pattern IDs.
4. Either use one canonical segmenter across browsers or weaken cross-browser determinism.
5. Include occurrence identity in deterministic variant seeding.
6. Define the supported input syntax and exact Protected Span grammar.
7. Define the AST’s whitespace, links, code, source lineage, insertion origin, and tally semantics.
8. Recast clipboard acceptance around MIME payloads the app emits, with destination formatting tested manually and not guaranteed.
9. Fix the GitHub privacy wording and bound URL response size/content types.
10. Prefer paste + GitHub adapter for MVP; treat arbitrary URL extraction as experimental or defer it.

With those changes, there is no technical blocker to building a good one-off Claudify. Without them, implementation can still be built, but it cannot truthfully pass the PRD as written.
