import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  createTag,
  fetchQueryIndexAll,
  getAuthoredLinks,
  normalizePath,
  resolveArticlesFromIndex,
} from '../../scripts/shared.js';

function buildLinksCard(article) {
  const href = normalizePath(article.path);
  const link = createTag('a', { href, class: 'cards-card-link' });

  const body = createTag('div', { class: 'cards-card-body' });
  body.append(createTag('p', {}, createTag('strong', {}, article.title || href)));
  if (article.description) {
    body.append(createTag('p', {}, article.description));
  }
  link.append(body);

  return createTag('li', {}, link);
}

/**
 * Decorate "cards links" variant: fetch index, match paths, render cards.
 */
async function decorateLinks(block) {
  const authoredLinks = getAuthoredLinks(block);
  if (!authoredLinks.length) {
    block.textContent = '';
    block.append(createTag('p', { class: 'cards-links-empty' }, 'No links provided.'));
    return;
  }

  let indexRows = [];
  try {
    indexRows = await fetchQueryIndexAll();
  } catch {
    indexRows = [];
  }

  const articles = resolveArticlesFromIndex(authoredLinks, indexRows);

  const ul = createTag('ul');
  articles.forEach((article) => ul.append(buildLinksCard(article)));
  block.replaceChildren(ul);
}

/**
 * Decorate regular cards (authored rows with image + body).
 */
function decorateDefault(block) {
  const ul = createTag('ul');

  [...block.children].forEach((row) => {
    const li = createTag('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    const content = li.firstElementChild;
    if (content?.children?.length > 1) {
      const imageEl = [...content.children].find((el) => el.querySelector('picture'));
      if (imageEl) {
        const picture = imageEl.querySelector('picture');
        const imageDiv = createTag('div', { class: 'cards-card-image' });
        if (picture) imageDiv.append(picture);
        const bodyDiv = createTag('div', { class: 'cards-card-body' });
        [...content.children].forEach((el) => { if (el !== imageEl) bodyDiv.append(el); });
        li.replaceChildren(imageDiv, bodyDiv);
      } else {
        content.className = 'cards-card-body';
      }
    } else {
      [...li.children].forEach((div) => {
        div.className = (div.children.length === 1 && div.querySelector('picture'))
          ? 'cards-card-image' : 'cards-card-body';
      });
    }

    const linkEl = li.querySelector('.cards-card-image a[href]') || li.querySelector('.cards-card-body a[href]');
    if (linkEl) {
      const wrapper = createTag('a', {
        href: linkEl.getAttribute('href'),
        title: linkEl.getAttribute('title')?.trim() || undefined,
        class: 'cards-card-link',
      });
      while (li.firstChild) wrapper.append(li.firstChild);
      li.append(wrapper);
      linkEl.replaceWith(...linkEl.childNodes);
      li.querySelectorAll('.cards-card-body a[href]').forEach((a) => a.replaceWith(...a.childNodes));
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const picture = img.closest('picture');
    if (picture) {
      picture.replaceWith(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]));
    }
  });

  block.replaceChildren(ul);
}

export default async function decorate(block) {
  if (block.classList.contains('links')) {
    await decorateLinks(block);
  } else {
    decorateDefault(block);
  }
}
