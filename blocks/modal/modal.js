/*
 * Modal Block – opens fragment links in a dialog instead of navigating.
 */

import { loadFragment } from '../fragment/fragment.js';
import { loadCSS } from '../../scripts/aem.js';
import { createTag } from '../../scripts/shared.js';
import dynamicBlocks from '../dynamic/index.js';

const FRAGMENT_PREFIX = '/fragments/';

function getFragmentPath(href = '') {
  try {
    const url = new URL(href, window.location.origin);
    if (!url.pathname.startsWith(FRAGMENT_PREFIX)) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

export function setupFragmentModal() {
  if (window.__fragmentModalReady) return;
  window.__fragmentModalReady = true;

  loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);

  const closeBtn = createTag('button', { type: 'button', class: 'modal-close', 'aria-label': 'Close dialog' }, '×');
  const content = createTag('div', { class: 'modal-content' });
  const dialog = createTag('div', {
    class: 'modal-dialog',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Dialog',
  }, [closeBtn, content]);
  const backdrop = createTag('div', { class: 'modal-backdrop', 'aria-hidden': 'true' });
  const root = createTag('div', { class: 'modal', hidden: 'true' }, [backdrop, dialog]);
  document.body.append(root);
  let previousOverflow = '';
  let previousFocus = null;

  const close = () => {
    root.hidden = true;
    content.replaceChildren();
    document.body.style.overflow = previousOverflow;
    if (previousFocus?.focus) previousFocus.focus();
  };

  const open = async (path) => {
    previousFocus = document.activeElement;
    root.hidden = false;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    content.textContent = 'Loading...';
    closeBtn.focus();

    try {
      const fragment = await loadFragment(path);
      if (fragment) {
        const main = createTag('main', { class: 'modal-main' });
        main.append(...fragment.childNodes);
        content.replaceChildren(main);
        await dynamicBlocks(main);
      } else {
        content.textContent = 'Unable to load this content right now.';
      }
      dialog.scrollTop = 0;
    } catch {
      content.textContent = 'Unable to load this content right now.';
    }
  };

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !root.hidden) close();
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('main a[href*="/fragments/"]');
    if (!link) return;
    if (link.closest('header, footer, nav, .modal')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === '_blank') return;
    const path = getFragmentPath(link.href);
    if (!path) return;
    e.preventDefault();
    open(path);
  });
}

export default function decorate(block) {
  setupFragmentModal();
  block.style.display = 'none';
}
