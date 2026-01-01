import fs from 'node:fs/promises';
import path from 'node:path';

const reportPath = path.resolve('cucumber-report', 'cucumber.html');

const LINKIFY_MARKER = '<!-- trace-viewer-linkify -->';

const LINKIFY_SCRIPT = `${LINKIFY_MARKER}
<script id="trace-viewer-linkify">
(() => {
  const urlRe = /https:\/\/trace\.playwright\.dev\/\?trace=[^\s\"<>]+/g;

  function isInsideLink(node) {
    let cur = node && node.parentNode;
    while (cur) {
      if (cur.nodeType === Node.ELEMENT_NODE && cur.tagName === 'A') return true;
      cur = cur.parentNode;
    }
    return false;
  }

  function linkifyTextNode(textNode) {
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
    if (isInsideLink(textNode)) return;

    const text = textNode.nodeValue || '';
    if (!text.includes('trace.playwright.dev')) return;

    const matches = [...text.matchAll(urlRe)];
    if (!matches.length) return;

    const frag = document.createDocumentFragment();
    let lastIndex = 0;

    for (const match of matches) {
      const url = match[0];
      const index = match.index ?? -1;
      if (index < 0) continue;

      if (index > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, index)));
      }

      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Open Trace Viewer';
      a.title = url;
      frag.appendChild(a);

      lastIndex = index + url.length;
    }

    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode?.replaceChild(frag, textNode);
  }

  function linkifyWithin(root) {
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const toProcess = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) toProcess.push(n);

    for (const node of toProcess) linkifyTextNode(node);
  }

  function run() {
    linkifyWithin(document.body);

    // The report UI renders content async; keep watching briefly.
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) linkifyTextNode(node);
          else if (node.nodeType === Node.ELEMENT_NODE) linkifyWithin(node);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Stop after a bit to avoid running forever.
    setTimeout(() => observer.disconnect(), 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
</script>
`;

async function main() {
  let html;
  try {
    html = await fs.readFile(reportPath, 'utf-8');
  } catch (e) {
    // Report might not exist (e.g., cucumber not run yet)
    return;
  }

  if (html.includes(LINKIFY_MARKER)) return;

  const closeBodyIndex = html.lastIndexOf('</body>');
  if (closeBodyIndex === -1) return;

  const updated =
    html.slice(0, closeBodyIndex) +
    LINKIFY_SCRIPT +
    '\n' +
    html.slice(closeBodyIndex);

  await fs.writeFile(reportPath, updated, 'utf-8');
}

await main();
