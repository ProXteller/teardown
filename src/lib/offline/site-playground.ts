import type { Teardown } from '@/data/types';
import type { PageOutline } from '@/lib/outline';

/**
 * Rebuilds the real page a user searched (its menu, headings, text and buttons) as a
 * playground that follows PLAYGROUND_CONTRACT, so remixing starts from the actual site.
 */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function luminance(hex: string) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/** True when the outline has enough real content to be worth rebuilding. */
export function hasRebuildableContent(o: PageOutline | undefined): o is PageOutline {
  return Boolean(o && o.headings.length >= 1 && (o.paragraphs.length >= 1 || o.nav.length >= 2 || o.headings.length >= 3));
}

export function buildSitePlayground(
  o: PageOutline,
  v: { name: string; domain: string; brand: string; accent: string },
): Teardown['playground'] {
  const h1 = o.headings.find((h) => h.level === 1) ?? o.headings[0];
  const sections = o.headings.filter((h) => h !== h1).slice(0, 5);
  const [intro, ...rest] = o.paragraphs;
  const cta = o.buttons[0] ?? 'Learn more';
  const onBrand = luminance(v.brand) > 150 ? '#111111' : '#FFFFFF';
  const nav = o.nav.length ? o.nav : ['Home', 'About', 'Contact'];

  const navHtml = nav.map((n, i) => `      <button class="navlink${i === 0 ? ' active' : ''}">${esc(n)}</button>`).join('\n');
  const sectionHtml = sections
    .map((s, i) => {
      const body = rest[i] ?? '';
      const title = i === 0 ? `<h2 data-edit="section-1">${esc(s.text)}</h2>` : `<h2>${esc(s.text)}</h2>`;
      return `  <article class="card">
    <div class="card-head">${title}<span class="chev">+</span></div>
    <p>${esc(body || 'Tap to expand. On the real site this section has more content.')}</p>
  </article>`;
    })
    .join('\n');
  const images = o.imageCount
    ? `  <div class="photo">🖼️ ${o.imageCount} image${o.imageCount === 1 ? '' : 's'} on the real page</div>\n`
    : '';

  const html = `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root {
  --brand: ${v.brand}; /* @tweak color "Brand color" */
  --accent: ${v.accent}; /* @tweak color "Accent color" */
  --bg: #F6F7F9; /* @tweak color "Page background" */
  --text: #1B1F24; /* @tweak color "Text color" */
  --radius: 12px; /* @tweak range 0 28 "Corner radius" */
  --space: 16px; /* @tweak range 8 32 "Spacing" */
}
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); }
header { background: var(--brand); color: ${onBrand}; padding: 12px var(--space); display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; }
.site { font-weight: 800; font-size: 17px; }
.burger { background: none; border: 0; color: inherit; font-size: 22px; }
nav { display: none; flex-direction: column; background: #fff; border-bottom: 3px solid var(--accent); }
nav.open { display: flex; }
.navlink { text-align: left; padding: 12px var(--space); border: 0; border-bottom: 1px solid #eee; background: #fff; font-size: 15px; color: var(--text); }
.navlink.active { color: var(--brand); font-weight: 700; }
.hero { padding: calc(var(--space) * 1.5) var(--space); }
h1 { font-size: 26px; line-height: 1.15; margin: 0 0 10px; }
.intro { line-height: 1.5; opacity: .8; margin: 0 0 var(--space); }
.cta { background: var(--accent); color: #111; border: 0; border-radius: var(--radius); padding: 12px 18px; font-weight: 700; font-size: 15px; }
.photo { margin: 0 var(--space) var(--space); height: 120px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; background: linear-gradient(135deg, var(--brand), var(--accent)); }
.card { background: #fff; margin: 0 var(--space) 10px; border-radius: var(--radius); padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
.card-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.card h2 { font-size: 16px; margin: 0; }
.card p { display: none; margin: 10px 0 0; line-height: 1.5; font-size: 14px; opacity: .8; }
.card.open p { display: block; }
.card.open { border-left: 4px solid var(--brand); }
.chev { color: var(--brand); font-weight: 700; }
.toast { position: fixed; left: 12px; right: 12px; bottom: 12px; background: #111; color: #fff; padding: 10px 12px; border-radius: var(--radius); font-size: 13px; opacity: 0; transition: opacity .25s; }
.toast.show { opacity: 1; }
footer { padding: var(--space); font-size: 12px; opacity: .6; text-align: center; }
</style>
</head>
<body>
<header>
  <div class="site" data-edit="site-name">${esc(v.name)}</div>
  <button class="burger" id="burger" aria-label="Menu">☰</button>
</header>
<nav id="menu">
${navHtml}
</nav>

<section class="hero">
  <h1 data-edit="headline">${esc(h1.text)}</h1>
${intro ? `  <p class="intro" data-edit="intro">${esc(intro)}</p>\n` : ''}  <button class="cta" id="cta" data-edit="cta">${esc(cta)}</button>
</section>

${images}${sectionHtml}

<footer data-edit="footer">Rebuilt from ${esc(v.domain)}</footer>
<div class="toast" id="toast"></div>

<script>
  var toast = document.getElementById('toast');
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }

  // The ☰ button shows and hides the menu, like on the real site
  document.getElementById('burger').addEventListener('click', function () {
    document.getElementById('menu').classList.toggle('open');
  });

  // Menu links: on the real site each one loads another page
  document.querySelectorAll('.navlink').forEach(function (link) {
    link.addEventListener('click', function () {
      document.querySelectorAll('.navlink').forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
      say('This would open the "' + link.textContent + '" page');
    });
  });

  // Tap a section to expand it
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('open');
      card.querySelector('.chev').textContent = card.classList.contains('open') ? '–' : '+';
    });
  });

  document.getElementById('cta').addEventListener('click', function () {
    if (this.getAttribute('contenteditable') !== 'true') say('Button pressed: real sites send you to a new page or form here');
  });
</script>
</body>
</html>`;

  const counts = [
    o.nav.length && `${o.nav.length} menu links`,
    `${o.headings.length} headings`,
    o.paragraphs.length && `${o.paragraphs.length} paragraphs`,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    title: `${v.domain} page, rebuilt`,
    description: `A simplified rebuild of the real page at ${v.domain}, made from its actual ${counts}. Styles and layout are simplified, but the words and structure are the site’s own.`,
    html,
    challenges: [
      'Tap “Edit text on the screen”, rewrite the big headline, then find that exact line in the Code tab.',
      `Change --brand to ${luminance(v.brand) > 150 ? '#1D4ED8' : '#22C55E'} and watch the header recolor.`,
      'In the Code tab, add a new menu link by copying one of the <button class="navlink"> lines.',
      'Set --radius to 0px, then 28px, and compare how the section cards feel.',
    ],
  };
}
