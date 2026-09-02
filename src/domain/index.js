/**
 * Pure Claudify domain API.
 * This module and everything it imports are intentionally free of DOM, fetch,
 * clipboard, storage, and UI-state dependencies.
 */
export { sourceScore, transform } from './engine.js?v=source-score-20260902';
export { serializeMarkdown, serializePlain, score, tally, toRichTree, validateDocument } from './document.js';
export { RULE_DATA_VERSION, validateRules } from './rules.js';
