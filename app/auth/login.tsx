import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, KeyRound, Lock, Phone, Scissors } from 'lucide-react-native';
import {
  Keyboard,
  KeyboardAvoidingView,
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
import { colors, radius, shadow } from '@/theme';

export default function Login() {
  const router = useRouter();
  const { login, finishOnboarding } = useAppStore();
  const [authMode, setAuthMode] = useState<'phone' | 'pin'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');

  const handlePhoneSubmit = () => {
    Keyboard.dismiss();
    login();
    finishOnboarding();
    router.replace('/(tabs)');
  };

  const handlePinSubmit = () => {
    Keyboard.dismiss();
    login();
    finishOnboarding();
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
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>
          {authMode === 'phone' ? 'Tailor Login' : 'Quick Access PIN'}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.icon}>
                {authMode === 'phone' ? (
                  <Scissors size={36} color={colors.white} strokeWidth={2.4} />
                ) : (
                  <KeyRound size={34} color={colors.white} strokeWidth={2.4} />
                )}
              </View>

              <Text style={styles.brand}>TailorFlow</Text>
              <Text style={styles.title}>
                {authMode === 'phone' ? 'Welcome Back' : 'Enter Shop PIN'}
              </Text>
              <Text style={styles.help}>
                {authMode === 'phone'
                  ? 'Enter your mobile number to open your tailor register'
                  : 'Enter your 4-digit master PIN for instant entry'}
              </Text>

              {authMode === 'phone' ? (
                <View style={styles.form}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputWrap}>
                    <Text style={styles.code}>+92</Text>
                    <View style={styles.line} />
                    <Phone size={18} color={colors.muted} />
                    <TextInput
                      keyboardType="phone-pad"
                      placeholder="3XX XXXXXXX"
                      placeholderTextColor={colors.muted}
                      style={styles.input}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      maxLength={11}
                      returnKeyType="done"
                      onSubmitEditing={handlePhoneSubmit}
                    />
                  </View>

                  {/* Submit Button right after input */}
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      phoneNumber.trim().length < 7 && styles.btnDisabled,
                    ]}
                    onPress={handlePhoneSubmit}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionBtnText}>Continue</Text>
                    <ArrowRight size={18} color={colors.white} strokeWidth={2.5} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.switchModeBtn}
                    onPress={() => {
                      Keyboard.dismiss();
                      setAuthMode('pin');
                    }}
                    activeOpacity={0.7}
                  >
                    <KeyRound size={16} color={colors.primaryDark} strokeWidth={2.2} />
                    <Text style={styles.switchModeText}>Use 4-Digit Quick PIN instead</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.form}>
                  <Text style={styles.label}>4-Digit Master PIN</Text>
                  <View style={styles.inputWrap}>
                    <Lock size={18} color={colors.muted} />
                    <TextInput
                      keyboardType="number-pad"
                      placeholder="• • • •"
                      placeholderTextColor={colors.muted}
                      secureTextEntry
                      style={[styles.input, styles.pinInput]}
                      value={pin}
                      onChangeText={(val) => {
                        if (val.length <= 4) setPin(val);
                      }}
                      maxLength={4}
                      returnKeyType="done"
                      onSubmitEditing={handlePinSubmit}
                    />
                  </View>

                  {/* Quick PIN Dots */}
                  <View style={styles.dotsRow}>
                    {[0, 1, 2, 3].map((index) => (
                      <View
                        key={index}
                        style={[
                          styles.dot,
                          pin.length > index && styles.dotFilled,
                        ]}
                      />
                    ))}
                  </View>

                  {/* Submit Button right after input */}
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      pin.length < 4 && styles.btnDisabled,
                    ]}
                    onPress={handlePinSubmit}
                    disabled={pin.length < 4}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionBtnText}>Unlock & Open CRM</Text>
                    <ArrowRight size={18} color={colors.white} strokeWidth={2.5} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.switchModeBtn}
                    onPress={() => {
                      Keyboard.dismiss();
                      setAuthMode('phone');
                    }}
                    activeOpacity={0.7}
                  >
                    <Phone size={16} color={colors.primaryDark} strokeWidth={2.2} />
                    <Text style={styles.switchModeText}>Use Mobile Number instead</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  content: {
    width: '100%',
    gap: 10,
  },
  icon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 2,
    ...shadow,
  },
  brand: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    color: colors.text,
    marginTop: 2,
  },
  help: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  form: {
    gap: 12,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  inputWrap: {
    height: 52,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    ...shadow,
  },
  code: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  line: {
    height: 22,
    width: 1.5,
    backgroundColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  pinInput: {
    fontSize: 22,
    letterSpacing: 8,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    borderColor: colors.primaryStrong,
    backgroundColor: colors.primaryStrong,
  },
  switchModeBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  switchModeText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
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
    marginTop: 6,
    ...shadow,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  btnDisabled: {
    opacity: 0.45,
  },
});
