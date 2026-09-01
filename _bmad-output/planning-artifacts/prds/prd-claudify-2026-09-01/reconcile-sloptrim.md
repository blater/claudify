---
title: Claudify / SlopTrim Reconciliation
status: decision-ready research
created: 2026-09-01
source_revision: 4daf5ba58be10683bdbfe9125634aef02d17caa9
---

# Claudify / SlopTrim Reconciliation

## Executive decision

Use SlopTrim as a **pinned development oracle**, not as a browser runtime and not as Claudify's product score. Claudify can deliberately and sensibly trigger roughly two dozen SlopTrim families on a suitable ordinary passage through deterministic, source-integrated transformations. It should not chase all 71. Nine catalogue entries have no detector, twelve detected families deliberately cannot affect the score, several families conflict with one another, and the highest-weight “decisive” artifacts are largely unsafe or irrelevant to a parody translator.

The strongest V1 target is a coordinated set of lexical clusters, marketing clichés, copula avoidance, hedge stacks, superficial `-ing` tails, negative parallelism, filler pivots, source-derived significance and outcome tails, cataloguing lead-ins, transition clusters, synonym cycling, inline-header lists, bold, emoji, em dashes, title-case headings, and occasional decorative rules. These all fit the existing dependency-free transformation architecture.

A local probe against the pinned detector produced **24 flagged families and a score of 74 (“heavy tells”) from 206 words** without hidden characters, fake citations, placeholders, tracking parameters, or broken Markdown. That is evidence that broad detector coverage is feasible without malicious artifacts. The exact score is not a product requirement: the family ledger and comedy review remain primary.

## Sources and revision

This reconciliation inspected SlopTrim `main` at commit [`4daf5ba58be10683bdbfe9125634aef02d17caa9`](https://github.com/seyedehsanhadi/sloptrim/tree/4daf5ba58be10683bdbfe9125634aef02d17caa9), committed 2026-08-18, rather than relying only on the prose catalogue.

Primary sources:

- [Pattern catalogue at the pinned revision](https://github.com/seyedehsanhadi/sloptrim/blob/4daf5ba58be10683bdbfe9125634aef02d17caa9/references/patterns.md)
- [Actual detector at the pinned revision](https://github.com/seyedehsanhadi/sloptrim/blob/4daf5ba58be10683bdbfe9125634aef02d17caa9/scripts/detect.py)
- [Skill contract and detector index](https://github.com/seyedehsanhadi/sloptrim/blob/4daf5ba58be10683bdbfe9125634aef02d17caa9/SKILL.md)
- [README and CLI description](https://github.com/seyedehsanhadi/sloptrim/blob/4daf5ba58be10683bdbfe9125634aef02d17caa9/README.md)
- [Catalogue contract tests](https://github.com/seyedehsanhadi/sloptrim/blob/4daf5ba58be10683bdbfe9125634aef02d17caa9/tests/test_catalogue.py)
- [Apache-2.0 license](https://github.com/seyedehsanhadi/sloptrim/blob/4daf5ba58be10683bdbfe9125634aef02d17caa9/LICENSE.txt) and [NOTICE](https://github.com/seyedehsanhadi/sloptrim/blob/4daf5ba58be10683bdbfe9125634aef02d17caa9/NOTICE)

The inspected README identifies version `0.9.2`. Because its era-variable vocabulary is intended to change, the commit pin is part of the fixture contract.

## What SlopTrim actually measures

### Coverage truth

- The catalogue contains **71 numbered families**.
- **62 families have some machine detector**.
- The nine reading-only families are exactly **7, 9, 28, 29, 43, 45, 49, 52, and 53**.
- Of the 62 detected families, **50 can affect the score** and **12 are advice/report-only**.
- The twelve report-only families are **4, 19, 22, 41, 42, 46, 54, 55, 58, 60, 61, and 68**. Family 17 is mixed: negative parallelism is report-only, while its narrow tailing-negation detector can score.
- A detector hit describes the output's surface patterns. It does not establish AI authorship, Claude authorship, or semantic quality.

### Score mechanics relevant to Claudify

- Bands are `clean` at 0–20, `light tells` at 21–40, `mixed` at 41–60, `heavy tells` at 61–80, and `pervasive tells` above 80.
- Text below 40 words has `none` confidence; below 120 words is normally `low`; 120–299 words can be `moderate`; 300 or more can be `high` when enough independent families fire.
- The scoring denominator is never below 120 words, so stuffing a 20-word joke with one cliché does not efficiently raise the score.
- Family diversity matters more than repeating one tell. Ordinary, strong, soft, and decisive families receive different diversity weights; raw counts are capped at five per detector key.
- AI vocabulary is handled separately as a density term. Its displayed detector fires on any match, but the score term begins only above **12 matches per 1,000 effective words**, then caps at 26 points.
- Rhythm contributes continuously: sentence-length CV below 0.45 can contribute up to 10 points, paragraph-length CV below 0.4 up to 8, and very uniform paragraph readability another 3, with an 18-point rhythm cap.
- One decisive family can floor a sufficiently supported score at 45; two distinct decisive families floor it at 65. Claudify should not exploit this because the decisive families are mostly leaked machinery, hostile characters, or chatbot residue.
- For short text, two content families can floor the score at 25 and three at 45. For 400+ words, five scored families floor it at 25 and six at 45.

## Full catalogue reconciliation

Legend: **normal**, **strong**, **soft**, and **decisive** can affect SlopTrim's score; **report** is detected but scores zero; **manual** has no detector. “Include” means a deterministic rule is appropriate when its source-shape guard passes; it does not mean every output must carry it.

| # | Documented pattern | Actual detector / threshold | Score | Claudify V1 decision |
|---:|---|---|---|---|
| 1 | AI vocabulary | Any word/inflection in a fixed regex is reported. The score uses density above 12/1,000 effective words. The actual regex is much shorter than the catalogue's full Pangram lists. | separate density | **Include.** Use several distinct, grammatically inflected terms per 100–150 words. |
| 2 | Model-dialect vocabulary | At least two combined Claude/GPT dialect hits anywhere. Claude terms include `genuinely`, `fascinating`, `nuanced`, `thoughtfully`, `refreshingly`, `quietly powerful/profound/radical`, and related forms. | soft | **Include.** Prefer the Claude cluster; two or three per passage is enough. |
| 3 | Promotional language | Any closed promotional phrase fires. A second detector under the same family requires at least three sentences beginning with allowlisted imperative CTA verbs. | normal | **Include promotional phrasing.** CTA triplets are optional because they can feel like an ad detached from the source. |
| 4 | Hyphenated cliché overuse | Any allowlisted cliché such as `mission-critical`, `best-in-class`, `future-proof`, or `end-to-end`. | report | **Include sparingly.** Manufacture only context-compatible compounds; protect technical compounds. |
| 5 | “Simple yet X” | Any allowlisted phrase such as `simple yet powerful/effective/elegant/transformative`. | strong | **Include** when the source calls something simple, direct, small, or useful. |
| 6 | Stacked adjective chains | A short comma/conjunction chain of at least four adjective candidates before a noun, with suffix or AI-adjective evidence. | normal | **Include.** Derive one noun and stack generic qualifiers around it. |
| 7 | Rule of three overuse | No detector. The catalogue calls only generic single-word descriptor triads suspicious. | manual | **Include as comedy**, but never manufacture a third factual item. Generic adjectives can provide the third beat. |
| 8 | Synonym cycling | Three or more distinct terms from one of eight fixed clusters anywhere in the document. It does not actually verify consecutive sentences or coreference. | normal | **Include.** Cycle the same source referent through `tool/system/platform/solution`, `company/firm/organization`, etc. |
| 9 | Generic AI character names | No detector; fiction-only reading judgment. | manual | **Exclude.** Renaming or inventing people violates protected-name behavior. |
| 10 | Significance inflation | Closed forms such as `serves as a testament`, `marks a turning point`, `sets the stage for`, or `plays a pivotal role`. | normal | **Include.** Attach to a source topic or action without inventing an event. |
| 11 | Notability name-dropping | Multi-outlet credit lists, follower counts, `active social media presence`, `independent coverage`, or `widely covered`. | normal | **Preserve-only.** May inflate existing source-backed coverage, but never invent outlets, followers, or acclaim. |
| 12 | Vague attributions | Closed phrases such as `experts argue`, `studies suggest`, and `it is widely believed`. | normal | **Exclude injection.** Creating an authority changes attribution; preserve or restyle only if present in source. |
| 13 | Article title as proper noun | Narrow `The List/Guide/Overview of X is a/an/the…` regex. | decisive | **Exclude.** It is easy to force but usually creates a fake document referent and an inauthentic decisive floor. |
| 14 | Ecosystem padding | Closed ecological/conservation claims such as `plays a vital role in its ecosystem`. | normal | **Exclude injection.** It fabricates domain claims unless the source already supports them. |
| 15 | False ranges | Only two narrow forms: dawn/humble/inception to modern/future/mighty, or humble to mighty/towering/grand/sprawling. | normal | **Include opportunistically.** Use two source-backed concepts as rhetorical poles; do not add new facts. |
| 16 | Superficial `-ing` tails | A comma followed by an allowlisted participle such as `highlighting`, `underscoring`, `showcasing`, or `reflecting`. | strong | **Core include.** Repackage existing local concepts into one or two tails per passage. |
| 17 | Negative parallelism and tailing negation | `not only…but`, `it's not just…`, and `it doesn't just…` are report-only. A comma plus one of `no guessing/waste/wasted motion/hassle/fluff/stress/jargon` scores normally. | mixed | **Core include.** Prefer source-backed negative parallelism; add a narrow tailing negation only where it remains locally plausible. |
| 18 | “Not X, just Y” | Narrow `No X, just Y` and `isn't just X—it's Y` shapes. | strong | **Core include.** Reshape an existing contrast or pair of propositions. |
| 19 | Filler phrases | Actual code covers only a small set including `in order to`, `due to the fact that`, `at this point in time`, `in the event that`, `has the ability to`, and note/mention phrases. It does not implement most examples in the catalogue section. | report | **Include.** Expand direct relations and infinitives with exact detectable fillers. |
| 20 | Empty pivot phrases | Exact phrases such as `It's worth noting that`, `It bears mentioning that`, and `A key consideration is`. | strong | **Core include.** Prefix a source proposition, capped to avoid canned repetition. |
| 21 | Outcome speculation tails | Exact comma tails including `raising questions about`, `with broader implications for`, and `paving the way for`. | strong | **Core include.** The object must be a source topic; the vague implication may distort emphasis, which supports the joke. |
| 22 | Persuasive authority tropes | Exact phrases including `here's the thing`, `at its core`, `the bottom line is`, and `what really matters`. | report | **Include sparingly.** Integrate as a clause pivot rather than a standalone canned sentence. |
| 23 | Editorial interjections | Exact `it is important to remember/note…`, `one must note that`, and similar forms. | soft | **Include.** One source proposition can be delayed behind an editorial frame. |
| 24 | Self-thoroughness phrases | Exact `this comprehensive guide/overview/analysis`, `this in-depth analysis`, etc. | strong | **Include for medium/long input.** Frame the output or source passage as an analysis without adding a substantive claim. |
| 25 | Question-answer rhetoric | Auxiliary-led question of 2–40 characters followed by a one-word answer such as `Yes.`, `No.`, or `Absolutely.` | normal | **Include once** when the source supports the polarity. |
| 26 | “Concrete evidence” defense | A few exact phrases about concrete evidence/examples/proof. | normal | **Exclude by default.** Use only when the source itself discusses proof or accusation. |
| 27 | Compulsive intro hooks | Exact hooks including `In today's … world/landscape`, `In a world where`, `In an era of`, and several question/news hooks. | strong | **Core include.** Derive the modifier/topic from the first paragraph. |
| 28 | Meandering intro | No detector; semantic reading only. | manual | **Include structurally** for multi-paragraph input: stage-set with abstract paraphrases before reaching the source's first concrete claim. |
| 29 | Prompt echo | No detector and Claudify receives source text, not a prompt. | manual | **Exclude as a detector target.** An extractive topic echo may still be a comic heading. |
| 30 | Diff-anchored writing | Narrow update/version/change phrases that presume a prior state. | strong | **Include only when source contains an actual change, release, before/after, or improvement.** Otherwise it fabricates history. |
| 31 | Signposting and announcements | Actual regex is narrower than the catalogue: `let's dive/delve/explore`, `let's break this down`, `here's what you need to know`, `without further ado`, etc. | normal | **Include.** Integrate before a source-backed explanation or enumeration. |
| 32 | Cataloguing lead-ins | One detector matches use/employ/rely/utilize + vague quantity + noun; another matches `These … provide/offer… information/insight…`. Both share one family for diversity. | normal | **Core include.** Convert an existing enumeration into a vague lead-in plus pivot. |
| 33 | Inline-header vertical lists | Markdown list lines with `**Header:**` or `**Header**:`. Each line can count. | normal | **Core include.** Derive each label from its own source clause; also triggers boldface. |
| 34 | Mid-essay bullet injection | At least one all-bullet paragraph and at least two prose paragraphs, but **only when the document has no Markdown headings**. | normal | **Include in a no-heading structural variant.** It conflicts with generated Markdown headings, so test it separately. |
| 35 | Fragmented headers | Markdown heading followed by a short non-list echo line: next prose ≤12 words, under 8 words for the hit, and sharing a heading word. | normal | **Include.** Deliberately echo an extractive heading before the actual paragraph. |
| 36 | Formulaic challenges sections | Closed phrases such as `despite these challenges`, `continues to thrive`, or `faces several challenges`. | normal | **Include when the source contains any limitation/problem.** Do not invent a positive outcome. |
| 37 | Transition clusters | Two or more sentence-start transitions in one paragraph. Code also recognizes `Notably`, beyond the catalogue's stated list. | soft | **Core include.** Deterministically prefix multiple sentences in the same paragraph. |
| 38 | Compulsive conclusion phrases | A conclusion word at a line/paragraph start: `In conclusion`, `Overall`, `Ultimately`, etc. | normal | **Include.** Repeat or abstract source material in a redundant closing paragraph. |
| 39 | Generic positive conclusions | Closed bright-future and `well-positioned` phrases. | normal | **Source-gated.** Use only where the source already expresses a positive outlook; otherwise it adds a stance. |
| 40 | Sentence-length monotony | At least three sentences and sentence word-count CV below 0.35. The score's rhythm term starts below 0.45 even before the flag. | normal/rhythm | **Stretch target.** A deterministic padding pass can equalize lengths, but comedy and recognizability outrank the threshold. |
| 41 | Mechanical sentence alternation | At least six sentences, successive length-difference sign flips ≥0.85, and length CV ≥0.25. | report | **Fixture-only alternative.** It conflicts with monotony and is not worth forcing in normal output. |
| 42 | Opener repetition | Within one paragraph, at least three sentences share the same first two words. | report | **Include.** Repeat a source referent as the opener rather than using pronouns. |
| 43 | Avoidance of fragments/run-ons | No detector; reading judgment about overly perfect grammar. | manual | **Do not target.** The product explicitly permits controlled fragments, strained parallelism, and slight grammatical damage. |
| 44 | Uniform paragraph length | At least four paragraphs with paragraph word-count CV below 0.4. | normal/rhythm | **Include for long input only.** Template paragraph budgets can create suspicious uniformity without changing facts. |
| 45 | Identical paragraph structure | No detector; semantic/template judgment. | manual | **Stretch include** for longer documents using repeated claim → elaboration → significance-tail templates. |
| 46 | Semicolon/parenthesis underuse | Checked only at 500+ words; fires with zero semicolons and fewer than two matched parenthetical pairs. | report | **Do not optimize.** Em-dash substitution may make it occur naturally in long output. |
| 47 | Chatbot artifacts | Any of a closed set such as `I hope this helps`, `Would you like me to`, or `happy to help`. | decisive | **Exclude injection.** These are canned conversation residue, not integrated transformation. |
| 48 | Sycophantic/servile tone | Exact praise such as `great question` or `you're absolutely right`. | decisive | **Exclude injection.** It addresses an absent user and would feel random. |
| 49 | RLHF/helpful-assistant register | No detector; reading judgment for both-sidesing and tutor framing. | manual | **Include only when the source already supplies two sides.** Balance them excessively without creating a new position. |
| 50 | Knowledge-cutoff disclaimers | Exact disclaimers such as `based on available information` and `as of my knowledge cutoff`. | decisive | **Exclude injection.** It is canned and can misrepresent source certainty or currency. |
| 51 | Copula avoidance | Any `serves/stands/functions/acts as`, `represents a/the`, `marks a/the`, `boasts`, `features …`, `offers a`, or `refers to`. | normal | **Core include.** This directly matches the product brief. |
| 52 | Passive voice and subjectless fragments | No family detector. Passive ratio is only a metric. | manual | **Source-gated include.** A supported source negation can become `No X needed`; do not drop an actor from factual causation. |
| 53 | Two-way passive-voice drift | No detector; passive ratio metric requires genre judgment. | manual | **Exclude as a target.** Claudify has no genre model and gains little comedy from optimizing a raw ratio. |
| 54 | Hedge stacking | Two or more fixed hedges in one sentence. | report | **Core include.** Stack two to four hedges around a source proposition, accepting deliberate loss of force. |
| 55 | Contraction absence | Opinion mode requires first-person terms ≥2% of words; then >70% of contractable/contraction forms must remain uncontracted. | report | **Exclude optimization.** Do not inject first person or rewrite contractions only to satisfy a report-only threshold. |
| 56 | Boldface overuse | Any Markdown `**…**` span of 1–60 non-newline characters is reported and scored; no density threshold exists. | normal | **Core include.** Multiple short bold spans and inline headers are easy and requested. |
| 57 | Emojis | Any recognized emoji codepoint. | soft | **Include occasionally** in headings/list labels. One is enough to flag; avoid every-line decoration. |
| 58 | Em-dash overuse | Two or more em dashes in the same paragraph. | report | **Core include.** Current PRD target of one per 100 words may not fire; ensure at least one eligible paragraph has two. |
| 59 | Title case headings | Markdown heading with at least three words, at least two major words, all major words capitalized, and not all uppercase. | normal | **Include.** Derive a three-plus-word heading from source terms. |
| 60 | Curly quotation marks | Any curly quote. | report/style-only | **Exclude deliberate conversion.** Quotations are Protected Spans; preserve curly marks only when present. |
| 61 | Hyphen for en dash | Actual detector only recognizes plausible ascending four-digit year ranges between 1500 and 2999, under 500 years apart. | report/style-only | **Exclude deliberate conversion.** It mutates protected numbers/punctuation and adds no joke. |
| 62 | Invisible/zero-width characters | Unicode-category/context detector for meaningless control/default-ignorable characters. | decisive | **Hard exclude.** This is hostile, inaccessible, and invisible rather than humorous. |
| 63 | Placeholder/Mad-Libs text | Bracketed/brace placeholders, all-caps slots, repeated `x`, or `lorem ipsum`. | decisive | **Hard exclude injection.** Preserve placeholders from source exactly. |
| 64 | Chatbot reference-markup leak | Internal citation/tool tokens such as `citeturn`, `oai_citation`, `contentReference`, `navlist`, or special citation brackets. | decisive | **Hard exclude.** Fake leakage is deceptive and breaks source/citation integrity. |
| 65 | AI tracking parameters | Exact chat-product `utm_source` values in URLs. | decisive | **Hard exclude.** Never modify protected URLs or add tracking. |
| 66 | Mixed-script homoglyphs | Mixed ASCII/non-Latin confusables inside a token. | decisive | **Hard exclude.** It is deceptive, harms accessibility/search, and is unrelated to prose parody. |
| 67 | Non-standard spaces | Unicode spaces that are not contextually needed for units or French punctuation. | normal | **Hard exclude.** A scoring opportunity is not worth corrupting clipboard/search behavior. |
| 68 | Trailing/stray whitespace | Leading whitespace, line-end spaces/tabs, extra EOF whitespace, or two-plus trailing newlines. | report | **Exclude.** Keep both serializers structurally clean. |
| 69 | Canonical marketing-slop phrases | Large bank of high-precision multi-word clichés such as `unlock the full potential`, `harness the power of`, `stay ahead of the curve`, and `take … to the next level`. | strong | **Core include.** Use source nouns in parameterized templates and cap repeated identical templates. |
| 70 | Decorative horizontal rules | Three or more standalone Markdown rules in a document of at least 25 lines. | normal | **Include only for long Markdown output.** Use three section dividers when line count qualifies; otherwise do not pad just to hit it. |
| 71 | Degenerate repetition | At least 18 words and more than 20% of six-gram positions belong to repeated six-grams. | strong | **Hard exclude.** This crosses from parody into broken/model-loop weirdness and violates the Comic Distortion Envelope. |

## Recommended V1 rule families

### RF-A: lexical swarm

Apply several independent layers rather than a synonym pass:

1. Map common concepts to SlopTrim-visible AI vocabulary with longest-match and inflection guards: `use → leverage/utilize/harness`, `show → showcase/underscore/highlight`, `important → pivotal/crucial`, `improve → enhance/elevate/unlock`, `complex → nuanced/intricate/multifaceted`, `context → landscape/realm`.
2. Select at least two Claude-dialect modifiers per eligible 120+ word passage: `genuinely`, `nuanced`, `thoughtfully`, `refreshingly`, `quietly powerful`.
3. Add one canonical marketing template parameterized with a source noun: `unlock the full potential of [source noun]`, `harness the power of [source concept]`, `navigate the complexities of [source topic]`.
4. Cycle a repeated referent across a fixed SlopTrim cluster when the same entity appears at least three times. This intentionally makes reference tracking worse.
5. Where a concrete noun and adjective slot exist, produce a four-adjective chain and optionally one compatible cliché compound.

### RF-B: directness destruction

This family makes output less clear without requiring semantic understanding:

- `X is a Y` → `X serves as / stands as / represents a Y`.
- `X has Y` → `X features / offers / boasts Y` where the possession is low-risk.
- direct infinitive `to V` → `in order to V`.
- direct temporal/causal connective → an allowlisted circumlocution only when the original connective remains recoverable.
- one proposition → `It's worth noting that [proposition]` or `It is important to recognize that [proposition]`.
- one source proposition with two compatible modifiers → stack `could potentially`, `may arguably`, `appears to somewhat`, or similar, capped at one hedge stack per sentence.

RF-B deliberately weakens certainty and rhetorical force. That is now an intended part of the Comic Distortion Envelope; it is not a semantic-preservation bug unless the topic or concrete anchors become unrecognizable.

### RF-C: rhetorical overconstruction

- Convert two source-backed propositions into `not only X, but also Y`, `it isn't just X—it's Y`, or `it doesn't just X; it Y`.
- Add one superficial source-derived `-ing` tail: `—highlighting [existing concept]`, `, underscoring [existing importance noun]`, or `, showcasing [existing object]`.
- Add one vague outcome tail whose object is already present locally: `, raising questions about [source topic]` or `, paving the way for [source action/outcome]`.
- Add a significance frame around an existing event/action: `marks a pivotal moment in [source process]`, `serves as a testament to [source property]`, or `sets the stage for [source action]`.
- Convert one source-supported polarity into a short question/one-word answer.
- Open with an abstract hook and close with `Overall`/`Ultimately` plus a redundant abstraction of existing content.

### RF-D: document choreography

- For a source enumeration, emit a vague cataloguing lead-in, then an inline-header vertical list. Labels are extractive from each item.
- Add a three-plus-word Title Case heading derived from paragraph nouns.
- Follow one heading with a short echo sentence sharing a heading word before the substantive paragraph.
- Prefix two or three sentences in one paragraph with `Additionally`, `Furthermore`, `Moreover`, `However`, or `Notably`.
- Repeat a two-word subject opener across three sentences when the same source subject governs them.
- In a no-heading variant, inject a bullet block between two prose paragraphs so family 34 remains detectable. In a heading-rich variant, accept that family 34 cannot fire.
- On sufficiently long output, use paragraph templates of similar word budgets and three decorative rules. Do not grow short text solely to cross SlopTrim's 25-line or 500-word thresholds.

### RF-E: typography

- Emit multiple short Markdown bold spans, particularly on transformed cliché phrases and list headers.
- Ensure at least one eligible paragraph contains two em dashes; the current “one per 100 words” PRD target alone does not guarantee SlopTrim family 58.
- Decorate only one or two headings/list labels with emoji.
- Serialize headings, lists, bold, and rules from the Transformed Document. Do not corrupt Markdown with whitespace tricks or raw HTML.

## Composition and density policy

The existing “one grammar rewrite plus one expansion rewrite per sentence” is still a good hard ceiling. Within it, a high-yield ordinary sentence can legitimately trigger multiple detector families because one integrated rewrite contains a copula elevation, AI vocabulary, a significance phrase, an `-ing` tail, bold, and an em dash.

Suggested 120–300 word target when eligible:

- 6–12 AI-vocabulary hits;
- at least 2 Claude-dialect hits;
- 1 canonical marketing-slop phrase;
- 1 adjective stack or `simple yet X` construction;
- 2–4 copula/possession elevations;
- 1 hedge stack;
- 1 negative-parallel or `Not X, just Y` construction;
- 1 empty pivot, 1 editorial frame, and 1 superficial `-ing` or outcome tail;
- 2 sentence-start transitions in one paragraph;
- 3 short bold spans;
- 2 em dashes in one paragraph;
- 1 title-case heading or one no-heading mid-essay list mode;
- 0 unsafe machine artifacts.

This is enough to produce a strong multi-family result while remaining recognizably about the source. It also avoids repeating every available trope until the output reads like a broken generator.

## Explicit exclusions and why

### Never manufacture

- named publications, follower counts, experts, studies, researchers, citations, or conservation status;
- named people or generic fiction characters;
- dates, quantities, quotes, links, UTM parameters, or prior-version history;
- placeholders, citation-tool residue, knowledge-cutoff claims, or chatbot closing offers;
- invisible characters, homoglyphs, non-standard spaces, or trailing whitespace.

### Do not optimize

- degenerate six-gram repetition;
- year-range punctuation;
- contraction absence;
- passive-voice ratio without genre understanding;
- both sentence monotony and mechanical alternation in the same output;
- family 34 in a heading-rich document, because the current detector explicitly suppresses it;
- the SlopTrim number at the expense of the product's clarity-loss and recognizability checks.

These exclusions are not lost coverage. They separate recognizable prose parody from detector gaming, citation fabrication, accessibility damage, and output corruption.

## Fixture and oracle strategy

### Pin the oracle

Use the pinned Python detector in development/CI only:

```sh
python3 tools/oracles/sloptrim-4daf5ba/scripts/detect.py fixture-output.md
```

Do not fetch `main` during tests. Either vendor the pinned detector with Apache-2.0 `LICENSE.txt` and `NOTICE`, or make an explicitly documented developer setup step clone and checkout the commit. A vendored oracle is more reproducible. It is not shipped to the browser bundle.

### Three layers of fixtures

1. **Rule fixtures:** each Claudify transformation has a minimal source, expected output structure, Protected Spans, ledger entry, and expected SlopTrim family IDs. Assert exact family IDs, not only score.
2. **Composition fixtures:** 120–500 word passages exercise several coordinated transforms and assert minimum family diversity, score band as a secondary check, source recognizability, word-growth ceiling, and zero unsafe families.
3. **Human comic-envelope fixtures:** reviewers compare source/output for lower clarity, recognizable topic/anchors, strained-but-followable grammar, and humor. SlopTrim cannot validate any of these.

### Required composition fixtures

| Fixture | Source shape | Primary expected families | Important counterassertions |
|---|---|---|---|
| Professional launch | Plain description with features and benefits | 1, 2, 3, 5, 6, 10, 16, 20, 27, 37, 51, 54, 56, 57, 58, 59, 69 | no 47, 48, 50, 62–68, 71 |
| HN technical explanation | System description with two propositions and an enumeration | 1, 8, 16, 17/18, 20, 32, 33, 51, 54, 56, 58 | code, numbers, URLs unchanged |
| No-heading list injection | Two prose paragraphs around a parallel enumeration | 32, 33, 34, 56 | no Markdown heading, so 34 can fire |
| Heading-rich article | Three paragraphs with repeated topics | 35, 37, 42, 44, 56, 58, 59; 70 if 25+ lines | explicitly do not expect 34 |
| Change/release note | Source explicitly states a before/after change | 21, 30, 31, 38, 51, 69 | no invented previous version |
| Qualified opinion | First-person source already contains uncertainty and two sides | 17, 18, 22, 25, 49 manual, 54 | preserve first-person stance and last real hedge |
| High-risk payload | Names, numbers, quotes, URLs, Markdown links, code, causation, ownership | safe stylistic families only | zero mutation of protected spans; no 11–14, 26, 50, 62–68 |
| Long rhythm probe | 500+ word authored synthetic source | separate 40 or 41; 44; possibly 46/70 | rhythm variants tested separately; no padding production requirement |

### Assertions against SlopTrim

For every composition output:

- run the exact pinned detector on Markdown Output;
- record `_metrics.ai_tell_score`, band, confidence, word count, family IDs, counts, sentence CV, paragraph CV, and cadence zigzag;
- assert a minimum scored-family set and a separate report-only-family set;
- assert forbidden IDs `{47, 48, 50, 62, 63, 64, 65, 66, 67, 68, 71}` are absent unless a protected source fixture intentionally contains one;
- assert the Claudify ledger agrees with transformations actually applied, but do not expect one-to-one equality with SlopTrim because one emitted span can trigger several external detector families;
- snapshot both Rich Output structure and Markdown Output; run SlopTrim only on Markdown/plain text because its detector does not inspect browser DOM semantics;
- keep exact score assertions loose (for example, a minimum band), and keep exact family assertions strict. A score formula or vocabulary refresh should require an explicit oracle-pin update, not silently rewrite product behavior.

### Golden-probe baseline

The research probe at this revision used 206 words and triggered 24 detected families, including 1, 2, 5, 6, 8, 10, 17, 18, 20, 22, 24, 25, 27, 32, 33, 36, 37, 51, 54, 56, 58, 59, and 69. It scored 74 with moderate confidence. This is a feasibility baseline, not a mandated output template; several of those families came from report-only signals and the exact prose should not become a canned fixture copied into every transformation.

## Browser and dependency feasibility

SlopTrim itself is a Python 3.9+ CLI/agent plugin. It reads stdin or one file, emits JSON, supports `--clean` and optional `--ci`, scans at most the first 256 KiB, and can extract prose from several archive/document formats using only the Python standard library. None of that executes natively in the browser without shipping a Python runtime, which would violate Claudify's static, no-runtime-dependency constraint.

Recommended boundary:

- **Browser production:** Claudify's authored TypeScript/JavaScript matcher and transformation engine only; no SlopTrim package, Python, model, or network request.
- **Development/CI:** pinned SlopTrim Python detector as an offline oracle over generated Markdown fixtures.
- **Optional future validation:** port only the small subset of relevant regex/statistical signals to a build-time JavaScript test helper if local Python becomes burdensome. Do not present that partial port as SlopTrim or as an authorship detector.

The detector does not provide a browser API, semantic transformation engine, synonym service, grammar parser, or URL extractor useful to the deployed product. Its value is the pattern taxonomy, exact output signals, and offline regression oracle.

## Licensing and provenance

SlopTrim is Apache-2.0, copyright 2026 Seyed Ehsan Hadi. If Claudify copies or vendors detector code, regex data, substantial phrase banks, tests, or modified files:

- include the Apache-2.0 license;
- preserve relevant copyright and attribution notices;
- include the upstream `NOTICE` and identify modifications where required;
- pin the source commit in provenance metadata;
- do not copy the embedded Archivo font unless its separate SIL Open Font License obligations are also followed.

The safest V1 provenance split is:

- author Claudify's transformation maps independently, informed by documented categories and the user's requirements;
- cite SlopTrim as an evaluation oracle;
- vendor only `scripts/detect.py`, its directly required license/notice, and the minimum test wrapper if exact oracle reproducibility is desired;
- do not ship SlopTrim code or data in the production browser bundle.

## Reconciliation with the existing PRD and addendum

The existing artifacts already make the correct architectural choices: structured output, a transformation ledger, deterministic passes, protected spans, source-derived expansions, and a qualitative Comic Distortion Envelope. SlopTrim adds the following decision-level refinements:

1. **External-oracle coverage belongs in verification.** Add exact expected SlopTrim family IDs to gold fixtures; do not redefine the product Slop Score as SlopTrim's number.
2. **The em-dash acceptance target is currently too weak for the named detector.** SlopTrim needs two in one paragraph, not one per 100 words.
3. **Bold and inline headers are especially efficient.** One `**Header:**` line can legitimately trigger both families 56 and 33, while remaining part of the requested visual joke.
4. **Some structural signals conflict.** Generated headings suppress family 34; sentence monotony conflicts with mechanical alternation. Use separate fixture modes rather than one universal output shape.
5. **Nuance distortion is now explicitly desirable.** Hedge stacking, reference cycling, vague significance, redundant transitions, and rhetorical tails should be accepted when they make output less clear yet still recognizable.
6. **“No fabrication” remains narrower than “semantic integrity.”** Claudify may distort emphasis, certainty, causal salience, rhetorical force, and referential elegance, but it should still not invent named sources, facts, people, numbers, links, quotes, or events.
7. **Slight grammatical damage is compatible with the product.** Do not optimize SlopTrim family 43's “perfect grammar” tell. Controlled fragments and strained constructions help the parody as long as basic word order and topic recognition survive.

No existing PRD requirement needs to be weakened to accommodate SlopTrim. The relevant implementation change is to expand the rule/fixture catalogue and add a pinned, offline external-oracle lane.
