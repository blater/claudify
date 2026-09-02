import { createDocument, protectedText, serializePlain, text } from './document.js';
import { stableChoice } from './hash.js';
import { leadInRules, phraseRules, RULE_DATA_VERSION, scoreWeights, tallyDefinitions } from './rules.js';

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
const HONEST_MODIFIER_PATTERN = /\b(?:results?|outcomes?|answers?|assessments?|readouts?|proofs?|analyses|analysis|conclusions?|recommendations?|statements?|explanations?|findings?)\b/gi;
const BOLD_SELECTION = [true, false, false, false, false, false];
const IMPERATIVE_LIST_OPENING = /^(?:always|avoid|break|choose|consider|cut|do|don't|ensure|if|keep|let|make|maintain|never|put|read|remember|review|use|write)\b/i;
const CONTRAST_RIGHT_VERB_PATTERN = /(?:embrac(?:e|ed|es)|adopt(?:ed|s)?|champion(?:ed|s)?|move[sd]? toward(?:s)?)$/i;
const CONTRAST_VERB_VARIANTS = Object.freeze({
  rejected: ['deprecated', 'strategically deprioritized', 'retired'],
  rejects: ['deprecates', 'strategically deprioritizes', 'retires'],
  discarded: ['deprecated', 'strategically deprioritized', 'retired'],
  discards: ['deprecates', 'strategically deprioritizes', 'retires'],
  abandoned: ['retired', 'sunset', 'decommissioned'],
  abandons: ['retires', 'sunsets', 'decommissions'],
  deprecated: ['retired', 'sunset', 'decommissioned'],
  deprecates: ['retires', 'sunsets', 'decommissions'],
  'moved away from': ['decoupled from', 'strategically separated from', 'deprioritized'],
  'moves away from': ['decouples from', 'strategically separates from', 'deprioritizes'],
  embraced: ['operationalized', 'elevated', 'championed'],
  embraces: ['operationalizes', 'elevates', 'champions'],
  adopted: ['operationalized', 'elevated', 'championed'],
  adopts: ['operationalizes', 'elevates', 'champions'],
  championed: ['elevated', 'operationalized', 'championed'],
  champions: ['elevates', 'operationalizes', 'champions'],
  'moved toward': ['oriented toward', 'aligned toward', 'advanced toward'],
  'moves toward': ['orients toward', 'aligns toward', 'advances toward']
});
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

export function sourceScore(sourceText) {
  if (typeof sourceText !== 'string') throw new TypeError('Source text must be a string');
  if (!sourceText.trim()) return 0;

  const rawProtectedState = protect(sourceText);
  const maskedSource = rawProtectedState.masked.replace(/\r\n?/g, '\n');
  const ledger = [];
  collectSourceTargetLedger(maskedSource, ledger);
  return scoreSourceLedger(ledger);
}

function scoreSourceLedger(ledger) {
  const counts = Object.fromEntries(tallyDefinitions.map(([key]) => [key, 0]));
  for (const ledgerEntry of ledger) counts[ledgerEntry.category] = (counts[ledgerEntry.category] ?? 0) + 1;
  const activeCounts = tallyDefinitions
    .map(([key, label]) => ({ key, label, count: counts[key] ?? 0 }))
    .filter((item) => item.count > 0);
  const weighted = activeCounts.reduce((total, item) => total + (scoreWeights[item.key] ?? 1) * item.count, 0);
  return Math.round(weighted * 1.7 + activeCounts.length * 1.8);
}

function collectSourceTargetLedger(value, ledger) {
  const targetEntries = phraseRules
    .filter((rule) => !rule.id.startsWith('lex-archaic-'))
    .flatMap((rule) => {
      const variants = rule.variants.flatMap((variant) => variant.split(/\s+\/\s+/).map((target) => target.trim()));
      return rule.triggers.flatMap((trigger) => variants.flatMap((target) => [
        { rule, target },
        { rule, target: inflectReplacement(rule.id, trigger, target) }
      ]));
    })
    .filter(({ target }) => target)
    .sort((a, b) => b.target.length - a.target.length || b.rule.priority - a.rule.priority);
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}'’\\-])(?:${targetEntries.map(({ target }) => escapeRegExp(target)).join('|')})(?![\\p{L}\\p{N}'’\\-])`, 'giu');
  value.replace(pattern, (match, offset) => {
    if (insideMarker(value, offset)) return match;
    const selected = targetEntries.find(({ target }) => target.toLowerCase() === match.toLowerCase());
    if (!selected) return match;
    ledger.push(entry(`source-target-${selected.rule.id}`, selected.rule.category, 0, offset));
    return match;
  });
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
    const heading = sentenceCase(topicWords.length >= 3 ? topicWords.join(' ') : 'a broader operational landscape');
    const echoTopic = topicWords.slice(0, 2).join(' ') || 'operational landscape';
    blocks.push({ type: 'heading', level: 2, inlines: [text(heading)] });
    blocks.push({ type: 'paragraph', inlines: [text(`${sentenceCase(echoTopic)}, thoughtfully and genuinely reconsidered. ✨`)] });
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
        const boldHeader = chooseBold(documentSeed, 'structure-list-header', paragraphIndex, itemIndex);
        if (boldHeader) ledger.push(entry('structure-list-header', 'bold', paragraphIndex, itemIndex));
        const label = `${sentenceCase(header)}:`;
        return { type: 'listItem', inlines: inlineNodes(`${boldHeader ? `**${label}**` : label} ${transformed}`, protectedState) };
      });
      blocks.push({ type: 'list', ordered: false, items });
      ledger.push(entry('structure-list', 'list', paragraphIndex, 0), entry('grammar-rule-of-three', 'ruleOfThree', paragraphIndex, 0));
      return;
    }

    const rhetoricalList = parseRhetoricalList(paragraph);
    if (rhetoricalList) {
      if (rhetoricalList.prefix) {
        const transformedPrefix = transformParagraph(rhetoricalList.prefix, paragraphIndex, paragraphs.length, documentSeed, ledger, sourceWordCount, expansive);
        blocks.push({ type: 'paragraph', inlines: inlineNodes(transformedPrefix.join(' '), protectedState) });
      }
      if (rhetoricalList.lead) {
        const lead = transformSentence(rhetoricalList.lead, paragraphIndex, 0, documentSeed, ledger, sourceWordCount, false);
        blocks.push({ type: 'paragraph', inlines: inlineNodes(lead, protectedState) });
        ledger.push(entry('structure-list-lead', 'awkwardness', paragraphIndex, 0));
      }

      const items = rhetoricalList.items.map((item, itemIndex) => ({
        type: 'listItem',
        inlines: inlineNodes(transformSentence(item, paragraphIndex, itemIndex + 1, documentSeed, ledger, sourceWordCount, false), protectedState)
      }));
      blocks.push({ type: 'list', ordered: false, items });
      ledger.push(entry('structure-list', 'list', paragraphIndex, 0), entry('grammar-rule-of-three', 'ruleOfThree', paragraphIndex, 0));

      if (rhetoricalList.remainder) {
        const transformedRemainder = transformParagraph(rhetoricalList.remainder, paragraphIndex, paragraphs.length, documentSeed, ledger, sourceWordCount, expansive, rhetoricalList.items.length + 1);
        blocks.push({ type: 'paragraph', inlines: inlineNodes(transformedRemainder.join(' '), protectedState) });
      }
      return;
    }

    const inlineEnumerations = parseInlineEnumerations(paragraph);
    if (inlineEnumerations) {
      blocks.push(...transformParagraphWithInlineEnumerations(
        paragraph,
        paragraphIndex,
        paragraphs.length,
        documentSeed,
        ledger,
        sourceWordCount,
        protectedState,
        expansive
      ));
      if (expansive && paragraphs.length >= 3 && paragraphIndex > 0 && paragraphIndex < paragraphs.length - 1 && paragraphIndex % 2 === 1) {
        blocks.push({ type: 'thematicBreak' });
        ledger.push(entry('structure-thematic-break', 'thematicBreak', paragraphIndex, 0));
      }
      return;
    }

    const transformed = transformParagraph(paragraph, paragraphIndex, paragraphs.length, documentSeed, ledger, sourceWordCount, expansive);
    blocks.push({ type: 'paragraph', inlines: inlineNodes(transformed.join(' '), protectedState) });
    if (expansive && paragraphs.length >= 3 && paragraphIndex > 0 && paragraphIndex < paragraphs.length - 1 && paragraphIndex % 2 === 1) {
      blocks.push({ type: 'thematicBreak' });
      ledger.push(entry('structure-thematic-break', 'thematicBreak', paragraphIndex, 0));
    }
  });

  return createDocument(blocks, ledger, sourceWordCount, protectedState.spans);
}

function transformParagraph(paragraph, paragraphIndex, paragraphCount, documentSeed, ledger, sourceWordCount, expansive, sentenceIndexOffset = 0) {
  const sentences = segmentSentences(paragraph);
  return sentences.map((sentence, localSentenceIndex) => {
    const sentenceIndex = sentenceIndexOffset + localSentenceIndex;
    return transformSentence(
      sentence,
      paragraphIndex,
      sentenceIndex,
      documentSeed,
      ledger,
      sourceWordCount,
      expansive,
      {
        isFirstSentence: paragraphIndex === 0 && sentenceIndex === 0,
        isParagraphStart: sentenceIndex === 0,
        isFinalSentence: paragraphIndex === paragraphCount - 1 && localSentenceIndex === sentences.length - 1
      }
    );
  });
}

function transformParagraphWithInlineEnumerations(paragraph, paragraphIndex, paragraphCount, documentSeed, ledger, sourceWordCount, protectedState, expansive) {
  const sentences = segmentSentences(paragraph);
  const blocks = [];
  let paragraphParts = [];

  const flushParagraph = () => {
    if (paragraphParts.length === 0) return;
    blocks.push({ type: 'paragraph', inlines: inlineNodes(paragraphParts.join(' '), protectedState) });
    paragraphParts = [];
  };

  sentences.forEach((sentence, sentenceIndex) => {
    const enumeration = parseInlineEnumerationSentence(sentence);
    const context = {
      isFirstSentence: paragraphIndex === 0 && sentenceIndex === 0,
      isParagraphStart: sentenceIndex === 0,
      isFinalSentence: paragraphIndex === paragraphCount - 1 && sentenceIndex === sentences.length - 1
    };
    if (!enumeration) {
      paragraphParts.push(transformSentence(sentence, paragraphIndex, sentenceIndex, documentSeed, ledger, sourceWordCount, expansive, context));
      return;
    }

    flushParagraph();
    const lead = transformSentence(`${enumeration.lead}:`, paragraphIndex, sentenceIndex, documentSeed, ledger, sourceWordCount, false, context);
    blocks.push({ type: 'paragraph', inlines: inlineNodes(lead, protectedState) });
    ledger.push(entry('structure-inline-list-lead', 'awkwardness', paragraphIndex, sentenceIndex));

    const items = enumeration.items.map((item, itemIndex) => {
      const transformed = applyLexical(item, paragraphIndex * 100 + sentenceIndex, documentSeed, ledger);
      const punctuation = itemIndex === enumeration.items.length - 1 ? enumeration.punctuation : '';
      return { type: 'listItem', inlines: inlineNodes(`${transformed}${punctuation}`, protectedState) };
    });
    blocks.push({ type: 'list', ordered: false, items });
    ledger.push(entry('structure-inline-list', 'list', paragraphIndex, sentenceIndex));
    ledger.push(entry('grammar-rule-of-three', 'ruleOfThree', paragraphIndex, sentenceIndex));
  });

  flushParagraph();
  return blocks;
}

function transformSentence(sentence, paragraphIndex, sentenceIndex, documentSeed, ledger, sourceWordCount, expansive, context = {}) {
  const trimmed = sentence.trim();
  const shape = classifySentence(trimmed);
  const occurrenceBase = paragraphIndex * 100 + sentenceIndex;
  const honestReady = insertOccasionalHonest(trimmed, occurrenceBase, documentSeed, ledger);
  let output = normalizeContinuationCapitalization(applyLexical(honestReady, occurrenceBase, documentSeed, ledger));
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
      const contrast = splitContrastCoordination(body);
      if (contrast) {
        const leftVerb = chooseContrastVerb(contrast.leftVerb, documentSeed, location);
        const rightVerb = chooseContrastVerb(contrast.rightVerb, documentSeed, location);
        body = `${contrast.subject} not only ${leftVerb} ${contrast.leftObject}, but also ${rightVerb} ${contrast.rightObject}`;
        ledger.push(entry('grammar-contrast-parallelism', 'negativeParallelism', location, 0));
        grammarApplied = true;
      }
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

  const position = context.isFirstSentence ? 'opening' : context.isFinalSentence ? 'conclusion' : 'continuation';
  const simpleLeadInEligible = sourceWordCount >= 60 && shape.declarative && (context.isParagraphStart || context.isFinalSentence);
  if (!expansive || sentenceIndex > 1 || !shape.declarative) {
    if (simpleLeadInEligible) {
      const leadIn = chooseLeadIn(position, documentSeed, location);
      body = prependLeadIn(leadIn, lowerFirst(body), ledger, location);
      ledger.push(entry(leadIn.id, 'transition', location, 0));
    }
    return `${body}${originalPunctuation}`;
  }

  const topic = 'the broader proposition';
  const leadIn = chooseLeadIn(position, documentSeed, location);
  let frame;
  if (sentenceIndex === 0 && paragraphIndex === 0) {
    frame = prependLeadIn(leadIn, `it is worth noting that, arguably, in many respects, ${lowerFirst(body)}`, ledger, location);
  } else if (sentenceIndex === 0 && paragraphIndex >= 2) {
    frame = prependLeadIn(leadIn, `overall, it is important to note that, arguably, in many respects, ${lowerFirst(body)}`, ledger, location);
  } else if (sentenceIndex === 0) {
    frame = prependLeadIn(leadIn, `it is important to note that, arguably, in many respects, ${lowerFirst(body)}`, ledger, location);
  } else {
    frame = prependLeadIn(leadIn, lowerFirst(body), ledger, location);
  }
  if (sentenceIndex === 0) ledger.push(entry('expansion-hedge-stack', 'hedge', location, 0), entry('expansion-empty-pivot', 'awkwardness', location, 0));
  ledger.push(entry(leadIn.id, 'transition', location, 0));

  const tail = ` — an observation that not only underscores ${topic}, but also speaks to its wider significance`;
  ledger.push(entry('expansion-significance', 'significance', location, 0));
  ledger.push(entry('grammar-negative-parallelism', 'negativeParallelism', location, 0));
  ledger.push(entry('style-em-dash', 'emDash', location, 0));
  if (sentenceIndex > 0) ledger.push(entry('expansion-marketing-tail', 'marketing', location, 0));
  ledger.push(entry('expansion-controlled-awkwardness', 'awkwardness', location, 0));
  return `${frame}${tail}${originalPunctuation || '.'}`;
}

function chooseLeadIn(position, documentSeed, location) {
  const candidates = leadInRules.filter((leadIn) => leadIn.placement === position);
  return stableChoice(candidates, documentSeed, 'lead-in', position, String(location));
}

function prependLeadIn(leadIn, body, ledger, location) {
  if (leadIn.separator.includes('—')) ledger.push(entry('style-em-dash', 'emDash', location, 0));
  return `${leadIn.text}${leadIn.separator}${body}`;
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
    if (selected.rule.id === 'lex-evidence-bearing-delivery' && /\b(?:honest|same|identical|consistent)\s+$/i.test(value.slice(0, offset))) return match;
    const selectedVariant = chooseVariant(selected.rule.variants, documentSeed, selected.rule.id, occurrenceBase, occurrence);
    const replacement = matchCapitalization(contextualReplacement(selected.rule.id, match, selectedVariant, value, offset), match, value, offset);
    ledger.push(entry(selected.rule.id, selected.rule.category, occurrenceBase, offset));
    const bold = chooseBold(documentSeed, selected.rule.id, occurrenceBase, offset, occurrence);
    if (bold) ledger.push(entry('style-bold', 'bold', occurrenceBase, offset));
    occurrence += 1;
    return bold ? `**${replacement}**` : replacement;
  });
}

function chooseBold(documentSeed, ...seedParts) {
  return stableChoice(BOLD_SELECTION, documentSeed, 'style-bold', ...seedParts);
}

function chooseVariant(variants, documentSeed, ruleId, occurrenceBase, occurrence) {
  const candidates = variants.flatMap((variant) => variant.split(/\s+\/\s+/).map((candidate) => candidate.trim())).filter(Boolean);
  return stableChoice(candidates, documentSeed, ruleId, String(occurrenceBase), String(occurrence));
}

function contextualReplacement(ruleId, match, fallback, value, offset) {
  const replacement = inflectReplacement(ruleId, match, fallback);
  if (ruleId === 'lex-non-deterministic-outcome') {
    const preceding = value.slice(0, offset);
    if (/\b(?:is|are|was|were|be|been|being)\s*$/i.test(preceding)) return replacement;
    return `${hasPluralSubject(preceding) ? 'are' : 'is'} ${replacement}`;
  }
  if (ruleId === 'lex-non-deterministic' && fallback === 'non deterministic' && /\ban\s+$/i.test(value.slice(0, offset))) {
    return 'stochastic';
  }
  return replacement;
}

function hasPluralSubject(value) {
  const sentence = value.slice(Math.max(value.search(/[.!?;:]\s*[^.!?;:]*$/), 0)).trim();
  const lastWord = sentence.match(/[\p{L}][\p{L}'’-]*$/u)?.[0].toLowerCase();
  if (!lastWord || /(?:news|status|analysis|basis|thesis|series|species|process|class|business)$/.test(lastWord)) return false;
  if (/^(?:outcomes?|results?|findings?)$/.test(lastWord)) return false;
  return /(?:s|men|women|children|people|data|criteria|media)$/.test(lastWord) || /\band\b/i.test(sentence);
}

function matchCapitalization(replacement, match, value, offset) {
  const sourceLetters = [...match].filter((character) => /\p{L}/u.test(character));
  const replacementLetters = [...replacement];
  const firstReplacementIndex = replacementLetters.findIndex((character) => /\p{L}/u.test(character));
  if (sourceLetters.length === 0 || firstReplacementIndex === -1) return replacement;
  const sourceIsUppercase = sourceLetters.every((character) => character === character.toLocaleUpperCase());
  const sourceStartsUppercase = sourceLetters[0] === sourceLetters[0].toLocaleUpperCase();
  if (sourceIsUppercase) return replacement.toLocaleUpperCase();
  const preceding = value.slice(0, offset);
  const isSentenceStart = !preceding.trim() || /[.!?]\s*$/.test(preceding);
  if (!sourceStartsUppercase || !isSentenceStart) {
    replacementLetters[firstReplacementIndex] = replacementLetters[firstReplacementIndex].toLocaleLowerCase();
    return replacementLetters.join('');
  }
  replacementLetters[firstReplacementIndex] = replacementLetters[firstReplacementIndex].toLocaleUpperCase();
  return replacementLetters.join('');
}

function insertOccasionalHonest(value, occurrenceBase, documentSeed, ledger) {
  let occurrence = 0;
  let inserted = false;
  return value.replace(HONEST_MODIFIER_PATTERN, (match, offset) => {
    const precededByPhrase = /\b(?:honest|same|identical|consistent)\s+$/i.test(value.slice(0, offset));
    const shouldInsert = !inserted && !precededByPhrase && stableChoice([false, false, false, true], documentSeed, 'style-honest', String(occurrenceBase), String(occurrence));
    occurrence += 1;
    if (!shouldInsert) return match;
    inserted = true;
    ledger.push(entry('style-honest', 'marketing', occurrenceBase, offset));
    return `honest ${match}`;
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

function parseInlineEnumerations(paragraph) {
  return segmentSentences(paragraph).some((sentence) => parseInlineEnumerationSentence(sentence)) ? true : null;
}

function parseInlineEnumerationSentence(sentence) {
  const { body, punctuation } = splitTerminalPunctuation(sentence.trim());
  const candidates = [];
  for (const match of body.matchAll(/\b[\p{L}\p{N}]/gu)) {
    if (insideMarker(body, match.index)) continue;
    const lead = body.slice(0, match.index).trim();
    if (!lead || /[,;:]$/.test(lead) || /\b(?:like|such as|including)$/i.test(lead) || !isLikelyClauseWithProtectedSubject(lead) || !isLikelyInlineEnumerationLead(lead) || CONTRAST_RIGHT_VERB_PATTERN.test(lead)) continue;
    const items = splitInlineEnumeration(body.slice(match.index).trim());
    if (!items) continue;
    const normalizedLead = normalizeInlineEnumerationLead(lead);
    if (!normalizedLead) continue;
    candidates.push({ start: match.index, lead: normalizedLead, items, punctuation });
  }
  candidates.sort((a, b) => b.items.length - a.items.length || b.start - a.start);
  return candidates[0] ?? null;
}

function splitInlineEnumeration(value) {
  const segments = value.split(',').map((segment) => segment.trim()).filter(Boolean);
  if (segments.length < 2) return null;

  const finalSegment = segments.at(-1);
  const oxfordFinal = finalSegment.match(/^(?:and|or)\s+(.+)$/i);
  const unpunctuatedFinal = finalSegment.match(/^(.+?)\s+(?:and|or)\s+(.+)$/i);
  const items = oxfordFinal
    ? [...segments.slice(0, -1), oxfordFinal[1].trim()]
    : unpunctuatedFinal
      ? [...segments.slice(0, -1), unpunctuatedFinal[1].trim(), unpunctuatedFinal[2].trim()]
      : null;
  if (!items || items.length < 3 || items.length > 5) return null;
  if (items.some((item) => !item || /[.!?;:]/.test(item) || /^(?:and|or|to)\b/i.test(item))) return null;
  if (items.some((item) => countWords(item) === 0 || countWords(item) > 12)) return null;
  if (items.some((item) => isLikelyInlineListClause(item))) return null;
  const itemShapes = items.map(classifyInlineListItem);
  if (new Set(itemShapes).size > 1) return null;
  return items;
}

function classifyInlineListItem(item) {
  const firstWord = item.match(/^[\p{L}][\p{L}'’-]*/u)?.[0].toLowerCase();
  if (!firstWord) return 'unknown';
  if (firstWord.endsWith('ing') || firstWord.endsWith('ed')) return 'verb';
  if (firstWord.endsWith('ly')) return 'adverb';
  return 'noun-or-phrase';
}

function normalizeInlineEnumerationLead(lead) {
  if (/\b(?:for|in)$/i.test(lead)) return lead.replace(/\b(?:for|in)$/i, 'across');
  if (/\b(?:of|to|with|by|from|as|at|into|through|and|or)$/i.test(lead)) return null;
  return lead;
}

function isLikelyInlineEnumerationLead(lead) {
  const lastWord = lead.match(/[\p{L}][\p{L}'’-]*$/u)?.[0].toLowerCase();
  return Boolean(lastWord && (/^(?:for|in|is|are|was|were|has|have|had|can|could|will|would|should|may|might|must)$/.test(lastWord) || /(?:s|ed|ing)$/.test(lastWord)));
}

function parseRhetoricalList(paragraph) {
  const lines = paragraph.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length < 3) return null;

  const candidates = [];
  const questionRun = findLineRun(lines, (line) => countWords(line) >= 3 && /\?\s*$/.test(line));
  if (questionRun) candidates.push({ ...questionRun, items: lines.slice(questionRun.start, questionRun.end) });

  const ruleRun = findLineRun(lines, (line) => countWords(line) >= 3 && IMPERATIVE_LIST_OPENING.test(line) && /[.!?]\s*$/.test(line));
  if (ruleRun) candidates.push({ ...ruleRun, items: lines.slice(ruleRun.start, ruleRun.end) });

  for (let leadIndex = 0; leadIndex < lines.length - 3; leadIndex += 1) {
    if (!/:\s*$/.test(lines[leadIndex])) continue;
    const items = [];
    let end = leadIndex + 1;
    let remainder = '';
    for (; end < lines.length && items.length < 6; end += 1) {
      const line = lines[end];
      const terminal = line.match(/[.!?](?=\s|$)/);
      if (!terminal) {
        items.push(line);
        continue;
      }
      const itemEnd = terminal.index + 1;
      items.push(line.slice(0, itemEnd).trim());
      remainder = line.slice(itemEnd).trim();
      end += 1;
      break;
    }
    if (items.length >= 3 && /^whether\b/i.test(items[0]) && items.some((item) => /^(?:or|and)\b/i.test(item))) {
      candidates.push({ start: leadIndex, end, items, lead: lines[leadIndex], remainder });
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.start - b.start || (b.lead ? 1 : 0) - (a.lead ? 1 : 0));
  const selected = candidates[0];
  const prefixLines = lines.slice(0, selected.start);
  let lead = selected.lead ?? null;
  if (!lead && /:\s*$/.test(prefixLines.at(-1) ?? '')) lead = prefixLines.pop();
  const remainderLines = [selected.remainder, ...lines.slice(selected.end)].filter(Boolean);
  return { prefix: prefixLines.join('\n'), lead, items: selected.items, remainder: remainderLines.join('\n') };
}

function findLineRun(lines, predicate) {
  for (let start = 0; start < lines.length; start += 1) {
    if (!predicate(lines[start])) continue;
    let end = start + 1;
    while (end < lines.length && predicate(lines[end])) end += 1;
    if (end - start >= 3) return { start, end };
    start = end - 1;
  }
  return null;
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

function splitContrastCoordination(value) {
  const match = value.match(/^(.{3,100}?)\s+(rejected|rejects|discarded|discards|abandoned|abandons|deprecated|deprecates|moved away from|moves away from)\s+(.{1,160}?)\s+and\s+(embraced|embraces|adopted|adopts|championed|champions|moved toward|moves toward)\s+(.{1,220})$/i);
  if (!match) return null;
  const subject = match[1].trim();
  const leftObject = match[3].trim();
  const rightObject = match[5].trim();
  if (!SUBJECT_OPENING.test(subject) || countWords(subject) > 12 || !leftObject || !rightObject) return null;
  return { subject, leftVerb: match[2].toLowerCase(), leftObject, rightVerb: match[4].toLowerCase(), rightObject };
}

function isLikelyClauseWithProtectedSubject(value) {
  const visible = stripGeneratedMarkup(value).trim().replace(/^protected value\b/i, 'The protected value');
  return isLikelyCompleteClause(visible);
}

function isLikelyInlineListClause(value) {
  const visible = stripGeneratedMarkup(value).trim();
  const explicitSubject = /^(?:the|a|an|this|that|these|those|i|we|you|he|she|it|they|there|one)\b/i.test(visible);
  return (countWords(value) >= 4 || explicitSubject) && isLikelyCompleteClause(visible);
}

function chooseContrastVerb(verb, documentSeed, location) {
  return stableChoice(CONTRAST_VERB_VARIANTS[verb] ?? [verb], documentSeed, 'grammar-contrast-verb', verb, String(location));
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

function sentenceCase(value) {
  const normalized = value.toLocaleLowerCase();
  return normalized ? normalized[0].toLocaleUpperCase() + normalized.slice(1) : normalized;
}

function normalizeContinuationCapitalization(value) {
  return value.replace(/(^|[^\n])\n+([\p{Lu}])(?=\p{Ll})/gu, (match, preceding, capital, offset) => {
    const previous = value.slice(0, offset).trimEnd().at(-1);
    if (/[.!?:]/u.test(previous ?? '')) return match;
    const capitalIndex = match.lastIndexOf(capital);
    return `${match.slice(0, capitalIndex)}${capital.toLocaleLowerCase()}`;
  });
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
  if (ruleId === 'lex-x-broad-coverage') return fallback + ' ' + match;
  if (ruleId === 'lex-archaic-coward' && normalized === 'cowards') return `${fallback}s`;
  const forms = {
    'lex-use': { use: 'leverage', uses: 'leverages', used: 'leveraged', using: 'leveraging' },
    'lex-show': { show: 'showcase', shows: 'showcases', demonstrates: 'underscores' },
    'lex-improve': { improve: 'elevate', improves: 'elevates', improvement: 'transformative elevation', improvements: 'transformative elevations' },
    'lex-help': { help: 'meaningfully enable', helps: 'meaningfully enables' },
    'lex-error': { error: 'meaningful correctness gap', errors: 'meaningful correctness gaps' },
    'lex-task': { task: 'disjoint implementation slice', tasks: 'disjoint implementation slices' },
    'lex-problem': { problem: 'multifaceted challenge', problems: 'multifaceted challenges' },
    'lex-seam': { edge: 'seam', edges: 'seams', division: 'seam', divisions: 'seams', segment: 'seam', segments: 'seams', part: 'seam', parts: 'seams' },
    'lex-facilitate': { facilitate: 'meaningfully enable', facilitates: 'meaningfully enables', facilitating: 'meaningfully enabling' },
    'lex-enhance': { enhance: 'elevate', enhances: 'elevates', enhanced: 'elevated', enhancing: 'elevating' },
    'lex-foster': { foster: 'cultivate', fosters: 'cultivates', fostering: 'cultivating' },
    'lex-bolster': { bolster: 'meaningfully reinforce', bolsters: 'meaningfully reinforces', bolstered: 'meaningfully reinforced', bolstering: 'meaningfully reinforcing' },
    'lex-garner': { garner: 'secure', garners: 'secures', garnered: 'secured', garnering: 'securing' },
    'lex-navigate': { navigate: 'strategically navigate', navigates: 'strategically navigates', navigated: 'strategically navigated', navigating: 'strategically navigating' },
    'lex-embark': { embark: 'initiate a transformative journey', embarks: 'initiates a transformative journey', embarked: 'initiated a transformative journey', embarking: 'initiating a transformative journey' },
    'lex-craft': { craft: 'thoughtfully engineer', crafts: 'thoughtfully engineers', crafted: 'thoughtfully engineered', crafting: 'thoughtfully engineering' },
    'lex-lasts-survive': { lasts: 'survives', lasted: 'survived', lasting: 'surviving' },
    'lex-continues-survive': {
      'continues to': 'survives to', 'continue to': 'survive to', 'continued to': 'survived to', 'continuing to': 'surviving to',
      continues: 'survives', continue: 'survive', continued: 'survived', continuing: 'surviving'
    },
    'lex-persists-survive': { persists: 'survives', persist: 'survive', persisted: 'survived', persisting: 'surviving' },
    'lex-endures-survive': { endures: 'survives', endure: 'survive', endured: 'survived', enduring: 'surviving' },
    'lex-remains-survive': { remains: 'survives', remain: 'survive', remained: 'survived', remaining: 'surviving' },
    'lex-carries-on-survive': { 'carries on': 'survives', 'carry on': 'survive', 'carried on': 'survived', 'carrying on': 'surviving' },
    'lex-goes-on-survive': { 'goes on': 'survives', 'go on': 'survive', 'went on': 'survived', 'going on': 'surviving' },
    'lex-becomes-as-survive': {
      'becomes a': 'survives as a', 'becomes an': 'survives as an', 'becomes the': 'survives as the',
      'become a': 'survive as a', 'become an': 'survive as an', 'become the': 'survive as the',
      'became a': 'survived as a', 'became an': 'survived as an', 'became the': 'survived as the',
      'becoming a': 'surviving as a', 'becoming an': 'surviving as an', 'becoming the': 'surviving as the'
    },
    'lex-becomes-survive': { becomes: 'survives', become: 'survive', became: 'survived', becoming: 'surviving' },
    'lex-state-change-survive': {
      'turns into': 'survives as', 'turn into': 'survive as', 'turned into': 'survived as', 'turning into': 'surviving as',
      'evolves into': 'survives as', 'evolve into': 'survive as', 'evolved into': 'survived as', 'evolving into': 'surviving as',
      'transforms into': 'survives as', 'transform into': 'survive as', 'transformed into': 'survived as', 'transforming into': 'surviving as',
      'develops into': 'survives as', 'develop into': 'survive as', 'developed into': 'survived as', 'developing into': 'surviving as',
      'grows into': 'survives as', 'grow into': 'survive as', 'grew into': 'survived as', 'growing into': 'surviving as',
      'emerges as': 'survives as', 'emerge as': 'survive as', 'emerged as': 'survived as', 'emerging as': 'surviving as'
    },
    'lex-focused-correctness-checking': {
      'checks for': 'performs focused correctness validation for', 'checks the': 'performs focused correctness validation against the', 'checks an': 'performs focused correctness validation against an', 'checks a': 'performs focused correctness validation against a',
      'check for': 'perform focused correctness validation for', 'check the': 'perform focused correctness validation against the', 'check an': 'perform focused correctness validation against an', 'check a': 'perform focused correctness validation against a',
      'checking for': 'performing focused correctness validation for', 'checking the': 'performing focused correctness validation against the', 'checking an': 'performing focused correctness validation against an', 'checking a': 'performing focused correctness validation against a',
      'checked for': 'performed focused correctness validation for', 'checked the': 'performed focused correctness validation against the', 'checked an': 'performed focused correctness validation against an', 'checked a': 'performed focused correctness validation against a'
    },
    'lex-focused-correctness-validation': {
      'verifies whether': 'performs focused correctness validation to determine whether', 'verify whether': 'perform focused correctness validation to determine whether', 'verifying whether': 'performing focused correctness validation to determine whether', 'verified whether': 'performed focused correctness validation to determine whether',
      'verifies the': 'performs focused correctness validation against the', 'verifies an': 'performs focused correctness validation against an', 'verifies a': 'performs focused correctness validation against a', 'verify the': 'perform focused correctness validation against the', 'verify an': 'perform focused correctness validation against an', 'verify a': 'perform focused correctness validation against a', 'verifying the': 'performing focused correctness validation against the', 'verifying an': 'performing focused correctness validation against an', 'verifying a': 'performing focused correctness validation against a', 'verified the': 'performed focused correctness validation against the', 'verified an': 'performed focused correctness validation against an', 'verified a': 'performed focused correctness validation against a',
      'validates the': 'performs focused correctness validation against the', 'validates an': 'performs focused correctness validation against an', 'validates a': 'performs focused correctness validation against a', 'validate the': 'perform focused correctness validation against the', 'validate an': 'perform focused correctness validation against an', 'validate a': 'perform focused correctness validation against a', 'validating the': 'performing focused correctness validation against the', 'validating an': 'performing focused correctness validation against an', 'validating a': 'performing focused correctness validation against a', 'validated the': 'performed focused correctness validation against the', 'validated an': 'performed focused correctness validation against an', 'validated a': 'performed focused correctness validation against a',
      'verifies': 'performs focused correctness validation against', verify: 'perform focused correctness validation against', verifying: 'performing focused correctness validation against', verified: 'performed focused correctness validation against', validates: 'performs focused correctness validation against', validate: 'perform focused correctness validation against', validating: 'performing focused correctness validation against', validated: 'performed focused correctness validation against', verification: 'focused correctness validation', validation: 'focused correctness validation'
    },
    'lex-correctness-gate': { tests: 'correctness gates', test: 'correctness gate', checks: 'correctness gates', check: 'correctness gate' },
    'lex-bounded-interval-period': {
      'a short period': 'a bounded interval', 'a brief period': 'a bounded interval', 'a short time': 'a bounded interval', 'a little while': 'a bounded interval', 'a short while': 'a bounded interval', 'a brief moment': 'a bounded interval',
      'some time': 'a bounded interval', 'a while': 'a bounded interval', 'a moment': 'a bounded interval', 'a minute': 'a bounded interval', 'a second': 'a bounded interval', 'a bit': 'a bounded interval'
    },
    'lex-bounded-interval-adverb': { momentarily: 'within a bounded interval', briefly: 'within a bounded interval', shortly: 'within a bounded interval', soon: 'within a bounded interval' },
    'lex-deterministic-outcome': {
      'same result': 'deterministic outcome', 'same outcome': 'deterministic outcome', 'same output': 'deterministic outcome',
      'identical result': 'deterministic outcome', 'identical outcome': 'deterministic outcome', 'consistent result': 'deterministic outcome'
    },
    'lex-deterministic': { repeatable: 'deterministic', reproducible: 'deterministic', consistent: 'deterministic', predictable: 'deterministic' },
    'lex-sharply-defined': {
      straightforward: 'sharply defined', obvious: 'sharply defined', clear: 'sharply defined', simple: 'sharply defined',
      plain: 'sharply defined', apparent: 'sharply defined', evident: 'sharply defined', direct: 'sharply defined', easy: 'sharply defined'
    },
    'lex-assured-durability': { dependable: 'assured durability path', reliable: 'assured durability path' },
    'lex-invariant': {
      'self-evident': 'invariant', unambiguous: 'invariant', uncomplicated: 'invariant', plainspoken: 'invariant', explicit: 'invariant', definite: 'invariant'
    },
    'lex-neutral-not-a-win': {
      'neither good nor bad': 'neutral, not a win', 'neither positive nor negative': 'neutral, not a win', 'neither beneficial nor harmful': 'neutral, not a win',
      'neither favorable nor unfavorable': 'neutral, not a win', 'neither a success nor a failure': 'neutral, not a win', 'neither a win nor a loss': 'neutral, not a win',
      'middle-of-the-road': 'neutral, not a win', neutral: 'neutral, not a win', middling: 'neutral, not a win', average: 'neutral, not a win', indifferent: 'neutral, not a win'
    }
  };
  return forms[ruleId]?.[normalized] ?? fallback;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function entry(ruleId, category, sourceNode, sourceOffset) {
  return Object.freeze({ ruleId, category, sourceNode, sourceOffset });
}
