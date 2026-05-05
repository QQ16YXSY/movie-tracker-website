/**
 * 评分星星组件
 * 支持点击评分和仅展示两种模式
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const RatingStars = ({ rating = 0, onRate, maxStars = 5, size = 24, interactive = false }) => {
  const starValue = interactive ? rating : Math.round(rating / 2);

  const renderStar = (index) => {
    const isFilled = index < starValue;
    const StarComponent = interactive ? TouchableOpacity : View;
    
    return (
      <StarComponent
        key={index}
        onPress={() => interactive && onRate && onRate((index + 1) * 2)}
        style={styles.starContainer}
      >
        <View style={[
          styles.star,
          { width: size, height: size },
          isFilled && styles.filledStar
        ]}>
          <Text style={[
            styles.starInner,
            {
              fontSize: size * 0.9,
              color: isFilled ? COLORS.accent : COLORS.textMuted
            }
          ]}>★</Text>
        </View>
      </StarComponent>
    );
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }).map((_, index) => renderStar(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledStar: {
    transform: [{ scale: 1.05 }],
  },
  starInner: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RatingStars;
