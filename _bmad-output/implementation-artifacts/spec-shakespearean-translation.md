---
title: 'Add Shakespearean phrase translation'
type: 'feature'
created: '2026-09-01'
status: 'done'
review_loop_iteration: 0
baseline_commit: '259b3d7e36c2b6a3b7a3ef7e7d066b5d1e89cc0a'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Claudify currently inflates modern prose but leaves recognizable Shakespearean or archaic phrases untouched, missing an opportunity to translate old dramatic language into deliberately over-engineered Silicon Valley/elevator-pitch English.

**Approach:** Add a bounded, deterministic, single-pass phrase-map layer to the existing lexical pipeline. Match the supplied archaic phrases longest-first, preserve protected spans and punctuation, and emit the modern translations as ordinary bolded lexical transformations without adding parsing, packages, or an LLM.

**Initial mapping set:**

| Archaic | Modern translation |
|---|---|
| ’Tis | It is |
| ’Tis nobler in the mind | It’s more strategically admirable |
| To suffer | To endure / absorb the downside |
| The slings and arrows | The attacks and setbacks |
| Outrageous fortune | Extreme bad luck / a hostile external environment |
| To take arms | To take action / mobilize |
| A sea of troubles | An overwhelming volume of problems |
| By opposing end them | By actively pushing back, eliminate them |
| To die—to sleep | To die is essentially to shut down |
| No more | No further pain or disruption |
| By a sleep | Through death / permanent shutdown |
| The heartache | Emotional pain |
| The thousand natural shocks | The countless unavoidable difficulties |
| That flesh is heir to | That human beings inevitably experience |
| A consummation | A final resolution / complete wrap-up |
| Devoutly to be wished | Strongly desirable |
| Perchance | Perhaps / potentially |
| Ay | Yes / indeed |
| There’s the rub | That’s the key issue |
| The sleep of death | The unknown state after death |
| What dreams may come | Whatever may happen afterward |
| Shuffled off | Discarded / exited |
| This mortal coil | This difficult human existence |
| Must give us pause | Should make us stop and reconsider |
| There’s the respect | That’s the factor we have to account for |
| Makes calamity of so long life | Turns life’s problems into a reason to keep enduring them |
| Who would bear | Who would willingly tolerate |
| The whips and scorns of time | The constant criticism, pressure, and setbacks of life |
| Th’ oppressor’s wrong | The abuse inflicted by powerful people |
| The proud man’s contumely | The arrogance and insults of entitled people |
| The pangs of despised love | The pain of rejected or unreturned love |
| The law’s delay | Slow, inefficient legal processes |
| The insolence of office | The arrogance and abuse of people in positions of authority |
| The spurns | The rejections and humiliations |
| Patient merit | Quietly earned success / deserving people’s hard work |
| Th’ unworthy | People who are less deserving |
| His quietus make | End his account / shut down his existence |
| A bare bodkin | A simple dagger / one decisive action |
| Fardels | Burdens / difficult responsibilities |
| To grunt and sweat | To struggle and work painfully hard |
| Under a weary life | Through an exhausting existence |
| The dread | The fear |
| Something after death | The possibility of what comes next |
| The undiscovered country | An unknown future destination |
| From whose bourn | From whose boundary or territory |
| No traveller returns | No one comes back with verified information |

## Boundaries & Constraints

**Always:** Keep phrase matching deterministic, dependency-free, browser-native, longest-match-first, whole-phrase, nonrecursive, and protected-span safe. Preserve the existing ledger, bold styling, serializers, sentence-shape gates, `used to` protection, and 2.25× growth ceiling. Bump rule-data version when rule data changes.

**Ask First:** Add mappings beyond this supplied starter list, change translations, add a new tally category or score weight, alter protected-span behavior, or change the growth cap.

**Never:** Use fuzzy matching, NLP, substring matching, runtime language detection, external data, services, or an LLM. Never rewrite code, URLs, links, quotations, names, numbers, or generated text.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Phrase translation | Supplied archaic phrase in ordinary prose | Exact modern mapping appears once, with existing lexical styling/ledger behavior | No recursive rematching |
| Longest match | Both a long phrase and one of its shorter terms are present | Long phrase wins; no overlapping shorter replacement | Deterministically skip overlap |
| Protected phrase | Archaic text inside code, URL, link, quote, number, name, or source bold | Payload remains byte-identical | Skip local translation |
| Boundaries | Phrase appears as part of a larger word or with punctuation/apostrophes | No substring replacement; punctuation remains intact | Pass through safely |
| Budget | Archaic-heavy source exceeds expansion budget | Existing bounded fallback applies | Never exceed 2.25× |

</frozen-after-approval>

## Code Map

- `src/domain/rules.js` -- add frozen archaic phrase rules, validation, and rule-data version update.
- `src/domain/engine.js` -- combine phrase tables in the existing single-pass lexical matcher while preserving protection and gates.
- `test/engine.test.js` -- verify representative mappings, longest-match behavior, determinism, styling, and budget behavior.
- `test/hardening.test.js` -- verify archaic phrases remain unchanged in protected spans and do not match substrings.
- `README.md` -- document the bounded archaic translation layer and its guarantees.

## Tasks & Acceptance

**Execution:**
- [x] `src/domain/rules.js` -- add and validate the supplied archaic mapping table without altering existing mappings.
- [x] `src/domain/engine.js` -- apply archaic rules through the existing protected, deterministic, nonrecursive lexical pass.
- [x] `test/engine.test.js`, `test/hardening.test.js` -- cover all matrix rows, representative mappings, overlap, protection, determinism, and growth limits.
- [x] `README.md` -- describe the new bounded translation capability if needed for the behavioral contract.

**Acceptance Criteria:**
- Given any supplied starter phrase in eligible prose, when transformed, then its exact supplied modern translation appears and is ledgered once.
- Given overlapping supplied phrases, when transformed, then the longest phrase is selected deterministically and shorter overlaps are not emitted.
- Given protected content containing supplied phrases, when serialized, then every protected payload remains byte-identical in Rich and Markdown outputs.
- Given repeated identical archaic input, when transformed twice, then wording, structure, tally, score, and ledger are byte-identical.
- Given archaic-heavy input, when transformed, then the existing 2.25× word-growth ceiling and all existing tests remain satisfied.

## Spec Change Log

## Design Notes

Use the existing `phraseRules` schema and category accounting. The matcher should consume only source text, sort phrase triggers by descending length before priority, and retain the existing internal-marker exclusion. Translation variants may be one or more exact supplied alternatives, selected stably if alternatives are needed; do not introduce new semantic variants without approval.

## Verification

**Commands:**
- `npm test` -- all existing and new mapping/protection fixtures pass.
- `npm run check` -- all JavaScript parses.
- `npm run oracle` -- optional oracle skips explicitly when no detector is supplied.

## Suggested Review Order

**Shared lexical pipeline**

- Establishes the complete frozen starter mapping and versioned rule data.
  [`rules.js:1`](../../src/domain/rules.js#L1)

- Preserves protected spans while enforcing deterministic longest-first whole-phrase matching.
  [`engine.js:6`](../../src/domain/engine.js#L6)

- Applies each translation through existing bold styling and ledger accounting.
  [`engine.js:168`](../../src/domain/engine.js#L168)

**Verification and contract**

- Exercises every supplied mapping, overlap behavior, punctuation, styling, determinism, and budget limits.
  [`engine.test.js:52`](../../test/engine.test.js#L52)

- Confirms protected payload identity and substring exclusion across serializers.
  [`hardening.test.js:34`](../../test/hardening.test.js#L34)

- Documents the bounded archaic translation guarantees for maintainers.
  [`README.md:19`](../../README.md#L19)
