/**
 * 本地存储工具类
 * 封装AsyncStorage操作，实现观影记录的持久化存储
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_MOVIES, MOCK_RECORDS, DEFAULT_USER } from '../data/mockData';

const STORAGE_KEYS = {
  MOVIES: '@movies',
  RECORDS: '@watch_records',
  USER: '@user',
  TAGS: '@custom_tags',
};

class StorageManager {
  /**
   * 初始化数据 - 首次启动时导入模拟数据
   */
  async initData() {
    try {
      const records = await this.getRecords();
      if (records.length === 0) {
        await this.saveMovies(MOCK_MOVIES);
        await this.saveRecords(MOCK_RECORDS);
        await this.saveUser(DEFAULT_USER);
      }
    } catch (error) {
      console.error('初始化数据失败:', error);
    }
  }

  /**
   * 保存影片列表
   * @param {Array} movies - 影片数组
   */
  async saveMovies(movies) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
    } catch (error) {
      console.error('保存影片失败:', error);
    }
  }

  /**
   * 获取所有影片
   * @returns {Promise<Array>} 影片数组
   */
  async getMovies() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MOVIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取影片失败:', error);
      return [];
    }
  }

  /**
   * 根据ID获取单个影片
   * @param {string} movieId - 影片ID
   * @returns {Promise<Object|null>} 影片信息
   */
  async getMovieById(movieId) {
    const movies = await this.getMovies();
    return movies.find(m => m.id === movieId) || null;
  }

  /**
   * 保存观影记录
   * @param {Array} records - 观影记录数组
   */
  async saveRecords(records) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error('保存观影记录失败:', error);
    }
  }

  /**
   * 获取所有观影记录
   * @returns {Promise<Array>} 观影记录数组
   */
  async getRecords() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取观影记录失败:', error);
      return [];
    }
  }

  /**
   * 添加或更新观影记录
   * @param {Object} record - 观影记录
   */
  async addOrUpdateRecord(record) {
    const records = await this.getRecords();
    const existingIndex = records.findIndex(r => r.id === record.id);
    
    if (existingIndex >= 0) {
      records[existingIndex] = {
        ...record,
        updatedAt: new Date().toISOString(),
      };
    } else {
      records.push({
        ...record,
        id: `r${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    await this.saveRecords(records);
  }

  /**
   * 删除观影记录
   * @param {string} recordId - 记录ID
   */
  async deleteRecord(recordId) {
    const records = await this.getRecords();
    const filtered = records.filter(r => r.id !== recordId);
    await this.saveRecords(filtered);
  }

  /**
   * 根据状态获取观影记录
   * @param {string} status - 观看状态
   * @returns {Promise<Array>} 过滤后的记录
   */
  async getRecordsByStatus(status) {
    const records = await this.getRecords();
    return records.filter(r => r.status === status);
  }

  /**
   * 保存用户信息
   * @param {Object} user - 用户信息
   */
  async saveUser(user) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('保存用户失败:', error);
    }
  }

  /**
   * 获取用户信息
   * @returns {Promise<Object>} 用户信息
   */
  async getUser() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch (error) {
      console.error('获取用户失败:', error);
      return DEFAULT_USER;
    }
  }

  /**
   * 搜索影片
   * @param {string} keyword - 搜索关键词
   * @returns {Promise<Array>} 搜索结果
   */
  async searchMovies(keyword) {
    const movies = await this.getMovies();
    if (!keyword) return movies;
    
    const lowerKeyword = keyword.toLowerCase();
    return movies.filter(m => 
      m.title.toLowerCase().includes(lowerKeyword) ||
      m.originalTitle.toLowerCase().includes(lowerKeyword) ||
      m.director.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * 获取观影统计
   * @returns {Promise<Object>} 统计数据
   */
  async getStats() {
    const records = await this.getRecords();
    const movies = await this.getMovies();
    
    const watched = records.filter(r => r.status === 'watched');
    const watching = records.filter(r => r.status === 'watching');
    const want = records.filter(r => r.status === 'want');
    
    let totalMinutes = 0;
    const genreCount = {};
    
    watched.forEach(record => {
      const movie = movies.find(m => m.id === record.movieId);
      if (movie) {
        totalMinutes += movie.runtime;
        movie.genres.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });
    
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    return {
      totalWatched: watched.length,
      watchingCount: watching.length,
      wantCount: want.length,
      totalHours: Math.round(totalMinutes / 60),
      totalMinutes,
      topGenres,
      avgRating: watched.filter(r => r.userRating > 0).length > 0
        ? (watched.reduce((sum, r) => sum + r.userRating, 0) / watched.filter(r => r.userRating > 0).length).toFixed(1)
        : 0,
    };
  }

  /**
   * 清除所有数据（开发用）
   */
  async clearAll() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('清除数据失败:', error);
    }
  }
}

export const storage = new StorageManager();
