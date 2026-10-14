import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Plus,
  RotateCcw,
  Scissors,
  Sparkles,
  Trash2,
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
  DEFAULT_CUT_SPECIFICATIONS,
  useAppStore,
} from '@/stores/appStore';
import { colors, radius, shadow } from '@/theme';

export default function CutStylesSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    cutSpecifications,
    addCutOption,
    removeCutOption,
    resetCutSpecifications,
  } = useAppStore();

  const categories =
    cutSpecifications && cutSpecifications.length > 0
      ? cutSpecifications
      : DEFAULT_CUT_SPECIFICATIONS;

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [optionNameUrdu, setOptionNameUrdu] = useState('');

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const handleOpenAddModal = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setOptionName('');
    setOptionNameUrdu('');
    setShowAddModal(true);
  };

  const handleSaveOption = () => {
    if (!optionName.trim() || !activeCategoryId) {
      Alert.alert('Required', 'Please enter a name for the style option.');
      return;
    }

    addCutOption(activeCategoryId, {
      name: optionName.trim(),
      nameUrdu: optionNameUrdu.trim() || optionName.trim(),
    });

    setShowAddModal(false);
  };

  const handleDeleteOption = (categoryId: string, optionId: string, name: string) => {
    Alert.alert(
      'Remove Style',
      `Delete "${name}" from this category?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeCutOption(categoryId, optionId),
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Cut Styles',
      'Restore standard cut specifications (Collar, Daman, Pockets, Cuffs, Shalwar)?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Defaults',
          style: 'destructive',
          onPress: () => resetCutSpecifications(),
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
        <Text style={styles.headerTitle}>Cut & Design Styles (ڈیزائن)</Text>
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
            <Scissors size={20} color={colors.primaryDark} strokeWidth={2.4} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Quick-Tap Design Options</Text>
            <Text style={styles.bannerSubtitle}>
              These cut options appear as quick-tap buttons when creating an order. Customizing them speeds up your order entry and prints directly on the cutting chit.
            </Text>
          </View>
        </View>

        {/* Categories List */}
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryUrdu}>{category.titleUrdu}</Text>
              </View>
              <TouchableOpacity
                style={styles.categoryAddBtn}
                onPress={() => handleOpenAddModal(category.id)}
                activeOpacity={0.8}
              >
                <Plus size={14} color={colors.primaryStrong} strokeWidth={2.5} />
                <Text style={styles.categoryAddBtnText}>Add Style</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chipsContainer}>
              {category.options.map((opt) => (
                <View key={opt.id} style={styles.chip}>
                  <Text style={styles.chipText}>{opt.name}</Text>
                  {opt.nameUrdu && opt.nameUrdu !== opt.name ? (
                    <Text style={styles.chipUrdu}>({opt.nameUrdu})</Text>
                  ) : null}
                  <TouchableOpacity
                    style={styles.chipDeleteBtn}
                    onPress={() =>
                      handleDeleteOption(category.id, opt.id, opt.name)
                    }
                    activeOpacity={0.7}
                  >
                    <X size={14} color={colors.muted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Done / Save Button */}
        <View style={{ marginTop: 8 }}>
          <AppButton
            label="Save Cut Styles ✓"
            onPress={() => {
              Alert.alert('Styles Updated', 'Your custom design options are ready in the order form.');
              router.back();
            }}
          />
        </View>
      </ScrollView>

      {/* Add Custom Style Option Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add to {activeCategory?.title}
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Style Name (English / Roman)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Cut Bain, Double Silai, Secret Pocket"
                placeholderTextColor={colors.muted}
                value={optionName}
                onChangeText={setOptionName}
                autoFocus
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Urdu Label (اردو نام - اختیاری)</Text>
              <TextInput
                style={[styles.modalInput, { textAlign: 'right' }]}
                placeholder="مثلاً: کٹ بین، ڈبل سلائی، خفیہ جیب"
                placeholderTextColor={colors.muted}
                value={optionNameUrdu}
                onChangeText={setOptionNameUrdu}
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
                onPress={handleSaveOption}
                activeOpacity={0.85}
              >
                <Check size={18} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.modalSaveBtnText}>Add Style</Text>
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
    width: 36,
    height: 36,
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
  categoryCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    ...shadow,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  categoryUrdu: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 1,
  },
  categoryAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.primaryFaint,
    borderWidth: 1,
    borderColor: '#CBD4C0',
  },
  categoryAddBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 7,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: radius.md,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  chipUrdu: {
    fontSize: 11,
    color: colors.muted,
  },
  chipDeleteBtn: {
    padding: 2,
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
