/**
 * Two-way binding between playground source code and the live preview.
 * code → preview: the preview reloads from code (see PLAYGROUND_CONTRACT in data/types.ts).
 * preview → code: tweak controls and on-screen text edits are written back into the source.
 */

export interface Tweak {
  name: string;
  value: string;
  type: 'color' | 'range';
  min: number;
  max: number;
  label: string;
}

export type PreviewMessage =
  | { type: 'edit'; key: string; text: string }
  | { type: 'error'; message: string }
  | { type: 'ready' };

export type HostMessage = { type: 'setVar'; name: string; value: string } | { type: 'edit-mode'; on: boolean };

const TWEAK_RE =
  /(--[\w-]+)\s*:\s*([^;]+?)\s*;\s*\/\*\s*@tweak\s+(color|range)((?:\s+-?\d+(?:\.\d+)?){0,2})\s*"([^"]*)"\s*\*\//g;

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function parseTweaks(code: string): Tweak[] {
  const tweaks: Tweak[] = [];
  const seen = new Set<string>();
  for (const m of code.matchAll(TWEAK_RE)) {
    const [, name, value, type, bounds, label] = m;
    if (seen.has(name)) continue;
    seen.add(name);
    const [min, max] = bounds.trim().split(/\s+/).filter(Boolean).map(Number);
    tweaks.push({
      name,
      value: value.trim(),
      type: type as Tweak['type'],
      min: Number.isFinite(min) ? min : 0,
      max: Number.isFinite(max) ? max : 48,
      label: label || name,
    });
  }
  return tweaks;
}

function lineOf(code: string, index: number) {
  return code.slice(0, index).split('\n').length;
}

export function setTweak(code: string, name: string, value: string): { code: string; line: number } {
  const re = new RegExp(`(${escapeRe(name)}\\s*:\\s*)([^;]+?)(\\s*;\\s*\\/\\*\\s*@tweak)`);
  const match = re.exec(code);
  if (!match) return { code, line: 0 };
  return { code: code.replace(re, `$1${value}$3`), line: lineOf(code, match.index) };
}

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function setEditableText(code: string, key: string, text: string): { code: string; line: number } {
  const re = new RegExp(`(data-edit=["']${escapeRe(key)}["'][^>]*>)([^<]*)(<)`);
  const match = re.exec(code);
  if (!match) return { code, line: 0 };
  const replaced = code.replace(re, (_, open: string, _old: string, close: string) => `${open}${escapeHtml(text)}${close}`);
  return { code: replaced, line: lineOf(code, match.index) };
}

export function lineText(code: string, line: number) {
  return code.split('\n')[line - 1]?.trim() ?? '';
}

const HEAD_SCRIPT = `<script>window.addEventListener('error',function(e){var m=JSON.stringify({type:'error',message:String(e.message||'Script error')});if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(m)}else if(window.parent!==window){window.parent.postMessage({__teardown:true,payload:m},'*')}});</script>`;

function bridge(editMode: boolean) {
  return `<script>(function(){
  function send(m){var s=JSON.stringify(m);if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(s)}else if(window.parent!==window){window.parent.postMessage({__teardown:true,payload:s},'*')}}
  var editing=false;
  function applyEdit(on){editing=on;document.querySelectorAll('[data-edit]').forEach(function(el){el.setAttribute('contenteditable',on?'true':'false');el.style.outline=on?'1.5px dashed #5EE7FF':'';el.style.outlineOffset=on?'2px':'';el.style.borderRadius=on?'4px':'';});}
  document.addEventListener('input',function(e){var el=e.target&&e.target.closest?e.target.closest('[data-edit]'):null;if(!el)return;send({type:'edit',key:el.getAttribute('data-edit'),text:el.textContent||''});},true);
  document.addEventListener('keydown',function(e){if(editing&&e.key==='Enter'){e.preventDefault();if(e.target&&e.target.blur)e.target.blur();}},true);
  function handle(m){if(!m)return;if(m.type==='setVar'){document.documentElement.style.setProperty(m.name,m.value)}if(m.type==='edit-mode'){applyEdit(!!m.on)}}
  window.__teardown=handle;
  window.addEventListener('message',function(e){var d=e.data;if(d&&d.__teardownHost){handle(d.payload)}});
  applyEdit(${editMode ? 'true' : 'false'});
  send({type:'ready'});
})();</script>`;
}

/** Injects the host bridge into the user's document without altering their code. */
export function buildPreview(code: string, editMode: boolean) {
  let html = code;
  html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => `${m}${HEAD_SCRIPT}`) : HEAD_SCRIPT + html;
  html = /<\/body>/i.test(html) ? html.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${bridge(editMode)}</body>`) : html + bridge(editMode);
  return html;
}
