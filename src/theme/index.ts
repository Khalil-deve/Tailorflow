import { Platform, StyleSheet } from 'react-native';

// ── Color Palette ──────────────────────────────────────────────
export const colors = {
  primary:      '#677356',
  primaryStrong:'#5C684B',
  primaryDark:  '#3F4A34',
  primaryLight: '#E8EBDD',
  primaryFaint: '#F7F8F4',
  background:   '#FAFAF9',
  surface:      '#FFFFFF',
  text:         '#1C1C1C',
  textSecondary:'#6B7280',
  muted:        '#9CA3AF',
  border:       '#D7DDD0',
  success:      '#16A34A',
  successBg:    '#DCFCE7',
  warningBg:    '#E8EBDD',
  danger:       '#DC2626',
  dangerBg:     '#FEE2E2',
  info:         '#2563EB',
  infoBg:       '#DBEAFE',
  purple:       '#7C3AED',
  purpleBg:     '#EDE9FE',
  white:        '#FFFFFF',
} as const;

// ── Spacing Scale ──────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
} as const;

// ── Border Radius Scale ────────────────────────────────────────
export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  full: 999,
} as const;

// ── Typography Scale ───────────────────────────────────────────
export const typography = {
  // Screen titles (h1 equivalent)
  screenTitle: { fontSize: 24, fontWeight: '900', color: colors.text, letterSpacing: -0.3 },
  // Section headings (h2 equivalent)
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  // Card titles / names
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  // Body text
  body: { fontSize: 15, fontWeight: '400', color: colors.text },
  // Labels (form labels, small captions)
  label: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  // Small muted text
  caption: { fontSize: 12, fontWeight: '600', color: colors.muted },
  // Numeric values (prices, counts)
  numeric: { fontSize: 20, fontWeight: '900', color: colors.text },
  // Small section overline
  overline: { fontSize: 11, fontWeight: '800', color: colors.muted, letterSpacing: 0.8 },
} as const;

// ── Elevation / Shadow ─────────────────────────────────────────
export const shadow = Platform.select({
  ios:     { shadowColor: '#3F4A34', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  android: { elevation: 2 },
  default: {},
});

// ── Common Shared Styles ───────────────────────────────────────
export const baseStyles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: colors.background },
  safeContent:  { paddingHorizontal: spacing.xl, paddingBottom: 110 },
  pageTitle:    { fontSize: 24, fontWeight: '900', color: colors.text, letterSpacing: -0.3 },
  sectionLabel: { fontSize: 17, fontWeight: '800', color: colors.text },
  inputHeight:  { height: 52 },
});
