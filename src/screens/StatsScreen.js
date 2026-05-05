/**
 * 统计页面
 * 展示详细的观影统计数据
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { storage } from '../utils/storage';

const StatsScreen = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const statsData = await storage.getStats();
    setStats(statsData);
    setLoading(false);
  };

  const renderGenreBar = (genre, index) => {
    const maxCount = Math.max(...(stats.topGenres?.map(g => g.count) || [1]));
    const percentage = (genre.count / maxCount) * 100;
    const colors = [COLORS.primary, COLORS.success, COLORS.accent, COLORS.info, '#8b5cf6'];
    
    return (
      <View key={genre.name} style={styles.genreItem}>
        <View style={styles.genreHeader}>
          <Text style={styles.genreName}>{genre.name}</Text>
          <Text style={styles.genreCount}>{genre.count} 部</Text>
        </View>
        <View style={styles.barBackground}>
          <View style={[
            styles.barFill,
            { 
              width: `${percentage}%`,
              backgroundColor: colors[index % colors.length]
            }
          ]} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>📈 观影统计</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          <View style={[styles.statCard, { backgroundColor: COLORS.success + '20' }]}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>
              {stats.totalWatched}
            </Text>
            <Text style={styles.statLabel}>已看影片</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: COLORS.accent + '20' }]}>
            <Text style={[styles.statNumber, { color: COLORS.accent }]}>
              {stats.totalHours}
            </Text>
            <Text style={styles.statLabel}>总时长(小时)</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: COLORS.primary + '20' }]}>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>
              {stats.avgRating || '-'}
            </Text>
            <Text style={styles.statLabel}>平均评分</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: COLORS.info + '20' }]}>
            <Text style={[styles.statNumber, { color: COLORS.info }]}>
              {stats.wantCount}
            </Text>
            <Text style={styles.statLabel}>想看清单</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎭 类型分布</Text>
          <View style={styles.chartCard}>
            {stats.topGenres?.length > 0 ? (
              stats.topGenres.map((genre, index) => renderGenreBar(genre, index))
            ) : (
              <Text style={styles.emptyText}>暂无数据</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 观影建议</Text>
          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionText}>
              🎉 太棒了！你已经观看了 <Text style={styles.highlightText}>{stats.totalWatched}</Text> 部电影
            </Text>
            <Text style={styles.suggestionText}>
              ⏱️ 累计投入了 <Text style={styles.highlightText}>{stats.totalHours}</Text> 小时在电影上
            </Text>
            <Text style={styles.suggestionText}>
              🎬 继续保持对电影的热爱吧！
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.spacing.lg,
    paddingBottom: 100,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.xl,
  },
  statCard: {
    width: '47%',
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.radius.xl,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statNumber: {
    fontSize: SIZES.fontSize['3xl'],
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSize.sm,
  },
  section: {
    marginBottom: SIZES.spacing.xl,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
    marginBottom: SIZES.spacing.md,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.spacing.lg,
    ...SHADOWS.card,
    gap: SIZES.spacing.lg,
  },
  genreItem: {
    gap: 8,
  },
  genreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genreName: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
  },
  genreCount: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.xs,
  },
  barBackground: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  suggestionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.spacing.lg,
    ...SHADOWS.card,
    gap: SIZES.spacing.md,
  },
  suggestionText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSize.md,
    lineHeight: 24,
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.md,
    textAlign: 'center',
    padding: SIZES.spacing.xl,
  },
});

export default StatsScreen;
