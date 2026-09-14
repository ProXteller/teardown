import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Chip, GridBackground, Ionicons, Pressy, Txt, type IconName } from '@/components/ui';
import { C, F, MaxWidth } from '@/constants/theme';
import { buy, loadOffers, PAYWALL_ENABLED, purchasesEnabled, resetDemoPro, restore, usePro, type ProOffer } from '@/lib/purchases';
import { FREE_AI_TEARDOWNS, resolveQuery, startGeneration } from '@/lib/store';

const PERKS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'infinite', title: 'Unlimited AI teardowns', body: 'Any app, any website, any time' },
  { icon: 'pulse', title: 'Live site scans', body: 'See the real fingerprints behind a URL' },
  { icon: 'color-wand', title: 'Every playground', body: 'Remix the mini clone of each app you tear down' },
  { icon: 'bookmark', title: 'Saved on your device', body: 'Your teardowns stay available offline' },
];

export default function Paywall() {
  // While Teardown is free, any link to the paywall just goes home
  return PAYWALL_ENABLED ? <PaywallScreen /> : <Redirect href="/" />;
}

function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const { isPro } = usePro();
  const [offers, setOffers] = useState<ProOffer[] | null>(null);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadOffers()
      .then(setOffers)
      .catch(() => {
        setOffers([]);
        setMessage('Couldn’t load plans. Check your connection and try again.');
      });
  }, []);

  function continueAfterUnlock() {
    if (q) {
      const result = resolveQuery(q);
      const id = result.kind === 'generate' ? startGeneration(result.query) : result.id;
      router.replace({ pathname: '/t/[id]', params: { id } });
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  async function purchase() {
    const offer = offers?.[selected];
    if (!offer) return;
    setBusy(true);
    setMessage(null);
    try {
      if (await buy(offer)) continueAfterUnlock();
    } catch (e) {
      setMessage((e as Error).message || 'Purchase failed');
    } finally {
      setBusy(false);
    }
  }

  async function onRestore() {
    setBusy(true);
    try {
      const active = await restore();
      setMessage(active ? 'Pro restored!' : 'No previous purchase found.');
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <GridBackground height={360} />
      <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}>
        <Pressy onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} style={styles.close}>
          <Ionicons name="close" size={20} color={C.text} />
        </Pressy>

        <View style={styles.badge}>
          <Ionicons name="sparkles" size={26} color={C.bg} />
        </View>
        <Txt variant="label" style={{ color: C.amber, textAlign: 'center', marginTop: 18 }}>
          Teardown Pro
        </Txt>
        <Txt variant="title" style={{ textAlign: 'center', marginTop: 6 }}>
          {isPro ? 'You’re Pro. Tear down anything.' : 'Curious about everything?'}
        </Txt>
        <Txt variant="dim" style={{ textAlign: 'center', marginTop: 8, fontSize: 15 }}>
          {q
            ? `You’ve used your ${FREE_AI_TEARDOWNS} free AI teardowns. Go Pro to see how “${q}” is built.`
            : 'Curated classics are free forever. Pro unlocks unlimited AI teardowns of any app or site.'}
        </Txt>

        <View style={styles.perks}>
          {PERKS.map((p) => (
            <View key={p.title} style={styles.perk}>
              <View style={styles.perkIcon}>
                <Ionicons name={p.icon} size={17} color={C.amber} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt style={{ fontFamily: F.display, fontSize: 15 }}>{p.title}</Txt>
                <Txt variant="small">{p.body}</Txt>
              </View>
            </View>
          ))}
        </View>

        {isPro ? (
          <View style={{ gap: 10 }}>
            <Button title={q ? `Tear down ${q}` : 'Start exploring'} icon="construct" color={C.mint} onPress={continueAfterUnlock} />
            {!purchasesEnabled && (
              <Button title="Reset demo purchase" variant="ghost" color={C.textDim} onPress={() => void resetDemoPro()} />
            )}
          </View>
        ) : (
          <>
            {offers == null ? (
              <ActivityIndicator color={C.amber} style={{ marginVertical: 24 }} />
            ) : (
              <View style={{ gap: 10 }}>
                {offers.map((o, i) => (
                  <Pressy
                    key={o.pkg?.identifier ?? o.title}
                    onPress={() => setSelected(i)}
                    style={[styles.offer, i === selected && { borderColor: C.amber, backgroundColor: `${C.amber}10` }]}>
                    <Ionicons name={i === selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={i === selected ? C.amber : C.textDim} />
                    <View style={{ flex: 1 }}>
                      <Txt style={{ fontFamily: F.display, fontSize: 15.5 }}>{o.title}</Txt>
                      {!o.pkg && <Chip label="DEMO MODE · NO CHARGE" color={C.violet} />}
                    </View>
                    <Txt style={{ fontFamily: F.display, fontSize: 17 }}>
                      {o.price}
                      {o.period && o.period !== 'lifetime' ? <Txt variant="small">/{o.period}</Txt> : null}
                    </Txt>
                  </Pressy>
                ))}
              </View>
            )}
            <Button
              title={busy ? 'Working…' : 'Unlock Pro'}
              icon="lock-open"
              color={C.amber}
              disabled={busy || !offers?.length}
              onPress={purchase}
              style={{ marginTop: 16 }}
            />
            <Pressy onPress={onRestore} disabled={busy} style={{ alignSelf: 'center', padding: 12 }}>
              <Txt variant="small">Restore purchases</Txt>
            </Pressy>
          </>
        )}

        {message && <Txt style={styles.message}>{message}</Txt>}
        <Txt variant="small" style={styles.legal}>
          {purchasesEnabled
            ? 'Payments are processed by the App Store or Google Play through RevenueCat. Subscriptions renew until cancelled.'
            : 'Demo mode: RevenueCat keys aren’t configured, so unlocking is simulated locally for testing.'}
        </Txt>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', maxWidth: MaxWidth - 200, alignSelf: 'center', paddingHorizontal: 22 },
  close: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: C.amber,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.amber,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  perks: { gap: 14, marginVertical: 28 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  perkIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: `${C.amber}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.line,
    backgroundColor: C.card,
  },
  message: { textAlign: 'center', color: C.amber, fontFamily: F.body, marginTop: 8 },
  legal: { textAlign: 'center', color: C.textFaint, marginTop: 16, fontSize: 11 },
});
