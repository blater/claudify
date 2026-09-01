import { score, serializeMarkdown, serializePlain, tally, transform } from './domain/index.js';
import { renderRich } from './browser/render.js';
import { copyOutput } from './browser/clipboard.js';
import { fetchSource, sourceLoadFailure } from './browser/url.js';
import { createRequestGate, nextTabIndex } from './presentation/state.js';

const EXAMPLE = `A small engineering team uses a review tool to improve releases. The system is a simple way to show errors before customers see them, and it helps each task stay focused. The team has three goals: catch risky changes early, explain decisions clearly, and keep feedback connected to the code.

The process starts when an engineer opens a change. Reviewers read the proposal and discuss its context. The tool connects comments to exact lines and shows which checks passed. This keeps the conversation practical, but the team still decides what matters.

The team measures results over time. Faster reviews are useful, clear ownership is important, and fewer production problems help everyone. The process does not replace judgment; it gives people a shared place to work and learn.`;

const state = { document: null, activeTab: 'rich' };
const sourceRequests = createRequestGate();
const elements = {
  source: byId('source-text'),
  sourceUrl: byId('source-url'),
  transform: byId('transform-button'),
  example: byId('example-button'),
  clear: byId('clear-button'),
  loadUrl: byId('load-url-button'),
  sourceStatus: byId('source-status'),
  outputStatus: byId('output-status'),
  rich: byId('rich-output'),
  markdown: byId('markdown-output'),
  score: byId('slop-score'),
  tally: byId('sign-tally'),
  copy: byId('copy-button'),
  tabs: [...document.querySelectorAll('[role="tab"]')]
};

elements.source.addEventListener('input', () => {
  sourceRequests.invalidate();
  elements.loadUrl.disabled = false;
  invalidateOutput();
  setStatus(elements.sourceStatus, '', '');
  syncTransformAvailability();
});
elements.example.addEventListener('click', () => {
  sourceRequests.invalidate();
  elements.source.value = EXAMPLE;
  elements.loadUrl.disabled = false;
  invalidateOutput();
  setStatus(elements.sourceStatus, 'Bundled example loaded. No network request was made.', 'success');
  syncTransformAvailability();
  elements.source.focus();
});
elements.clear.addEventListener('click', clearAll);
elements.transform.addEventListener('click', runTransformation);
elements.loadUrl.addEventListener('click', loadSourceUrl);
elements.copy.addEventListener('click', copyActiveOutput);
elements.tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab.dataset.tab));
  tab.addEventListener('keydown', (event) => {
    const targetIndex = nextTabIndex(index, event.key, elements.tabs.length);
    if (targetIndex == null) return;
    event.preventDefault();
    const target = elements.tabs[targetIndex];
    selectTab(target.dataset.tab);
    target.focus();
  });
});
syncTransformAvailability();

function runTransformation() {
  try {
    state.document = transform(elements.source.value);
    renderRich(state.document, elements.rich);
    elements.markdown.value = serializeMarkdown(state.document);
    elements.score.textContent = `${score(state.document)}/100`;
    renderTally(state.document);
    elements.copy.disabled = false;
    setStatus(elements.outputStatus, 'Claudeification complete. The score measures comedic transformation intensity, not AI authorship.', 'success');
  } catch (error) {
    invalidateOutput(false);
    setStatus(elements.outputStatus, error instanceof Error ? error.message : 'Transformation failed.', 'error');
  }
}

async function loadSourceUrl() {
  sourceRequests.invalidate();
  elements.loadUrl.disabled = false;
  const raw = elements.sourceUrl.value.trim();
  let url;
  try {
    url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
  } catch {
    setStatus(elements.sourceStatus, 'Enter a valid public HTTP(S) URL, or paste the text below.', 'error');
    return;
  }

  const request = sourceRequests.begin();
  elements.loadUrl.disabled = true;
  setStatus(elements.sourceStatus, 'Attempting a browser-side fetch…', 'working');
  try {
    const result = await fetchSource(url, { signal: request.signal });
    if (!sourceRequests.isCurrent(request)) return;
    sourceRequests.finish(request);
    elements.source.value = result.text;
    invalidateOutput();
    syncTransformAvailability();
    setStatus(elements.sourceStatus, result.notice, 'success');
    elements.loadUrl.disabled = false;
  } catch (error) {
    if (!sourceRequests.isCurrent(request)) return;
    sourceRequests.finish(request);
    setStatus(elements.sourceStatus, sourceLoadFailure(error), 'error');
    elements.loadUrl.disabled = false;
  }
}

async function copyActiveOutput() {
  if (!state.document) return;
  try {
    const plain = serializePlain(state.document);
    const wrapper = document.createElement('div');
    renderRich(state.document, wrapper);
    const result = await copyOutput({
      mode: state.activeTab,
      markdown: serializeMarkdown(state.document),
      plain,
      html: wrapper.innerHTML
    });
    setStatus(elements.outputStatus, result.message, 'success');
  } catch {
    try {
      const value = state.activeTab === 'markdown' ? serializeMarkdown(state.document) : serializePlain(state.document);
      await navigator.clipboard.writeText(value);
      setStatus(elements.outputStatus, 'Plain text copied; rich formatting was removed.', 'success');
    } catch {
      setStatus(elements.outputStatus, 'Clipboard access was rejected. Select the output and copy it manually.', 'error');
    }
  }
}

function renderTally(documentModel) {
  const rows = tally(documentModel).filter((item) => item.count > 0);
  elements.tally.replaceChildren(...rows.map((item) => {
    const row = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = item.label;
    const value = document.createElement('strong');
    value.textContent = String(item.count);
    row.append(label, value);
    return row;
  }));
}

function selectTab(tabName) {
  state.activeTab = tabName;
  for (const tab of elements.tabs) {
    const selected = tab.dataset.tab === tabName;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  elements.rich.hidden = tabName !== 'rich';
  elements.markdown.hidden = tabName !== 'markdown';
}

function clearAll() {
  sourceRequests.invalidate();
  elements.source.value = '';
  elements.sourceUrl.value = '';
  elements.loadUrl.disabled = false;
  invalidateOutput();
  setStatus(elements.sourceStatus, '', '');
  setStatus(elements.outputStatus, '', '');
  syncTransformAvailability();
  elements.source.focus();
}

function invalidateOutput(clearStatus = true) {
  state.document = null;
  elements.rich.replaceChildren();
  elements.markdown.value = '';
  elements.tally.replaceChildren();
  elements.score.textContent = '—';
  elements.copy.disabled = true;
  if (clearStatus) setStatus(elements.outputStatus, '', '');
}

function syncTransformAvailability() {
  elements.transform.disabled = !elements.source.value.trim();
}

function setStatus(element, message, kind) {
  element.textContent = message;
  element.dataset.kind = kind;
}

function byId(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing UI element #${id}`);
  return element;
}
