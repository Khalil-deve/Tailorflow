import React from 'react';
import { useRouter } from 'expo-router';
import { Banknote, Bell, ClipboardList, Plus, Ruler, UsersRound } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/stores/appStore';
import { useDataStore } from '@/stores/dataStore';
import { colors, radius, shadow } from '@/theme';

const shortcuts = [
  { label: 'Customers', icon: UsersRound, route: '/(tabs)/customers' },
  { label: 'Orders', icon: ClipboardList, route: '/(tabs)/orders' },
  { label: 'Payments', icon: Banknote, route: '/payments' },
  { label: 'Measurements', icon: Ruler, route: '/measurements/new' },
] as const;

export default function Home() {
  const router = useRouter();
  const shop = useAppStore((state) => state.shop);
  const { customers, orders } = useDataStore();
  const due = orders.reduce((total, order) => total + order.balance, 0);
  const unpaid = orders.filter((order) => order.balance > 0).length;

  const displayName = shop?.name || shop?.ownerName || 'TailorFlow';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.shop}>{displayName}</Text>
            <Text style={styles.welcome}>Your shop at a glance</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.bell}>
            <Bell size={21} color={colors.primaryDark} />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>

        <View style={styles.summary}>
          <Text style={styles.month}>THIS MONTH</Text>
          <Text style={styles.summaryTitle}>Keep your tailoring work simple.</Text>
          <View style={styles.summaryStats}>
            <View>
              <Text style={styles.statValue}>Rs. {due.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Unpaid amount</Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={styles.statValue}>{unpaid} / {orders.length}</Text>
              <Text style={styles.statLabel}>Unpaid orders</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Manage your shop</Text>
        <View style={styles.grid}>
          {shortcuts.map(({ label, icon: Icon, route }) => (
            <TouchableOpacity key={label} onPress={() => router.push(route)} style={styles.tile} activeOpacity={0.8}>
              <View style={styles.tileIcon}><Icon size={26} color={colors.white} strokeWidth={2.2} /></View>
              <Text style={styles.tileTitle}>{label}</Text> 
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.primaryActions}>
          <TouchableOpacity style={styles.primaryAction} onPress={() => router.push('/customer/new')} activeOpacity={0.85}>
            <Plus size={21} color={colors.white} strokeWidth={2.8} />
            <Text style={styles.primaryActionText}>Add Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryAction} onPress={() => router.push('/order/new')} activeOpacity={0.85}>
            <Plus size={21} color={colors.white} strokeWidth={2.8} />
            <Text style={styles.primaryActionText}>Add Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shop: { color: colors.text, fontSize: 23, fontWeight: '900', letterSpacing: -0.4 },
  welcome: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginTop: 3 },
  bell: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, ...shadow },
  dot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger, right: 10, top: 9 },
  summary: { backgroundColor: colors.primary, borderRadius: radius.xl, padding: 20, gap: 10, ...shadow },
  month: { color: colors.primaryLight, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  summaryTitle: { color: colors.white, fontSize: 20, fontWeight: '900', lineHeight: 25, maxWidth: 250 },
  summaryStats: { flexDirection: 'row', marginTop: 7, gap: 18, alignItems: 'center' },
  statValue: { color: colors.white, fontSize: 18, fontWeight: '900' },
  statLabel: { color: colors.primaryLight, fontSize: 12, fontWeight: '600', marginTop: 2 },
  divider: { height: 38, width: 1, backgroundColor: '#AEB9A0' },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap',  gap: 12 },
  tile: { width: '48%', height: 110, padding: 15, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', ...shadow },
  tileIcon: { height: 44, width: 44, borderRadius: 14, backgroundColor: colors.primaryStrong, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileTitle: { color: colors.text, fontSize: 15, fontWeight: '900', textAlign: 'center' },
  tileText: { color: colors.textSecondary, fontSize: 11, lineHeight: 15, marginTop: 3 },
  primaryActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  primaryAction: { flex: 1, height: 54, borderRadius: radius.md, backgroundColor: colors.primaryStrong, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, ...shadow },
  primaryActionText: { color: colors.white, fontSize: 16, fontWeight: '900' },
});
