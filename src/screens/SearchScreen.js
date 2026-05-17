import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Platform, Image,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useNotes } from '../context/NotesContext';
import icons from '../constants/icons';

const FILTERS = ['All', 'Work', 'School', 'Personal', 'Tasks', 'Ideas'];

const TAG_STYLE = {
  Work:     { bg: '#FFF0E8', color: '#C07850' },
  School:   { bg: '#E8F5EE', color: '#7BAB8B' },
  Personal: { bg: '#EEEAF6', color: '#8B7BAB' },
  Tasks:    { bg: '#E8F0F7', color: '#7BA7C0' },
  Ideas:    { bg: '#FBF6E8', color: '#C0A050' },
  Journal:  { bg: '#FFEDED', color: '#C07070' },
};
const ICON_BG     = { Work: '#FFF0E8', School: '#E8F5EE', Personal: '#EEEAF6', Tasks: '#E8F0F7', Ideas: '#FBF6E8', Journal: '#FFEDED' };
const ICON_LETTER = { Work: 'W', School: 'S', Personal: 'P', Tasks: 'T', Ideas: 'I', Journal: 'J' };

function HighlightedText({ text, query, style }) {
  if (!query || !text) return <Text style={style}>{text || ''}</Text>;
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

export default function SearchScreen({ navigation }) {
  const { notes } = useNotes();
  const [query, setQuery]               = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [recentSearches, setRecentSearches] = useState([
    'calculus exam notes', 'grocery list', 'Q3 roadmap', 'book recommendations',
  ]);

  const results = query.length > 0
    ? notes.filter(n => {
        const matchFilter = activeFilter === 'All' || n.category === activeFilter;
        if (!matchFilter) return false;
        const q = query.toLowerCase();
        return (
          (n.title   || '').toLowerCase().includes(q) ||
          (n.content || n.preview || '').toLowerCase().includes(q) ||
          (n.tags    || []).some(t => t.toLowerCase().includes(q)) ||
          (n.category || '').toLowerCase().includes(q)
        );
      })
    : [];

  const handleSubmit = () => {
    const q = query.trim();
    if (q && !recentSearches.includes(q)) {
      setRecentSearches(prev => [q, ...prev].slice(0, 6));
    }
  };

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.searchBar}>
          <Image source={icons.searchDefault} style={styles.searchIconImg} resizeMode="contain" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            placeholder="Search notes, tags, categories…"
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="search"
            autoCorrect={false}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)} activeOpacity={0.8}
          >
            <Text style={[styles.filterTxt, activeFilter === f && styles.filterTxtActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {query.length > 0 && (
          <>
            <View style={styles.resultsInfo}>
              <Text style={styles.resultsCount}>
                <Text style={{ fontWeight: '700', color: COLORS.text }}>{results.length}</Text>
                {' '}result{results.length !== 1 ? 's' : ''} for "{query}"
              </Text>
            </View>

            {results.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTxt}>No notes found</Text>
                <Text style={styles.emptyHint}>Try a different keyword or filter</Text>
              </View>
            )}

            {results.map(note => {
              const tag    = TAG_STYLE[note.category]   || TAG_STYLE.Work;
              const letter = ICON_LETTER[note.category] || '?';
              const preview = note.content || note.preview || '';
              return (
                <TouchableOpacity
                  key={note.id} style={styles.resultCard}
                  onPress={() => navigation.navigate('CreateNote', { note })}
                  activeOpacity={0.85}
                >
                  <View style={[styles.resultIco, { backgroundColor: ICON_BG[note.category] || '#FFF0E8' }]}>
                    <Text style={[styles.resultIcoLetter, { color: tag.color }]}>{letter}</Text>
                  </View>
                  <View style={styles.resultBody}>
                    <HighlightedText text={note.title} query={query} style={styles.resultTitle} />
                    <HighlightedText text={preview} query={query} style={styles.resultPreview} />
                    {note.tags && note.tags.length > 0 && (
                      <View style={styles.tagsRow}>
                        {note.tags.slice(0, 3).map(t => (
                          <View key={t} style={[styles.tagPill, { backgroundColor: tag.bg }]}>
                            <Text style={[styles.tagPillTxt, { color: tag.color }]}>{t}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    <View style={styles.resultFoot}>
                      <View style={[styles.resultCat, { backgroundColor: tag.bg }]}>
                        <Text style={[styles.resultCatTxt, { color: tag.color }]}>{note.category}</Text>
                      </View>
                      <Text style={styles.resultDate}>{note.date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {query.length === 0 && recentSearches.length > 0 && (
          <>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={() => setRecentSearches([])}>
                <Text style={styles.clearAllBtn}>Clear all</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((s, i) => (
              <TouchableOpacity key={i} style={styles.recentItem} onPress={() => setQuery(s)} activeOpacity={0.7}>
                <Image source={icons.history} style={styles.recentIcon} resizeMode="contain" />
                <Text style={styles.recentTxt}>{s}</Text>
                <TouchableOpacity
                  onPress={() => setRecentSearches(prev => prev.filter((_, j) => j !== i))}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.recentClear}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        )}

        {query.length === 0 && recentSearches.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTxt}>Start typing to search</Text>
            <Text style={styles.emptyHint}>Search by title, content, tags, or category</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24 },

  header: { paddingHorizontal: 24, paddingTop: Platform.OS === 'web' ? 20 : 12, paddingBottom: 14 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13,
    borderWidth: 2, borderColor: COLORS.accent,
  },
  searchIconImg: { width: 16, height: 16, tintColor: COLORS.textMuted },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.text },
  clearBtn: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },

  filterScroll: { flexGrow: 0, marginBottom: 4 },
  filterContent: { paddingHorizontal: 24, gap: 8, paddingBottom: 12, paddingTop: 4, flexDirection: 'row', alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border,
    alignSelf: 'flex-start', flexShrink: 0,
  },
  filterChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  filterTxt: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },
  filterTxtActive: { color: '#fff' },

  resultsInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  resultsCount: { fontSize: 13, color: COLORS.textMuted },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTxt: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  emptyHint: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },

  resultCard: {
    flexDirection: 'row', gap: 14, alignItems: 'flex-start',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 16, ...SHADOW.card, marginBottom: 12,
  },
  resultIco: { width: 42, height: 42, borderRadius: 12, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  resultIcoLetter: { fontSize: 16, fontWeight: '700' },
  resultBody: { flex: 1, minWidth: 0 },
  resultTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  resultPreview: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18, marginBottom: 6 },
  highlight: { backgroundColor: '#FFF0C0', color: COLORS.text, borderRadius: 3 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  tagPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  tagPillTxt: { fontSize: 10, fontWeight: '600' },
  resultFoot: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultCat: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  resultCatTxt: { fontSize: 10, fontWeight: '600' },
  resultDate: { fontSize: 10, color: COLORS.textMuted, marginLeft: 'auto' },

  recentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, marginTop: 8 },
  recentTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  clearAllBtn: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },
  recentItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  recentIcon: { width: 16, height: 16, tintColor: COLORS.textMuted, opacity: 0.6 },
  recentTxt: { fontSize: 13, fontWeight: '500', color: COLORS.text, flex: 1 },
  recentClear: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
});