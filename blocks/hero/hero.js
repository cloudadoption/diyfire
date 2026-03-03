/**
 * Decorates the hero block.
 * - Sets hero image to eager loading (LCP)
 * - Supports dual images: first picture = light mode, second = dark mode
 * - Identifies the eyebrow/tagline paragraph (first <p> before the <h1>)
 *   and marks it with a class for styling.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const pictures = block.querySelectorAll('picture');

  if (pictures.length >= 2) {
    // Dual-image hero: first = light, second = dark
    const lightDiv = pictures[0].closest('.hero > div');
    const darkDiv = pictures[1].closest('.hero > div');
    if (lightDiv) lightDiv.classList.add('hero-img-light');
    if (darkDiv) darkDiv.classList.add('hero-img-dark');
    // Eager-load both for LCP (only the visible one renders)
    pictures.forEach((pic) => {
      const img = pic.querySelector('img');
      if (img) img.loading = 'eager';
    });
  } else if (pictures.length === 1) {
    const img = pictures[0].querySelector('img');
    if (img) img.loading = 'eager';
  } else {
    block.classList.add('no-image');
  }

  const h1 = block.querySelector('h1');
  if (!h1) return;

  // Find the first <p> that appears before the <h1> in the DOM and mark it as a tagline
  const contentDiv = h1.closest('div');
  if (!contentDiv) return;

  const children = [...contentDiv.children];
  const h1Index = children.indexOf(h1);

  for (let i = 0; i < h1Index; i += 1) {
    if (children[i].tagName === 'P' && !children[i].classList.contains('button-container')) {
      children[i].classList.add('hero-tagline');
      break;
    }
  }
}
