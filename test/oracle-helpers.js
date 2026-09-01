export const REPORT_ONLY_FAMILIES = new Set([4, 17, 19, 22, 41, 42, 46, 54, 55, 58, 68]);
export const STYLE_ONLY_FAMILIES = new Set([60, 61]);

export function collectFamilies(report) {
  const found = new Set();
  if (!report || typeof report !== 'object' || Array.isArray(report)) return found;
  for (const [key, value] of Object.entries(report)) {
    const match = key.match(/^(\d{1,2})_[a-z0-9_]+$/i);
    if (match && isFlagged(value)) found.add(Number(match[1]));
  }
  return found;
}

export function isFlagged(value) {
  if (value == null || value === false || value === 0 || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value !== 'object') return true;
  const entries = Object.entries(value);
  if (entries.length === 0) return false;
  if (value.found === false || value.detected === false) return false;
  if (Object.hasOwn(value, 'count') && (!Number.isFinite(Number(value.count)) || Number(value.count) <= 0)) return false;
  const evidenceArrays = entries.filter(([key, item]) => /^(?:matches?|samples?|hits?|examples?)$/i.test(key) && Array.isArray(item));
  if (evidenceArrays.length > 0 && evidenceArrays.every(([, items]) => items.length === 0)) return false;
  return true;
}

export function scoreBearingFamilies(families) {
  return [...families].filter((id) => !REPORT_ONLY_FAMILIES.has(id) && !STYLE_ONLY_FAMILIES.has(id));
}
