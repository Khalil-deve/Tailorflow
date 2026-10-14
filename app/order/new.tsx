import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Banknote,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Printer,
  Ruler,
  Scissors,
  User,
} from 'lucide-react-native';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import {
  DEFAULT_CUT_SPECIFICATIONS,
  DEFAULT_GARMENT_PRICING,
  useAppStore,
} from '@/stores/appStore';
import { useDataStore } from '@/stores/dataStore';
import { colors, radius, shadow } from '@/theme';
import { printCuttingChit } from '@/utils/printChit';

export default function NewOrder() {
  const router = useRouter();
  const { customerId } = useLocalSearchParams<{ customerId?: string }>();
  const { garmentPricing, cutSpecifications } = useAppStore();
  const { customers, addOrder, getMeasurements } = useDataStore();

  const pricingSource =
    garmentPricing && Object.keys(garmentPricing).length > 0
      ? garmentPricing
      : DEFAULT_GARMENT_PRICING;

  const activeCutCategories =
    cutSpecifications && cutSpecifications.length > 0
      ? cutSpecifications
      : DEFAULT_CUT_SPECIFICATIONS;

  // Selected customer & search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers.find((customer) => customer.id === customerId)?.id || customers[0]?.id || '1'
  );

  // Garment & Quantity
  const [garment, setGarment] = useState('Shalwar Kameez');
  const [quantity, setQuantity] = useState(1);

  // Dynamic Cut Specifications State
  const [selectedCutSpecs, setSelectedCutSpecs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    activeCutCategories.forEach((cat) => {
      if (cat.options[0]) {
        initial[cat.id] = cat.options[0].name;
      }
    });
    return initial;
  });

  const [notes, setNotes] = useState('Double Stitching, Round Daman');

  // Auto-calculated pricing based on settings
  const unitRate = pricingSource[garment] ?? 1500;
  const [total, setTotal] = useState(String(unitRate * 1));
  const [advance, setAdvance] = useState('1000');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'JazzCash' | 'Easypaisa'>('Cash');

  // Delivery timing
  const [deliveryOption, setDeliveryOption] = useState('3 Days');

  // When garment or quantity changes, recalculate standard total
  const handleGarmentChange = (newGarment: string) => {
    setGarment(newGarment);
    const rate = pricingSource[newGarment] ?? 1500;
    setTotal(String(rate * quantity));
  };

  const handleQuantityChange = (newQty: number) => {
    const qty = Math.max(1, newQty);
    setQuantity(qty);
    const rate = pricingSource[garment] ?? 1500;
    setTotal(String(rate * qty));
  };

  const selectedCustomer = useMemo(
    () =>
      customers.find((c) => c.id === selectedCustomerId) ||
      customers[0] || {
        id: '1',
        name: 'Walk-in Customer',
        phone: '0300 1234567',
        initials: 'WC',
        orderCount: 1,
        balance: 0,
      },
    [selectedCustomerId]
  );

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers.slice(0, 4);
    return customers.filter((c) =>
      `${c.name} ${c.phone}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const remainingBalance = Math.max(
    0,
    Number(total || 0) - Number(advance || 0)
  );

  const handleCreateOrder = (shouldPrintSlip = false) => {
    if (!selectedCustomer) {
      Alert.alert('Customer Required', 'Please select a customer for this order.');
      return;
    }

    const cutSpecsSummary = Object.entries(selectedCutSpecs)
      .map(([catId, optVal]) => {
        const cat = activeCutCategories.find((c) => c.id === catId);
        return `${cat?.title || catId}: ${optVal}`;
      })
      .join(' · ');

    const combinedNotes = [cutSpecsSummary, notes].filter(Boolean).join(' | ');

    const createdOrder = addOrder({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      garment,
      quantity,
      total: Number(total) || 1500,
      paidAmount: Number(advance) || 0,
      deliveryDate: deliveryOption,
      deliveryTime: '5:00 PM',
      status: 'received',
    });

    if (shouldPrintSlip) {
      const savedNaap = getMeasurements(selectedCustomer.id);
      const chitMeasurements =
        Object.keys(savedNaap).length > 0
          ? savedNaap
          : {
            'Kameez Length': '40.5',
            'Shoulder': '17.5',
            'Chest': '22.0',
            'Sleeves': '23.5',
            'Collar': '15.5',
            'Daman': '23.0',
            'Shalwar Length': '38.0',
            'Pancha': '8.5',
          };

      printCuttingChit({
        orderNumber: createdOrder.orderNumber,
        customerName: selectedCustomer.name,
        phone: selectedCustomer.phone,
        area: selectedCustomer.area || 'Lahore',
        garmentType: `${quantity} × ${garment}`,
        deliveryDate: `${deliveryOption} (5:00 PM)`,
        notes: combinedNotes,
        measurements: chitMeasurements,
      });
    }

    Alert.alert(
      'Order Created Successfully ✓',
      `Order #${createdOrder.orderNumber} recorded for ${selectedCustomer.name} (${quantity} × ${garment}). Total: Rs. ${Number(total).toLocaleString()}`,
      [
        {
          text: 'View Order Details',
          onPress: () => router.replace(`/order/${createdOrder.id}` as any),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Header without any wizard progress bar */}
      <AppHeader title="Create New Order" back />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION 1: CUSTOMER SELECTION */}
          

          {/* SECTION 2: GARMENT, RATE & QUANTITY */}
          {/* <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>2. Garment & Rate</Text>
            <TouchableOpacity
              onPress={() => router.push('/settings/pricing')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>⚙️ Edit Rates</Text>
            </TouchableOpacity>
          </View> */}

          {/* Garment Selector with shop pricing */}
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.garmentRateScroll}
          >
            {Object.entries(pricingSource).map(([gName, rate]) => {
              const isSelected = garment === gName;
              return (
                <TouchableOpacity
                  key={gName}
                  onPress={() => handleGarmentChange(gName)}
                  style={[
                    styles.garmentRateChip,
                    isSelected && styles.garmentRateChipActive,
                  ]}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.garmentRateTitle,
                      isSelected && styles.garmentRateTitleActive,
                    ]}
                  >
                    {gName}
                  </Text>
                  <Text
                    style={[
                      styles.garmentRatePrice,
                      isSelected && styles.garmentRatePriceActive,
                    ]}
                  >
                    Rs. {rate.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView> */}

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>2. Edit measurements</Text>
            <TouchableOpacity
              onPress={() => router.push('/settings/measurements')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>⚙️ Edit Measurements</Text>
            </TouchableOpacity>
          </View>
          <AppCard style={styles.measureCard}>

            <View style={styles.measureTop}>
              <View style={styles.measureIconWrap}>
                <Ruler size={22} color={colors.primaryDark} strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.measureGarmentTitle}>{garment}</Text>
                <Text style={styles.measureSubtitle}>
                  Rate: Rs. {unitRate.toLocaleString()}/suit · Measurements for {selectedCustomer.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/measurements/new')}
                style={styles.editMeasureBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.editMeasureBtnText}>Edit Naap</Text>
              </TouchableOpacity>
            </View>

            {/* Quantity Counter */}
            <View style={styles.quantityRow}>
              <View>
                <Text style={styles.quantityLabel}>Number of Suits (تعداد)</Text>
                <Text style={styles.quantityCalcSub}>
                  {quantity} × Rs. {unitRate} = Rs. {(quantity * unitRate).toLocaleString()}
                </Text>
              </View>
              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(quantity - 1)}
                  style={styles.counterBtn}
                  activeOpacity={0.7}
                >
                  <Minus size={18} color={colors.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.counterVal}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(quantity + 1)}
                  style={styles.counterBtn}
                  activeOpacity={0.7}
                >
                  <Plus size={18} color={colors.text} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>
          </AppCard>

          {/* SECTION 3: DESIGN & CUT SPECIFICATIONS */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>3. Design & Cut Specifications</Text>
            <TouchableOpacity
              onPress={() => router.push('/settings/cut-styles')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>⚙️ Edit Styles</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.specCard}>
            {activeCutCategories.map((category) => (
              <View key={category.id} style={styles.specRow}>
                <View style={styles.specCatHeader}>
                  <Text style={styles.specLabel}>{category.title}:</Text>
                  {category.titleUrdu ? (
                    <Text style={styles.specLabelUrdu}>({category.titleUrdu})</Text>
                  ) : null}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipGroup}
                >
                  {category.options.map((opt) => {
                    const isSelected = selectedCutSpecs[category.id] === opt.name;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        onPress={() =>
                          setSelectedCutSpecs((prev) => ({
                            ...prev,
                            [category.id]: opt.name,
                          }))
                        }
                        style={[
                          styles.specChip,
                          isSelected && styles.specChipActive,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.specChipText,
                            isSelected && styles.specChipTextActive,
                          ]}
                        >
                          {opt.name}
                        </Text>
                        {opt.nameUrdu && opt.nameUrdu !== opt.name ? (
                          <Text
                            style={[
                              styles.specChipUrdu,
                              isSelected && styles.specChipUrduActive,
                            ]}
                          >
                            {opt.nameUrdu}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ))}

            {/* Custom Notes */}
            <View style={{ gap: 6, marginTop: 6 }}>
              <Text style={styles.specLabel}>Cut / Stitching Notes:</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g. Open cuffs, round daman, secret pocket, matching thread"
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          {/* SECTION 4: PAYMENT & DUES */}
          {/* <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>4. Payment & Dues</Text>
          </View>
{/* 
          <AppCard style={styles.paymentCard}>
            <View style={styles.moneyFieldsRow}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.specLabel}>Total Price (Rs.)</Text>
                <TextInput
                  style={styles.moneyInput}
                  value={total}
                  onChangeText={setTotal}
                  keyboardType="number-pad"
                />
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.specLabel}>Advance Received (Rs.)</Text>
                <TextInput
                  style={styles.moneyInput}
                  value={advance}
                  onChangeText={setAdvance}
                  keyboardType="number-pad"
                />
              </View>
            </View> */}

          {/* Remaining Banner */}
          {/* <View style={styles.remainingBanner}>
              <Text style={styles.remainingLabel}>Remaining Balance Due:</Text>
              <Text style={styles.remainingValue}>
                Rs. {remainingBalance.toLocaleString()}
              </Text>
            </View> */}

          {/* Payment Method */}
          {/* <View style={styles.specRow}>
              <Text style={styles.specLabel}>Paid Via:</Text>
              <View style={styles.chipGroup}>
                {(['Cash', 'JazzCash', 'Easypaisa'] as const).map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setPaymentMethod(m)}
                    style={[
                      styles.specChip,
                      paymentMethod === m && styles.specChipActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.specChipText,
                        paymentMethod === m && styles.specChipTextActive,
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </AppCard> */}

          {/* SECTION 5: DELIVERY DATE */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>4. Promised Delivery</Text>
          </View>

          <View style={styles.deliveryCard}>
            <View style={styles.chipGroup}>
              {['Tomorrow', '3 Days', '1 Week'].map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setDeliveryOption(d)}
                  style={[
                    styles.deliveryChip,
                    deliveryOption === d && styles.deliveryChipActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.deliveryChipText,
                      deliveryOption === d && styles.deliveryChipTextActive,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ACTION BUTTONS (Solid Amber with Bold White Text) */}
          <View style={styles.actionButtons}>
            <AppButton
              label="🖨️ Create Order & Print Slip (پَرچی)"
              onPress={() => handleCreateOrder(true)}
            />
            <AppButton
              label="Create Order ✓"
              onPress={() => handleCreateOrder(false)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.2,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  customerGrid: {
    gap: 8,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow,
  },
  customerCardActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryStrong,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  customerPhone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
  },
  checkPill: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  measureCard: {
    padding: 14,
    gap: 12,
  },
  measureTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  measureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  measureGarmentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  measureSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  editMeasureBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#CBD4C0',
  },
  editMeasureBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  quantityCalcSub: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryStrong,
    marginTop: 2,
  },
  garmentRateScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  garmentRateChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    ...shadow,
  },
  garmentRateChipActive: {
    borderColor: colors.primaryStrong,
    backgroundColor: colors.primaryFaint,
  },
  garmentRateTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  garmentRateTitleActive: {
    color: colors.primaryDark,
  },
  garmentRatePrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryStrong,
    marginTop: 2,
  },
  garmentRatePriceActive: {
    color: colors.primaryDark,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  counterVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  specCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 14,
    ...shadow,
  },
  specRow: {
    gap: 8,
  },
  specCatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  specLabelUrdu: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },
  chipGroup: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  specChipActive: {
    backgroundColor: colors.primaryFaint,
    borderColor: colors.primaryStrong,
  },
  specChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  specChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
  specChipUrdu: {
    fontSize: 11,
    color: colors.muted,
  },
  specChipUrduActive: {
    color: colors.primaryStrong,
    fontWeight: '700',
  },
  notesInput: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
  },
  paymentCard: {
    padding: 14,
    gap: 12,
  },
  moneyFieldsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  moneyInput: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  remainingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#CBD4C0',
  },
  remainingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  remainingValue: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.danger,
  },
  deliveryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...shadow,
  },
  deliveryChip: {
    flex: 1,
    minWidth: 70,
    paddingVertical: 9,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  deliveryChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryStrong,
  },
  deliveryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  deliveryChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
  actionButtons: {
    gap: 10,
    marginTop: 10,
  },
});
