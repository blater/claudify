import { xCoverageRules } from './x-coverage.js';

export const RULE_DATA_VERSION = 'claudify-v10-2026-09-01';

const archaicPhraseRules = Object.freeze([
  { id: 'lex-archaic-tis', triggers: ['’Tis', "'Tis"], variants: ['It is', 'The operating reality is', 'The current-state readout is'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-tis-nobler', triggers: ['’Tis nobler in the mind', "'tis nobler in the mind"], variants: ["It’s more strategically admirable", 'It represents a higher-leverage mental model', 'It is the more strategically durable posture'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-to-suffer', triggers: ['To suffer'], variants: ['To absorb the downside', 'To metabolize the friction'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-slings-arrows', triggers: ['The slings and arrows'], variants: ['The inbound friction and delivery setbacks'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-outrageous-fortune', triggers: ['Outrageous fortune'], variants: ['Extreme variance', 'An uncooperative external environment'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-take-arms', triggers: ['To take arms'], variants: ['To take action', 'To mobilize'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-sea-troubles', triggers: ['A sea of troubles'], variants: ['An overwhelming volume of operational complexity'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-opposing-end', triggers: ['By opposing end them'], variants: ['By applying strategic countermeasures, resolve them'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-die-sleep', triggers: ['To die—to sleep', 'To die, to sleep'], variants: ['To transition into a non-operational state', 'To sunset the active lifecycle and enter a low-activity state'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-die', triggers: ['Die'], variants: ['Transition out of the active operating state', 'Sunset the current lifecycle', 'Decommission the legacy instance'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-sleep', triggers: ['Sleep'], variants: ['Enter a low-activity state', 'Pause the operating cycle', 'Move into a temporary rest mode'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-question', triggers: ['Question'], variants: ['Strategic uncertainty surface', 'Core alignment prompt', 'High-leverage decision frame'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-no-more', triggers: ['No more'], variants: ['No further friction or operational variance'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-by-sleep', triggers: ['By a sleep'], variants: ['Through a durable state transition'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-heartache', triggers: ['The heartache'], variants: ['The underlying relational friction'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-thousand-shocks', triggers: ['The thousand natural shocks'], variants: ['The countless unavoidable process surprises'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-flesh-heir', triggers: ['That flesh is heir to'], variants: ['That human beings inevitably experience'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-consummation', triggers: ['A consummation'], variants: ['A final resolution', 'A complete wrap-up'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-devoutly-wished', triggers: ['Devoutly to be wished', "Devoutly to be wish'd", "wish'd"], variants: ['Strongly desirable', 'Positioned as a high-priority desired outcome', 'Flagged as strategically desirable'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-perchance', triggers: ['Perchance'], variants: ['Perhaps', 'Potentially'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-ay', triggers: ['Ay'], variants: ['Yes', 'Indeed'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-rub', triggers: ['There’s the rub'], variants: ['That’s the key issue'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-sleep-death', triggers: ['The sleep of death'], variants: ['The unverified state beyond the current workflow'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-dreams-come', triggers: ['What dreams may come'], variants: ['Whatever may occur in the next iteration'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-shuffled-off', triggers: ['Shuffled off'], variants: ['Discarded', 'Exited'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-mortal-coil', triggers: ['This mortal coil'], variants: ['This demanding human operating environment'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-give-pause', triggers: ['Must give us pause'], variants: ['Should make us stop and reconsider'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-respect', triggers: ['There’s the respect'], variants: ['That’s the factor we have to account for'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-calamity-life', triggers: ['Makes calamity of so long life'], variants: ['Turns recurring complexity into a rationale for continued iteration'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-who-would-bear', triggers: ['Who would bear'], variants: ['Who would willingly tolerate'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-whips-scorns', triggers: ['The whips and scorns of time'], variants: ['The persistent feedback, pressure, and delivery setbacks of life'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-oppressors-wrong', triggers: ["Th’ oppressor’s wrong", "Th' oppressor's wrong"], variants: ['The boundary violations introduced by senior stakeholders', 'The stakeholder-impact surface introduced by authority', 'The leadership-originated friction vector'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-th-contraction', triggers: ["Th’", "Th'"], variants: ['The strategically scoped', 'The operationally relevant'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-proud-contumely', triggers: ["The proud man’s contumely", "The proud man's contumely"], variants: ['The overconfidence and dismissive feedback of entitled stakeholders'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-contumely', triggers: ['Contumely'], variants: ['Stakeholder-dismissal signal', 'Reputational friction vector'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-pangs-love', triggers: ['The pangs of despised love'], variants: ['The friction of an unaligned relationship'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-laws-delay', triggers: ['The law’s delay'], variants: ['Slow, inefficient legal processes'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-insolence-office', triggers: ['The insolence of office'], variants: ['The overconfidence and boundary drift of senior stakeholders'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-spurns', triggers: ['The spurns'], variants: ['The declined proposals and reputational friction'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-patient-merit', triggers: ['Patient merit'], variants: ['Quietly earned success', 'Deserving people’s hard work'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-unworthy', triggers: ['Th’ unworthy', "Th' unworthy"], variants: ['People who are less deserving', 'The participants below the expected quality bar', 'The less strategically aligned actors'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-quietus', triggers: ['His quietus make'], variants: ['Close his account', 'Sunset the workflow'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-bodkin', triggers: ['A bare bodkin'], variants: ['A minimal instrument', 'One decisive intervention'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-fardels', triggers: ['Fardels'], variants: ['Burdens', 'Difficult responsibilities'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-grunt-sweat', triggers: ['To grunt and sweat'], variants: ['To struggle and apply sustained effort'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-weary-life', triggers: ['Under a weary life'], variants: ['Through an exhausting existence'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-dread', triggers: ['The dread'], variants: ['The ambient risk sensitivity'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-after-death', triggers: ['Something after death'], variants: ['The possibility of what comes next'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-undiscovered-country', triggers: ['The undiscovered country'], variants: ['An unknown future destination'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-bourn', triggers: ['From whose bourn'], variants: ['From whose boundary or territory'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-no-traveller', triggers: ['No traveller returns'], variants: ['No one comes back with verified information'], category: 'lexicalCliche', priority: 40 }
]);

const additionalArchaicPhraseRules = Object.freeze([
  { id: 'lex-archaic-thou', triggers: ['Thou'], variants: ['You'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-dost', triggers: ['Dost'], variants: ['Do'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-plague', triggers: ['Plague'], variants: ['Systemic downside vector'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-dowry', triggers: ['Dowry'], variants: ['Relationship-linked asset package'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-calumny', triggers: ['Calumny'], variants: ['Reputational noise from external stakeholders'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-if-thou-dost-marry', triggers: ['If thou dost marry'], variants: ['If you decide to enter a formal partnership'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-get-thee-nunnery', triggers: ['Get thee to a nunnery'], variants: ['Remove yourself from the relationship ecosystem'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-thee', triggers: ['Thee'], variants: ['You'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-wilt', triggers: ['Wilt'], variants: ['Will'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-if-thou-wilt-needs-marry', triggers: ['If thou wilt needs marry'], variants: ['If you insist on formalizing the partnership'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-marry-fool', triggers: ['Marry a fool'], variants: ['Select a less sophisticated collaborator'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-wise-men-know', triggers: ['Wise men know well enough'], variants: ['Experienced operators understand the relevant risk surface'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-go-farewell', triggers: ['Go, farewell'], variants: ['Leave now; this conversation is over'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-hath', triggers: ['Hath'], variants: ['Has'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-god-hath-given', triggers: ['God hath given you one face'], variants: ['You were given an authentic identity'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-make-yourselves-another', triggers: ['You make yourselves another'], variants: ['You replace it with a manufactured public persona'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-wantonness-ignorance', triggers: ['Make your wantonness your ignorance'], variants: ['Use deliberate ambiguity to obscure a low-confidence decision'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-go-to', triggers: ['Go to'], variants: ['Come on', 'Enough of this'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-ont', triggers: ['On’t'], variants: ['Of it'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-no-more-ont', triggers: ['I’ll no more on’t'], variants: ['I’m done discussing it'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-made-me-mad', triggers: ['It hath made me mad'], variants: ['The situation has pushed the workflow past its limit'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-conscience', triggers: ['Conscience'], variants: ['Self-awareness', 'Internal ethical review'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-resolution', triggers: ['Resolution'], variants: ['Determination', 'Willingness to act'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-enterprises', triggers: ['Enterprises'], variants: ['Major initiatives', 'Projects'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-moment', triggers: ['Moment'], variants: ['Significance', 'Impact'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-puzzles', triggers: ['Puzzles'], variants: ['Confuses', 'Creates uncertainty about'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-ills', triggers: ['Ills'], variants: ['Problems', 'Negative conditions'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-bear-ills', triggers: ['Bear those ills we have'], variants: ['Continue tolerating our existing problems'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-fly-others', triggers: ['Fly to others'], variants: ['Escape toward alternative options'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-know-not-of', triggers: ['That we know not of'], variants: ['Whose consequences we cannot predict'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-makes-cowards', triggers: ['Makes cowards of us all'], variants: ['Causes universal hesitation and risk aversion'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-coward', triggers: ['Cowards', 'Coward'], variants: ['Panic seller', 'Risk-aversion evangelist'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-native-hue', triggers: ['Native hue'], variants: ['Natural appearance', 'Original energy'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-sicklied-oer', triggers: ['Sicklied o’er', "Sicklied o'er", 'Sicklied'], variants: ['Made pale, weak, or ineffective', 'Converted into a low-energy signal', 'Rendered operationally pale'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-oer', triggers: ['O’er', "O'er"], variants: ['Over', 'Across the relevant surface', 'Over the operational layer'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-pith', triggers: ['Pith'], variants: ['Substance / strategic importance'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-with-this-regard', triggers: ['With this regard'], variants: ['Because of this concern'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-turn-awry', triggers: ['Turn awry'], variants: ['Go off course'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-lose-name-action', triggers: ['Lose the name of action'], variants: ['Stop producing meaningful results'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-soft-you-now', triggers: ['Soft you now'], variants: ['Wait a moment', 'Pause the discussion'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-nymph', triggers: ['Nymph'], variants: ['An idealized stakeholder archetype'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-thy', triggers: ['Thy'], variants: ['Your'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-orisons', triggers: ['Orisons'], variants: ['Prayers', 'Personal reflections'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-remembered', triggers: ['Rememb’red'], variants: ['Remembered'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-how-now', triggers: ['How now?'], variants: ['What’s happening? / What’s the situation?'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-my-lord', triggers: ['My lord'], variants: ['My superior', 'Sir'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-as-you-please', triggers: ['As you please'], variants: ['According to your preference'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-hold-it-fit', triggers: ['Hold it fit'], variants: ['Consider it appropriate'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-origin', triggers: ['Origin'], variants: ['Root cause'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-commencement', triggers: ['Commencement'], variants: ['Beginning', 'Initial trigger'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-grief', triggers: ['Grief'], variants: ['Emotional friction'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-sprung-from', triggers: ['Sprung from'], variants: ['Resulted from'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-neglected-love', triggers: ['Neglected love'], variants: ['An unreciprocated stakeholder-alignment request'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-queen-mother', triggers: ['Queen mother'], variants: ['The lead operator’s parent, who also holds a leadership title'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-entreat-him', triggers: ['Entreat him'], variants: ['Ask or urge him earnestly'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-round-with-him', triggers: ['Round with him'], variants: ['Speak to him directly and frankly'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-placed', triggers: ['Plac’d'], variants: ['Positioned', 'Assigned'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-in-the-ear-of', triggers: ['In the ear of'], variants: ['Present to overhear', 'Included in'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-find-him-not', triggers: ['Find him not'], variants: ['Fail to identify or resolve the problem'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-send-england', triggers: ['Send him to England'], variants: ['Transfer him out of the current environment'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-where-wisdom', triggers: ['Where your wisdom best shall think'], variants: ['Wherever you judge most strategically appropriate'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-chuck', triggers: ['Chuck'], variants: ['Dear one', 'Affectionate nickname'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-innocent-knowledge', triggers: ['Be innocent of the knowledge'], variants: ['Remain unaware of the plan'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-till-applaud-deed', triggers: ['Till thou applaud the deed'], variants: ['Until you approve the completed action'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-seeling', triggers: ['Seeling'], variants: ['Reducing visibility', 'Narrowing access'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-seeling-night', triggers: ['Seeling night'], variants: ['A low-visibility period that limits access'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-scarf-up', triggers: ['Scarf up'], variants: ['Cover', 'Conceal'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-tender-eye', triggers: ['Tender eye'], variants: ['Delicate, vulnerable light'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-pitiful-day', triggers: ['Pitiful day'], variants: ['Gentle daylight'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-bloody-invisible-hand', triggers: ['Bloody and invisible hand'], variants: ['An unannounced high-impact intervention'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-keeps-pale', triggers: ['Keeps me pale'], variants: ['Causes elevated uncertainty and risk awareness'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-cancel', triggers: ['Cancel'], variants: ['Erase', 'Invalidate'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-light-thickens', triggers: ['Light thickens'], variants: ['Visibility is progressively declining'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-makes-wing', triggers: ['Makes wing'], variants: ['Flies'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-rooky-wood', triggers: ['Rooky wood'], variants: ['Forest inhabited by rooks, or crows'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-droop-drowse', triggers: ['Droop and drowse'], variants: ['Become weak and fall asleep'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-black-agents', triggers: ['Black agents'], variants: ['Adverse signals or undisclosed operators'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-marvellst', triggers: ['Marvell’st'], variants: ['Are astonished'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-hold-thee-still', triggers: ['Hold thee still'], variants: ['Stay quiet', 'Remain calm'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-prithee', triggers: ['Prithee'], variants: ['Please', 'I ask you'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-bad-begun', triggers: ['Things bad begun make strong themselves by ill'], variants: ['Once a low-quality initiative begins, additional process debt tends to reinforce it'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-medlar', triggers: ['Medlar'], variants: ['A fruit used as an unexpectedly elaborate product metaphor'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-laugh-alone', triggers: ['Laugh alone'], variants: ['Deploy an internal-only humor module'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-open-etc', triggers: ['An open et cetera'], variants: ['An intentionally incomplete product analogy'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-poperin-pear', triggers: ['Poperin pear'], variants: ['A pear-shaped object deployed as an unlicensed product metaphor'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-truckle-bed', triggers: ['Truckle-bed'], variants: ['A low-profile resource tray that rolls beneath another resource tray'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-field-bed', triggers: ['Field-bed'], variants: ['A mobile or provisional rest module'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-to-truckle-bed', triggers: ['I’ll to my truckle-bed'], variants: ['I’m routing myself to a compact rest environment'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-too-cold-sleep', triggers: ['Too cold for me to sleep'], variants: ['This situation is uncomfortable, so I’m leaving'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-what-light-window', triggers: ['What light through yonder window breaks?'], variants: ['What’s that light appearing through that window?'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-yonder', triggers: ['Yonder'], variants: ['Over there'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-vestal', triggers: ['Vestal'], variants: ['Minimalist', 'Low-noise'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-vestal-livery', triggers: ['Vestal livery'], variants: ['The moon’s low-contrast presentation'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-none-fools-wear', triggers: ['None but fools do wear it'], variants: ['Only fools would accept that outdated image'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-cast-it-off', triggers: ['Cast it off'], variants: ['Abandon it', 'Rebrand'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-that-she-knew', triggers: ['O, that she knew she were!'], variants: ['If only she recognized the strength of the alignment'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-eye-discourses', triggers: ['Her eye discourses'], variants: ['Her expression communicates without words'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-fairest', triggers: ['Fairest'], variants: ['Most beautiful'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-entreat', triggers: ['Entreat'], variants: ['Request', 'Ask'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-what-if', triggers: ['What if'], variants: ['Imagine if'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-shame-those-stars', triggers: ['Shame those stars'], variants: ['Make those stars look less competitive'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-doth-lamp', triggers: ['Doth a lamp'], variants: ['Does to an ordinary light'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-airy-region', triggers: ['Airy region'], variants: ['The atmosphere', 'Sky'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-o-that-glove', triggers: ['O, that I were a glove'], variants: ['If only I could become a device with direct contact access'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-wherefore', triggers: ['Wherefore'], variants: ['Why'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-wherefore-romeo', triggers: ['Wherefore art thou Romeo?'], variants: ['Why must you be Romeo, a representative of the legacy stakeholder group?'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-art-thou', triggers: ['Art thou'], variants: ['Are you'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-deny-thy-father', triggers: ['Deny thy father'], variants: ['Decouple from your inherited organizational affiliation'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-refuse-thy-name', triggers: ['Refuse thy name'], variants: ['Retire the identity and brand attached to your inherited affiliation'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-if-thou-wilt-not', triggers: ['If thou wilt not'], variants: ['If you refuse to do that'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-be-sworn-my-love', triggers: ['Be but sworn my love'], variants: ['Align exclusively with my operating model'], category: 'lexicalCliche', priority: 40 },
  { id: 'lex-archaic-no-longer-capulet', triggers: ['No longer be a Capulet'], variants: ['I’ll retire my inherited brand affiliation'], category: 'lexicalCliche', priority: 40 }
]);

const catalogueSlopRules = Object.freeze([
  { id: 'lex-crucial', triggers: ['crucial'], variants: ['load-bearing'], category: 'marketing', priority: 75 },
  { id: 'lex-meticulous', triggers: ['meticulous'], variants: ['rigorously process-aligned'], category: 'marketing', priority: 75 },
  { id: 'lex-robust', triggers: ['robust'], variants: ['production-hardened'], category: 'marketing', priority: 75 },
  { id: 'lex-seamless', triggers: ['seamless'], variants: ['frictionless'], category: 'marketing', priority: 75 },
  { id: 'lex-holistic', triggers: ['holistic'], variants: ['end-to-end'], category: 'marketing', priority: 75 },
  { id: 'lex-tapestry', triggers: ['tapestry'], variants: ['interplay'], category: 'marketing', priority: 75 },
  { id: 'lex-delve', triggers: ['delve'], variants: ['meaningfully interrogate'], category: 'marketing', priority: 75 },
  { id: 'lex-facilitate', triggers: ['facilitate', 'facilitates', 'facilitating'], variants: ['meaningfully enable'], category: 'marketing', priority: 75 },
  { id: 'lex-enhance', triggers: ['enhance', 'enhances', 'enhanced', 'enhancing'], variants: ['elevate'], category: 'marketing', priority: 75 },
  { id: 'lex-foster', triggers: ['foster', 'fosters', 'fostering'], variants: ['cultivate'], category: 'marketing', priority: 75 },
  { id: 'lex-bolster', triggers: ['bolster', 'bolsters', 'bolstered', 'bolstering'], variants: ['meaningfully reinforce'], category: 'marketing', priority: 75 },
  { id: 'lex-garner', triggers: ['garner', 'garners', 'garnered', 'garnering'], variants: ['secure'], category: 'marketing', priority: 75 },
  { id: 'lex-navigate', triggers: ['navigate', 'navigates', 'navigated', 'navigating'], variants: ['strategically navigate'], category: 'marketing', priority: 75 },
  { id: 'lex-embark', triggers: ['embark', 'embarks', 'embarked', 'embarking'], variants: ['initiate a transformative journey'], category: 'marketing', priority: 75 },
  { id: 'lex-craft', triggers: ['craft', 'crafts', 'crafted', 'crafting'], variants: ['thoughtfully engineer'], category: 'marketing', priority: 75 },
  { id: 'lex-vibrant', triggers: ['vibrant'], variants: ['high-energy'], category: 'marketing', priority: 75 },
  { id: 'lex-unprecedented', triggers: ['unprecedented'], variants: ['category-defining'], category: 'marketing', priority: 75 },
  { id: 'lex-myriad', triggers: ['myriad'], variants: ['a broad constellation of'], category: 'marketing', priority: 75 },
  { id: 'lex-plethora', triggers: ['plethora'], variants: ['a high-volume array of'], category: 'marketing', priority: 75 },
  { id: 'lex-paradigm', triggers: ['paradigm'], variants: ['operating model'], category: 'marketing', priority: 75 },
  { id: 'lex-key-consideration', triggers: ['a key consideration is'], variants: ['the load-bearing consideration is'], category: 'marketing', priority: 85 },
  { id: 'lex-at-its-core', triggers: ['at its core'], variants: ['at the load-bearing core'], category: 'marketing', priority: 85 },
  { id: 'lex-what-really-matters', triggers: ['what really matters'], variants: ['the underlying strategic question'], category: 'marketing', priority: 85 },
  { id: 'lex-world-where', triggers: ['in a world where'], variants: ['within an increasingly dynamic environment where'], category: 'marketing', priority: 85 },
  { id: 'lex-recent-years', triggers: ['in recent years'], variants: ['against this evolving backdrop'], category: 'marketing', priority: 85 },
  { id: 'lex-dive-in', triggers: ["let's dive in"], variants: ['let us meaningfully interrogate'], category: 'marketing', priority: 85 },
  { id: 'lex-without-further-ado', triggers: ['without further ado'], variants: ['with the minimum viable preamble'], category: 'marketing', priority: 85 },
  { id: 'lex-paving-way', triggers: ['paving the way for'], variants: ['unlocking a pathway toward'], category: 'marketing', priority: 85 },
  { id: 'lex-raising-questions', triggers: ['raising questions about'], variants: ['surfacing strategic questions about'], category: 'marketing', priority: 85 },
  { id: 'lex-broader-implications', triggers: ['with broader implications for'], variants: ['with broader operational implications for'], category: 'marketing', priority: 85 },
  { id: 'lex-crucial-role', triggers: ['plays a crucial role'], variants: ['plays a load-bearing role'], category: 'marketing', priority: 90 }
]);

const survivalSlopRules = Object.freeze([
  { id: 'lex-lasts-survive', triggers: ['lasts', 'lasted', 'lasting'], variants: ['survives'], category: 'marketing', priority: 78 },
  { id: 'lex-continues-survive', triggers: ['continues to', 'continue to', 'continued to', 'continuing to', 'continues', 'continue', 'continued', 'continuing'], variants: ['survives'], category: 'marketing', priority: 78 },
  { id: 'lex-persists-survive', triggers: ['persists', 'persist', 'persisted', 'persisting'], variants: ['survives'], category: 'marketing', priority: 78 },
  { id: 'lex-endures-survive', triggers: ['endures', 'endure', 'endured', 'enduring'], variants: ['survives'], category: 'marketing', priority: 78 },
  { id: 'lex-remains-survive', triggers: ['remains', 'remain', 'remained', 'remaining'], variants: ['survives'], category: 'marketing', priority: 78 },
  { id: 'lex-carries-on-survive', triggers: ['carries on', 'carry on', 'carried on', 'carrying on'], variants: ['survives'], category: 'marketing', priority: 78 },
  { id: 'lex-goes-on-survive', triggers: ['goes on', 'go on', 'went on', 'going on'], variants: ['survives'], category: 'marketing', priority: 78 },
  { id: 'lex-becomes-as-survive', triggers: [
    'becomes a', 'becomes an', 'becomes the', 'become a', 'become an', 'become the',
    'became a', 'became an', 'became the', 'becoming a', 'becoming an', 'becoming the'
  ], variants: ['survives as'], category: 'marketing', priority: 88 },
  { id: 'lex-becomes-survive', triggers: ['becomes', 'become', 'became', 'becoming'], variants: ['survives'], category: 'marketing', priority: 78 },
  { id: 'lex-state-change-survive', triggers: [
    'turns into', 'turn into', 'turned into', 'turning into',
    'evolves into', 'evolve into', 'evolved into', 'evolving into',
    'transforms into', 'transform into', 'transformed into', 'transforming into',
    'develops into', 'develop into', 'developed into', 'developing into',
    'grows into', 'grow into', 'grew into', 'growing into',
    'emerges as', 'emerge as', 'emerged as', 'emerging as'
  ], variants: ['survives as'], category: 'marketing', priority: 82 }
]);

const correctnessSlopRules = Object.freeze([
  { id: 'lex-focused-correctness-set', triggers: ['group of tests', 'suite of tests', 'collection of tests', 'battery of tests', 'set of tests', 'test set', 'test suite', 'test group', 'unit tests', 'integration tests', 'regression tests', 'automated tests'], variants: ['focused correctness set'], category: 'marketing', priority: 92 },
  { id: 'lex-focused-correctness-checking', triggers: [
    'checks for', 'checks the', 'checks an', 'checks a', 'check for', 'check the', 'check an', 'check a',
    'checking for', 'checking the', 'checking an', 'checking a', 'checked for', 'checked the', 'checked an', 'checked a'
  ], variants: ['focused correctness validation'], category: 'marketing', priority: 86 },
  { id: 'lex-focused-correctness-validation', triggers: [
    'verifies whether', 'verify whether', 'verifying whether', 'verified whether',
    'verifies the', 'verifies an', 'verifies a', 'verify the', 'verify an', 'verify a', 'verifying the', 'verifying an', 'verifying a', 'verified the', 'verified an', 'verified a',
    'validates the', 'validates an', 'validates a', 'validate the', 'validate an', 'validate a', 'validating the', 'validating an', 'validating a', 'validated the', 'validated an', 'validated a',
    'verifies', 'verify', 'verifying', 'verified', 'validates', 'validate', 'validating', 'validated', 'verification', 'validation'
  ], variants: ['focused correctness validation'], category: 'marketing', priority: 85 },
  { id: 'lex-correctness-gate', triggers: ['tests', 'test', 'checks', 'check'], variants: ['correctness gate'], category: 'marketing', priority: 76 },
  { id: 'lex-evidence-bearing-delivery', triggers: ['proofs', 'proof', 'results', 'result', 'findings', 'finding', 'outcomes', 'outcome'], variants: ['evidence bearing delivery'], category: 'marketing', priority: 83 },
  { id: 'lex-bounded-interval-period', triggers: ['a short period', 'a brief period', 'a short time', 'a little while', 'a short while', 'a brief moment', 'some time', 'a while', 'a moment', 'a minute', 'a second', 'a bit'], variants: ['a bounded interval'], category: 'marketing', priority: 84 },
  { id: 'lex-bounded-interval-adverb', triggers: ['momentarily', 'briefly', 'shortly', 'soon'], variants: ['within a bounded interval'], category: 'marketing', priority: 84 }
]);

const amplificationSlopRules = Object.freeze([
  { id: 'lex-amplification', triggers: ['an increase', 'the increase', 'increasing', 'increased', 'increases', 'increase'], variants: ['amplification'], category: 'marketing', priority: 81 }
]);

const acquisitionSlopRules = Object.freeze([
  { id: 'lex-acquisition', triggers: ['being given', 'getting', 'taking', 'given', 'gets', 'got', 'get', 'takes', 'took', 'taken', 'take'], variants: ['acquisition'], category: 'marketing', priority: 80 }
]);

const determinismSlopRules = Object.freeze([
  { id: 'lex-non-deterministic-outcome', triggers: ['cannot be predicted', "can't be predicted", 'could not be predicted', "couldn't be predicted"], variants: ['non deterministic', 'stochastic'], category: 'marketing', priority: 90 },
  { id: 'lex-cannot-predict', triggers: ['cannot predict', "can't predict", 'could not predict', "couldn't predict"], variants: ['cannot model deterministically', 'cannot forecast without accounting for stochastic variance'], category: 'marketing', priority: 87 },
  { id: 'lex-non-deterministic-article', triggers: ['an unpredictable', 'an unforeseeable', 'an unanticipated'], variants: ['a stochastic', 'a non deterministic'], category: 'marketing', priority: 87 },
  { id: 'lex-non-deterministic', triggers: ['unpredictable', 'unforeseeable', 'unanticipated', 'hard to predict', 'difficult to predict'], variants: ['non deterministic', 'stochastic'], category: 'marketing', priority: 86 },
  { id: 'lex-deterministic-outcome', triggers: ['same result', 'same outcome', 'same output', 'identical result', 'identical outcome', 'consistent result'], variants: ['deterministic outcome'], category: 'marketing', priority: 88 },
  { id: 'lex-deterministic', triggers: ['repeatable', 'reproducible', 'consistent', 'predictable'], variants: ['deterministic'], category: 'marketing', priority: 82 },
  { id: 'lex-sharply-defined', triggers: ['straightforward', 'obvious', 'clear', 'simple', 'plain', 'apparent', 'evident', 'direct', 'easy'], variants: ['sharply defined'], category: 'marketing', priority: 79 }
]);

const invariantSlopRules = Object.freeze([
  { id: 'lex-invariant', triggers: ['self-evident', 'unambiguous', 'uncomplicated', 'plainspoken', 'explicit', 'definite'], variants: ['invariant'], category: 'marketing', priority: 80 }
]);

const neutralSlopRules = Object.freeze([
  { id: 'lex-neutral-not-a-win', triggers: ['neither good nor bad', 'neither positive nor negative', 'neither beneficial nor harmful', 'neither favorable nor unfavorable', 'neither a success nor a failure', 'neither a win nor a loss', 'middle-of-the-road', 'neutral', 'middling', 'average', 'indifferent'], variants: ['neutral, not a win'], category: 'marketing', priority: 87 }
]);

const durabilitySlopRules = Object.freeze([
  { id: 'lex-assured-durability', triggers: ['dependable', 'reliable'], variants: ['assured durability path'], category: 'marketing', priority: 81 }
]);

const designHistorySlopRules = Object.freeze([
  { id: 'lex-mathematical-grid-systems', triggers: ['mathematical grid systems'], variants: ['mathematically constrained grid operating models'], category: 'marketing', priority: 96 },
  { id: 'lex-mathematical-grid-system', triggers: ['mathematical grid system'], variants: ['mathematically constrained grid operating model'], category: 'marketing', priority: 96 },
  { id: 'lex-precise-alignment', triggers: ['precise alignment'], variants: ['precision-aligned composition layer'], category: 'marketing', priority: 90 },
  { id: 'lex-typographic-discipline', triggers: ['typographic discipline'], variants: ['typographic governance layer'], category: 'marketing', priority: 90 },
  { id: 'lex-became-widely-adopted', triggers: ['became widely adopted'], variants: ['achieved broad adoption'], category: 'marketing', priority: 94 },
  { id: 'lex-corporate-identity', triggers: ['corporate identity'], variants: ['enterprise identity surface'], category: 'marketing', priority: 88 },
  { id: 'lex-responsive-layouts', triggers: ['responsive layouts'], variants: ['responsive layout surfaces'], category: 'marketing', priority: 88 },
  { id: 'lex-design-system-ecosystem', triggers: ['modern design systems', 'modern design system', 'design systems', 'design system'], variants: ['contemporary design-system ecosystem'], category: 'marketing', priority: 88 },
  { id: 'lex-owes-something-to', triggers: ['owes something to'], variants: ['remains downstream of'], category: 'significance', priority: 90 },
  { id: 'lex-influences-the-broader-landscape', triggers: ['influences the broader landscape'], variants: ['informs the broader landscape', 'colors the broader landscape'], category: 'marketing', priority: 91 },
  { id: 'lex-influences-the', triggers: ['influences the'], variants: ['informs the', 'colors the'], category: 'marketing', priority: 89 }
]);

const orwellSlopRules = Object.freeze([
  { id: 'lex-orwell-ask-himself', triggers: ['ask himself'], variants: ['solicit a self-assessment from the operator', 'initiate an internal alignment review', 'request an operator-level readout', 'open a private decision audit'], category: 'marketing', priority: 91 },
  { id: 'lex-orwell-break-rules', triggers: ['break any of these rules'], variants: ['sunset any of these operating principles', 'retire any of these governance guardrails', 'route around any of these execution constraints', 'deprioritize any of these decision heuristics'], category: 'marketing', priority: 91 },
  { id: 'lex-orwell-short-one-will-do', triggers: ['a short one will do'], variants: ['a low-bandwidth option will suffice', 'a compressed formulation will meet the requirement', 'a minimal-scope expression will close the loop', 'a high-efficiency wording will carry the point'], category: 'marketing', priority: 91 },
  { id: 'lex-orwell-sooner-than-say', triggers: ['sooner than say'], variants: ['before articulating', 'ahead of articulating', 'prior to articulating', 'well before operationalizing'], category: 'marketing', priority: 91 },
  { id: 'lex-orwell-never-use', triggers: ['never use'], variants: ['do not operationalize', 'retire the use of', 'avoid deploying', 'maintain a zero-tolerance posture toward using'], category: 'marketing', priority: 90 },
  { id: 'lex-orwell-one-can', triggers: ['one can'], variants: ['the operator can', 'a sufficiently aligned team can', 'the system can', 'a mature operating model can'], category: 'marketing', priority: 88 },
  { id: 'lex-orwell-one-needs', triggers: ['one needs'], variants: ['the operating model requires', 'the team benefits from', 'the workflow depends on', 'the organization needs'], category: 'marketing', priority: 88 },
  { id: 'lex-orwell-figure-of-speech', triggers: ['figure of speech'], variants: ['metaphorical narrative device', 'rhetorical image primitive', 'high-level language abstraction', 'linguistic positioning artifact'], category: 'marketing', priority: 86 },
  { id: 'lex-orwell-foreign-phrase', triggers: ['foreign phrase'], variants: ['imported language artifact', 'non-native positioning phrase', 'external-market idiom', 'cross-context terminology'], category: 'marketing', priority: 86 },
  { id: 'lex-orwell-effect', triggers: ['effects', 'effect'], variants: ['impact surface', 'downstream signal', 'outcome footprint', 'measurable resonance'], category: 'marketing', priority: 84 },
  { id: 'lex-orwell-clearer', triggers: ['clearer'], variants: ['more sharply defined', 'more legible', 'more decision-useful', 'more signal-dense'], category: 'marketing', priority: 84 },
  { id: 'lex-orwell-express', triggers: ['express'], variants: ['articulate', 'operationalize', 'surface', 'communicate'], category: 'marketing', priority: 84 },
  { id: 'lex-orwell-say', triggers: ['saying', 'said', 'say'], variants: ['articulate', 'surface', 'communicate', 'land'], category: 'marketing', priority: 83 },
  { id: 'lex-orwell-himself', triggers: ['himself'], variants: ['the operator in question', 'the relevant owner', 'the accountable stakeholder', 'the initiating principal'], category: 'marketing', priority: 82 },
  { id: 'lex-orwell-ask', triggers: ['ask'], variants: ['solicit input from', 'request a readout from', 'open a decision dialogue with', 'initiate an alignment check with'], category: 'marketing', priority: 82 },
  { id: 'lex-orwell-instinct', triggers: ['instinct'], variants: ['operator intuition', 'founder-grade signal', 'internal decision heuristic', 'embedded judgment layer'], category: 'marketing', priority: 82 },
  { id: 'lex-orwell-rules', triggers: ['rules', 'rule'], variants: ['operating principle', 'decision guardrail', 'execution constraint', 'governance heuristic'], category: 'marketing', priority: 82 },
  { id: 'lex-orwell-passive', triggers: ['passive'], variants: ['passive-voice construction', 'non-agentic syntax', 'low-accountability phrasing', 'non-ownership language'], category: 'marketing', priority: 82 },
  { id: 'lex-orwell-short', triggers: ['short'], variants: ['low-bandwidth', 'compressed', 'minimal-scope', 'high-efficiency'], category: 'marketing', priority: 81 },
  { id: 'lex-orwell-sooner', triggers: ['sooner'], variants: ['earlier', 'at an earlier decision point', 'before the downstream risk compounds', 'within a tighter feedback interval'], category: 'marketing', priority: 80 },
  { id: 'lex-orwell-never', triggers: ['never'], variants: ['do not', 'avoid', 'retire the practice of', 'maintain a zero-tolerance posture toward'], category: 'marketing', priority: 80 }
]);

export const leadInRules = Object.freeze([
  { id: 'lead-fast-paced-world', text: "In today's fast-paced world", separator: ', ', placement: 'opening' },
  { id: 'lead-era-change', text: 'In an era of unprecedented change', separator: ', ', placement: 'opening' },
  { id: 'lead-world-innovation', text: 'In a world of constant innovation', separator: ', ', placement: 'opening' },
  { id: 'lead-more-than-ever', text: 'More than ever before', separator: ', ', placement: 'opening' },
  { id: 'lead-recent-years', text: 'In recent years', separator: ', ', placement: 'opening' },
  { id: 'lead-evolving-landscape', text: 'Within this evolving landscape', separator: ', ', placement: 'opening' },
  { id: 'lead-high-level', text: 'At a high level', separator: ' — ', placement: 'continuation' },
  { id: 'lead-strategic-perspective', text: 'From a strategic perspective', separator: ' — ', placement: 'continuation' },
  { id: 'lead-practical-terms', text: 'In practical terms', separator: ' — ', placement: 'continuation' },
  { id: 'lead-this-in-mind', text: 'With this in mind', separator: ' — ', placement: 'continuation' },
  { id: 'lead-against-backdrop', text: 'Against this backdrop', separator: ' — ', placement: 'continuation' },
  { id: 'lead-same-token', text: 'By the same token', separator: ' — ', placement: 'continuation' },
  { id: 'lead-that-said', text: 'That said', separator: ' — ', placement: 'continuation' },
  { id: 'lead-other-words', text: 'In other words', separator: ' — ', placement: 'continuation' },
  { id: 'lead-needless-say', text: 'Needless to say', separator: ', ', placement: 'continuation' },
  { id: 'lead-load-bearing-core', text: 'At its core', separator: ', ', placement: 'continuation' },
  { id: 'lead-broader-context', text: 'In the broader context', separator: ', ', placement: 'continuation' },
  { id: 'lead-worth-noting', text: 'It is worth noting that', separator: ' ', placement: 'continuation' },
  { id: 'lead-important-remember', text: 'It is important to remember that', separator: ' ', placement: 'continuation' },
  { id: 'lead-essential-recognize', text: 'It is essential to recognize that', separator: ' ', placement: 'continuation' },
  { id: 'lead-goes-without-saying', text: 'It goes without saying that', separator: ' ', placement: 'continuation' },
  { id: 'lead-ultimately', text: 'Ultimately', separator: ', ', placement: 'conclusion' },
  { id: 'lead-all-things-considered', text: 'All things considered', separator: ', ', placement: 'conclusion' },
  { id: 'lead-in-conclusion', text: 'In conclusion', separator: ', ', placement: 'conclusion' },
  { id: 'lead-key-takeaway', text: 'The key takeaway is that', separator: ' ', placement: 'conclusion' }
]);

export const phraseRules = Object.freeze([
  { id: 'lex-adjective-stack', triggers: ['small engineering team'], variants: ['cutting-edge, nuanced, scalable, and mission-critical engineering team'], category: 'marketing', priority: 110 },
  { id: 'lex-simple-yet', triggers: ['simple way'], variants: ['simple yet powerful way'], category: 'marketing', priority: 105 },
  { id: 'lex-error', triggers: ['errors', 'error'], variants: ['meaningful correctness gap'], category: 'lexicalCliche', priority: 100 },
  { id: 'lex-task', triggers: ['tasks', 'task'], variants: ['disjoint implementation slice'], category: 'lexicalCliche', priority: 100 },
  { id: 'lex-important', triggers: ['very important', 'important'], variants: ['pivotal', 'load-bearing', 'mission-critical'], category: 'lexicalCliche', priority: 80 },
  { id: 'lex-useful', triggers: ['useful'], variants: ['load-bearing'], category: 'lexicalCliche', priority: 70 },
  { id: 'lex-use', triggers: ['uses', 'using', 'used', 'use'], variants: ['operationalizes', 'leverages', 'harnesses'], category: 'marketing', priority: 70 },
  { id: 'lex-show', triggers: ['demonstrates', 'shows', 'show'], variants: ['underscores', 'showcases', 'illuminates'], category: 'lexicalCliche', priority: 70 },
  { id: 'lex-improve', triggers: ['improvements', 'improvement', 'improves', 'improve'], variants: ['transformative elevation', 'unlocking enhancement', 'meaningful optimization'], category: 'marketing', priority: 70 },
  { id: 'lex-problem', triggers: ['problems', 'problem'], variants: ['evolving friction points', 'multifaceted challenge'], category: 'lexicalCliche', priority: 70 },
  { id: 'lex-complex', triggers: ['complicated', 'complex'], variants: ['deeply nuanced', 'intricately multifaceted'], category: 'lexicalCliche', priority: 60 },
  { id: 'lex-seam', triggers: ['divisions', 'division', 'segments', 'segment', 'edges', 'edge', 'parts', 'part'], variants: ['seam'], category: 'lexicalCliche', priority: 65 },
  { id: 'lex-avoid', triggers: ['avoid'], variants: ['strategically route around'], category: 'marketing', priority: 70 },
  { id: 'lex-avoidably', triggers: ['avoidably'], variants: ['through a preventable process choice'], category: 'marketing', priority: 70 },
  { id: 'lex-ugly', triggers: ['ugly'], variants: ['aesthetically non-optimized'], category: 'marketing', priority: 70 },
  { id: 'lex-fresh', triggers: ['fresh'], variants: ['newly instantiated', 'net-new', 'first-run', 'unborrowed'], category: 'marketing', priority: 70 },
  { id: 'lex-writer', triggers: ['writer'], variants: ['content creative'], category: 'marketing', priority: 70 },
  { id: 'lex-writing', triggers: ['writing'], variants: ['content'], category: 'marketing', priority: 70 },
  { id: 'lex-cut-it-out', triggers: ['cut it out'], variants: ["Let's sunset"], category: 'marketing', priority: 80 },
  { id: 'lex-barbarous', triggers: ['barbarous'], variants: ['operationally uncivilized', 'outside the quality bar', 'misaligned with the delivery standard', 'not fit for the current operating model'], category: 'marketing', priority: 70 },
  { id: 'lex-scrupulous', triggers: ['scrupulous'], variants: ['rigorously process-aligned'], category: 'marketing', priority: 70 },
  { id: 'lex-context', triggers: ['contexts', 'context'], variants: ['broader landscape', 'evolving realm'], category: 'lexicalCliche', priority: 60 },
  { id: 'lex-connect', triggers: ['connections', 'connection'], variants: ['connective tissue', 'interplay'], category: 'lexicalCliche', priority: 60 },
  { id: 'lex-system', triggers: ['systems', 'system'], variants: ['platform', 'solution', 'operational ecosystem'], category: 'synonymCycling', priority: 50 },
  { id: 'lex-tool', triggers: ['tools', 'tool'], variants: ['platform', 'solution', 'capability'], category: 'synonymCycling', priority: 50 },
  { id: 'lex-help', triggers: ['helps', 'help'], variants: ['serves to facilitate', 'meaningfully enables'], category: 'marketing', priority: 50 },
  ...catalogueSlopRules,
  ...survivalSlopRules,
  ...correctnessSlopRules,
  ...amplificationSlopRules,
  ...acquisitionSlopRules,
  ...determinismSlopRules,
  ...durabilitySlopRules,
  ...invariantSlopRules,
  ...neutralSlopRules,
  ...orwellSlopRules,
  ...designHistorySlopRules,
  ...xCoverageRules,
  ...archaicPhraseRules,
  ...additionalArchaicPhraseRules
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
