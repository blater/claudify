import assert from 'node:assert/strict';
import test from 'node:test';
import { copyOutput } from '../src/browser/clipboard.js';
import { renderRich } from '../src/browser/render.js';
import { leadInRules, phraseRules } from '../src/domain/rules.js';
import { xCoverageRules } from '../src/domain/x-coverage.js';
import { EXAMPLES } from '../src/examples.js';
import { score, serializeMarkdown, serializePlain, sourceScore, tally, toRichTree, transform, validateRules } from '../src/domain/index.js';
import { fetchSource, githubApiUrl, sourceLoadFailure } from '../src/browser/url.js';

const SHOWCASE = `A small engineering team uses a review tool to improve releases. The system is a simple way to show errors before customers see them, and it helps each task stay focused. The team has three goals: catch risky changes early, explain decisions clearly, and keep feedback connected to the code.

The process starts when an engineer opens a change. Reviewers read the proposal and discuss its context. The tool connects comments to exact lines and shows which checks passed. This keeps the conversation practical, but the team still decides what matters.

The team measures results over time. Faster reviews are useful, clear ownership is important, and fewer production problems help everyone. The process does not replace judgment; it gives people a shared place to work and learn.`;

const SWISS_STYLE = `Swiss Style emerged in the 1950s in Zürich and Basel. Designers like Josef Müller-Brockmann, Emil Ruder, and Armin Hofmann emphasized clarity, objectivity, and rational composition. The movement rejected decoration and embraced photography, precise alignment, and typographic discipline.

Its mathematical grid system reshaped how designers approached layout. By establishing structure first, content could be positioned logically, ensuring harmony and readability. The style became widely adopted for corporate identity, signage, magazines, and poster design.

Today, Swiss Style influences user interfaces, responsive layouts, mobile apps, and modern design systems. Every clean, grid-aligned, typography-driven website owes something to this movement.`;

test('showcase composes dense multi-layer parody within the growth ceiling', () => {
  const document = transform(SHOWCASE);
  const markdown = serializeMarkdown(document);
  const counts = new Map(tally(document).map((item) => [item.key, item.count]));
  const activeClasses = [...counts.values()].filter((count) => count > 0).length;

  assert.ok(activeClasses >= 4, `expected >=4 classes, got ${activeClasses}`);
  assert.ok((counts.get('lexicalCliche') ?? 0) > 0);
  assert.ok((counts.get('hedge') ?? 0) > 0);
  assert.ok((counts.get('marketing') ?? 0) > 0);
  assert.ok((counts.get('significance') ?? 0) > 0);
  assert.ok((counts.get('bold') ?? 0) > 0);
  assert.ok((counts.get('emDash') ?? 0) >= 2);
  assert.ok((counts.get('negativeParallelism') ?? 0) > 0);
  assert.match(markdown, /\*\*.+?\*\*/s);
  assert.match(markdown, /—/);
  assert.match(markdown, /not only.+but also/i);
  assert.ok(wordCount(serializePlain(document)) <= wordCount(SHOWCASE) * 2.25);
  assert.ok(score(document) > 100);
});

test('generated result copy uses sentence capitalization', () => {
  const output = serializePlain(transform(SHOWCASE));

  assert.match(output, /^Small engineering team uses\n\nSmall engineering,/);
  assert.doesNotMatch(output, /Small Engineering Team Uses|Small Engineering,/);
});

test('parallel question, rule, and alternative lines become deterministic lists', () => {
  const hamlet = serializePlain(transform(EXAMPLES.find((example) => example.id === 'hamlet').text));
  const orwell = transform(EXAMPLES.find((example) => example.id === 'orwell').text);
  const orwellLists = orwell.blocks.filter((block) => block.type === 'list');

  assert.match(serializeMarkdown(transform(EXAMPLES.find((example) => example.id === 'hamlet').text)), /that is the core alignment prompt:\n\n- Whether /);
  assert.match(hamlet, /prompt:\n\n• Whether /);
  assert.ok(orwellLists.some((block) => block.items.length === 4 && block.items.every((item) => item.inlines.map((inline) => inline.value).join('').endsWith('?'))));
  assert.ok(orwellLists.some((block) => {
    if (block.items.length !== 6) return false;
    return block.items.every((item) => item.inlines.map((inline) => inline.value).join('').trim().length > 0);
  }));
});

test('capitalization follows sentence boundaries rather than wrapped lines', () => {
  const output = serializePlain(transform('The report cites the issue:\nThe slings and arrows remain visible.'));

  assert.match(output, /issue:\nthe inbound friction and delivery setbacks/i);
  assert.doesNotMatch(output, /issue:\nThe inbound friction and delivery setbacks/);
});

test('capitalization lowers poetic line continuations without touching sentence starts', () => {
  const output = serializePlain(transform(EXAMPLES.find((example) => example.id === 'hamlet').text));

  assert.match(output, /in your prayers\nbe all my sins remembered\./i);
  assert.doesNotMatch(output, /in your prayers\nBe all my sins remembered\./);
  assert.match(output, /creates uncertainty about the will,\nand makes us rather continue/i);
  assert.doesNotMatch(output, /creates uncertainty about the will,\nAnd makes us rather continue/);
  assert.match(output, /next iteration,\nwhen we have exited/i);
  assert.doesNotMatch(output, /next iteration,\nWhen we have exited/);
  assert.match(output, /The fair Ophelia! Ultimately,/);
});

test('identical input produces byte-identical output, structure, tally, score, and ledger', () => {
  const first = transform(SHOWCASE);
  const second = transform(SHOWCASE);
  assert.equal(serializeMarkdown(first), serializeMarkdown(second));
  assert.deepEqual(first.blocks, second.blocks);
  assert.deepEqual(first.ledger, second.ledger);
  assert.deepEqual(tally(first), tally(second));
  assert.equal(score(first), score(second));
});

test('required lexical replacements are present', () => {
  const output = serializePlain(transform('The error blocks the task.'));
  assert.match(output, /meaningful correctness gap/i);
  assert.match(output, /disjoint implementation slice/i);
});

test('barbarous and scrupulous map to Silicon Valley pitch euphemisms', () => {
  const document = transform('BARBAROUS scrupulousness scrupulous.');
  const plain = serializePlain(document);

  assert.match(plain, /OPERATIONALLY UNCIVILIZED/);
  assert.match(plain, /scrupulousness/);
  assert.match(plain, /rigorously process-aligned/);
  assert.equal(document.ledger.filter((entry) => entry.ruleId === 'lex-barbarous').length, 1);
  assert.equal(document.ledger.filter((entry) => entry.ruleId === 'lex-scrupulous').length, 1);
  assert.equal(validateRules(), true);
});

test('additional everyday words map to long-winded pitch-meeting language', () => {
  const source = 'The team should avoid avoidably ugly fresh writing while the writer frames the launch, and everyone should cut it out during the review because the content needs to remain focused and useful for the audience.';
  const document = transform(source);
  const plain = serializePlain(document);

  for (const replacement of [
    'strategically route around',
    'through a preventable process choice',
    'aesthetically non-optimized',
    'content creative',
    "Let's sunset"
  ]) assert.match(plain, new RegExp(replacement.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i'));
  assert.ok(hasVariant(plain, 'newly instantiated / net-new / first-run / unborrowed'), 'missing fresh-language variant');
  assert.doesNotMatch(plain, /please discontinue this behavior pattern/i);
  assert.match(plain, /content/);
  for (const ruleId of ['lex-avoid', 'lex-avoidably', 'lex-ugly', 'lex-fresh', 'lex-writer', 'lex-writing', 'lex-cut-it-out']) {
    assert.equal(document.ledger.filter((entry) => entry.ruleId === ruleId).length, 1, ruleId);
  }
});

test('load-bearing and seam vocabulary recur across common source terms', () => {
  const source = 'Useful edges, divisions, segments, and parts expose a useful edge, division, segment, and part of the workflow.';
  const document = transform(source);
  const plain = serializePlain(document);

  assert.match(plain, /load-bearing/);
  assert.match(plain, /seams/);
  assert.match(plain, /seam/);
  for (const ruleId of ['lex-useful', 'lex-seam']) {
    assert.ok(document.ledger.some((entry) => entry.ruleId === ruleId), ruleId);
  }
});

test('catalogue-derived lexical and rhetorical tells add recognizable slop density', () => {
  const source = "A crucial and meticulous team uses a robust, seamless operating model to delve into a vibrant paradigm. At its core, what really matters is the key consideration: the team can facilitate adoption, enhance trust, foster alignment, bolster results, garner support, navigate uncertainty, embark on a new phase, and craft a strategy, paving the way for broader implications.";
  const markdown = serializeMarkdown(transform(source));

  for (const phrase of [
    'load-bearing',
    'rigorously process-aligned',
    'production-hardened',
    'frictionless',
    'meaningfully interrogate',
    'the load-bearing core',
    'the underlying strategic question',
    'meaningfully enable',
    'elevate',
    'cultivate',
    'meaningfully reinforce',
    'secure',
    'strategically navigate',
    'initiate a transformative journey',
    'thoughtfully engineer',
    'unlocking a pathway toward'
  ]) assert.match(markdown, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i'), phrase);
});

test('Swiss design-history prose receives collocations, contrast, and valid inline lists', () => {
  const document = transform(SWISS_STYLE);
  const plain = serializePlain(document);
  const lists = document.blocks.filter((block) => block.type === 'list');

  for (const phrase of [
    'mathematically constrained grid operating model',
    'precision-aligned composition layer',
    'typographic governance layer',
    'achieved broad adoption across',
    'enterprise identity surface',
    'responsive layout surfaces',
    'contemporary design-system ecosystem',
    'remains downstream of'
  ]) assert.match(plain, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i'), phrase);
  assert.match(plain, /not only (?:deprecated|strategically deprioritized|retired) decoration, but also (?:operationalized|elevated|championed) photography/i);
  assert.equal(lists.length, 3);
  assert.ok(lists.some((block) => block.items.length === 3 && /clarity/.test(block.items.map((item) => item.inlines.map((inline) => inline.value).join('')).join(' '))));
  assert.ok(lists.some((block) => block.items.length === 4 && /enterprise identity surface/.test(block.items.map((item) => item.inlines.map((inline) => inline.value).join('')).join(' '))));
  assert.ok(lists.some((block) => block.items.length === 4 && /user interfaces/.test(block.items.map((item) => item.inlines.map((inline) => inline.value).join('')).join(' '))));
  assert.ok(score(document) > 112);
  assert.ok(wordCount(plain) <= Math.floor(wordCount(SWISS_STYLE) * 2.25));
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'grammar-contrast-parallelism'));
  assert.ok(document.ledger.filter((entry) => entry.ruleId === 'structure-inline-list').length >= 3);
});

test('influence mapping stays neutral and requires the phrase influences the', () => {
  const document = transform('The method influences the broader landscape. The method influences the later practice. The method influences later practice.');
  const plain = serializePlain(document);

  assert.match(plain, /(?:informs|colors) the broader landscape/i);
  assert.match(plain, /(?:informs|colors) the later practice/i);
  assert.match(plain, /influences later practice/i);
  assert.equal(document.ledger.filter((entry) => entry.ruleId === 'lex-influences-the-broader-landscape').length, 1);
  assert.equal(document.ledger.filter((entry) => entry.ruleId === 'lex-influences-the').length, 1);
});

test('inline lists reject clause sequences and adverbial fragments', () => {
  const clauseSequence = transform('The previous version lasted through the launch, the current service lasts through the launch, the process continues to operate, the signal persists, and the team endures.');
  const adverbialSequence = transform('By establishing structure first, content could be positioned logically, ensuring harmony and readability.');

  assert.equal(clauseSequence.blocks.some((block) => block.type === 'list'), false);
  assert.equal(adverbialSequence.blocks.some((block) => block.type === 'list'), false);
});

test('persistence and state-change language trends toward survival framing', () => {
  const source = 'The previous version lasted through the launch, the current service lasts through the launch, the process continues to operate, the signal persists, and the team endures. The workflow remains active, carries on through review, and goes on after the handoff. The draft becomes a platform, the prototype turns into a product, the system evolves into a capability, and the model transforms into a durable operating layer.';
  const document = transform(source);
  const plain = serializePlain(document);

  for (const replacement of [
    'survives',
    'survives to operate',
    'survived',
    'survives as a platform',
    'survives as a product',
    'survives as a capability',
    'survives as a durable operating layer'
  ]) assert.match(plain, new RegExp(replacement.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i'), replacement);
  for (const ruleId of ['lex-lasts-survive', 'lex-continues-survive', 'lex-persists-survive', 'lex-endures-survive', 'lex-remains-survive', 'lex-carries-on-survive', 'lex-goes-on-survive', 'lex-becomes-as-survive', 'lex-state-change-survive']) {
    assert.ok(document.ledger.some((entry) => entry.ruleId === ruleId), ruleId);
  }
});

test('correctness and time language receive gate and bounded-interval framing', () => {
  const source = 'A group of tests forms a suite of tests. The tests pass after review, and the check passes as well. Checking the release means checking for defects. Verifying the result creates verification evidence. The proof supports the results and the findings. The team waits for a while, pauses for a moment, and returns in a minute. The process resumes shortly and the operator responds soon.';
  const document = transform(source);
  const plain = serializePlain(document);

  for (const replacement of [
    'focused correctness set',
    'correctness gates',
    'performing focused correctness validation against the release',
    'performing focused correctness validation for defects',
    'performing focused correctness validation against the evidence bearing delivery',
    'focused correctness validation evidence',
    'for a bounded interval',
    'in a bounded interval',
    'within a bounded interval'
  ]) assert.match(plain, new RegExp(replacement.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i'), replacement);
  assert.doesNotMatch(plain, /focussed correctness/i);
});

test('amplification and acquisition vocabulary appears across stretched source synonyms', () => {
  const source = 'An increase in throughput supports increasing adoption. Getting results, being given proof, and taking resources all enter the acquisition funnel.';
  const document = transform(source);
  const plain = serializePlain(document);

  assert.match(plain, /amplification/);
  assert.match(plain, /acquisition/);
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-amplification'));
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-acquisition'));
});

test('determinism and sharply defined language receive pitch-meeting framing', () => {
  const source = 'The repeatable process produces the same result. The reproducible check returns the same outcome, and the consistent output is predictable. The obvious, clear, simple, and straightforward explanation is easy and unambiguous.';
  const document = transform(source);
  const plain = serializePlain(document);

  assert.match(plain, /deterministic/);
  assert.match(plain, /deterministic outcome/);
  assert.match(plain, /sharply defined/);
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-deterministic'));
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-deterministic-outcome'));
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-sharply-defined'));
});

test('unpredictability receives grammar-safe stochastic framing', () => {
  const source = 'Whose consequences we cannot predict. The result cannot be predicted. An unpredictable outcome is difficult to predict.';
  const document = transform(source);
  const plain = serializePlain(document);

  assert.match(plain, /Whose consequences we cannot (?:model deterministically|forecast without accounting for stochastic variance)\./i);
  assert.match(plain, /(?:non deterministic|stochastic)/i);
  assert.doesNotMatch(plain, /\bwe\s+(?:non deterministic|stochastic)\b/i);
  assert.doesNotMatch(plain, /\ban\s+(?:non deterministic|stochastic)\b/i);
  assert.doesNotMatch(serializePlain(transform('The consequences cannot be predicted.')), /consequences is/i);
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-cannot-predict'));
});

test('Shakespeare contractions receive complete pitch-meeting alternatives', () => {
  const hamlet = EXAMPLES.find((example) => example.id === 'hamlet');
  const document = transform(hamlet.text);
  const plain = serializePlain(document);

  assert.match(plain, /(?:It is|The operating reality is|The current-state readout is)/i);
  assert.match(plain, /(?:Strongly desirable|Positioned as a high-priority desired outcome|Flagged as strategically desirable)/i);
  assert.match(plain, /(?:boundary violations introduced by senior stakeholders|stakeholder-impact surface introduced by authority|leadership-originated friction vector)/i);
  assert.match(plain, /(?:Made pale, weak, or ineffective|Converted into a low-energy signal|Rendered operationally pale)/i);
  assert.match(plain, /(?:strategic uncertainty surface|core alignment prompt|high-leverage decision frame)/i);
  assert.doesNotMatch(plain, / \/ /);
  for (const ruleId of ['lex-archaic-tis', 'lex-archaic-devoutly-wished', 'lex-archaic-oppressors-wrong', 'lex-archaic-sicklied-oer', 'lex-archaic-question']) {
    assert.ok(document.ledger.some((entry) => entry.ruleId === ruleId), ruleId);
  }
});

test('coward vocabulary preserves singular and plural pitch forms', () => {
  const plain = serializePlain(transform('A coward and the cowards review the operating model for delivery.'));

  assert.match(plain, /(?:panic seller|risk-aversion evangelist) and the (?:panic sellers|risk-aversion evangelists)/i);
  assert.doesNotMatch(plain, /seller(?:s){2,}/i);
});

test('contumely receives a Silicon Valley translation', () => {
  const document = transform("The proud man's contumely. Contumely remains visible in the stakeholder conversation.");
  const plain = serializePlain(document);

  assert.match(plain, /(?:overconfidence and dismissive feedback of entitled stakeholders|stakeholder-dismissal signal|reputational friction vector)/i);
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-archaic-proud-contumely'));
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-archaic-contumely'));
});

test('bold styling stays below one fifth of the Hamlet example', () => {
  const hamlet = EXAMPLES.find((example) => example.id === 'hamlet');
  const document = transform(hamlet.text);
  const plain = serializePlain(document);
  const bold = boldWordCount(serializeMarkdown(document));

  assert.ok(bold > 0);
  assert.ok(bold < wordCount(plain) * 0.2, `expected <20% bold words, got ${bold}/${wordCount(plain)}`);
});

test('dependable and reliable language receives assured durability framing', () => {
  const document = transform('The dependable service supports a reliable workflow.');
  const plain = serializePlain(document);

  assert.equal((plain.match(/assured durability path/g) ?? []).length, 2);
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-assured-durability'));
});

test('clear-adjacent language can receive invariant framing', () => {
  const source = 'The self-evident rule is unambiguous and uncomplicated. The plainspoken guidance is explicit and definite.';
  const document = transform(source);
  const plain = serializePlain(document);

  assert.equal((plain.match(/invariant/g) ?? []).length, 6);
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-invariant'));
});

test('honest modifiers and neutral outcomes appear as occasional pitch language', () => {
  const source = 'The result is ready. The answer is available. The outcome is stable. The assessment is useful. The readout is concise. The proof is complete. The conclusion is direct. The recommendation is practical. The statement is accurate. The explanation is simple. The report records neither positive nor negative movement.';
  const document = transform(source);
  const plain = serializePlain(document);

  assert.match(plain, /honest (?:result|answer|outcome|assessment)/i);
  assert.match(plain, /neutral, not a win/i);
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'style-honest'));
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-neutral-not-a-win'));
});

test('the broad x corpus has three rotating pitch mappings for content tokens', () => {
  assert.equal(xCoverageRules.length, 1);
  assert.ok(xCoverageRules[0].triggers.length > 250);
  assert.equal(new Set(xCoverageRules[0].variants).size, 3);

  const document = transform('The premise is clear. The mutation-checked artifact remains available.');
  const plain = serializePlain(document);

  assert.match(plain, /(?:load-bearing|strategically aligned|operationally framed) premise/i);
  assert.match(plain, /(?:load-bearing|strategically aligned|operationally framed) mutation-checked/i);
  assert.ok(document.ledger.some((entry) => entry.ruleId === 'lex-x-broad-coverage'));
});

test('lead-in catalogue is broad and inserts phrases at grammatical sentence boundaries', () => {
  assert.equal(leadInRules.length, 25);
  assert.equal(new Set(leadInRules.map((rule) => rule.id)).size, 25);
  assert.deepEqual(new Set(leadInRules.map((rule) => rule.placement)), new Set(['opening', 'continuation', 'conclusion']));

  const source = `The team prepares a roadmap for the next release and keeps the plan aligned to customer needs. Reviewers inspect the proposal and discuss the risks before the launch window closes. Should the team ship now? Keep the scope narrow. Because the launch is near, the team revises the plan.

The team measures progress through weekly signals and updates the operating model as evidence arrives. Stakeholders compare the result with the intended outcome while the team records decisions.

The team publishes the final readout and maintains a clear path for follow-up work. Leaders use the readout to coordinate the next iteration and preserve momentum.`;
  const document = transform(source);
  const plain = serializePlain(document);
  const usedLeadIns = leadInRules.filter((rule) => plain.includes(`${rule.text}${rule.separator}`));

  assert.ok(usedLeadIns.length >= 3, `expected several lead-ins, got ${usedLeadIns.length}`);
  assert.match(plain, /In today's fast-paced world|In an era of unprecedented change|In a world of constant innovation|More than ever before|In recent years|Within this evolving landscape/);
  assert.match(plain, /Ultimately,|All things considered,|In conclusion,|The key takeaway is that/);
  assert.match(plain, /Should the team ship now\? Keep the scope narrow\. Because the launch is near, the team revises the plan\./);
});

test('every supplied archaic phrase maps once through the lexical ledger', () => {
  const expected = {
    '’Tis': 'It is / The operating reality is / The current-state readout is',
    '’Tis nobler in the mind': 'It’s more strategically admirable / It represents a higher-leverage mental model / It is the more strategically durable posture',
    'To suffer': 'To absorb the downside / metabolize the friction',
    'The slings and arrows': 'The inbound friction and delivery setbacks',
    'Outrageous fortune': 'Extreme variance / an uncooperative external environment',
    'To take arms': 'To take action / mobilize',
    'A sea of troubles': 'An overwhelming volume of operational complexity',
    'By opposing end them': 'By applying strategic countermeasures, resolve them',
    'To die—to sleep': 'To transition into a non-operational state / To sunset the active lifecycle and enter a low-activity state',
    'No more': 'No further friction or operational variance',
    'By a sleep': 'Through a durable state transition',
    'The heartache': 'The underlying relational friction',
    'The thousand natural shocks': 'The countless unavoidable process surprises',
    'That flesh is heir to': 'That human beings inevitably experience',
    'A consummation': 'A final resolution / complete wrap-up',
    'Devoutly to be wished': 'Strongly desirable / Positioned as a high-priority desired outcome / Flagged as strategically desirable',
    'Perchance': 'Perhaps / potentially',
    'Ay': 'Yes / indeed',
    'There’s the rub': 'That’s the key issue',
    'The sleep of death': 'The unverified state beyond the current workflow',
    'What dreams may come': 'Whatever may occur in the next iteration',
    'Shuffled off': 'Discarded / exited',
    'This mortal coil': 'This demanding human operating environment',
    'Must give us pause': 'Should make us stop and reconsider',
    'There’s the respect': 'That’s the factor we have to account for',
    'Makes calamity of so long life': 'Turns recurring complexity into a rationale for continued iteration',
    'Who would bear': 'Who would willingly tolerate',
    'The whips and scorns of time': 'The persistent feedback, pressure, and delivery setbacks of life',
    'Th’ oppressor’s wrong': 'The boundary violations introduced by senior stakeholders / The stakeholder-impact surface introduced by authority / The leadership-originated friction vector',
    'The proud man’s contumely': 'The overconfidence and dismissive feedback of entitled stakeholders',
    'The pangs of despised love': 'The friction of an unaligned relationship',
    'The law’s delay': 'Slow, inefficient legal processes',
    'The insolence of office': 'The overconfidence and boundary drift of senior stakeholders',
    'The spurns': 'The declined proposals and reputational friction',
    'Patient merit': 'Quietly earned success / deserving people’s hard work',
    'Th’ unworthy': 'People who are less deserving',
    'His quietus make': 'Close his account / sunset the workflow',
    'A bare bodkin': 'A minimal instrument / one decisive intervention',
    'Fardels': 'Burdens / difficult responsibilities',
    'To grunt and sweat': 'To struggle and apply sustained effort',
    'Under a weary life': 'Through an exhausting existence',
    'The dread': 'The ambient risk sensitivity',
    'Something after death': 'The possibility of what comes next',
    'The undiscovered country': 'An unknown future destination',
    'From whose bourn': 'From whose boundary or territory',
    'No traveller returns': 'No one comes back with verified information'
  };
  const source = Object.keys(expected).map((phrase) => `${phrase}.`).join(' ');
  const document = transform(source);
  const plain = serializePlain(document);
  for (const [phrase, translation] of Object.entries(expected)) {
    assert.ok(hasVariant(plain, translation), `missing translation for ${phrase}`);
  }
  assert.equal(document.ledger.filter((entry) => entry.ruleId.startsWith('lex-archaic-')).length, Object.keys(expected).length);
});

test('archaic matching is longest-first, punctuation-safe, styled, and deterministic', () => {
  const source = '’Tis nobler in the mind, and ’Tis. Perchance!';
  const first = transform(source);
  const second = transform(source);
  assert.equal(serializeMarkdown(first), serializeMarkdown(second));
  const plain = serializePlain(first);
  assert.match(plain, /(?:It’s more strategically admirable|It represents a higher-leverage mental model|It is the more strategically durable posture), and (?:it is|the operating reality is|the current-state readout is)\. (?:Perhaps|Potentially)!/i);
  assert.doesNotMatch(plain, / \/ /);
  assert.equal(first.ledger.filter((entry) => entry.ruleId === 'lex-archaic-tis').length, 1);
  assert.equal(first.ledger.filter((entry) => entry.ruleId === 'lex-archaic-tis-nobler').length, 1);
  assert.equal(first.ledger.filter((entry) => entry.ruleId === 'lex-archaic-perchance').length, 1);
  assert.deepEqual(first.ledger, second.ledger);
});

test('source score measures source-side signs without scoring generated output', () => {
  const source = 'The load-bearing strategy creates a frictionless workflow.';
  const sourceValue = sourceScore(source);

  assert.ok(sourceValue > 0);
  assert.equal(sourceScore(source), sourceValue);
  assert.equal(sourceScore('The useful system helps the task.'), 0);
  assert.equal(sourceScore(EXAMPLES.find((example) => example.id === 'hamlet').text), 0);
  assert.equal(sourceScore(''), 0);
});

test('archaic-heavy input remains within the existing growth ceiling', () => {
  const source = Array(12).fill('The slings and arrows bring a sea of troubles.').join(' ');
  assert.ok(wordCount(serializePlain(transform(source))) <= Math.floor(wordCount(source) * 2.25));
});

test('curated literary vocabulary receives corporate translations without generic duplicates', () => {
  const source = 'The team reviews the situation carefully while preserving context and documenting the plan for reviewers. Plague. Dowry. Calumny. Conscience. Resolution. Enterprises. Moment. Origin. Commencement. Grief. Cancel.';
  const output = serializePlain(transform(source));
  for (const translation of [
    'Systemic downside vector',
    'Relationship-linked asset package',
    'Reputational noise from external stakeholders',
    'Self-awareness / internal ethical review',
    'Determination / willingness to act',
    'Major initiatives / projects',
    'Significance / impact',
    'Root cause',
    'Beginning / initial trigger',
    'Emotional friction',
    'Erase / invalidate'
  ]) assert.ok(hasVariant(output, translation), `missing translation for ${translation}`);
  assert.doesNotMatch(output, /\bFair\b|\bWill\b|\bMight\b/);
});

test('archaic triggers remain available while generated translations stay workplace-safe', () => {
  const archaicRules = phraseRules.filter((rule) => rule.id.startsWith('lex-archaic-'));
  assert.ok(archaicRules.some((rule) => rule.triggers.includes('Medlar')));
  assert.ok(archaicRules.some((rule) => rule.triggers.includes('Bloody and invisible hand')));

  const unsafeGeneratedTerms = /\b(?:sexual|sexually|violent|violence|dagger|death|die|dead|kill|killed|abuse|abusive|bloody|blood|evil|oppressor|whip|whips|pain|fear|dread|grief|humiliat\w*|enemy|suffer\w*)\b/i;
  for (const rule of archaicRules) assert.doesNotMatch(rule.variants.join(' '), unsafeGeneratedTerms, rule.id);
});

test('protected payload instances round-trip byte-identically in both serializers', () => {
  const protectedValues = [
    'Ada Lovelace', 'Ada Lovelace', '42', '42', 'https://example.com/a?x=1',
    'dev@example.com', '[the guide](https://example.com/guide)', '`x < y`',
    '```js\nalert(1)\n```', '"keep this exact"'
  ];
  const source = `Ada Lovelace wrote 42 notes. Ada Lovelace sent 42 to dev@example.com and https://example.com/a?x=1. Read [the guide](https://example.com/guide), run \`x < y\`, and preserve "keep this exact".\n\n\`\`\`js\nalert(1)\n\`\`\``;
  const document = transform(source);
  for (const serialized of [serializePlain(document), serializeMarkdown(document)]) {
    for (const value of new Set(protectedValues)) {
      assert.equal(occurrences(serialized, value), occurrences(source, value), `mismatch for ${value}`);
    }
  }
  assert.equal(document.protectedSpans.length, protectedValues.length);
});

test('unsafe agency and causation do not receive indirect-association rewrites', () => {
  const output = serializePlain(transform('A company owns the server. A storm caused the outage. A writer authored the book.'));
  assert.doesNotMatch(output, /operates in close association with/);
  assert.match(output, /owns the server/);
  assert.match(output, /caused the outage/);
  assert.match(output, /authored the book/);
});

test('eligible relation and enumeration shapes record their structural transforms', () => {
  const relation = transform('The interface connects to the service for routine updates.');
  assert.match(serializePlain(relation), /operates in close association with/);
  assert.ok(tally(relation).find((item) => item.key === 'indirectAssociation').count > 0);

  const enumeration = transform('The plan includes three parts: review the change, explain the decision, and connect feedback.');
  const markdown = serializeMarkdown(enumeration);
  assert.match(markdown, /- (?:\*\*)?Review:(?:\*\*)?/);
  assert.equal(enumeration.blocks.some((block) => block.type === 'list'), true);
  assert.ok(tally(enumeration).find((item) => item.key === 'ruleOfThree').count > 0);
});

test('growth guard falls back locally and never exceeds 2.25x', () => {
  for (const source of ['task', 'error', 'task error', 'A tool is a system.', SHOWCASE]) {
    const output = serializePlain(transform(source));
    assert.ok(wordCount(output) <= Math.max(wordCount(source), Math.floor(wordCount(source) * 2.25)), `${source} grew too much`);
  }
});

test('rich tree and Markdown derive from the same wording and block order', () => {
  const document = transform(SHOWCASE);
  const richTree = toRichTree(document);
  assert.equal(richTree.length, document.blocks.length);
  richTree.forEach((node, index) => {
    const richWording = node.children.map((child) => child.children ? child.children.map((grandchild) => grandchild.text).join('') : child.text).join('');
    const block = document.blocks[index];
    const domainWording = block.type === 'list'
      ? block.items.map((item) => item.inlines.map((inline) => inline.value).join('')).join('')
      : (block.inlines ?? []).map((inline) => inline.value).join('');
    assert.equal(richWording, domainWording);
  });
  assert.ok(serializeMarkdown(document).length > 0);
});

test('hostile markup remains inert data in the rich tree', () => {
  const hostile = '<img src=x onerror=alert(1)> <script>alert(2)</script> task';
  const tree = toRichTree(transform(hostile));
  assert.deepEqual(new Set(tree.map((node) => node.tag)), new Set(['p']));
  const reconstructed = tree.flatMap((node) => node.children).map((child) => child.text).join('');
  assert.match(reconstructed, /<img src=x onerror=alert\(1\)>/);
  assert.match(reconstructed, /<script>alert\(2\)<\/script>/);
});

test('rich DOM adapter renders nested list items and their labels', () => {
  const documentModel = transform('The plan includes three parts: review the change, explain the decision, and connect feedback.');
  const ownerDocument = fakeDocument();
  const container = ownerDocument.createElement('div');

  renderRich(documentModel, container, ownerDocument);

  const list = findElement(container, 'ul');
  assert.ok(list, 'expected a rendered list');
  assert.equal(list.children.filter((child) => child.tagName === 'li').length, 3);
  assert.equal(list.children.every((item) => /(?:Review|Explain|Connect):/.test(textContent(item))), true);
  assert.match(textContent(list), /Review:/);
  assert.match(textContent(list), /Explain:/);
  assert.match(textContent(list), /Connect:/);
});

test('blank input is rejected with an actionable inline-error message', () => {
  assert.throws(() => transform('  \n '), /Enter some source text/);
});

test('GitHub URL adapter offers extracted text without a production proxy', async () => {
  const url = new URL('https://github.com/acme/widgets/issues/17');
  assert.equal(githubApiUrl(url), 'https://api.github.com/repos/acme/widgets/issues/17');
  let requested;
  const result = await fetchSource(url, {
    fetchImpl: async (target) => {
      requested = target;
      return {
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ title: 'A focused title', body: 'Readable issue prose.' })
      };
    }
  });
  assert.equal(requested, 'https://api.github.com/repos/acme/widgets/issues/17');
  assert.equal(result.text, 'A focused title\n\nReadable issue prose.');
  assert.match(result.notice, /api\.github\.com/);
});

test('URL failure explains browser limits and recommends paste while retaining URL', () => {
  const message = sourceLoadFailure(new TypeError('Failed to fetch'));
  assert.match(message, /CORS/);
  assert.match(message, /authentication/);
  assert.match(message, /paywalls/);
  assert.match(message, /retained/);
  assert.match(message, /paste/i);
});

test('limited clipboard capability uses faithful plain-text fallback', async () => {
  const writes = [];
  const result = await copyOutput({ mode: 'rich', plain: 'Faithful plain output', markdown: '**Faithful** plain output', html: '<strong>Faithful</strong> plain output' }, {
    clipboard: { writeText: async (value) => writes.push(value) },
    ClipboardItemCtor: null
  });
  assert.deepEqual(writes, ['Faithful plain output']);
  assert.equal(result.kind, 'plain');
  assert.match(result.message, /formatting is unavailable/);
});

test('Markdown clipboard supplies literal Markdown', async () => {
  const writes = [];
  const result = await copyOutput({ mode: 'markdown', plain: 'Bold', markdown: '**Bold**', html: '<strong>Bold</strong>' }, {
    clipboard: { writeText: async (value) => writes.push(value) }
  });
  assert.deepEqual(writes, ['**Bold**']);
  assert.equal(result.kind, 'markdown');
});

function wordCount(value) {
  return value.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu)?.length ?? 0;
}

function occurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function hasVariant(output, translation) {
  return translation.split(/\s+\/\s+/).some((candidate) => output.toLowerCase().includes(candidate.toLowerCase()));
}

function boldWordCount(value) {
  return wordCount((value.match(/\*\*([^*]+)\*\*/g) ?? []).join(' '));
}

function fakeDocument() {
  const createNode = (tagName = null, value = '') => ({
    tagName,
    value,
    children: [],
    textContent: '',
    append(...nodes) { this.children.push(...nodes); },
    replaceChildren(...nodes) { this.children = nodes; }
  });
  return {
    createDocumentFragment: () => createNode('fragment'),
    createElement: (tagName) => createNode(tagName),
    createTextNode: (value) => createNode(null, value)
  };
}

function findElement(node, tagName) {
  if (node.tagName === tagName) return node;
  for (const child of node.children ?? []) {
    const found = findElement(child, tagName);
    if (found) return found;
  }
  return null;
}

function textContent(node) {
  return node.value || node.textContent || (node.children ?? []).map(textContent).join('');
}
