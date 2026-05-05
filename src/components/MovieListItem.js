/**
 * 影片列表项组件
 * 用于列表形式展示影片和观影记录
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { STATUS_COLORS, STATUS_LABELS } from '../types';
import { formatDate, truncateText } from '../utils/helpers';
import RatingStars from './RatingStars';

const MovieListItem = ({ movie, record, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: movie.posterUrl }}
        style={styles.poster}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {movie.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {movie.originalTitle}
            </Text>
          </View>
          
          {record && (
            <View style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[record.status] }
            ]}>
              <Text style={styles.statusText}>{STATUS_LABELS[record.status]}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {movie.releaseDate?.split('-')[0]} · {movie.genres?.join(' / ')}
          </Text>
        </View>
        
        <View style={styles.ratingRow}>
          <Text style={styles.movieRating}>★ {movie.rating}</Text>
          
          {record?.userRating > 0 && (
            <View style={styles.userRatingContainer}>
              <Text style={styles.myRatingLabel}>我的评分：</Text>
              <RatingStars rating={record.userRating} size={14} />
            </View>
          )}
        </View>
        
        {record?.review && (
          <Text style={styles.reviewText} numberOfLines={2}>
            {truncateText(record.review, 60)}
          </Text>
        )}
        
        {record?.watchDate && (
          <Text style={styles.dateText}>
            观看于 {formatDate(record.watchDate)}
            {record.rewatchCount > 1 && ` · 第${record.rewatchCount}刷`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.spacing.md,
    ...SHADOWS.small,
    gap: SIZES.spacing.md,
  },
  poster: {
    width: 70,
    height: 105,
    borderRadius: SIZES.radius.md,
  },
  contentContainer: {
    flex: 1,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: SIZES.spacing.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.xs,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radius.sm,
  },
  statusText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.md,
  },
  movieRating: {
    color: COLORS.accent,
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
  },
  userRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  myRatingLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.xs,
  },
  reviewText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSize.xs,
    lineHeight: 16,
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.xs,
  },
});

export default MovieListItem;
