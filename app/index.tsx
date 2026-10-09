import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '../lib/api';

type Call = { id: string; number: string; name: string; time: string; ip: string; spam: boolean };
const tabs = [
  { label: 'Call Log', icon: 'call-outline', route: '/' },
  { label: 'Spam Blocker', icon: 'shield-checkmark-outline', route: '/blocker' },
  { label: 'Lookup', icon: 'search-outline', route: '/lookup' },
  { label: 'Settings', icon: 'settings-outline', route: '/settings' },
] as const;

export function AppHeader({ subtitle }: { subtitle?: string }) {
  return <View style={styles.header}><View style={styles.logo}><Ionicons name="call" size={19} color="#e2e8f0" /></View><View><Text style={styles.brand}>Signal Trace</Text>{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}</View></View>;
}
export function Nav({ active }: { active: string }) {
  const router = useRouter();
  return <View style={styles.nav}>{tabs.map((tab) => <Pressable key={tab.route} onPress={() => router.replace(tab.route)} style={styles.navItem} accessibilityRole="button" accessibilityLabel={tab.label}><Ionicons name={tab.icon as any} size={22} color={active === tab.route ? '#38bdf8' : '#94a3b8'} /><Text style={[styles.navText, active === tab.route && styles.navTextActive]}>{tab.label}</Text></Pressable>)}</View>;
}
export default function CallLog() {
  const [calls, setCalls] = useState<Call[] | null>(null); const [error, setError] = useState('');
  const load = useCallback(async () => { try { setError(''); setCalls(await api<Call[]>('GET', '/api/calls')); } catch (e) { setError((e as Error).message); } }, []);
  useEffect(() => { load(); }, [load]);
  return <SafeAreaView style={styles.screen}><AppHeader subtitle="Private caller activity" /><View style={styles.hero}><Text style={styles.eyebrow}>LIVE MONITOR</Text><Text style={styles.heroTitle}>Incoming calls</Text><Text style={styles.heroCopy}>Spam numbers are blocked automatically.</Text></View>{error ? <Pressable onPress={load}><Text style={styles.error}>{error} Tap to retry.</Text></Pressable> : calls === null ? <ActivityIndicator color="#38bdf8" style={{ marginTop: 42 }} /> : <FlatList data={calls} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={styles.callCard}><View style={[styles.avatar, item.spam && styles.avatarSpam]}><Ionicons name={item.spam ? 'warning-outline' : 'person-outline'} size={20} color={item.spam ? '#fbbf24' : '#38bdf8'} /></View><View style={{ flex: 1 }}><View style={styles.callTop}><Text style={styles.callName}>{item.name}</Text><Text style={styles.time}>{item.time}</Text></View><Text style={styles.number}>{item.number}</Text><View style={styles.ipRow}><Ionicons name="globe-outline" size={13} color="#94a3b8" /><Text style={styles.ip}>{item.ip}</Text></View>{item.spam && <Text style={styles.spamLabel}>BLOCKED · SPAM RISK</Text>}</View></View>} />}
  <Nav active="/" /></SafeAreaView>;
}
export const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#0f172a'}, header:{paddingHorizontal:20,paddingTop:12,flexDirection:'row',alignItems:'center',gap:11}, logo:{height:38,width:38,borderRadius:19,backgroundColor:'#38bdf8',alignItems:'center',justifyContent:'center',shadowColor:'#38bdf8',shadowOpacity:.55,shadowRadius:16,elevation:6}, brand:{fontSize:18,fontWeight:'800',color:'#e2e8f0',letterSpacing:.2}, subtitle:{fontSize:12,color:'#94a3b8',marginTop:1}, hero:{margin:20,padding:20,borderRadius:24,overflow:'hidden',backgroundColor:'#172554',borderWidth:1,borderColor:'#38bdf844'}, eyebrow:{color:'#38bdf8',fontSize:11,fontWeight:'800',letterSpacing:1.5}, heroTitle:{fontSize:29,fontWeight:'800',color:'#e2e8f0',marginTop:9}, heroCopy:{fontSize:14,color:'#cbd5e1',marginTop:5}, list:{paddingHorizontal:20,paddingBottom:100}, callCard:{flexDirection:'row',gap:13,backgroundColor:'#172033',borderWidth:1,borderColor:'#26354b',padding:14,borderRadius:18,marginBottom:10}, avatar:{height:40,width:40,borderRadius:14,backgroundColor:'#0f2944',justifyContent:'center',alignItems:'center'}, avatarSpam:{backgroundColor:'#3a2a18'}, callTop:{flexDirection:'row',justifyContent:'space-between',gap:8}, callName:{fontWeight:'700',color:'#e2e8f0',fontSize:15}, time:{color:'#94a3b8',fontSize:12}, number:{color:'#cbd5e1',fontSize:14,marginTop:3}, ipRow:{flexDirection:'row',gap:5,alignItems:'center',marginTop:8}, ip:{fontSize:12,color:'#94a3b8',flexShrink:1}, spamLabel:{color:'#fbbf24',fontSize:10,fontWeight:'800',letterSpacing:.8,marginTop:8}, nav:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#111c31',borderTopWidth:1,borderColor:'#26354b',flexDirection:'row',paddingTop:9,paddingBottom:10}, navItem:{flex:1,alignItems:'center',gap:3,minHeight:48}, navText:{fontSize:10,color:'#94a3b8'}, navTextActive:{color:'#38bdf8',fontWeight:'700'}, error:{color:'#fca5a5',padding:20,textAlign:'center'}, section:{paddingHorizontal:20,paddingTop:24}, title:{fontSize:28,fontWeight:'800',color:'#e2e8f0'}, copy:{fontSize:14,color:'#94a3b8',lineHeight:20,marginTop:6}, panel:{backgroundColor:'#172033',borderWidth:1,borderColor:'#26354b',borderRadius:18,padding:16,marginTop:20}, input:{backgroundColor:'#0f172a',borderColor:'#334155',borderWidth:1,borderRadius:13,color:'#e2e8f0',fontSize:16,paddingHorizontal:14,paddingVertical:13}, primary:{backgroundColor:'#38bdf8',borderRadius:13,alignItems:'center',justifyContent:'center',paddingVertical:14,marginTop:10,minHeight:48}, primaryText:{color:'#0f172a',fontWeight:'800',fontSize:15}, row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, setting:{paddingVertical:16,borderBottomWidth:1,borderBottomColor:'#26354b'}, settingTitle:{color:'#e2e8f0',fontSize:16,fontWeight:'700'}, settingCopy:{color:'#94a3b8',fontSize:13,marginTop:4}, itemRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#26354b'}, itemText:{color:'#e2e8f0',fontSize:15}
});
