import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, Image,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import icons from '../constants/icons';
import { TASKS, COMPLETED_TASKS } from '../data/staticData';

const FILTER_TABS = ['All Tasks', 'Today', 'Upcoming', 'Completed'];

export default function TasksScreen() {
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [taskData, setTaskData] = useState(TASKS);

  const toggleItem = (taskId, itemId) => {
    setTaskData(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, items: task.items.map(item => item.id === itemId ? { ...item, done: !item.done } : item) }
          : task
      )
    );
  };

  const getProgress = (items) => {
    const done = items.filter(i => i.done).length;
    return { done, total: items.length, pct: done / items.length };
  };

  const totalDone = taskData.reduce((acc, t) => acc + t.items.filter(i => i.done).length, 0);
  const totalAll  = taskData.reduce((acc, t) => acc + t.items.length, 0);

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
            <Text style={styles.headerTitle}>Tasks</Text>
            <Text style={styles.headerDate}>Tuesday, April 21, 2026</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.iconBtnTxt}>...</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Banner */}
        <View style={styles.progressBanner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Today's Progress</Text>
            <Text style={styles.bannerSub}>{totalDone} out of {totalAll} tasks completed</Text>
            <View style={styles.progTrack}>
              <View style={[styles.progFill, { width: `${Math.round(totalDone / totalAll * 100)}%` }]} />
            </View>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.bannerPct}>{Math.round(totalDone / totalAll * 100)}%</Text>
            <Text style={styles.bannerDone}>done</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={styles.filterScroll} contentContainerStyle={styles.filterContent}
        >
          {FILTER_TABS.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.filterChip, activeTab === t && styles.filterChipActive]}
              onPress={() => setActiveTab(t)} activeOpacity={0.8}
            >
              <Text style={[styles.filterTxt, activeTab === t && styles.filterTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* In Progress */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>IN PROGRESS</Text>
          <Text style={styles.sectionCount}>{taskData.length} active</Text>
        </View>

        {taskData.map(task => {
          const prog = getProgress(task.items);
          return (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{task.title}</Text>
                <View style={[styles.badge, { backgroundColor: task.badgeLight }]}>
                  <Text style={[styles.badgeTxt, { color: task.badgeColor }]}>{task.badge}</Text>
                </View>
              </View>

              <View style={styles.cardProgRow}>
                <Text style={styles.cardProgLbl}>Progress</Text>
                <Text style={styles.cardProgLbl}>{prog.done} / {prog.total}</Text>
              </View>
              <View style={styles.cardProgTrack}>
                <View style={[
                  styles.cardProgFill,
                  { backgroundColor: task.progressColor, width: `${Math.round(prog.pct * 100)}%` }
                ]} />
              </View>

              {task.items.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.checkRow, item.done && styles.checkRowDone]}
                  onPress={() => toggleItem(task.id, item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                    {item.done && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <View style={styles.checkBody}>
                    <Text style={[styles.checkTxt, item.done && styles.checkTxtDone]}>{item.text}</Text>
                    {!!item.sub && <Text style={styles.checkSub}>{item.sub}</Text>}
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.addItem} activeOpacity={0.7}>
                <Text style={styles.addItemTxt}>+ Add item…</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Completed Today */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionLabel}>COMPLETED TODAY</Text>
          <Text style={[styles.sectionCount, { color: COLORS.green }]}>5 done</Text>
        </View>

        {COMPLETED_TASKS.map(task => (
          <View key={task.id} style={[styles.taskCard, { opacity: 0.7 }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{task.title}</Text>
              <View style={[styles.badge, { backgroundColor: COLORS.greenLight }]}>
                <Text style={[styles.badgeTxt, { color: COLORS.green }]}>Done</Text>
              </View>
            </View>
            <View style={styles.cardProgTrack}>
              <View style={[styles.cardProgFill, { backgroundColor: task.progressColor, width: '100%' }]} />
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
  headerDate: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    ...SHADOW.light,
  },
  headerIcon: { width: 18, height: 18, tintColor: COLORS.textMuted },

  progressBanner: {
    marginHorizontal: 24, marginVertical: 14,
    backgroundColor: COLORS.green, borderRadius: RADIUS.lg,
    padding: 18, flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  bannerLeft: { flex: 1 },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 10 },
  progTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  bannerRight: { alignItems: 'center' },
  bannerPct: { fontSize: 24, fontWeight: '700', color: '#fff' },
  bannerDone: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },

  filterScroll: { marginBottom: 8 },
  filterContent: { paddingHorizontal: 24, gap: 8, paddingBottom: 12 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  filterTxt: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },
  filterTxtActive: { color: '#fff' },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12, fontWeight: '600', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  sectionCount: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },

  taskCard: {
    marginHorizontal: 24, marginBottom: 14,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 18, ...SHADOW.card,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  badgeTxt: { fontSize: 11, fontWeight: '600' },

  cardProgRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  cardProgLbl: { fontSize: 11, color: COLORS.textMuted },
  cardProgTrack: {
    height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden', marginBottom: 14,
  },
  cardProgFill: { height: '100%', borderRadius: 2 },

  checkRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 10, borderRadius: RADIUS.sm, backgroundColor: 'rgba(44,36,22,0.03)', marginBottom: 8,
  },
  checkRowDone: { backgroundColor: 'rgba(123,171,139,0.08)' },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 2,
    borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkboxDone: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  checkMark: { color: '#fff', fontSize: 11, fontWeight: '700' },
  checkBody: { flex: 1 },
  checkTxt: { fontSize: 13, color: COLORS.text, lineHeight: 20 },
  checkTxtDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  checkSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  addItem: {
    padding: 10, borderRadius: RADIUS.sm,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: COLORS.border, marginTop: 4,
  },
  addItemTxt: { fontSize: 13, color: COLORS.textMuted },

  fab: {
    position: 'absolute', bottom: Platform.OS === 'web' ? 80 : 100,
    right: 24, width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.green, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40, shadowRadius: 12, elevation: 8,
  },
  fabIcon: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
});