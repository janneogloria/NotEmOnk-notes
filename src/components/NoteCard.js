import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';

const ACCENT_MAP = {
  orange: '#C07850', green: '#7BAB8B', purple: '#8B7BAB',
  blue:   '#7BA7C0', gold:  '#C0A050', red:    '#C07070',
};

const TAG_STYLE = {
  Work:     { bg: '#FFF0E8', color: '#C07850' },
  School:   { bg: '#E8F5EE', color: '#7BAB8B' },
  Personal: { bg: '#EEEAF6', color: '#8B7BAB' },
  Tasks:    { bg: '#E8F0F7', color: '#7BA7C0' },
  Ideas:    { bg: '#FBF6E8', color: '#C0A050' },
  Journal:  { bg: '#FFEDED', color: '#C07070' },
};

export default function NoteCard({ note, onPress, onFavorite, onDelete }) {
  const [showActions, setShowActions]   = useState(false);
  const [confirming,  setConfirming]    = useState(false);

  const barColor = ACCENT_MAP[note.color] || '#C07850';
  const tag      = TAG_STYLE[note.category] || TAG_STYLE.Work;

  const handleFavPress = (e) => {
    e.stopPropagation?.();
    onFavorite?.();
  };

  const handleCardPress = () => {
    if (showActions) { setShowActions(false); setConfirming(false); return; }
    onPress?.();
  };

  const handleLongPress = () => {
    setShowActions(true);
    setConfirming(false);
  };

  const handleDeletePress = (e) => {
    e.stopPropagation?.();
    setConfirming(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation?.();
    onDelete?.();
    setShowActions(false);
    setConfirming(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation?.();
    setShowActions(false);
    setConfirming(false);
  };

  return (
    <View style={styles.wrapper}>

      {/* Step 1: Delete / Cancel */}
      {showActions && !confirming && (
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeletePress} activeOpacity={0.8}>
            <Text style={styles.deleteTxt}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
            <Text style={styles.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: Confirm */}
      {confirming && (
        <View style={styles.confirmBar}>
          <Text style={styles.confirmMsg}>Delete "{note.title}"?</Text>
          <View style={styles.confirmBtns}>
            <TouchableOpacity style={styles.confirmYes} onPress={handleConfirmDelete} activeOpacity={0.8}>
              <Text style={styles.confirmYesTxt}>Yes, delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.card, showActions && styles.cardHighlighted]}
        onPress={handleCardPress}
        onLongPress={handleLongPress}
        delayLongPress={400}
        activeOpacity={0.85}
      >
        <View style={[styles.bar, { backgroundColor: barColor }]} />
        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={styles.title} numberOfLines={2}>{note.title}</Text>
            <TouchableOpacity onPress={handleFavPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={[styles.starIcon, { color: note.favorite ? '#F5B731' : COLORS.textMuted }]}>
                {note.favorite ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.preview} numberOfLines={3}>
            {note.content || note.preview || ''}
          </Text>

          {note.tags && note.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {note.tags.slice(0, 3).map(t => (
                <View key={t} style={[styles.tagPill, { backgroundColor: tag.bg }]}>
                  <Text style={[styles.tagPillTxt, { color: tag.color }]}>{t}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.metaRow}>
            <Text style={styles.date}>{note.date}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {note.pinned   && <Text style={styles.metaBadge}>Pinned</Text>}
              {note.reminder && <Text style={styles.metaBadge}>Reminder</Text>}
              <View style={[styles.tag, { backgroundColor: tag.bg }]}>
                <Text style={[styles.tagText, { color: tag.color }]}>{note.category}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },

  actionBar: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  deleteBtn: {
    flex: 1, backgroundColor: '#C07070', borderRadius: RADIUS.md,
    paddingVertical: 10, alignItems: 'center',
  },
  deleteTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  cancelBtn: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    paddingVertical: 10, alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  cancelTxt: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },

  confirmBar: {
    backgroundColor: '#FFF0F0', borderRadius: RADIUS.md,
    padding: 14, marginBottom: 6, borderWidth: 1.5, borderColor: '#C07070',
  },
  confirmMsg:  { fontSize: 13, color: COLORS.text, fontWeight: '600', marginBottom: 10 },
  confirmBtns: { flexDirection: 'row', gap: 8 },
  confirmYes:  {
    flex: 1, backgroundColor: '#C07070', borderRadius: RADIUS.md,
    paddingVertical: 9, alignItems: 'center',
  },
  confirmYesTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    flexDirection: 'row', overflow: 'hidden', ...SHADOW.card,
  },
  cardHighlighted: { borderWidth: 1.5, borderColor: '#C07070' },

  bar:      { width: 4 },
  body:     { flex: 1, padding: 16 },
  topRow:   { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  title:    { fontSize: 15, fontWeight: '600', color: COLORS.text, flex: 1, marginRight: 8, lineHeight: 20 },
  starIcon: { fontSize: 18, marginTop: 1 },
  preview:  { fontSize: 13, color: COLORS.textMuted, lineHeight: 20, marginBottom: 8 },

  tagsRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 8 },
  tagPill:    { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  tagPillTxt: { fontSize: 10, fontWeight: '600' },

  metaRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date:      { fontSize: 11, color: COLORS.textMuted },
  metaBadge: { fontSize: 10, color: COLORS.textMuted, fontWeight: '500' },
  tag:       { paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  tagText:   { fontSize: 10, fontWeight: '600' },
});