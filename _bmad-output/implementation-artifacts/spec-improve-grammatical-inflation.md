---
title: 'Improve grammatical inflation'
type: 'bugfix'
created: '2026-09-01'
status: 'done'
review_loop_iteration: 0
baseline_commit: '1c613013a1fd912dd46579d094d00d841357004c'
context:
  - '_bmad-output/implementation-artifacts/spec-claudify-prototype.md'
  - '_bmad-output/planning-artifacts/prds/prd-claudify-2026-09-01/addendum.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Claudify’s expansion pass makes rhetorical questions, colon-ended leads, imperatives, and coordinated clauses mechanically ungrammatical. The reported output includes `thus:,`, `—.`, naked topics such as `underscoring scrupulous`, habitual `used to seeing` rewritten as `leveraged to seeing`, and `not only one can`.

**Approach:** Classify conservative sentence shapes before grammar and expansion passes, preserve terminal punctuation as a unit, and apply declarative framing only where it can be integrated grammatically. Keep the output deliberately less clear, repetitive, clichéd, and mildly strained without producing punctuation collisions or broken basic word order.

## Boundaries & Constraints

**Always:** Remain deterministic, dependency-free, domain-only, non-LLM, and browser-native. Preserve protected spans, document/ledger/serializer behavior, hashing, the growth cap, and the domain boundary. Questions retain question force; colon leads retain colons; imperatives avoid declarative tails. Topics must be noun phrases, using a vague fallback when uncertain. Keep `use` inflation except habitual `used to`. Existing parody-density and oracle gates remain.

**Ask First:** Change the 2.25× cap, SlopTrim thresholds, protected-span behavior, public domain API, rule data provenance, or production architecture.

**Never:** Add parsing/NLP tooling, packages, services, or runtime clarity scoring; make output clearer; special-case the supplied prose; attach declarative tails to questions, imperatives, fragments, dependent clauses, or colon/semicolon leads.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Reported prose | Supplied writer/rules excerpt | Inflated and less clear, with recognizable questions/rules | No malformed punctuation, topics, habitual use, or parallelism |
| Question | `What words will express it?` or `Really?!` | Keeps punctuation/question force; no declarative tail | Use lexical changes or question framing only |
| Lead/imperative | Colon lead or `Never use…` | Colon remains; imperative gets no declarative tail | Skip expansion locally |
| Habitual use | `The writer is used to seeing clichés.` | `used to` remains unchanged | Other clearly verbal `use` forms stay eligible |
| Coordination | Complete clauses joined by `, and` | Grammatical full-clause wrapper or unchanged | Never emit `not only one can` |
| Declarative | Eligible ordinary prose | Integrated hedge/significance parody | Use `the broader proposition` if topic confidence is low |

</frozen-after-approval>

## Code Map

- `src/domain/engine.js:91` -- `transformSentence` owns punctuation, mood, topic, coordination, and expansion-tail defects.
- `src/domain/engine.js:159` -- `applyLexical` lacks the contextual `used to` exclusion.
- `src/domain/engine.js:227` -- reuse the bundled segmenter; it already finds the sample’s questions.
- `src/domain/rules.js:8` -- `lex-use` trigger data remains valid; context belongs in engine eligibility.
- `test/engine.test.js:14` -- preserve composition, density, determinism, and growth guardrails.
- `test/hardening.test.js:12` -- reuse dependency-free adversarial fixture patterns.
- `test/oracle.js:8` -- pinned external gate must stay ≥15 families, ≥10 score-bearing, `heavy tells`, and forbidden-family clean.

## Tasks & Acceptance

**Execution:**
- [x] `src/domain/engine.js` -- add punctuation/mood/topic/coordination gates and contextual lexical exclusions.
- [x] `test/grammar.test.js` -- freeze the complete reported excerpt plus focused punctuation, question, imperative, habitual-use, topic, and coordination regressions.
- [x] `README.md` -- document that controlled awkwardness excludes malformed punctuation and broken sentence mood only if the behavioral description needs clarification.

**Acceptance Criteria:**
- Given the reported excerpt, when transformed, then it remains less clear, stays within 2.25× growth, retains six question marks and two colon leads, and triggers hedge, significance, bold, and em-dash categories.
- Given that transformed excerpt, when scanned for known defects, then it contains none of `:,`, `—.`/`—?`, `leveraged to seeing`, `not only one can`, or significance topics derived from `What`, `Never`, `put`, `said`, or bare `scrupulous`.
- Given eligible declarative input, when transformed, then cliché density and negative parallelism remain present through grammatically integrated constructions.
- Given the unchanged oracle composition fixture, when verified, then all existing tests pass and the pinned detector still meets the established thresholds.

## Spec Change Log

## Design Notes

Prefer shape gating over general parsing. Declaratives may use one integrated tail: `—an observation that not only underscores **the broader proposition**, but also speaks to its wider significance.` Questions get no declarative tail. Complete clauses may use `It is not only the case that …, but also the case that …`. If necessary, expand only one eligible sentence per paragraph while retaining lexical inflation elsewhere.

## Verification

**Commands:**
- `npm test` -- all existing and new grammar fixtures pass.
- `npm run check` -- all JavaScript parses.
- `npm run oracle` -- explicitly skips when no detector is supplied.
- `SLOPTRIM_DETECT=/private/tmp/sloptrim-detect.py npm run oracle` -- when available, retains ≥15/≥10/`heavy tells` and forbidden-family exclusions.

**Manual checks:**
- Compare the reported input/output pair and confirm the result is recognizably worse, funny, and grammatical enough to read aloud.

## Suggested Review Order

**Sentence-shape safety**

- Entry gates preserve punctuation, mood, and conservative clause eligibility.
  [`engine.js:94`](../../src/domain/engine.js#L94)

- Coordinated clauses require two complete clauses before parallel rewriting.
  [`engine.js:258`](../../src/domain/engine.js#L258)

- Enumeration parsing avoids consuming preceding sentences as a list lead.
  [`engine.js:228`](../../src/domain/engine.js#L228)

**Expansion and lexical protection**

- The contextual `used to` exclusion protects habitual usage while preserving inflation.
  [`engine.js:167`](../../src/domain/engine.js#L167)

- The generic noun-phrase topic keeps significance framing grammatical and safe.
  [`engine.js:141`](../../src/domain/engine.js#L141)

**Verification and contract**

- The complete regression fixture covers questions, leads, imperatives, dependencies, topics, and coordination.
  [`grammar.test.js:5`](../../test/grammar.test.js#L5)

- Focused tests lock each reported grammar failure and the growth boundary.
  [`grammar.test.js:15`](../../test/grammar.test.js#L15)

- The README records the user-visible controlled-awkwardness constraint.
  [`README.md:19`](../../README.md#L19)
