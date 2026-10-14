import { Redirect } from 'expo-router';
import { useAppStore } from '@/stores/appStore';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import { colors } from '@/theme';

export default function Index() {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const onboarded = useAppStore((state) => state.onboarded);
  const [hasHydrated, setHasHydrated] = useState(
    () => useAppStore.persist?.hasHydrated?.() ?? false
  );

  useEffect(() => {
    if (useAppStore.persist?.hasHydrated?.()) {
      setHasHydrated(true);
      return;
    }

    const unsub = useAppStore.persist?.onFinishHydration?.(() => {
      setHasHydrated(true);
    });

    useAppStore.persist?.rehydrate?.();

    const timer = setTimeout(() => {
      setHasHydrated(true);
    }, 800);

    return () => {
      unsub?.();
      clearTimeout(timer);
    };
  }, []);

  if (!hasHydrated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primaryStrong} />
      </View>
    );
  }

  // If tailor is already logged in or has set up their shop, go straight to CRM Dashboard!
  if (isLoggedIn || onboarded) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, first-time tailor sees onboarding
  return <Redirect href="/onboarding" />;
}
