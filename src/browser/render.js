/** Browser adapter: render an already-transformed domain document using safe DOM creation. */
import { toRichTree } from '../domain/index.js';

export function renderRich(documentModel, container, ownerDocument = document) {
  const fragment = ownerDocument.createDocumentFragment();
  for (const node of toRichTree(documentModel)) fragment.append(buildNode(node, ownerDocument));
  container.replaceChildren(fragment);
  return container;
}

function buildNode(node, ownerDocument) {
  const element = ownerDocument.createElement(node.tag);
  for (const child of node.children) {
    if (child.tag) {
      element.append(child.children ? buildNode(child, ownerDocument) : buildInline(child, ownerDocument));
    } else {
      element.append(ownerDocument.createTextNode(child.text));
    }
  }
  return element;
}

function buildInline(node, ownerDocument) {
  const element = ownerDocument.createElement(node.tag);
  element.textContent = node.text;
  return element;
}
