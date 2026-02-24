import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  ul.querySelectorAll('li').forEach((li) => {
    const link = li.querySelector('.cards-card-image a[href]');
    if (link) {
      li.classList.add('clickable');
      const href = link.getAttribute('href');
      const title = link.getAttribute('title')?.trim() || '';
      link.replaceWith(...link.childNodes);
      const wrapper = document.createElement('a');
      wrapper.href = href;
      if (title) wrapper.title = title;
      wrapper.className = 'cards-card-link';
      while (li.firstChild) wrapper.append(li.firstChild);
      li.append(wrapper);
    }
  });

  block.replaceChildren(ul);
}
