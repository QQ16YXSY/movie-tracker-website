/**
 * 统计卡片组件
 * 展示观影数据统计概览
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const StatsCard = ({ stats, style }) => {
  const StatItem = ({ label, value, color = COLORS.primary }) => (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>📊 我的观影数据</Text>
      
      <View style={styles.statsRow}>
        <StatItem 
          label="今年已看" 
          value={stats.totalWatched} 
          color={COLORS.success} 
        />
        <StatItem 
          label="正在看" 
          value={stats.watchingCount} 
          color={COLORS.warning} 
        />
        <StatItem 
          label="想看" 
          value={stats.wantCount} 
          color={COLORS.info} 
        />
        <StatItem 
          label="总时长" 
          value={`${stats.totalHours}h`} 
          color={COLORS.accent} 
        />
      </View>
      
      {stats.avgRating > 0 && (
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            平均评分：{stats.avgRating} / 10
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.spacing.lg,
    ...SHADOWS.card,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
    marginBottom: SIZES.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.xs,
  },
  footerRow: {
    marginTop: SIZES.spacing.md,
    paddingTop: SIZES.spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSize.sm,
    textAlign: 'center',
  },
});

export default StatsCard;
