---
title: Claudify PRD
status: final
created: 2026-09-01
updated: 2026-09-01
---

# PRD: Claudify

## 1. Vision

Claudify turns ordinary English prose into an exaggerated parody of conspicuously AI-written “Claude language.” A visitor pastes Source Text—or attempts to load a Source URL—and receives recognizably over-engineered prose packed with Claude clichés, hedging, abstractions, marketing verbs, em dashes, bold flourishes, vertical lists, occasional emoji, and “not just X, but Y” constructions.

The product thesis is that the joke only lands when the Transformation Engine changes several layers at once. Vocabulary substitution is necessary but insufficient: Claudify must also reshape supported sentence constructions, restructure clauses and lists, inflate significance without inventing facts, and render conspicuous formatting. The result should preserve protected factual payload while making its style unmistakably synthetic; it is parody, not a semantics-certified rewrite.

Claudify is a low-stakes, shareable artifact for LinkedIn-saturated professionals and technically self-aware Hacker News readers. It is not an AI detector, writing assistant, or hosted generative-AI service. It runs entirely in the browser with no server component or Runtime Dependency.

This PRD guides the downstream implementation workflow through user-visible capabilities and stable Functional Requirement IDs. The normative engineering contract and advisory source-reuse decisions live in [addendum.md](addendum.md).

## 2. Target User

### 2.1 Jobs To Be Done

- Turn a familiar passage into an immediately recognizable AI-writing parody.
- Produce a result that looks funny in a LinkedIn-style presentation and remains usable as Markdown in technical communities or editors.
- Understand which clichés and structural signs were applied without mistaking the result for an authorship judgment.
- Copy the joke with one action and no account, configuration, or learning curve.

### 2.2 Non-Users

- People seeking accurate AI-authorship detection or plagiarism analysis.
- People seeking high-fidelity rewriting, summarization, translation between natural languages, or accessibility remediation.
- Publishers requiring reliable extraction from arbitrary authenticated, paywalled, or cross-origin URLs.

### 2.3 Key User Journey

- **UJ-1. Maya turns sober prose into a shareable parody.** Maya, a developer who sees formulaic AI prose on LinkedIn and Hacker News, makes a single anonymous visit to Claudify with no saved state. She pastes a paragraph and activates Claudify. She compares the Source Text with an aggressively transformed preview, sees the Sign Tally, switches between Rich Output and Markdown Output, and copies the format appropriate for where she wants to share it. If she instead supplies a Source URL that the browser cannot retrieve, Claudify explains the limitation and directs her back to paste without losing entered content.

## 3. Glossary

- **Source Text** — English prose supplied directly by the visitor or extracted from a Source URL.
- **Source URL** — A public HTTP(S) location Claudify attempts to retrieve from the browser; success depends on the destination’s cross-origin policy.
- **Transformation Engine** — The deterministic, browser-side system that converts Source Text into a structured Transformed Document.
- **Transformation Rule** — A bounded lexical, syntactic, structural, expansion, or formatting operation with explicit matching constraints.
- **Protected Span** — Source content that must survive unchanged, including URLs, email addresses, code, Markdown links, quotations, numbers, and confidently identified names.
- **Transformed Document** — The shared structured representation from which Rich Output and Markdown Output are produced.
- **Rich Output** — Rendered, styled content suitable for rich-text copying and a LinkedIn-like preview.
- **Markdown Output** — Plain Markdown serialization of the same Transformed Document.
- **Sign Tally** — Counts of applied Transformation Rules grouped by recognizable AI-writing sign.
- **Slop Score** — A playful transformation-intensity score derived from the Sign Tally; never an AI-authorship probability.
- **Runtime Dependency** — Third-party code, remote service, model, package, or server required after the static application is deployed.
- **Comic Distortion Envelope** — The desired band in which the output is substantially less clear, more indirect, and slightly less grammatical than the Source Text while its topic and concrete anchors remain recognizable; output beyond this band feels random or incomprehensible rather than funny.
- **External Slop Oracle** — A pinned third-party detector used only during development to measure which recognizable AI-writing pattern families appear in Markdown Output.

## 4. Features

### 4.1 Frictionless Source Input

**Description:** The visitor can paste Source Text reliably or attempt best-effort Source URL loading without signing in.

#### FR-1: Accept Source Text

The visitor can enter, replace, and clear Source Text and can load a bundled example.

**Consequences (testable):**

- The interface accepts multiline prose and preserves paragraph boundaries.
- The Claudify action is unavailable when Source Text is empty or whitespace-only.
- A bundled example demonstrates the intended result without a network request.

#### FR-2: Attempt Source URL Loading

The visitor can submit a valid public HTTP(S) Source URL and receive extracted Source Text when the browser is permitted to retrieve it.

**Consequences (testable):**

- When recognizable content containers exist, successful retrieval extracts readable text instead of navigation, scripts, or raw markup.
- A malformed Source URL—or one whose content is blocked, authenticated, non-text, or unavailable—produces a concise explanation and a paste fallback.
- The interface never promises that LinkedIn or arbitrary article URLs will load.
- No proxy, server-side fetch, credential collection, or cross-origin bypass is used.

### 4.2 Convincing Multi-Layer Transformation

**Description:** Coordinated Transformation Rules operate across vocabulary, sentence shape, document structure, stylistic expansion, and formatting; the addendum defines their technical contract.

#### FR-3: Maintain the Comic Distortion Envelope

The Transformation Engine deliberately reduces clarity and distorts nuance, emphasis, certainty, rhetorical force, and grammatical polish while keeping the source topic and concrete anchors recognizable. Output that is clearer than the Source Text fails this requirement.

**Consequences (testable):**

- URLs, email addresses, code, Markdown links, quotations, and numbers round-trip exactly in the fixture suite.
- A Transformation Rule that cannot satisfy its grammar or context guard leaves the affected source construction unchanged.
- Fixtures cover high-risk negation, agency, ownership, causation, chronology, modality, and quantities as regression guardrails—not as proof of general semantic equivalence.
- Repeated identical Protected Spans are tracked by source identity and range; every instance survives unchanged without requiring its literal value to be unique.
- Unless a fixture explicitly approves the composition, no sentence receives more than one grammar rewrite and one expansion rewrite before the typography pass.
- Excluding Markdown markers, the Transformed Document does not exceed 2.25 times the Source Text word count.
- Controlled awkwardness may include modifier stacking, strained parallelism, redundant qualification, nominalization, or overloaded clause structure; random spelling errors and unparseable word order are excluded.
- The Transformation Engine does not estimate clarity or semantic similarity at runtime; paired human review determines whether fixture outputs satisfy the Comic Distortion Envelope.

#### FR-4: Apply Phrase-Level Semantic Inflation

The Transformation Engine applies curated concept groups with longest-phrase matching and inflection-aware variants.

**Consequences (testable):**

- Lexical rules use curated synonym groups and longest-phrase matching, with grammatical inflection where required.
- Generic marketing and AI clichés remain distinguishable from vocabulary derived from the pinned load-bearing snapshot.
- Context-gated hyphenated compounds can be derived from concepts already present in Source Text.
- V1 uses finite authored phrase maps and simple token-pattern guards; unsupported phrases remain unchanged by this requirement.

#### FR-5: Apply Grammar-Gated Sentence Rewrites

The Transformation Engine rewrites explicitly supported sentence shapes to exhibit recognizable AI-writing constructions.

**Consequences (testable):**

- Syntactic rules can replace allowlisted copula and possession patterns, create parallel “not … but” forms, and introduce indirect association only when named token-pattern guards match.
- At least 70% of copula and possession ranges pre-annotated as eligible in the frozen gold fixtures are transformed.
- Negative parallelism appears at least once per 150 Source Text words when a named coordination pattern identifies two source propositions, capped at two instances per paragraph.
- Indirect-association wording applies to at least half of explicitly allowlisted low-risk relation shapes; denylisting alone is insufficient.

#### FR-6: Expand, Restructure, and Format

The Transformation Engine adds source-derived stylistic expansion, document choreography, and conspicuous formatting.

**Consequences (testable):**

- Expansion rules derive hedges, participial tails, transitions, and significance framing from concepts already present in the local sentence or paragraph.
- Obfuscation rules replace direct relationships with longer abstractions, defer key points, stack qualifications, and introduce controlled awkwardness so output is less clear than Source Text.
- Structural rules can turn genuine parallel enumerations into vertical lists with bold inline headers and can use triadic rhetoric only when three source-backed items already exist.
- Multi-paragraph Source Text can receive extractive title-case headings, “X and Y” headings, valid over-sectioning, and thematic breaks without creating unsupported topics or invalid heading levels.
- Formatting rules deliberately overuse em dashes and bold text while applying emoji only to occasional headings or list labels. Suitable prose contains at least one paragraph with two em dashes and at least two bold spans per 100 words, subject to the Comic Distortion Envelope.

#### FR-7: Coordinate Transformation Density

The Transformation Engine resolves overlapping Transformation Rules and meets parody-density targets against a frozen gold fixture manifest.

**Consequences (testable):**

- Source Text of at least 100 ordinary prose words receives lexical inflation, at least two sentence-shape rewrites, and at least four distinct transformation classes when suitable matches exist.
- The expected eligibility ranges are authored by humans and frozen before engine execution; the engine cannot self-declare fixtures ineligible.
- Saturation targets are calculated only against that version-controlled eligibility matrix.
- Competing Transformation Rules have explicit priority and do not recursively rewrite generated text unless they are configured for a named second-stage category.

#### FR-8: Produce Reproducible Variety

The same Source Text produces the same Transformed Document within a deployed version while varying the phrase used across repeated matches of the same concept.

**Consequences (testable):**

- Variant selection is deterministic for identical Source Text and rule data.
- The application exposes one intentionally extreme Claudify action rather than an intensity control.

### 4.3 Dual Output and Explainable Joke

**Description:** Rich Output and Markdown Output are equivalent representations of one Transformed Document, with dedicated inspection, copy, and applied-sign feedback.

#### FR-9: Render Rich Output and Markdown Output

The visitor can switch between Rich Output and Markdown Output while retaining identical wording and document structure.

**Consequences (testable):**

- Headings, paragraphs, lists, inline bold, emoji, and em dashes map consistently across the two outputs.
- Rich Output is shown in a compact LinkedIn-like preview.
- Generated output is displayed safely and cannot execute HTML or scripts.

#### FR-10: Copy Either Output

The visitor can copy Rich Output or Markdown Output with a dedicated action and sees visible confirmation or an error.

**Consequences (testable):**

- Copying Rich Output provides styled clipboard content where supported and a faithful plain-text fallback.
- Markdown copy supplies the literal Markdown serialization.
- Copying does not include interface chrome, the Sign Tally, or hidden markup.

#### FR-11: Explain Applied Signs

The visitor can see a Sign Tally and Slop Score for the current Transformed Document.

**Consequences (testable):**

- The Sign Tally reports actual applied-rule counts, including, at a minimum, lexical clichés, hedges, copula avoidance, indirect association, negative parallelism, rule-of-three constructions, significance framing, controlled awkwardness, headings and thematic breaks, em dashes, bold spans, lists, and emoji.
- The Slop Score is labeled as comedic transformation intensity, not detection confidence.
- No authorship, plagiarism, truthfulness, or model-identification claim appears.

#### FR-12: Trigger Sensible External Slop Signals

Gold fixture Markdown Output deliberately triggers a broad set of recognizable AI-writing families in the pinned External Slop Oracle without shipping the oracle to visitors.

**Consequences (testable):**

- Each Transformation Rule fixture records the exact expected External Slop Oracle family IDs alongside the Claudify ledger entry.
- Eligible 120–300 word composition fixtures trigger at least 15 distinct detected families, including at least 10 score-bearing families, and reach the oracle’s “heavy tells” band or higher.
- The 15-family threshold applies to designed composition fixtures, not arbitrary user input whose sentence shapes may not match enough V1 rules.
- Exact family assertions are strict; aggregate score assertions use only a minimum band because upstream scoring may change when the pinned revision changes.
- Fixtures use separate structural modes where oracle signals conflict, including heading-rich output versus no-heading mid-essay list injection.
- Fixtures forbid fake authorities or facts, chatbot residue, knowledge-cutoff disclaimers, placeholders, citation or tracking leaks, invisible or confusable characters, nonstandard whitespace, Protected Span mutation, and degenerate repetition.
- External Slop Oracle results are development evidence, not AI-authorship or model-attribution claims.

## 5. Cross-Cutting Non-Functional Requirements

- **Architecture:** The deployed application is static browser-side JavaScript produced from JavaScript or TypeScript, with no server component and no Runtime Dependency.
- **Privacy:** Pasted Source Text remains in the browser. An explicit Source URL load contacts either that URL’s origin or a disclosed documented API origin used by a specialized adapter, such as `api.github.com`.
- **Safety:** Rendering uses safe DOM construction; untrusted source content is never interpolated as executable HTML.
- **Performance:** On a 2020 M1 MacBook Air running current stable Chrome, after three warm-up runs, the bundled 10,000-character fixture completes with p95 under 200 ms across 20 measured runs.
- **Responsive UI:** The core flow works at 360 CSS pixels and above; source and result may be side-by-side on wide screens and stacked on narrow screens.
- **Accessibility:** Input, actions, output mode, status feedback, and copied-state feedback are keyboard-operable and programmatically labeled; color is not the sole status signal.
- **Compatibility:** Current stable Chrome, Firefox, Safari, and Edge are the supported browser baseline.
- **Determinism:** One canonical bundled segmentation/tokenization contract, the frozen Transformation Rule dataset, and occurrence-stable variant selection make output reproducible across supported browsers and builds.
- **External verification:** SlopTrim commit `4daf5ba58be10683bdbfe9125634aef02d17caa9` runs only in development or CI against Markdown Output; no SlopTrim code or Python runtime ships in the browser.

## 6. Aesthetic and Tone

- The interface is dry, confident, and visually compact; the transformed content carries the excess.
- The Rich Output resembles a LinkedIn post enough to frame the joke but does not impersonate a real person or reproduce LinkedIn trademarks beyond nominative explanatory copy.
- Controls use plain language. Decorative emoji belongs in generated output and may appear sparingly in the interface.
- The product openly identifies itself as parody and does not suggest its style signs prove AI authorship.

## 7. Non-Goals

- Generative AI, remote inference, embeddings, or full natural-language understanding.
- Guaranteed retrieval from arbitrary, authenticated, paywalled, or cross-origin Source URLs.
- AI detection, authorship attribution, factual verification, summarization, or grammar correction.
- Accounts, saved history, collaboration, analytics, monetization, localization, browser extensions, or a public API.
- Perfect rewriting of every English sentence shape; guarded no-op behavior is preferred to meaning-changing output.
- Runtime parsing, part-of-speech tagging, semantic similarity scoring, readability scoring, embeddings, or any other NLP model.
- Shipping SlopTrim, Python, or any External Slop Oracle in the production browser bundle.
- Reproducing or redistributing copyrighted dictionary content from Liff.

## 8. MVP Scope

### 8.1 In Scope

- One static English-language page with paste, example, and best-effort Source URL input.
- A deterministic multi-pass Transformation Engine backed by curated phrase maps, narrow token-pattern recognizers, authored templates, document transformations, and density budgets.
- Protected Span handling and Comic Distortion Envelope guardrails.
- Rich Output, Markdown Output, dedicated copy actions, Sign Tally, and Slop Score.
- A responsive LinkedIn-like preview and a fixture-driven regression suite.

### 8.2 Out of Scope for MVP

- Intensity presets or custom rule controls; one maximal Claudify style is the product thesis.
- Server-assisted URL extraction; it violates the architecture constraint.
- Social posting integrations and image export; native copy and screenshots are enough for a one-off gimmick.
- Continuously updating “load-bearing” vocabulary; the MVP freezes a reviewed snapshot for reproducibility.

## 9. Success Metrics

**Primary**

- **SM-1: Parody recognition** — At least four of five target-audience reviewers independently describe representative output as recognizably AI/Claude-like and intentionally funny. Validates FR-4 through FR-12.
- **SM-2: Deliberate obscurity** — Across each representative source/output pair, the median reviewer rates Claudify’s output at least one point less clear than the Source Text on a five-point scale; any output rated clearer than its source fails. Validates FR-3 through FR-7.
- **SM-3: Source recognizability** — At least four of five target-audience reviewers identify the same subject and concrete anchors while judging the output strained but followable rather than random or incomprehensible. Validates FR-3 through FR-7.
- **SM-4: Multi-layer coverage** — Every eligible 100–500 word gold fixture triggers at least four transformation classes, and the Sign Tally exactly matches the applied-rule ledger. Validates FR-4 through FR-7 and FR-11.
- **SM-5: External slop coverage** — Every eligible 120–300 word composition fixture triggers at least 15 External Slop Oracle families, including 10 score-bearing families, and reaches the “heavy tells” band without a forbidden family. Validates FR-4 through FR-8 and FR-12.

**Secondary**

- **SM-6: Payload fidelity** — Protected Span fixtures round-trip without changes, and no reviewed fixture introduces a new named entity, number, quotation, attribution, or event. Validates FR-3.
- **SM-7: Share readiness** — Each supported browser places equivalent Rich Output and Markdown Output payloads on the clipboard where its clipboard APIs permit; fallback behavior is verified. Formatting after paste into third-party destinations is not guaranteed. Validates FR-9, FR-10.

**Counter-metrics**

- **SM-C1: Slop Score maximization** — Do not increase the Slop Score or External Slop Oracle score by destroying source recognizability, fabricating facts or list items, or making every sentence identical. Counterbalances SM-3 through SM-5.
- **SM-C2: URL success rate** — Do not add a proxy or Runtime Dependency merely to increase Source URL coverage. Counterbalances FR-2.
- **SM-C3: Clarity and polish** — Do not make output clearer or perfectly polished merely to maximize readability or semantic similarity. Counterbalances SM-2 and SM-6.
