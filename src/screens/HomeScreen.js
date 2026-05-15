import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Platform, Image,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { NOTES, RECENT_NOTES } from '../data/staticData';
import NoteCard from '../components/NoteCard';
import icons from '../constants/icons';

const TABS = ['All Notes', 'Recent', 'Favorites', 'Archived'];

// Color accent per recent note card — matches note color field
const RECENT_COLOR = {
  '1': COLORS.accent,
  '2': COLORS.green,
  '4': COLORS.blue,
  '6': COLORS.purple,
};

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All Notes');

  const filtered = activeTab === 'Favorites'
    ? NOTES.filter(n => n.favorite)
    : NOTES;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.appName}>
              <Text style={styles.appNameBlack}>Note</Text>
              <Text style={styles.appNameAccent}>mOnk</Text>
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
        </View>

        {/* Search Bar — uses search PNG icon */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.9}
        >
          <Image
            source={icons.searchDefault}
            style={styles.searchIconImg}
            resizeMode="contain"
          />
          <Text style={styles.searchPlaceholder}>Search your notes…</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[['24','TOTAL'],['6','FAVORITES'],['3','REMINDERS'],['9','TASKS']].map(([num, lbl]) => (
            <View key={lbl} style={styles.statChip}>
              <Text style={styles.statNum}>{num}</Text>
              <Text style={styles.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Section Tabs */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll} contentContainerStyle={styles.tabsContent}
        >
          {TABS.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              onPress={() => setActiveTab(t)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabTxt, activeTab === t && styles.tabTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent — colored bar replaces emoji */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={styles.recentScroll} contentContainerStyle={styles.recentContent}
        >
          {RECENT_NOTES.map(r => (
            <View key={r.id} style={styles.miniCard}>
              <View style={[styles.miniColorBar, { backgroundColor: RECENT_COLOR[r.id] || COLORS.accent }]} />
              <Text style={styles.miniTitle} numberOfLines={1}>{r.title}</Text>
              <Text style={styles.miniDate}>{r.date}</Text>
            </View>
          ))}
        </ScrollView>

        {/* All Notes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Notes</Text>
          <Text style={styles.seeAll}>Sort</Text>
        </View>
        <View style={styles.cardsCol}>
          {filtered.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onPress={() => navigation.navigate('CreateNote', { note })}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNote', { note: null })}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingTop: Platform.OS === 'web' ? 20 : 0 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
  },
  greeting: {
    fontSize: 12, fontWeight: '400', color: COLORS.textMuted,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2,
  },
  appName: { fontSize: 26 },
  appNameBlack: { fontWeight: '700', color: COLORS.text },
  appNameAccent: { fontWeight: '700', color: COLORS.accent },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13,
    marginHorizontal: 24, marginBottom: 16,
    ...SHADOW.light,
  },
  searchIconImg: { width: 16, height: 16, tintColor: COLORS.textMuted },
  searchPlaceholder: { fontSize: 14, color: COLORS.textMuted },

  statsRow: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 24, marginBottom: 16,
  },
  statChip: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.sm,
    paddingVertical: 12, alignItems: 'center', ...SHADOW.light,
  },
  statNum: { fontSize: 20, fontWeight: '700', color: COLORS.accent },
  statLbl: {
    fontSize: 9, color: COLORS.textMuted, fontWeight: '500',
    letterSpacing: 0.5, marginTop: 2,
  },

  tabsScroll: { marginBottom: 20 },
  tabsContent: { paddingHorizontal: 24, gap: 8 },
  tabBtn: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: RADIUS.full, backgroundColor: COLORS.surface,
  },
  tabBtnActive: { backgroundColor: COLORS.accent },
  tabTxt: { fontSize: 13, fontWeight: '500', color: COLORS.textMuted },
  tabTxtActive: { color: '#fff' },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  seeAll: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },

  recentScroll: { marginBottom: 24 },
  recentContent: { paddingHorizontal: 24, gap: 12 },
  miniCard: {
    width: 150, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: 14, ...SHADOW.card,
  },
  // Colored bar replaces emoji
  miniColorBar: {
    width: 28, height: 4, borderRadius: 2, marginBottom: 12,
  },
  miniTitle: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  miniDate: { fontSize: 10, color: COLORS.textMuted },

  cardsCol: { paddingHorizontal: 24 },

  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 80 : 100,
    right: 24, width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40, shadowRadius: 12, elevation: 8,
  },
  fabIcon: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
});