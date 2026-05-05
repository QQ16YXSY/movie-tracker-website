/**
 * 首页
 * 展示统计卡片、正在观看和最近看过的影片
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { storage } from '../utils/storage';
import StatsCard from '../components/StatsCard';
import SectionHeader from '../components/SectionHeader';
import MovieCard from '../components/MovieCard';

const HomeScreen = ({ navigation }) => {
  const [stats, setStats] = useState({});
  const [watchingMovies, setWatchingMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await storage.getStats();
      setStats(statsData);
      
      const movies = await storage.getMovies();
      const records = await storage.getRecords();
      
      const watching = records
        .filter(r => r.status === 'watching')
        .slice(0, 3)
        .map(r => ({
          movie: movies.find(m => m.id === r.movieId),
          record: r,
        }))
        .filter(item => item.movie);
      
      setWatchingMovies(watching);
      
      const recent = records
        .filter(r => r.status === 'watched')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 6)
        .map(r => ({
          movie: movies.find(m => m.id === r.movieId),
          record: r,
        }))
        .filter(item => item.movie);
      
      setRecentMovies(recent);
    } catch (error) {
      console.error('加载首页数据失败:', error);
    }
    setLoading(false);
  };

  const handleMoviePress = (movieId) => {
    navigation.navigate('MovieDetail', { movieId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>🎬 我的影单</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatsCard stats={stats} style={styles.statsCard} />

        <View style={styles.section}>
          <SectionHeader 
            title="正在观看" 
            onSeeAll={() => {}}
            showSeeAll={watchingMovies.length > 3}
          />
          <View style={styles.movieRow}>
            {watchingMovies.length > 0 ? (
              watchingMovies.map(({ movie, record }) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  record={record}
                  onPress={() => handleMoviePress(movie.id)}
                  style={styles.movieCard}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>还没有在看的影片，快去添加吧~</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader 
            title="最近看过" 
            onSeeAll={() => {}}
            showSeeAll={recentMovies.length > 6}
          />
          <View style={styles.movieGrid}>
            {recentMovies.length > 0 ? (
              recentMovies.map(({ movie, record }) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  record={record}
                  onPress={() => handleMoviePress(movie.id)}
                  style={styles.movieCard}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>还没有观影记录</Text>
            )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  statsCard: {
    marginBottom: SIZES.spacing.xl,
  },
  section: {
    marginBottom: SIZES.spacing.xl,
  },
  movieRow: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
  },
  movieGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.spacing.md,
  },
  movieCard: {
    marginBottom: SIZES.spacing.md,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.sm,
    textAlign: 'center',
    padding: SIZES.spacing.xl,
  },
});

export default HomeScreen;
