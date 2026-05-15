import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, Image,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { REMINDERS, UPCOMING_REMINDERS, CALENDAR_DAYS } from '../data/staticData';
import icons from '../constants/icons';

const STATUS_STYLE = {
  Overdue:    { bg: '#FFEDED', color: '#C07070' },
  'Due Today':{ bg: '#FFF0E8', color: '#C07850' },
  Tomorrow:   { bg: '#E8F5EE', color: '#7BAB8B' },
};

export default function RemindersScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Reminders</Text>
            <Text style={styles.headerSub}>3 due today · 1 overdue</Text>
          </View>
          <TouchableOpacity style={styles.newBtn}>
            <Text style={styles.newBtnTxt}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* Urgent Banner — notification.png instead of bell emoji */}
        <View style={styles.urgentBanner}>
          <Image
            source={icons.notification}
            style={styles.urgentIcon}
            resizeMode="contain"
          />
          <View style={styles.urgentBody}>
            <Text style={styles.urgentTitle}>Overdue: Leadership Deck</Text>
            <Text style={styles.urgentSub}>Was due yesterday at 5:00 PM</Text>
          </View>
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentBadgeTxt}>1d ago</Text>
          </View>
        </View>

        {/* Calendar Strip */}
        <View style={styles.calWrap}>
          <Text style={styles.calLabel}>April 2026</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calRow}>
            {CALENDAR_DAYS.map(day => (
              <View key={day.dn} style={[styles.calDay, day.isToday && styles.calDayToday]}>
                <Text style={[styles.calWd, day.isToday && styles.calWdToday]}>{day.wd}</Text>
                <Text style={[styles.calDn, day.isToday && styles.calDnToday]}>{day.dn}</Text>
                <View style={[
                  styles.calDot,
                  { backgroundColor: day.hasDot ? (day.isToday ? 'rgba(255,255,255,0.7)' : COLORS.accent) : 'transparent' }
                ]} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Today Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>TODAY — APR 21</Text>
          <Text style={styles.sectionCount}>3 reminders</Text>
        </View>

        {REMINDERS.map((rem, idx) => {
          const statusStyle = STATUS_STYLE[rem.status] || STATUS_STYLE['Due Today'];
          return (
            <View key={rem.id} style={styles.remCard}>
              {/* Timeline dot */}
              <View style={styles.timeline}>
                <View style={[styles.tlDot, { borderColor: rem.dotColor, backgroundColor: rem.dotColor + '22' }]} />
                {idx < REMINDERS.length - 1 && <View style={styles.tlLine} />}
              </View>

              <View style={styles.remBody}>
                <View style={styles.remTop}>
                  <Text style={styles.remTitle}>{rem.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusTxt, { color: statusStyle.color }]}>{rem.status}</Text>
                  </View>
                </View>

                <Text style={styles.remNote} numberOfLines={2}>{rem.note}</Text>

                {/* Time badge — reminders icon instead of alarm emoji */}
                <View style={styles.remMeta}>
                  <View style={[styles.timeBadge, { backgroundColor: statusStyle.bg }]}>
                    <Image
                      source={icons.remindersIcon}
                      style={[styles.timeIcon, { tintColor: statusStyle.color }]}
                      resizeMode="contain"
                    />
                    <Text style={[styles.timeBadgeTxt, { color: statusStyle.color }]}>{rem.time}</Text>
                  </View>
                  <Text style={styles.remCat}>{rem.category}</Text>
                </View>

                <View style={styles.remActions}>
                  {rem.actions.map(a => (
                    <TouchableOpacity
                      key={a}
                      style={[styles.actionBtn, a === rem.primaryAction && styles.actionBtnPrimary]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.actionTxt, a === rem.primaryAction && styles.actionTxtPrimary]}>
                        {a}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          );
        })}

        {/* Upcoming */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionLabel}>UPCOMING</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        {UPCOMING_REMINDERS.map(rem => (
          <View key={rem.id} style={styles.remCard}>
            <View style={styles.timeline}>
              <View style={[styles.tlDot, { borderColor: rem.dotColor, backgroundColor: rem.dotColor + '22' }]} />
            </View>
            <View style={styles.remBody}>
              <View style={styles.remTop}>
                <Text style={styles.remTitle}>{rem.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: rem.statusLight }]}>
                  <Text style={[styles.statusTxt, { color: rem.statusColor }]}>{rem.status}</Text>
                </View>
              </View>
              <View style={styles.remMeta}>
                <View style={[styles.timeBadge, { backgroundColor: rem.statusLight }]}>
                  <Image
                    source={icons.remindersIcon}
                    style={[styles.timeIcon, { tintColor: rem.statusColor }]}
                    resizeMode="contain"
                  />
                  <Text style={[styles.timeBadgeTxt, { color: rem.statusColor }]}>{rem.time}</Text>
                </View>
                <Text style={styles.remCat}>{rem.category}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingTop: Platform.OS === 'web' ? 20 : 0 },

  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  headerSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  newBtn: {
    backgroundColor: COLORS.accent, paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: RADIUS.full,
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  newBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },

  urgentBanner: {
    marginHorizontal: 24, marginVertical: 14,
    backgroundColor: '#B04040', borderRadius: RADIUS.lg,
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  urgentIcon: { width: 28, height: 28, tintColor: '#fff' },
  urgentBody: { flex: 1 },
  urgentTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  urgentSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  urgentBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  urgentBadgeTxt: { fontSize: 12, fontWeight: '600', color: '#fff' },

  calWrap: { paddingHorizontal: 24, marginBottom: 20 },
  calLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 10 },
  calRow: { gap: 8 },
  calDay: {
    width: 48, paddingVertical: 10, alignItems: 'center',
    borderRadius: 14, gap: 4, backgroundColor: COLORS.surface, ...SHADOW.light,
  },
  calDayToday: { backgroundColor: COLORS.accent },
  calWd: { fontSize: 9, fontWeight: '500', color: COLORS.textMuted },
  calWdToday: { color: 'rgba(255,255,255,0.8)' },
  calDn: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  calDnToday: { color: '#fff' },
  calDot: { width: 5, height: 5, borderRadius: 3 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  sectionCount: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },
  seeAll: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },

  remCard: {
    marginHorizontal: 24, marginBottom: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 16, ...SHADOW.card, flexDirection: 'row', gap: 12,
  },
  timeline: { alignItems: 'center', paddingTop: 2 },
  tlDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
  tlLine: { width: 2, flex: 1, backgroundColor: COLORS.border, marginTop: 4 },

  remBody: { flex: 1 },
  remTop: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 6,
  },
  remTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, flex: 1, marginRight: 8, lineHeight: 20 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  statusTxt: { fontSize: 10, fontWeight: '600' },
  remNote: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18, marginBottom: 10 },

  remMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  timeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full,
  },
  timeIcon: { width: 12, height: 12 },
  timeBadgeTxt: { fontSize: 11, fontWeight: '600' },
  remCat: { fontSize: 11, color: COLORS.textMuted, marginLeft: 'auto' },

  remActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.full,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  actionBtnPrimary: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  actionTxt: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted },
  actionTxtPrimary: { color: '#fff' },

  fab: {
    position: 'absolute', bottom: Platform.OS === 'web' ? 80 : 100,
    right: 24, width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40, shadowRadius: 12, elevation: 8,
  },
  fabIcon: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
});