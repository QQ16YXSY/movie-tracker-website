/**
 * 工具函数集合
 */

/**
 * 格式化日期
 * @param {string} dateStr - ISO日期字符串
 * @returns {string} 格式化后的日期
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '未设置';
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

/**
 * 格式化片长
 * @param {number} minutes - 分钟数
 * @returns {string} 格式化后的时长
 */
export const formatRuntime = (minutes) => {
  if (!minutes) return '未知';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}小时${mins}分` : `${mins}分钟`;
};

/**
 * 获取评分标签（力荐/推荐/一般/不推荐）
 * @param {number} rating - 评分
 * @returns {string} 评分标签
 */
export const getRatingLabel = (rating) => {
  if (rating >= 9) return '力荐';
  if (rating >= 7) return '推荐';
  if (rating >= 5) return '一般';
  return '不推荐';
};

/**
 * 获取评分颜色
 * @param {number} rating - 评分
 * @returns {string} 颜色值
 */
export const getRatingColor = (rating) => {
  if (rating >= 8) return '#10b981';
  if (rating >= 6) return '#f59e0b';
  return '#ef4444';
};

/**
 * 截取文本，超出部分显示省略号
 * @param {string} text - 原文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截取后的文本
 */
export const truncateText = (text, maxLength = 140) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 生成星级评分组件
 * @param {number} rating - 评分 (0-10)
 * @returns {string} 星级字符
 */
export const generateStars = (rating) => {
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};

/**
 * 防抖函数
 * @param {Function} func - 执行函数
 * @param {number} wait - 等待时间
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 按日期分组观影记录
 * @param {Array} records - 记录数组
 * @returns {Object} 分组后的记录
 */
export const groupRecordsByDate = (records) => {
  return records.reduce((groups, record) => {
    const date = record.watchDate || record.updatedAt?.split('T')[0] || '未知';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {});
};
