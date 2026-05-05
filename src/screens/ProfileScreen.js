/**
 * 个人中心页面
 * 用户信息和设置
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { storage } from '../utils/storage';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userData = await storage.getUser();
    const statsData = await storage.getStats();
    setUser(userData);
    setStats(statsData);
  };

  const handleResetData = () => {
    Alert.alert(
      '重置数据',
      '确定要重置所有数据吗？此操作不可恢复！',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定重置',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAll();
            await storage.initData();
            loadData();
            Alert.alert('提示', '数据已重置');
          },
        },
      ]
    );
  };

  const MenuItem = ({ icon, label, value, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        <Text style={styles.menuArrow}>→</Text>
      </View>
    </TouchableOpacity>
  );

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 个人中心</Text>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
          contentFit="cover"
        />
        <Text style={styles.nickname}>{user.nickname}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        
        <View style={styles.profileStats}>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>{stats.totalWatched || 0}</Text>
            <Text style={styles.profileStatLabel}>已看</Text>
          </View>
          <View style={styles.profileStatDivider} />
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>{stats.totalHours || 0}</Text>
            <Text style={styles.profileStatLabel}>小时</Text>
          </View>
          <View style={styles.profileStatDivider} />
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>{stats.avgRating || 0}</Text>
            <Text style={styles.profileStatLabel}>均分</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          icon="📁"
          label="我的影单"
          value={`${stats.totalWatched || 0} 部`}
        />
        <MenuItem
          icon="⭐"
          label="我的收藏"
          value="0 部"
        />
        <MenuItem
          icon="🏷️"
          label="我的标签"
        />
        <MenuItem
          icon="⚙️"
          label="通用设置"
        />
        <MenuItem
          icon="🔔"
          label="消息提醒"
        />
        <MenuItem
          icon="🌙"
          label="深色模式"
          value="开启"
        />
        <MenuItem
          icon="❓"
          label="关于我们"
        />
        <MenuItem
          icon="🔄"
          label="重置数据"
          onPress={handleResetData}
        />
      </View>

      <Text style={styles.version}>版本 1.0.0</Text>
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
  profileCard: {
    backgroundColor: COLORS.surface,
    margin: SIZES.spacing.lg,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.spacing.lg,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: SIZES.spacing.md,
  },
  nickname: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  bio: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.sm,
    marginBottom: SIZES.spacing.lg,
  },
  profileStats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: SIZES.spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  profileStatItem: {
    alignItems: 'center',
  },
  profileStatNumber: {
    color: COLORS.primary,
    fontSize: SIZES.fontSize.xl,
    fontWeight: '800',
  },
  profileStatLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.xs,
    marginTop: 2,
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  menuContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.spacing.lg,
    borderRadius: SIZES.radius.xl,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.md,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.md,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.sm,
  },
  menuValue: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.sm,
  },
  menuArrow: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.md,
  },
  version: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSize.xs,
    textAlign: 'center',
    marginTop: SIZES.spacing.xl,
  },
});

export default ProfileScreen;
