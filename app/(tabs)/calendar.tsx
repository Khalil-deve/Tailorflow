import { CalendarDays } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderCard } from '@/components/orders/OrderCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { orders } from '@/constants/data';
import { colors, radius, shadow } from '@/theme';
import { useState } from 'react';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DUE_DAYS = [4, 8, 14, 20, 25];

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState(14);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Delivery Calendar" back />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Selector Bar */}
        <View style={styles.monthBar}>
          <Text style={styles.monthText}>October 2026</Text>
          <CalendarDays size={20} color={colors.primaryDark} strokeWidth={2.2} />
        </View>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          {/* Weekday Row */}
          <View style={styles.weekRow}>
            {WEEKDAYS.map((d, i) => (
              <Text key={`${d}${i}`} style={styles.weekdayText}>
                {d}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const isSelected = selectedDay === dayNum;
              const hasDelivery = DUE_DAYS.includes(i);
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedDay(dayNum)}
                  style={[styles.dateCell, isSelected && styles.dateCellSelected]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.dateTextSelected,
                    ]}
                  >
                    {dayNum}
                  </Text>
                  {hasDelivery && (
                    <View
                      style={[
                        styles.dot,
                        isSelected && { backgroundColor: colors.white },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Deliveries on Selected Date */}
        <SectionHeader title={`Deliveries — ${selectedDay} Oct`} />
        <View style={styles.ordersList}>
          {orders.slice(0, 2).map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
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
    gap: 14,
    paddingBottom: 110,
  },
  monthBar: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadow,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    ...shadow,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    width: '14.28%',
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: '14.28%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  dateCellSelected: {
    backgroundColor: colors.primaryStrong,
  },
  dateText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  dateTextSelected: {
    color: colors.white,
    fontWeight: '800',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryStrong,
    marginTop: 2,
  },
  ordersList: {
    gap: 10,
  },
});
