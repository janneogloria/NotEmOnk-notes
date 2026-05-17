import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, TextInput,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useNotes } from '../context/NotesContext';

const COLOR_HEX = {
  orange: '#C07850', green: '#7BAB8B', purple: '#8B7BAB',
  blue: '#7BA7C0',   gold: '#C0A050',  red: '#C07070',
};

const TAG_STYLE = {
  Work:     { bg: '#FFF0E8', color: '#C07850' },
  School:   { bg: '#E8F5EE', color: '#7BAB8B' },
  Personal: { bg: '#EEEAF6', color: '#8B7BAB' },
  Tasks:    { bg: '#E8F0F7', color: '#7BA7C0' },
  Ideas:    { bg: '#FBF6E8', color: '#C0A050' },
  Journal:  { bg: '#FFEDED', color: '#C07070' },
};

export default function TasksScreen({ navigation }) {
  const ctx = useNotes();
  const allNotes = ctx.notes || [];

  // Works with both old context (no taskNotes) and new context (has taskNotes)
  const taskNotes = ctx.taskNotes
    ?? allNotes.filter(n => Array.isArray(n.checkItems) && n.checkItems.length > 0);

  const toggleCheckItem    = ctx.toggleCheckItem    ?? (() => {});
  const addCheckItemToNote = ctx.addCheckItemToNote ?? (() => {});

  const [addingText, setAddingText] = useState({});
  const [addingFor,  setAddingFor]  = useState(null);

  const handleAddItem = (noteId) => {
    const text = (addingText[noteId] || '').trim();
    if (!text) return;
    addCheckItemToNote(noteId, text);
    setAddingText(prev => ({ ...prev, [noteId]: '' }));
    setAddingFor(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Tasks</Text>
        <Text style={styles.screenSub}>
          {taskNotes.length} list{taskNotes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {taskNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>☑️</Text>
          <Text style={styles.emptyTxt}>No task lists yet</Text>
          <Text style={styles.emptyHint}>Add checklist items to a note to see them here</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('CreateNote', { note: null })}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyBtnTxt}>+ New Note with Tasks</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {taskNotes.map(note => {
            const items    = note.checkItems || [];
            const done     = items.filter(i => i.done).length;
            const total    = items.length;
            const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
            const accent   = COLOR_HEX[note.color] || COLORS.accent;
            const tag      = TAG_STYLE[note.category] || TAG_STYLE.Work;
            const isAdding = addingFor === note.id;

            return (
              <View key={note.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('CreateNote', { note })} activeOpacity={0.8}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{note.title}</Text>
                    </TouchableOpacity>
                    <View style={styles.cardMeta}>
                      <View style={[styles.catBadge, { backgroundColor: tag.bg }]}>
                        <Text style={[styles.catBadgeTxt, { color: tag.color }]}>{note.category}</Text>
                      </View>
                      <Text style={styles.metaDate}>{note.date}</Text>
                    </View>
                  </View>
                  <Text style={[styles.progressPct, { color: accent }]}>{pct}%</Text>
                </View>

                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: accent }]} />
                </View>
                <Text style={styles.progressLabel}>{done} of {total} completed</Text>

                <View style={styles.itemsList}>
                  {items.map(item => (
                    <TouchableOpacity
                      key={item.id} style={styles.itemRow}
                      onPress={() => toggleCheckItem(note.id, item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.checkbox, item.done && { backgroundColor: accent, borderColor: accent }]}>
                        {item.done && <Text style={styles.checkMark}>✓</Text>}
                      </View>
                      <Text style={[styles.itemText, item.done && styles.itemTextDone]}>{item.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {isAdding ? (
                  <View style={styles.addInputRow}>
                    <TextInput
                      style={styles.addInput}
                      value={addingText[note.id] || ''}
                      onChangeText={t => setAddingText(prev => ({ ...prev, [note.id]: t }))}
                      placeholder="New task…"
                      placeholderTextColor={COLORS.textMuted}
                      autoFocus
                      onSubmitEditing={() => handleAddItem(note.id)}
                      returnKeyType="done"
                    />
                    <TouchableOpacity style={[styles.addConfirmBtn, { backgroundColor: accent }]} onPress={() => handleAddItem(note.id)}>
                      <Text style={styles.addConfirmTxt}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addCancelBtn} onPress={() => { setAddingFor(null); setAddingText(prev => ({ ...prev, [note.id]: '' })); }}>
                      <Text style={styles.addCancelTxt}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addItemBtn} onPress={() => setAddingFor(note.id)} activeOpacity={0.8}>
                    <Text style={[styles.addItemBtnTxt, { color: accent }]}>+ Add item</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'web' ? 24 : 16, paddingBottom: 16,
  },
  screenTitle: { fontSize: 26, fontWeight: '700', color: COLORS.text },
  screenSub: { fontSize: 13, color: COLORS.textMuted },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTxt: { fontSize: 17, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  emptyHint: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginBottom: 24 },
  emptyBtn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.full, paddingHorizontal: 22, paddingVertical: 12 },
  emptyBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 18, marginBottom: 16, ...SHADOW.card },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: RADIUS.full },
  catBadgeTxt: { fontSize: 10, fontWeight: '600' },
  metaDate: { fontSize: 11, color: COLORS.textMuted },
  progressPct: { fontSize: 16, fontWeight: '700', width: 48, textAlign: 'right' },
  progressBarBg: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  progressBarFill: { height: 6, borderRadius: 3 },
  progressLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 14 },
  itemsList: { gap: 2 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 7 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#fff', fontSize: 11, fontWeight: '700' },
  itemText: { fontSize: 13, color: COLORS.text, flex: 1, lineHeight: 20 },
  itemTextDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  addInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  addInput: { flex: 1, fontSize: 13, color: COLORS.text, borderBottomWidth: 1.5, borderBottomColor: COLORS.accent, paddingVertical: 6, paddingHorizontal: 2 },
  addConfirmBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.sm },
  addConfirmTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  addCancelBtn: { padding: 6 },
  addCancelTxt: { fontSize: 14, color: COLORS.textMuted },
  addItemBtn: { marginTop: 10, paddingVertical: 8, alignItems: 'center' },
  addItemBtnTxt: { fontSize: 13, fontWeight: '600' },
});