import { createDocument, protectedText, serializePlain, text } from './document.js';
import { stableChoice } from './hash.js';
import { phraseRules, RULE_DATA_VERSION } from './rules.js';

const USER_MARKER_PATTERN = /@@CPS_X+_\d+@@|@@CLAUDIFY_PROTECTED_\d+@@/g;
const PROTECTED_PATTERNS = [
  /(```|~~~)[^\r\n]*(?:\r\n|\r|\n)[\s\S]*?\1/g,
  /^(?: {4}|\t)[^\r\n]*(?:(?:\r\n|\r|\n)(?: {4}|\t)[^\r\n]*)*/gm,
  /`[^`\r\n]+`/g,
  /\[[^\]\r\n]+\]\((?:[^()\r\n]|\([^()\r\n]*\))+\)/g,
  /https?:\/\/[^\s<>()]+(?:\([^\s()]*\)[^\s<>()]*)*/g,
  /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g,
  /“[^”]+”/g,
  /"[^"]+"/g,
  /(?<![A-Za-z0-9])'[^']+'(?![A-Za-z0-9])/g,
  /(?<=\*\*)[^*]+(?=\*\*)/g,
  /\*\*/g,
  /\b\d+(?:[.,:/-]\d+)*\b/g,
  /\b(?:[A-Z][A-Z0-9&.-]{1,}\s+){1,3}[A-Z][A-Z0-9&.-]{1,}\b/g,
  /\b(?:[A-Z][a-z]+(?:\s+|\s+(?:and|of|the)\s+)){1,3}[A-Z][a-z]+\b/g,
  USER_MARKER_PATTERN
];
const WORD_PATTERN = /\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu;
const STOP_WORDS = new Set(['about', 'after', 'again', 'also', 'among', 'another', 'because', 'before', 'being', 'between', 'could', 'every', 'first', 'from', 'have', 'into', 'itself', 'more', 'most', 'other', 'should', 'some', 'such', 'than', 'that', 'their', 'there', 'these', 'they', 'this', 'those', 'through', 'under', 'very', 'where', 'which', 'while', 'with', 'would', 'your', 'the', 'and', 'but', 'for', 'not', 'are', 'was', 'were', 'has', 'had']);
const IMPERATIVE_OPENING = /^(?:always|avoid|break|choose|consider|cut|do|don't|ensure|keep|let|make|never|put|read|remember|review|use|write)\b/i;
const DEPENDENT_OPENING = /^(?:although|because|if|since|though|unless|until|when|whenever|whereas|while|which|who|whom|whose)\b/i;
const SUBJECT_OPENING = /^(?:I|we|you|he|she|it|they|this|that|these|those|there|one|(?:the|a|an|my|our|your|his|her|its|their)\s+[A-Za-z]|[A-Z][A-Za-z'-]+)\b/i;
const FINITE_VERB = /\b(?:am|is|are|was|were|has|have|had|can|could|will|would|shall|should|may|might|must|do|does|did|[a-z]+(?:s|ed))\b/i;

export function transform(sourceText) {
  if (typeof sourceText !== 'string') throw new TypeError('Source text must be a string');
  if (!sourceText.trim()) throw new Error('Enter some source text before Claudifying.');

  const rawProtectedState = protect(sourceText);
  const protectedState = Object.freeze({ ...rawProtectedState, masked: rawProtectedState.masked.replace(/\r\n?/g, '\n') });
  const sourceWordCount = countWords(sourceText);
  const primary = buildDocument(protectedState.masked, protectedState, sourceWordCount, true);
  if (countWords(serializePlain(primary)) <= Math.max(sourceWordCount, Math.floor(sourceWordCount * 2.25))) return primary;
  const bounded = buildDocument(protectedState.masked, protectedState, sourceWordCount, false);
  if (countWords(serializePlain(bounded)) <= Math.max(sourceWordCount, Math.floor(sourceWordCount * 2.25))) return bounded;
  return buildPassthroughDocument(protectedState.masked, protectedState, sourceWordCount);
}

function buildPassthroughDocument(maskedSource, protectedState, sourceWordCount) {
  const blocks = maskedSource.split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim())
    .map((paragraph) => ({ type: 'paragraph', inlines: inlineNodes(paragraph, protectedState) }));
  return createDocument(blocks, [], sourceWordCount, protectedState.spans);
}

function buildDocument(maskedSource, protectedState, sourceWordCount, expansive) {
  const ledger = [];
  const blocks = [];
  const paragraphs = maskedSource.split(/\n\s*\n/).filter((paragraph) => paragraph.trim());
  const documentSeed = `${RULE_DATA_VERSION}\u241f${maskedSource}`;

  if (expansive && sourceWordCount >= 60) {
    const topicWords = meaningfulWords(maskedSource).slice(0, 4);
    const heading = titleCase(topicWords.length >= 3 ? topicWords.join(' ') : 'A Broader Operational Landscape');
    const echoTopic = topicWords.slice(0, 2).join(' ') || 'operational landscape';
    blocks.push({ type: 'heading', level: 2, inlines: [text(heading)] });
    blocks.push({ type: 'paragraph', inlines: [text(`${titleCase(echoTopic)}, thoughtfully and genuinely reconsidered. ✨`)] });
    ledger.push(entry('structure-heading', 'heading', 0, 0), entry('style-emoji', 'emoji', 0, 0));
  }

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const enumeration = expansive ? parseEnumeration(paragraph) : null;
    if (enumeration) {
      const lead = transformSentence(enumeration.lead, paragraphIndex, 0, documentSeed, ledger, sourceWordCount, false);
      blocks.push({ type: 'paragraph', inlines: inlineNodes(`${lead}:`, protectedState) });
      ledger.push(entry('structure-list-lead', 'awkwardness', paragraphIndex, 0));
      const items = enumeration.items.map((item, itemIndex) => {
        const transformed = applyLexical(item.trim(), paragraphIndex, documentSeed, ledger);
        const header = meaningfulWords(item)[0] ?? `Item ${itemIndex + 1}`;
        ledger.push(entry('structure-list-header', 'bold', paragraphIndex, itemIndex));
        return { type: 'listItem', inlines: inlineNodes(`**${titleCase(header)}:** ${transformed}`, protectedState) };
      });
      blocks.push({ type: 'list', ordered: false, items });
      ledger.push(entry('structure-list', 'list', paragraphIndex, 0), entry('grammar-rule-of-three', 'ruleOfThree', paragraphIndex, 0));
      return;
    }

    const sentences = segmentSentences(paragraph);
    const transformed = sentences.map((sentence, sentenceIndex) => transformSentence(sentence, paragraphIndex, sentenceIndex, documentSeed, ledger, sourceWordCount, expansive));
    blocks.push({ type: 'paragraph', inlines: inlineNodes(transformed.join(' '), protectedState) });
    if (expansive && paragraphs.length >= 3 && paragraphIndex > 0 && paragraphIndex < paragraphs.length - 1 && paragraphIndex % 2 === 1) {
      blocks.push({ type: 'thematicBreak' });
      ledger.push(entry('structure-thematic-break', 'thematicBreak', paragraphIndex, 0));
    }
  });

  return createDocument(blocks, ledger, sourceWordCount, protectedState.spans);
}

function transformSentence(sentence, paragraphIndex, sentenceIndex, documentSeed, ledger, sourceWordCount, expansive) {
  const trimmed = sentence.trim();
  const shape = classifySentence(trimmed);
  let output = applyLexical(trimmed, paragraphIndex * 100 + sentenceIndex, documentSeed, ledger);
  if (countWords(sentence) < 5) return output;

  const split = splitTerminalPunctuation(output);
  const originalPunctuation = split.punctuation;
  let body = split.body;
  const location = paragraphIndex * 100 + sentenceIndex;
  let grammarApplied = false;

  if (shape.declarative) {
    const copula = body.match(/^(.{1,80}?)\s+(is|was)\s+(a|an|the)\s+(.+)$/i);
    if (copula && !/\b(not|being)\b/i.test(body)) {
      const verb = copula[2].toLowerCase() === 'was' ? 'represented' : stableChoice(['serves as', 'stands as', 'represents'], documentSeed, 'copula', String(location));
      body = `${copula[1]} ${verb} ${copula[3]} ${copula[4]}`;
      ledger.push(entry('grammar-copula', 'copulaAvoidance', location, 0));
      grammarApplied = true;
    }

    if (!grammarApplied) {
      const possession = body.match(/^(.{1,80}?)\s+(has|had)\s+(.+)$/i);
      const auxiliaryTail = possession?.[3].match(/^(?:not|never|already|just|yet|been|being|got|\w+(?:ed|en))\b/i);
      if (possession && !auxiliaryTail && !/\b(owned|caused|created|killed|employed|authored)\b/i.test(body)) {
        body = `${possession[1]} ${possession[2].toLowerCase() === 'had' ? 'featured' : 'features'} ${possession[3]}`;
        ledger.push(entry('grammar-possession', 'copulaAvoidance', location, 0));
        grammarApplied = true;
      }
    }

    if (!grammarApplied && /\b(?:connects? to|relates? to|is linked to)\b/i.test(body)) {
      body = body.replace(/\b(?:connects? to|relates? to|is linked to)\b/i, 'operates in close association with');
      ledger.push(entry('grammar-indirect-association', 'indirectAssociation', location, 0));
      grammarApplied = true;
    }

    if (!grammarApplied) {
      const coordination = splitCompleteCoordination(body);
      if (coordination && !/\b(?:owns|caused|created|killed|employed|authored)\b/i.test(body)) {
        body = `It is not only the case that ${lowerFirst(coordination.left)}, but also the case that ${lowerFirst(coordination.right)}`;
        ledger.push(entry('grammar-negative-parallelism', 'negativeParallelism', location, 0));
        grammarApplied = true;
      }
    }
  }

  if (!expansive || sentenceIndex > 1 || !shape.declarative) return `${body}${originalPunctuation}`;

  const topic = 'the broader proposition';
  const transition = stableChoice(['Additionally', 'Crucially', 'Notably', 'Against this evolving backdrop'], documentSeed, 'transition', String(location));
  let frame;
  if (sentenceIndex === 0 && paragraphIndex === 0) {
    frame = `In today's evolving landscape, it is worth noting that, arguably, in many respects, ${lowerFirst(body)}`;
  } else if (sentenceIndex === 0 && paragraphIndex >= 2) {
    frame = `Overall, it is important to note that, arguably, in many respects, ${lowerFirst(body)}`;
  } else if (sentenceIndex === 0) {
    frame = `It is important to note that, arguably, in many respects, ${lowerFirst(body)}`;
  } else {
    frame = `${transition}, ${lowerFirst(body)}`;
  }
  if (sentenceIndex === 0) ledger.push(entry('expansion-hedge-stack', 'hedge', location, 0), entry('expansion-empty-pivot', 'awkwardness', location, 0));
  ledger.push(entry('expansion-transition', 'transition', location, 0));

  const tail = ` — an observation that not only underscores **${topic}**, but also speaks to its wider significance`;
  ledger.push(entry('expansion-significance', 'significance', location, 0), entry('style-bold', 'bold', location, 0));
  ledger.push(entry('grammar-negative-parallelism', 'negativeParallelism', location, 0));
  ledger.push(entry('style-em-dash', 'emDash', location, 0));
  if (sentenceIndex > 0) ledger.push(entry('expansion-marketing-tail', 'marketing', location, 0));
  ledger.push(entry('expansion-controlled-awkwardness', 'awkwardness', location, 0));
  return `${frame}${tail}${originalPunctuation || '.'}`;
}

function applyLexical(value, occurrenceBase, documentSeed, ledger) {
  const triggerEntries = phraseRules.flatMap((rule) => rule.triggers.map((trigger) => ({ rule, trigger })))
    .sort((a, b) => b.trigger.length - a.trigger.length || b.rule.priority - a.rule.priority);
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}'’\\-])(?:${triggerEntries.map(({ trigger }) => escapeRegExp(trigger)).join('|')})(?![\\p{L}\\p{N}'’\\-])`, 'giu');
  let occurrence = 0;
  return value.replace(pattern, (match, offset) => {
    if (insideMarker(value, offset)) return match;
    const selected = triggerEntries.find(({ trigger }) => trigger.toLowerCase() === match.toLowerCase());
    if (!selected) return match;
    if (selected.rule.id === 'lex-use' && match.toLowerCase() === 'used' && /^\s+to\b/i.test(value.slice(offset + match.length))) return match;
    const selectedVariant = stableChoice(selected.rule.variants, documentSeed, selected.rule.id, String(occurrenceBase), String(occurrence));
    const replacement = inflectReplacement(selected.rule.id, match, selectedVariant);
    ledger.push(entry(selected.rule.id, selected.rule.category, occurrenceBase, offset));
    ledger.push(entry('style-bold', 'bold', occurrenceBase, offset));
    occurrence += 1;
    return `**${replacement}**`;
  });
}

function protect(source) {
  const ranges = collectProtectedRanges(source);
  let salt = 'X';
  while (source.includes(`@@CPS_${salt}_`)) salt += 'X';
  const spans = [];
  const chunks = [];
  const markerToSpan = new Map();
  let cursor = 0;
  for (const range of ranges) {
    chunks.push(source.slice(cursor, range.start));
    const index = spans.length;
    const marker = `@@CPS_${salt}_${index}@@`;
    const span = Object.freeze({ index, value: source.slice(range.start, range.end), start: range.start, end: range.end, marker });
    spans.push(span);
    markerToSpan.set(marker, span);
    chunks.push(marker);
    cursor = range.end;
  }
  chunks.push(source.slice(cursor));
  return Object.freeze({ masked: chunks.join(''), spans: Object.freeze(spans), markerToSpan });
}

function inlineNodes(value, protectedState) {
  const nodes = [];
  let cursor = 0;
  let bold = false;
  const tokenPattern = /\*\*|@@CPS_X+_\d+@@/g;
  for (const match of value.matchAll(tokenPattern)) {
    if (match.index > cursor) nodes.push(text(value.slice(cursor, match.index), bold));
    if (match[0] === '**') bold = !bold;
    else {
      const span = protectedState.markerToSpan.get(match[0]);
      if (!span) throw new Error('Unknown internal protected-span marker');
      nodes.push(protectedText(span.value, `${span.start}:${span.end}`));
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < value.length) nodes.push(text(value.slice(cursor), bold));
  if (bold) throw new Error('Unbalanced generated bold markers');
  return nodes;
}

function parseEnumeration(paragraph) {
  const match = paragraph.match(/^(.{8,800}?):\s*([^,;:\r\n]+),\s*([^,;:\r\n]+),\s*(?:and|or)\s+([^,;:\r\n]+?)[.!?]?$/s);
  if (!match) return null;
  if (/[.!?]/.test(match[1])) return null;
  const items = match.slice(2).map((item) => item.trim());
  if (items.some((item) => countWords(item) === 0 || countWords(item) > 12)) return null;
  return { lead: match[1], items };
}

function segmentSentences(paragraph) {
  return paragraph.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g)?.map((part) => part.trim()).filter(Boolean) ?? [paragraph.trim()];
}

function classifySentence(value) {
  const { body, punctuation } = splitTerminalPunctuation(value);
  const visible = stripGeneratedMarkup(body).trim();
  const questionOrExclamation = /[?!]/.test(punctuation);
  const colonOrSemicolonLead = /[:;]/.test(visible) || /[:;]/.test(punctuation);
  const imperative = IMPERATIVE_OPENING.test(visible);
  const dependent = DEPENDENT_OPENING.test(visible);
  return {
    declarative: !questionOrExclamation && !colonOrSemicolonLead && !imperative && !dependent && isLikelyCompleteClause(visible)
  };
}

function splitTerminalPunctuation(value) {
  const match = value.match(/([.!?]+|[:;])$/);
  return match ? { body: value.slice(0, -match[0].length), punctuation: match[0] } : { body: value, punctuation: '' };
}

function splitCompleteCoordination(value) {
  const match = value.match(/^(.{10,140}?),\s+and\s+(.{8,140})$/i);
  if (!match) return null;
  if (!isLikelyCompleteClause(match[1]) || !isLikelyCompleteClause(match[2])) return null;
  return { left: match[1], right: match[2] };
}

function isLikelyCompleteClause(value) {
  const visible = stripGeneratedMarkup(value).trim();
  return SUBJECT_OPENING.test(visible) && FINITE_VERB.test(visible);
}

function stripGeneratedMarkup(value) {
  return value.replace(/\*\*/g, '').replace(/@@CPS_X+_\d+@@/g, 'protected value');
}

function meaningfulWords(value) {
  const visible = value.replace(/@@CPS_X+_\d+@@/g, ' ');
  return (visible.match(/[A-Za-z][A-Za-z'-]{2,}/g) ?? []).filter((word) => !STOP_WORDS.has(word.toLowerCase()));
}

function titleCase(value) {
  return value.replace(/\b[A-Za-z][A-Za-z'-]*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

function countWords(value) {
  return value.match(WORD_PATTERN)?.length ?? 0;
}

function insideMarker(value, offset) {
  const left = value.lastIndexOf('@@CPS_', offset);
  return left !== -1 && value.indexOf('@@', left + 2) >= offset;
}

function collectProtectedRanges(source) {
  const candidates = [];
  for (const pattern of PROTECTED_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of source.matchAll(pattern)) candidates.push({ start: match.index, end: match.index + match[0].length });
  }
  candidates.sort((a, b) => a.start - b.start || b.end - a.end);
  const accepted = [];
  for (const candidate of candidates) {
    if (candidate.end <= candidate.start) continue;
    const previous = accepted.at(-1);
    if (!previous || candidate.start >= previous.end) accepted.push(candidate);
  }
  return accepted;
}

function lowerFirst(value) {
  return value ? value[0].toLowerCase() + value.slice(1) : value;
}

function inflectReplacement(ruleId, match, fallback) {
  const normalized = match.toLowerCase();
  const forms = {
    'lex-use': { use: 'leverage', uses: 'leverages', used: 'leveraged', using: 'leveraging' },
    'lex-show': { show: 'showcase', shows: 'showcases', demonstrates: 'underscores' },
    'lex-improve': { improve: 'elevate', improves: 'elevates', improvement: 'transformative elevation', improvements: 'transformative elevations' },
    'lex-help': { help: 'meaningfully enable', helps: 'meaningfully enables' },
    'lex-error': { error: 'meaningful correctness gap', errors: 'meaningful correctness gaps' },
    'lex-task': { task: 'disjoint implementation slice', tasks: 'disjoint implementation slices' },
    'lex-problem': { problem: 'multifaceted challenge', problems: 'multifaceted challenges' }
  };
  return forms[ruleId]?.[normalized] ?? fallback;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function entry(ruleId, category, sourceNode, sourceOffset) {
  return Object.freeze({ ruleId, category, sourceNode, sourceOffset });
}
