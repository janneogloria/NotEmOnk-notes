import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, Alert, Modal,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useNotes } from '../context/NotesContext';

const CATEGORY_META = [
  { name: 'Work',     color: '#C07850', light: '#FFF0E8' },
  { name: 'School',  color: '#7BAB8B', light: '#E8F5EE' },
  { name: 'Personal',color: '#8B7BAB', light: '#EEEAF6' },
  { name: 'Tasks',   color: '#7BA7C0', light: '#E8F0F7' },
  { name: 'Ideas',   color: '#C0A050', light: '#FBF6E8' },
  { name: 'Journal', color: '#C07070', light: '#FFEDED' },
];

const INITIAL_TAGS = [
  { label: '#urgent',   color: '#C07850', light: '#FFF0E8' },
  { label: '#exam',     color: '#7BAB8B', light: '#E8F5EE' },
  { label: '#reading',  color: '#8B7BAB', light: '#EEEAF6' },
  { label: '#meeting',  color: '#7BA7C0', light: '#E8F0F7' },
  { label: '#idea',     color: '#C0A050', light: '#FBF6E8' },
  { label: '#health',   color: '#C07070', light: '#FFEDED' },
  { label: '#project',  color: '#7BAB8B', light: '#E8F5EE' },
  { label: '#deadline', color: '#C07850', light: '#FFF0E8' },
  { label: '#review',   color: '#8B7BAB', light: '#EEEAF6' },
  { label: '#travel',   color: '#C0A050', light: '#FBF6E8' },
  { label: '#task',     color: '#C07070', light: '#FFEDED' },
  { label: '#finance',  color: '#7BA7C0', light: '#E8F0F7' },
];

export default function CategoriesScreen({ navigation }) {
  const { notes } = useNotes();
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeTag,    setActiveTag]    = useState(null);
  const [tags, setTags]                 = useState(INITIAL_TAGS);
  const [editMode, setEditMode]         = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [extraCats, setExtraCats]       = useState([]);

  const allCats = [...CATEGORY_META, ...extraCats];

  const catCounts = useMemo(() => {
    const counts = {};
    notes.forEach(n => { counts[n.category] = (counts[n.category] || 0) + 1; });
    return counts;
  }, [notes]);

  const totalNotes = notes.length || 1;

  const filteredNotes = useMemo(() => {
    if (activeTag)    return notes.filter(n => n.tags?.includes(activeTag));
    if (activeFilter) return notes.filter(n => n.category === activeFilter);
    return [];
  }, [notes, activeFilter, activeTag]);

  const handleTagPress = (label) => {
    if (editMode) { setTags(prev => prev.filter(t => t.label !== label)); return; }
    setActiveTag(t => t === label ? null : label);
    setActiveFilter(null);
  };

  const handleCatPress = (name) => {
    setActiveFilter(f => f === name ? null : name);
    setActiveTag(null);
  };

  const handleAddTag = () => {
    const colors = ['#C07850','#7BAB8B','#8B7BAB','#7BA7C0','#C0A050','#C07070'];
    const lights = ['#FFF0E8','#E8F5EE','#EEEAF6','#E8F0F7','#FBF6E8','#FFEDED'];
    const i = tags.length % colors.length;
    const newLabel = `#tag${tags.length + 1}`;
    setTags(prev => [...prev, { label: newLabel, color: colors[i], light: lights[i] }]);
    Alert.alert('Tag Added', `"${newLabel}" has been added.`);
  };

  const activeCatMeta = allCats.find(c => c.name === activeFilter);
  const activeTagMeta = tags.find(t => t.label === activeTag);
  const bannerColor   = activeCatMeta?.color || activeTagMeta?.color || COLORS.accent;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Categories</Text>
          <TouchableOpacity
            style={[styles.editBtn, editMode && styles.editBtnActive]}
            onPress={() => setEditMode(e => !e)} activeOpacity={0.8}
          >
            <Text style={[styles.editTxt, editMode && styles.editTxtActive]}>{editMode ? 'Done' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Active Filter Banner */}
        {(activeFilter || activeTag) && (
          <View style={styles.filterBanner}>
            <View style={[styles.filterDot, { backgroundColor: bannerColor }]} />
            <Text style={styles.filterText}>
              {activeFilter ? `Category: ${activeFilter}` : `Tag: ${activeTag}`}
            </Text>
            <Text style={styles.filterCount}>{filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}</Text>
            <TouchableOpacity onPress={() => { setActiveFilter(null); setActiveTag(null); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.filterClear}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Filtered Notes */}
        {filteredNotes.length > 0 && (
          <View style={styles.filteredNotes}>
            {filteredNotes.map(n => (
              <TouchableOpacity
                key={n.id} style={styles.filteredNote}
                onPress={() => navigation.navigate('CreateNote', { note: n })}
                activeOpacity={0.85}
              >
                <View style={[styles.filteredDot, { backgroundColor: bannerColor }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.filteredTitle} numberOfLines={1}>{n.title}</Text>
                  <Text style={styles.filteredDate}>{n.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* My Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Categories</Text>
          <TouchableOpacity onPress={() => setShowNewModal(true)} activeOpacity={0.8}>
            <Text style={styles.seeAll}>+ New</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {allCats.map(cat => {
            const count    = catCounts[cat.name] || 0;
            const progress = Math.min(count / totalNotes, 1);
            return (
              <TouchableOpacity
                key={cat.name}
                style={[styles.catCard, { borderTopColor: cat.color }, activeFilter === cat.name && styles.catCardActive]}
                onPress={() => handleCatPress(cat.name)}
                activeOpacity={0.85}
              >
                <View style={[styles.catBgCircle, { backgroundColor: cat.color }]} />
                <View style={[styles.catIconBlock, { backgroundColor: cat.color + '22' }]}>
                  <View style={[styles.catIconDot, { backgroundColor: cat.color }]} />
                </View>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catCount}>{count} note{count !== 1 ? 's' : ''}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { backgroundColor: cat.color, width: `${Math.round(progress * 100)}%` }]} />
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.catCardAdd} onPress={() => setShowNewModal(true)} activeOpacity={0.8}>
            <Text style={styles.addPlus}>+</Text>
            <Text style={styles.addLabel}>Create new category</Text>
          </TouchableOpacity>
        </View>

        {/* Tags */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <TouchableOpacity onPress={handleAddTag} activeOpacity={0.8}>
            <Text style={styles.seeAll}>+ Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tagsWrap}>
          {tags.map(tag => (
            <TouchableOpacity
              key={tag.label}
              style={[styles.tagChip, { backgroundColor: tag.light }, activeTag === tag.label && { borderWidth: 2, borderColor: tag.color }]}
              onPress={() => handleTagPress(tag.label)} activeOpacity={0.7}
            >
              <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
              <Text style={[styles.tagText, { color: tag.color }]}>{tag.label}</Text>
              {editMode && <Text style={[styles.tagRemove, { color: tag.color }]}>✕</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* New Category Modal */}
      <Modal visible={showNewModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowNewModal(false)} activeOpacity={1}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Category</Text>
            <Text style={styles.modalSub}>Choose a type to add:</Text>
            {['Projects','Health','Finance','Travel','Recipes'].map((item, idx) => {
              const colors = ['#7BAB8B','#C07070','#7BA7C0','#C0A050','#8B7BAB'];
              const lights = ['#E8F5EE','#FFEDED','#E8F0F7','#FBF6E8','#EEEAF6'];
              return (
                <TouchableOpacity
                  key={item} style={styles.modalItem}
                  onPress={() => {
                    setExtraCats(prev => [...prev, { name: item, color: colors[idx % colors.length], light: lights[idx % lights.length] }]);
                    setShowNewModal(false);
                    Alert.alert('Created', `"${item}" category added.`);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalItemTxt}>{item}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowNewModal(false)}>
              <Text style={styles.modalCloseTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingTop: Platform.OS === 'web' ? 20 : 0 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  editBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.accentLight, borderWidth: 1.5, borderColor: 'rgba(192,120,80,0.25)' },
  editBtnActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  editTxt: { fontSize: 13, color: COLORS.accent, fontWeight: '500' },
  editTxtActive: { color: '#fff' },

  filterBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 24, marginBottom: 16, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingHorizontal: 16, paddingVertical: 14, ...SHADOW.light },
  filterDot: { width: 8, height: 8, borderRadius: 4 },
  filterText: { fontSize: 13, fontWeight: '500', color: COLORS.text, flex: 1 },
  filterCount: { fontSize: 12, color: COLORS.textMuted },
  filterClear: { fontSize: 16, color: COLORS.textMuted, fontWeight: '600' },

  filteredNotes: { paddingHorizontal: 24, marginBottom: 16 },
  filteredNote: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 14, ...SHADOW.light, marginBottom: 8 },
  filteredDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  filteredTitle: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  filteredDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.accent, fontWeight: '500' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 24, marginBottom: 8 },
  catCard: { width: '47%', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 18, borderTopWidth: 3, ...SHADOW.card, overflow: 'hidden', position: 'relative' },
  catCardActive: { borderWidth: 2, borderColor: COLORS.accent },
  catBgCircle: { position: 'absolute', bottom: -24, right: -20, width: 72, height: 72, borderRadius: 36, opacity: 0.10 },
  catIconBlock: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  catIconDot: { width: 14, height: 14, borderRadius: 7 },
  catName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  catCount: { fontSize: 11, color: COLORS.textMuted, marginBottom: 10 },
  progressTrack: { height: 3, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },

  catCardAdd: { width: '100%', borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.border, borderRadius: RADIUS.lg, paddingVertical: 24, alignItems: 'center', justifyContent: 'center', gap: 8 },
  addPlus: { fontSize: 26, color: COLORS.textMuted, opacity: 0.6 },
  addLabel: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 24 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 13, paddingVertical: 7, borderRadius: RADIUS.full },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  tagText: { fontSize: 12, fontWeight: '500' },
  tagRemove: { fontSize: 11, fontWeight: '700', marginLeft: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  modalSub: { fontSize: 13, color: COLORS.textMuted, marginBottom: 20 },
  modalItem: { backgroundColor: COLORS.bg, borderRadius: RADIUS.md, padding: 14, marginBottom: 10 },
  modalItemTxt: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  modalCloseBtn: { marginTop: 8, alignItems: 'center', padding: 12 },
  modalCloseTxt: { fontSize: 14, color: COLORS.textMuted, fontWeight: '500' },
});