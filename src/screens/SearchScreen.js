import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Platform, Image,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { NOTES, RECENT_SEARCHES } from '../data/staticData';
import icons from '../constants/icons';

const FILTERS = ['All', 'Work', 'School', 'Personal', 'Tasks'];

// Colored square backgrounds for result icons — no emoji
const ICON_BG = {
  Work:     '#FFF0E8',
  School:   '#E8F5EE',
  Personal: '#EEEAF6',
  Tasks:    '#E8F0F7',
};

const TAG_STYLE = {
  Work:     { bg: '#FFF0E8', color: '#C07850' },
  School:   { bg: '#E8F5EE', color: '#7BAB8B' },
  Personal: { bg: '#EEEAF6', color: '#8B7BAB' },
  Tasks:    { bg: '#E8F0F7', color: '#7BA7C0' },
};

// Category initial letter shown in colored box
const ICON_LETTER = {
  Work: 'W', School: 'S', Personal: 'P', Tasks: 'T',
};

const SEARCH_NOTES = [
  ...NOTES,
  {
    id: '5b',
    title: 'Notion Integration Notes',
    preview: 'Webhook setup for Notion integration. Auth token expires every 90 days — update…',
    category: 'Tasks',
    date: 'Apr 15',
  },
];

function HighlightedText({ text, query, style }) {
  if (!query) return <Text style={style}>{text}</Text>;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return <Text style={style}>{text}</Text>;
  return (
    <Text style={style}>
      {text.slice(0, idx)}
      <Text style={styles.highlight}>{text.slice(idx, idx + query.length)}</Text>
      {text.slice(idx + query.length)}
    </Text>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState('integration');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searches, setSearches] = useState(RECENT_SEARCHES);

  const results = SEARCH_NOTES.filter(n => {
    const matchesFilter = activeFilter === 'All' || n.category === activeFilter;
    const q = query.toLowerCase();
    const matchesQuery =
      n.title.toLowerCase().includes(q) || (n.preview || '').toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.searchBar}>
          <Image
            source={icons.searchDefault}
            style={styles.searchIconImg}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes…"
            placeholderTextColor={COLORS.textMuted}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll} contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterTxt, activeFilter === f && styles.filterTxtActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Results Count */}
        {!!query && (
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsCount}>
              <Text style={{ fontWeight: '700', color: COLORS.text }}>{results.length} results</Text>
              {' '}for "{query}"
            </Text>
            <Text style={styles.sortBtn}>Sort</Text>
          </View>
        )}

        {/* Result Cards — colored letter box replaces emoji */}
        {results.map(note => {
          const tag = TAG_STYLE[note.category] || TAG_STYLE.Work;
          const letter = ICON_LETTER[note.category] || '?';
          return (
            <View key={note.id} style={styles.resultCard}>
              <View style={[styles.resultIco, { backgroundColor: ICON_BG[note.category] }]}>
                <Text style={[styles.resultIcoLetter, { color: tag.color }]}>{letter}</Text>
              </View>
              <View style={styles.resultBody}>
                <HighlightedText text={note.title} query={query} style={styles.resultTitle} />
                <HighlightedText
                  text={note.preview || ''}
                  query={query}
                  style={styles.resultPreview}
                />
                <View style={styles.resultFoot}>
                  <View style={[styles.resultCat, { backgroundColor: tag.bg }]}>
                    <Text style={[styles.resultCatTxt, { color: tag.color }]}>{note.category}</Text>
                  </View>
                  <Text style={styles.resultDate}>{note.date}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Recent Searches — history icon replaces clock emoji */}
        <Text style={styles.recentTitle}>Recent Searches</Text>
        {searches.map((s, i) => (
          <View key={i} style={styles.recentItem}>
            <Image
              source={icons.history}
              style={styles.recentIcon}
              resizeMode="contain"
            />
            <Text style={styles.recentTxt}>{s}</Text>
            <TouchableOpacity onPress={() => setSearches(prev => prev.filter((_, j) => j !== i))}>
              <Text style={styles.recentClear}>X</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24 },

  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 20 : 12,
    paddingBottom: 14,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13,
    borderWidth: 2, borderColor: COLORS.accent,
  },
  searchIconImg: { width: 16, height: 16, tintColor: COLORS.textMuted },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.text },
  clearBtn: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },

  filterScroll: { marginBottom: 4 },
  filterContent: { paddingHorizontal: 24, gap: 8, paddingBottom: 12 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  filterTxt: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },
  filterTxtActive: { color: '#fff' },

  resultsInfo: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultsCount: { fontSize: 13, color: COLORS.textMuted },
  sortBtn: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },

  resultCard: {
    flexDirection: 'row', gap: 14, alignItems: 'flex-start',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 16, ...SHADOW.card, marginBottom: 12,
  },
  resultIco: {
    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  resultIcoLetter: { fontSize: 16, fontWeight: '700' },
  resultBody: { flex: 1, minWidth: 0 },
  resultTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  resultPreview: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18, marginBottom: 8 },
  highlight: { backgroundColor: '#FFF0C0', color: COLORS.text, borderRadius: 3 },
  resultFoot: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultCat: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  resultCatTxt: { fontSize: 10, fontWeight: '600' },
  resultDate: { fontSize: 10, color: COLORS.textMuted, marginLeft: 'auto' },

  recentTitle: {
    fontSize: 15, fontWeight: '600', color: COLORS.text, marginTop: 20, marginBottom: 8,
  },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  recentIcon: { width: 16, height: 16, tintColor: COLORS.textMuted, opacity: 0.6 },
  recentTxt: { fontSize: 13, fontWeight: '500', color: COLORS.text, flex: 1 },
  recentClear: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
});