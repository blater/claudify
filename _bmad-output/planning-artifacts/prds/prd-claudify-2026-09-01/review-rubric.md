# PRD Quality Review — Claudify

## Overall verdict

This is a focused, unusually substantive PRD for a one-off gimmick: the product thesis, deliberate constraints, multi-layer transformation strategy, and counter-metrics all hold together. It is decision-ready, but not fully story-ready until transformation eligibility is defined independently of the implementation and the boundary between the behavioral PRD and the addendum's purported engineering “contract” is made explicit.

## Decision-readiness — strong

The consequential choices are stated plainly: one maximal style, static browser execution, deterministic authored rules, best-effort URL loading, and no model or proxy (§1, §7, §8.2). The addendum earns those choices by naming what is given up in “Rejected Shortcuts,” including why a full NLP library, remote LLM, and URL proxy are rejected (addendum §9). “No phase-blocking questions remain” (§10) is credible for the agreed low-stakes build.

## Substance over theater — strong

The single persona drives the actual flow rather than decorating it (§2.3), the vision is specific enough that it could not be transplanted into a generic rewriting product (§1), and the NFRs mostly carry product-specific bounds (§5). The engineering detail directly answers the central product risk—why the result should feel like convincing stylistic parody rather than “a thesaurus prank” (addendum §9)—so the detail is earned rather than architectural theater.

## Strategic coherence — strong

The thesis is explicit: “the joke only lands when the Transformation Engine changes several layers at once” (§1). MVP scope follows that thesis, and SM-1/SM-2 test parody recognition and multi-layer coverage rather than generic activity; SM-C1 and SM-C2 prevent score-chasing and URL coverage from undermining fidelity or the browser-only constraint (§9). This is a coherent experience MVP rather than a feature backlog.

## Done-ness clarity — adequate

Every FR has testable consequences, and the addendum supplies fixtures, counterexamples, ledger-based accounting, and serializer invariants. The main weakness is that the hardest acceptance thresholds depend on eligibility terms controlled by the implementation, making the headline transformation requirement easier to declare satisfied than to falsify.

### Findings

- **high** Eligibility can self-exempt the core transformation requirement (§4.2 FR-4; §9 SM-2) — Thresholds are repeatedly conditional on “suitable Source Text,” matches that “pass every grammar and semantic guard,” “compatible source propositions,” and “when suitable matches exist.” Because the implementer defines both the guards and the suitable fixture set, an engine can miss difficult cases while reporting excellent eligible-case coverage; SM-2 repeats the same circularity with “Every suitable 100–500 word fixture.” *Fix:* Freeze an independently annotated gold fixture manifest before implementation, marking expected eligible spans and required transformation classes per fixture, including mandatory no-op counterexamples; compute coverage against that manifest rather than engine-reported eligibility.
- **medium** The performance target lacks a reproducible test environment (§5 Performance) — “current mid-range desktop browser” does not identify hardware, browser version, warm-up, fixture, or measurement statistic, so “within 200 ms” cannot produce a stable pass/fail result. *Fix:* Name a reference device or CPU class, browser/version policy, representative 10,000-character fixture, warm/cold conditions, run count, and percentile (for example median or p95).
- **low** URL extraction success is subjective (§4.1 FR-2) — “extracts readable text” and “where recognizable content containers exist” leave no boundary for what counts as success when pages contain multiple `article`, `main`, or `body` regions. *Fix:* Add a small frozen URL/HTML fixture set with exact expected extracted text and an explicit fallback rule when no accepted container is found.
- **low** Clipboard success has two plausible meanings (§4.3 FR-7; §9 SM-4; addendum §6) — FR-7 permits a plain-text fallback, while SM-4 says “Rich Output … copy successfully in each supported browser,” which could be read as requiring styled HTML everywhere. *Fix:* State that SM-4 passes when the best supported representation copies and reports any downgrade, and separately enumerate browsers/environments expected to support `text/html`.

## Scope honesty — strong

The PRD is unusually candid about omissions: URL retrieval limitations are surfaced in the journey and FR-2, non-users and non-goals rule out detector and writing-assistant interpretations, and MVP exclusions explain why server extraction, intensity controls, social integrations, and live vocabulary updates are omitted (§2, §7, §8). The confirmed drafting decisions are gathered in §11, so there is no hidden high-impact assumption left masquerading as settled scope.

## Downstream usability — adequate

The glossary is stable, UJ-1 has a named protagonist, FR/UJ/SM IDs are unique, and metrics resolve to FRs. However, story creation will have to reverse-engineer both a very large FR and an addendum whose authority is internally ambiguous.

### Findings

- **medium** FR-4 is too monolithic for clean story and acceptance traceability (§4.2 FR-4) — One requirement contains lexical mapping, copula and possession rewrites, negative parallelism, indirect association, expansions, list conversion, headings, typography quotas, density, and overlap resolution. A story can satisfy part of FR-4 while its status and SM-2 traceability remain ambiguous. *Fix:* Keep the multi-layer feature but split FR-4 into stable child FRs for lexical, sentence-shape, contextual expansion, structural, and typography behavior, plus one coordination/coverage FR; map SM-2 and ledger categories to those IDs.
- **medium** The addendum's authority is contradictory (PRD §0 and §4.2; addendum Purpose, §3, §5) — The PRD says “Technical mechanics … live in addendum.md” and calls it a “technical contract,” while the addendum calls itself “technical guidance” and says the behavioral contract remains in `prd.md`; it then uses binding language such as “Required recognizers,” a validator that “must reject,” and a URL adapter that “first maps” GitHub URLs. Downstream teams cannot tell which details are acceptance criteria and which may change during architecture. *Fix:* Label each addendum section normative or advisory, promote user-visible or test-required behavior into FR consequences, and leave implementation examples explicitly non-binding.

## Shape fit — strong

For a hobby/one-off browser product, one named journey and eight grouped FRs are enough; extra personas, market theater, and growth machinery are correctly absent. The technical addendum is longer than the PRD, but that shape fits the user-identified risk—the quality of a dependency-free transformation engine—and the product still remains one static-page flow.

## Mechanical notes

- FR-1 through FR-8 and UJ-1 are contiguous and unique. SM-1 through SM-4 are contiguous; the `SM-C1`/`SM-C2` counter-metric namespace is clear and all cited FR ranges resolve.
- Glossary usage is consistent. “Source Payload” appears as the FR-3 title but is not a defined term; using “Source Meaning and Protected Spans” would avoid introducing a near-synonym.
- There are no inline `[ASSUMPTION]` tags to round-trip. Section 11 records user-confirmed decisions, so its title “Confirmed Draft Assumptions” is mechanically misleading; rename it “Confirmed Decisions,” or use formal assumption tags and an index only for genuinely unconfirmed inferences.
- UJ-1 names Maya and carries her context inline. Required sections are present for the agreed hobby-product stakes.
