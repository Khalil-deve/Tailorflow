import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

export function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action && (
        <Pressable onPress={onPress} hitSlop={8}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.1,
  },
  action: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
