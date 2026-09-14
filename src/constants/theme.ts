import type { NodeKind } from '@/data/types';

/** Teardown commits to one look: a dark engineering blueprint. */
export const C = {
  bg: '#070B16',
  bgRaised: '#0D1424',
  card: '#111A2E',
  cardHi: '#17223B',
  line: '#1F2B45',
  lineHi: '#2C3B5E',
  grid: 'rgba(94, 231, 255, 0.06)',
  text: '#EAF0FF',
  textDim: '#9AA7C4',
  textFaint: '#5F6C8A',
  cyan: '#5EE7FF',
  mint: '#7CFFB2',
  amber: '#FFC857',
  pink: '#FF6BA8',
  violet: '#A78BFA',
  red: '#FF6B6B',
} as const;

export const F = {
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
  body: 'SpaceGrotesk_400Regular',
  mono: 'JetBrainsMono_400Regular',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export const MaxWidth = 760;

export const TIER_LABELS = ['Clients', 'Edge', 'API layer', 'Services', 'Data & storage'] as const;

export const KIND_STYLE: Record<NodeKind, { color: string; icon: string; label: string }> = {
  client: { color: C.cyan, icon: 'phone-portrait-outline', label: 'Client app' },
  edge: { color: C.violet, icon: 'globe-outline', label: 'Edge / CDN' },
  gateway: { color: C.amber, icon: 'git-network-outline', label: 'Gateway' },
  service: { color: C.mint, icon: 'cube-outline', label: 'Service' },
  queue: { color: C.pink, icon: 'swap-horizontal-outline', label: 'Queue / stream' },
  ml: { color: '#F0A6FF', icon: 'sparkles-outline', label: 'Machine learning' },
  cache: { color: '#FF9F5A', icon: 'flash-outline', label: 'Cache' },
  database: { color: '#6EA8FF', icon: 'server-outline', label: 'Database' },
  storage: { color: '#8FD3FE', icon: 'folder-open-outline', label: 'Storage' },
  external: { color: C.textDim, icon: 'extension-puzzle-outline', label: 'External service' },
};

const LANGUAGE_COLORS: Record<string, string> = {
  python: '#3572A5',
  javascript: '#F1E05A',
  typescript: '#3178C6',
  java: '#B07219',
  kotlin: '#A97BFF',
  swift: '#F05138',
  'objective-c': '#438EFF',
  go: '#00ADD8',
  rust: '#DEA584',
  'c++': '#F34B7D',
  c: '#8E8E8E',
  'c#': '#178600',
  elixir: '#6E4A7E',
  erlang: '#B83998',
  scala: '#DC322F',
  ruby: '#CC342D',
  php: '#4F5D95',
  sql: '#E38C00',
  html: '#E34C26',
  css: '#663399',
  dart: '#00B4AB',
  node: '#6CC24A',
};

const FALLBACK_COLORS = [C.cyan, C.mint, C.amber, C.pink, C.violet, '#6EA8FF', '#FF9F5A'];

export function languageColor(name: string, index: number): string {
  const key = name.toLowerCase().replace(/\s*\(.*\)$/, '').trim();
  return LANGUAGE_COLORS[key] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

/** Picks readable text (dark or light) for a given background hex. */
export function onColor(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length < 6) return '#fff';
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#0A0F1C' : '#FFFFFF';
}

/**
 * Brand colors like Uber's #000000 vanish on a dark UI; lift them to something visible.
 */
export function visibleBrand(hex: string, fallback: string = C.cyan): string {
  const h = hex.replace('#', '');
  if (h.length < 6) return fallback;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 60 ? fallback : hex;
}
