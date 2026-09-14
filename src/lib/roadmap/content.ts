import { CAREER_TRACKS } from '@/data/careers';
import { AI_GAMES_DESIGN_CAREER } from '@/data/resources/ai-games-design-career';
import { BACKEND_CLOUD } from '@/data/resources/backend-cloud';
import { FOUNDATIONS_WEB_MOBILE } from '@/data/resources/foundations-web-mobile';
import { SECURITY } from '@/data/resources/security';

import type { Resource } from './types';

export { CAREER_TRACKS };

/** The verified learning-resource library (see scripts/verify-resources.ts). */
export const RESOURCES: Resource[] = [...FOUNDATIONS_WEB_MOBILE, ...BACKEND_CLOUD, ...SECURITY, ...AI_GAMES_DESIGN_CAREER];
