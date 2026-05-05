/**
 * 分区标题组件
 * 用于列表分区标题，带"查看更多"按钮
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const SectionHeader = ({ title, onSeeAll, showSeeAll = true }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAllText}>全部 →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
  },
});

export default SectionHeader;
