/**
 * 数据类型定义
 */

/**
 * 影片信息类型
 * @typedef {Object} Movie
 * @property {string} id - 影片ID
 * @property {string} title - 片名
 * @property {string} originalTitle - 原名
 * @property {string} posterUrl - 海报URL
 * @property {string} backdropUrl - 背景图URL
 * @property {string} releaseDate - 上映日期
 * @property {number} runtime - 片长(分钟)
 * @property {string[]} genres - 类型标签
 * @property {string} overview - 剧情简介
 * @property {number} rating - 评分
 * @property {string} director - 导演
 * @property {string[]} cast - 主演
 */

/**
 * 观影状态类型
 * @typedef {'want' | 'watching' | 'watched'} WatchStatus
 */

/**
 * 观影记录类型
 * @typedef {Object} WatchRecord
 * @property {string} id - 记录ID
 * @property {string} movieId - 影片ID
 * @property {string} userId - 用户ID
 * @property {WatchStatus} status - 观看状态
 * @property {number} userRating - 用户评分 1-10
 * @property {string} review - 短评
 * @property {string} watchDate - 观看日期
 * @property {number} rewatchCount - 重看次数
 * @property {string[]} tags - 自定义标签
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * 用户信息类型
 * @typedef {Object} User
 * @property {string} id - 用户ID
 * @property {string} nickname - 昵称
 * @property {string} avatar - 头像URL
 * @property {string} bio - 个人简介
 * @property {string[]} followers - 粉丝列表
 * @property {string[]} following - 关注列表
 * @property {boolean} isPublic - 是否公开影单
 */

export const WATCH_STATUS = {
  WANT: 'want',
  WATCHING: 'watching',
  WATCHED: 'watched',
};

export const STATUS_LABELS = {
  want: '想看',
  watching: '在看',
  watched: '已看',
};

export const STATUS_COLORS = {
  want: '#3b82f6',
  watching: '#f59e0b',
  watched: '#10b981',
};
