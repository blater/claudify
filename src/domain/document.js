import { scoreWeights, tallyDefinitions } from './rules.js';

export function text(value, bold = false) {
  return Object.freeze({ type: 'text', value, bold });
}

export function protectedText(value, sourceRange) {
  return Object.freeze({ type: 'protected', value, sourceRange });
}

export function createDocument(blocks, ledger, sourceWordCount, protectedSpans = []) {
  validateDocument({ type: 'document', blocks, ledger, sourceWordCount, protectedSpans });
  const frozenBlocks = blocks.map(freezeBlock);
  const frozenLedger = ledger.map((entry) => Object.freeze({ ...entry }));
  const frozenSpans = protectedSpans.map((span) => Object.freeze({ ...span }));
  const document = Object.freeze({
    type: 'document',
    blocks: Object.freeze(frozenBlocks),
    ledger: Object.freeze(frozenLedger),
    sourceWordCount,
    protectedSpans: Object.freeze(frozenSpans)
  });
  validateDocument(document);
  return document;
}

export function tally(document) {
  validateDocument(document);
  const counts = Object.fromEntries(tallyDefinitions.map(([key]) => [key, 0]));
  for (const entry of document.ledger) counts[entry.category] = (counts[entry.category] ?? 0) + 1;
  return tallyDefinitions.map(([key, label]) => Object.freeze({ key, label, count: counts[key] ?? 0 }));
}

export function score(document) {
  const counts = tally(document).filter((item) => item.count > 0);
  const weighted = counts.reduce((total, item) => total + (scoreWeights[item.key] ?? 1) * Math.min(item.count, 5), 0);
  return Math.min(100, Math.round(weighted * 1.7 + counts.length * 1.8));
}

export function serializePlain(document) {
  validateDocument(document);
  return document.blocks.map((block) => blockPlain(block)).join('\n\n');
}

export function serializeMarkdown(document) {
  validateDocument(document);
  return document.blocks.map((block) => blockMarkdown(block)).join('\n\n');
}

export function toRichTree(document) {
  validateDocument(document);
  return document.blocks.map((block) => {
    if (block.type === 'heading') return { tag: `h${block.level}`, children: richInlines(block.inlines) };
    if (block.type === 'paragraph') return { tag: 'p', children: richInlines(block.inlines) };
    if (block.type === 'thematicBreak') return { tag: 'hr', children: [] };
    if (block.type === 'list') {
      return { tag: block.ordered ? 'ol' : 'ul', children: block.items.map((item) => ({ tag: 'li', children: richInlines(item.inlines) })) };
    }
    throw new TypeError(`Unknown block type: ${block.type}`);
  });
}

export function validateDocument(document) {
  if (document?.type !== 'document' || !Array.isArray(document.blocks) || !Array.isArray(document.ledger) || !Array.isArray(document.protectedSpans)) {
    throw new TypeError('Malformed transformed document');
  }
  const seenProtected = new Map();
  for (const block of document.blocks) {
    if (!['heading', 'paragraph', 'list', 'thematicBreak'].includes(block.type)) throw new TypeError(`Malformed block: ${block.type}`);
    if (block.type === 'heading' && (!Number.isInteger(block.level) || block.level < 1 || block.level > 6)) throw new TypeError('Invalid heading level');
    if ((block.type === 'heading' || block.type === 'paragraph') && !Array.isArray(block.inlines)) throw new TypeError(`${block.type} requires an inline array`);
    if (block.type === 'list' && !Array.isArray(block.items)) throw new TypeError('List requires an item array');
    if (block.type === 'list' && block.items.some((item) => item?.type !== 'listItem' || !Array.isArray(item.inlines))) throw new TypeError('Malformed list item');
    const groups = block.type === 'list' ? block.items.map((item) => item.inlines) : (block.inlines ? [block.inlines] : []);
    for (const inlines of groups) {
      for (const inline of inlines) {
        if (!['text', 'protected'].includes(inline.type) || typeof inline.value !== 'string') throw new TypeError('Malformed inline node');
        if (inline.type === 'protected') seenProtected.set(inline.sourceRange, (seenProtected.get(inline.sourceRange) ?? 0) + 1);
      }
    }
  }
  for (const span of document.protectedSpans ?? []) {
    if (seenProtected.get(`${span.start}:${span.end}`) !== 1) throw new Error(`Protected span ${span.start}:${span.end} was not restored exactly once`);
  }
  return true;
}

function freezeBlock(block) {
  if (block.type === 'list') {
    const items = block.items.map((item) => Object.freeze({ ...item, inlines: Object.freeze(item.inlines.map(freezeInline)) }));
    return Object.freeze({ ...block, items: Object.freeze(items) });
  }
  if (block.type === 'heading' || block.type === 'paragraph') {
    return Object.freeze({ ...block, inlines: Object.freeze(block.inlines.map(freezeInline)) });
  }
  return Object.freeze({ ...block });
}

function freezeInline(inline) {
  return Object.freeze({ ...inline });
}

function inlinePlain(inlines) {
  return inlines.map((inline) => inline.value).join('');
}

function blockPlain(block) {
  if (block.type === 'thematicBreak') return '—';
  if (block.type === 'heading' || block.type === 'paragraph') return inlinePlain(block.inlines);
  const marker = block.ordered ? (index) => `${index + 1}.` : () => '•';
  return block.items.map((item, index) => `${marker(index)} ${inlinePlain(item.inlines)}`).join('\n');
}

function inlineMarkdown(inlines) {
  return inlines.map((inline) => inline.type === 'text' && inline.bold ? `**${inline.value}**` : inline.value).join('');
}

function blockMarkdown(block) {
  if (block.type === 'thematicBreak') return '---';
  if (block.type === 'heading') return `${'#'.repeat(block.level)} ${inlineMarkdown(block.inlines)}`;
  if (block.type === 'paragraph') return inlineMarkdown(block.inlines);
  return block.items.map((item, index) => `${block.ordered ? `${index + 1}.` : '-'} ${inlineMarkdown(item.inlines)}`).join('\n');
}

function richInlines(inlines) {
  return inlines.map((inline) => ({ tag: inline.type === 'text' && inline.bold ? 'strong' : null, text: inline.value }));
}
