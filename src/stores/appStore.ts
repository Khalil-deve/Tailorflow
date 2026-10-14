import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { Locale } from '@/i18n';

export interface ShopInfo {
  name: string;
  ownerName: string;
  phone: string;
  address: string;
  city: string;
}

export interface MeasurementField {
  id: string;
  name: string;
  nameUrdu: string;
  enabled: boolean;
  isCustom?: boolean;
}

export const DEFAULT_MEASUREMENT_TEMPLATES: Record<string, MeasurementField[]> = {
  'Kameez Shalwar': [
    { id: 'ks-length', name: 'Length (لمبائی)', nameUrdu: 'لمبائی', enabled: true },
    { id: 'ks-shoulder', name: 'Shoulder / Teera (تیرا)', nameUrdu: 'تیرا', enabled: true },
    { id: 'ks-chest', name: 'Chest (چھاتی)', nameUrdu: 'چھاتی', enabled: true },
    { id: 'ks-sleeves', name: 'Sleeves (آستین)', nameUrdu: 'آستین', enabled: true },
    { id: 'ks-collar', name: 'Collar / Bain (کالر / بین)', nameUrdu: 'کالر / بین', enabled: true },
    { id: 'ks-daman', name: 'Daman / Ghaer (دامن)', nameUrdu: 'دامن', enabled: true },
    { id: 'ks-shalwar-len', name: 'Shalwar Length (شلوار)', nameUrdu: 'شلوار لمبائی', enabled: true },
    { id: 'ks-pancha', name: 'Pancha (پانچہ)', nameUrdu: 'پانچہ', enabled: true },
    { id: 'ks-waist', name: 'Waist / Kamar (کمر)', nameUrdu: 'کمر', enabled: true },
    { id: 'ks-hip', name: 'Hip / Goth (ہپ / گوٹھ)', nameUrdu: 'ہپ', enabled: false },
    { id: 'ks-cuff', name: 'Cuff (کف)', nameUrdu: 'کف', enabled: false },
    { id: 'ks-asan', name: 'Asan (آسن)', nameUrdu: 'آسن', enabled: false },
  ],
  'Pant Shirt': [
    { id: 'ps-shirt-len', name: 'Shirt Length (شرٹ لمبائی)', nameUrdu: 'شرٹ لمبائی', enabled: true },
    { id: 'ps-chest', name: 'Chest (چھاتی)', nameUrdu: 'چھاتی', enabled: true },
    { id: 'ps-shoulder', name: 'Shoulder (تیرا)', nameUrdu: 'تیرا', enabled: true },
    { id: 'ps-sleeves', name: 'Sleeve (آستین)', nameUrdu: 'آستین', enabled: true },
    { id: 'ps-collar', name: 'Collar (کالر)', nameUrdu: 'کالر', enabled: true },
    { id: 'ps-pant-len', name: 'Pant Length (پینٹ لمبائی)', nameUrdu: 'پینٹ لمبائی', enabled: true },
    { id: 'ps-waist', name: 'Waist (کمر)', nameUrdu: 'کمر', enabled: true },
    { id: 'ps-hip', name: 'Hip (ہپ)', nameUrdu: 'ہپ', enabled: true },
    { id: 'ps-thigh', name: 'Thigh (ران)', nameUrdu: 'ران', enabled: true },
    { id: 'ps-pancha', name: 'Bottom / Opening (پانچہ)', nameUrdu: 'باٹم', enabled: true },
  ],
  'Waistcoat / Suit': [
    { id: 'ws-coat-len', name: 'Coat / Vest Length (لمبائی)', nameUrdu: 'کوٹ لمبائی', enabled: true },
    { id: 'ws-chest', name: 'Chest (چھاتی)', nameUrdu: 'چھاتی', enabled: true },
    { id: 'ws-waist', name: 'Waist (کمر)', nameUrdu: 'کمر', enabled: true },
    { id: 'ws-shoulder', name: 'Shoulder (تیرا)', nameUrdu: 'تیرا', enabled: true },
    { id: 'ws-sleeve', name: 'Sleeve (آستین)', nameUrdu: 'آستین', enabled: true },
    { id: 'ws-neck', name: 'Neck / Collar (گلا)', nameUrdu: 'گلا', enabled: true },
    { id: 'ws-hip', name: 'Hip (ہپ)', nameUrdu: 'ہپ', enabled: true },
    { id: 'ws-cross-back', name: 'Cross Back (پشت)', nameUrdu: 'کراس بیک', enabled: false },
  ],
};

export interface CutOption {
  id: string;
  name: string;
  nameUrdu: string;
}

export interface CutCategory {
  id: string;
  title: string;
  titleUrdu: string;
  options: CutOption[];
}

export type GarmentPricing = Record<string, number>;

export const DEFAULT_GARMENT_PRICING: GarmentPricing = {
  'Shalwar Kameez': 1500,
  'Kameez Shalwar': 1500,
  'Kurta Pajama': 1300,
  'Pant Shirt': 2200,
  'Waistcoat / Suit': 3500,
  'Suit / Safari': 4500,
};

export const DEFAULT_CUT_SPECIFICATIONS: CutCategory[] = [
  {
    id: 'fit',
    title: 'Fit Type',
    titleUrdu: 'فٹنگ',
    options: [
      { id: 'fit-reg', name: 'Regular', nameUrdu: 'نارمل' },
      { id: 'fit-slim', name: 'Slim Fit', nameUrdu: 'سمارٹ فٹ' },
      { id: 'fit-loose', name: 'Loose', nameUrdu: 'کھلا' },
    ],
  },
  {
    id: 'collar',
    title: 'Collar / Gala',
    titleUrdu: 'بین / کالر',
    options: [
      { id: 'col-full-bain', name: 'Full Bain', nameUrdu: 'مکمل بین' },
      { id: 'col-half-bain', name: 'Half Bain', nameUrdu: 'ہاف بین' },
      { id: 'col-shirt', name: 'Shirt Collar', nameUrdu: 'کالر' },
      { id: 'col-round', name: 'Round Gala', nameUrdu: 'گول گلا' },
      { id: 'col-cut-bain', name: 'Cut Bain', nameUrdu: 'کٹ بین' },
    ],
  },
  {
    id: 'daman',
    title: 'Daman Style',
    titleUrdu: 'دامن',
    options: [
      { id: 'dam-round', name: 'Round Daman', nameUrdu: 'گول دامن' },
      { id: 'dam-square', name: 'Square Daman', nameUrdu: 'چورس دامن' },
    ],
  },
  {
    id: 'pockets',
    title: 'Pockets',
    titleUrdu: 'جیبیں',
    options: [
      { id: 'poc-1s', name: '1 Side Pocket', nameUrdu: '1 سائیڈ جیب' },
      { id: 'poc-2s', name: '2 Side Pockets', nameUrdu: '2 سائیڈ جیب' },
      { id: 'poc-f1s', name: '1 Front + 1 Side', nameUrdu: '1 سامنے + 1 سائیڈ' },
      { id: 'poc-f2s', name: '1 Front + 2 Sides', nameUrdu: '1 سامنے + 2 سائیڈ' },
      { id: 'poc-secret', name: 'Secret Pocket', nameUrdu: 'خفیہ جیب' },
    ],
  },
  {
    id: 'cuff',
    title: 'Cuff Style',
    titleUrdu: 'کف',
    options: [
      { id: 'cuf-simple', name: 'Simple (Open)', nameUrdu: 'سادہ گول' },
      { id: 'cuf-cut', name: 'Cut Cuff', nameUrdu: 'کٹ کف' },
      { id: 'cuf-french', name: 'Double / French', nameUrdu: 'ڈبل کف' },
    ],
  },
  {
    id: 'shalwar',
    title: 'Shalwar / Bottom',
    titleUrdu: 'شلوار / پاجامہ',
    options: [
      { id: 'shl-simple', name: 'Simple Shalwar', nameUrdu: 'سادہ شلوار' },
      { id: 'shl-pocket', name: 'Pocket Shalwar', nameUrdu: 'جیب والی شلوار' },
      { id: 'shl-trouser', name: 'Trouser / Pajama', nameUrdu: 'ٹراؤزر' },
    ],
  },
];

export interface AppState {
  locale: Locale;
  onboarded: boolean;
  isLoggedIn: boolean;
  shop: ShopInfo;
  measurementTemplates: Record<string, MeasurementField[]>;
  garmentPricing: GarmentPricing;
  cutSpecifications: CutCategory[];
  setLocale: (locale: Locale) => void;
  finishOnboarding: () => void;
  login: () => void;
  logout: () => void;
  setShop: (shop: Partial<ShopInfo>) => void;
  toggleMeasurementField: (garment: string, fieldId: string) => void;
  addMeasurementField: (garment: string, field: { name: string; nameUrdu?: string }) => void;
  removeMeasurementField: (garment: string, fieldId: string) => void;
  resetMeasurementTemplate: (garment: string) => void;
  setGarmentPrice: (garment: string, price: number) => void;
  resetGarmentPricing: () => void;
  addCutOption: (categoryId: string, option: { name: string; nameUrdu?: string }) => void;
  removeCutOption: (categoryId: string, optionId: string) => void;
  resetCutSpecifications: () => void;
}

const memoryStorage: Record<string, string> = {};

const getStorageBackend = () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    return {
      getItem: (name: string) => memoryStorage[name] ?? null,
      setItem: (name: string, value: string) => {
        memoryStorage[name] = value;
      },
      removeItem: (name: string) => {
        delete memoryStorage[name];
      },
    };
  }

  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        const val = await SecureStore.getItemAsync(name);
        if (val !== null) return val;
      } catch {}
      return memoryStorage[name] ?? null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
      memoryStorage[name] = value;
      try {
        await SecureStore.setItemAsync(name, value);
      } catch {}
    },
    removeItem: async (name: string): Promise<void> => {
      delete memoryStorage[name];
      try {
        await SecureStore.deleteItemAsync(name);
      } catch {}
    },
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: 'en',
      onboarded: false,
      isLoggedIn: false,
      shop: {
        name: 'Ahmed Tailors',
        ownerName: 'Ahmed',
        phone: '0300 1234567',
        address: 'Gulberg',
        city: 'Lahore',
      },
      measurementTemplates: DEFAULT_MEASUREMENT_TEMPLATES,
      setLocale: (locale) => set({ locale }),
      finishOnboarding: () => set({ onboarded: true, isLoggedIn: true }),
      login: () => set({ isLoggedIn: true, onboarded: true }),
      logout: () => set({ isLoggedIn: false, onboarded: false }),
      setShop: (newShop) =>
        set((state) => ({ shop: { ...state.shop, ...newShop } })),
      toggleMeasurementField: (garment, fieldId) =>
        set((state) => {
          const list = state.measurementTemplates[garment] || DEFAULT_MEASUREMENT_TEMPLATES[garment] || [];
          const updated = list.map((item) =>
            item.id === fieldId ? { ...item, enabled: !item.enabled } : item
          );
          return {
            measurementTemplates: {
              ...state.measurementTemplates,
              [garment]: updated,
            },
          };
        }),
      addMeasurementField: (garment, field) =>
        set((state) => {
          const list = state.measurementTemplates[garment] || DEFAULT_MEASUREMENT_TEMPLATES[garment] || [];
          const newId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          const newField: MeasurementField = {
            id: newId,
            name: field.name.trim(),
            nameUrdu: field.nameUrdu?.trim() || field.name.trim(),
            enabled: true,
            isCustom: true,
          };
          return {
            measurementTemplates: {
              ...state.measurementTemplates,
              [garment]: [...list, newField],
            },
          };
        }),
      removeMeasurementField: (garment, fieldId) =>
        set((state) => {
          const list = state.measurementTemplates[garment] || DEFAULT_MEASUREMENT_TEMPLATES[garment] || [];
          return {
            measurementTemplates: {
              ...state.measurementTemplates,
              [garment]: list.filter((item) => item.id !== fieldId),
            },
          };
        }),
      resetMeasurementTemplate: (garment) =>
        set((state) => ({
          measurementTemplates: {
            ...state.measurementTemplates,
            [garment]: DEFAULT_MEASUREMENT_TEMPLATES[garment] || [],
          },
        })),
      garmentPricing: DEFAULT_GARMENT_PRICING,
      cutSpecifications: DEFAULT_CUT_SPECIFICATIONS,
      setGarmentPrice: (garment, price) =>
        set((state) => ({
          garmentPricing: {
            ...state.garmentPricing,
            [garment]: Math.max(0, price),
          },
        })),
      resetGarmentPricing: () =>
        set({
          garmentPricing: DEFAULT_GARMENT_PRICING,
        }),
      addCutOption: (categoryId, option) =>
        set((state) => {
          const newId = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
          const newOpt: CutOption = {
            id: newId,
            name: option.name.trim(),
            nameUrdu: option.nameUrdu?.trim() || option.name.trim(),
          };
          return {
            cutSpecifications: state.cutSpecifications.map((cat) =>
              cat.id === categoryId
                ? { ...cat, options: [...cat.options, newOpt] }
                : cat
            ),
          };
        }),
      removeCutOption: (categoryId, optionId) =>
        set((state) => ({
          cutSpecifications: state.cutSpecifications.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  options: cat.options.filter((opt) => opt.id !== optionId),
                }
              : cat
          ),
        })),
      resetCutSpecifications: () =>
        set({
          cutSpecifications: DEFAULT_CUT_SPECIFICATIONS,
        }),
    }),
    {
      name: 'tailorflow-app-storage',
      storage: createJSONStorage(getStorageBackend),
    }
  )
);
