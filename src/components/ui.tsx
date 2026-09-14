import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';

import { C, F, onColor } from '@/constants/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];
export { Ionicons };

type Variant = 'hero' | 'title' | 'heading' | 'body' | 'dim' | 'small' | 'label' | 'mono';

const VARIANTS: Record<Variant, TextStyle> = {
  hero: { fontFamily: F.display, fontSize: 40, lineHeight: 44, color: C.text, letterSpacing: -1 },
  title: { fontFamily: F.display, fontSize: 26, lineHeight: 31, color: C.text, letterSpacing: -0.5 },
  heading: { fontFamily: F.display, fontSize: 18, lineHeight: 23, color: C.text },
  body: { fontFamily: F.body, fontSize: 15, lineHeight: 22, color: C.text },
  dim: { fontFamily: F.body, fontSize: 14, lineHeight: 20, color: C.textDim },
  small: { fontFamily: F.body, fontSize: 12, lineHeight: 16, color: C.textDim },
  label: { fontFamily: F.monoBold, fontSize: 11, lineHeight: 14, color: C.textFaint, letterSpacing: 1.2, textTransform: 'uppercase' },
  mono: { fontFamily: F.mono, fontSize: 13, lineHeight: 19, color: C.text },
};

export function Txt({ variant = 'body', style, ...props }: TextProps & { variant?: Variant }) {
  return <Text {...props} style={[VARIANTS[variant], style]} />;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Pressy({ style, ...props }: PressableProps & { style?: StyleProp<ViewStyle> }) {
  return <Pressable {...props} style={({ pressed }) => [style, pressed && { opacity: 0.7, transform: [{ scale: 0.985 }] }]} />;
}

export function Chip({
  label,
  color = C.textDim,
  icon,
  filled,
}: {
  label: string;
  color?: string;
  icon?: IconName;
  filled?: boolean;
}) {
  return (
    <View
      style={[
        styles.chip,
        { borderColor: `${color}55`, backgroundColor: filled ? color : `${color}14` },
      ]}>
      {icon && <Ionicons name={icon} size={11} color={filled ? onColor(color) : color} />}
      <Text style={[styles.chipText, { color: filled ? onColor(color) : color }]}>{label}</Text>
    </View>
  );
}

export function LogoMark({ glyph, color, accent, size = 44 }: { glyph: string; color: string; accent?: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: accent ? `${accent}AA` : 'rgba(255,255,255,0.15)',
      }}>
      <Text style={{ fontFamily: F.display, fontSize: size * 0.42, color: onColor(color) }}>{glyph}</Text>
    </View>
  );
}

export function SectionTitle({ label, title, right }: { label?: string; title: string; right?: ReactNode }) {
  return (
    <View style={styles.sectionTitle}>
      <View style={{ flex: 1, gap: 2 }}>
        {label && <Txt variant="label">{label}</Txt>}
        <Txt variant="heading">{title}</Txt>
      </View>
      {right}
    </View>
  );
}

export function Button({
  title,
  onPress,
  icon,
  color = C.cyan,
  variant = 'solid',
  disabled,
  style,
}: {
  title: string;
  onPress?: () => void;
  icon?: IconName;
  color?: string;
  variant?: 'solid' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const fg = variant === 'solid' ? onColor(color) : color;
  return (
    <Pressy
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === 'solid' ? { backgroundColor: color } : { borderColor: `${color}66`, borderWidth: 1 },
        disabled && { opacity: 0.45 },
        style,
      ]}>
      {icon && <Ionicons name={icon} size={16} color={fg} />}
      <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
    </Pressy>
  );
}

/** Blueprint grid drawn behind hero areas. */
export function GridBackground({ height = 420 }: { height?: number }) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { height, overflow: 'hidden' }]}>
      <Svg width="100%" height={height}>
        <Defs>
          <Pattern id="minor" width={16} height={16} patternUnits="userSpaceOnUse">
            <Path d="M 16 0 L 0 0 0 16" fill="none" stroke={C.grid} strokeWidth={1} />
          </Pattern>
          <Pattern id="major" width={80} height={80} patternUnits="userSpaceOnUse">
            <Rect width={80} height={80} fill="url(#minor)" />
            <Path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(94,231,255,0.12)" strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#major)" />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { top: height * 0.55, backgroundColor: C.bg, opacity: 0.85 }]} />
    </View>
  );
}

export function Skeleton({ height = 16, width = '100%', style }: { height?: number; width?: number | `${number}%`; style?: StyleProp<ViewStyle> }) {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return <Animated.View style={[{ height, width, borderRadius: 8, backgroundColor: C.cardHi, opacity: pulse }, style]} />;
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: C.line, marginVertical: 4 }} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    padding: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  chipText: { fontFamily: F.monoBold, fontSize: 10.5, letterSpacing: 0.3 },
  sectionTitle: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 12 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  buttonText: { fontFamily: F.display, fontSize: 15 },
});
