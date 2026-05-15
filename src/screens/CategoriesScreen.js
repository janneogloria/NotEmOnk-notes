import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { CATEGORIES, TAGS } from '../data/staticData';

export default function CategoriesScreen() {
  const [activeFilter, setActiveFilter] = useState('Work');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Categories</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editTxt}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Active Filter Banner */}
        <View style={styles.filterBanner}>
          <View style={styles.filterLeft}>
            <View style={[styles.filterDot, { backgroundColor: COLORS.accent }]} />
            <Text style={styles.filterText}>Filtered: {activeFilter}</Text>
          </View>
          <Text style={styles.filterCount}>7 notes</Text>
          <TouchableOpacity onPress={() => setActiveFilter(null)}>
            <Text style={styles.filterClear}>X</Text>
          </TouchableOpacity>
        </View>

        {/* My Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Categories</Text>
          <Text style={styles.seeAll}>+ New</Text>
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.name}
              style={[styles.catCard, { borderTopColor: cat.color }]}
              onPress={() => setActiveFilter(cat.name)}
              activeOpacity={0.85}
            >
              {/* Subtle background circle */}
              <View style={[styles.catBgCircle, { backgroundColor: cat.color }]} />

              {/* Colored icon block — no emoji */}
              <View style={[styles.catIconBlock, { backgroundColor: cat.color + '20' }]}>
                <View style={[styles.catIconDot, { backgroundColor: cat.color }]} />
              </View>

              <Text style={styles.catName}>{cat.name}</Text>
              <Text style={styles.catCount}>{cat.count} notes</Text>
              <View style={styles.progressTrack}>
                <View style={[
                  styles.progressFill,
                  { backgroundColor: cat.color, width: `${Math.round(cat.progress * 100)}%` }
                ]} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Add new category */}
          <TouchableOpacity style={styles.catCardAdd}>
            <Text style={styles.addPlus}>+</Text>
            <Text style={styles.addLabel}>Create new category</Text>
          </TouchableOpacity>
        </View>

        {/* Tags */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <Text style={styles.seeAll}>Manage</Text>
        </View>
        <View style={styles.tagsWrap}>
          {TAGS.map(tag => (
            <TouchableOpacity
              key={tag.label}
              style={[styles.tagChip, { backgroundColor: tag.light }]}
              activeOpacity={0.7}
            >
              <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
              <Text style={[styles.tagText, { color: tag.color }]}>{tag.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.tagChipAdd}>
            <Text style={styles.tagAddTxt}>+ Add tag</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingTop: Platform.OS === 'web' ? 20 : 0 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  editBtn: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: RADIUS.full, backgroundColor: COLORS.accentLight,
    borderWidth: 1.5, borderColor: 'rgba(192,120,80,0.25)',
  },
  editTxt: { fontSize: 13, color: COLORS.accent, fontWeight: '500' },

  filterBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, marginBottom: 20,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    paddingHorizontal: 16, paddingVertical: 14, ...SHADOW.light,
  },
  filterLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  filterDot: { width: 8, height: 8, borderRadius: 4 },
  filterText: { fontSize: 13, fontWeight: '500', color: COLORS.text },
  filterCount: { fontSize: 12, color: COLORS.textMuted, marginRight: 12 },
  filterClear: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.accent, fontWeight: '500' },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    paddingHorizontal: 24, marginBottom: 8,
  },
  catCard: {
    width: '47%', backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, padding: 18,
    borderTopWidth: 3, ...SHADOW.card, overflow: 'hidden', position: 'relative',
  },
  catBgCircle: {
    position: 'absolute', bottom: -24, right: -20,
    width: 72, height: 72, borderRadius: 36, opacity: 0.10,
  },
  // Colored block replaces emoji
  catIconBlock: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  catIconDot: {
    width: 14, height: 14, borderRadius: 7,
  },
  catName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  catCount: { fontSize: 11, color: COLORS.textMuted, marginBottom: 10 },
  progressTrack: {
    height: 3, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },

  catCardAdd: {
    width: '100%', borderWidth: 2, borderStyle: 'dashed',
    borderColor: COLORS.border, borderRadius: RADIUS.lg,
    paddingVertical: 24, alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  addPlus: { fontSize: 26, color: COLORS.textMuted, opacity: 0.6 },
  addLabel: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 24 },
  tagChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 13, paddingVertical: 7, borderRadius: RADIUS.full,
  },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  tagText: { fontSize: 12, fontWeight: '500' },
  tagChipAdd: {
    paddingHorizontal: 13, paddingVertical: 7, borderRadius: RADIUS.full,
    backgroundColor: 'rgba(44,36,22,0.06)',
  },
  tagAddTxt: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
});