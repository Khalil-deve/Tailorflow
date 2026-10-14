import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Banknote,
  Check,
  Plus,
  RotateCcw,
  Scissors,
  X,
} from 'lucide-react-native';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui/AppButton';
import {
  DEFAULT_GARMENT_PRICING,
  useAppStore,
} from '@/stores/appStore';
import { colors, radius, shadow } from '@/theme';

export default function PricingSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { garmentPricing, setGarmentPrice, resetGarmentPricing } = useAppStore();

  const [prices, setPrices] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    const source = garmentPricing && Object.keys(garmentPricing).length > 0
      ? garmentPricing
      : DEFAULT_GARMENT_PRICING;

    Object.entries(source).forEach(([k, v]) => {
      initial[k] = String(v);
    });
    return initial;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newGarmentName, setNewGarmentName] = useState('');
  const [newGarmentPrice, setNewGarmentPrice] = useState('1500');

  const handlePriceChange = (garment: string, val: string) => {
    setPrices((prev) => ({ ...prev, [garment]: val }));
    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      setGarmentPrice(garment, num);
    }
  };

  const handleAddNewGarment = () => {
    if (!newGarmentName.trim()) {
      Alert.alert('Required', 'Please enter a garment name.');
      return;
    }
    const num = parseInt(newGarmentPrice.replace(/[^0-9]/g, ''), 10) || 1500;
    setGarmentPrice(newGarmentName.trim(), num);
    setPrices((prev) => ({ ...prev, [newGarmentName.trim()]: String(num) }));
    setNewGarmentName('');
    setShowAddModal(false);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Standard Rates',
      'Restore standard tailoring rates (e.g. Shalwar Kameez: Rs. 1,500)?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Defaults',
          style: 'destructive',
          onPress: () => {
            resetGarmentPricing();
            const resetMap: Record<string, string> = {};
            Object.entries(DEFAULT_GARMENT_PRICING).forEach(([k, v]) => {
              resetMap[k] = String(v);
            });
            setPrices(resetMap);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.text} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stitching Rates (سلائی کے ریٹ)</Text>
        <TouchableOpacity
          onPress={handleReset}
          style={styles.resetHeaderBtn}
          activeOpacity={0.7}
        >
          <RotateCcw size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Banknote size={22} color={colors.primaryDark} strokeWidth={2.4} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Default Rates Per Suit</Text>
            <Text style={styles.bannerSubtitle}>
              These standard prices will automatically compute the total bill when adding suits to an order. You can always override or discount the price during order creation.
            </Text>
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeading}>Garments & Stitching Rates</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}
          >
            <Plus size={15} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.addBtnText}>Add Garment</Text>
          </TouchableOpacity>
        </View>

        {/* Rate Cards */}
        <View style={styles.priceList}>
          {Object.entries(prices).map(([garment, price]) => (
            <View key={garment} style={styles.priceCard}>
              <View style={styles.garmentInfo}>
                <View style={styles.garmentIconPill}>
                  <Scissors size={16} color={colors.primaryDark} strokeWidth={2.3} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.garmentName}>{garment}</Text>
                  <Text style={styles.garmentSub}>Stitching per suit</Text>
                </View>
              </View>

              <View style={styles.priceInputWrap}>
                <Text style={styles.currencyPrefix}>Rs.</Text>
                <TextInput
                  style={styles.priceInput}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={(val) => handlePriceChange(garment, val)}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Save confirmation button */}
        <View style={{ marginTop: 12 }}>
          <AppButton
            label="Save Rates ✓"
            onPress={() => {
              Alert.alert('Rates Saved', 'Your standard stitching rates have been updated.');
              router.back();
            }}
          />
        </View>
      </ScrollView>

      {/* Add Custom Garment Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Garment Rate</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Garment Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Sherwani, Safari Suit, Prince Coat"
                placeholderTextColor={colors.muted}
                value={newGarmentName}
                onChangeText={setNewGarmentName}
                autoFocus
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Stitching Rate (Rs.)</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                placeholder="e.g. 2500"
                placeholderTextColor={colors.muted}
                value={newGarmentPrice}
                onChangeText={setNewGarmentPrice}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAddModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleAddNewGarment}
                activeOpacity={0.85}
              >
                <Check size={18} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.modalSaveBtnText}>Add Garment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  resetHeaderBtn: {
    padding: 8,
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#CBD4C0',
    borderRadius: radius.lg,
    padding: 14,
  },
  bannerIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: '#CBD4C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 3,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  listHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryStrong,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    ...shadow,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  priceList: {
    gap: 10,
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  garmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  garmentIconPill: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primaryFaint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD4C0',
  },
  garmentName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  garmentSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 1,
  },
  priceInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAFAF9',
    borderWidth: 1.5,
    borderColor: colors.primaryStrong,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    height: 44,
  },
  currencyPrefix: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  priceInput: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    minWidth: 65,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 20,
    ...shadow,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalInputGroup: {
    marginBottom: 14,
    gap: 6,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  modalInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#FAFAF9',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 1.5,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primaryStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...shadow,
  },
  modalSaveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
});
