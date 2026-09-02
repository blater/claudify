import { score, serializeMarkdown, serializePlain, sourceScore, tally, transform } from './domain/index.js?v=source-score-20260902';
import { renderRich } from './browser/render.js';
import { copyOutput } from './browser/clipboard.js';
import { fetchSource, sourceLoadFailure } from './browser/url.js';
import { createRequestGate, nextTabIndex } from './presentation/state.js';
import { EXAMPLES } from './examples.js';

const state = { document: null, activeTab: 'rich', activeSourceTab: 'text' };
const sourceRequests = createRequestGate();
const SOURCE_SCORE_DELAY = 300;
let sourceScoreTimer = null;
const allTabs = [...document.querySelectorAll('[role="tab"]')];
const elements = {
  source: byId('source-text'),
  sourceUrl: byId('source-url'),
  sourceScore: byId('source-score'),
  sourceTextPanel: byId('source-text-panel'),
  sourceUrlPanel: byId('source-url-panel'),
  transform: byId('transform-button'),
  example: byId('example-button'),
  exampleMenu: byId('example-menu'),
  exampleOptions: [byId('example-option-showcase'), byId('example-option-hamlet'), byId('example-option-orwell')],
  clear: byId('clear-button'),
  loadUrl: byId('load-url-button'),
  sourceStatus: byId('source-status'),
  outputStatus: byId('output-status'),
  rich: byId('rich-output'),
  markdown: byId('markdown-output'),
  score: byId('slop-score'),
  tally: byId('sign-tally'),
  copy: byId('copy-button'),
  tabs: allTabs.filter((tab) => tab.dataset.tab),
  sourceTabs: allTabs.filter((tab) => tab.dataset.sourceTab)
};

elements.source.addEventListener('input', () => {
  sourceRequests.invalidate();
  elements.loadUrl.disabled = false;
  invalidateOutput();
  setStatus(elements.sourceStatus, '', '');
  scheduleSourceScore();
  syncTransformAvailability();
});
elements.example.addEventListener('click', () => {
  const open = elements.exampleMenu.hidden;
  elements.exampleMenu.hidden = !open;
  elements.example.setAttribute('aria-expanded', String(open));
});
elements.exampleOptions.forEach((option) => option.addEventListener('click', () => loadExample(option.dataset.exampleId)));
elements.exampleMenu.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeExampleMenu();
  elements.example.focus();
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
elements.sourceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectSourceTab(tab.dataset.sourceTab));
  tab.addEventListener('keydown', (event) => {
    const targetIndex = nextTabIndex(index, event.key, elements.sourceTabs.length);
    if (targetIndex == null) return;
    event.preventDefault();
    const target = elements.sourceTabs[targetIndex];
    selectSourceTab(target.dataset.sourceTab);
    target.focus();
  });
});
selectSourceTab(state.activeSourceTab);
syncTransformAvailability();

function runTransformation() {
  try {
    state.document = transform(elements.source.value);
    renderRich(state.document, elements.rich);
    elements.markdown.value = serializeMarkdown(state.document);
    elements.score.textContent = String(score(state.document));
    renderTally(state.document);
    elements.copy.disabled = false;
    setStatus(elements.outputStatus, 'Complete & Linked-In Ready', 'success');
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
    selectSourceTab('text');
    scheduleSourceScore();
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

function selectSourceTab(tabName) {
  state.activeSourceTab = tabName;
  for (const tab of elements.sourceTabs) {
    const selected = tab.dataset.sourceTab === tabName;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  elements.sourceTextPanel.hidden = tabName !== 'text';
  elements.sourceUrlPanel.hidden = tabName !== 'url';
}

function clearAll() {
  sourceRequests.invalidate();
  closeExampleMenu();
  elements.source.value = '';
  elements.sourceUrl.value = '';
  elements.loadUrl.disabled = false;
  invalidateOutput();
  selectSourceTab('text');
  setStatus(elements.sourceStatus, '', '');
  scheduleSourceScore();
  setStatus(elements.outputStatus, '', '');
  syncTransformAvailability();
  elements.source.focus();
}

function loadExample(exampleId) {
  sourceRequests.invalidate();
  const selected = EXAMPLES.find((example) => example.id === exampleId) ?? EXAMPLES[0];
  elements.source.value = selected.text;
  elements.loadUrl.disabled = false;
  invalidateOutput();
  elements.exampleOptions.forEach((option) => option.setAttribute('aria-checked', String(option.dataset.exampleId === selected.id)));
  closeExampleMenu();
  selectSourceTab('text');
  setStatus(elements.sourceStatus, `${selected.label} loaded.`, 'success');
  scheduleSourceScore();
  syncTransformAvailability();
  elements.source.focus();
}

function closeExampleMenu() {
  elements.exampleMenu.hidden = true;
  elements.example.setAttribute('aria-expanded', 'false');
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

function scheduleSourceScore() {
  if (sourceScoreTimer !== null) {
    clearTimeout(sourceScoreTimer);
    sourceScoreTimer = null;
  }
  elements.sourceScore.textContent = '';
  if (!elements.source.value.trim()) {
    return;
  }
  sourceScoreTimer = setTimeout(() => {
    sourceScoreTimer = null;
    try {
      elements.sourceScore.textContent = `Slop score ${sourceScore(elements.source.value)}`;
    } catch {
      elements.sourceScore.textContent = '';
    }
  }, SOURCE_SCORE_DELAY);
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
