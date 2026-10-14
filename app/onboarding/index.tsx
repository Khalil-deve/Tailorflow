import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  Globe,
  LogIn,
  MessageSquare,
  Ruler,
  Scissors,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Wallet,
} from 'lucide-react-native';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui/AppButton';
import { useAppStore } from '@/stores/appStore';
import { colors, radius, shadow } from '@/theme';

export default function Onboarding() {
  const router = useRouter();
  const { locale, setLocale, isLoggedIn, onboarded } = useAppStore();
  const [lang, setLang] = useState<'en' | 'ur'>(locale || 'en');

  useEffect(() => {
    if (isLoggedIn || onboarded) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, onboarded]);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ur' : 'en';
    setLang(nextLang);
    setLocale(nextLang);
  };

  const isUrdu = lang === 'ur';

  const features = [
    {
      icon: Ruler,
      title: isUrdu ? 'مکمل ناپ کا ریکارڈ' : 'Smart Measurements',
      desc: isUrdu
        ? 'قمیض، شلوار، کوٹ اور شیروانی کے ہر ناپ کو محفوظ رکھیں'
        : 'Store exact measurements for Kameez, Shalwar, Suits & Sherwanis with one tap.',
      badge: isUrdu ? 'آسان' : 'Quick Save',
    },
    {
      icon: Users,
      title: isUrdu ? 'گاہکوں کا فون نمبر رجسٹر' : 'Customer Phone Register',
      desc: isUrdu
        ? 'صرف موبائل نمبر سے گاہک کی پرانی ہسٹری اور ناپ فوری دیکھیں'
        : 'Instant search by phone number. Keep repeat customer orders and balance transparent.',
      badge: isUrdu ? 'نمبر فرسٹ' : 'Zero Hassle',
    },
    {
      icon: CalendarCheck2,
      title: isUrdu ? 'آرڈرز اور ڈیلیوری ٹریکر' : 'Order & Due Date Tracker',
      desc: isUrdu
        ? 'کون سا سوٹ کٹائی پر ہے، سلائی پر یا ڈیلیوری کے لیے تیار ہے'
        : 'Know what is on cutting, stitching, or ready for delivery today and this week.',
      badge: isUrdu ? 'وقت پر' : 'On-Time',
    },
    {
      icon: Wallet,
      title: isUrdu ? 'بقایا اور ادھار کا حساب' : 'Payment & Khata Tracking',
      desc: isUrdu
        ? 'ایڈوانس کتنا آیا اور بقایا رقم کتنی رہ گئی، حساب بالکل صاف'
        : 'Track advance deposits, remaining balance, and total sales without paper registers.',
      badge: isUrdu ? 'حساب کتاب' : 'Clear Khata',
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Navbar */}
      <View style={styles.topNav}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Scissors size={20} color={colors.white} strokeWidth={2.4} />
          </View>
          <View>
            <Text style={styles.brandTitle}>TailorFlow</Text>
            <Text style={styles.brandSubtitle}>
              {isUrdu ? 'درزی رجسٹر' : 'Shop Manager'}
            </Text>
          </View>
        </View>

        <View style={styles.navActions}>
          {/* Language Toggle */}
          <TouchableOpacity
            style={styles.langPill}
            onPress={toggleLanguage}
            activeOpacity={0.7}
          >
            <Globe size={15} color={colors.primaryDark} />
            <Text style={styles.langPillText}>
              {isUrdu ? 'English' : 'اردو'}
            </Text>
          </TouchableOpacity>

          {/* Tailor Login / Register Header Button */}
          <TouchableOpacity
            style={styles.tailorLoginBtn}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.8}
          >
            <LogIn size={16} color={colors.white} strokeWidth={2.4} />
            <Text style={styles.tailorLoginText}>
              {isUrdu ? 'لاگ ان' : 'Tailor Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.announcement}>
            <Sparkles size={14} color={colors.primaryDark} />
            <Text style={styles.announcementText}>
              {isUrdu
                ? 'درزیوں کی دکان کے لیے سب سے آسان ڈیجیٹل رجسٹر'
                : 'Built Specifically for Local Tailors & Masters'}
            </Text>
          </View>

          <Text style={styles.heroHeading}>
            {isUrdu
              ? 'دکان کا سارا کھاتہ، ناپ اور آرڈرز ایک جگہ'
              : 'Your Tailor Shop, Register & Khata in Your Pocket'}
          </Text>

          <Text style={styles.heroSubtext}>
            {isUrdu
              ? 'کاغذ کی کاپی اور پرچیوں سے چھٹکارا پائیں۔ گاہک کے ناپ، سوٹ کی سلائی اور بقایا رقم موبائل پر محفوظ رکھیں۔'
              : 'Replace paper registers and lost slips. Manage customer measurements, stitching orders, and balance payments with total peace of mind.'}
          </Text>

          {/* Quick Primary CTA */}
          <View style={styles.ctaRow}>
            <View style={{ flex: 1 }}>
              <AppButton
                label={isUrdu ? 'دکان شروع کریں' : 'Open My Shop'}
                onPress={() => router.push('/auth/shop-setup')}
                icon={Store}
              />
            </View>
          </View>

          {/* Trust points */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <CheckCircle2 size={16} color={colors.success} />
              <Text style={styles.trustText}>
                {isUrdu ? 'آف لائن کام' : 'Works Offline'}
              </Text>
            </View>
            <View style={styles.trustItem}>
              <CheckCircle2 size={16} color={colors.success} />
              <Text style={styles.trustText}>
                {isUrdu ? 'محفوظ ڈیٹا' : 'Safe & Secure'}
              </Text>
            </View>
            <View style={styles.trustItem}>
              <CheckCircle2 size={16} color={colors.success} />
              <Text style={styles.trustText}>
                {isUrdu ? 'پن کوڈ سے لاگ ان' : 'Quick PIN Entry'}
              </Text>
            </View>
          </View>
        </View>

        {/* System Features Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isUrdu ? 'ٹیلر فلو کی سہولیات' : 'What TailorFlow Does For You'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {isUrdu
              ? 'دکان کے روزمرہ کاموں کو سادہ اور تیز ترین بنائیں'
              : 'Everything you need to run an organized tailoring business'}
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <View key={idx} style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <View style={styles.featureIconWrap}>
                    <Icon size={24} color={colors.primaryDark} strokeWidth={2.2} />
                  </View>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>{feat.badge}</Text>
                  </View>
                </View>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            );
          })}
        </View>

        {/* Live Tailor Experience Preview Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTag}>
              {isUrdu ? 'ماسٹر اور کاریگر' : 'For Masters & Stitchers'}
            </Text>
            <Text style={styles.bannerTitle}>
              {isUrdu
                ? 'کیا آپ پہلے سے رجسٹرڈ ہیں؟'
                : 'Already have your shop set up?'}
            </Text>
            <Text style={styles.bannerDesc}>
              {isUrdu
                ? 'اپنے موبائل نمبر یا 4 ہندسوں والے پن سے فوری اپنے منی سی آر ایم میں لاگ ان کریں'
                : 'Log in right away to view your orders, customer measurements, and pending dues.'}
            </Text>

            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.85}
            >
              <Text style={styles.bannerBtnText}>
                {isUrdu ? 'لاگ ان کریں اور ڈیش بورڈ دیکھیں' : 'Enter Tailor CRM'}
              </Text>
              <ArrowRight size={18} color={colors.primaryDark} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Help / Bottom Note */}
        <View style={styles.bottomNote}>
          <Text style={styles.bottomNoteText}>
            TailorFlow v1.0 • Built for Pakistani & South Asian Tailoring Masters
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: -2,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#CBD4C0',
  },
  langPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  tailorLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryStrong,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    ...shadow,
  },
  tailorLoginText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 22,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 14,
    ...shadow,
  },
  announcement: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  announcementText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  heroHeading: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  heroSubtext: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexWrap: 'wrap',
    gap: 8,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  sectionHeader: {
    marginTop: 4,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
    ...shadow,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  bannerCard: {
    backgroundColor: colors.primaryFaint,
    borderRadius: radius.xl,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#FDE047',
    marginTop: 6,
  },
  bannerContent: {
    gap: 10,
  },
  bannerTag: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },
  bannerDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bannerBtn: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primaryStrong,
  },
  bannerBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  bottomNote: {
    alignItems: 'center',
    marginTop: 10,
  },
  bottomNoteText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },
});
