import { archetype as ai } from './archetypes/ai';
import { archetype as commerce } from './archetypes/commerce';
import { archetype as content } from './archetypes/content';
import { archetype as devtools } from './archetypes/devtools';
import { archetype as education } from './archetypes/education';
import { archetype as finance } from './archetypes/finance';
import { archetype as gaming } from './archetypes/gaming';
import { archetype as marketplace } from './archetypes/marketplace';
import { archetype as media } from './archetypes/media';
import { archetype as messaging } from './archetypes/messaging';
import { archetype as productivity } from './archetypes/productivity';
import { archetype as search } from './archetypes/search';
import { archetype as social } from './archetypes/social';
import { archetype as webapp } from './archetypes/webapp';
import type { OfflineContent } from './build';
import { fallbackArchetype } from './fallback-archetype';
import { BACKEND_PACKS } from './frameworks-backend';
import { FRONTEND_PACKS } from './frameworks-frontend';
import { KNOWN_PRODUCTS_A } from './known-products-a';
import { KNOWN_PRODUCTS_B } from './known-products-b';

/** All offline-engine content in one place: what makes an instant teardown of ANY site possible. */
export const OFFLINE: OfflineContent = {
  archetypes: {
    social,
    media,
    messaging,
    commerce,
    marketplace,
    finance,
    productivity,
    devtools,
    ai,
    search,
    content,
    education,
    gaming,
    webapp: webapp ?? fallbackArchetype,
  },
  packs: [...FRONTEND_PACKS, ...BACKEND_PACKS],
  products: [...KNOWN_PRODUCTS_A, ...KNOWN_PRODUCTS_B],
};

export const engineReady = () => Boolean(OFFLINE.archetypes.webapp);
