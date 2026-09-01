/** Presentation-only coordination helpers. No domain code imports this module. */
export function createRequestGate(AbortControllerCtor = globalThis.AbortController) {
  let generation = 0;
  let controller = null;
  return Object.freeze({
    begin() {
      controller?.abort();
      controller = AbortControllerCtor ? new AbortControllerCtor() : null;
      generation += 1;
      return Object.freeze({ generation, signal: controller?.signal });
    },
    invalidate() {
      generation += 1;
      controller?.abort();
      controller = null;
    },
    isCurrent(request) {
      return request?.generation === generation && !request.signal?.aborted;
    },
    finish(request) {
      if (!this.isCurrent(request)) return false;
      controller = null;
      return true;
    }
  });
}

export function nextTabIndex(currentIndex, key, length) {
  if (!Number.isInteger(currentIndex) || length < 1) return null;
  if (key === 'ArrowRight') return (currentIndex + 1) % length;
  if (key === 'ArrowLeft') return (currentIndex - 1 + length) % length;
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  return null;
}
