import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Banknote,
  Check,
  Circle,
  MessageCircle,
  Phone,
  Ruler,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { orders as fallbackOrders } from '@/constants/data';
import { useDataStore } from '@/stores/dataStore';
import type { OrderStatus } from '@/types/domain';
import { colors, radius, shadow } from '@/theme';

const STAGES: OrderStatus[] = [
  'received',
  'cutting',
  'stitching',
  'finishing',
  'ready',
  'delivered',
];

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById, updateOrderStatus, getMeasurements } = useDataStore();

  const currentOrder = getOrderById(id || '') ?? fallbackOrders.find((o) => o.id === id) ?? fallbackOrders[0]!;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(currentOrder.status);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const currentStageIndex = STAGES.indexOf(currentStatus);

  const handleAdvanceStatus = () => {
    const nextIndex = (currentStageIndex + 1) % STAGES.length;
    const nextStatus: OrderStatus = STAGES[nextIndex] ?? 'received';
    setCurrentStatus(nextStatus);
    updateOrderStatus(currentOrder.id, nextStatus);
    const prettyName = nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1);
    setStatusMessage(`Status updated to: ${prettyName}`);
  };

  const handleSelectStage = (stage: OrderStatus) => {
    setCurrentStatus(stage);
    updateOrderStatus(currentOrder.id, stage);
    const prettyName = stage.charAt(0).toUpperCase() + stage.slice(1);
    setStatusMessage(`Status updated to: ${prettyName}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title={`Order #${currentOrder.orderNumber}`} back />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Pill Center */}
        <View style={styles.statusWrap}>
          <StatusBadge status={currentStatus} />
          {!!statusMessage && (
            <Text style={styles.toastNote}>{statusMessage}</Text>
          )}
        </View>

        {/* Customer Card */}
        <AppCard>
          <Text style={styles.overline}>CUSTOMER</Text>
          <Text style={styles.cardTitle}>{currentOrder.customerName}</Text>
          <Text style={styles.subText}>0300 1234567</Text>
        </AppCard>

        {/* Garment Details Card with working measurement button */}
        <AppCard>
          <Text style={styles.overline}>GARMENTS</Text>
          <Text style={styles.cardTitle}>
            {currentOrder.quantity} × {currentOrder.garment}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/measurements/new')}
            style={styles.linkTouch}
            activeOpacity={0.7}
          >
            <Ruler size={16} color={colors.primaryDark} strokeWidth={2.4} />
            <Text style={styles.linkText}>View & Edit Measurements →</Text>
          </TouchableOpacity>
        </AppCard>

        {/* Payment Summary Card */}
        <AppCard>
          <Text style={styles.sectionHeader}>Payment Details</Text>
          <Row
            label="Total Amount"
            value={`Rs. ${currentOrder.total.toLocaleString()}`}
          />
          <Row
            label="Paid Advance"
            value={`Rs. ${currentOrder.paidAmount.toLocaleString()}`}
          />
          <View style={styles.divider} />
          <Row
            label="Remaining Balance"
            value={`Rs. ${currentOrder.balance.toLocaleString()}`}
            strong={currentOrder.balance > 0}
          />
        </AppCard>

        {/* Delivery Timeline Card */}
        <AppCard>
          <Text style={styles.overline}>PROMISED DELIVERY</Text>
          <Text style={styles.deliveryMain}>{currentOrder.deliveryDate}</Text>
          <Text style={styles.subText}>{currentOrder.deliveryTime}</Text>
        </AppCard>

       

        {/* Primary Action: Update Status Button */}
        <View style={styles.buttonStack}>
          <AppButton
            label={
              currentStageIndex < STAGES.length - 1
                ? `Move to Next Stage (${(STAGES[currentStageIndex + 1] ?? '').toUpperCase()})`
                : 'Reset to Received'
            }
            variant="primary"
            onPress={handleAdvanceStatus}
          />

          {/* Action Buttons with solid primary amber and white text */}
          <View style={styles.actionRow}>
            <View style={styles.actionCol}>
              <AppButton
                label="Measurements"
                icon={Ruler}
                variant="primary"
                onPress={() => router.push('/measurements/new')}
              />
            </View>
            <View style={styles.actionCol}>
              <AppButton
                label="Payment"
                icon={Banknote}
                variant="primary"
                onPress={() => router.push('/payments')}
              />
            </View>
          </View>

          <View style={styles.actionRow}>
            <View style={styles.actionCol}>
              <AppButton
                label="WhatsApp"
                icon={MessageCircle}
                variant="ghost"
                onPress={() => {
                  Alert.alert('WhatsApp', 'Opening chat with customer...');
                }}
              />
            </View>
            <View style={styles.actionCol}>
              <AppButton
                label="Call Customer"
                icon={Phone}
                variant="ghost"
                onPress={() => {
                  Alert.alert('Phone Call', 'Calling 0300 1234567...');
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowVal, strong && styles.rowStrong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 50,
  },
  statusWrap: {
    alignItems: 'center',
    marginVertical: 4,
    gap: 4,
  },
  toastNote: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
    backgroundColor: colors.successBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: 4,
  },
  overline: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  subText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  linkTouch: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  stepperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepperSub: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  rowVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  rowStrong: {
    color: colors.danger,
    fontWeight: '800',
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 6,
  },
  deliveryMain: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    marginTop: 4,
  },
  progressSection: {
    marginTop: 4,
  },
  stepperCard: {
    paddingVertical: 10,
    gap: 6,
  },
  stageRow: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stageIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageDone: {
    backgroundColor: colors.success,
  },
  stageText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  stageCurrentText: {
    color: colors.text,
    fontWeight: '800',
  },
  currentBadge: {
    backgroundColor: colors.successBg,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.success,
  },
  buttonStack: {
    gap: 10,
    marginTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCol: {
    flex: 1,
  },
});
