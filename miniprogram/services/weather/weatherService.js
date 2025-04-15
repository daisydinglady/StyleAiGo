// weatherService.js
// OpenWeather API服务

// 请在这里替换为您从OpenWeather获取的API Key
// 注册地址: https://home.openweathermap.org/users/sign_up
const OPEN_WEATHER_API_KEY = "1529e3a99a5a04a354958e9562922baa";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * 天气服务类，提供获取天气数据的方法
 */
const weatherService = {
  /**
   * 根据城市名称获取当前天气
   * @param {string} city 城市名称
   * @param {string} lang 语言，默认zh_cn（中文）
   * @param {string} units 单位，默认metric（摄氏度）
   * @returns {Promise} 返回天气数据Promise
   */
  getCurrentWeather: function (city, lang = "zh_cn", units = "metric") {
    return new Promise((resolve, reject) => {
      console.log(`开始获取城市天气: ${city}, 语言: ${lang}, 单位: ${units}`);
      wx.request({
        url: `${BASE_URL}/weather`,
        data: {
          q: city,
          appid: OPEN_WEATHER_API_KEY,
          lang: lang,
          units: units,
        },
        success: (res) => {
          console.log("获取城市天气结果:", res);
          if (res.statusCode === 200) {
            const formattedData = this.formatCurrentWeather(res.data);
            console.log("格式化后的城市天气数据:", formattedData);
            resolve(formattedData);
          } else {
            const errorMsg = `获取天气数据失败: ${
              res.statusCode
            }, ${JSON.stringify(res.data)}`;
            console.error(errorMsg);
            reject(new Error(errorMsg));
          }
        },
        fail: (err) => {
          console.error(`请求失败: ${err.errMsg}`, err);
          reject(new Error(`请求失败: ${err.errMsg}`));
        },
      });
    });
  },

  /**
   * 根据经纬度获取当前天气
   * @param {number} lat 纬度
   * @param {number} lon 经度
   * @param {string} lang 语言，默认zh_cn（中文）
   * @param {string} units 单位，默认metric（摄氏度）
   * @returns {Promise} 返回天气数据Promise
   */
  getCurrentWeatherByCoords: function (
    lat,
    lon,
    lang = "zh_cn",
    units = "metric"
  ) {
    return new Promise((resolve, reject) => {
      console.log(
        `开始获取坐标天气: 纬度=${lat}, 经度=${lon}, 语言=${lang}, 单位=${units}`
      );
      wx.request({
        url: `${BASE_URL}/weather`,
        data: {
          lat: lat,
          lon: lon,
          appid: OPEN_WEATHER_API_KEY,
          lang: lang,
          units: units,
        },
        success: (res) => {
          console.log("获取坐标天气结果:", res);
          if (res.statusCode === 200) {
            console.log("坐标天气数据:", res.data);
            const formattedData = this.formatCurrentWeather(res.data);
            console.log("格式化后的坐标天气数据:", formattedData);
            resolve(formattedData);
          } else {
            const errorMsg = `获取天气数据失败: ${
              res.statusCode
            }, ${JSON.stringify(res.data)}`;
            console.error(errorMsg);
            reject(new Error(errorMsg));
          }
        },
        fail: (err) => {
          console.error(`请求失败: ${err.errMsg}`, err);
          reject(new Error(`请求失败: ${err.errMsg}`));
        },
      });
    });
  },

  /**
   * 获取7天天气预报
   * @param {number|Object} latOrOptions 纬度或配置对象
   * @param {number} [lon] 经度
   * @param {string} [lang] 语言
   * @param {string} [units] 单位
   * @returns {Promise|undefined} 返回Promise或undefined（如果使用回调）
   */
  getWeatherForecast: function (latOrOptions, lon, lang, units) {
    // 检查是否使用了旧的参数调用方式
    if (typeof latOrOptions === "number" || typeof latOrOptions === "string") {
      // 旧的调用方式: getWeatherForecast(lat, lon, lang, units)
      console.log("使用Promise方式获取天气预报");
      return new Promise((resolve, reject) => {
        this.getWeatherForecast({
          latitude: latOrOptions,
          longitude: lon,
          lang: lang || "zh_cn",
          units: units || "metric",
          success: resolve,
          fail: reject,
        });
      });
    }

    // 新的调用方式: getWeatherForecast(options)
    const options = latOrOptions || {};
    const latitude = options.latitude || "39.9042";
    const longitude = options.longitude || "116.4074";
    const language = options.lang || "zh_cn";
    const unitSystem = options.units || "metric";

    console.log("获取天气预报，参数：", {
      latitude,
      longitude,
      language,
      unitSystem,
    });

    wx.request({
      url: `${BASE_URL}/forecast`,
      method: "GET",
      data: {
        lat: latitude,
        lon: longitude,
        appid: OPEN_WEATHER_API_KEY,
        lang: language,
        units: unitSystem,
        cnt: 56, // 获取最大天数（7天，3小时间隔），非会员最多获取6天数据
      },
      success: (res) => {
        console.log("天气预报响应状态:", res.statusCode);
        console.log("未格式化：", res.data)

        if (res.statusCode === 200) {
          try {
            const formattedData = this.formatForecastData(res.data);
            console.log("格式化后的天气预报数据:", formattedData);
            if (options.success) {
              options.success(formattedData);
            }
          } catch (error) {
            console.error("天气预报数据格式化错误:", error);
            if (options.fail) {
              options.fail({
                errMsg: "天气预报数据格式化错误:" + error.message,
                code: "FORMAT_ERROR",
                originalData: res.data,
              });
            }
          }
        } else {
          console.error("天气预报请求失败:", res.statusCode, res.data);
          if (options.fail) {
            options.fail({
              errMsg: "天气预报请求失败: " + res.statusCode,
              code: "API_ERROR",
              statusCode: res.statusCode,
              apiResponse: res.data,
            });
          }
        }
      },
      fail: (err) => {
        console.error("天气预报请求网络错误:", err);
        if (options.fail) {
          options.fail({
            errMsg: "天气预报请求网络错误: " + err.errMsg,
            code: "NETWORK_ERROR",
            originalError: err,
          });
        }
      },
      complete: options.complete,
    });
  },

  /**
   * 格式化当前天气数据
   * @param {Object} data API返回的原始数据
   * @returns {Object} 格式化后的天气数据
   */
  formatCurrentWeather: function (data) {
    if (!data) return null;

    return {
      cityName: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      weatherMain: data.weather[0].main,
      weatherDescription: data.weather[0].description,
      weatherIcon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      clouds: data.clouds.all,
      sunrise: this.formatTime(data.sys.sunrise * 1000),
      sunset: this.formatTime(data.sys.sunset * 1000),
      timezone: data.timezone,
      dt: this.formatDate(data.dt * 1000),
      coords: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    };
  },

  /**
   * 格式化天气预报数据
   * @param {Object} data 原始数据
   * @returns {Object} 格式化后的数据
   */
  formatForecastData: function (data) {
    console.log("开始格式化天气预报数据");
    const forecast = data.list || [];
    if (!forecast.length) {
      console.error("天气预报数据格式错误：没有list字段或list为空");
      return { daily: [] };
    }

    // 按天分组数据，一天取一条数据（中午12点左右的数据）
    const dailyMap = {};
    forecast.forEach((item) => {
      if (!item.dt) {
        console.warn("天气预报项缺少dt字段:", item);
        return;
      }

      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const hour = date.getHours();

      // 对于每一天，我们选择中午12点左右的数据
      // 如果当前日期没有数据，或者当前时间是11-14点之间（更接近中午），则更新
      if (!dailyMap[dateStr] || (hour >= 11 && hour <= 14)) {
        dailyMap[dateStr] = item;
      } else if (dailyMap[dateStr]) {
        // 更新最高温和最低温
        if (item.main) {
          if (
            !dailyMap[dateStr].main.temp_max ||
            item.main.temp_max > dailyMap[dateStr].main.temp_max
          ) {
            dailyMap[dateStr].main.temp_max = item.main.temp_max;
          }
          if (
            !dailyMap[dateStr].main.temp_min ||
            item.main.temp_min < dailyMap[dateStr].main.temp_min
          ) {
            dailyMap[dateStr].main.temp_min = item.main.temp_min;
          }
        }
      }
    });

    // 将map转换为数组并排序
    const daily = Object.values(dailyMap)
      .map((item) => {
        const date = new Date(item.dt * 1000);
        const weather = item.weather && item.weather[0] ? item.weather[0] : {};

        // 返回与index.js期望格式一致的数据结构
        return {
          dt: item.dt,
          date: date.toISOString().split("T")[0],
          day: this.getDayOfWeek(date.getDay()),
          temp: {
            day: item.main ? Math.round(item.main.temp) : 20,
            min: item.main ? Math.round(item.main.temp_min) : 15,
            max: item.main ? Math.round(item.main.temp_max) : 25,
          },
          weather: {
            id: weather.id || 800,
            main: weather.main || "Clear",
            description: weather.description || "晴朗",
            icon: weather.icon || "01d",
          },
          // 为保持兼容，同时提供两种格式的数据
          weatherMain: weather.main || "Clear",
          weatherDescription: weather.description || "晴朗",
          weatherIcon: `https://openweathermap.org/img/wn/${
            weather.icon || "01d"
          }@2x.png`,
          tempDay: item.main ? Math.round(item.main.temp) : 20,
          tempMin: item.main ? Math.round(item.main.temp_min) : 15,
          tempMax: item.main ? Math.round(item.main.temp_max) : 25,
          pop: item.pop !== undefined ? Math.round(item.pop * 100) : 0, // 降水概率
          humidity: item.main ? item.main.humidity : 50, // 湿度
          windSpeed: item.wind ? item.wind.speed : 2, // 风速
        };
      })
      .sort((a, b) => a.dt - b.dt);

    console.log(`格式化完成，共${daily.length}天天气预报`);
    return { daily };
  },

  /**
   * 获取星期几
   * @param {number} day 星期几的数字
   * @returns {string} 星期几的汉字表示
   */
  getDayOfWeek: function (day) {
    const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return days[day];
  },

  /**
   * 格式化时间戳为时间字符串
   * @param {number} timestamp 时间戳
   * @returns {string} 格式化后的时间字符串 HH:MM
   */
  formatTime: function (timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  },

  /**
   * 格式化时间戳为日期字符串
   * @param {number} timestamp 时间戳
   * @returns {string} 格式化后的日期字符串 YYYY-MM-DD HH:MM
   */
  formatDate: function (timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  /**
   * 格式化时间戳为小时字符串
   * @param {number} timestamp 时间戳
   * @returns {string} 格式化后的小时字符串 HH:MM
   */
  // formatHour: function (timestamp) {
  //   const date = new Date(timestamp);
  //   const hours = date.getHours().toString().padStart(2, "0");
  //   const minutes = date.getMinutes().toString().padStart(2, "0");
  //   return `${hours}:${minutes}`;
  // },


};

module.exports = weatherService;
