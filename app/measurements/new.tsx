import { Check, Mic, MicOff, Save } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppButton } from '@/components/ui/AppButton';
import { AppHeader } from '@/components/ui/AppHeader';
import { garments } from '@/constants/data';
import {
  DEFAULT_MEASUREMENT_TEMPLATES,
  useAppStore,
} from '@/stores/appStore';
import { colors, radius, shadow } from '@/theme';
import { useDataStore } from '@/stores/dataStore';

export default function Measurements() {
  const router = useRouter();
  const { customerId } = useLocalSearchParams<{ customerId?: string }>();
  const { measurementTemplates } = useAppStore();
  const { getCustomerById, getMeasurements, saveMeasurements } = useDataStore();
  const customer = customerId ? getCustomerById(customerId) : undefined;
  const [selectedGarment, setSelectedGarment] = useState('Shalwar Kameez');
  const [unit, setUnit] = useState<'inch' | 'cm'>('inch');
  const [isListening, setIsListening] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const saved = customerId ? getMeasurements(customerId) : {};
    return Object.keys(saved).length ? saved : {
      'Length': '40', 'Shoulder': '18', 'Chest': '22', 'Sleeves': '24',
      'Collar': '15.5', 'Waist': '21', 'Shalwar Length': '38', 'Pancha': '8',
    };
  });

  const garmentKey =
    selectedGarment === 'Shalwar Kameez' ? 'Kameez Shalwar' : selectedGarment;

  const currentTemplate =
    measurementTemplates[garmentKey] ||
    DEFAULT_MEASUREMENT_TEMPLATES[garmentKey] ||
    DEFAULT_MEASUREMENT_TEMPLATES['Kameez Shalwar'] ||
    [];

  const activeFields = currentTemplate.filter((f) => f.enabled);

  const handleSave = () => {
    if (customerId) saveMeasurements(customerId, values);
    setSavedSuccess(true);
    setTimeout(() => {
      Alert.alert(
        'Measurements Saved',
        `Saved ${selectedGarment} measurements in ${unit}es.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 200);
  };

  const handleToggleVoice = () => {
    setIsListening((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title={customer ? `${customer.name}'s Measurements` : 'Measurements'} back />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Garment Selector */}
        <View style={styles.sectionHeaderWrap}>
          <Text style={styles.sectionTitle}>{customer ? `Measurements for ${customer.name}` : 'What are you measuring?'}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.garmentScroll}
        >
          {garments.map((g) => {
            const isSelected = selectedGarment === g;
            return (
              <TouchableOpacity
                key={g}
                onPress={() => setSelectedGarment(g)}
                style={[styles.garmentChip, isSelected && styles.garmentChipActive]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.garmentText,
                    isSelected && styles.garmentTextActive,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Subhead with Unit Switcher */}
        <View style={styles.unitRow}>
          <Text style={styles.garmentHeading}>{selectedGarment}</Text>
          <View style={styles.unitToggle}>
            <TouchableOpacity
              onPress={() => setUnit('inch')}
              style={[styles.unitBtn, unit === 'inch' && styles.unitBtnActive]}
            >
              <Text
                style={[
                  styles.unitText,
                  unit === 'inch' && styles.unitTextActive,
                ]}
              >
                inch
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUnit('cm')}
              style={[styles.unitBtn, unit === 'cm' && styles.unitBtnActive]}
            >
              <Text
                style={[
                  styles.unitText,
                  unit === 'cm' && styles.unitTextActive,
                ]}
              >
                cm
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2-Column Measurement Grid */}
        <View style={styles.grid}>
          {activeFields.map((field) => (
            <View key={field.id} style={styles.gridCol}>
              <Text style={styles.fieldLabel}>{field.name}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={colors.muted}
                  value={values[field.name] || ''}
                  onChangeText={(val) =>
                    setValues((prev) => ({ ...prev, [field.name]: val }))
                  }
                  style={styles.input}
                />
                <Text style={styles.unitSuffix}>{unit}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Customize Link */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 8,
          }}
          onPress={() => router.push('/settings/measurements')}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primaryDark }}>
            ⚙️ Customize {garmentKey} fields in Settings
          </Text>
        </TouchableOpacity>

        {/* Voice Feedback Banner */}
        {isListening && (
          <View style={styles.voiceBanner}>
            <Mic size={18} color={colors.danger} />
            <Text style={styles.voiceBannerText}>
              Listening... Speak in Urdu or English (e.g., "Kameez 40, Shoulder 18")
            </Text>
          </View>
        )}

        {/* Action Buttons inside the normal form flow */}
        <View style={styles.buttonStack}>
        
          <AppButton
            label={savedSuccess ? 'Saved!' : 'Save Measurements'}
            icon={savedSuccess ? Check : Save}
            variant="primary"
            onPress={handleSave}
          />
        </View>
      </ScrollView>
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
    gap: 16,
    paddingBottom: 40,
  },
  sectionHeaderWrap: {
    marginBottom: -4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.2,
  },
  garmentScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  garmentChip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    ...shadow,
  },
  garmentChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryStrong,
  },
  garmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  garmentTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  unitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
  },
  garmentHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  unitToggle: {
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    flexDirection: 'row',
    padding: 2,
  },
  unitBtn: {
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitBtnActive: {
    backgroundColor: colors.surface,
  },
  unitText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  unitTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  gridCol: {
    width: '48%',
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  inputWrap: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    ...shadow,
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  unitSuffix: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  voiceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  voiceBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
    flex: 1,
  },
  buttonStack: {
    gap: 12,
    marginTop: 6,
  },
});
