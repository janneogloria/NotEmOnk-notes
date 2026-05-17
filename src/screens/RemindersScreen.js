import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useNotes } from '../context/NotesContext';

const STATUS_STYLE = {
  'Overdue':   { bg: '#FFEDED', color: '#C07070' },
  'Due Today': { bg: '#FFF0E8', color: '#C07850' },
  'Upcoming':  { bg: '#E8F0F7', color: '#7BA7C0' },
};

const DOT_COLORS = ['#C07850', '#7BAB8B', '#8B7BAB', '#7BA7C0', '#C0A050', '#C07070'];

function getStatus(reminder) {
  return reminder.status || 'Upcoming';
}

export default function RemindersScreen({ navigation }) {
  const { reminders, notes, dismissReminder, markReminderDone, snoozeReminder } = useNotes();
  const [expandedId, setExpandedId] = useState(null);

  const overdue   = reminders.filter(r => getStatus(r) === 'Overdue');
  const today     = reminders.filter(r => getStatus(r) === 'Due Today');
  const upcoming  = reminders.filter(r => getStatus(r) === 'Upcoming');

  const openNote = (noteId) => {
    if (!noteId) return;
    const note = notes.find(n => n.id === noteId);
    if (note) navigation.navigate('CreateNote', { note });
  };

  const ReminderCard = ({ item }) => {
    const statusStyle = STATUS_STYLE[getStatus(item)] || STATUS_STYLE['Upcoming'];
    const isExpanded  = expandedId === item.id;
    const dotColor    = item.dotColor || COLORS.accent;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
        activeOpacity={0.85}
      >
        {/* Left accent dot */}
        <View style={[styles.dotBar, { backgroundColor: dotColor }]} />

        <View style={styles.cardBody}>
          {/* Top row */}
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusTxt, { color: statusStyle.color }]}>
                {getStatus(item)}
              </Text>
            </View>
          </View>

          {/* Note preview */}
          {item.note ? (
            <Text style={styles.cardNote} numberOfLines={isExpanded ? 6 : 2}>
              {item.note}
            </Text>
          ) : null}

          {/* Category */}
          {item.category ? (
            <Text style={styles.cardCategory}>{item.category}</Text>
          ) : null}

          {/* Actions — always visible */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => dismissReminder(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnTxt}>Dismiss</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => snoozeReminder(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnTxt}>Snooze</Text>
            </TouchableOpacity>

            {item.noteId ? (
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnSecondary, { borderColor: dotColor }]}
                onPress={() => openNote(item.noteId)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionBtnSecTxt, { color: dotColor }]}>Open Note</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[styles.actionBtnPrimary, { backgroundColor: dotColor }]}
              onPress={() => markReminderDone(item.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.actionBtnPrimaryTxt}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const SectionHeader = ({ label, count, color }) => (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionDot, { backgroundColor: color }]} />
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.sectionCount}>{count}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Reminders</Text>
        <Text style={styles.screenSub}>{reminders.length} active</Text>
      </View>

      {reminders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⏰</Text>
          <Text style={styles.emptyTxt}>No reminders yet</Text>
          <Text style={styles.emptyHint}>
            Add a reminder to any note using the Remind chip in the note editor
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('CreateNote', { note: null })}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyBtnTxt}>+ New Note</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {overdue.length > 0 && (
            <>
              <SectionHeader label="Overdue" count={overdue.length} color="#C07070" />
              {overdue.map(r => <ReminderCard key={r.id} item={r} />)}
            </>
          )}

          {today.length > 0 && (
            <>
              <SectionHeader label="Due Today" count={today.length} color="#C07850" />
              {today.map(r => <ReminderCard key={r.id} item={r} />)}
            </>
          )}

          {upcoming.length > 0 && (
            <>
              <SectionHeader label="Upcoming" count={upcoming.length} color="#7BA7C0" />
              {upcoming.map(r => <ReminderCard key={r.id} item={r} />)}
            </>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: COLORS.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 },

  header: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 24 : 16,
    paddingBottom: 16,
  },
  screenTitle: { fontSize: 26, fontWeight: '700', color: COLORS.text },
  screenSub:   { fontSize: 13, color: COLORS.textMuted },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 8, marginBottom: 10, paddingHorizontal: 4,
  },
  sectionDot:   { width: 8, height: 8, borderRadius: 4 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text, textTransform: 'uppercase', letterSpacing: 0.8, flex: 1 },
  sectionCount: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    flexDirection: 'row', overflow: 'hidden',
    marginBottom: 12, ...SHADOW.card,
  },
  dotBar:   { width: 4 },
  cardBody: { flex: 1, padding: 16 },

  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, lineHeight: 20, marginBottom: 3 },
  cardTime:  { fontSize: 11, color: COLORS.textMuted },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, marginLeft: 8 },
  statusTxt:   { fontSize: 10, fontWeight: '700' },

  cardNote:     { fontSize: 12, color: COLORS.textMuted, lineHeight: 18, marginBottom: 8 },
  cardCategory: { fontSize: 10, color: COLORS.textMuted, fontWeight: '500', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

  actionsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },

  actionBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bg,
    borderWidth: 1, borderColor: COLORS.border,
  },
  actionBtnTxt: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },

  actionBtnSecondary: { borderWidth: 1.5 },
  actionBtnSecTxt:    { fontSize: 12, fontWeight: '600' },

  actionBtnPrimary: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  actionBtnPrimaryTxt: { fontSize: 12, color: '#fff', fontWeight: '600' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon:  { fontSize: 48, marginBottom: 12 },
  emptyTxt:   { fontSize: 17, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  emptyHint:  { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  emptyBtn:   {
    backgroundColor: COLORS.accent, borderRadius: RADIUS.full,
    paddingHorizontal: 22, paddingVertical: 12,
  },
  emptyBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
});