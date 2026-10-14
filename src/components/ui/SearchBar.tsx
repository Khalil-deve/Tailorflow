import { Mic, Search } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, shadow } from '@/theme';

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search customer or phone',
}: {
  value?: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.wrap}>
      <Search size={20} color={colors.muted} strokeWidth={2.2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      <Mic size={20} color={colors.primaryDark} strokeWidth={2.2} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 50,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadow,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
});
