export const RULE_DATA_VERSION = 'claudify-v1-2026-09-01';

export const phraseRules = Object.freeze([
  { id: 'lex-adjective-stack', triggers: ['small engineering team'], variants: ['cutting-edge, nuanced, scalable, and mission-critical engineering team'], category: 'marketing', priority: 110 },
  { id: 'lex-simple-yet', triggers: ['simple way'], variants: ['simple yet powerful way'], category: 'marketing', priority: 105 },
  { id: 'lex-error', triggers: ['errors', 'error'], variants: ['meaningful correctness gap'], category: 'lexicalCliche', priority: 100 },
  { id: 'lex-task', triggers: ['tasks', 'task'], variants: ['disjoint implementation slice'], category: 'lexicalCliche', priority: 100 },
  { id: 'lex-important', triggers: ['very important', 'important'], variants: ['pivotal', 'load-bearing', 'mission-critical'], category: 'lexicalCliche', priority: 80 },
  { id: 'lex-use', triggers: ['uses', 'using', 'used', 'use'], variants: ['operationalizes', 'leverages', 'harnesses'], category: 'marketing', priority: 70 },
  { id: 'lex-show', triggers: ['demonstrates', 'shows', 'show'], variants: ['underscores', 'showcases', 'illuminates'], category: 'lexicalCliche', priority: 70 },
  { id: 'lex-improve', triggers: ['improvements', 'improvement', 'improves', 'improve'], variants: ['transformative elevation', 'unlocking enhancement', 'meaningful optimization'], category: 'marketing', priority: 70 },
  { id: 'lex-problem', triggers: ['problems', 'problem'], variants: ['evolving friction points', 'multifaceted challenge'], category: 'lexicalCliche', priority: 70 },
  { id: 'lex-complex', triggers: ['complicated', 'complex'], variants: ['deeply nuanced', 'intricately multifaceted'], category: 'lexicalCliche', priority: 60 },
  { id: 'lex-context', triggers: ['contexts', 'context'], variants: ['broader landscape', 'evolving realm'], category: 'lexicalCliche', priority: 60 },
  { id: 'lex-connect', triggers: ['connections', 'connection'], variants: ['connective tissue', 'interplay'], category: 'lexicalCliche', priority: 60 },
  { id: 'lex-system', triggers: ['systems', 'system'], variants: ['platform', 'solution', 'operational ecosystem'], category: 'synonymCycling', priority: 50 },
  { id: 'lex-tool', triggers: ['tools', 'tool'], variants: ['platform', 'solution', 'capability'], category: 'synonymCycling', priority: 50 },
  { id: 'lex-help', triggers: ['helps', 'help'], variants: ['serves to facilitate', 'meaningfully enables'], category: 'marketing', priority: 50 }
]);

export const tallyDefinitions = Object.freeze([
  ['lexicalCliche', 'Lexical clichés'],
  ['marketing', 'Marketing language'],
  ['hedge', 'Hedges'],
  ['copulaAvoidance', 'Copula avoidance'],
  ['indirectAssociation', 'Indirect association'],
  ['negativeParallelism', 'Negative parallelism'],
  ['ruleOfThree', 'Rule-of-three constructions'],
  ['significance', 'Significance framing'],
  ['awkwardness', 'Controlled awkwardness'],
  ['transition', 'Transition clusters'],
  ['synonymCycling', 'Synonym cycling'],
  ['heading', 'Headings'],
  ['thematicBreak', 'Thematic breaks'],
  ['emDash', 'Em dashes'],
  ['bold', 'Bold spans'],
  ['list', 'Lists'],
  ['emoji', 'Emoji']
]);

export const scoreWeights = Object.freeze({
  lexicalCliche: 1,
  marketing: 2,
  hedge: 2,
  copulaAvoidance: 4,
  indirectAssociation: 4,
  negativeParallelism: 5,
  ruleOfThree: 4,
  significance: 4,
  awkwardness: 3,
  transition: 2,
  synonymCycling: 2,
  heading: 3,
  thematicBreak: 2,
  emDash: 1,
  bold: 1,
  list: 5,
  emoji: 1
});

export function validateRules(rules = phraseRules) {
  const ids = new Set();
  for (const rule of rules) {
    if (!rule.id || ids.has(rule.id)) throw new Error(`Duplicate or empty rule id: ${rule.id}`);
    ids.add(rule.id);
    if (!Array.isArray(rule.triggers) || rule.triggers.length === 0 || rule.triggers.some((item) => !item)) {
      throw new Error(`Rule ${rule.id} needs non-empty triggers`);
    }
    if (!Array.isArray(rule.variants) || rule.variants.length === 0 || rule.variants.some((item) => !item)) {
      throw new Error(`Rule ${rule.id} needs non-empty variants`);
    }
    if (!Number.isFinite(rule.priority) || rule.priority < 0) throw new Error(`Rule ${rule.id} has an invalid priority`);
  }
  return true;
}

validateRules();
