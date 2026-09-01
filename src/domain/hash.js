/** Stable, dependency-free FNV-1a hash. The unsigned result is identical in browsers and Node. */
export function stableHash(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function stableChoice(variants, ...seedParts) {
  if (!Array.isArray(variants) || variants.length === 0) {
    throw new TypeError('stableChoice requires at least one variant');
  }
  return variants[stableHash(seedParts.join('\u241f')) % variants.length];
}
