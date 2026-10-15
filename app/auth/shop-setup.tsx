import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Globe,
  MapPin,
  Lock,
  Phone,
  Store,
  User,
} from 'lucide-react-native';
import {
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/stores/appStore';
import { useDataStore } from '@/stores/dataStore';
import { colors, radius, shadow } from '@/theme';

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'phone-pad';
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  icon,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        {icon}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
      </View>
    </View>
  );
}

export default function ShopSetup() {
  const router = useRouter();
  const { registerTailor, setLocale, locale } = useAppStore();
  const { switchTailor } = useDataStore();

  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [city, setCity] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur'>(locale || 'en');

  const isUrdu = selectedLanguage === 'ur';

  const handleSubmit = () => {
    Keyboard.dismiss();
    setLocale(selectedLanguage);
    const result = registerTailor({
      name: shopName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      address: city.trim(),
      city: city.trim(),
      pin,
    });
    if (!result.account) {
      Alert.alert('Could not register shop', result.error || 'Please check your details and try again.');
      return;
    }
    switchTailor(result.account.id);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Header bar with back button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>
          {isUrdu ? 'دکان سیٹ اپ' : 'Shop Setup'}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Shop Photo Placeholder */}
            <TouchableOpacity style={styles.photo} activeOpacity={0.8}>
              <Store size={36} color={colors.primaryDark} />
              <View style={styles.camera}>
                <Camera size={14} color={colors.white} />
              </View>
            </TouchableOpacity>

            <Text style={styles.title}>
              {isUrdu ? 'اپنی دکان رجسٹر کریں' : 'Set Up Your Shop'}
            </Text>
            <Text style={styles.subtitle}>
              {isUrdu
                ? 'چند معلومات اور آپ کا ڈیجیٹل رجسٹر تیار ہے'
                : 'A few details and you’re ready to start taking orders.'}
            </Text>

            <Field
              label={isUrdu ? 'دکان کا نام' : 'Shop Name'}
              placeholder="e.g. Ahmed Tailors"
              value={shopName}
              onChangeText={setShopName}
              icon={<Store size={18} color={colors.muted} />}
            />

            <Field
              label={isUrdu ? 'مالک کا نام' : 'Owner Name'}
              placeholder="e.g. Ahmed"
              value={ownerName}
              onChangeText={setOwnerName}
              icon={<User size={18} color={colors.muted} />}
            />

            <Field
              label={isUrdu ? 'موبائل نمبر' : 'Phone Number'}
              placeholder="0300 1234567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon={<Phone size={18} color={colors.muted} />}
            />

            <Field
              label={isUrdu ? '4 ہندسوں کا پن' : 'Create a 4-Digit PIN'}
              placeholder="e.g. 1234"
              value={pin}
              onChangeText={(value) => setPin(value.replace(/\D/g, '').slice(0, 4))}
              keyboardType="phone-pad"
              secureTextEntry
              icon={<Lock size={18} color={colors.muted} />}
            />

            <Field
              label={isUrdu ? 'شہر / علاقہ' : 'City / Area'}
              placeholder="e.g. Gulberg, Lahore"
              value={city}
              onChangeText={setCity}
              icon={<MapPin size={18} color={colors.muted} />}
            />

            {/* Language Selection */}
            <View style={styles.field}>
              <Text style={styles.label}>
                {isUrdu ? 'ایپ کی زبان' : 'Language'}
              </Text>
              <View style={styles.languages}>
                <TouchableOpacity
                  onPress={() => setSelectedLanguage('en')}
                  style={[
                    styles.languageOption,
                    selectedLanguage === 'en' && styles.languageOptionActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      selectedLanguage === 'en' &&
                        styles.languageOptionTextActive,
                    ]}
                  >
                    English
                  </Text>
                  {selectedLanguage === 'en' && (
                    <Check
                      size={16}
                      color={colors.primaryDark}
                      strokeWidth={2.5}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedLanguage('ur')}
                  style={[
                    styles.languageOption,
                    selectedLanguage === 'ur' && styles.languageOptionActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      selectedLanguage === 'ur' &&
                        styles.languageOptionTextActive,
                    ]}
                  >
                    اردو
                  </Text>
                  {selectedLanguage === 'ur' && (
                    <Check
                      size={16}
                      color={colors.primaryDark}
                      strokeWidth={2.5}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button inside the form flow */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.actionBtnText}>
                {isUrdu ? 'ٹیلر فلو شروع کریں' : 'Start Using TailorFlow'}
              </Text>
              <ArrowRight size={18} color={colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  content: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: '#CBD4C0',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    ...shadow,
  },
  camera: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  inputWrap: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    ...shadow,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  languages: {
    flexDirection: 'row',
    gap: 12,
  },
  languageOption: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  languageOptionActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryStrong,
  },
  languageOptionText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  languageOptionTextActive: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
  actionBtn: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.primaryStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 10,
    ...shadow,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
