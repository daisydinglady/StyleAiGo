const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

  /**
   * 格式化时间戳为星期几
   * @param {number} timestamp 时间戳
   * @returns {string} 格式化后的星期几
   */
  const formatDay = (timestamp) => {
    const date = new Date(timestamp);
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return {
      date: `${month}-${day}`,
      weekday: weekdays[date.getDay()],
    };
  }

module.exports = {
  formatTime
}
