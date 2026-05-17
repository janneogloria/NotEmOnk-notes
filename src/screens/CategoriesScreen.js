import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, Modal, TextInput,
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

const TAG_COLORS = [
  { color: '#C07850', light: '#FFF0E8' },
  { color: '#7BAB8B', light: '#E8F5EE' },
  { color: '#8B7BAB', light: '#EEEAF6' },
  { color: '#7BA7C0', light: '#E8F0F7' },
  { color: '#C0A050', light: '#FBF6E8' },
  { color: '#C07070', light: '#FFEDED' },
];

const INITIAL_TAGS = [
  { id: 't1', label: '#urgent',   color: '#C07850', light: '#FFF0E8' },
  { id: 't2', label: '#exam',     color: '#7BAB8B', light: '#E8F5EE' },
  { id: 't3', label: '#reading',  color: '#8B7BAB', light: '#EEEAF6' },
  { id: 't4', label: '#meeting',  color: '#7BA7C0', light: '#E8F0F7' },
  { id: 't5', label: '#idea',     color: '#C0A050', light: '#FBF6E8' },
  { id: 't6', label: '#health',   color: '#C07070', light: '#FFEDED' },
  { id: 't7', label: '#project',  color: '#7BAB8B', light: '#E8F5EE' },
  { id: 't8', label: '#deadline', color: '#C07850', light: '#FFF0E8' },
  { id: 't9', label: '#task',     color: '#C07070', light: '#FFEDED' },
];

export default function CategoriesScreen({ navigation }) {
  const { notes } = useNotes();

  const [activeFilter, setActiveFilter] = useState(null);
  const [activeTag,    setActiveTag]    = useState(null);
  const [editMode,     setEditMode]     = useState(false);

  // Tags stored with id so we can edit in place
  const [tags,         setTags]         = useState(INITIAL_TAGS);
  const [editingTagId, setEditingTagId] = useState(null); // tag being renamed
  const [editingTagVal,setEditingTagVal]= useState('');

  // Category rename
  const [catNames,      setCatNames]      = useState(
    Object.fromEntries(CATEGORY_META.map(c => [c.name, c.name]))
  );
  const [editingCat,    setEditingCat]    = useState(null);
  const [editingCatVal, setEditingCatVal] = useState('');

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

  // ── Tag actions ────────────────────────────────────────────────────────────
  const handleTagPress = (tag) => {
    if (editMode) {
      // Enter rename mode for this tag
      setEditingTagId(tag.id);
      setEditingTagVal(tag.label);
      return;
    }
    setActiveTag(t => t === tag.label ? null : tag.label);
    setActiveFilter(null);
  };

  const commitTagRename = (id) => {
    const val = editingTagVal.trim();
    if (!val) { setEditingTagId(null); return; }
    const label = val.startsWith('#') ? val : '#' + val;
    setTags(prev => prev.map(t => t.id === id ? { ...t, label } : t));
    setEditingTagId(null);
  };

  const deleteTag = (id) => {
    setTags(prev => prev.filter(t => t.id !== id));
    setEditingTagId(null);
  };

  const handleAddTag = () => {
    const idx   = tags.length % TAG_COLORS.length;
    const { color, light } = TAG_COLORS[idx];
    const newTag = { id: 'tag_' + Date.now(), label: '', color, light };
    setTags(prev => [...prev, newTag]);
    // Immediately open rename input for the new tag
    setEditingTagId(newTag.id);
    setEditingTagVal('');
    setEditMode(true); // ensure edit mode is on so input shows
  };

  // ── Category actions ───────────────────────────────────────────────────────
  const handleCatPress = (origName) => {
    if (editMode) {
      setEditingCat(origName);
      setEditingCatVal(catNames[origName]);
      return;
    }
    setActiveFilter(f => f === origName ? null : origName);
    setActiveTag(null);
  };

  const commitCatRename = (origName) => {
    const val = editingCatVal.trim();
    if (val && val !== origName) {
      setCatNames(prev => ({ ...prev, [origName]: val }));
    }
    setEditingCat(null);
  };

  const activeCatMeta  = CATEGORY_META.find(c => c.name === activeFilter);
  const activeTagMeta  = tags.find(t => t.label === activeTag);
  const bannerColor    = activeCatMeta?.color || activeTagMeta?.color || COLORS.accent;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Categories</Text>
          <TouchableOpacity
            style={[styles.editBtn, editMode && styles.editBtnActive]}
            onPress={() => { setEditMode(e => !e); setEditingCat(null); setEditingTagId(null); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.editTxt, editMode && styles.editTxtActive]}>
              {editMode ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {editMode && (
          <Text style={styles.editHint}>Tap any category or tag to rename it</Text>
        )}

        {/* Active Filter Banner */}
        {!editMode && (activeFilter || activeTag) && (
          <View style={styles.filterBanner}>
            <View style={[styles.filterDot, { backgroundColor: bannerColor }]} />
            <Text style={styles.filterText}>
              {activeFilter ? `Category: ${catNames[activeFilter] || activeFilter}` : `Tag: ${activeTag}`}
            </Text>
            <Text style={styles.filterCount}>
              {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity onPress={() => { setActiveFilter(null); setActiveTag(null); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.filterClear}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Filtered Notes */}
        {!editMode && filteredNotes.length > 0 && (
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
        </View>

        <View style={styles.grid}>
          {CATEGORY_META.map(cat => {
            const displayName = catNames[cat.name] || cat.name;
            const count       = catCounts[cat.name] || 0;
            const progress    = Math.min(count / totalNotes, 1);
            const isEditing   = editingCat === cat.name;

            return (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.catCard, { borderTopColor: cat.color },
                  !editMode && activeFilter === cat.name && styles.catCardActive,
                  editMode && styles.catCardEditMode,
                ]}
                onPress={() => handleCatPress(cat.name)}
                activeOpacity={0.85}
              >
                <View style={[styles.catBgCircle, { backgroundColor: cat.color }]} />
                <View style={[styles.catIconBlock, { backgroundColor: cat.color + '22' }]}>
                  <View style={[styles.catIconDot, { backgroundColor: cat.color }]} />
                </View>

                {isEditing ? (
                  <TextInput
                    style={[styles.catRenameInput, { borderBottomColor: cat.color }]}
                    value={editingCatVal}
                    onChangeText={setEditingCatVal}
                    autoFocus
                    onBlur={() => commitCatRename(cat.name)}
                    onSubmitEditing={() => commitCatRename(cat.name)}
                    returnKeyType="done"
                  />
                ) : (
                  <Text style={styles.catName}>
                    {displayName}
                    {editMode && <Text style={styles.editPencil}> ✎</Text>}
                  </Text>
                )}

                <Text style={styles.catCount}>{count} note{count !== 1 ? 's' : ''}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { backgroundColor: cat.color, width: `${Math.round(progress * 100)}%` }]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tags */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <TouchableOpacity onPress={handleAddTag} activeOpacity={0.8}>
            <Text style={styles.seeAll}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsWrap}>
          {tags.map(tag => {
            const isEditingThis = editingTagId === tag.id;
            return (
              <View key={tag.id}>
                {isEditingThis ? (
                  <View style={[styles.tagEditRow, { backgroundColor: tag.light, borderColor: tag.color }]}>
                    <TextInput
                      style={[styles.tagEditInput, { color: tag.color }]}
                      value={editingTagVal}
                      onChangeText={setEditingTagVal}
                      autoFocus
                      placeholder="#newtag"
                      placeholderTextColor={tag.color + '80'}
                      onSubmitEditing={() => commitTagRename(tag.id)}
                      returnKeyType="done"
                    />
                    <TouchableOpacity onPress={() => commitTagRename(tag.id)} style={[styles.tagSaveBtn, { backgroundColor: tag.color }]}>
                      <Text style={styles.tagSaveTxt}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTag(tag.id)} style={styles.tagDeleteBtn}>
                      <Text style={[styles.tagDeleteTxt, { color: tag.color }]}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.tagChip,
                      { backgroundColor: tag.light },
                      !editMode && activeTag === tag.label && { borderWidth: 2, borderColor: tag.color },
                    ]}
                    onPress={() => handleTagPress(tag)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                    <Text style={[styles.tagText, { color: tag.color }]}>
                      {tag.label || '(unnamed)'}
                    </Text>
                    {editMode && <Text style={[styles.tagEditIcon, { color: tag.color }]}> ✎</Text>}
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  editBtn: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border,
  },
  editBtnActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  editTxt:       { fontSize: 13, color: COLORS.accent, fontWeight: '500' },
  editTxtActive: { color: '#fff' },
  editHint:      { fontSize: 12, color: COLORS.textMuted, paddingHorizontal: 24, marginBottom: 12, fontStyle: 'italic' },

  filterBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 24, marginBottom: 16,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    paddingHorizontal: 16, paddingVertical: 14, ...SHADOW.light,
  },
  filterDot:   { width: 8, height: 8, borderRadius: 4 },
  filterText:  { fontSize: 13, fontWeight: '500', color: COLORS.text, flex: 1 },
  filterCount: { fontSize: 12, color: COLORS.textMuted },
  filterClear: { fontSize: 16, color: COLORS.textMuted, fontWeight: '600' },

  filteredNotes: { paddingHorizontal: 24, marginBottom: 16 },
  filteredNote: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    padding: 14, ...SHADOW.light, marginBottom: 8,
  },
  filteredDot:   { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  filteredTitle: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  filteredDate:  { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  seeAll:       { fontSize: 13, color: COLORS.accent, fontWeight: '500' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 24, marginBottom: 8 },

  catCard: {
    width: '47%', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 18, borderTopWidth: 3, ...SHADOW.card, overflow: 'hidden', position: 'relative',
  },
  catCardActive:   { borderWidth: 2, borderColor: COLORS.accent },
  catCardEditMode: { borderStyle: 'dashed', borderWidth: 1.5, borderColor: COLORS.border },
  catBgCircle:     { position: 'absolute', bottom: -24, right: -20, width: 72, height: 72, borderRadius: 36, opacity: 0.10 },
  catIconBlock:    { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  catIconDot:      { width: 14, height: 14, borderRadius: 7 },
  catName:         { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  editPencil:      { fontSize: 12, color: COLORS.textMuted, fontWeight: '400' },
  catRenameInput:  {
    fontSize: 14, fontWeight: '700', color: COLORS.text,
    borderBottomWidth: 2, paddingVertical: 4, marginBottom: 4,
  },
  catCount:      { fontSize: 11, color: COLORS.textMuted, marginBottom: 10 },
  progressTrack: { height: 3, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: 3 },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 24 },

  tagChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 13, paddingVertical: 7, borderRadius: RADIUS.full,
  },
  tagDot:     { width: 6, height: 6, borderRadius: 3 },
  tagText:    { fontSize: 12, fontWeight: '500' },
  tagEditIcon:{ fontSize: 11 },

  tagEditRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 1.5, minWidth: 160,
  },
  tagEditInput:  { flex: 1, fontSize: 12, fontWeight: '500', paddingVertical: 2 },
  tagSaveBtn:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  tagSaveTxt:    { fontSize: 11, color: '#fff', fontWeight: '600' },
  tagDeleteBtn:  { padding: 4 },
  tagDeleteTxt:  { fontSize: 13, fontWeight: '700' },
});