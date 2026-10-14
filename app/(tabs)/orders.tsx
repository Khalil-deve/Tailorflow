import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderCard } from '@/components/orders/OrderCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { useDataStore } from '@/stores/dataStore';
import { colors, radius, shadow } from '@/theme';
import { AppHeader } from '@/components/ui/AppHeader';

const FILTERS = ['All', 'Today', 'Late', 'Ready', 'Unpaid'] as const;

export default function Orders() {
  const { orders } = useDataStore();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const shown = orders.filter((o) => {
    if (search.trim()) {
      const matchSearch =
        `${o.customerName} ${o.orderNumber} ${o.garment}`
          .toLowerCase()
          .includes(search.toLowerCase());
      if (!matchSearch) return false;
    }
    if (filter === 'All') return true;
    if (filter === 'Today') return o.deliveryDate?.toLowerCase().includes('today');
    if (filter === 'Ready') return o.status === 'ready';
    if (filter === 'Unpaid') return o.balance > 0;
    if (filter === 'Late') return o.status === 'received' || o.status === 'cutting';
    return true;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
      </View> */}
       <AppHeader title="Orders" back />

      {/* Search + Filters */}
      <View style={styles.searchArea}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Customer or Order #"
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

      {/* List */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {shown.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
        {shown.length === 0 && (
          <Text style={styles.empty}>No orders in this filter.</Text>
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
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
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
    gap: 10,
    paddingBottom: 110,
  },
  empty: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 14,
    marginTop: 40,
  },
});
