/**
 * 影片详情页面
 * 展示影片详情，添加/编辑观影记录
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  TextInput,
  StyleSheet,
  Alert 
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { WATCH_STATUS, STATUS_LABELS, STATUS_COLORS } from '../types';
import { formatRuntime, formatDate } from '../utils/helpers';
import { storage } from '../utils/storage';
import RatingStars from '../components/RatingStars';
import TagChip from '../components/TagChip';

const MovieDetailScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [record, setRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [status, setStatus] = useState(WATCH_STATUS.WANT);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [watchDate, setWatchDate] = useState('');
  const [tags, setTags] = useState([]);

  const defaultTags = ['经典', '感人', '烧脑', '搞笑', '治愈', '励志', '视觉盛宴'];

  useEffect(() => {
    loadData();
  }, [movieId]);

  const loadData = async () => {
    const movieData = await storage.getMovieById(movieId);
    setMovie(movieData);

    const records = await storage.getRecords();
    const existingRecord = records.find(r => r.movieId === movieId);
    if (existingRecord) {
      setRecord(existingRecord);
      setStatus(existingRecord.status);
      setUserRating(existingRecord.userRating);
      setReview(existingRecord.review);
      setWatchDate(existingRecord.watchDate);
      setTags(existingRecord.tags || []);
      setIsEditing(true);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === WATCH_STATUS.WATCHED && !watchDate) {
      setWatchDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleTagToggle = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSave = async () => {
    try {
      const newRecord = {
        id: record?.id || `r${Date.now()}`,
        movieId,
        userId: 'user1',
        status,
        userRating,
        review,
        watchDate: status === WATCH_STATUS.WATCHED ? watchDate : '',
        rewatchCount: record?.rewatchCount || (status === WATCH_STATUS.WATCHED ? 1 : 0),
        tags,
      };

      await storage.addOrUpdateRecord(newRecord);
      
      Alert.alert(
        '保存成功',
        isEditing ? '观影记录已更新！' : '已添加到影单！',
        [{ text: '确定', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这条观影记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            await storage.deleteRecord(record.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!movie) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.backdropContainer}>
        <Image
          source={{ uri: movie.backdropUrl }}
          style={styles.backdrop}
          contentFit="cover"
        />
        <View style={styles.backdropOverlay} />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Image
            source={{ uri: movie.posterUrl }}
            style={styles.poster}
            contentFit="cover"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.originalTitle}>{movie.originalTitle}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.rating}>★ {movie.rating}</Text>
              <Text style={styles.metaText}>
                {movie.releaseDate?.split('-')[0]} · {formatRuntime(movie.runtime)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.genreContainer}>
          {movie.genres?.map((genre) => (
            <TagChip key={genre} label={genre} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>剧情简介</Text>
          <Text style={styles.overviewText}>{movie.overview}</Text>
          <Text style={styles.crewText}>导演：{movie.director}</Text>
          <Text style={styles.crewText}>主演：{movie.cast?.join(' / ')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEditing ? '✏️ 编辑观影记录' : '➕ 添加观影记录'}
          </Text>

          <View style={styles.statusContainer}>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.statusButton,
                  status === key && { 
                    backgroundColor: STATUS_COLORS[key],
                    ...SHADOWS.small,
                  }
                ]}
                onPress={() => handleStatusChange(key)}
              >
                <Text style={[
                  styles.statusButtonText,
                  status === key && styles.activeStatusText
                ]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {status === WATCH_STATUS.WATCHED && (
            <>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>我的评分：</Text>
                <RatingStars
                  rating={userRating}
                  onRate={setUserRating}
                  interactive
                  size={32}
                />
                <Text style={styles.ratingValue}>
                  {userRating > 0 ? `${userRating} / 10` : '未评分'}
                </Text>
              </View>

              <View style={styles.tagsContainer}>
                <Text style={styles.tagsLabel}>标签：</Text>
                <View style={styles.tagsList}>
                  {defaultTags.map((tag) => (
                    <TagChip
                      key={tag}
                      label={tag}
                      selected={tags.includes(tag)}
                      onPress={() => handleTagToggle(tag)}
                    />
                  ))}
                </View>
              </View>
            </>
          )}

          <TextInput
            style={styles.reviewInput}
            placeholder="写下你的观影感受（最多140字）..."
            placeholderTextColor={COLORS.textMuted}
            value={review}
            onChangeText={setReview}
            multiline
            maxLength={140}
            numberOfLines={4}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {isEditing ? '更新记录' : '保存记录'}
              </Text>
            </TouchableOpacity>
            
            {isEditing && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>删除</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backdropContainer: {
    position: 'relative',
    height: 220,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '600',
  },
  contentContainer: {
    marginTop: -40,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radius.xl,
    borderTopRightRadius: SIZES.radius.xl,
    padding: SIZES.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: SIZES.radius.lg,
    ...SHADOWS.card,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.xl,
    fontWeight: '800',
  },
  originalTitle: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.md,
    marginTop: 4,
  },
  rating: {
    color: COLORS.accent,
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.sm,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SIZES.spacing.xl,
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
  overviewText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSize.md,
    lineHeight: 24,
    marginBottom: SIZES.spacing.md,
  },
  crewText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.sm,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.lg,
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: SIZES.radius.lg,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  statusButtonText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
  },
  activeStatusText: {
    color: COLORS.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
  },
  ratingLabel: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.md,
  },
  ratingValue: {
    color: COLORS.accent,
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
    marginLeft: 'auto',
  },
  tagsContainer: {
    marginBottom: SIZES.spacing.lg,
  },
  tagsLabel: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.md,
    marginBottom: SIZES.spacing.md,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reviewInput: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: SIZES.fontSize.md,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: SIZES.spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: SIZES.radius.xl,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.md,
    fontWeight: '700',
  },
  deleteButton: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: 14,
    borderRadius: SIZES.radius.xl,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
  },
});

export default MovieDetailScreen;
