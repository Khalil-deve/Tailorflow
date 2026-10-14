import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui/AppButton';
import { AppHeader } from '@/components/ui/AppHeader';
import { useAppStore } from '@/stores/appStore';
import { colors, radius, shadow } from '@/theme';

const LANGUAGES = [
  { id: 'en' as const, label: 'English', sub: 'Standard layout (LTR)' },
  { id: 'ur' as const, label: 'اردو', sub: 'Urdu · دائیں سے بائیں (RTL)' },
];

export default function Language() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { locale, setLocale } = useAppStore();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Language" back />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.help}>Choose the language you use at work:</Text>

        <View style={styles.optionsList}>
          {LANGUAGES.map((item) => {
            const isSelected = locale === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setLocale(item.id)}
                style={[styles.option, isSelected && styles.selected]}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.sub}>{item.sub}</Text>
                </View>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Check size={16} color={colors.white} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ marginTop: 12 }}>
          <AppButton label="Save Language" onPress={() => router.back()} />
        </View>

        <Text style={styles.note}>
          The app will switch text labels and layout direction automatically.
        </Text>
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
    gap: 14,
  },
  help: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  optionsList: {
    gap: 10,
  },
  option: {
    minHeight: 68,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow,
  },
  selected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryStrong,
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  sub: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
  },
});
