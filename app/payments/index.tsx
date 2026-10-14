import { useMemo, useState } from 'react';
import { Banknote, CheckCircle2, TrendingUp, X } from 'lucide-react-native';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Order } from '@/types/domain';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { useDataStore } from '@/stores/dataStore';
import { colors, radius, shadow } from '@/theme';

export default function Payments() {
  const insets = useSafeAreaInsets();
  const { orders, updateOrderPayment } = useDataStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [amount, setAmount] = useState('');
  const unpaidOrders = orders.filter((order) => order.balance > 0);
  const pendingBalance = unpaidOrders.reduce((sum, order) => sum + order.balance, 0);
  const collected = useMemo(() => orders.reduce((sum, order) => sum + order.paidAmount, 0), [orders]);

  const openPayment = (order: Order) => {
    setSelectedOrder(order);
    setAmount(String(order.balance));
  };

  const savePayment = () => {
    if (!selectedOrder) return;
    const received = Number(amount);
    if (!Number.isFinite(received) || received <= 0) {
      Alert.alert('Enter a valid amount', 'Please enter the amount received from the customer.');
      return;
    }
    if (received > selectedOrder.balance) {
      Alert.alert('Amount is too high', `The remaining balance is Rs. ${selectedOrder.balance.toLocaleString()}.`);
      return;
    }
    updateOrderPayment(selectedOrder.id, selectedOrder.paidAmount + received);
    setSelectedOrder(null);
    Alert.alert('Payment recorded', `Rs. ${received.toLocaleString()} has been added for ${selectedOrder.customerName}.`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Payments & Dues" back />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 16) + 30 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryRow}>
          <AppCard style={styles.summaryCard}>
            <View style={[styles.iconBox, { backgroundColor: colors.dangerBg }]}><Banknote size={20} color={colors.danger} strokeWidth={2.4} /></View>
            <Text style={styles.summaryLabel}>Pending balance</Text>
            <Text style={styles.dangerAmount}>Rs. {pendingBalance.toLocaleString()}</Text>
          </AppCard>
          <AppCard style={styles.summaryCard}>
            <View style={[styles.iconBox, { backgroundColor: colors.successBg }]}><TrendingUp size={20} color={colors.success} strokeWidth={2.4} /></View>
            <Text style={styles.summaryLabel}>Amount collected</Text>
            <Text style={styles.successAmount}>Rs. {collected.toLocaleString()}</Text>
          </AppCard>
        </View>

        <Text style={styles.sectionTitle}>Orders awaiting payment</Text>
        <View style={styles.ordersList}>
          {unpaidOrders.map((order) => (
            <AppCard key={order.id} style={styles.orderCard}>
              <View style={styles.orderTop}><View><Text style={styles.customerName}>{order.customerName}</Text><Text style={styles.orderNum}>Order #{order.orderNumber} · {order.garment}</Text></View><View style={styles.dueWrap}><Text style={styles.dueLabel}>Due</Text><Text style={styles.dueAmount}>Rs. {order.balance.toLocaleString()}</Text></View></View>
              <View style={styles.actionRow}><View style={{ flex: 1 }}><Text style={styles.totalBreakdown}>Total: Rs. {order.total.toLocaleString()}</Text><Text style={styles.totalBreakdown}>Paid: Rs. {order.paidAmount.toLocaleString()}</Text></View><View style={styles.payBtnWrap}><AppButton label="Record Payment" variant="secondary" onPress={() => openPayment(order)} /></View></View>
            </AppCard>
          ))}
          {unpaidOrders.length === 0 && <View style={styles.empty}><CheckCircle2 size={28} color={colors.success} /><Text style={styles.emptyTitle}>All payments are clear</Text><Text style={styles.emptyText}>There are no outstanding order balances.</Text></View>}
        </View>
      </ScrollView>

      <Modal transparent visible={Boolean(selectedOrder)} animationType="fade" onRequestClose={() => setSelectedOrder(null)}>
        <View style={styles.modalOverlay}><View style={styles.modalCard}>
          <TouchableOpacity style={styles.close} onPress={() => setSelectedOrder(null)}><X size={20} color={colors.textSecondary} /></TouchableOpacity>
          <Text style={styles.modalTitle}>Record payment</Text>
          <Text style={styles.modalSubtitle}>{selectedOrder?.customerName} · Balance Rs. {selectedOrder?.balance.toLocaleString()}</Text>
          <Text style={styles.inputLabel}>Amount received (Rs.)</Text>
          <TextInput autoFocus value={amount} onChangeText={setAmount} keyboardType="number-pad" style={styles.amountInput} placeholder="0" placeholderTextColor={colors.muted} />
          <View style={styles.modalActions}><AppButton label="Cancel" variant="ghost" onPress={() => setSelectedOrder(null)} /><AppButton label="Save Payment" onPress={savePayment} /></View>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 16, gap: 14 }, summaryRow: { flexDirection: 'row', gap: 12 }, summaryCard: { flex: 1, padding: 14, gap: 6 }, iconBox: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }, summaryLabel: { fontSize: 12, fontWeight: '700', color: colors.textSecondary }, dangerAmount: { fontSize: 18, fontWeight: '900', color: colors.danger }, successAmount: { fontSize: 18, fontWeight: '900', color: colors.success }, sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 6, marginLeft: 2 }, ordersList: { gap: 10 }, orderCard: { gap: 12 }, orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, customerName: { fontSize: 16, fontWeight: '800', color: colors.text }, orderNum: { fontSize: 12, color: colors.muted, fontWeight: '600', marginTop: 2 }, dueWrap: { alignItems: 'flex-end' }, dueLabel: { fontSize: 11, fontWeight: '700', color: colors.muted }, dueAmount: { fontSize: 17, fontWeight: '900', color: colors.danger, marginTop: 2 }, actionRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, gap: 10 }, totalBreakdown: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' }, payBtnWrap: { minWidth: 140 }, empty: { alignItems: 'center', gap: 6, paddingVertical: 42 }, emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 17, marginTop: 4 }, emptyText: { color: colors.textSecondary, fontSize: 13 }, modalOverlay: { flex: 1, backgroundColor: 'rgba(28,28,28,0.45)', justifyContent: 'center', padding: 22 }, modalCard: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 20, gap: 10, ...shadow }, close: { alignSelf: 'flex-end', marginBottom: -4 }, modalTitle: { fontSize: 20, color: colors.text, fontWeight: '900' }, modalSubtitle: { fontSize: 13, color: colors.textSecondary }, inputLabel: { marginTop: 8, color: colors.text, fontSize: 13, fontWeight: '800' }, amountInput: { height: 54, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, color: colors.text, fontSize: 20, fontWeight: '900' }, modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
});
