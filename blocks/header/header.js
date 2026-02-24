import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
const THEME_STORAGE_KEY = 'diyfire-theme';
const THEME_CHANGE_EVENT = 'diyfire:themechange';

function getThemePreference() {
  const preferredTheme = document.documentElement.dataset.theme;
  if (preferredTheme === 'light' || preferredTheme === 'dark') return preferredTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return;
  document.documentElement.dataset.theme = theme;
  document.body.classList.remove('light-scheme', 'dark-scheme');
  document.body.classList.add(`${theme}-scheme`);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    // do nothing
  }
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
}

function bindToolAction(control, action, preventNavigation = false) {
  if (!control) return;
  control.addEventListener('click', (event) => {
    if (preventNavigation) event.preventDefault();
    action(event);
  });
  control.addEventListener('keydown', (event) => {
    if (event.code === 'Enter' || event.code === 'Space') {
      if (preventNavigation) event.preventDefault();
      action(event);
    }
  });
}

function getToolControl(iconElement) {
  const control = iconElement.closest('button, a, p, div, li');
  if (!control) return null;
  if (!['BUTTON', 'A'].includes(control.tagName)) {
    control.setAttribute('role', 'button');
    control.setAttribute('tabindex', '0');
  }
  return control;
}

function initThemeToggle(navTools) {
  const icon = navTools.querySelector('.icon-toggle');
  if (!icon) return;
  const toggle = getToolControl(icon);
  if (!toggle) return;

  toggle.classList.add('nav-tool-control', 'nav-theme-toggle');
  const syncToggleState = () => {
    const currentTheme = getThemePreference();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    toggle.setAttribute('title', `Switch to ${nextTheme} mode`);
    toggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
  };

  bindToolAction(toggle, () => {
    const nextTheme = getThemePreference() === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }, toggle.tagName === 'A');

  window.addEventListener(THEME_CHANGE_EVENT, syncToggleState);
  syncToggleState();
}

function initSearchControl(navTools) {
  const icon = navTools.querySelector('.icon-search');
  if (!icon) return;
  const control = getToolControl(icon);
  if (!control) return;

  const searchHref = control.tagName === 'A' ? control.getAttribute('href') : '/search';
  const searchPath = searchHref || '/search';
  const searchQuery = new URLSearchParams(window.location.search).get('q') || '';

  const form = document.createElement('form');
  form.className = 'nav-search-form';
  form.setAttribute('role', 'search');
  form.setAttribute('action', searchPath);
  form.setAttribute('method', 'get');
  form.setAttribute('aria-label', 'Site search');

  const input = document.createElement('input');
  input.className = 'nav-search-input';
  input.setAttribute('type', 'search');
  input.setAttribute('name', 'q');
  input.setAttribute('placeholder', 'Search');
  input.setAttribute('aria-label', 'Search');
  input.setAttribute('autocomplete', 'off');
  if (searchQuery) input.value = searchQuery;

  const submit = document.createElement('button');
  submit.className = 'nav-tool-control nav-search-submit';
  submit.setAttribute('type', 'submit');
  submit.setAttribute('aria-label', 'Search');
  submit.setAttribute('title', 'Search');
  submit.append(icon.cloneNode(true));

  form.addEventListener('submit', (event) => {
    if (!input.value.trim()) {
      event.preventDefault();
      window.location.href = searchPath;
    }
  });

  form.append(input, submit);

  const buttonContainer = control.closest('.button-container');
  if (buttonContainer && buttonContainer.children.length === 1) {
    buttonContainer.replaceWith(form);
  } else {
    control.replaceWith(form);
  }
}

function findLanguageMenu(navTools, globeControl) {
  let startNode = globeControl;
  while (startNode && startNode !== navTools) {
    let current = startNode;
    while (current?.nextElementSibling) {
      current = current.nextElementSibling;
      if (current.tagName === 'UL') return current;
    }
    startNode = startNode.parentElement;
  }
  return null;
}

function closeLanguagePicker(nav) {
  const languageToggle = nav?.querySelector('.nav-language-toggle');
  const languageMenu = nav?.querySelector('.nav-language-menu');
  if (languageMenu) languageMenu.hidden = true;
  if (languageToggle) languageToggle.setAttribute('aria-expanded', 'false');
}

function closeDesktopNavSections(nav) {
  const navSections = nav?.querySelector('.nav-sections');
  if (!navSections) return;
  navSections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

function initLanguagePicker(navTools) {
  const globeIcon = navTools.querySelector('.icon-globe');
  if (!globeIcon) return;
  const globeControl = getToolControl(globeIcon);
  if (!globeControl) return;

  const languageMenu = findLanguageMenu(navTools, globeControl);
  if (!languageMenu) return;

  navTools.classList.add('has-language-picker');
  globeControl.classList.add('nav-tool-control', 'nav-language-toggle');
  globeControl.setAttribute('aria-haspopup', 'true');
  globeControl.setAttribute('aria-expanded', 'false');
  globeControl.setAttribute('aria-label', 'Select language');
  globeControl.setAttribute('title', 'Select language');

  languageMenu.classList.add('nav-language-menu');
  languageMenu.hidden = true;

  const closeLanguageMenu = () => {
    languageMenu.hidden = true;
    globeControl.setAttribute('aria-expanded', 'false');
  };

  const toggleLanguageMenu = (event) => {
    if (globeControl.tagName === 'A') event.preventDefault();
    const isExpanded = globeControl.getAttribute('aria-expanded') === 'true';
    const nav = navTools.closest('nav');
    if (!isExpanded) closeDesktopNavSections(nav);
    languageMenu.hidden = isExpanded;
    globeControl.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
  };

  bindToolAction(globeControl, toggleLanguageMenu, globeControl.tagName === 'A');
  document.addEventListener('click', (event) => {
    if (!navTools.contains(event.target)) closeLanguageMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') closeLanguageMenu();
  });
  languageMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeLanguageMenu());
  });
}

function isPromoMenuItem(item) {
  return !!item.querySelector('picture, img');
}

function decorateMegaMenuSection(navSection) {
  const sectionLink = navSection.querySelector(':scope > p > a');
  const submenu = navSection.querySelector(':scope > ul');
  if (!sectionLink || !submenu) return;

  const isExplicitMega = sectionLink.hash === '#mega';
  if (isExplicitMega) {
    const cleanHref = sectionLink.href.replace(/#mega$/i, '');
    sectionLink.href = cleanHref;
  }

  const submenuItems = [...submenu.children].filter((item) => item.tagName === 'LI');
  const promoItem = submenuItems.find((item) => isPromoMenuItem(item));
  if (!isExplicitMega && !promoItem) return;

  navSection.classList.add('nav-drop-mega');
  submenu.classList.add('nav-mega-menu');
  const trigger = navSection.querySelector(':scope > p');
  const linkItems = submenuItems.filter((item) => item !== promoItem);
  const headingItems = linkItems.filter((item) => !item.querySelector('a'));

  let groupIndex = 0;
  linkItems.forEach((item) => {
    const itemLink = item.querySelector('a');
    if (!itemLink) {
      groupIndex += 1;
      item.classList.add('nav-mega-group-heading');
      item.style.setProperty('--mega-group', String(groupIndex));
      return;
    }

    if (groupIndex === 0) groupIndex = 1;
    item.classList.add('nav-mega-group-item');
    item.style.setProperty('--mega-group', String(groupIndex));
  });

  const hasGroups = headingItems.length > 0;
  const groupCount = hasGroups ? groupIndex : 1;
  if (hasGroups) submenu.classList.add('nav-mega-has-groups');

  const groupRowMap = {};
  linkItems.forEach((item) => {
    const itemGroup = Number(item.style.getPropertyValue('--mega-group')) || 1;
    groupRowMap[itemGroup] = (groupRowMap[itemGroup] || 0) + 1;
    item.style.setProperty('--mega-row', String(groupRowMap[itemGroup]));
  });

  if (promoItem) {
    promoItem.classList.add('nav-mega-promo');
    promoItem.style.setProperty('--mega-group', String(groupCount + 1));
    submenu.append(promoItem);
    submenu.style.setProperty('--mega-columns', String(groupCount + 1));
  } else {
    submenu.style.setProperty('--mega-columns', String(groupCount));
  }

  const syncMegaPanelPosition = () => {
    if (!document.body.contains(navSection)) return;
    if (!trigger) return;
    submenu.style.setProperty('--mega-offset-x', '0px');
    const panelRect = submenu.getBoundingClientRect();
    const targetLeft = (window.innerWidth - panelRect.width) / 2;
    const correctedOffset = targetLeft - panelRect.left;
    submenu.style.setProperty('--mega-offset-x', `${Math.round(correctedOffset)}px`);

    const triggerRect = trigger.getBoundingClientRect();
    const pointerX = triggerRect.left + (triggerRect.width / 2) - targetLeft;
    submenu.style.setProperty('--mega-pointer-x', `${Math.round(pointerX)}px`);
  };

  navSection.megaSyncPosition = syncMegaPanelPosition;
  window.addEventListener('resize', syncMegaPanelPosition);
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
       
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
       
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
       
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
       
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.classList.contains('nav-drop');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
     
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Merge any extra nav wrappers (introduced by additional separators) into tools.
  const navTools = nav.querySelector('.nav-tools');
  if (navTools && nav.children.length > 3) {
    [...nav.children].slice(3).forEach((extraSection) => {
      while (extraSection.firstElementChild) {
        navTools.append(extraSection.firstElementChild);
      }
      extraSection.remove();
    });
  }

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) {
        navSection.classList.add('nav-drop');
        decorateMegaMenuSection(navSection);
        const topLevelLink = navSection.querySelector(':scope > p > a');
        if (topLevelLink) {
          topLevelLink.addEventListener('click', (event) => {
            if (!isDesktop.matches) return;
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            if (!expanded) {
              if (navSection.megaSyncPosition) navSection.megaSyncPosition();
              event.preventDefault();
              toggleAllNavSections(navSections);
              navSection.setAttribute('aria-expanded', 'true');
            }
          });
        }
      }
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          closeLanguagePicker(navSection.closest('nav'));
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  nav.querySelectorAll('.nav-drop-mega').forEach((section) => {
    if (section.megaSyncPosition) section.megaSyncPosition();
  });

  const navToolsSection = nav.querySelector('.nav-tools');
  if (navToolsSection) {
    initThemeToggle(navToolsSection);
    initSearchControl(navToolsSection);
    initLanguagePicker(navToolsSection);
  }
}
