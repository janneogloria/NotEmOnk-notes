import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Platform, Image,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import icons from '../constants/icons';

const FMT_BUTTONS = ['B', 'I', 'U', 'S', 'H1', 'H2', 'List', 'Check', 'Code', 'Link'];

// Meta chips — text-only labels, no emojis
const META_CHIPS = [
  { label: 'Work',     active: true  },
  { label: 'Add Tag',  active: false },
  { label: 'Remind',   active: false },
  { label: 'Pin',      active: false },
  { label: 'Favorite', active: false },
  { label: 'Color',    active: false },
];

// Attachment bar uses real PNG icons
const ATTACH = [
  { icon: 'photo',    label: 'Photo'    },
  { icon: 'file',     label: 'File'     },
  { icon: 'audio',    label: 'Audio'    },
  { icon: 'location', label: 'Location' },
  { icon: 'draw',     label: 'Draw'     },
];

const INITIAL_ITEMS = [
  { id: 1, text: 'Finalize Q2 retrospective report',         done: true  },
  { id: 2, text: 'Update project timeline in Notion',        done: true  },
  { id: 3, text: 'Draft roadmap slides for leadership deck', done: false },
  { id: 4, text: 'Collect feedback from design team',        done: false },
  { id: 5, text: 'Schedule sync with engineering leads',     done: false },
];

export default function CreateNoteScreen({ route, navigation }) {
  const existingNote = route?.params?.note;
  const [title, setTitle] = useState(existingNote?.title || 'Q3 Product Roadmap Strategy');
  const [activeFormat, setActiveFormat] = useState('B');
  const [checkItems, setCheckItems] = useState(INITIAL_ITEMS);

  const toggleItem = (id) =>
    setCheckItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));

  return (
    <SafeAreaView style={styles.safe}>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>New Note</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Meta Chips — text only, no emojis */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.metaScroll} contentContainerStyle={styles.metaContent}
      >
        {META_CHIPS.map(c => (
          <View key={c.label} style={[styles.metaChip, c.active && styles.metaChipActive]}>
            <Text style={[styles.metaChipTxt, c.active && styles.metaChipTxtActive]}>
              {c.label}
            </Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.editorScroll} contentContainerStyle={styles.editorContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.editorCard}>

          {/* Title */}
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Note title…"
            placeholderTextColor="rgba(44,36,22,0.25)"
            multiline
          />
          <View style={styles.divider} />

          {/* Formatting Toolbar — text labels only */}
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            style={styles.fmtScroll} contentContainerStyle={styles.fmtContent}
          >
            {FMT_BUTTONS.map((btn, i) => (
              <React.Fragment key={btn + i}>
                {(i === 4 || i === 6 || i === 9) && <View style={styles.fmtSep} />}
                <TouchableOpacity
                  style={[styles.fmtBtn, activeFormat === btn && styles.fmtBtnActive]}
                  onPress={() => setActiveFormat(btn)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.fmtTxt,
                    btn === 'I' && styles.fmtItalic,
                    btn === 'U' && styles.fmtUnderline,
                    btn === 'S' && styles.fmtStrike,
                    activeFormat === btn && styles.fmtTxtActive,
                  ]}>
                    {btn}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
          <View style={styles.divider} />

          {/* Content */}
          <View style={styles.contentArea}>
            <Text style={styles.sectionLabel}>OVERVIEW</Text>
            <View style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bodyText}>
                Key initiatives for Q3 include feature rollout, team expansion, and the onboarding redesign project.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bodyText}>
                Next stakeholder review is scheduled for{' '}
                <Text style={{ fontWeight: '700' }}>Friday, April 25</Text>.
              </Text>
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>ACTION ITEMS</Text>
            {checkItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.checkRow}
                onPress={() => toggleItem(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                  {item.done && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.checkText, item.done && styles.checkTextDone]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.placeholder}>Start typing here…</Text>
          </View>

          {/* Word Count — no emoji */}
          <View style={styles.wordCountBar}>
            <Text style={styles.wordCountTxt}>87 words · 462 chars</Text>
            <Text style={styles.wordCountTxt}>Apr 21, 2026  10:32 AM</Text>
          </View>

        </View>
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Attachment Bar — PNG icons */}
      <View style={styles.attachBar}>
        {ATTACH.map(a => (
          <TouchableOpacity key={a.label} style={styles.attachBtn} activeOpacity={0.7}>
            <Image
              source={icons[a.icon]}
              style={styles.attachIcon}
              resizeMode="contain"
            />
            <Text style={styles.attachLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 20 : 12,
    paddingBottom: 14,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    ...SHADOW.light,
  },
  backArrow: { fontSize: 18, color: COLORS.text },
  topBarTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  saveBtn: {
    backgroundColor: COLORS.accent, paddingHorizontal: 22, paddingVertical: 9,
    borderRadius: RADIUS.full,
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  saveTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },

  metaScroll: { marginBottom: 12 },
  metaContent: { paddingHorizontal: 24, gap: 8 },
  metaChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
  },
  metaChipActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accentLight },
  metaChipTxt: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },
  metaChipTxtActive: { color: COLORS.accent },

  editorScroll: { flex: 1 },
  editorContent: { paddingHorizontal: 16 },
  editorCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    overflow: 'hidden', ...SHADOW.card,
  },

  titleInput: {
    fontSize: 22, fontWeight: '700', color: COLORS.text,
    paddingHorizontal: 22, paddingTop: 20, paddingBottom: 12, lineHeight: 30,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 22 },

  fmtScroll: { maxHeight: 52 },
  fmtContent: { paddingHorizontal: 14, alignItems: 'center', gap: 4, paddingVertical: 8 },
  fmtBtn: {
    paddingHorizontal: 10, height: 34, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  fmtBtnActive: { backgroundColor: COLORS.accentLight },
  fmtTxt: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },
  fmtTxtActive: { color: COLORS.accent },
  fmtItalic: { fontStyle: 'italic' },
  fmtUnderline: { textDecorationLine: 'underline' },
  fmtStrike: { textDecorationLine: 'line-through' },
  fmtSep: { width: 1, height: 22, backgroundColor: COLORS.border, marginHorizontal: 4 },

  contentArea: { padding: 22 },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: COLORS.textMuted,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12,
  },
  bulletRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.accent, marginTop: 8 },
  bodyText: { fontSize: 14, color: COLORS.text, lineHeight: 22, flex: 1 },

  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 2,
    borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkboxDone: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  checkMark: { color: '#fff', fontSize: 11, fontWeight: '700' },
  checkText: { fontSize: 13, color: COLORS.text, lineHeight: 20, flex: 1 },
  checkTextDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  placeholder: { fontSize: 14, color: 'rgba(44,36,22,0.25)', marginTop: 10 },

  wordCountBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 22, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  wordCountTxt: { fontSize: 11, color: COLORS.textMuted },

  attachBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'web' ? 10 : 26,
  },
  attachBtn: { alignItems: 'center', gap: 4 },
  attachIcon: { width: 22, height: 22, tintColor: COLORS.textMuted, opacity: 0.7 },
  attachLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '500' },
});