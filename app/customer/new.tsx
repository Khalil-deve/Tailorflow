import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, Printer, Save, Scissors } from 'lucide-react-native';
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
import { AppHeader } from '@/components/ui/AppHeader';
import { colors, radius, shadow } from '@/theme';
import { printCuttingChit } from '@/utils/printChit';

interface CustomerData {
  name: string;
  phone: string;
  area: string;
  garmentType: string;
  notes: string;
  measurements: Record<string, string>;
}

const DEFAULT_FIELDS: Record<string, string[]> = {
  'Kameez Shalwar': [
    'Length',
    'Shoulder',
    'Chest',
    'Sleeves',
    'Collar',
    'Daman',
    'Shalwar Length',
    'Pancha',
    'Waist',
    'Hip',
  ],
  'Pant Shirt': [
    'Shirt Length',
    'Chest',
    'Shoulder',
    'Sleeve',
    'Collar',
    'Pant Length',
    'Waist',
    'Hip',
    'Pancha',
  ],
  'Waistcoat / Suit': [
    'Coat Length',
    'Chest',
    'Waist',
    'Shoulder',
    'Sleeve',
    'Neck',
  ],
};

const DEFAULT_VALUES: Record<string, Record<string, string>> = {
  'Kameez Shalwar': {
    'Length': '40.5',
    'Shoulder': '17.5',
    'Chest': '22.0',
    'Sleeves': '23.5',
    'Collar': '15.5',
    'Daman': '23.0',
    'Shalwar Length': '38.0',
    'Pancha': '8.5',
    'Waist': '21.0',
    'Hip': '23.0',
  },
  'Pant Shirt': {
    'Shirt Length': '30.0',
    'Chest': '40.0',
    'Shoulder': '18.0',
    'Sleeve': '24.5',
    'Collar': '15.5',
    'Pant Length': '40.0',
    'Waist': '34.0',
    'Hip': '38.0',
    'Pancha': '15.0',
  },
  'Waistcoat / Suit': {
    'Coat Length': '28.0',
    'Chest': '40.0',
    'Waist': '36.0',
    'Shoulder': '18.0',
    'Sleeve': '24.5',
    'Neck': '16.0',
  },
};

import {
  DEFAULT_MEASUREMENT_TEMPLATES,
  useAppStore,
} from '@/stores/appStore';
import { useDataStore } from '@/stores/dataStore';

export default function NewCustomer() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; name?: string }>();
  const { measurementTemplates } = useAppStore();
  const { addCustomer } = useDataStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [garmentType, setGarmentType] = useState('Kameez Shalwar');

  const [customer, setCustomer] = useState<CustomerData>({
    name: params.name || '',
    phone: params.phone || '',
    area: '',
    garmentType: 'Kameez Shalwar',
    notes: 'Ban Collar, Round Daman, 1 Front Pocket',
    measurements: { ...DEFAULT_VALUES['Kameez Shalwar'] },
  });

  const handleGarmentChange = (type: string) => {
    setGarmentType(type);
    setCustomer((prev) => ({
      ...prev,
      garmentType: type,
      measurements: { ...(DEFAULT_VALUES[type] || {}) },
    }));
  };

  const handleMeasurementChange = (field: string, val: string) => {
    setCustomer((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, [field]: val },
    }));
  };

  const handlePrintSlip = async () => {
    if (!customer.name.trim() && !customer.phone.trim()) {
      Alert.alert('Required', 'Please enter customer name or phone first.');
      return;
    }
    await printCuttingChit({
      customerName: customer.name || 'Walk-in Customer',
      phone: customer.phone,
      area: customer.area,
      garmentType: customer.garmentType,
      notes: customer.notes,
      measurements: customer.measurements,
    });
  };

  const handleSave = () => {
    if (!customer.name.trim() || !customer.phone.trim()) {
      Alert.alert('Missing Details', 'Please enter at least Customer Name and Phone Number.');
      setStep(1);
      return;
    }

    addCustomer({
      name: customer.name,
      phone: customer.phone,
      area: customer.area,
      measurements: customer.measurements,
    });

    Alert.alert(
      'Saved Successfully ✓',
      'Customer record saved. Would you like to print the Cutting Slip (پَرچی) now?',
      [
        {
          text: 'Skip',
          style: 'cancel',
          onPress: () => router.replace('/(tabs)/customers'),
        },
        {
          text: '🖨️ Print Slip',
          onPress: async () => {
            await handlePrintSlip();
            router.replace('/(tabs)/customers');
          },
        },
      ]
    );
  };

  const templateFields =
    measurementTemplates[garmentType] ||
    DEFAULT_MEASUREMENT_TEMPLATES[garmentType] ||
    DEFAULT_MEASUREMENT_TEMPLATES['Kameez Shalwar'] ||
    [];

  const fields: string[] = templateFields
    .filter((f) => f.enabled)
    .map((f) => f.name);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="New Customer Register" back />

      {/* 2-Step Pill Tabs */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tab, step === 1 && styles.activeTab]}
          onPress={() => setStep(1)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, step === 1 && styles.activeTabText]}>
            1. Customer Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, step === 2 && styles.activeTab]}
          onPress={() => setStep(2)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, step === 2 && styles.activeTabText]}>
            2. Measurements & Slip
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            /* STEP 1: Basic Information */
            <View style={styles.stepCard}>
              <View style={styles.group}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Tariq Mehmood"
                  placeholderTextColor={colors.muted}
                  value={customer.name}
                  onChangeText={(t) => setCustomer((prev) => ({ ...prev, name: t }))}
                />
              </View>

              <View style={styles.group}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0300 1234567"
                  placeholderTextColor={colors.muted}
                  keyboardType="phone-pad"
                  value={customer.phone}
                  onChangeText={(t) => setCustomer((prev) => ({ ...prev, phone: t }))}
                />
              </View>

              <View style={styles.group}>
                <Text style={styles.label}>Address / Area / Colony</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Model Town, Lahore"
                  placeholderTextColor={colors.muted}
                  value={customer.area}
                  onChangeText={(t) => setCustomer((prev) => ({ ...prev, area: t }))}
                />
              </View>

              <View style={styles.buttonStack}>
                <AppButton
                  label="Next: Enter Measurements →"
                  onPress={() => {
                    if (!customer.name.trim() || !customer.phone.trim()) {
                      Alert.alert('Required', 'Please enter Name and Phone before continuing.');
                      return;
                    }
                    setStep(2);
                  }}
                />
              </View>
            </View>
          ) : (
            /* STEP 2: Measurements Grid & Cutting Slip */
            <View style={styles.stepCard}>
              {/* Garment Selector Pills */}
              <Text style={styles.label}>Select Garment</Text>
              <View style={styles.garmentPillsRow}>
                {Object.keys(DEFAULT_FIELDS).map((type) => {
                  const isSelected = garmentType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.garmentPill, isSelected && styles.garmentPillActive]}
                      onPress={() => handleGarmentChange(type)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.garmentPillText,
                          isSelected && styles.garmentPillTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 2-Column Measurement Grid */}
              <Text style={[styles.label, { marginTop: 14 }]}>
                Measurements (Inches)
              </Text>
              <View style={styles.grid}>
                {fields.map((field) => (
                  <View key={field} style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>{field}</Text>
                    <View style={styles.numInputWrap}>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="decimal-pad"
                        placeholder="0.0"
                        placeholderTextColor={colors.muted}
                        value={customer.measurements[field] || ''}
                        onChangeText={(v) => handleMeasurementChange(field, v)}
                      />
                      <Text style={styles.numSuffix}>in</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Tailoring Notes */}
              <View style={[styles.group, { marginTop: 10 }]}>
                <Text style={styles.label}>
                  Tailoring Notes (Collar / Daman / Pockets)
                </Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  multiline
                  placeholder="e.g. Ban collar, round daman, 1 front pocket"
                  placeholderTextColor={colors.muted}
                  value={customer.notes}
                  onChangeText={(t) => setCustomer((prev) => ({ ...prev, notes: t }))}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonStack}>
                <AppButton
                  label="🖨️ Print Cutting Slip (پَرچی)"
                  icon={Printer}
                  onPress={handlePrintSlip}
                />
                <AppButton
                  label="Save Customer ✓"
                  icon={Save}
                  onPress={handleSave}
                />
                <TouchableOpacity
                  onPress={() => setStep(1)}
                  style={styles.backStepBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backStepText}>← Back to Customer Info</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  tabHeader: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    ...shadow,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
  content: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 40,
  },
  stepCard: {
    gap: 14,
  },
  group: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  input: {
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    ...shadow,
  },
  notesInput: {
    height: 70,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  garmentPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  garmentPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow,
  },
  garmentPillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  garmentPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  garmentPillTextActive: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  gridItem: {
    width: '48%',
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  numInputWrap: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    ...shadow,
  },
  numInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  numSuffix: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
  },
  buttonStack: {
    gap: 10,
    marginTop: 10,
  },
  backStepBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  backStepText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textSecondary,
  },
});
