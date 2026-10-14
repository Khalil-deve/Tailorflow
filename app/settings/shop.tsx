import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui/AppButton';
import { AppHeader } from '@/components/ui/AppHeader';
import { useAppStore } from '@/stores/appStore';
import { colors, radius } from '@/theme';

export default function ShopSettings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { shop, setShop } = useAppStore();

  const [shopName, setShopName] = useState(shop?.name || 'Ahmed Tailors');
  const [ownerName, setOwnerName] = useState(shop?.ownerName || 'Ahmed');
  const [phone, setPhone] = useState(shop?.phone || '0300 1234567');
  const [city, setCity] = useState(shop?.city || shop?.address || 'Gulberg, Lahore');

  const handleSave = () => {
    setShop({
      name: shopName.trim() || 'Ahmed Tailors',
      ownerName: ownerName.trim() || 'Ahmed',
      phone: phone.trim() || '0300 1234567',
      address: city.trim() || 'Gulberg, Lahore',
      city: city.trim() || 'Gulberg, Lahore',
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Shop Information" back />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.field}>
          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            value={shopName}
            onChangeText={setShopName}
            placeholder="Shop Name"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Owner Name</Text>
          <TextInput
            value={ownerName}
            onChangeText={setOwnerName}
            placeholder="Owner Name"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>City / Area</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="City / Area"
            style={styles.input}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <AppButton
            label="Save Changes"
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
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    height: 50,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
  },
});
