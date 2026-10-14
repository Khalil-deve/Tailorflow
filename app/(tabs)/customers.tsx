import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Plus, UserPlus } from 'lucide-react-native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { useDataStore } from '@/stores/dataStore';
import { colors, radius, shadow } from '@/theme';
import { AppHeader } from '@/components/ui/AppHeader';

const FILTERS = ['All', 'Recent', 'Due Payment'] as const;

export default function Customers() {
  const router = useRouter();
  const { customers } = useDataStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('All');

  const shown = useMemo(
    () =>
      customers.filter(
        (c) =>
          (filter !== 'Due Payment' || c.balance > 0) &&
          `${c.name} ${c.phone}`.toLowerCase().includes(query.toLowerCase())
      ),
    [customers, query, filter]
  );

  const isNumericQuery = /^[0-9+\s]+$/.test(query.trim());

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
     <AppHeader title="Customers" back />

      {/* Search + Filters */}
      <View style={styles.searchArea}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search name or 0300..."
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.chip, filter === f && styles.chipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List or Customer Not Found prompt */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {shown.map((c) => (
          <CustomerCard key={c.id} customer={c} />
        ))}

        {/* If query has no matches: Prominent Add Customer CTA */}
        {shown.length === 0 && query.trim().length > 0 && (
          <View style={styles.notFoundCard}>
            <Text style={styles.notFoundTitle}>Customer Not Found</Text>
            <Text style={styles.notFoundSubtitle}>
              No record for "{query}". Add them in 2 quick steps:
            </Text>
            <TouchableOpacity
              style={styles.addNotFoundBtn}
              onPress={() =>
                router.push({
                  pathname: '/customer/new',
                  params: isNumericQuery ? { phone: query.trim() } : { name: query.trim() },
                })
              }
              activeOpacity={0.85}
            >
              <UserPlus size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.addNotFoundBtnText}>
                + Quick Add Customer: "{query.trim()}"
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {shown.length === 0 && query.trim().length === 0 && (
          <Text style={styles.empty}>No customers found in this filter.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  header: {
    height: 62,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E2D7',
    backgroundColor: colors.surface,
    ...shadow,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  searchArea: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
    backgroundColor: '#FAFAF9',
  },
  filters: {
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryStrong,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  list: {
    padding: 16,
    gap: 12,
    paddingBottom: 110,
  },
  empty: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 14,
    marginTop: 40,
  },
  notFoundCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: '#CBD4C0',
    padding: 18,
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    ...shadow,
  },
  notFoundTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  notFoundSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  addNotFoundBtn: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    width: '100%',
    ...shadow,
  },
  addNotFoundBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
