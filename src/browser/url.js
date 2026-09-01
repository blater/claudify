/** Browser URL adapter. This module depends on fetch/DOMParser; the domain never imports it. */
export const DEFAULT_FETCH_TIMEOUT_MS = 12_000;
export const DEFAULT_MAX_SOURCE_BYTES = 1_000_000;

export async function fetchSource(url, options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const Parser = options.Parser ?? globalThis.DOMParser;
  const requestedTimeout = Number(options.timeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS);
  const timeoutMs = Math.min(Math.max(Number.isFinite(requestedTimeout) ? requestedTimeout : DEFAULT_FETCH_TIMEOUT_MS, 1), 60_000);
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_SOURCE_BYTES;
  const AbortControllerCtor = options.AbortControllerCtor ?? globalThis.AbortController;
  const controller = AbortControllerCtor ? new AbortControllerCtor() : null;
  const externalSignal = options.signal;
  const abortFromExternal = () => controller?.abort(externalSignal?.reason);
  externalSignal?.addEventListener?.('abort', abortFromExternal, { once: true });
  if (externalSignal?.aborted) abortFromExternal();
  const github = githubApiUrl(url);
  const target = github ?? url.href;
  let timer;
  try {
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        controller?.abort();
        reject(new Error(`The source request timed out after ${timeoutMs} ms.`));
      }, timeoutMs);
    });
    const response = await Promise.race([
      Promise.resolve().then(() => fetchImpl(target, {
        headers: { Accept: github ? 'application/vnd.github+json' : 'text/html, text/plain;q=0.9' },
        signal: controller?.signal ?? externalSignal
      })),
      timeout
    ]);
    if (!response.ok) throw new Error(`The source returned HTTP ${response.status}.`);
    const declaredLength = Number(response.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) throw new Error(`The source exceeds the ${maxBytes}-byte browser limit.`);
    const contentType = response.headers.get('content-type') ?? '';
    if (github) {
      const data = response.text ? JSON.parse(await readResponseText(response, maxBytes)) : await response.json();
      const extracted = [data.title, data.body].filter(Boolean).join('\n\n').trim();
      assertReadableSize(extracted, maxBytes, 'GitHub returned no readable title or body.');
      return { text: extracted, notice: 'Loaded through the documented api.github.com adapter.' };
    }
    if (!/text\/(?:html|plain)|application\/xhtml\+xml/i.test(contentType)) throw new Error('The URL did not return readable text or HTML.');
    const raw = await readResponseText(response, maxBytes);
    if (/text\/plain/i.test(contentType)) {
      const extracted = raw.trim();
      assertReadableSize(extracted, maxBytes, 'The URL returned only whitespace.');
      return { text: extracted, notice: 'Loaded plain text directly from the source URL.' };
    }
    if (!Parser) throw new Error('HTML extraction is unavailable in this environment.');
    const parsed = new Parser().parseFromString(raw, 'text/html');
    parsed.querySelectorAll('script, style, nav, header, footer, aside, form, noscript, svg').forEach((node) => node.remove());
    const candidates = [...parsed.querySelectorAll('article, main')];
    let extracted = candidates.map(extractNodeText).map(normalizeExtractedText).find(Boolean);
    if (!extracted) extracted = normalizeExtractedText(extractNodeText(parsed.body));
    assertReadableSize(extracted, maxBytes, 'No readable article or page text was found.');
    return { text: extracted, notice: 'Loaded best-effort text directly in your browser.' };
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener?.('abort', abortFromExternal);
  }
}

export function sourceLoadFailure(error) {
  const reason = error instanceof Error ? error.message : 'The URL could not be loaded.';
  return `${reason} Browser CORS, authentication, paywalls, or bot controls may block access. Your URL was retained; paste the source text instead.`;
}

export function githubApiUrl(url) {
  if (url.hostname !== 'github.com') return null;
  const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)(?:\/|$)/);
  if (!match) return null;
  const [, owner, repo, kind, number] = match;
  return `https://api.github.com/repos/${owner}/${repo}/${kind === 'pull' ? 'pulls' : 'issues'}/${number}`;
}

async function readResponseText(response, maxBytes) {
  if (!response.body?.getReader) {
    const value = await response.text();
    if (byteLength(value) > maxBytes) throw new Error(`The source exceeds the ${maxBytes}-byte browser limit.`);
    return value;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let value = '';
  while (true) {
    const { done, value: chunk } = await reader.read();
    if (done) break;
    bytes += chunk.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new Error(`The source exceeds the ${maxBytes}-byte browser limit.`);
    }
    value += decoder.decode(chunk, { stream: true });
  }
  return value + decoder.decode();
}

function extractNodeText(node) {
  if (!node) return '';
  if (!node.childNodes || node.childNodes.length === 0) return node.textContent ?? node.nodeValue ?? '';
  const blocks = new Set(['ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'BR', 'DIV', 'DL', 'DT', 'DD', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI', 'MAIN', 'NAV', 'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'TR', 'UL']);
  let output = '';
  for (const child of node.childNodes) {
    const isBlock = blocks.has(child.tagName);
    if (isBlock && output && !output.endsWith('\n')) output += '\n';
    output += extractNodeText(child);
    if (isBlock && !output.endsWith('\n')) output += '\n';
  }
  return output;
}

function normalizeExtractedText(value) {
  return (value ?? '').replace(/[\t ]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function assertReadableSize(value, maxBytes, emptyMessage) {
  if (!value?.trim()) throw new Error(emptyMessage);
  if (byteLength(value) > maxBytes) throw new Error(`The source exceeds the ${maxBytes}-byte browser limit.`);
}

function byteLength(value) {
  return new TextEncoder().encode(value).byteLength;
}
