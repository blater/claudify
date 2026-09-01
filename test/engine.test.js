import assert from 'node:assert/strict';
import test from 'node:test';
import { copyOutput } from '../src/browser/clipboard.js';
import { renderRich } from '../src/browser/render.js';
import { score, serializeMarkdown, serializePlain, tally, toRichTree, transform } from '../src/domain/index.js';
import { fetchSource, githubApiUrl, sourceLoadFailure } from '../src/browser/url.js';

const SHOWCASE = `A small engineering team uses a review tool to improve releases. The system is a simple way to show errors before customers see them, and it helps each task stay focused. The team has three goals: catch risky changes early, explain decisions clearly, and keep feedback connected to the code.

The process starts when an engineer opens a change. Reviewers read the proposal and discuss its context. The tool connects comments to exact lines and shows which checks passed. This keeps the conversation practical, but the team still decides what matters.

The team measures results over time. Faster reviews are useful, clear ownership is important, and fewer production problems help everyone. The process does not replace judgment; it gives people a shared place to work and learn.`;

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
  assert.ok(score(document) > 0 && score(document) <= 100);
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

test('every supplied archaic phrase maps once through the lexical ledger', () => {
  const expected = {
    '’Tis': 'It is',
    '’Tis nobler in the mind': 'It’s more strategically admirable',
    'To suffer': 'To endure / absorb the downside',
    'The slings and arrows': 'The attacks and setbacks',
    'Outrageous fortune': 'Extreme bad luck / a hostile external environment',
    'To take arms': 'To take action / mobilize',
    'A sea of troubles': 'An overwhelming volume of problems',
    'By opposing end them': 'By actively pushing back, eliminate them',
    'To die—to sleep': 'To die is essentially to shut down',
    'No more': 'No further pain or disruption',
    'By a sleep': 'Through death / permanent shutdown',
    'The heartache': 'Emotional pain',
    'The thousand natural shocks': 'The countless unavoidable difficulties',
    'That flesh is heir to': 'That human beings inevitably experience',
    'A consummation': 'A final resolution / complete wrap-up',
    'Devoutly to be wished': 'Strongly desirable',
    'Perchance': 'Perhaps / potentially',
    'Ay': 'Yes / indeed',
    'There’s the rub': 'That’s the key issue',
    'The sleep of death': 'The unknown state after death',
    'What dreams may come': 'Whatever may happen afterward',
    'Shuffled off': 'Discarded / exited',
    'This mortal coil': 'This difficult human existence',
    'Must give us pause': 'Should make us stop and reconsider',
    'There’s the respect': 'That’s the factor we have to account for',
    'Makes calamity of so long life': 'Turns life’s problems into a reason to keep enduring them',
    'Who would bear': 'Who would willingly tolerate',
    'The whips and scorns of time': 'The constant criticism, pressure, and setbacks of life',
    'Th’ oppressor’s wrong': 'The abuse inflicted by powerful people',
    'The proud man’s contumely': 'The arrogance and insults of entitled people',
    'The pangs of despised love': 'The pain of rejected or unreturned love',
    'The law’s delay': 'Slow, inefficient legal processes',
    'The insolence of office': 'The arrogance and abuse of people in positions of authority',
    'The spurns': 'The rejections and humiliations',
    'Patient merit': 'Quietly earned success / deserving people’s hard work',
    'Th’ unworthy': 'People who are less deserving',
    'His quietus make': 'End his account / shut down his existence',
    'A bare bodkin': 'A simple dagger / one decisive action',
    'Fardels': 'Burdens / difficult responsibilities',
    'To grunt and sweat': 'To struggle and work painfully hard',
    'Under a weary life': 'Through an exhausting existence',
    'The dread': 'The fear',
    'Something after death': 'The possibility of what comes next',
    'The undiscovered country': 'An unknown future destination',
    'From whose bourn': 'From whose boundary or territory',
    'No traveller returns': 'No one comes back with verified information'
  };
  const source = Object.keys(expected).map((phrase) => `${phrase}.`).join(' ');
  const document = transform(source);
  const plain = serializePlain(document);
  for (const [phrase, translation] of Object.entries(expected)) {
    assert.ok(plain.includes(translation), `missing translation for ${phrase}`);
  }
  assert.equal(document.ledger.filter((entry) => entry.ruleId.startsWith('lex-archaic-')).length, Object.keys(expected).length);
});

test('archaic matching is longest-first, punctuation-safe, styled, and deterministic', () => {
  const source = '’Tis nobler in the mind, and ’Tis. Perchance!';
  const first = transform(source);
  const second = transform(source);
  assert.equal(serializeMarkdown(first), serializeMarkdown(second));
  assert.match(serializeMarkdown(first), /\*\*It’s more strategically admirable\*\*, and \*\*It is\*\*\. \*\*Perhaps \/ potentially\*\*!/);
  assert.equal(first.ledger.filter((entry) => entry.ruleId === 'lex-archaic-tis').length, 1);
  assert.equal(first.ledger.filter((entry) => entry.ruleId === 'lex-archaic-tis-nobler').length, 1);
  assert.equal(first.ledger.filter((entry) => entry.ruleId === 'lex-archaic-perchance').length, 1);
  assert.deepEqual(first.ledger, second.ledger);
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
    'Marriage-related asset package',
    'Damaging public criticism',
    'Self-awareness / internal ethical review',
    'Determination / willingness to act',
    'Major initiatives / projects',
    'Significance / impact',
    'Root cause',
    'Beginning / initial trigger',
    'Emotional distress',
    'Erase / invalidate'
  ]) assert.match(output, new RegExp(translation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  assert.doesNotMatch(output, /\bFair\b|\bWill\b|\bMight\b/);
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
  assert.match(markdown, /- \*\*Review:\*\*/);
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

test('rich DOM adapter renders nested list items and their bold labels', () => {
  const documentModel = transform('The plan includes three parts: review the change, explain the decision, and connect feedback.');
  const ownerDocument = fakeDocument();
  const container = ownerDocument.createElement('div');

  renderRich(documentModel, container, ownerDocument);

  const list = findElement(container, 'ul');
  assert.ok(list, 'expected a rendered list');
  assert.equal(list.children.filter((child) => child.tagName === 'li').length, 3);
  assert.equal(list.children.every((item) => findElement(item, 'strong')), true);
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
