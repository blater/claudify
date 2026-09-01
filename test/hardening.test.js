import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { copyOutput } from '../src/browser/clipboard.js';
import { renderRich } from '../src/browser/render.js';
import { fetchSource, githubApiUrl } from '../src/browser/url.js';
import { createDocument, protectedText, text } from '../src/domain/document.js';
import { score, serializeMarkdown, serializePlain, tally, transform, validateDocument } from '../src/domain/index.js';
import { createRequestGate, nextTabIndex } from '../src/presentation/state.js';
import { collectFamilies, isFlagged, scoreBearingFamilies } from './oracle-helpers.js';

test('accepted protected forms round-trip exactly without marker or bold collisions', () => {
  const payloads = [
    '```txt\r\nerror\r\ntask\r\n```',
    '~~~js\nerror()\n~~~',
    '    const error = task;',
    '"a quotation\nwith error and task"',
    '“a curly quotation\nwith error and task”',
    '[guide](https://example.com/a_(b)/c)',
    'https://example.com/a_(b)/c',
    'ACME RESEARCH LABS',
    '@@CLAUDIFY_PROTECTED_0@@',
    '@@CPS_X_0@@',
    '**literal bold**',
    '**'
  ];
  const source = payloads.join('\n\n');
  const document = transform(source);
  for (const output of [serializePlain(document), serializeMarkdown(document)]) {
    for (const payload of payloads) assert.ok(output.includes(payload), `missing protected payload: ${payload}`);
  }
});

test('archaic phrases stay byte-identical in protected spans and never match substrings', () => {
  const source = [
    '`Perchance`',
    'https://example.com/Perchance',
    '[Perchance](https://example.com/Perchance)',
    '"Perchance"',
    '**Perchance**',
    'ACME PERCHANCE LABS',
    '42',
    'perchanceful day'
  ].join('\n\n');
  const document = transform(source);
  for (const output of [serializePlain(document), serializeMarkdown(document)]) {
    for (const payload of ['`Perchance`', 'https://example.com/Perchance', '[Perchance](https://example.com/Perchance)', '"Perchance"', '**Perchance**', 'ACME PERCHANCE LABS', '42']) {
      assert.ok(output.includes(payload), `missing protected payload: ${payload}`);
    }
    assert.doesNotMatch(output, /\*\*Perhaps \/ potentially\*\*/);
    assert.match(output, /perchanceful day/);
  }
  assert.equal(document.ledger.filter((entry) => entry.ruleId === 'lex-archaic-perchance').length, 0);
});

test('auxiliary possession and ambiguous colon prose pass through conservative recognizers', () => {
  const auxiliary = serializePlain(transform('She has not finished the review. They had already completed the task.'));
  assert.match(auxiliary, /has not finished/);
  assert.match(auxiliary, /had already completed/);
  assert.doesNotMatch(auxiliary, /features not|featured already/);

  for (const source of [
    'The plan includes: review changes, including tests, explain decisions, and connect feedback.',
    'The plan includes three parts: review changes, explain decisions, connect feedback.',
    'A note: concise, practical prose is useful here, and elsewhere.'
  ]) {
    assert.equal(transform(source).blocks.some((block) => block.type === 'list'), false, source);
  }
});

test('documents are deeply frozen and malformed structures fail before serialization', () => {
  const blocks = [{ type: 'list', ordered: false, items: [{ type: 'listItem', inlines: [{ type: 'text', value: 'Item', bold: true }] }] }];
  const ledger = [{ ruleId: 'x', category: 'list', sourceNode: 0, sourceOffset: 0 }];
  const spans = [{ index: 0, value: '42', start: 0, end: 2, marker: 'internal' }];
  const document = createDocument(blocks, ledger, 1, []);
  blocks[0].items[0].inlines[0].value = 'mutated';
  ledger[0].category = 'bold';
  assert.equal(serializePlain(document), '• Item');
  assert.ok(Object.isFrozen(document.blocks[0].items[0].inlines));
  assert.ok(Object.isFrozen(document.blocks[0].items[0].inlines[0]));
  assert.ok(Object.isFrozen(document.ledger[0]));
  const protectedDocument = createDocument(
    [{ type: 'paragraph', inlines: [protectedText('42', '0:2')] }],
    [],
    1,
    [{ index: 0, value: '42', start: 0, end: 2, marker: 'internal' }]
  );
  assert.ok(Object.isFrozen(protectedDocument.protectedSpans[0]));
  assert.throws(() => validateDocument({ type: 'document', blocks: [{ type: 'paragraph' }], ledger: [], protectedSpans: [] }), /inline array/);
  assert.throws(() => serializePlain({ type: 'document', blocks: [{ type: 'list' }], ledger: [], protectedSpans: [] }), /item array/);
  assert.throws(() => createDocument([{ type: 'list', items: [{}] }], [], 0, spans), /Malformed list item/);
});

test('score weights, per-category saturation, and global cap are exact', () => {
  const make = (categories) => createDocument(
    [{ type: 'paragraph', inlines: [text('x')] }],
    categories.map((category, index) => ({ ruleId: `r-${index}`, category, sourceNode: 0, sourceOffset: index })),
    1,
    []
  );
  assert.equal(score(make(['negativeParallelism'])), 10);
  assert.equal(score(make(Array(5).fill('negativeParallelism'))), 44);
  assert.equal(score(make(Array(6).fill('negativeParallelism'))), 44, 'sixth entry must be saturated');
  const denseCategories = ['negativeParallelism', 'list', 'copulaAvoidance', 'indirectAssociation', 'ruleOfThree', 'significance', 'awkwardness', 'heading'];
  assert.equal(score(make(denseCategories.flatMap((category) => Array(5).fill(category)))), 100);

  const source = 'A tool is a system that helps a team complete a task without an error.';
  assert.ok(wordCount(serializePlain(transform(source))) <= Math.floor(wordCount(source) * 2.25));
});

test('URL adapter handles plain text, readable HTML blocks, empties, ceilings, boundaries, and timeout', async () => {
  const plain = await fetchSource(new URL('https://example.com/plain'), {
    fetchImpl: async () => response('  useful text  ', 'text/plain')
  });
  assert.equal(plain.text, 'useful text');

  const html = await fetchSource(new URL('https://example.com/article'), {
    fetchImpl: async () => response('<html></html>', 'text/html'),
    Parser: class {
      parseFromString() {
        const emptyArticle = element('ARTICLE', [textNode('   ')]);
        const main = element('MAIN', [element('P', [textNode('First block')]), element('P', [textNode('Second block')])]);
        return { body: element('BODY', [textNode('fallback')]), querySelectorAll: (selector) => selector === 'article, main' ? [emptyArticle, main] : [] };
      }
    }
  });
  assert.equal(html.text, 'First block\nSecond block');

  await assert.rejects(fetchSource(new URL('https://example.com/empty'), { fetchImpl: async () => response(' \n\t ', 'text/plain') }), /only whitespace/);
  await assert.rejects(fetchSource(new URL('https://example.com/large'), { maxBytes: 4, fetchImpl: async () => response('12345', 'text/plain') }), /exceeds/);
  await assert.rejects(fetchSource(new URL('https://example.com/declared'), { maxBytes: 4, fetchImpl: async () => response('x', 'text/plain', { 'content-length': '5' }) }), /exceeds/);
  assert.equal(githubApiUrl(new URL('https://github.com/acme/widgets/issues/17comments')), null);
  assert.equal(githubApiUrl(new URL('https://github.com/acme/widgets/pull/17/files')), 'https://api.github.com/repos/acme/widgets/pulls/17');
  await assert.rejects(fetchSource(new URL('https://example.com/slow'), {
    timeoutMs: 5,
    fetchImpl: (_target, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true }))
  }), /timed out/);
});

test('request generations abort stale loads and tab navigation wraps deterministically', () => {
  const gate = createRequestGate();
  const first = gate.begin();
  const second = gate.begin();
  assert.equal(first.signal.aborted, true);
  assert.equal(gate.isCurrent(first), false);
  assert.equal(gate.isCurrent(second), true);
  gate.invalidate();
  assert.equal(second.signal.aborted, true);
  assert.deepEqual(['ArrowRight', 'ArrowLeft', 'Home', 'End', 'Escape'].map((key) => nextTabIndex(0, key, 2)), [1, 1, 0, 1, null]);
});

test('oracle helpers reject empty evidence and classify score-bearing families', () => {
  for (const value of [{}, { count: 0 }, { matches: [] }, { samples: [] }, { found: false }, []]) assert.equal(isFlagged(value), false);
  assert.equal(isFlagged({ count: 2, matches: ['x'] }), true);
  const families = collectFamilies({ '16_ing_tail': { count: 1, matches: ['x'] }, '17_parallel': { count: 0 }, '58_dash': ['x'], _metrics: { id: 71 } });
  assert.deepEqual([...families], [16, 58]);
  assert.deepEqual(scoreBearingFamilies(families), [16]);
});

test('rich clipboard writes both MIME types and hostile markup never becomes hostile DOM', async () => {
  let clipboardPayload;
  class FakeBlob {
    constructor(parts, options) { this.parts = parts; this.type = options.type; }
  }
  class FakeClipboardItem {
    constructor(payload) { clipboardPayload = payload; }
  }
  const writes = [];
  const result = await copyOutput({ mode: 'rich', plain: 'Plain', markdown: '**Plain**', html: '<strong>Plain</strong>' }, {
    clipboard: { write: async (items) => writes.push(items) },
    ClipboardItemCtor: FakeClipboardItem,
    BlobCtor: FakeBlob
  });
  assert.equal(result.kind, 'rich');
  assert.deepEqual(Object.keys(clipboardPayload).sort(), ['text/html', 'text/plain']);
  assert.equal(clipboardPayload['text/plain'].parts[0], 'Plain');
  assert.equal(clipboardPayload['text/html'].parts[0], '<strong>Plain</strong>');
  assert.equal(writes.length, 1);

  const ownerDocument = fakeRenderingDocument();
  const container = ownerDocument.createElement('div');
  renderRich(transform('<img src=x onerror=alert(1)> <script>alert(2)</script> task'), container, ownerDocument);
  assert.equal(ownerDocument.createdTags.includes('img'), false);
  assert.equal(ownerDocument.createdTags.includes('script'), false);
  assert.match(nodeText(container), /<img src=x onerror=alert\(1\)>/);
});

test('app wiring transforms and invalidates stale output after source edits', async () => {
  const previousDocument = globalThis.document;
  const fake = fakeAppDocument();
  globalThis.document = fake;
  try {
    await import(`../src/app.js?hardening=${Date.now()}`);
    const source = fake.getElementById('source-text');
    const transformButton = fake.getElementById('transform-button');
    source.value = 'A review tool is a system that helps the task and shows an error.';
    source.dispatch('input');
    assert.equal(transformButton.disabled, false);
    transformButton.dispatch('click');
    assert.equal(fake.getElementById('copy-button').disabled, false);
    assert.notEqual(fake.getElementById('slop-score').textContent, '—');
    source.value = 'replacement source';
    source.dispatch('input');
    assert.equal(fake.getElementById('copy-button').disabled, true);
    assert.equal(fake.getElementById('markdown-output').value, '');
    assert.equal(fake.getElementById('slop-score').textContent, '—');
  } finally {
    globalThis.document = previousDocument;
  }
});

test('tab panels expose labelled accessibility relationships', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="rich-tab"[^>]+aria-controls="rich-output"/);
  assert.match(html, /id="rich-output"[^>]+role="tabpanel"[^>]+aria-labelledby="rich-tab"/);
  assert.match(html, /id="markdown-output"[^>]+role="tabpanel"[^>]+aria-labelledby="markdown-tab"/);
});

function response(body, contentType, extraHeaders = {}) {
  return { ok: true, status: 200, headers: new Headers({ 'content-type': contentType, ...extraHeaders }), text: async () => body };
}

function textNode(value) { return { nodeValue: value, textContent: value, childNodes: [] }; }
function element(tagName, childNodes) { return { tagName, childNodes, textContent: childNodes.map((node) => node.textContent ?? '').join('') }; }

function wordCount(value) { return value.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu)?.length ?? 0; }

function fakeRenderingDocument() {
  const createdTags = [];
  const make = (tagName = null, value = '') => ({ tagName, value, children: [], textContent: '', append(...nodes) { this.children.push(...nodes); }, replaceChildren(...nodes) { this.children = nodes; } });
  return {
    createdTags,
    createDocumentFragment: () => make('fragment'),
    createElement: (tagName) => { createdTags.push(tagName); return make(tagName); },
    createTextNode: (value) => make(null, value)
  };
}

function nodeText(node) { return node.value || node.textContent || (node.children ?? []).map(nodeText).join(''); }

function fakeAppDocument() {
  const elements = new Map();
  const make = (tagName = 'div', id = '') => {
    const node = {
      id, tagName, children: [], listeners: new Map(), dataset: {}, attributes: {}, value: '', textContent: '', innerHTML: '', disabled: false, hidden: false, tabIndex: 0,
      append(...children) { this.children.push(...children); },
      replaceChildren(...children) { this.children = children; this.textContent = ''; },
      addEventListener(type, listener) { const list = this.listeners.get(type) ?? []; list.push(listener); this.listeners.set(type, list); },
      dispatch(type, extra = {}) { for (const listener of this.listeners.get(type) ?? []) listener({ key: '', preventDefault() {}, ...extra }); },
      setAttribute(name, value) { this.attributes[name] = value; },
      focus() { document.activeElement = this; }
    };
    if (id) elements.set(id, node);
    return node;
  };
  const ids = ['source-text', 'source-url', 'transform-button', 'example-button', 'clear-button', 'load-url-button', 'source-status', 'output-status', 'rich-output', 'markdown-output', 'slop-score', 'sign-tally', 'copy-button'];
  ids.forEach((id) => make(id.includes('button') ? 'button' : 'div', id));
  const richTab = make('button', 'rich-tab'); richTab.dataset.tab = 'rich';
  const markdownTab = make('button', 'markdown-tab'); markdownTab.dataset.tab = 'markdown';
  return {
    activeElement: null,
    getElementById: (id) => elements.get(id),
    querySelectorAll: (selector) => selector === '[role="tab"]' ? [richTab, markdownTab] : [],
    createDocumentFragment: () => make('fragment'),
    createElement: (tagName) => make(tagName),
    createTextNode: (value) => ({ tagName: null, value, children: [] })
  };
}
