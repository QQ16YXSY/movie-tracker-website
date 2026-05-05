/**
 * 搜索页面
 * 搜索和浏览所有影片
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { storage } from '../utils/storage';
import { debounce } from '../utils/helpers';
import MovieListItem from '../components/MovieListItem';

const SearchScreen = ({ navigation }) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllMovies();
    loadRecords();
  }, []);

  const loadAllMovies = async () => {
    setLoading(true);
    const movies = await storage.getMovies();
    setResults(movies);
    setLoading(false);
  };

  const loadRecords = async () => {
    const recs = await storage.getRecords();
    setRecords(recs);
  };

  const handleSearch = debounce(async (searchKeyword) => {
    setLoading(true);
    const movies = await storage.searchMovies(searchKeyword);
    setResults(movies);
    setLoading(false);
  }, 300);

  const getRecordForMovie = (movieId) => {
    return records.find(r => r.movieId === movieId);
  };

  const handleMoviePress = (movieId) => {
    navigation.navigate('MovieDetail', { movieId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 搜索影片</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索电影、导演..."
          placeholderTextColor={COLORS.textMuted}
          value={keyword}
          onChangeText={(text) => {
            setKeyword(text);
            handleSearch(text);
          }}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MovieListItem
            movie={item}
            record={getRecordForMovie(item.id)}
            onPress={() => handleMoviePress(item.id)}
            style={styles.listItem}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? '搜索中...' : '没有找到相关影片'}
            </Text>
          </View>
        }
      />
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
  searchContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: SIZES.fontSize.md,
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
    borderRadius: SIZES.radius.xl,
  },
  listContent: {
    padding: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
    paddingBottom: 100,
  },
  listItem: {
    marginBottom: SIZES.spacing.md,
  },
  emptyContainer: {
    padding: SIZES.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.md,
  },
});

export default SearchScreen;
