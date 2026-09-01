# Reconciliation: Wikipedia “Signs of AI writing”

**Input reviewed:** [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)  
**Review date:** 2026-09-01  
**Compared with:** `prd.md` and `addendum.md` in this PRD folder

## 1. Source status and interpretation

The source is a changing, Wikipedia-specific advice page, not a policy, model specification, or validated detector rubric. It expressly says that the signs are descriptive rather than prescriptive, that many also occur in human writing, that some are specific to Wikipedia workflows, and that neither automated detectors nor unaided human judgment reliably establish authorship. The page also notes that patterns vary by model and era.

Claudify should therefore extract a deliberately recognizable subset of the source's linguistic and presentational patterns. It should not ingest the page as a live rule feed, imply that the list defines “Claude language,” or optimize against an AI detector. A dated, curated rule set is the right product interpretation.

## 2. Executive reconciliation

The current PRD and addendum capture the core joke well: dense cliché vocabulary, significance inflation, superficial participial analysis, promotional verbs, copula avoidance, indirect association, negative parallelism, em dashes, boldface, inline-header lists, emoji, safe dual serialization, and a non-detector Sign Tally.

There are four material gaps:

1. Several requirements are expressed as capabilities (“can replace,” “can create”) rather than the exaggerated frequency the user requested.
2. The source's **rule of three** is not implemented as a positive transformation behavior.
3. Its broader document-shape tells—title-case headings, redundant title headings, “X and Y” headings, over-sectioning, and thematic breaks—are mostly absent.
4. Meaning preservation is underspecified for modality, quantifiers, certainty, time trends, evaluation, and association; several proposed fillers can add claims even when all nouns came from the source.

Several other source signs are intentionally unsuitable because they depend on fabrication, broken markup, false citations, inaccessible structure, or Wikipedia-only workflow residue. Those should be explicit exclusions, not accidental omissions.

## 3. Coverage matrix

| Source sign | Current coverage | Reconciliation |
|---|---|---|
| High density of AI vocabulary | Strong lexical seed groups and deterministic variants | Keep, but add a density target and broader promotional lexicon such as `boasts`, `vibrant`, `rich`, `profound`, `commitment`, `seamlessly`, `groundbreaking`, `renowned`, `diverse array`, and sentence-initial `Additionally` where grammar permits. |
| Undue significance, legacy, broader trends | Significance framing, “pivotal,” “testament,” “broader landscape” | Covered in style, but must not add unsupported legacy, trend, public-debate, conservation, or impact claims. |
| Superficial analysis | Participial tails using `highlighting`, `underscoring`, `interplay` | Covered. Guard against converting adjacency into causation or evaluation. |
| Promotional / advertisement-like language | Marketing verbs and cliché mappings | Covered, but the current examples are thinner than the source. Expand rule data, not generic sentence injection. |
| Avoidance of `is`/`are` and neutral `has` | Copula, possession, and career recognizers | Covered as an ability; missing a measurable saturation target across safe eligible matches. |
| Vague connection / association | Indirect-association recognizer and causal denylist | Covered, but an allowlist is safer than a denylist because indirection can erase agency, ownership, authorship, use, and causation. |
| Negative parallelism | `not only…but also`, `not merely…it is` | Covered as an ability; missing the requested “very frequent” application target. |
| Rule of three | Only a warning not to fabricate a third list item | Material omission. Add safe triadic rhetoric from three already-present attributes, actions, or propositions. |
| Excessive boldface | Clichés, inline headers, and significance phrases | Covered. The addendum's readability budget must remain deliberately high enough for parody. |
| Inline-header vertical lists | Parallel-enumeration conversion | Covered. Require the recognizable `**Extractive label:** description` shape rather than merely bolding the first noun. |
| Em dashes | Clause inflation and typography pass | Strong coverage. Spaced em dashes are particularly apt: the source reports that, among models in a July 2026 study, Claude alone exceeded professional writers' em-dash use. |
| Emoji as formatting | Occasional headings and list labels | Covered and appropriately occasional; the source says this cue is now rarer. |
| Title and heading patterns | One optional generated heading | Partial. Title case, redundant title heading, “X and Y” headings, and thematic breaks are omitted. |
| Unusual small tables | No table node | Omitted but low priority. Only generate a table when the source already contains comparable records; never turn arbitrary prose into inferred rows or columns. |
| Curly quotes/apostrophes | Protected quotation punctuation round-trips | Correctly not normalized. The source says curly quotes are not specific evidence and that Claude typically does not use them. Generated prose may use typographic apostrophes, but protected quotations must remain exact. |
| Challenge / future-outlook conclusion | General transitions only | Omitted. A guarded version can be used only when the source already supplies both a challenge and a future action/prospect. |
| Collaborative chatbot chatter | Not generated | Correct exclusion unless the source itself addresses the reader. Canned “I hope this helps” wrappers would violate the requirement to integrate changes grammatically. |
| Vague attribution, media recognition, awards | Explicitly prohibited by expansion rules | Correct exclusion unless such facts already occur in the source. |
| Knowledge-cutoff disclaimers, placeholders, prompt residue | Not generated | Correct exclusion: these are response artifacts, not transformations of source meaning. |
| Broken markup, fake citations, tracking parameters | Protected/safe rendering | Correct exclusion for safety, utility, and factual integrity. |
| Skipped heading levels / overused level-1 headings | Not generated | Correct exclusion because intentionally inaccessible heading hierarchy is not worth the joke. Visual over-sectioning can produce the same comic effect with valid HTML hierarchy. |

## 4. Recommended product deltas

These are reconciliation requirements for the implementation backlog; this document does not modify the approved PRD.

### 4.1 Convert stylistic capability into deliberate saturation

The implementation needs eligibility-based targets, not unconditional counts that force bad grammar:

- Transform at least 70% of copula and possession matches that pass all semantic guards.
- Use negative parallelism at least once per 150 source words when the paragraph contains two compatible source propositions, capped at two per paragraph to avoid identical rhythm.
- Apply indirect-association wording to at least half of explicitly allowlisted low-risk relation shapes.
- Ensure every suitable 100–500 word fixture contains both lexical inflation and at least two sentence-shape rewrites, in addition to the existing four-class threshold.
- Use bold on most generated cliché phrases and every inline list header, while keeping protected spans untouched.
- Emit several spaced em dashes in long suitable input, but only at parsed clause boundaries or around existing appositives.

These targets should be tuned through parody review; they are not linguistic quality benchmarks.

### 4.2 Add a guarded rule-of-three pass

The source describes repeated triads of adjectives or short phrases as a characteristic sign. Claudify can reproduce this without inventing facts when a sentence or adjacent sentences already provide three parallel items.

Safe forms include:

- preserve an existing three-item enumeration and heighten its parallel syntax;
- collect three source-backed attributes of the same subject into a triadic clause;
- split three source-backed actions into three parallel list items;
- repeat a grammatical frame across three existing propositions.

Never add a third fact to a two-item source. Do not convert three entities with different roles into supposedly equivalent attributes. Record this as its own `rule_of_three` ledger category.

### 4.3 Expand document-shape parody

Add a `thematicBreak` node and heading metadata to the Transformed Document so both serializers can express the same safe excess. For multi-paragraph source text, the engine may:

- prepend one redundant, extractive title heading derived from existing topic words;
- use title case in generated headings;
- create extractive “X and Y” section headings when both concepts already occur in the section;
- over-section longer text with valid heading levels;
- place thematic breaks between generated sections;
- use occasional emoji on headings or inline headers.

Do not deliberately skip heading levels, emit multiple HTML `h1` elements, create heading-only containers, or reproduce broken wikitext. Those are Wikipedia-rendering mistakes, not desirable browser UX.

### 4.4 Add a guarded challenge/outlook form

The source's rigid “Challenges and Future Outlook” ending is recognizable and product-relevant, but it is unsafe unless both halves are present in the input. Permit it only when the local source includes:

- an explicit limitation, obstacle, risk, or challenge; and
- an explicit planned, future, continuing, or potential action.

The rewrite may reorganize those propositions into a pompous conclusion. It must not invent ongoing initiatives, future investment, likely outcomes, resilience, success, or eventual benefit.

### 4.5 Make the Sign Tally match the source-derived taxonomy

In addition to the existing groups, expose at least:

- rule of three;
- promotional puffery;
- significance / legacy framing;
- copula avoidance;
- indirect association;
- negative parallelism;
- title and section choreography;
- thematic breaks.

The public labels should describe visible techniques, not claim that any technique proves AI origin.

## 5. Meaning-preservation risks and required guards

### 5.1 Preserve more than literal tokens

The current requirement protects actors, events, measurements, quotations, negation, agency, causation, and chronology. Add these semantic invariants:

- modality: `may`, `could`, `must`, and `will` are not interchangeable;
- certainty and attribution strength;
- quantifiers and scope: `some`, `most`, `all`, `only`, and `at least`;
- comparison and directionality;
- temporal trend: `increasingly`, `ongoing`, `emerging`, and `enduring` require source support;
- evaluation and public status: `pivotal`, `renowned`, `groundbreaking`, `widely`, `legacy`, and `recognition` add claims unless treated as clearly comic subjective coloration.

The product cannot simultaneously promise literal factual preservation and freely add evaluative assertions. The clean contract is: hard propositional invariants are mandatory; exaggerated subjective coloration is permitted and disclosed as parody; time trends, consensus, attribution, and concrete consequences still require source evidence.

### 5.2 Tighten individual recognizers

- **Copulas:** `X is Y` can state identity, classification, location, state, or definition. `serves as` is valid only for an actual role/function; `represents` and `marks` often add symbolism or event significance. Use shape-specific allowlists.
- **Possession:** `features`, `offers`, `maintains`, and `boasts` do not preserve every meaning of `has`. Check subject type, object type, tense, aspect, and whether possession means ownership, composition, experience, illness, obligation, or availability.
- **Association:** do not merely denylist a few causal verbs. Allow only pre-audited relation shapes where weakening to association cannot hide who did what.
- **Negative parallelism:** both poles must be explicit in the source. Do not manufacture a misconception merely to rebut it.
- **Participial tails:** `highlighting`, `ensuring`, `reflecting`, and `contributing to` can assert causal or evidential relationships. Select only tails licensed by the source predicate.
- **Hedges:** `arguably` weakens certainty; `increasingly` asserts change over time; `particularly` changes emphasis. Treat each as a semantic operator, not harmless filler.
- **Headings and labels:** derive them extractively from words already present. A concise abstractive label can still create a claim about what the paragraph means.

### 5.3 Fix Protected Span validation semantics

“Present exactly once” should be tracked by unique span identity and source range, not raw text value. Repeated identical names, numbers, links, or quotations are legitimate. Each protected token instance must appear once at its mapped output location and unchanged; the same literal value may appear multiple times if it appeared multiple times in the source.

## 6. Signs to exclude deliberately

The following source signs should not become Claudify transformations:

- fabricated experts, observers, critics, scholarly consensus, media coverage, awards, recognition, or social presence;
- replacement of specific facts with generic praise—the source identifies this as a core AI tendency, but it defeats Claudify's payload-preservation promise;
- speculative conservation, legacy, future initiatives, missing-source, or knowledge-cutoff claims;
- fake citations, broken external links, invented DOI/ISBN data, malformed Markdown/wikitext, internal model tokens, or tracking parameters;
- placeholder templates, refusal language, submission instructions, procedural edit commentary, and model-specific citation leakage;
- inaccessible heading levels or deliberately broken rich/Markdown output;
- tables inferred from prose that does not already define records and columns.

These exclusions should appear in rule-authoring guidance so future contributors do not interpret “show as many signs as easy” as permission to corrupt content.

## 7. Parody and detector caveats

- Call the output “Claude-like parody” or “Claudeification,” not evidence of Claude authorship.
- Keep “Slop Score” explicitly tied to the applied-rule ledger. Never map it to a probability, detector score, or “human versus AI” verdict.
- Do not validate success by submitting output to commercial AI detectors. The source warns of non-trivial errors and susceptibility to paraphrasing, formatting, spacing, and unseen models.
- The five-person recognition test measures whether the joke lands for LinkedIn/Hacker News readers, not whether humans can identify real AI text.
- Version the curated sign taxonomy and display a short source/date note. The source says vocabulary and model habits change over time.
- Explain that the parody intentionally aggregates clues which individually occur in ordinary human writing.
- Preserve an editorial distinction between broad “AI-writing” signs and Claude-specific cues. The source specifically supports Claude-like em-dash excess, while it says Claude typically does not use curly quotation marks.

## 8. Verification additions

Add fixtures and invariants for:

- eligible copulas, possession, association, and two-proposition contrasts, with measured application rates;
- safe and unsafe triads, including a hard assertion that a two-item source never gains a factual third item;
- modality, quantifiers, certainty, attribution, chronology, comparison, and temporal-trend preservation;
- `has` as possession versus auxiliary, illness, experience, and obligation;
- identities, definitions, locations, progressive forms, and passives that must not undergo copula elevation;
- redundant title, title case, valid nested headings, thematic breaks, rich/Markdown parity, and screen-reader heading order;
- source-backed versus fabricated challenge/future conclusions;
- duplicate identical Protected Spans tracked as separate instances;
- exact ledger totals for every newly exposed Sign Tally category;
- snapshot cases showing high parody density without false sources, fabricated recognition, or broken output.

## 9. Acceptance consequence

The planning set remains directionally sound. Before implementation is considered faithful to the stated product intent, the build specification should incorporate the four material gaps: measurable saturation, safe rule-of-three behavior, richer document-shape parody, and stronger semantic invariants. The explicit exclusions above preserve the joke while avoiding false claims, detector theater, inaccessible markup, and unusable copied output.
