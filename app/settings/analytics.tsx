import { BarChart3, CircleDollarSign, ClipboardList, TrendingUp } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppCard } from '@/components/ui/AppCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { useDataStore } from '@/stores/dataStore';
import { colors, radius } from '@/theme';

export default function Analytics() {
  const { customers, orders } = useDataStore();
  const orderValue = orders.reduce((sum, order) => sum + order.total, 0);
  const received = orders.reduce((sum, order) => sum + order.paidAmount, 0);
  const due = orders.reduce((sum, order) => sum + order.balance, 0);
  const active = orders.filter((order) => !['delivered', 'cancelled'].includes(order.status)).length;
  const statusCounts: Array<[string, number]> = [
    ['Received', orders.filter((order) => order.status === 'received').length],
    ['In progress', orders.filter((order) => ['cutting', 'stitching', 'finishing'].includes(order.status)).length],
    ['Ready', orders.filter((order) => order.status === 'ready').length],
    ['Delivered', orders.filter((order) => order.status === 'delivered').length],
  ];
  const maxStatus = Math.max(...statusCounts.map(([, count]) => count), 1);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Analytics" back />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View><Text style={styles.title}>Business overview</Text><Text style={styles.subtitle}>A simple snapshot of your tailoring shop.</Text></View>
        <View style={styles.grid}>
          <Metric icon={CircleDollarSign} label="Order value" value={`Rs. ${orderValue.toLocaleString()}`} />
          <Metric icon={TrendingUp} label="Collected" value={`Rs. ${received.toLocaleString()}`} green />
          <Metric icon={ClipboardList} label="Active orders" value={String(active)} />
          <Metric icon={BarChart3} label="Customers" value={String(customers.length)} />
        </View>
        <AppCard style={styles.dueCard}><Text style={styles.dueLabel}>Outstanding payments</Text><Text style={styles.dueAmount}>Rs. {due.toLocaleString()}</Text><Text style={styles.dueHint}>Follow up on these payments from the Payments screen.</Text></AppCard>
        <AppCard style={styles.statusCard}>
          <Text style={styles.cardTitle}>Order progress</Text>
          {statusCounts.map(([label, count]) => <View key={String(label)} style={styles.statusRow}><Text style={styles.statusLabel}>{label}</Text><View style={styles.track}><View style={[styles.fill, { width: `${(Number(count) / maxStatus) * 100}%` }]} /></View><Text style={styles.statusCount}>{count}</Text></View>)}
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ icon: Icon, label, value, green = false }: { icon: typeof BarChart3; label: string; value: string; green?: boolean }) {
  return <AppCard style={styles.metric}><View style={[styles.metricIcon, green && { backgroundColor: colors.successBg }]}><Icon size={19} color={green ? colors.success : colors.primaryStrong} /></View><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></AppCard>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 16, gap: 14, paddingBottom: 42 }, title: { color: colors.text, fontSize: 22, fontWeight: '900' }, subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 3 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, metric: { width: '48%', padding: 13, gap: 5 }, metricIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight }, metricLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', marginTop: 2 }, metricValue: { color: colors.text, fontSize: 17, fontWeight: '900' }, dueCard: { backgroundColor: colors.primaryFaint, borderColor: colors.primaryLight, gap: 4 }, dueLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' }, dueAmount: { color: colors.primaryDark, fontSize: 25, fontWeight: '900' }, dueHint: { color: colors.textSecondary, fontSize: 12 }, statusCard: { gap: 15 }, cardTitle: { color: colors.text, fontSize: 17, fontWeight: '900' }, statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 }, statusLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', width: 72 }, track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.primaryLight, overflow: 'hidden' }, fill: { height: '100%', borderRadius: 4, backgroundColor: colors.primaryStrong }, statusCount: { color: colors.text, fontSize: 13, fontWeight: '900', width: 20, textAlign: 'right' },
});
