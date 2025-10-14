/**
 * 格式化数字，添加千位符
 * @param {number} num - 要格式化的数字
 * @returns {string} - 格式化后的字符串
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

