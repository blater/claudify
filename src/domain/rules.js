export const RULE_DATA_VERSION = 'claudify-v2-2026-09-01';

const archaicPhraseRules = Object.freeze([
  { id: 'lex-archaic-tis', triggers: ['’Tis'], variants: ['It is'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-tis-nobler', triggers: ['’Tis nobler in the mind'], variants: ["It’s more strategically admirable"], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-to-suffer', triggers: ['To suffer'], variants: ['To endure / absorb the downside'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-slings-arrows', triggers: ['The slings and arrows'], variants: ['The attacks and setbacks'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-outrageous-fortune', triggers: ['Outrageous fortune'], variants: ['Extreme bad luck / a hostile external environment'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-take-arms', triggers: ['To take arms'], variants: ['To take action / mobilize'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-sea-troubles', triggers: ['A sea of troubles'], variants: ['An overwhelming volume of problems'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-opposing-end', triggers: ['By opposing end them'], variants: ['By actively pushing back, eliminate them'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-die-sleep', triggers: ['To die—to sleep'], variants: ['To die is essentially to shut down'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-no-more', triggers: ['No more'], variants: ['No further pain or disruption'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-by-sleep', triggers: ['By a sleep'], variants: ['Through death / permanent shutdown'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-heartache', triggers: ['The heartache'], variants: ['Emotional pain'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-thousand-shocks', triggers: ['The thousand natural shocks'], variants: ['The countless unavoidable difficulties'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-flesh-heir', triggers: ['That flesh is heir to'], variants: ['That human beings inevitably experience'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-consummation', triggers: ['A consummation'], variants: ['A final resolution / complete wrap-up'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-devoutly-wished', triggers: ['Devoutly to be wished'], variants: ['Strongly desirable'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-perchance', triggers: ['Perchance'], variants: ['Perhaps / potentially'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-ay', triggers: ['Ay'], variants: ['Yes / indeed'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-rub', triggers: ['There’s the rub'], variants: ['That’s the key issue'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-sleep-death', triggers: ['The sleep of death'], variants: ['The unknown state after death'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-dreams-come', triggers: ['What dreams may come'], variants: ['Whatever may happen afterward'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-shuffled-off', triggers: ['Shuffled off'], variants: ['Discarded / exited'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-mortal-coil', triggers: ['This mortal coil'], variants: ['This difficult human existence'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-give-pause', triggers: ['Must give us pause'], variants: ['Should make us stop and reconsider'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-respect', triggers: ['There’s the respect'], variants: ['That’s the factor we have to account for'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-calamity-life', triggers: ['Makes calamity of so long life'], variants: ['Turns life’s problems into a reason to keep enduring them'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-whips-scorns', triggers: ['The whips and scorns of time'], variants: ['The constant criticism, pressure, and setbacks of life'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-oppressors-wrong', triggers: ["Th’ oppressor’s wrong"], variants: ['The abuse inflicted by powerful people'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-proud-contumely', triggers: ["The proud man’s contumely"], variants: ['The arrogance and insults of entitled people'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-pangs-love', triggers: ['The pangs of despised love'], variants: ['The pain of rejected or unreturned love'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-laws-delay', triggers: ['The law’s delay'], variants: ['Slow, inefficient legal processes'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-insolence-office', triggers: ['The insolence of office'], variants: ['The arrogance and abuse of people in positions of authority'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-spurns', triggers: ['The spurns'], variants: ['The rejections and humiliations'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-patient-merit', triggers: ['Patient merit'], variants: ['Quietly earned success / deserving people’s hard work'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-unworthy', triggers: ['Th’ unworthy'], variants: ['People who are less deserving'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-quietus', triggers: ['His quietus make'], variants: ['End his account / shut down his existence'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-bodkin', triggers: ['A bare bodkin'], variants: ['A simple dagger / one decisive action'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-fardels', triggers: ['Fardels'], variants: ['Burdens / difficult responsibilities'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-grunt-sweat', triggers: ['To grunt and sweat'], variants: ['To struggle and work painfully hard'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-weary-life', triggers: ['Under a weary life'], variants: ['Through an exhausting existence'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-dread', triggers: ['The dread'], variants: ['The fear'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-after-death', triggers: ['Something after death'], variants: ['The possibility of what comes next'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-undiscovered-country', triggers: ['The undiscovered country'], variants: ['An unknown future destination'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-bourn', triggers: ['From whose bourn'], variants: ['From whose boundary or territory'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-no-traveller', triggers: ['No traveller returns'], variants: ['No one comes back with verified information'], category: 'lexicalCliche', priority: 40 }
]);

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
  { id: 'lex-help', triggers: ['helps', 'help'], variants: ['serves to facilitate', 'meaningfully enables'], category: 'marketing', priority: 50 },
  ...archaicPhraseRules
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
