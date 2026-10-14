import { Tabs, useRouter } from 'expo-router';
import { ClipboardList, House, Menu, Plus, UsersRound } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';
function CenterButton() { const router = useRouter(); return <Pressable onPress={() => router.push('/order/new')} style={styles.centerWrap}><View style={styles.center}><Plus color={colors.white} size={32} strokeWidth={3}/></View><Text style={styles.centerText}>New Order</Text></Pressable>; }
export default function TabLayout() { return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primaryDark, tabBarInactiveTintColor: colors.muted, tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginBottom: 5 }, tabBarStyle: styles.bar }}>
  <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <House size={25} color={color}/> }}/>
  <Tabs.Screen name="customers" options={{ title: 'Customers', tabBarIcon: ({ color }) => <UsersRound size={25} color={color}/> }}/>
  <Tabs.Screen name="new" options={{ title: '', tabBarButton: () => <CenterButton/> }}/>
  <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: ({ color }) => <ClipboardList size={25} color={color}/> }}/>
  <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: ({ color }) => <Menu size={25} color={color}/> }}/>
  <Tabs.Screen name="calendar" options={{ href: null }}/>
</Tabs>; }
const styles = StyleSheet.create({ bar: { height: 76, paddingTop: 8, backgroundColor: colors.surface, borderTopColor: colors.border }, centerWrap: { flex: 1, minWidth: 78, alignItems: 'center', marginTop: -24 }, center: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.primaryStrong, alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: colors.background, elevation: 6 }, centerText: { color: colors.primaryDark, fontSize: 11, fontWeight: '800', marginTop: 2 } });
