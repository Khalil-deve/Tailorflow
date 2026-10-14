import { I18nManager } from 'react-native';

export type Locale = 'en' | 'ur';
const dictionary = {
  en: { home: 'Home', customers: 'Customers', orders: 'Orders', newOrder: 'New Order', more: 'More', search: 'Search customer or phone', today: "Today's Work", ready: 'Ready', balance: 'Balance', stitching: 'Stitching' },
  ur: { home: 'ہوم', customers: 'گاہک', orders: 'آرڈرز', newOrder: 'نیا آرڈر', more: 'مزید', search: 'نام یا فون تلاش کریں', today: 'آج کا کام', ready: 'تیار', balance: 'بقایا', stitching: 'سلائی' },
} as const;
export type TranslationKey = keyof typeof dictionary.en;
export const t = (key: TranslationKey, locale: Locale = 'en') => dictionary[locale][key];
export const isRTL = (locale: Locale) => locale === 'ur';
export const applyDirection = (locale: Locale) => I18nManager.allowRTL(isRTL(locale));
