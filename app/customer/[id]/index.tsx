import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Banknote, CalendarDays, MessageCircle, Phone, Plus, Ruler, ShoppingBag } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderCard } from '@/components/orders/OrderCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { useDataStore } from '@/stores/dataStore';
import { colors, radius, shadow } from '@/theme';

type Tab = 'measurements' | 'orders' | 'payments';

export default function CustomerDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getCustomerById, orders, getMeasurements } = useDataStore();
  const [tab, setTab] = useState<Tab>('measurements');
  const customer = getCustomerById(id);
  const measurements = getMeasurements(id);
  const customerOrders = orders.filter((order) => order.customerId === id);

  if (!customer) return <SafeAreaView style={styles.safe}><AppHeader title="Customer" back /><View style={styles.emptyWrap}><Text style={styles.empty}>Customer not found.</Text></View></SafeAreaView>;

  const openMeasurements = () => router.push({ pathname: '/measurements/new', params: { customerId: customer.id } });
  const openOrder = () => router.push({ pathname: '/order/new', params: { customerId: customer.id } });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Customer Details" back />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{customer.name}</Text>
            <Text style={styles.detail}>{customer.area || 'No area saved'}</Text>
            <Text style={styles.detail}>{customer.phone}</Text>
            <View style={styles.contactRow}>
              <TouchableOpacity style={styles.contactBtn}><Phone size={17} color={colors.white} /><Text style={styles.contactText}>Call</Text></TouchableOpacity>
              <TouchableOpacity style={styles.contactBtn}><MessageCircle size={17} color={colors.white} /><Text style={styles.contactText}>WhatsApp</Text></TouchableOpacity>
            </View>
          </View>
        </View>


        <View style={styles.tabs}>
          {(['measurements', 'orders', 'payments'] as Tab[]).map((item) => <TouchableOpacity key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]}><Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text></TouchableOpacity>)}
        </View>

        {tab === 'measurements' && <View style={styles.section}>
          <View style={styles.sectionTop}><View><Text style={styles.sectionTitle}>Measurements</Text><Text style={styles.sectionSub}>{Object.keys(measurements).length ? 'Saved measurements' : 'No measurements saved yet'}</Text></View><TouchableOpacity onPress={openMeasurements} style={styles.smallAction}><Ruler size={16} color={colors.white} /><Text style={styles.smallActionText}>{Object.keys(measurements).length ? 'Edit' : 'Add'}</Text></TouchableOpacity></View>
          {Object.keys(measurements).length > 0 ? <View style={styles.measureGrid}>{Object.entries(measurements).map(([label, value]) => <View key={label} style={styles.measure}><Text style={styles.measureLabel}>{label}</Text><Text style={styles.measureValue}>{value}<Text style={styles.unit}> in</Text></Text></View>)}</View> : <TouchableOpacity style={styles.emptyAction} onPress={openMeasurements}><Plus size={19} color={colors.primaryDark} /><Text style={styles.emptyActionText}>Add measurements for {customer.name}</Text></TouchableOpacity>}
        </View>}

        {tab === 'orders' && <View style={styles.section}><View style={styles.sectionTop}><View><Text style={styles.sectionTitle}>Orders</Text><Text style={styles.sectionSub}>{customerOrders.length} total orders</Text></View><TouchableOpacity onPress={openOrder} style={styles.smallAction}><Plus size={17} color={colors.white} /><Text style={styles.smallActionText}>Order</Text></TouchableOpacity></View>{customerOrders.length ? customerOrders.map((order) => <OrderCard key={order.id} order={order} />) : <Text style={styles.empty}>No orders yet.</Text>}</View>}

        {tab === 'payments' && <View style={styles.section}><View style={styles.balance}><Banknote size={22} color={customer.balance ? colors.danger : colors.success} /><View><Text style={styles.sectionSub}>Outstanding balance</Text><Text style={[styles.balanceValue, { color: customer.balance ? colors.danger : colors.success }]}>Rs. {customer.balance.toLocaleString()}</Text></View></View>{customerOrders.filter((order) => order.balance > 0).map((order) => <View key={order.id} style={styles.paymentRow}><View><Text style={styles.paymentName}>{order.orderNumber}</Text><Text style={styles.sectionSub}>{order.garment} · {order.deliveryDate}</Text></View><Text style={styles.paymentDue}>Rs. {order.balance.toLocaleString()}</Text></View>)}<TouchableOpacity onPress={() => router.push('/payments')} style={styles.recordPayment}><Banknote size={18} color={colors.white} /><Text style={styles.smallActionText}>Record Payment</Text></TouchableOpacity></View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 16, gap: 14, paddingBottom: 45 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16,}, avatar: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }, initials: { color: colors.primaryDark, fontSize: 20, fontWeight: '900' }, profileInfo: { flex: 1 }, name: { color: colors.text, fontSize: 20, fontWeight: '900' }, detail: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  contactRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 16 }, contactBtn: { flex: 1, height: 38, backgroundColor: colors.primaryDark, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 }, newOrder: { flex: 1.25, height: 42, backgroundColor: colors.primaryStrong, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 }, contactText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border }, tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' }, tabActive: { borderBottomColor: colors.primaryStrong }, tabText: { color: colors.muted, fontSize: 12, fontWeight: '800', textTransform: 'capitalize' }, tabTextActive: { color: colors.primaryDark }, section: { gap: 12 }, sectionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900' }, sectionSub: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', marginTop: 2 }, smallAction: { height: 36, paddingHorizontal: 12, borderRadius: radius.sm, backgroundColor: colors.primaryStrong, flexDirection: 'row', alignItems: 'center', gap: 5 }, smallActionText: { color: colors.white, fontSize: 12, fontWeight: '900' },
  measureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, measure: { width: '48%', padding: 12, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, measureLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' }, measureValue: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 4 }, unit: { color: colors.muted, fontSize: 11 }, emptyAction: { padding: 18, borderRadius: radius.md, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primaryStrong, alignItems: 'center', gap: 6 }, emptyActionText: { color: colors.primaryDark, fontSize: 13, fontWeight: '800' }, empty: { color: colors.muted, textAlign: 'center', paddingVertical: 25 }, emptyWrap: { flex: 1, justifyContent: 'center' },
  balance: { padding: 16, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, balanceValue: { fontSize: 24, fontWeight: '900', marginTop: 3 }, paymentRow: { padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, paymentName: { color: colors.text, fontSize: 14, fontWeight: '900' }, paymentDue: { color: colors.danger, fontSize: 15, fontWeight: '900' }, recordPayment: { height: 46, borderRadius: radius.md, backgroundColor: colors.primaryStrong, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
});
