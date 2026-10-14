import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Plus,
  RotateCcw,
  Ruler,
  Scissors,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react-native';
import {
  Alert,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch as RNSwitch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui/AppButton';
import { AppHeader } from '@/components/ui/AppHeader';
import {
  DEFAULT_MEASUREMENT_TEMPLATES,
  useAppStore,
} from '@/stores/appStore';
import { colors, radius, shadow } from '@/theme';

const GARMENT_OPTIONS = [
  { key: 'Kameez Shalwar', label: 'Kameez Shalwar', urdu: 'قمیض شلوار' },
  { key: 'Pant Shirt', label: 'Pant Shirt', urdu: 'پینٹ شرٹ' },
  { key: 'Waistcoat / Suit', label: 'Waistcoat / Suit', urdu: 'واسکٹ / سوٹ' },
];

export default function MeasurementSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    measurementTemplates,
    toggleMeasurementField,
    addMeasurementField,
    removeMeasurementField,
    resetMeasurementTemplate,
  } = useAppStore();

  const [activeGarment, setActiveGarment] = useState('Kameez Shalwar');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldNameUrdu, setNewFieldNameUrdu] = useState('');

  const currentFields =
    measurementTemplates[activeGarment] ||
    DEFAULT_MEASUREMENT_TEMPLATES[activeGarment] ||
    [];

  const enabledCount = currentFields.filter((f) => f.enabled).length;

  const handleAddField = () => {
    if (!newFieldName.trim()) {
      Alert.alert('Field Name Required', 'Please enter a name for the measurement point.');
      return;
    }

    addMeasurementField(activeGarment, {
      name: newFieldName.trim(),
      nameUrdu: newFieldNameUrdu.trim() || newFieldName.trim(),
    });

    setNewFieldName('');
    setNewFieldNameUrdu('');
    setShowAddModal(false);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Template',
      `Are you sure you want to restore default measurement fields for ${activeGarment}? Custom added fields will be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Defaults',
          style: 'destructive',
          onPress: () => resetMeasurementTemplate(activeGarment),
        },
      ]
    );
  };

  const handleDeleteCustomField = (fieldId: string, fieldName: string) => {
    Alert.alert(
      'Remove Field',
      `Delete "${fieldName}" from ${activeGarment} template?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeMeasurementField(activeGarment, fieldId),
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
        <Text style={styles.headerTitle}>Measurement Settings</Text>
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
        {/* Info Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ruler size={20} color={colors.primaryDark} strokeWidth={2.4} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Custom Tailor Measurements (ناپ کی سیٹنگز)</Text>
            <Text style={styles.bannerSubtitle}>
              Turn fields on or off according to how your shop takes measurements. Enabled fields will show in Customer and Order forms.
            </Text>
          </View>
        </View>

        {/* Garment Selector Tabs */}
        <Text style={styles.sectionLabel}>Select Garment Type</Text>
        <View style={styles.garmentTabs}>
          {GARMENT_OPTIONS.map((g) => {
            const isSelected = activeGarment === g.key;
            return (
              <TouchableOpacity
                key={g.key}
                onPress={() => setActiveGarment(g.key)}
                style={[styles.garmentTab, isSelected && styles.garmentTabActive]}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.garmentTabTitle,
                    isSelected && styles.garmentTabTitleActive,
                  ]}
                >
                  {g.label}
                </Text>
                <Text
                  style={[
                    styles.garmentTabUrdu,
                    isSelected && styles.garmentTabUrduActive,
                  ]}
                >
                  {g.urdu}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Count & Add Button Row */}
        <View style={styles.countRow}>
          <View>
            <Text style={styles.countTitle}>Active Measurement Points</Text>
            <Text style={styles.countSubtitle}>
              {enabledCount} of {currentFields.length} active for {activeGarment}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}
          >
            <Plus size={16} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.addBtnText}>Add Field</Text>
          </TouchableOpacity>
        </View>

        {/* Fields List */}
        <View style={styles.fieldsContainer}>
          {currentFields.map((field, idx) => (
            <View
              key={field.id}
              style={[
                styles.fieldCard,
                !field.enabled && styles.fieldCardDisabled,
              ]}
            >
              <View style={styles.fieldLeft}>
                <View
                  style={[
                    styles.fieldNumberPill,
                    field.enabled
                      ? styles.fieldNumberPillActive
                      : styles.fieldNumberPillDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.fieldNumberText,
                      field.enabled && styles.fieldNumberTextActive,
                    ]}
                  >
                    {idx + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.fieldNameRow}>
                    <Text
                      style={[
                        styles.fieldName,
                        !field.enabled && styles.fieldNameDisabled,
                      ]}
                    >
                      {field.name}
                    </Text>
                    {field.isCustom && (
                      <View style={styles.customBadge}>
                        <Text style={styles.customBadgeText}>Custom</Text>
                      </View>
                    )}
                  </View>
                  {field.nameUrdu ? (
                    <Text style={styles.fieldNameUrdu}>{field.nameUrdu}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.fieldRight}>
                {field.isCustom && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() =>
                      handleDeleteCustomField(field.id, field.name)
                    }
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color={colors.danger} />
                  </TouchableOpacity>
                )}
                <RNSwitch
                  value={field.enabled}
                  onValueChange={() =>
                    toggleMeasurementField(activeGarment, field.id)
                  }
                  trackColor={{ false: '#E2E8F0', true: '#CBD4C0' }}
                  thumbColor={field.enabled ? colors.primaryStrong : '#94A3B8'}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Quick Reset Note at Bottom */}
        <TouchableOpacity
          style={styles.resetFooterRow}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <RotateCcw size={15} color={colors.muted} />
          <Text style={styles.resetFooterText}>
            Restore default {activeGarment} measurement list
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Custom Field Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleWrap}>
                <Scissors size={20} color={colors.primaryDark} strokeWidth={2.4} />
                <Text style={styles.modalTitle}>Add Custom Measurement</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalGarmentTag}>
              Adding to: <Text style={{ fontWeight: '800' }}>{activeGarment}</Text>
            </Text>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Field Name (English / Roman)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Asan (Crotch), Kaf (Cuff), Teera"
                placeholderTextColor={colors.muted}
                value={newFieldName}
                onChangeText={setNewFieldName}
                autoFocus
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Urdu Label (اردو نام - اختیاری)</Text>
              <TextInput
                style={[styles.modalInput, { textAlign: 'right' }]}
                placeholder="مثلاً: آسن، کف، ران"
                placeholderTextColor={colors.muted}
                value={newFieldNameUrdu}
                onChangeText={setNewFieldNameUrdu}
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
                onPress={handleAddField}
                activeOpacity={0.85}
              >
                <Check size={18} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.modalSaveBtnText}>Save Field</Text>
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  garmentTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  garmentTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  garmentTabActive: {
    borderColor: colors.primaryStrong,
    backgroundColor: colors.primaryFaint,
  },
  garmentTabTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  garmentTabTitleActive: {
    color: colors.primaryDark,
  },
  garmentTabUrdu: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  garmentTabUrduActive: {
    color: colors.primaryStrong,
    fontWeight: '700',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  countTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  countSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryStrong,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    ...shadow,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
  },
  fieldsContainer: {
    gap: 8,
  },
  fieldCard: {
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
  fieldCardDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.7,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fieldNumberPill: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldNumberPillActive: {
    backgroundColor: colors.primaryLight,
  },
  fieldNumberPillDisabled: {
    backgroundColor: '#E2E8F0',
  },
  fieldNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
  },
  fieldNumberTextActive: {
    color: colors.primaryDark,
  },
  fieldNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  fieldNameDisabled: {
    color: colors.muted,
  },
  customBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: radius.sm,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
  },
  fieldNameUrdu: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  fieldRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteBtn: {
    padding: 6,
  },
  resetFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 4,
  },
  resetFooterText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
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
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 20,
    ...shadow,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalHeaderTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalGarmentTag: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
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
