import React from 'react';
import { useRouter } from 'expo-router';
import { ChevronRight, MessageCircle, Phone, Printer, Ruler } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Customer } from '@/types/domain';
import { AppCard } from '@/components/ui/AppCard';
import { colors, radius } from '@/theme';
import { printCuttingChit } from '@/utils/printChit';

export function CustomerCard({ customer }: { customer: Customer }) {
  const router = useRouter();

  const handlePrintChit = (e: any) => {
    e.stopPropagation?.();
    printCuttingChit({
      customerName: customer.name,
      phone: customer.phone,
      area: customer.area,
      garmentType: customer.lastOrder || 'Kameez Shalwar',
      notes: 'Standard fit, 1 side pocket, round daman',
      measurements: {
        'Kameez Length': '40.5',
        'Shoulder': '17.5',
        'Chest': '22.0',
        'Sleeves': '23.5',
        'Collar': '15.5',
        'Daman': '23.0',
        'Shalwar Length': '38.0',
        'Pancha': '8.5',
      },
    });
  };

  return (
    <Pressable onPress={() => router.push(`/customer/${customer.id}`)}>
      <AppCard style={styles.card}>
        <View style={styles.topRow}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.initials}>{customer.initials}</Text>
          </View>

          {/* Info */}
          <View style={styles.main}>
            <Text style={styles.name}>{customer.name}</Text>
            <Text style={styles.phone}>{customer.phone}</Text>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{customer.orderCount} Orders</Text>
              </View>
              {customer.balance > 0 && (
                <View style={styles.dueBadge}>
                  <Text style={styles.dueText}>
                    Rs. {customer.balance.toLocaleString()} Due
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Phone / WhatsApp icons */}
          <View style={styles.contactIcons}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <Phone size={15} color={colors.primaryDark} strokeWidth={2.3} />
            </TouchableOpacity>
           
          </View>
        </View>

        {/* Quick Tailor Actions: Edit Measurements & Print Slip */}
        <View style={styles.quickBar}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={(e) => {
              e.stopPropagation?.();
              router.push('/measurements/new');
            }}
            activeOpacity={0.7}
          >
            <Ruler size={14} color={colors.primaryDark} strokeWidth={2.4} />
            <Text style={styles.quickActionText}>Edit Measurements</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, styles.printBtn]}
            onPress={handlePrintChit}
            activeOpacity={0.7}
          >
            <Printer size={14} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={[styles.quickActionText, styles.printBtnText]}>Print Slip (پَرچی)</Text>
          </TouchableOpacity>
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '900',
  },
  main: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  phone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#F4F3F0',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  dueBadge: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dueText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '800',
  },
  contactIcons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBar: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  quickActionBtn: {
    flex: 1,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  printBtn: {
    backgroundColor: colors.primaryStrong,
  },
  printBtnText: {
    color: '#FFFFFF',
  },
});
