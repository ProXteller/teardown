/**
 * Live-scan fingerprints: the same clues a developer looks for in DevTools to guess
 * what a website is built with. Each detection keeps its evidence so beginners learn *how* we know.
 * Detection names must match DETECTION_NAMES in src/lib/offline/types.ts.
 */

import type { PageOutline } from './outline';

export interface Detection {
  name: string;
  category: 'Framework' | 'Hosting / CDN' | 'Server' | 'CMS / Platform' | 'Analytics' | 'Payments' | 'Library' | 'Security';
  evidence: string;
}

export interface ScanResult {
  ok: boolean;
  url: string;
  finalUrl?: string;
  status?: number;
  title?: string;
  description?: string;
  /** From og:site_name / application-name, the cleanest source for a product name */
  siteName?: string;
  /** From <meta name="theme-color">, often the brand color */
  themeColor?: string;
  detections: Detection[];
  headers: { name: string; value: string }[];
  /** Menu, headings, text and buttons found on the page, used to rebuild it in the playground */
  outline?: PageOutline;
  error?: string;
  elapsedMs?: number;
}

type Category = Detection['category'];
type HeaderRule = { header: string; match?: RegExp; name: string; category: Category; why: string };
type HtmlRule = { match: RegExp; name: string; category: Category; why: string; /** also look for it in the CSP header */ csp?: boolean };

const HEADER_RULES: HeaderRule[] = [
  // Hosting, CDN & cloud
  { header: 'cf-ray', name: 'Cloudflare', category: 'Hosting / CDN', why: 'Response has a cf-ray header, which Cloudflare adds to every request it handles' },
  { header: 'server', match: /cloudflare/i, name: 'Cloudflare', category: 'Hosting / CDN', why: 'The server header says cloudflare' },
  { header: 'x-vercel-id', name: 'Vercel', category: 'Hosting / CDN', why: 'Response has an x-vercel-id header' },
  { header: 'server', match: /^vercel$/i, name: 'Vercel', category: 'Hosting / CDN', why: 'The server header says Vercel' },
  { header: 'x-nf-request-id', name: 'Netlify', category: 'Hosting / CDN', why: 'Response has an x-nf-request-id header' },
  { header: 'server', match: /netlify/i, name: 'Netlify', category: 'Hosting / CDN', why: 'The server header says Netlify' },
  { header: 'x-amz-cf-id', name: 'Amazon CloudFront', category: 'Hosting / CDN', why: 'Response has an x-amz-cf-id header from CloudFront' },
  { header: 'via', match: /cloudfront/i, name: 'Amazon CloudFront', category: 'Hosting / CDN', why: 'The via header mentions CloudFront' },
  { header: 'server', match: /AmazonS3/i, name: 'Amazon S3', category: 'Hosting / CDN', why: 'The server header says AmazonS3' },
  { header: 'x-amz-bucket-region', name: 'Amazon S3', category: 'Hosting / CDN', why: 'Response has an x-amz-bucket-region header' },
  { header: 'x-amz-request-id', name: 'Amazon Web Services', category: 'Hosting / CDN', why: 'Response has an x-amz-request-id header' },
  { header: 'x-amzn-requestid', name: 'Amazon Web Services', category: 'Hosting / CDN', why: 'Response has an x-amzn-RequestId header from an AWS service' },
  { header: 'x-amzn-trace-id', name: 'Amazon Web Services', category: 'Hosting / CDN', why: 'Response has an X-Amzn-Trace-Id header from an AWS load balancer' },
  { header: 'server', match: /awselb/i, name: 'Amazon Web Services', category: 'Hosting / CDN', why: 'The server header says awselb (AWS Elastic Load Balancing)' },
  { header: 'x-fastly-request-id', name: 'Fastly', category: 'Hosting / CDN', why: 'Response has an x-fastly-request-id header' },
  { header: 'x-served-by', match: /cache-[a-z]{3}/i, name: 'Fastly', category: 'Hosting / CDN', why: 'x-served-by names a Fastly cache node' },
  { header: 'server', match: /AkamaiGHost|AkamaiNetStorage/i, name: 'Akamai', category: 'Hosting / CDN', why: 'The server header names an Akamai edge server' },
  { header: 'x-akamai-transformed', name: 'Akamai', category: 'Hosting / CDN', why: 'Response has an x-akamai-transformed header' },
  { header: 'akamai-grn', name: 'Akamai', category: 'Hosting / CDN', why: 'Response has an akamai-grn header' },
  { header: 'server', match: /^(gws|gfe|esf|Google Frontend)/i, name: 'Google Front End', category: 'Server', why: 'The server header is one of Google’s front-end servers' },
  { header: 'via', match: /1\.1 google/i, name: 'Google Cloud', category: 'Hosting / CDN', why: 'The via header says "1.1 google", added by Google Cloud load balancers' },
  { header: 'x-cloud-trace-context', name: 'Google Cloud', category: 'Hosting / CDN', why: 'Response has an x-cloud-trace-context header from Google Cloud' },
  { header: 'x-azure-ref', name: 'Microsoft Azure', category: 'Hosting / CDN', why: 'Response has an x-azure-ref header from Azure Front Door' },
  { header: 'x-msedge-ref', name: 'Microsoft Azure', category: 'Hosting / CDN', why: 'Response has an x-msedge-ref header from Microsoft’s edge network' },
  { header: 'x-github-request-id', name: 'GitHub Pages', category: 'Hosting / CDN', why: 'Response has an x-github-request-id header' },
  { header: 'via', match: /vegur/i, name: 'Heroku', category: 'Hosting / CDN', why: 'The via header mentions vegur, Heroku’s router' },
  { header: 'server', match: /^heroku/i, name: 'Heroku', category: 'Hosting / CDN', why: 'The server header says Heroku' },
  { header: 'fly-request-id', name: 'Fly.io', category: 'Hosting / CDN', why: 'Response has a fly-request-id header' },
  { header: 'x-render-origin-server', name: 'Render', category: 'Hosting / CDN', why: 'Response has an x-render-origin-server header' },
  { header: 'rndr-id', name: 'Render', category: 'Hosting / CDN', why: 'Response has an rndr-id header' },
  { header: 'x-fb-debug', name: 'Meta infrastructure', category: 'Hosting / CDN', why: 'Response has an x-fb-debug header, which Meta’s servers attach for debugging' },
  { header: 'server', match: /proxygen/i, name: 'Proxygen (Meta)', category: 'Server', why: 'The server header says proxygen, Meta’s open-source HTTP server' },
  { header: 'alt-svc', match: /h3/i, name: 'HTTP/3 (QUIC)', category: 'Server', why: 'The alt-svc header advertises h3, meaning browsers can switch to HTTP/3 over QUIC' },
  { header: 'strict-transport-security', name: 'HSTS (HTTPS enforced)', category: 'Security', why: 'The strict-transport-security header forces browsers to always use HTTPS' },
  // Servers
  { header: 'server', match: /nginx/i, name: 'nginx', category: 'Server', why: 'The server header says nginx' },
  { header: 'server', match: /apache/i, name: 'Apache HTTP Server', category: 'Server', why: 'The server header says Apache' },
  { header: 'server', match: /Microsoft-IIS/i, name: 'Microsoft IIS', category: 'Server', why: 'The server header says Microsoft-IIS' },
  { header: 'server', match: /envoy/i, name: 'Envoy proxy', category: 'Server', why: 'The server header says envoy' },
  { header: 'x-envoy-upstream-service-time', name: 'Envoy proxy', category: 'Server', why: 'Response has an x-envoy-upstream-service-time header' },
  { header: 'x-varnish', name: 'Varnish', category: 'Server', why: 'Response has an x-varnish header from the Varnish cache' },
  // Frameworks & platforms
  { header: 'x-powered-by', match: /next\.js/i, name: 'Next.js', category: 'Framework', why: 'x-powered-by says Next.js' },
  { header: 'x-nextjs-cache', name: 'Next.js', category: 'Framework', why: 'Response has an x-nextjs-cache header' },
  { header: 'x-powered-by', match: /express/i, name: 'Express (Node.js)', category: 'Framework', why: 'x-powered-by says Express' },
  { header: 'x-powered-by', match: /php/i, name: 'PHP', category: 'Server', why: 'x-powered-by mentions PHP' },
  { header: 'x-powered-by', match: /asp\.net/i, name: 'ASP.NET', category: 'Framework', why: 'x-powered-by says ASP.NET' },
  { header: 'x-aspnet-version', name: 'ASP.NET', category: 'Framework', why: 'Response has an x-aspnet-version header' },
  { header: 'x-generator', match: /drupal/i, name: 'Drupal', category: 'CMS / Platform', why: 'x-generator says Drupal' },
  { header: 'x-drupal-cache', name: 'Drupal', category: 'CMS / Platform', why: 'Response has an x-drupal-cache header' },
  { header: 'x-shopify-stage', name: 'Shopify', category: 'CMS / Platform', why: 'Response has an x-shopify-stage header' },
  { header: 'x-shopid', name: 'Shopify', category: 'CMS / Platform', why: 'Response has an x-shopid header' },
  { header: 'x-wix-request-id', name: 'Wix', category: 'CMS / Platform', why: 'Response has an x-wix-request-id header' },
  { header: 'x-hs-hub-id', name: 'HubSpot CMS', category: 'CMS / Platform', why: 'Response has an x-hs-hub-id header' },
  { header: 'set-cookie', match: /laravel_session/i, name: 'Laravel', category: 'Framework', why: 'The site sets a laravel_session cookie' },
  { header: 'set-cookie', match: /csrftoken=/i, name: 'Django', category: 'Framework', why: 'The site sets a csrftoken cookie, Django’s default name' },
  { header: 'set-cookie', match: /PHPSESSID/i, name: 'PHP', category: 'Server', why: 'The site sets a PHPSESSID session cookie' },
  { header: 'set-cookie', match: /ASP\.NET_SessionId|\.AspNetCore\./i, name: 'ASP.NET', category: 'Framework', why: 'The site sets an ASP.NET session cookie' },
];

const HTML_RULES: HtmlRule[] = [
  // Front-end frameworks
  { match: /\/_next\/static\//, name: 'Next.js', category: 'Framework', why: 'Scripts load from /_next/static/, a folder only Next.js creates' },
  { match: /__NEXT_DATA__/, name: 'Next.js', category: 'Framework', why: 'The page embeds __NEXT_DATA__' },
  { match: /data-reactroot|react-dom|__REACT_DEVTOOLS|_reactListening/i, name: 'React', category: 'Framework', why: 'The HTML contains React markers' },
  { match: /__NUXT__|\/_nuxt\//, name: 'Nuxt (Vue)', category: 'Framework', why: 'The page contains __NUXT__ or /_nuxt/ assets' },
  { match: /data-v-[0-9a-f]{6,}|vue(\.runtime)?(\.global)?(\.min)?\.js/i, name: 'Vue.js', category: 'Framework', why: 'The HTML has Vue scoped-style attributes or loads vue.js' },
  { match: /ng-version=|ng-app/i, name: 'Angular', category: 'Framework', why: 'The HTML has an ng-version attribute' },
  { match: /__sveltekit|svelte-[a-z0-9]{5,}/i, name: 'Svelte / SvelteKit', category: 'Framework', why: 'The HTML has Svelte class hashes or __sveltekit' },
  { match: /\/_astro\/|astro-island/i, name: 'Astro', category: 'Framework', why: 'The HTML has /_astro/ assets or astro-island elements' },
  { match: /__remixContext|__remixManifest|__reactRouterContext/, name: 'Remix / React Router', category: 'Framework', why: 'The page embeds Remix/React Router context' },
  { match: /\/_expo\/static\//, name: 'Expo (React Native Web)', category: 'Framework', why: 'Scripts load from /_expo/static/' },
  { match: /___gatsby|gatsby-image|\/page-data\/app-data\.json/i, name: 'Gatsby', category: 'Framework', why: 'The HTML contains Gatsby markers' },
  { match: /class="ember-application|data-ember-action|ember-view/i, name: 'Ember.js', category: 'Framework', why: 'The HTML contains Ember view markers' },
  { match: /\sx-data=["']|alpinejs/i, name: 'Alpine.js', category: 'Library', why: 'The HTML uses x-data attributes or loads Alpine.js' },
  { match: /\shx-(get|post|put|delete|target|swap)=|htmx(\.min)?\.js/i, name: 'htmx', category: 'Library', why: 'The HTML uses hx-* attributes or loads htmx' },
  // Site builders & CMS
  { match: /wp-content|wp-includes/i, name: 'WordPress', category: 'CMS / Platform', why: 'Assets load from /wp-content/, WordPress’s folder for themes and uploads' },
  { match: /cdn\.shopify\.com|Shopify\.theme/i, name: 'Shopify', category: 'CMS / Platform', why: 'Assets load from cdn.shopify.com' },
  { match: /static\.squarespace\.com|squarespace-cdn\.com/i, name: 'Squarespace', category: 'CMS / Platform', why: 'Assets load from Squarespace’s CDN' },
  { match: /static\.wixstatic\.com|wix-code|X-Wix-/i, name: 'Wix', category: 'CMS / Platform', why: 'Assets load from static.wixstatic.com' },
  { match: /framerusercontent\.com|framer\.com\/m\//i, name: 'Framer', category: 'CMS / Platform', why: 'Assets load from framerusercontent.com' },
  { match: /webflow\.(js|com)|data-wf-page/i, name: 'Webflow', category: 'CMS / Platform', why: 'The HTML has Webflow data-wf attributes' },
  { match: /<meta[^>]+generator[^>]+Ghost/i, name: 'Ghost', category: 'CMS / Platform', why: 'The generator meta tag says Ghost' },
  { match: /Drupal\.settings|drupal\.js|\/sites\/default\/files\//i, name: 'Drupal', category: 'CMS / Platform', why: 'The HTML contains Drupal settings or /sites/default/files/ paths' },
  { match: /hs-sites\.com|hubspotusercontent/i, name: 'HubSpot CMS', category: 'CMS / Platform', why: 'Assets load from HubSpot’s CMS domains' },
  // Back-end hints in HTML
  { match: /name=["']csrf-param["'][^>]+authenticity_token/i, name: 'Ruby on Rails', category: 'Framework', why: 'The page has a csrf-param meta tag named authenticity_token, a Rails convention' },
  { match: /csrfmiddlewaretoken/i, name: 'Django', category: 'Framework', why: 'Forms include csrfmiddlewaretoken, Django’s CSRF field' },
  { match: /__VIEWSTATE/i, name: 'ASP.NET', category: 'Framework', why: 'Forms include __VIEWSTATE, an ASP.NET Web Forms field' },
  { match: /\/__\/firebase\//i, name: 'Firebase Hosting', category: 'Hosting / CDN', why: 'Scripts load from /__/firebase/, a path Firebase Hosting serves' },
  // CDNs referenced in HTML
  { match: /static\.xx\.fbcdn\.net|\.fbcdn\.net/i, name: 'Meta CDN (fbcdn)', category: 'Hosting / CDN', why: 'Assets load from fbcdn.net, Meta’s content delivery network', csp: true },
  { match: /gstatic\.com/i, name: 'Google static CDN', category: 'Hosting / CDN', why: 'Assets load from gstatic.com' },
  { match: /cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com/i, name: 'Public JS CDN', category: 'Library', why: 'Loads scripts from a public CDN' },
  // Libraries
  { match: /tailwindcss|--tw-[a-z-]+:/i, name: 'Tailwind CSS', category: 'Library', why: 'The CSS contains Tailwind --tw- variables' },
  { match: /bootstrap(\.bundle)?(\.min)?\.(css|js)/i, name: 'Bootstrap', category: 'Library', why: 'Loads bootstrap.css or bootstrap.js' },
  { match: /jquery(-[\d.]+)?(\.min)?\.js/i, name: 'jQuery', category: 'Library', why: 'Loads jquery.js' },
  { match: /font-?awesome|kit\.fontawesome\.com/i, name: 'Font Awesome', category: 'Library', why: 'Loads Font Awesome icons' },
  { match: /fonts\.googleapis\.com/i, name: 'Google Fonts', category: 'Library', why: 'Loads fonts from fonts.googleapis.com', csp: true },
  // Third-party services
  { match: /googletagmanager\.com|google-analytics\.com|gtag\(/i, name: 'Google Analytics / Tag Manager', category: 'Analytics', why: 'Loads Google Analytics or Tag Manager', csp: true },
  { match: /cdn\.segment\.com|api\.segment\.io/i, name: 'Segment', category: 'Analytics', why: 'Loads Segment’s analytics script', csp: true },
  { match: /browser\.sentry-cdn\.com|\.ingest\.sentry\.io|Sentry\.init/i, name: 'Sentry', category: 'Analytics', why: 'Loads the Sentry error tracker', csp: true },
  { match: /static\.hotjar\.com|\.hotjar\.com/i, name: 'Hotjar', category: 'Analytics', why: 'Loads Hotjar’s session analytics', csp: true },
  { match: /widget\.intercom\.io|js\.intercomcdn\.com/i, name: 'Intercom', category: 'Library', why: 'Loads the Intercom chat widget', csp: true },
  { match: /js\.stripe\.com/i, name: 'Stripe', category: 'Payments', why: 'Loads js.stripe.com for payments', csp: true },
  { match: /paypal\.com\/sdk\/js|paypalobjects\.com/i, name: 'PayPal', category: 'Payments', why: 'Loads PayPal’s checkout SDK', csp: true },
  { match: /google\.com\/recaptcha|recaptcha\/api\.js|gstatic\.com\/recaptcha/i, name: 'reCAPTCHA', category: 'Security', why: 'Loads Google reCAPTCHA bot protection', csp: true },
  { match: /algolianet\.com|algolia\.net|cdn\.jsdelivr\.net\/npm\/algoliasearch/i, name: 'Algolia', category: 'Library', why: 'Talks to Algolia’s hosted search', csp: true },
  { match: /cdn\.auth0\.com|\.auth0\.com/i, name: 'Auth0', category: 'Security', why: 'Talks to Auth0 for login', csp: true },
  { match: /firebaseio\.com|firebaseapp\.com|firebasestorage\.googleapis\.com/i, name: 'Firebase', category: 'Library', why: 'Talks to Firebase services', csp: true },
  { match: /\.supabase\.co/i, name: 'Supabase', category: 'Library', why: 'Talks to a Supabase backend', csp: true },
  { match: /youtube\.com\/embed|youtube-nocookie\.com/i, name: 'YouTube embeds', category: 'Library', why: 'Embeds YouTube videos', csp: true },
];

export function detect(headers: Headers, html: string, host = ''): Detection[] {
  const found = new Map<string, Detection>();
  const add = (name: string, category: Category, evidence: string) => {
    if (!found.has(name)) found.set(name, { name, category, evidence });
  };

  for (const rule of HEADER_RULES) {
    const value = rule.header === 'set-cookie' ? setCookies(headers) : headers.get(rule.header);
    if (value == null || value === '') continue;
    if (rule.match && !rule.match.test(value)) continue;
    add(rule.name, rule.category, rule.why);
  }
  for (const rule of HTML_RULES) {
    if (rule.match.test(html)) add(rule.name, rule.category, rule.why);
  }
  // Big sites often serve bots a tiny page, but their security policy still lists the services they use
  const csp = headers.get('content-security-policy') ?? '';
  if (csp) {
    for (const rule of HTML_RULES) {
      if (rule.csp && rule.match.test(csp)) {
        add(rule.name, rule.category, `Its Content-Security-Policy header allows this service (${rule.why.replace(/^Loads |^Talks to |^Assets load from |^Embeds /, '')})`);
      }
    }
  }
  // github.com itself sends GitHub's request-id header; only *.github.io sites are GitHub Pages
  if (/(^|\.)github\.com$/.test(host)) found.delete('GitHub Pages');
  // Next.js and Gatsby are built on React
  if ((found.has('Next.js') || found.has('Gatsby') || found.has('Remix / React Router')) && !found.has('React')) {
    add('React', 'Framework', `${found.has('Next.js') ? 'Next.js' : found.has('Gatsby') ? 'Gatsby' : 'Remix'} is built on React`);
  }
  if (found.has('Nuxt (Vue)') && !found.has('Vue.js')) add('Vue.js', 'Framework', 'Nuxt is built on Vue');
  if (found.has('Laravel') && !found.has('PHP')) add('PHP', 'Server', 'Laravel is a PHP framework');
  return [...found.values()];
}

function setCookies(headers: Headers): string {
  const h = headers as Headers & { getSetCookie?: () => string[] };
  return h.getSetCookie ? h.getSetCookie().join('; ') : (headers.get('set-cookie') ?? '');
}

export const INTERESTING_HEADERS = [
  'server',
  'x-powered-by',
  'via',
  'cache-control',
  'content-type',
  'strict-transport-security',
  'alt-svc',
  'cf-ray',
  'x-vercel-id',
  'x-amz-cf-id',
  'x-served-by',
  'x-fb-debug',
  'x-azure-ref',
];

function metaContent(html: string, key: string): string | undefined {
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (
    html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${k}["'][^>]+content=["']([^"']{1,300})["']`, 'i'))?.[1] ??
    html.match(new RegExp(`<meta[^>]+content=["']([^"']{1,300})["'][^>]+(?:name|property)=["']${k}["']`, 'i'))?.[1]
  );
}

export function extractMeta(html: string): Pick<ScanResult, 'title' | 'description' | 'siteName' | 'themeColor'> {
  const title = html.match(/<title[^>]*>([^<]{1,200})<\/title>/i)?.[1]?.trim();
  const description = metaContent(html, 'description') ?? metaContent(html, 'og:description');
  const siteName = metaContent(html, 'og:site_name') ?? metaContent(html, 'application-name') ?? metaContent(html, 'apple-mobile-web-app-title');
  const themeColor = metaContent(html, 'theme-color');
  return {
    title: decodeEntities(title),
    description: decodeEntities(description?.trim()),
    siteName: decodeEntities(siteName?.trim()),
    themeColor: themeColor && /^#[0-9a-f]{6}$/i.test(themeColor.trim()) ? themeColor.trim() : undefined,
  };
}

function decodeEntities(s?: string) {
  return s
    ?.replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)));
}
