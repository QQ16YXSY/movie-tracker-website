/**
 * 应用主题配色
 * 采用深色模式设计，营造影院沉浸感
 */

export const COLORS = {
  // 主色调 - 深蓝紫色，代表电影的神秘感
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  
  // 辅助色
  accent: '#f59e0b', // 金色星级评分
  success: '#10b981', // 已看状态
  warning: '#f59e0b', // 在看状态
  info: '#3b82f6',   // 想看状态
  
  // 背景色
  background: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#252542',
  
  // 文字颜色
  text: '#ffffff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  
  // 功能色
  border: '#2d2d44',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const SIZES = {
  // 圆角
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    card: 20,
  },
  
  // 间距
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // 字体大小
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
};

export const SHADOWS = {
  card: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
};
