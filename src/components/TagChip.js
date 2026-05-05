/**
 * 标签芯片组件
 * 用于展示和选择标签
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const TagChip = ({ label, selected = false, onPress, removable = false, onRemove }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.label,
        selected && styles.selectedLabel
      ]}>
        {label}
      </Text>
      {removable && (
        <Text style={styles.removeIcon} onPress={onRemove}>×</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: 6,
    borderRadius: SIZES.radius.xl,
    gap: 6,
  },
  selectedContainer: {
    backgroundColor: COLORS.primary,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSize.sm,
  },
  selectedLabel: {
    color: COLORS.text,
    fontWeight: '500',
  },
  removeIcon: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    lineHeight: 18,
  },
});

export default TagChip;
