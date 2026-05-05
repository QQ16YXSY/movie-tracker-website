/**
 * 影片卡片组件
 * 精美的海报卡片，用于网格展示
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { STATUS_COLORS, STATUS_LABELS } from '../types';
import RatingStars from './RatingStars';

const MovieCard = ({ movie, record, onPress, style }) => {
  const getStatusBadge = () => {
    if (!record) return null;
    return (
      <View style={[
        styles.statusBadge,
        { backgroundColor: STATUS_COLORS[record.status] }
      ]}>
        <Text style={styles.statusText}>{STATUS_LABELS[record.status]}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: movie.posterUrl }}
          style={styles.poster}
          contentFit="cover"
          transition={300}
        />
        {getStatusBadge()}
        
        {record?.userRating > 0 && (
          <View style={styles.ratingBadge}>
            <RatingStars rating={record.userRating} size={10} />
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.ratingText}>
            ★ {movie.rating}
          </Text>
          <Text style={styles.yearText}>
            {movie.releaseDate?.split('-')[0]}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 110,
    ...SHADOWS.card,
  },
  posterContainer: {
    position: 'relative',
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
    aspectRatio: 2 / 3,
  },
  poster: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.radius.lg,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: SIZES.radius.sm,
  },
  statusText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '600',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: SIZES.radius.sm,
  },
  infoContainer: {
    marginTop: SIZES.spacing.sm,
    gap: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingText: {
    color: COLORS.accent,
    fontSize: SIZES.fontSize.xs,
    fontWeight: '600',
  },
  yearText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.xs,
  },
});

export default MovieCard;
