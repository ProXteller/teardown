/**
 * Search suggestions: as a student types an app or website name, Teardown lists every matching product (its own
 * library first, then real apps and websites from the web) so they choose the right one instead of being sent to a
 * guess. Shared by the local matcher (local.ts), the web lookup (web.ts, served by /api/suggest) and the home screen.
 */

/** Where a suggestion comes from, which also decides its badge and what choosing it does */
export type SuggestionKind =
  /** A hand-written curated teardown: opens it */
  | 'curated'
  /** A product in the offline known-products library: starts a teardown of its domain */
  | 'known'
  /** A teardown the student already opened: reopens it */
  | 'recent'
  /** A mobile app from the App Store search */
  | 'app'
  /** A company website (Clearbit autocomplete) or a software product (Wikidata) */
  | 'website'
  /** "Tear down what I typed" */
  | 'typed';

export type WebSuggestionSource = 'appstore' | 'clearbit' | 'wikidata';

export interface Suggestion {
  /** Stable key for lists and dedupe, e.g. "curated:instagram", "domain:linear.app", "typed:zoom" */
  key: string;
  kind: SuggestionKind;
  /** Display name, e.g. "Linear" or "Zoom Workplace" */
  name: string;
  /** Bare lowercase domain the teardown scans, e.g. "linear.app" (no protocol, no www); null when unknown */
  domain: string | null;
  /** One short line shown under the name: tagline, App Store category + seller, or Wikidata description */
  description?: string;
  /** For kind "curated": the curated teardown id to open */
  curatedId?: string;
  /** For kind "recent": the saved teardown id to reopen */
  entryId?: string;
  /** Letter/emoji glyph and brand color for the LogoMark when there is no icon */
  logoGlyph?: string;
  brandColor?: string;
  /** https icon URL (App Store artwork only) */
  iconUrl?: string;
  /** For web suggestions: which lookup found it (merged suggestions keep the first) */
  source?: WebSuggestionSource;
  /** Popularity hint for ranking, e.g. App Store rating count */
  popularity?: number;
}

export interface SuggestSourceStatus {
  name: WebSuggestionSource;
  ok: boolean;
  ms: number;
}

/** GET /api/suggest?q=<text> */
export interface SuggestResponse {
  query: string;
  suggestions: Suggestion[];
  sources: SuggestSourceStatus[];
}
