const ORG = 'cloudadoption';
const BASE_SITE = 'diyfire';
const DEFAULT_SOURCE_REF = 'main';
const HOSTED_AEMCODER_URL = 'https://aemcoder.adobe.io/';
const DEFAULT_LOCAL_CATALYST_URL = 'http://localhost:5173';
const LOCAL_DEV_HOSTS = new Set(['127.0.0.1', 'localhost']);
const CATALYST_URL_STORAGE_KEY = 'somarc.remixit.catalyst-url';
const CATALYST_WINDOW_NAME_PREFIX = 'catalyst-remix-launch:';
const SITE_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const COMMON_GUARDRAILS = [
  'Inspect the current pages and block palette first, then redesign from what already exists.',
  'Reuse the existing blocks, templates, nav, footer, fragments, forms, and DA sheet structures.',
  'Push theme, layout, hierarchy, and pacing hard without breaking the authoring model.',
  'Keep links, nav, metadata, and supporting surfaces coherent across the target scope.',
  'Refresh imagery, iconography, and supporting DA/query-index-backed content when needed.',
  'Treat inherited base-site residue as a bug: rewrite or remove old-theme routes, labels, keywords, filters, and metadata on every in-scope surface.',
  'Escalate only if the concept truly needs new blocks or deeper code divergence.',
];

const BASE_SITE_RESIDUE_TERMS = [
  'fire',
  'tfsa',
  'rrsp',
  'fhsa',
  'resp',
  'budgeting',
  'investing',
  'retirement',
  'compound interest',
  'financial independence',
  'savings rate',
  'net worth',
];

const RECIPES = [
  {
    id: 'pharma',
    name: 'Pharma',
    badge: 'Seed recipe',
    summary: 'Professional, science-forward, regulated storytelling for pharma stakeholders.',
    conceptFrame: 'a premium science brand with regulatory confidence, clear evidence-led storytelling, and modern clinical editorial polish',
    audience: 'medical affairs, brand, and digital operations leaders',
    tone: 'science-forward, credible, precise, and compliant',
    ctaGoals: 'product education, HCP engagement, and medical content operations',
    scope: ['/', '/learn', '/contact'],
    proofPoints: [
      'regulated-content governance',
      'medical review workflows',
      'launch readiness and campaign velocity',
    ],
    visualThemes: [
      'clinical labs and research teams',
      'clean scientific imagery',
      'subtle molecular or healthcare motifs',
    ],
    terminology: ['clinical evidence', 'medical affairs', 'therapy area', 'patient support'],
    avoidTerms: ['wellness lifestyle language', 'consumer coupon language', 'casual health claims'],
    caveats: [
      'Keep claims measured and avoid improvised medical assertions.',
      'Treat DA-sheet-backed forms and query index coverage as explicit verification points.',
    ],
    heroDirective: 'make the homepage feel like a credible medical content platform for launch teams, brand teams, and medical affairs leaders rather than a consumer health campaign',
    trustSignals: [
      'medical review and approval workflows',
      'evidence-backed claims governance',
      'launch readiness across therapy areas',
    ],
    ctaPatterns: [
      'Explore therapy launch workflows',
      'See medical content operations',
      'Review regulated demo experience',
    ],
    industryDirectives: [
      'Lead with scientific credibility, operational compliance, and launch readiness.',
      'Show how the experience supports HCP, patient-support, and medical-affairs content without casual health claims.',
      'Favor measured proof sections, precise language, and clean editorial hierarchy over lifestyle marketing tropes.',
    ],
  },
  {
    id: 'healthcare-provider',
    name: 'Healthcare Provider',
    badge: 'Care delivery',
    summary: 'Operationally credible provider-network story focused on patient access and digital care journeys.',
    conceptFrame: 'a high-trust care-delivery brand that feels calm, capable, modern, and access-driven',
    audience: 'provider executives, digital teams, and patient access leaders',
    tone: 'trusted, practical, outcomes-aware, and modern',
    ctaGoals: 'appointment conversion, service-line discovery, and care journey engagement',
    scope: ['/', '/learn', '/contact'],
    proofPoints: [
      'patient access and journey orchestration',
      'service-line content operations',
      'faster care campaign launches',
    ],
    visualThemes: [
      'care teams and clinical settings',
      'hospital and outpatient environments',
      'accessible digital patient experiences',
    ],
    terminology: ['patient access', 'care journey', 'provider network', 'service line'],
    avoidTerms: ['wellness influencer language', 'retail-first commerce language'],
    caveats: [
      'Keep a trust-heavy tone and avoid sounding like direct-to-consumer wellness marketing.',
    ],
    heroDirective: 'make the homepage feel like a modern care network focused on access, service-line discovery, and calm patient guidance',
    trustSignals: [
      'appointment access and scheduling clarity',
      'service-line navigation and care journey support',
      'credible care-team and network messaging',
    ],
    ctaPatterns: [
      'Find care options',
      'Explore service lines',
      'Start your care journey',
    ],
    industryDirectives: [
      'Lead with access, care coordination, and calm operational credibility.',
      'Make the journey from discovery to appointment feel clear, supported, and low-friction.',
      'Favor patient-trust signals and care-team realism over glossy wellness-brand storytelling.',
    ],
  },
  {
    id: 'banking',
    name: 'Banking',
    badge: 'Trust and growth',
    summary: 'Institutional, trustworthy financial-services framing for digital banking demos.',
    conceptFrame: 'a premium institutional digital bank with restrained confidence, crisp hierarchy, and trust-heavy product storytelling',
    audience: 'banking product leaders, marketing teams, and compliance-conscious executives',
    tone: 'reassuring, premium, clear, and security-minded',
    ctaGoals: 'account acquisition, product education, and self-service adoption',
    scope: ['/', '/learn', '/contact'],
    proofPoints: [
      'secure campaign operations',
      'faster product launches',
      'trusted omnichannel content delivery',
    ],
    visualThemes: [
      'modern financial dashboards',
      'professional customer-service moments',
      'premium but restrained brand systems',
    ],
    terminology: ['account opening', 'financial wellness', 'digital onboarding', 'trust and security'],
    avoidTerms: ['crypto hype language', 'aggressive consumer sales language'],
    caveats: [
      'Avoid overclaiming performance or returns.',
    ],
    heroDirective: 'make the homepage feel like a premium digital bank focused on trust, onboarding clarity, and product depth',
    trustSignals: [
      'security and fraud-reassurance cues',
      'clear account-opening and onboarding journeys',
      'cross-channel product education and self-service',
    ],
    ctaPatterns: [
      'Open an account',
      'Compare banking options',
      'See digital onboarding',
    ],
    industryDirectives: [
      'Lead with trust, clarity, and controlled confidence rather than aggressive sales energy.',
      'Translate campaign agility into secure product launches and stronger self-service adoption.',
      'Favor premium editorial finance visuals and comparison language over trading or crypto hype.',
    ],
  },
  {
    id: 'insurance',
    name: 'Insurance',
    badge: 'Guided choice',
    summary: 'Clear, confidence-building insurance messaging for product guidance and customer trust.',
    conceptFrame: 'a guidance-first protection brand with calm advisory energy, stronger clarity, and modern service credibility',
    audience: 'insurance marketers, product owners, and service leaders',
    tone: 'reassuring, explanatory, and dependable',
    ctaGoals: 'quote starts, policy education, and retention support',
    scope: ['/', '/learn', '/contact'],
    proofPoints: [
      'policy education at scale',
      'simplified content governance',
      'faster cross-line campaign launches',
    ],
    visualThemes: [
      'family and life-stage protection moments',
      'clean advisory visuals',
      'trustworthy service interactions',
    ],
    terminology: ['coverage', 'policyholder', 'claims support', 'advisory guidance'],
    avoidTerms: ['fear-heavy sales language', 'hard-sell urgency'],
    caveats: [
      'Prefer clarity over jargon and keep advice language measured.',
    ],
    heroDirective: 'make the homepage feel like a guidance-first protection brand that helps visitors understand coverage with confidence',
    trustSignals: [
      'coverage explanation and plan comparison',
      'claims support clarity',
      'life-stage protection guidance',
    ],
    ctaPatterns: [
      'Get a quote',
      'Explore coverage options',
      'Understand claims support',
    ],
    industryDirectives: [
      'Lead with reassurance, guidance, and clarity instead of fear or urgency.',
      'Make coverage choices feel explainable and supported, not overloaded with jargon.',
      'Use advisory storytelling, household protection moments, and service realism rather than hard-sell tactics.',
    ],
  },
  {
    id: 'higher-ed',
    name: 'Higher Ed',
    badge: 'Enrollment story',
    summary: 'Mission-driven, enrollment-focused university framing without losing institutional credibility.',
    conceptFrame: 'a modern institutional university brand with editorial confidence, mission-driven warmth, and stronger program storytelling',
    audience: 'enrollment, advancement, and digital experience leaders',
    tone: 'aspirational, clear, and mission-aligned',
    ctaGoals: 'program discovery, inquiry generation, and campus visit conversion',
    scope: ['/', '/learn', '/contact'],
    proofPoints: [
      'program and faculty storytelling',
      'faster campaign launches for enrollment windows',
      'distributed content governance',
    ],
    visualThemes: [
      'campus life and academic environments',
      'faculty and student interactions',
      'editorial and institutional brand language',
    ],
    terminology: ['student journey', 'program discovery', 'admissions', 'academic excellence'],
    avoidTerms: ['retail commerce language', 'overly corporate phrasing'],
    caveats: [
      'Balance warmth and institutional authority.',
    ],
    heroDirective: 'make the homepage feel like a modern university with mission-driven warmth, strong programs, and a clear admissions path',
    trustSignals: [
      'program outcomes and faculty credibility',
      'student support and campus-life context',
      'clear admissions and inquiry pathways',
    ],
    ctaPatterns: [
      'Explore programs',
      'Plan a visit',
      'Start your application',
    ],
    industryDirectives: [
      'Lead with academic outcomes, faculty credibility, and student possibility.',
      'Balance institutional authority with warmth, belonging, and mission.',
      'Favor editorial campus storytelling over corporate product-marketing language.',
    ],
  },
  {
    id: 'retail',
    name: 'Retail',
    badge: 'Merchandising',
    summary: 'Sharper, conversion-aware retail framing for digital merchandising and campaign agility.',
    conceptFrame: 'a premium editorial commerce brand with sharp merchandising, bold campaign rhythm, and polished conversion paths',
    audience: 'commerce leaders, merchandisers, and digital marketing teams',
    tone: 'confident, energetic, and polished',
    ctaGoals: 'category discovery, campaign engagement, and conversion lift',
    scope: ['/', '/learn', '/contact'],
    proofPoints: [
      'faster seasonal launches',
      'content reuse across campaigns',
      'merchandising and brand agility',
    ],
    visualThemes: [
      'editorial product storytelling',
      'premium campaign imagery',
      'clean commerce-focused layouts',
    ],
    terminology: ['merchandising', 'campaign launch', 'conversion', 'product discovery'],
    avoidTerms: ['regulated-care language', 'institutional public-sector language'],
    caveats: [
      'Keep the site premium and not discount-bin or cluttered.',
    ],
    heroDirective: 'make the homepage feel like a premium editorial commerce brand with campaign freshness and decisive product discovery',
    trustSignals: [
      'merchandising clarity and category flow',
      'fresh campaign storytelling',
      'confident conversion paths and product discovery',
    ],
    ctaPatterns: [
      'Shop the collection',
      'Explore new arrivals',
      'Build your look',
    ],
    industryDirectives: [
      'Lead with merchandising energy, premium editorial rhythm, and strong campaign freshness.',
      'Keep the path from inspiration to category discovery to action crisp and visible.',
      'Favor high-intent commerce storytelling over discount clutter, institutional tone, or regulated-language leftovers.',
    ],
  },
  {
    id: 'oak-chain',
    name: 'Oak Chain',
    badge: 'Acorn mode',
    summary: 'Enterprise content provenance story selling Oak Chain as the bridge from AEM and Oak to validator-replicated, economically secured content.',
    conceptFrame: 'a premium technical infrastructure brand where Ethereum-backed content provenance meets Oak and AEM operational trust',
    audience: 'platform architects, AEM leads, and content infrastructure strategists',
    tone: 'technical, credible, future-facing, and infrastructure-led',
    ctaGoals: 'local proof, architecture review, and connector or SDK evaluation',
    scope: ['/', '/learn', '/contact'],
    proofPoints: [
      'cryptographically verifiable content fabric',
      'validator-replicated writes with Ethereum-backed economic security',
      'bridge from existing AEM and Oak stacks without abandoning current mental models',
    ],
    visualThemes: [
      'enterprise infrastructure diagrams and validator clusters',
      'oak, ledger, and content provenance motifs',
      'premium technical editorial visuals instead of generic crypto hype',
    ],
    terminology: ['content provenance', 'validator-replicated writes', 'economic security', 'AEM connector', 'Oak Chain SDK'],
    avoidTerms: ['NFT hype', 'memecoin language', 'casino trading tone', 'generic Web3 buzzwords'],
    caveats: [
      'Position Oak Chain as an extension path for Oak and AEM, not a replacement fantasy.',
      'Make the bridge to existing AEM and Oak workflows feel concrete and operator-trustworthy.',
    ],
    heroDirective: 'make the homepage feel like premium content-provenance infrastructure that extends AEM and Oak into validator-replicated, economically secured writes',
    trustSignals: [
      'AEM connector path',
      'Oak Chain SDK path',
      'Ethereum-backed economic security without crypto hype',
    ],
    ctaPatterns: [
      'Evaluate the architecture',
      'Review the AEM connector',
      'Explore the SDK',
    ],
    industryDirectives: [
      'Lead with content provenance, operator trust, and distributed validation rather than generic Web3 futurism.',
      'Make the bridge from existing AEM and Oak workflows concrete, credible, and migration-friendly.',
      'Favor premium infrastructure visuals, diagrams, and proof language over token speculation aesthetics.',
    ],
    defaultAccount: 'Oak Chain',
    defaultContext: 'Sell Oak Chain as a distributed content repository where Ethereum meets Oak, with a clear AEM connector path and SDK path for new applications.',
    hidden: true,
  },
];

const app = {
  selectedRecipeId: RECIPES[0].id,
  oakUnlocked: false,
  branchAuto: true,
};

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const messageEl = toast?.querySelector('.toast-message');
  if (!toast || !messageEl) {
    return;
  }

  messageEl.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  window.clearTimeout(app.toastTimer);
  app.toastTimer = window.setTimeout(() => {
    toast.classList.add('hidden');
  }, 5000);
}

function slugifySiteName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isValidSiteName(value) {
  return SITE_NAME_PATTERN.test(value);
}

function getSelectedRecipe() {
  return RECIPES.find((recipe) => recipe.id === app.selectedRecipeId) || RECIPES[0];
}

function getVisibleRecipes() {
  return RECIPES.filter((recipe) => !recipe.hidden || app.oakUnlocked);
}

function getQuerySiteName() {
  const url = new URL(window.location.href);
  return slugifySiteName(url.searchParams.get('site') || '');
}

function getQueryCatalystUrl() {
  const url = new URL(window.location.href);
  return normalizeCatalystBaseUrl(url.searchParams.get('catalyst') || '');
}

function getQueryBranchName() {
  const url = new URL(window.location.href);
  return slugifySiteName(url.searchParams.get('branch') || '');
}

function normalizeCatalystBaseUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return '';
  }

  try {
    const url = new URL(trimmed, window.location.href);
    url.hash = '';
    url.search = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return '';
  }
}

function isLocalDevHost() {
  return LOCAL_DEV_HOSTS.has(window.location.hostname);
}

function getDefaultCatalystBaseUrl() {
  return isLocalDevHost() ? DEFAULT_LOCAL_CATALYST_URL : HOSTED_AEMCODER_URL;
}

function getStoredCatalystBaseUrl() {
  try {
    return normalizeCatalystBaseUrl(window.localStorage.getItem(CATALYST_URL_STORAGE_KEY) || '');
  } catch {
    return '';
  }
}

function persistCatalystBaseUrl(value) {
  try {
    if (value) {
      window.localStorage.setItem(CATALYST_URL_STORAGE_KEY, value);
      return;
    }
    window.localStorage.removeItem(CATALYST_URL_STORAGE_KEY);
  } catch {
    // Ignore storage failures in local tooling.
  }
}

function updatePageQuery(siteName, catalystBaseUrl, branchName) {
  const url = new URL(window.location.href);
  if (siteName) {
    url.searchParams.set('site', siteName);
  } else {
    url.searchParams.delete('site');
  }

  if (branchName && branchName !== siteName) {
    url.searchParams.set('branch', branchName);
  } else {
    url.searchParams.delete('branch');
  }

  if (catalystBaseUrl && catalystBaseUrl !== getDefaultCatalystBaseUrl()) {
    url.searchParams.set('catalyst', catalystBaseUrl);
  } else {
    url.searchParams.delete('catalyst');
  }
  window.history.replaceState({}, '', url);
}

function getElementValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : '';
}

function setElementValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.value = value;
  }
}

function parseLines(value) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function derivePreviewUrl(siteName) {
  if (!siteName) {
    return `https://${DEFAULT_SOURCE_REF}--<site>--cloudadoption.aem.page/`;
  }
  return `https://${DEFAULT_SOURCE_REF}--${siteName}--${ORG}.aem.page/`;
}

function deriveDaUrl(siteName) {
  if (!siteName) {
    return 'https://da.live/#/cloudadoption/<site>';
  }
  return `https://da.live/#/${ORG}/${siteName}`;
}

function deriveLiveUrl(siteName) {
  if (!siteName) {
    return `https://${DEFAULT_SOURCE_REF}--<site>--cloudadoption.aem.live/`;
  }
  return `https://${DEFAULT_SOURCE_REF}--${siteName}--${ORG}.aem.live/`;
}

function deriveBranchPreviewUrl(siteName, branchName) {
  if (!siteName || !branchName) {
    return 'https://<branch>--<site>--cloudadoption.aem.page/';
  }
  return `https://${branchName}--${siteName}--${ORG}.aem.page/`;
}

function summarizeList(items, fallback = 'none') {
  return items.length > 0 ? items.join(', ') : fallback;
}

function formatConfigValue(value) {
  const normalized = String(value || '').trim() || 'none';
  return `{{${normalized}}}`;
}

function formatConfigLines(entries) {
  return entries.map(([key, value]) => `${key}: ${formatConfigValue(value)}`);
}

function renderToolNavigation() {
  const siteName = slugifySiteName(getElementValue('site-name-input'));
  const branchName = slugifySiteName(getElementValue('branch-name-input'));
  const catalystBaseUrl = getCatalystBaseUrl();
  const params = new URLSearchParams();
  if (siteName) {
    params.set('site', siteName);
  }
  if (branchName && branchName !== siteName) {
    params.set('branch', branchName);
  }
  if (catalystBaseUrl && catalystBaseUrl !== getDefaultCatalystBaseUrl()) {
    params.set('catalyst', catalystBaseUrl);
  }
  const query = params.toString() ? `?${params.toString()}` : '';
  const cloneLink = document.getElementById('clone-tool-link');
  const remixLink = document.getElementById('remix-tool-link');

  if (cloneLink) {
    cloneLink.href = `/tools/cloneit/cloneit.html${query}`;
  }
  if (remixLink) {
    remixLink.href = `/tools/remixit/remixit.html${query}`;
  }

  updatePageQuery(siteName, catalystBaseUrl, branchName);
}

function renderRecipeCards() {
  const container = document.getElementById('recipe-grid');
  if (!container) {
    return;
  }

  container.innerHTML = getVisibleRecipes().map((recipe) => `
    <button class="recipe-card${recipe.id === app.selectedRecipeId ? ' is-active' : ''}" type="button" data-recipe-id="${recipe.id}">
      <h3>${recipe.name}</h3>
      <p>${recipe.summary}</p>
      <div class="recipe-meta">${recipe.badge}</div>
    </button>
  `).join('');

  container.querySelectorAll('[data-recipe-id]').forEach((button) => {
    button.addEventListener('click', () => {
      app.selectedRecipeId = button.getAttribute('data-recipe-id');
      applyRecipeDefaults();
      renderAll();
    });
  });
}

function applyRecipeDefaults() {
  const recipe = getSelectedRecipe();

  setElementValue('account-input', recipe.defaultAccount || '');
  setElementValue('audience-input', recipe.audience);
  setElementValue('tone-input', recipe.tone);
  setElementValue('cta-input', recipe.ctaGoals);
  setElementValue('scope-input', recipe.scope.join('\n'));
  setElementValue('proof-input', recipe.proofPoints.join('\n'));
  setElementValue('visual-input', recipe.visualThemes.join('\n'));
  setElementValue('context-input', recipe.defaultContext || '');
}

function syncBranchFromSite(force = false) {
  const siteName = slugifySiteName(getElementValue('site-name-input'));
  const branchInput = document.getElementById('branch-name-input');
  if (!branchInput) {
    return;
  }

  const currentBranch = slugifySiteName(branchInput.value);
  if (force || app.branchAuto || !currentBranch) {
    branchInput.value = siteName;
    app.branchAuto = true;
  }
}

function buildPrompt() {
  const recipe = getSelectedRecipe();
  const siteName = slugifySiteName(getElementValue('site-name-input'));
  const targetBranch = slugifySiteName(getElementValue('branch-name-input'));
  const account = getElementValue('account-input');
  const audience = getElementValue('audience-input') || recipe.audience;
  const tone = getElementValue('tone-input') || recipe.tone;
  const ctaGoals = getElementValue('cta-input') || recipe.ctaGoals;
  const scope = parseLines(getElementValue('scope-input'));
  const proofPoints = parseLines(getElementValue('proof-input'));
  const visualThemes = parseLines(getElementValue('visual-input'));
  const customerContext = getElementValue('context-input');
  const additionalConstraints = getElementValue('constraints-input');
  const previewUrl = derivePreviewUrl(siteName);
  const branchPreviewUrl = deriveBranchPreviewUrl(siteName, targetBranch);
  const liveUrl = deriveLiveUrl(siteName);
  const daUrl = deriveDaUrl(siteName);
  const recipeLabel = recipe.name;
  const pageScope = scope.length > 0 ? scope.join(', ') : '/';
  const remainingScope = scope.filter((path) => path !== '/');
  const remainingScopeLabel = remainingScope.length > 0 ? remainingScope.join(', ') : 'the remaining scoped pages';
  const accountLabel = account || 'auto';
  const proofPointList = summarizeList(proofPoints, summarizeList(recipe.proofPoints));
  const visualThemeList = summarizeList(visualThemes, summarizeList(recipe.visualThemes));
  const terminologyList = summarizeList(recipe.terminology);
  const avoidTermsList = summarizeList(recipe.avoidTerms);
  const caveatList = summarizeList(recipe.caveats);
  const trustSignalList = summarizeList(recipe.trustSignals);
  const ctaPatternList = summarizeList(recipe.ctaPatterns);
  const residueTermsList = summarizeList(BASE_SITE_RESIDUE_TERMS);
  const additionalConstraintsLabel = additionalConstraints || 'none';
  const extraContextLabel = customerContext || 'none';
  const structurePolicy = 'preserve existing sections, blocks, templates, metadata blocks, section-metadata, nav, footer, fragments, forms, and query-index-backed surfaces';
  const executionContext = `Catalyst is connected to the shared ${BASE_SITE} workspace; create or switch to ${targetBranch || '<branch>'} before making code changes, complete the remix there, and leave any DA upload, preview, or publish steps as explicit follow-up unless they actually happen`;
  const configSections = {
    required: formatConfigLines([
      ['RUN_MODE', 'content-only'],
      ['ORG', ORG],
      ['REPO', siteName || '<site>'],
      ['CONTENT_SITE', siteName || '<site>'],
      ['TARGET_THEME', recipeLabel],
      ['DA_FOLDER_URL', daUrl],
      ['PREVIEW_URL', previewUrl],
      ['LIVE_URL', liveUrl],
      ['SOURCE_REF', DEFAULT_SOURCE_REF],
      ['TARGET_GIT_BRANCH', targetBranch || '<branch>'],
      ['TARGET_BRANCH_PREVIEW_URL', branchPreviewUrl],
      ['BACKING_GIT_OWNER', ORG],
      ['BACKING_GIT_REPO', BASE_SITE],
    ]),
    optional: formatConfigLines([
      ['TARGET_BRAND_NAME', accountLabel],
      ['TARGET_BRAND_STYLE', `${recipe.conceptFrame}; ${tone}`],
      ['PRIMARY_GOAL', `Retheme the demo for ${recipeLabel} while preserving structure and authoring model`],
      ['CONTENT_SCOPE', pageScope],
      ['ASSET_POLICY', 'free stock assets only'],
      ['LINK_POLICY', 'all updated internal links must resolve; no 404s'],
      ['STRUCTURE_POLICY', structurePolicy],
      ['EXECUTION_CONTEXT', executionContext],
      ['SOURCE_OF_TRUTH', `use the discovered structure and content from ${previewUrl} plus the checked-out ${BASE_SITE} workspace on ${targetBranch || '<branch>'}`],
      ['DELIVERY_MODEL', `repoless site using the shared ${BASE_SITE} codebase`],
      ['SHARED_CODEBASE', BASE_SITE],
      ['BRANCH_POLICY', `create or switch to ${targetBranch || '<branch>'} before any code changes; never leave remix work on ${DEFAULT_SOURCE_REF}`],
      ['PUBLISH_MODE', 'manual follow-up after workspace review unless upload, preview, or publish is actually completed'],
      ['REPORT_MODE', 'return a complete audit summary, change log, asset log, verification summary, and unsupported or escalation notes'],
      ['EXTRA_CONTEXT', extraContextLabel],
      ['ADDITIONAL_CONSTRAINTS', additionalConstraintsLabel],
      ['AUDIENCE', audience],
      ['TONE', tone],
      ['CTA_GOALS', ctaGoals],
      ['HOMEPAGE_MISSION', recipe.heroDirective],
      ['PROOF_POINTS', proofPointList],
      ['TRUST_SIGNALS', trustSignalList],
      ['CTA_PATTERNS', ctaPatternList],
      ['VISUAL_THEMES', visualThemeList],
      ['TERMINOLOGY', terminologyList],
      ['AVOID_TERMS', avoidTermsList],
      ['KNOWN_CAVEATS', caveatList],
      ['LEGACY_THEME_RESIDUE', residueTermsList],
      ['RESIDUE_POLICY', 'remove or rewrite inherited finance terminology, query-index inputs, related-articles keywords, cards-view filters, nav labels, CTA labels, and finance-specific route targets from all in-scope surfaces'],
    ]),
  };
  const instructions = [
    'You are an AEM Edge Delivery Services (EDS) and Document Authoring (DA) remix agent.',
    'Use only the values in the CONFIG section. Do not ask the user to restate them unless a real blocker prevents execution.',
    '',
    '====================',
    'CONFIG',
    '====================',
    'REQUIRED VARIABLES',
    ...configSections.required,
    '',
    'OPTIONAL VARIABLES',
    ...configSections.optional,
    '',
    'Execution contract',
    `- This is a repoless flow. REPO and CONTENT_SITE refer to the DA/content site slug ${siteName || '<site>'}; BACKING_GIT_REPO refers to the shared code repository ${ORG}/${BASE_SITE}.`,
    `- Start from SOURCE_REF ${DEFAULT_SOURCE_REF} on BACKING_GIT_OWNER/BACKING_GIT_REPO, then create TARGET_GIT_BRANCH ${targetBranch || '<branch>'} if it does not exist and switch to it before making any workspace changes.`,
    `- If TARGET_GIT_BRANCH already exists, switch to it and continue there. Do not leave remix work on ${DEFAULT_SOURCE_REF}.`,
    `- The current content preview is ${previewUrl}. The expected post-remix branch preview target is ${branchPreviewUrl}.`,
    '',
    'Default behavior',
    '- If TARGET_BRAND_NAME is auto, create a credible brand name that fits TARGET_THEME, TARGET_BRAND_STYLE, and AUDIENCE.',
    '- Treat the discovered site inventory as the only source of truth for scope and structure. Do not assume fixed page counts or asset totals.',
    '- Because RUN_MODE is content-only, make the workspace changes directly but do not claim DA upload, preview, publish, or live verification unless they actually happen.',
    '- If EXTRA_CONTEXT or ADDITIONAL_CONSTRAINTS are none, proceed without inventing extra requirements.',
    '',
    'Mission',
    `Retheme the existing DA + EDS demo clone for ${recipeLabel}. Keep the existing authoring model intact, but push the visual identity, story spine, hierarchy, pacing, and industry credibility hard enough that the result feels like a real stakeholder demo rather than a light copy pass.`,
    `Use ${accountLabel === 'auto' ? 'an auto-generated brand name and framing' : `the provided brand/account name ${accountLabel}`}, and make it feel like ${recipe.conceptFrame}.`,
    `The site/content identity must remain ${siteName || '<site>'} while the code work moves from ${DEFAULT_SOURCE_REF} onto ${targetBranch || '<branch>'} in ${ORG}/${BASE_SITE}.`,
    '',
    'Supported run modes',
    '- audit-only: inventory and report only, with no workspace or DA changes.',
    '- content-only: complete the remix in the connected workspace without claiming DA upload, preview, publish, or live verification.',
    '- full-migration: audit, update content and media, push to DA, preview, publish, and verify end to end when credentials and tooling exist.',
    '',
    'Non-negotiable rules',
    ...COMMON_GUARDRAILS.map((item) => `- ${item}`),
    '- Preserve the existing structure defined by STRUCTURE_POLICY.',
    '- Do not break block contracts, metadata blocks, section-metadata blocks, or authoring semantics.',
    `- Create or switch to TARGET_GIT_BRANCH before any workspace edits. If the workspace stays on ${DEFAULT_SOURCE_REF}, stop and report the blocker.`,
    `- Keep the content/site identity anchored to CONTENT_SITE and DA_FOLDER_URL while code changes live in BACKING_GIT_REPO on TARGET_GIT_BRANCH.`,
    `- Treat inherited ${BASE_SITE} residue as a bug, not inspiration. Remove or rewrite terms such as ${residueTermsList} from visible copy, nav labels, CTA labels, metadata, related-articles inputs, cards-view filters, fragment references, and query-index-backed surfaces for the scoped remix.`,
    '- Do not leave in-scope pages pointing at old-theme destinations just because the old route exists. Replace those links with theme-valid destinations, remove them, or explicitly report the blocker.',
    '- Keep all updated internal links valid according to LINK_POLICY.',
    '- Use only assets allowed by ASSET_POLICY and record the source URL for each new asset in the final report.',
    '- If CSS, theme, icons, or lightweight JS adjustments are needed, make them in the checked-out diyfire workspace so the target preview reflects the redesign.',
    '- When a support surface is out of scope or intentionally unchanged, say so explicitly instead of implying it was remixed.',
    '- Do not claim preview, upload, publish, or live success unless it actually happened and was confirmed.',
    '- Preserve structure when uncertain and report the decision instead of inventing a new authoring pattern.',
    ...recipe.caveats.map((item) => `- ${item}`),
    `- Use terminology such as: ${terminologyList}.`,
    `- Avoid language such as: ${avoidTermsList}.`,
    additionalConstraints ? `- Additional constraints: ${additionalConstraints}.` : '',
    '',
    'Recipe-specific directives',
    ...recipe.industryDirectives.map((item) => `- ${item}`),
    '',
    'Execution workflow',
    '',
    'Phase 0: Workspace targeting',
    `- Confirm the connected workspace is ${ORG}/${BASE_SITE}.`,
    `- Report the starting branch, then create TARGET_GIT_BRANCH ${targetBranch || '<branch>'} from SOURCE_REF ${DEFAULT_SOURCE_REF} if needed and switch to it before editing code.`,
    `- Keep the target site identity on ${siteName || '<site>'}; the expected final preview target is ${branchPreviewUrl}.`,
    '',
    'Phase 1: Audit',
    '- Inventory every in-scope item in CONTENT_SCOPE before rewriting.',
    '- Inspect pages, nav, footer, fragments, forms or sheets, metadata, section-metadata, internal links, image references, icon tokens, embedded media, and any query-index-backed surfaces.',
    `- Explicitly inventory old-theme residue such as ${residueTermsList}, including inherited route targets, metadata keywords, related-articles inputs, cards-view filters, and fragment references.`,
    '- Treat the discovered in-scope inventory as the checklist for the rest of the run. Do not assume fixed totals.',
    '',
    'Phase 2: Theme definition',
    `- Define a cohesive ${recipeLabel} brand, terminology map, messaging system, and CTA model that fits ${recipe.conceptFrame}.`,
    `- Anchor the homepage around this mission: ${recipe.heroDirective}.`,
    `- Make the experience feel ${tone}, with proof points such as ${proofPointList}.`,
    `- Surface trust signals such as ${trustSignalList}.`,
    `- Use visual direction such as ${visualThemeList}.`,
    '- Keep terminology, proof points, CTA framing, and tone globally consistent across pages, nav, footer, fragments, forms, and metadata.',
    extraContextLabel !== 'none' ? `- Apply this extra context everywhere it helps: ${extraContextLabel}.` : '',
    '',
    'Phase 3: Content migration',
    '- Rewrite the homepage first so it becomes the strongest expression of the concept.',
    `- Then update ${remainingScopeLabel} so the scoped experience feels consistent end to end.`,
    '- Rewrite page copy, CTAs, metadata values, nav labels, footer copy, fragment copy, form labels, image references, icon references, and supporting surface content as needed.',
    `- Prefer CTA language such as ${ctaPatternList}.`,
    '- Keep the rewritten narrative coherent across pages, metadata, nav, footer, fragments, and forms.',
    '- If a changed link points to a page, that destination must exist and resolve.',
    '- Remove or replace inherited finance-themed route targets, metadata keywords, related-articles inputs, cards-view filters, and fragment references on in-scope surfaces. Do not keep old-theme taxonomy just because the block still functions.',
    '- If an inherited destination page remains out of scope and still carries the old theme, do not link to it from an in-scope remixed page unless you explicitly call out the gap as unresolved.',
    '- If a path change is required, update every internal reference and report any stale-path cleanup still needed.',
    '- If code-level theme changes are needed to make the remix believable, update the shared workspace carefully without breaking the existing authoring model.',
    '',
    'Phase 4: Media and icons',
    '- Replace logos, images, and video references with assets relevant to TARGET_THEME and TARGET_BRAND_STYLE.',
    '- Update or add icon assets only when needed to preserve existing token usage such as :logo: and :youtube:.',
    '- Keep alt text accurate, descriptive, and accessible.',
    '- Record each meaningful media change in the final report with old reference, new reference, and source URL.',
    '',
    'Phase 5: Workspace execution',
    '- RUN_MODE is content-only. Do not block on missing DA tokens or publish credentials.',
    `- Keep the workspace on TARGET_GIT_BRANCH ${targetBranch || '<branch>'} for the entire remix. Do not leave implementation work on ${DEFAULT_SOURCE_REF}.`,
    '- Complete the remix in the connected workspace and leave the result upload-ready for manual review or upload.',
    '- Separate what was completed in the workspace from what still requires DA credentials, preview, publish, or other manual follow-up.',
    '- If local preview differs from the remote PREVIEW_URL or LIVE_URL, explain the difference instead of claiming parity.',
    '',
    'Phase 6: Verification',
    '- Verify updated internal links, nav, footer, fragments, forms, metadata, image rendering, icon rendering, and scoped query-index-backed surfaces when present.',
    `- Verify that no inherited old-theme residue remains on in-scope surfaces, especially terms such as ${residueTermsList}, finance-specific route targets, related-articles keywords, cards-view filters, and metadata values.`,
    '- Perform visual spot checks on representative scoped pages and report any remaining issues explicitly.',
    '- If a support surface is intentionally unchanged, say why it stayed out of scope or unchanged.',
    '',
    'Behavior rules',
    '- Work autonomously through all phases unless blocked.',
    '- Do not skip audit, rewrite, or verification work for the discovered scope.',
    '- Do not provide a superficial summary in place of real migration work.',
    '- Because RUN_MODE is content-only, separate completed workspace changes from anything that still requires upload, preview, publish, or manual follow-up.',
    '',
    'Required output',
    '1. Audit summary',
    '- Total discovered items by type',
    '- Key structure notes',
    '- Risks or blockers',
    '2. Workspace and branch status',
    '- Connected repo',
    '- Starting branch',
    '- Active target branch',
    '- Branch preview target',
    '3. Files updated',
    '- Complete list of updated items grouped by type',
    '4. Content changes by page',
    '- Path',
    '- Summary of changes',
    '- Updated CTAs',
    '- Updated metadata',
    '- Updated links',
    '5. Media changes',
    '- Target page or file',
    '- Old reference',
    '- New reference',
    '- Source URL',
    '6. Preview, upload, and publish status',
    '- What was verified locally',
    '- What was not attempted by design',
    '- Any failures or blockers with exact details',
    '7. Verification results',
    '- Link validation',
    '- Metadata validation',
    '- Query-index-backed surface validation where relevant',
    '- Rendering validation',
    '- Visual spot-check summary',
    '- Remaining issues',
    '8. Unsupported or escalation notes',
    '- Anything intentionally deferred',
    '- Any required new block, deeper code divergence, or missing credential/tooling dependency',
    '9. Final completion statement',
    '- Only declare completion if the scoped content-only work was actually completed and verified',
    '',
    'Hard failure conditions',
    '- Missing or deleted metadata block',
    '- Broken block structure or authoring contract drift',
    '- Broken nav or footer',
    `- Workspace changes left on ${DEFAULT_SOURCE_REF} instead of TARGET_GIT_BRANCH`,
    '- Inherited base-theme residue left on in-scope surfaces, including finance-specific routes, metadata, related-articles inputs, cards-view filters, or visible copy without explanation',
    '- Updated links resolving to missing pages',
    '- Claimed preview, upload, or publish success without confirmation',
    '- Updated media not rendering',
    '- Stale renamed files left behind without explanation',
    '- Incomplete migration of discovered in-scope items without explanation',
  ];

  return instructions.filter(Boolean).join('\n');
}

function getCatalystBaseUrl() {
  const rawValue = getElementValue('catalyst-url-input');
  if (rawValue) {
    return normalizeCatalystBaseUrl(rawValue);
  }
  return getDefaultCatalystBaseUrl();
}

function buildCatalystLaunchPayload() {
  const siteName = slugifySiteName(getElementValue('site-name-input'));
  const targetBranch = slugifySiteName(getElementValue('branch-name-input'));
  if (!isValidSiteName(siteName) || !isValidSiteName(targetBranch)) {
    return null;
  }

  return {
    previewUrl: derivePreviewUrl(siteName),
    prompt: buildPrompt(),
    mode: 'execute',
    autorun: true,
    targetSite: siteName,
    targetBranch,
    targetBranchPreviewUrl: deriveBranchPreviewUrl(siteName, targetBranch),
    gitOwner: ORG,
    gitRepo: BASE_SITE,
    sourceRef: DEFAULT_SOURCE_REF,
  };
}

function buildCatalystEntryUrl() {
  const siteName = slugifySiteName(getElementValue('site-name-input'));
  if (!isValidSiteName(siteName)) {
    return '';
  }

  const catalystBaseUrl = getCatalystBaseUrl();
  if (!catalystBaseUrl) {
    return '';
  }

  const launchUrl = new URL(catalystBaseUrl);
  launchUrl.pathname = '/chat/content/preview';
  launchUrl.search = '';
  launchUrl.hash = '';
  return launchUrl.toString();
}

function openCatalystWithWindowName(catalystEntryUrl, launchPayload) {
  const launchWindow = window.open('about:blank', '_blank');
  if (!launchWindow) {
    return false;
  }

  launchWindow.opener = null;
  launchWindow.name = `${CATALYST_WINDOW_NAME_PREFIX}${JSON.stringify(launchPayload)}`;
  launchWindow.location.replace(catalystEntryUrl);
  return true;
}

function renderContextLinks() {
  const siteName = slugifySiteName(getElementValue('site-name-input'));
  const branchName = slugifySiteName(getElementValue('branch-name-input'));
  const previewUrl = derivePreviewUrl(siteName);
  const branchPreviewUrl = deriveBranchPreviewUrl(siteName, branchName);
  const daUrl = deriveDaUrl(siteName);
  const catalystBaseUrl = getCatalystBaseUrl();
  const catalystEntryUrl = buildCatalystEntryUrl();
  const previewLink = document.getElementById('preview-link');
  const branchPreviewLink = document.getElementById('branch-preview-link');
  const daLink = document.getElementById('da-link');
  const catalystLink = document.getElementById('catalyst-link');
  const previewText = document.getElementById('preview-url');
  const branchPreviewText = document.getElementById('branch-preview-url');
  const daText = document.getElementById('da-url');
  const catalystText = document.getElementById('catalyst-url');
  const canLink = isValidSiteName(siteName);
  const canLinkBranchPreview = canLink && isValidSiteName(branchName);

  if (previewLink) {
    previewLink.href = canLink ? previewUrl : '#';
    previewLink.setAttribute('aria-disabled', canLink ? 'false' : 'true');
  }
  if (branchPreviewLink) {
    branchPreviewLink.href = canLinkBranchPreview ? branchPreviewUrl : '#';
    branchPreviewLink.setAttribute('aria-disabled', canLinkBranchPreview ? 'false' : 'true');
  }
  if (daLink) {
    daLink.href = canLink ? daUrl : '#';
    daLink.setAttribute('aria-disabled', canLink ? 'false' : 'true');
  }
  if (catalystLink) {
    catalystLink.href = canLink && catalystEntryUrl ? catalystEntryUrl : '#';
    catalystLink.setAttribute('aria-disabled', canLink && catalystEntryUrl ? 'false' : 'true');
  }
  if (previewText) {
    previewText.textContent = previewUrl;
  }
  if (branchPreviewText) {
    branchPreviewText.textContent = branchPreviewUrl;
  }
  if (daText) {
    daText.textContent = daUrl;
  }
  if (catalystText) {
    catalystText.textContent = catalystBaseUrl || 'Enter a valid Catalyst URL';
  }
}

function renderStrategyCard() {
  const recipe = getSelectedRecipe();
  const badge = document.getElementById('recipe-badge');
  const summary = document.getElementById('recipe-summary');
  const pills = document.getElementById('recipe-pills');
  const guardrails = document.getElementById('guardrail-list');

  if (badge) {
    badge.textContent = recipe.badge;
  }
  if (summary) {
    summary.textContent = recipe.summary;
  }
  if (pills) {
    pills.innerHTML = [
      `<span class="pill">${recipe.name}</span>`,
      `<span class="pill">${recipe.tone}</span>`,
      `<span class="pill">${recipe.ctaGoals}</span>`,
    ].join('');
  }
  if (guardrails) {
    guardrails.innerHTML = [...COMMON_GUARDRAILS, ...recipe.industryDirectives].map((item) => `<li>${item}</li>`).join('');
  }
}

function renderPrompt() {
  const promptOutput = document.getElementById('prompt-output');
  if (promptOutput) {
    promptOutput.value = buildPrompt();
  }
}

function renderActionsState() {
  const siteName = slugifySiteName(getElementValue('site-name-input'));
  const branchName = slugifySiteName(getElementValue('branch-name-input'));
  const enabled = isValidSiteName(siteName) && isValidSiteName(branchName);
  const catalystEnabled = enabled && Boolean(buildCatalystEntryUrl()) && Boolean(buildCatalystLaunchPayload());
  const copyButton = document.getElementById('copy-prompt-btn');
  const copyAndOpenButton = document.getElementById('copy-open-aemcoder-btn');
  const launchButton = document.getElementById('launch-catalyst-btn');

  if (copyButton) {
    copyButton.disabled = !enabled;
  }
  if (copyAndOpenButton) {
    copyAndOpenButton.disabled = !enabled;
  }
  if (launchButton) {
    launchButton.disabled = !catalystEnabled;
  }
}

function renderAll() {
  renderToolNavigation();
  renderRecipeCards();
  renderContextLinks();
  renderStrategyCard();
  renderPrompt();
  renderActionsState();
}

async function copyPromptToClipboard() {
  const prompt = buildPrompt();
  await navigator.clipboard.writeText(prompt);
}

async function handleCopyPrompt() {
  try {
    await copyPromptToClipboard();
    showToast('Prompt copied.');
  } catch (error) {
    showToast(`Clipboard failed: ${error.message}`, 'error');
  }
}

async function handleOpenHostedAemCoder() {
  const siteName = slugifySiteName(getElementValue('site-name-input'));
  const targetBranch = slugifySiteName(getElementValue('branch-name-input'));
  if (!isValidSiteName(siteName) || !isValidSiteName(targetBranch)) {
    showToast('Enter a valid site name and target branch before opening AEMCoder.', 'error');
    return;
  }

  let clipboardError = null;
  try {
    await copyPromptToClipboard();
  } catch (error) {
    clipboardError = error;
  }

  const hostedWindow = window.open(HOSTED_AEMCODER_URL, '_blank');
  if (!hostedWindow) {
    showToast('Could not open hosted AEMCoder. Check your popup settings.', 'error');
    return;
  }

  hostedWindow.opener = null;

  if (clipboardError) {
    showToast(`Hosted AEMCoder opened, but clipboard failed: ${clipboardError.message}`, 'error');
    return;
  }

  showToast('Hosted AEMCoder opened. Connect the repo there and paste the copied brief.');
}

async function handleLaunchCatalyst() {
  const siteName = slugifySiteName(getElementValue('site-name-input'));
  const targetBranch = slugifySiteName(getElementValue('branch-name-input'));
  if (!isValidSiteName(siteName) || !isValidSiteName(targetBranch)) {
    showToast('Enter a valid site name and target branch before launching Catalyst.', 'error');
    return;
  }

  const rawCatalystUrl = getElementValue('catalyst-url-input');
  const catalystBaseUrl = rawCatalystUrl
    ? normalizeCatalystBaseUrl(rawCatalystUrl)
    : getDefaultCatalystBaseUrl();

  if (!catalystBaseUrl) {
    showToast('Catalyst target must be a valid URL.', 'error');
    return;
  }

  const launchPayload = buildCatalystLaunchPayload();
  const catalystEntryUrl = buildCatalystEntryUrl();
  if (!launchPayload || !catalystEntryUrl) {
    showToast('Could not build the Catalyst launch payload.', 'error');
    return;
  }

  persistCatalystBaseUrl(catalystBaseUrl);

  let clipboardError = null;
  try {
    await copyPromptToClipboard();
  } catch (error) {
    clipboardError = error;
  }

  const opened = openCatalystWithWindowName(catalystEntryUrl, launchPayload);
  if (!opened) {
    showToast('Could not open Catalyst. Check your popup settings.', 'error');
    return;
  }

  if (clipboardError) {
    showToast(`Catalyst opened, but clipboard failed: ${clipboardError.message}`, 'error');
    return;
  }

  showToast('Catalyst opened with one-shot launch data. Prompt copied as fallback.');
}

function setupModal() {
  const helpBtn = document.getElementById('help-btn');
  const modal = document.getElementById('help-modal');
  const closeBtn = modal?.querySelector('.modal-close');

  if (helpBtn && modal) {
    helpBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }
}

function setupToastClose() {
  const closeBtn = document.querySelector('#toast .toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('toast')?.classList.add('hidden');
    });
  }
}

function bindFormEvents() {
  [
    'site-name-input',
    'branch-name-input',
    'catalyst-url-input',
    'account-input',
    'audience-input',
    'tone-input',
    'cta-input',
    'scope-input',
    'proof-input',
    'visual-input',
    'context-input',
    'constraints-input',
  ].forEach((id) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    element.addEventListener('input', () => {
      if (id === 'site-name-input') {
        element.value = slugifySiteName(element.value);
        syncBranchFromSite();
      }
      if (id === 'branch-name-input') {
        element.value = slugifySiteName(element.value);
        if (!element.value) {
          app.branchAuto = true;
          syncBranchFromSite(true);
        } else {
          app.branchAuto = element.value === slugifySiteName(getElementValue('site-name-input'));
        }
      }
      renderAll();
    });
  });

  document.getElementById('brief-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  document.getElementById('copy-prompt-btn')?.addEventListener('click', handleCopyPrompt);
  document.getElementById('copy-open-aemcoder-btn')?.addEventListener('click', handleOpenHostedAemCoder);
  document.getElementById('launch-catalyst-btn')?.addEventListener('click', handleLaunchCatalyst);
  document.getElementById('oak-unlock-btn')?.addEventListener('click', () => {
    app.oakUnlocked = true;
    app.selectedRecipeId = 'oak-chain';
    applyRecipeDefaults();
    renderAll();
    showToast('Acorn unlocked. Oak Chain recipe revealed.');
  });
}

function init() {
  const initialSiteName = getQuerySiteName();
  const initialBranchName = getQueryBranchName();
  const initialCatalystUrl = getQueryCatalystUrl() || getStoredCatalystBaseUrl() || getDefaultCatalystBaseUrl();
  if (initialSiteName) {
    setElementValue('site-name-input', initialSiteName);
  }
  setElementValue('branch-name-input', initialBranchName || initialSiteName);
  app.branchAuto = !initialBranchName || initialBranchName === initialSiteName;
  setElementValue('catalyst-url-input', initialCatalystUrl);

  applyRecipeDefaults();
  syncBranchFromSite();
  renderAll();
  bindFormEvents();
  setupModal();
  setupToastClose();

  showToast('Remix-It is ready. Use hosted AEMCoder manually or launch a Catalyst build directly.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
