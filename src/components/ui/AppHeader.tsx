import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shadow } from '@/theme';

export function AppHeader({
  title,
  back = false,
  right,
}: {
  title: string;
  back?: boolean;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      {back ? (
        <Pressable
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={styles.button}
        >
          <ChevronLeft color={colors.white} size={26} strokeWidth={2.5} />
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.primaryStrong,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow,
  },
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  spacer: { width: 40 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: "white",
    letterSpacing: -0.3,
  },
  right: { width: 40, alignItems: 'center' },
 
});
