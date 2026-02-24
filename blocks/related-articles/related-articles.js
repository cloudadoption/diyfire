import { readBlockConfig } from '../../scripts/aem.js';
import {
  createTag,
  fetchQueryIndexAll,
  formatDate,
  getArticleKeywords,
  getAuthoredLinks,
  getContentTimestamp,
  normalizePath,
  parseKeywords,
  resolveArticlesFromIndex,
  shuffle,
} from '../../scripts/shared.js';

const RESULT_LIMIT = 5;

function rowMatchesKeyword(row, keyword) {
  const articleKeywords = parseKeywords(getArticleKeywords(row));
  return articleKeywords.some((ak) => ak === keyword || ak.includes(keyword));
}

function matchArticles(rows, keywordsConfig, excludedConfig, limit) {
  const requested = parseKeywords(keywordsConfig);
  const excluded = parseKeywords(excludedConfig);
  const isRandom = requested.includes('random');
  const hasMultipleKeywords = requested.filter((k) => k !== 'random').length > 1;
  const shouldShuffle = isRandom || hasMultipleKeywords;

  const filtered = isRandom || !requested.length
    ? rows
    : rows.filter((row) => requested.some((keyword) => rowMatchesKeyword(row, keyword)));

  const withoutExcluded = excluded.length
    ? filtered.filter((row) => !excluded.some((keyword) => rowMatchesKeyword(row, keyword)))
    : filtered;

  const deduped = withoutExcluded.filter((row, idx, arr) => {
    const firstIdx = arr.findIndex((x) => x.path === row.path);
    return firstIdx === idx;
  });
  if (shouldShuffle) return shuffle(deduped).slice(0, limit);

  return deduped
    .sort((a, b) => getContentTimestamp(b) - getContentTimestamp(a))
    .slice(0, limit);
}

function buildCard(article) {
  const href = normalizePath(article.path);
  const link = createTag('a', { href, class: 'related-articles-card-link' });
  link.append(createTag('div', { class: 'related-articles-card-strip' }));

  const content = createTag('div', { class: 'related-articles-card-content' });
  content.append(createTag('h3', {}, article.title || href));
  if (article.description) {
    content.append(createTag('p', { class: 'related-articles-card-description' }, article.description));
  }
  const date = article.date || article.publisheddate || article.lastModified;
  if (date) {
    content.append(createTag('p', { class: 'related-articles-card-date' }, formatDate(date)));
  }

  link.append(content);
  return createTag('li', { class: 'related-articles-card' }, link);
}

function getScrollStep(list) {
  const firstCard = list.querySelector('.related-articles-card');
  if (!firstCard) return 0;
  const styles = window.getComputedStyle(list);
  const gap = parseFloat(styles.columnGap || styles.gap || '0');
  return firstCard.getBoundingClientRect().width + gap;
}

function updateSliderButtons(list, prevBtn, nextBtn) {
  const max = Math.max(0, list.scrollWidth - list.clientWidth - 1);
  const atStart = list.scrollLeft <= 0;
  const atEnd = list.scrollLeft >= max;

  prevBtn.disabled = atStart;
  prevBtn.classList.toggle('is-hidden', atStart);
  nextBtn.disabled = atEnd;
}

function buildSliderControls(list) {
  const controls = createTag('div', { class: 'related-articles-controls', 'aria-label': 'Related articles slider controls' });
  const prevBtn = createTag('button', {
    type: 'button',
    class: 'related-articles-arrow related-articles-arrow-prev',
    'aria-label': 'Scroll related articles left',
  }, '←');
  const nextBtn = createTag('button', {
    type: 'button',
    class: 'related-articles-arrow related-articles-arrow-next',
    'aria-label': 'Scroll related articles right',
  }, '→');

  prevBtn.addEventListener('click', () => {
    list.scrollBy({ left: -getScrollStep(list), behavior: 'smooth' });
    window.setTimeout(() => updateSliderButtons(list, prevBtn, nextBtn), 180);
  });
  nextBtn.addEventListener('click', () => {
    list.scrollBy({ left: getScrollStep(list), behavior: 'smooth' });
    window.setTimeout(() => updateSliderButtons(list, prevBtn, nextBtn), 180);
  });

  list.addEventListener('scroll', () => updateSliderButtons(list, prevBtn, nextBtn), { passive: true });
  window.addEventListener('resize', () => updateSliderButtons(list, prevBtn, nextBtn), { passive: true });
  updateSliderButtons(list, prevBtn, nextBtn);

  controls.append(prevBtn, nextBtn);
  return controls;
}

function renderRelatedList(block, articles, emptyMessage) {
  block.textContent = '';

  const slider = createTag('div', { class: 'related-articles-slider' });
  const list = createTag('ul', {
    class: 'related-articles-list',
    role: 'list',
  });
  slider.append(list);
  block.append(slider);

  if (!articles.length) {
    block.append(createTag('p', { class: 'related-articles-empty' }, emptyMessage));
    return;
  }
  articles.forEach((article) => list.append(buildCard(article)));
  if (articles.length > 1) slider.append(buildSliderControls(list));
}

export default async function init(block) {
  const config = readBlockConfig(block);

  const authoredLinks = getAuthoredLinks(block);
  if (authoredLinks.length > 0) {
    let indexRows = [];
    try {
      indexRows = await fetchQueryIndexAll();
    } catch {
      indexRows = [];
    }
    const articles = resolveArticlesFromIndex(authoredLinks, indexRows);
    renderRelatedList(block, articles, 'No related articles.');
    return;
  }

  const keywords = String(config.keywords || 'random').trim();
  const excluded = String(config['excluded-keywords'] || '').trim();

  const slider = createTag('div', { class: 'related-articles-slider' });
  const list = createTag('ul', {
    class: 'related-articles-list',
    role: 'list',
  });
  block.textContent = '';
  slider.append(list);
  block.append(slider);

  try {
    const allArticles = await fetchQueryIndexAll();
    const matches = matchArticles(allArticles, keywords, excluded, RESULT_LIMIT);
    if (!matches.length) {
      block.append(createTag('p', { class: 'related-articles-empty' }, 'No related articles found.'));
      return;
    }
    matches.forEach((article) => list.append(buildCard(article)));
    if (matches.length > 1) slider.append(buildSliderControls(list));
  } catch {
    block.append(createTag('p', { class: 'related-articles-empty' }, 'Unable to load related articles right now.'));
  }
}
