import { CircleCheckBig, Clock3, PackageCheck, Scissors, Shirt, XCircle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import type { OrderStatus } from '@/types/domain';
import { colors, radius } from '@/theme';
const config = { received: [colors.info, '#DBEAFE', Clock3], cutting: [colors.primaryDark, colors.primaryLight, Scissors], stitching: ['#B7791F', colors.warningBg, Shirt], finishing: [colors.purple, '#EDE9FE', Clock3], ready: [colors.success, colors.successBg, CircleCheckBig], delivered: ['#15803D', colors.successBg, PackageCheck], cancelled: [colors.danger, colors.dangerBg, XCircle] } as const;
export function StatusBadge({ status }: { status: OrderStatus }) { const [color, bg, Icon] = config[status]; return <View style={[styles.wrap, { backgroundColor: bg }]}><Icon size={15} color={color}/><Text style={[styles.text, { color }]}>{status[0]?.toUpperCase()}{status.slice(1)}</Text></View>; }
const styles = StyleSheet.create({ wrap: { minHeight: 32, paddingHorizontal: 10, borderRadius: radius.full, flexDirection: 'row', alignItems: 'center', gap: 5 }, text: { fontSize: 13, fontWeight: '800' } });
