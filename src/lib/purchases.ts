import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

/**
 * RevenueCat powers the "Teardown Pro" subscription (unlimited AI teardowns).
 * Set EXPO_PUBLIC_REVENUECAT_API_KEY (a Test Store key works in Expo Go and on web), or
 * per-platform EXPO_PUBLIC_REVENUECAT_IOS_KEY / _ANDROID_KEY for store builds.
 * Without a key the paywall runs in a clearly-labeled local demo mode.
 */

/**
 * Teardown is free for now: the paywall only turns on when EXPO_PUBLIC_PAYWALL_ENABLED=true.
 * Flip it on before submitting to Shipaton so RevenueCat gates AI teardowns again.
 */
export const PAYWALL_ENABLED = process.env.EXPO_PUBLIC_PAYWALL_ENABLED === 'true';

export const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT ?? 'pro';
const DEMO_KEY = 'teardown/demo-pro';

function apiKey(): string | undefined {
  return (
    Platform.select({
      ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
      android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
      default: undefined,
    }) ?? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY
  );
}

export const purchasesEnabled = Boolean(apiKey());

interface ProState {
  isPro: boolean;
  ready: boolean;
}

let pro: ProState = { isPro: false, ready: false };
const listeners = new Set<() => void>();

function setPro(next: Partial<ProState>) {
  pro = { ...pro, ...next };
  listeners.forEach((l) => l());
}

function applyCustomerInfo(info: CustomerInfo) {
  setPro({ isPro: Boolean(info.entitlements.active[ENTITLEMENT_ID]), ready: true });
}

export async function initPurchases() {
  const key = apiKey();
  if (!key) {
    const demo = await AsyncStorage.getItem(DEMO_KEY).catch(() => null);
    setPro({ isPro: demo === '1', ready: true });
    return;
  }
  try {
    if (__DEV__) void Purchases.setLogLevel(LOG_LEVEL.WARN);
    Purchases.configure({ apiKey: key });
    Purchases.addCustomerInfoUpdateListener(applyCustomerInfo);
    applyCustomerInfo(await Purchases.getCustomerInfo());
  } catch (e) {
    console.warn('[purchases] init failed', e);
    setPro({ ready: true });
  }
}

export function usePro(): ProState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => pro,
    () => pro,
  );
}

export function isProNow() {
  return pro.isPro;
}

export interface ProOffer {
  pkg: PurchasesPackage | null;
  title: string;
  price: string;
  period: string;
}

export async function loadOffers(): Promise<ProOffer[]> {
  if (!purchasesEnabled) {
    return [{ pkg: null, title: 'Teardown Pro (demo)', price: '$2.99', period: 'month' }];
  }
  const offerings = await Purchases.getOfferings();
  const current = offerings.current;
  if (!current) return [];
  return current.availablePackages.map((pkg) => ({
    pkg,
    title: pkg.product.title || 'Teardown Pro',
    price: pkg.product.priceString,
    period: periodLabel(pkg.packageType),
  }));
}

function periodLabel(type: string) {
  switch (type) {
    case 'ANNUAL':
      return 'year';
    case 'MONTHLY':
      return 'month';
    case 'WEEKLY':
      return 'week';
    case 'LIFETIME':
      return 'lifetime';
    default:
      return '';
  }
}

/** Returns true when Pro is active afterwards; false if the user cancelled. */
export async function buy(offer: ProOffer): Promise<boolean> {
  if (!offer.pkg) {
    await AsyncStorage.setItem(DEMO_KEY, '1').catch(() => {});
    setPro({ isPro: true });
    return true;
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(offer.pkg);
    applyCustomerInfo(customerInfo);
    return Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]);
  } catch (e) {
    if ((e as { userCancelled?: boolean }).userCancelled) return false;
    throw e;
  }
}

export async function restore(): Promise<boolean> {
  if (!purchasesEnabled) return pro.isPro;
  const info = await Purchases.restorePurchases();
  applyCustomerInfo(info);
  return Boolean(info.entitlements.active[ENTITLEMENT_ID]);
}

/** Demo-mode only: lets you re-lock Pro while rehearsing the pitch. */
export async function resetDemoPro() {
  await AsyncStorage.removeItem(DEMO_KEY).catch(() => {});
  if (!purchasesEnabled) setPro({ isPro: false });
}
