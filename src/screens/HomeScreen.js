import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';

const TABS = ['All Notes', 'Recent', 'Favorites', 'Pinned'];

const COLOR_HEX = {
  orange: '#C07850', green: '#7BAB8B', purple: '#8B7BAB',
  blue:   '#7BA7C0', gold:  '#C0A050', red:    '#C07070',
};

export default function HomeScreen({ navigation }) {
  const ctx = useNotes();

  const notes         = ctx.notes         || [];
  const favoriteNotes = ctx.favoriteNotes ?? ctx.favorites ?? notes.filter(n => n.favorite);
  const pinnedNotes   = ctx.pinnedNotes   ?? ctx.pinned   ?? notes.filter(n => n.pinned);
  const recentNotes   = ctx.recentNotes   ?? ctx.recent   ??
    [...notes].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 5);
  const reminders     = ctx.reminders     || [];
  const toggleFavorite = ctx.toggleFavorite || (() => {});
  const deleteNote     = ctx.deleteNote     || (() => {});

  const stats = ctx.stats ?? {
    total:     notes.length,
    favorites: favoriteNotes.length,
    reminders: reminders.length,
    tasks:     notes.filter(n => Array.isArray(n.checkItems) && n.checkItems.length > 0).length,
  };

  const [activeTab, setActiveTab] = useState('All Notes');

  const tabNotes = (
    activeTab === 'Recent'    ? recentNotes   :
    activeTab === 'Favorites' ? favoriteNotes :
    activeTab === 'Pinned'    ? pinnedNotes   :
    notes
  );

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

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.9}
        >
          <Text style={styles.searchIconTxt}>⌕</Text>
          <Text style={styles.searchPlaceholder}>Search your notes…</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            [String(stats.total     ?? 0), 'TOTAL'    ],
            [String(stats.favorites ?? 0), 'FAVORITES'],
            [String(stats.reminders ?? reminders.length ?? 0), 'REMINDERS'],
            [String(stats.tasks     ?? 0), 'TASKS'    ],
          ].map(([num, lbl]) => (
            <View key={lbl} style={styles.statChip}>
              <Text style={styles.statNum}>{num}</Text>
              <Text style={styles.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
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

        {/* Recent Strip */}
        {activeTab === 'All Notes' && recentNotes.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <TouchableOpacity onPress={() => setActiveTab('Recent')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recentScroll}
              contentContainerStyle={styles.recentContent}
            >
              {recentNotes.map(n => (
                <TouchableOpacity
                  key={n.id}
                  style={styles.miniCard}
                  onPress={() => navigation.navigate('CreateNote', { note: n })}
                  activeOpacity={0.85}
                >
                  <View style={[styles.miniColorBar, { backgroundColor: COLOR_HEX[n.color] || COLORS.accent }]} />
                  <Text style={styles.miniTitle} numberOfLines={1}>{n.title}</Text>
                  <Text style={styles.miniDate}>{n.date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Notes List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'All Notes' ? 'All Notes' : activeTab}
          </Text>
          <Text style={styles.noteCount}>
            {tabNotes.length} note{tabNotes.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {tabNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              {activeTab === 'Favorites' ? '☆' : activeTab === 'Pinned' ? '📌' : '📝'}
            </Text>
            <Text style={styles.emptyTxt}>
              {activeTab === 'Favorites' ? 'No favorite notes yet'
                : activeTab === 'Pinned' ? 'No pinned notes yet'
                : 'No notes yet'}
            </Text>
            <Text style={styles.emptyHint}>Tap + to create your first note</Text>
          </View>
        ) : (
          <View style={styles.cardsCol}>
            {tabNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onPress={() => navigation.navigate('CreateNote', { note })}
                onFavorite={() => toggleFavorite(note.id)}
                onDelete={() => deleteNote(note.id)}
              />
            ))}
          </View>
        )}

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
  safe:    { flex: 1, backgroundColor: COLORS.bg },
  scroll:  { flex: 1 },
  content: { paddingTop: Platform.OS === 'web' ? 20 : 0 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
  },
  greeting:      { fontSize: 12, fontWeight: '400', color: COLORS.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  appName:       { fontSize: 26 },
  appNameBlack:  { fontWeight: '700', color: COLORS.text },
  appNameAccent: { fontWeight: '700', color: COLORS.accent },
  avatar:        { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText:    { color: '#fff', fontSize: 16, fontWeight: '600' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13,
    marginHorizontal: 24, marginBottom: 16, ...SHADOW.light,
  },
  searchIconTxt:     { fontSize: 16, color: COLORS.textMuted },
  searchPlaceholder: { fontSize: 14, color: COLORS.textMuted },

  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 24, marginBottom: 16 },
  statChip: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.sm,
    paddingVertical: 12, alignItems: 'center', ...SHADOW.light,
  },
  statNum: { fontSize: 20, fontWeight: '700', color: COLORS.accent },
  statLbl: { fontSize: 9, color: COLORS.textMuted, fontWeight: '500', letterSpacing: 0.5, marginTop: 2 },

  tabsScroll:   { marginBottom: 20 },
  tabsContent:  { paddingHorizontal: 24, gap: 8 },
  tabBtn:       { paddingHorizontal: 18, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.surface },
  tabBtnActive: { backgroundColor: COLORS.accent },
  tabTxt:       { fontSize: 13, fontWeight: '500', color: COLORS.textMuted },
  tabTxtActive: { color: '#fff' },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  seeAll:       { fontSize: 12, color: COLORS.accent, fontWeight: '500' },
  noteCount:    { fontSize: 12, color: COLORS.textMuted },

  recentScroll:  { marginBottom: 24 },
  recentContent: { paddingHorizontal: 24, gap: 12 },
  miniCard:      { width: 150, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 14, ...SHADOW.card },
  miniColorBar:  { width: 28, height: 4, borderRadius: 2, marginBottom: 12 },
  miniTitle:     { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  miniDate:      { fontSize: 10, color: COLORS.textMuted },

  cardsCol: { paddingHorizontal: 24 },

  emptyState: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  emptyIcon:  { fontSize: 40, marginBottom: 12 },
  emptyTxt:   { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 6, textAlign: 'center' },
  emptyHint:  { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },

  fab: {
    position: 'absolute', bottom: Platform.OS === 'web' ? 80 : 100, right: 24,
    width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40, shadowRadius: 12, elevation: 8,
  },
  fabIcon: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
});