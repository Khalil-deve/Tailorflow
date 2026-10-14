import { useRouter } from 'expo-router';
import {
  Banknote,
  Bell,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  DatabaseBackup,
  Languages,
  LogOut,
  Ruler,
  Scissors,
  Settings,
  Store,
  UserRoundCog,
  WalletCards,
  type LucideIcon,
} from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/stores/appStore';
import { colors, radius, shadow } from '@/theme';

type MenuRow = {
  label: string;
  icon: LucideIcon;
  route?:
    | '/payments'
    | '/(tabs)/calendar'
    | '/settings/shop'
    | '/settings'
    | '/settings/pricing'
    | '/settings/cut-styles'
    | '/settings/measurements'
    | '/settings/language'
    | '/settings/analytics'
    | '/notifications'
    | '/auth/login';
  value?: string;
  danger?: boolean;
};

const sections: { heading: string; rows: MenuRow[] }[] = [
  {
    heading: 'Business',
    rows: [
      { label: 'Payments & Dues', icon: WalletCards, route: '/payments' },
      { label: 'Analytics', icon: CalendarDays, route: '/settings/analytics' },
      { label: 'Delivery Calendar', icon: CalendarDays, route: '/(tabs)/calendar' },
    ],
  },
  {
    heading: 'Shop Settings',
    rows: [
      { label: 'Shop Information', icon: Store, route: '/settings/shop' },
      { label: 'Stitching Rates & Prices', icon: Banknote, route: '/settings/pricing', value: 'PKR' },
      { label: 'Design & Cut Styles', icon: Scissors, route: '/settings/cut-styles' },
      { label: 'Measurement Settings', icon: Ruler, route: '/settings/measurements' },
      { label: 'Language', icon: Languages, value: 'English', route: '/settings/language' },
      { label: 'Notifications', icon: Bell, route: '/notifications' },
    ],
  },
  {
    heading: 'More',
    rows: [
      { label: 'Data Backup', icon: DatabaseBackup, value: 'Coming soon' },
      { label: 'Staff Accounts', icon: UserRoundCog, value: 'Coming soon' },
      { label: 'Help & Support', icon: CircleHelp },
      { label: 'Logout', icon: LogOut, danger: true, route: '/auth/login' },
    ],
  },
];

function MenuRowItem({
  label,
  icon: Icon,
  value,
  danger,
  onPress,
}: MenuRow & { onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.row}
      activeOpacity={0.65}
    >
      <View style={[styles.iconBox, danger && { backgroundColor: colors.dangerBg }]}>
        <Icon
          size={20}
          color={danger ? colors.danger : colors.primaryDark}
          strokeWidth={2.2}
        />
      </View>
      <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      {value ? (
        <Text style={styles.rowValue}>{value}</Text>
      ) : (
        <ChevronRight size={17} color={colors.muted} />
      )}
    </TouchableOpacity>
  );
}

export default function More() {
  const router = useRouter();
  const { logout, shop } = useAppStore();

  const initials = shop?.name
    ? shop.name
        .split(' ')
        .map((w) => w[0])
        .filter(Boolean)
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AT';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Screen Title */}
        <Text style={styles.screenTitle}>More</Text>

        {/* Profile Card */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || 'TF'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.shopName}>{shop?.name || 'Ahmed Tailors'}</Text>
            <Text style={styles.shopDetail}>
              {shop?.ownerName || 'Master'} · {shop?.city || shop?.address || 'Lahore'}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/settings/shop')}
          >
            <Settings size={20} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Sections */}
        {sections.map((section) => (
          <View key={section.heading}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <View style={styles.menuGroup}>
              {section.rows.map(({ label, icon, route, value, danger }, i) => (
                <View key={label}>
                  <MenuRowItem
                    label={label}
                    icon={icon}
                    route={route}
                    value={value}
                    danger={danger}
                    onPress={() => {
                      if (danger) {
                        logout();
                        router.replace('/auth/login');
                      } else if (route) {
                        router.push(route);
                      }
                    }}
                  />
                  {i < section.rows.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
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
    paddingBottom: 110,
    gap: 4,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
    marginBottom: 14,
    marginLeft: 4,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#CBD4C0',
    marginBottom: 20,
    ...shadow,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  shopDetail: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 16,
  },
  menuGroup: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow,
  },
  row: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 54 + 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  rowValue: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600',
  },
});
