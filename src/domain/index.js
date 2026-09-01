/**
 * Pure Claudify domain API.
 * This module and everything it imports are intentionally free of DOM, fetch,
 * clipboard, storage, and UI-state dependencies.
 */
export { transform } from './engine.js';
export { serializeMarkdown, serializePlain, score, tally, toRichTree, validateDocument } from './document.js';
export { RULE_DATA_VERSION, validateRules } from './rules.js';
