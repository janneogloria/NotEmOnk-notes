import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import icons from '../constants/icons';

const ACCENT_MAP = {
  orange: COLORS.accent,
  green:  COLORS.green,
  purple: COLORS.purple,
  blue:   COLORS.blue,
};

const TAG_STYLE = {
  Work:     { bg: COLORS.accentLight, color: COLORS.accent },
  School:   { bg: COLORS.greenLight,  color: COLORS.green  },
  Personal: { bg: COLORS.purpleLight, color: COLORS.purple },
  Tasks:    { bg: COLORS.blueLight,   color: COLORS.blue   },
  Ideas:    { bg: COLORS.goldLight,   color: COLORS.gold   },
};

export default function NoteCard({ note, onPress }) {
  const barColor = ACCENT_MAP[note.color] || COLORS.accent;
  const tag = TAG_STYLE[note.category] || TAG_STYLE.Work;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.bar, { backgroundColor: barColor }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>{note.title}</Text>
          <Image
            source={note.favorite ? icons.favoriteStarFilled : icons.favoriteStar}
            style={[
              styles.starIcon,
              { tintColor: note.favorite ? '#F5B731' : COLORS.textMuted },
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.preview} numberOfLines={3}>{note.preview}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.date}>{note.date}</Text>
          <View style={[styles.tag, { backgroundColor: tag.bg }]}>
            <Text style={[styles.tagText, { color: tag.color }]}>{note.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...SHADOW.card,
    marginBottom: 12,
  },
  bar: { width: 4 },
  body: { flex: 1, padding: 16 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  starIcon: {
    width: 18,
    height: 18,
    marginTop: 1,
  },
  preview: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: { fontSize: 11, color: COLORS.textMuted },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  tagText: { fontSize: 10, fontWeight: '600' },
});