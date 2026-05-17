import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Platform, Alert, Modal,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useNotes } from '../context/NotesContext';

const CATEGORIES = ['Work', 'School', 'Personal', 'Tasks', 'Ideas', 'Journal'];

const COLORS_LIST = [
  { name: 'orange', hex: '#C07850', label: 'Orange' },
  { name: 'green',  hex: '#7BAB8B', label: 'Green'  },
  { name: 'purple', hex: '#8B7BAB', label: 'Purple' },
  { name: 'blue',   hex: '#7BA7C0', label: 'Blue'   },
  { name: 'gold',   hex: '#C0A050', label: 'Gold'   },
  { name: 'red',    hex: '#C07070', label: 'Red'    },
];

const ALL_TAGS = [
  '#urgent','#exam','#reading','#meeting','#idea',
  '#health','#project','#deadline','#review','#travel','#task','#finance',
];

const FMT_BUTTONS = [
  { key: 'B',     label: 'B',  style: 'bold'          },
  { key: 'I',     label: 'I',  style: 'italic'        },
  { key: 'U',     label: 'U',  style: 'underline'     },
  { key: 'S',     label: 'S',  style: 'strikethrough' },
  { key: 'sep1',  sep: true },
  { key: 'H1',    label: 'H1', style: 'h1'            },
  { key: 'H2',    label: 'H2', style: 'h2'            },
  { key: 'sep2',  sep: true },
  { key: 'List',  label: '≡',  style: 'bullet'        },
  { key: 'Check', label: '☑',  style: 'check'         },
];

const REMINDER_OPTS = [
  'In 30 minutes', 'In 1 hour', 'Tonight at 8 PM',
  'Tomorrow morning', 'Tomorrow evening', 'This weekend',
];

let itemCounter = 100;
function newItemId() { return `item_${++itemCounter}`; }

export default function CreateNoteScreen({ route, navigation }) {
  const { saveNote } = useNotes();
  const existing = route?.params?.note;

  const [title, setTitle]         = useState(existing?.title    || '');
  const [content, setContent]     = useState(existing?.content  || '');
  const [category, setCategory]   = useState(existing?.category || 'Work');
  const [color, setColor]         = useState(existing?.color    || 'orange');
  const [tags, setTags]           = useState(existing?.tags     || []);
  const [pinned, setPinned]       = useState(existing?.pinned   || false);
  const [favorite, setFavorite]   = useState(existing?.favorite || false);
  const [reminder, setReminder]   = useState(existing?.reminder || null);
  const [checklist, setChecklist] = useState(existing?.checklist || []);
  const [activeFormat, setActiveFormat] = useState(null);

  const [showTagModal,      setShowTagModal]      = useState(false);
  const [showColorModal,    setShowColorModal]     = useState(false);
  const [showReminderModal, setShowReminderModal]  = useState(false);
  const [showCatModal,      setShowCatModal]       = useState(false);
  const [newItemText,       setNewItemText]        = useState('');
  const [addingItem,        setAddingItem]         = useState(false);

  const currentColorHex = COLORS_LIST.find(c => c.name === color)?.hex || '#C07850';

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please add a title before saving.');
      return;
    }
    saveNote({
      id: existing?.id,
      title: title.trim(),
      content: content.trim(),
      category, color, tags, pinned, favorite, reminder, checklist,
    });
    navigation.goBack();
  }, [title, content, category, color, tags, pinned, favorite, reminder, checklist, existing]);

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const toggleCheckItem = (id) => {
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const addCheckItem = () => {
    const text = newItemText.trim();
    if (!text) return;
    setChecklist(prev => [...prev, { id: newItemId(), text, done: false }]);
    setNewItemText('');
    setAddingItem(false);
  };

  const removeCheckItem = (id) => {
    setChecklist(prev => prev.filter(i => i.id !== id));
  };

  const doneCount = checklist.filter(i => i.done).length;

  return (
    <SafeAreaView style={styles.safe}>

      {/* Top Bar */}
      <View style={[styles.topBar, { borderBottomColor: currentColorHex + '40' }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{existing ? 'Edit Note' : 'New Note'}</Text>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: currentColorHex }]}
          onPress={handleSave} activeOpacity={0.85}
        >
          <Text style={styles.saveTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Action Chips */}
      <View style={styles.chipsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContent}>

          <TouchableOpacity
            style={[styles.chip, { borderColor: currentColorHex, backgroundColor: currentColorHex + '18' }]}
            onPress={() => setShowCatModal(true)} activeOpacity={0.8}
          >
            <Text style={[styles.chipTxt, { color: currentColorHex }]}>{category}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, tags.length > 0 && styles.chipFilled]}
            onPress={() => setShowTagModal(true)} activeOpacity={0.8}
          >
            <Text style={[styles.chipTxt, tags.length > 0 && styles.chipTxtFilled]}>
              {tags.length > 0 ? `${tags.length} Tag${tags.length > 1 ? 's' : ''}` : '+ Tag'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, reminder && styles.chipFilled]}
            onPress={() => setShowReminderModal(true)} activeOpacity={0.8}
          >
            <Text style={[styles.chipTxt, reminder && styles.chipTxtFilled]}>
              {reminder ? `⏰ ${reminder}` : 'Remind'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, pinned && styles.chipFilled]}
            onPress={() => setPinned(p => !p)} activeOpacity={0.8}
          >
            <Text style={[styles.chipTxt, pinned && styles.chipTxtFilled]}>
              {pinned ? '📌 Pinned' : 'Pin'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, favorite && styles.chipFavorite]}
            onPress={() => setFavorite(f => !f)} activeOpacity={0.8}
          >
            <Text style={[styles.chipTxt, favorite && styles.chipTxtFavorite]}>
              {favorite ? '★ Favorited' : '☆ Favorite'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, { borderColor: currentColorHex }]}
            onPress={() => setShowColorModal(true)} activeOpacity={0.8}
          >
            <View style={[styles.colorDot, { backgroundColor: currentColorHex }]} />
            <Text style={[styles.chipTxt, { color: currentColorHex }]}>Color</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      {/* Editor */}
      <ScrollView style={styles.editorScroll} contentContainerStyle={styles.editorContent}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <View style={[styles.editorCard, { borderTopColor: currentColorHex, borderTopWidth: 3 }]}>

          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Note title…"
            placeholderTextColor="rgba(44,36,22,0.25)"
            multiline
          />
          <View style={styles.divider} />

          {/* Formatting Toolbar */}
          <View style={styles.fmtRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fmtContent}>
              {FMT_BUTTONS.map(btn =>
                btn.sep
                  ? <View key={btn.key} style={styles.fmtSep} />
                  : (
                    <TouchableOpacity
                      key={btn.key}
                      style={[styles.fmtBtn, activeFormat === btn.style && styles.fmtBtnActive]}
                      onPress={() => setActiveFormat(f => f === btn.style ? null : btn.style)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.fmtTxt,
                        btn.style === 'bold'          && styles.fmtBold,
                        btn.style === 'italic'        && styles.fmtItalic,
                        btn.style === 'underline'     && styles.fmtUnderline,
                        btn.style === 'strikethrough' && styles.fmtStrike,
                        activeFormat === btn.style    && styles.fmtTxtActive,
                      ]}>
                        {btn.label}
                      </Text>
                    </TouchableOpacity>
                  )
              )}
            </ScrollView>
          </View>
          <View style={styles.divider} />

          {/* Content Area */}
          <View style={styles.contentArea}>
            <TextInput
              style={[
                styles.bodyInput,
                activeFormat === 'bold'          && { fontWeight: '700' },
                activeFormat === 'italic'        && { fontStyle: 'italic' },
                activeFormat === 'underline'     && { textDecorationLine: 'underline' },
                activeFormat === 'strikethrough' && { textDecorationLine: 'line-through' },
                activeFormat === 'h1'            && { fontSize: 20, fontWeight: '700' },
                activeFormat === 'h2'            && { fontSize: 16, fontWeight: '600' },
              ]}
              value={content}
              onChangeText={setContent}
              placeholder="Start writing here…"
              placeholderTextColor="rgba(44,36,22,0.25)"
              multiline
            />

            {/* Checklist */}
            {(checklist.length > 0 || addingItem) && (
              <>
                <View style={styles.checklistHeader}>
                  <Text style={styles.sectionLabel}>CHECKLIST</Text>
                  {checklist.length > 0 && (
                    <Text style={styles.checkProgress}>{doneCount}/{checklist.length} done</Text>
                  )}
                </View>

                {checklist.map(item => (
                  <View key={item.id} style={styles.checkRow}>
                    <TouchableOpacity
                      style={[styles.checkbox, item.done && { backgroundColor: currentColorHex, borderColor: currentColorHex }]}
                      onPress={() => toggleCheckItem(item.id)}
                    >
                      {item.done && <Text style={styles.checkMark}>✓</Text>}
                    </TouchableOpacity>
                    <Text style={[styles.checkText, item.done && styles.checkTextDone]} numberOfLines={2}>
                      {item.text}
                    </Text>
                    <TouchableOpacity onPress={() => removeCheckItem(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Text style={styles.removeItem}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {addingItem && (
                  <View style={styles.addItemInput}>
                    <TextInput
                      style={styles.addItemField}
                      value={newItemText}
                      onChangeText={setNewItemText}
                      placeholder="New item…"
                      placeholderTextColor="rgba(44,36,22,0.3)"
                      autoFocus
                      onSubmitEditing={addCheckItem}
                      returnKeyType="done"
                    />
                    <TouchableOpacity onPress={addCheckItem} style={[styles.addItemConfirm, { backgroundColor: currentColorHex }]}>
                      <Text style={styles.addItemConfirmTxt}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setAddingItem(false)} style={styles.addItemCancel}>
                      <Text style={styles.addItemCancelTxt}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}

            <TouchableOpacity style={styles.addItemRow} onPress={() => setAddingItem(true)} activeOpacity={0.7}>
              <Text style={[styles.addItemTxt, { color: currentColorHex }]}>+ Add checklist item</Text>
            </TouchableOpacity>

            {tags.length > 0 && (
              <View style={styles.tagsDisplay}>
                {tags.map(t => (
                  <TouchableOpacity key={t} style={[styles.tagChip, { backgroundColor: currentColorHex + '18' }]}
                    onPress={() => toggleTag(t)}>
                    <Text style={[styles.tagChipTxt, { color: currentColorHex }]}>{t} ✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.wordCountBar}>
            <Text style={styles.wordCountTxt}>
              {content.trim() ? content.trim().split(/\s+/).length : 0} words
            </Text>
            <Text style={styles.wordCountTxt}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Tag Modal */}
      <Modal visible={showTagModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowTagModal(false)} activeOpacity={1}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Tags</Text>
            <Text style={styles.modalSub}>Tap to toggle. Selected tags appear on the note.</Text>
            <View style={styles.tagGrid}>
              {ALL_TAGS.map(tag => {
                const active = tags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagOption, active && { backgroundColor: currentColorHex, borderColor: currentColorHex }]}
                    onPress={() => toggleTag(tag)} activeOpacity={0.8}
                  >
                    <Text style={[styles.tagOptionTxt, active && { color: '#fff' }]}>{tag}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={[styles.modalDoneBtn, { backgroundColor: currentColorHex }]} onPress={() => setShowTagModal(false)}>
              <Text style={styles.modalDoneTxt}>Done ({tags.length} selected)</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Color Modal */}
      <Modal visible={showColorModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowColorModal(false)} activeOpacity={1}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Note Color</Text>
            <Text style={styles.modalSub}>Choose a color for this note.</Text>
            <View style={styles.colorGrid}>
              {COLORS_LIST.map(c => (
                <TouchableOpacity
                  key={c.name}
                  style={[styles.colorOption, { backgroundColor: c.hex }, color === c.name && styles.colorOptionActive]}
                  onPress={() => { setColor(c.name); setShowColorModal(false); }}
                  activeOpacity={0.8}
                >
                  {color === c.name && <Text style={styles.colorCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Reminder Modal */}
      <Modal visible={showReminderModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowReminderModal(false)} activeOpacity={1}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Set Reminder</Text>
            <Text style={styles.modalSub}>When should we remind you?</Text>
            {reminder && (
              <TouchableOpacity style={styles.clearReminder} onPress={() => { setReminder(null); setShowReminderModal(false); }}>
                <Text style={styles.clearReminderTxt}>✕ Remove reminder</Text>
              </TouchableOpacity>
            )}
            {REMINDER_OPTS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.reminderOpt, reminder === opt && { backgroundColor: currentColorHex + '18', borderColor: currentColorHex }]}
                onPress={() => { setReminder(opt); setShowReminderModal(false); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.reminderOptTxt, reminder === opt && { color: currentColorHex, fontWeight: '600' }]}>{opt}</Text>
                {reminder === opt && <Text style={{ color: currentColorHex }}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowReminderModal(false)}>
              <Text style={styles.modalCloseTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Category Modal */}
      <Modal visible={showCatModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowCatModal(false)} activeOpacity={1}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Category</Text>
            <Text style={styles.modalSub}>Choose a category for this note.</Text>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.reminderOpt, category === cat && { backgroundColor: currentColorHex + '18', borderColor: currentColorHex }]}
                onPress={() => { setCategory(cat); setShowCatModal(false); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.reminderOptTxt, category === cat && { color: currentColorHex, fontWeight: '600' }]}>{cat}</Text>
                {category === cat && <Text style={{ color: currentColorHex }}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowCatModal(false)}>
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

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'web' ? 20 : 12,
    paddingBottom: 12, borderBottomWidth: 1,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', ...SHADOW.light,
  },
  backArrow: { fontSize: 18, color: COLORS.text },
  topBarTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  saveBtn: {
    paddingHorizontal: 22, paddingVertical: 9, borderRadius: RADIUS.full,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  saveTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },

  chipsRow: { height: 52, justifyContent: 'center' },
  chipsContent: { paddingHorizontal: 20, gap: 8, flexDirection: 'row', alignItems: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
    height: 34, justifyContent: 'center', flexShrink: 0,
  },
  chipFilled: { backgroundColor: COLORS.accentLight, borderColor: COLORS.accent },
  chipFavorite: { backgroundColor: '#FFF8E0', borderColor: '#C0A050' },
  chipTxt: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },
  chipTxtFilled: { color: COLORS.accent },
  chipTxtFavorite: { color: '#C0A050' },
  colorDot: { width: 10, height: 10, borderRadius: 5 },

  editorScroll: { flex: 1 },
  editorContent: { paddingHorizontal: 16 },
  editorCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.card },

  titleInput: {
    fontSize: 20, fontWeight: '700', color: COLORS.text,
    paddingHorizontal: 22, paddingTop: 18, paddingBottom: 12, lineHeight: 28, minHeight: 60,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 22 },

  fmtRow: { height: 50, justifyContent: 'center' },
  fmtContent: { paddingHorizontal: 14, gap: 4, alignItems: 'center', flexDirection: 'row' },
  fmtBtn: { paddingHorizontal: 10, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  fmtBtnActive: { backgroundColor: COLORS.accentLight },
  fmtTxt: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  fmtTxtActive: { color: COLORS.accent },
  fmtBold: { fontWeight: '900' },
  fmtItalic: { fontStyle: 'italic' },
  fmtUnderline: { textDecorationLine: 'underline' },
  fmtStrike: { textDecorationLine: 'line-through' },
  fmtSep: { width: 1, height: 22, backgroundColor: COLORS.border, marginHorizontal: 4 },

  contentArea: { padding: 22 },
  bodyInput: { fontSize: 14, color: COLORS.text, lineHeight: 22, minHeight: 100, paddingTop: 4 },

  checklistHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 16, marginBottom: 10,
  },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' },
  checkProgress: { fontSize: 11, color: COLORS.textMuted },

  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 2,
    borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkMark: { color: '#fff', fontSize: 11, fontWeight: '700' },
  checkText: { fontSize: 13, color: COLORS.text, flex: 1, lineHeight: 20 },
  checkTextDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  removeItem: { fontSize: 13, color: COLORS.textMuted, paddingHorizontal: 4 },

  addItemInput: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  addItemField: {
    flex: 1, fontSize: 13, color: COLORS.text,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingVertical: 6,
  },
  addItemConfirm: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.sm },
  addItemConfirmTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  addItemCancel: { padding: 6 },
  addItemCancelTxt: { fontSize: 14, color: COLORS.textMuted },

  addItemRow: {
    paddingVertical: 10, alignItems: 'center',
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: COLORS.border,
    borderRadius: RADIUS.sm, marginTop: 8, marginBottom: 8,
  },
  addItemTxt: { fontSize: 13, fontWeight: '500' },

  tagsDisplay: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tagChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full },
  tagChipTxt: { fontSize: 11, fontWeight: '500' },

  wordCountBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 22, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  wordCountTxt: { fontSize: 11, color: COLORS.textMuted },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, maxHeight: '80%',
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  modalSub: { fontSize: 13, color: COLORS.textMuted, marginBottom: 16 },

  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tagOption: {
    paddingHorizontal: 13, paddingVertical: 8, borderRadius: RADIUS.full,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bg,
  },
  tagOptionTxt: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },
  modalDoneBtn: { borderRadius: RADIUS.full, padding: 14, alignItems: 'center', marginTop: 4 },
  modalDoneTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },

  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginVertical: 16 },
  colorOption: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  colorOptionActive: { borderWidth: 3, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
  colorCheck: { color: '#fff', fontSize: 20, fontWeight: '700' },

  reminderOpt: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.bg, borderRadius: RADIUS.md, borderWidth: 1.5,
    borderColor: COLORS.border, padding: 14, marginBottom: 8,
  },
  reminderOptTxt: { fontSize: 14, color: COLORS.text },
  clearReminder: { marginBottom: 12 },
  clearReminderTxt: { fontSize: 13, color: COLORS.red, fontWeight: '500' },
  modalCloseBtn: { marginTop: 8, alignItems: 'center', padding: 12 },
  modalCloseTxt: { fontSize: 14, color: COLORS.textMuted, fontWeight: '500' },
});