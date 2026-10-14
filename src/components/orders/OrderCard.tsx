import { useRouter } from 'expo-router';
import { CalendarDays, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Order } from '@/types/domain';
import { AppCard } from '@/components/ui/AppCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors } from '@/theme';

export function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(`/order/${order.id}`)}>
      <AppCard>
        {/* Top: order number + status */}
        <View style={styles.top}>
          <Text style={styles.number}>#{order.orderNumber}</Text>
          <StatusBadge status={order.status} />
        </View>

        {/* Customer + garment */}
        <Text style={styles.name}>{order.customerName}</Text>
        <Text style={styles.garment}>
          {order.quantity} × {order.garment}
        </Text>

        {/* Bottom: date + balance */}
        <View style={styles.bottom}>
          <View style={styles.dateRow}>
            <CalendarDays size={14} color={colors.primaryDark} strokeWidth={2.2} />
            <Text style={styles.dateText}>
              {order.deliveryDate} · {order.deliveryTime}
            </Text>
          </View>
          <View style={styles.balanceRow}>
            <View>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text
                style={[
                  styles.balanceAmount,
                  order.balance > 0 && { color: colors.danger },
                ]}
              >
                Rs. {order.balance.toLocaleString()}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.muted} />
          </View>
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  number: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  garment: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
  },
  balanceAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
  },
});
