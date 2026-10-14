import { Banknote, Bell, CircleCheckBig, Clock3 } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppCard } from '@/components/ui/AppCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { colors, radius, shadow } from '@/theme';

const NOTIFICATIONS = [
  {
    title: "Ali's order is due today",
    text: '2 Shalwar Kameez · 5:00 PM',
    time: '1h ago',
    icon: Clock3,
    color: colors.primaryDark,
    bg: colors.primaryLight,
  },
  {
    title: "Muhammad Khalil's order is ready",
    text: 'Tap to send a ready message to customer',
    time: '3h ago',
    icon: CircleCheckBig,
    color: colors.success,
    bg: colors.successBg,
  },
  {
    title: 'Rs. 3,000 balance payment is pending',
    text: 'Order #TF-1043 · Due since yesterday',
    time: 'Yesterday',
    icon: Banknote,
    color: colors.danger,
    bg: colors.dangerBg,
  },
];

export default function Notifications() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Notifications" back />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIconBox}>
            <Bell size={22} color={colors.primaryDark} strokeWidth={2.4} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Today's Updates</Text>
            <Text style={styles.heroSub}>3 action items require your attention</Text>
          </View>
        </View>

        {/* Notifications List */}
        <View style={styles.list}>
          {NOTIFICATIONS.map(({ title, text, time, icon: Icon, color, bg }) => (
            <AppCard key={title} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: bg }]}>
                <Icon size={20} color={color} strokeWidth={2.3} />
              </View>
              <View style={styles.textContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{title}</Text>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
                <Text style={styles.cardDesc}>{text}</Text>
              </View>
            </AppCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  content: {
    padding: 16,
    gap: 14,
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#CBD4C0',
    ...shadow,
  },
  heroIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  heroSub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  list: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 14,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
