import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Banknote, Bell, CheckCircle2, CircleCheckBig, Clock3, Inbox } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppCard } from '@/components/ui/AppCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { useDataStore } from '@/stores/dataStore';
import { colors, radius, shadow } from '@/theme';

interface NotificationItem {
  id: string;
  title: string;
  text: string;
  time: string;
  icon: any;
  color: string;
  bg: string;
  route?: string;
}

export default function Notifications() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useDataStore();

  const notifications = useMemo<NotificationItem[]>(() => {
    const list: NotificationItem[] = [];

    // 1. Orders due today (or late)
    const dueTodayOrders = orders.filter((o) =>
      o.deliveryDate?.toLowerCase().includes('today') && o.status !== 'delivered'
    );
    dueTodayOrders.forEach((order) => {
      list.push({
        id: `due-${order.id}`,
        title: `${order.customerName}'s order is due today`,
        text: `${order.quantity} ${order.garment} · Order #${order.orderNumber || order.id}`,
        time: order.deliveryTime ? order.deliveryTime : 'Today',
        icon: Clock3,
        color: colors.primaryDark,
        bg: colors.primaryLight,
        route: `/(tabs)/orders`,
      });
    });

    // 2. Orders marked ready to be delivered / customer notified
    const readyOrders = orders.filter((o) => o.status === 'ready');
    readyOrders.forEach((order) => {
      list.push({
        id: `ready-${order.id}`,
        title: `${order.customerName}'s order is ready`,
        text: `Order #${order.orderNumber || order.id} (${order.garment}) is completed and ready for pickup`,
        time: 'Ready',
        icon: CircleCheckBig,
        color: colors.success,
        bg: colors.successBg,
        route: `/(tabs)/orders`,
      });
    });

    // 3. Orders with outstanding balance
    const unpaidOrders = orders.filter((o) => o.balance > 0);
    unpaidOrders.forEach((order) => {
      list.push({
        id: `balance-${order.id}`,
        title: `Rs. ${order.balance.toLocaleString()} balance payment pending`,
        text: `${order.customerName} · Order #${order.orderNumber || order.id}`,
        time: order.deliveryDate || 'Pending',
        icon: Banknote,
        color: colors.danger,
        bg: colors.dangerBg,
        route: `/payments`,
      });
    });

    return list;
  }, [orders]);

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
            <Text style={styles.heroSub}>
              {notifications.length === 0
                ? 'All caught up! No pending alerts.'
                : `${notifications.length} item${notifications.length > 1 ? 's' : ''} require your attention`}
            </Text>
          </View>
        </View>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Inbox size={48} color={colors.muted} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              You have no pending order alerts, ready pickups, or overdue payments right now.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {notifications.map(({ id, title, text, time, icon: Icon, color, bg, route }) => (
              <TouchableOpacity
                key={id}
                activeOpacity={route ? 0.75 : 1}
                onPress={() => {
                  if (route) router.push(route as any);
                }}
              >
                <AppCard style={styles.card}>
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
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: 6,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
