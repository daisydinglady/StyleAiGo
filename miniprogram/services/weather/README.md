# 天气服务 (Weather Service)

本服务使用 OpenWeather API 提供天气数据，支持获取当前天气和 7 天天气预报。

## 使用前准备

1. 注册 OpenWeather 账号：https://home.openweathermap.org/users/sign_up
2. 获取免费 API Key：https://home.openweathermap.org/api_keys
3. 将 API Key 更新到 `weatherService.js` 文件中的 `OPEN_WEATHER_API_KEY` 常量

## 上线前配置

1. 在微信公众平台添加 request 合法域名：`https://api.openweathermap.org`
2. 路径：微信公众平台 > 开发 > 开发设置 > 服务器域名 > request 合法域名

## 使用方法

```javascript
// 引入服务
const weatherService = require("../../services/weather/weatherService");

// 根据城市名称获取当前天气
weatherService
  .getCurrentWeather("beijing", "zh_cn")
  .then((data) => {
    console.log("天气数据:", data);
  })
  .catch((error) => {
    console.error("获取天气失败:", error);
  });

// 根据经纬度获取当前天气
weatherService
  .getCurrentWeatherByCoords(39.9042, 116.4074, "zh_cn")
  .then((data) => {
    console.log("天气数据:", data);
  })
  .catch((error) => {
    console.error("获取天气失败:", error);
  });

// 获取7天天气预报
weatherService
  .getWeatherForecast(39.9042, 116.4074, "zh_cn")
  .then((data) => {
    console.log("预报数据:", data);
  })
  .catch((error) => {
    console.error("获取预报失败:", error);
  });
```

## API 说明

### getCurrentWeather(city, lang, units)

根据城市名称获取当前天气

- `city`: 城市名称，例如 "Beijing"
- `lang`: 语言，默认 "zh_cn"（中文）
- `units`: 单位，默认 "metric"（摄氏度）

### getCurrentWeatherByCoords(lat, lon, lang, units)

根据经纬度获取当前天气

- `lat`: 纬度
- `lon`: 经度
- `lang`: 语言，默认 "zh_cn"（中文）
- `units`: 单位，默认 "metric"（摄氏度）

### getWeatherForecast(lat, lon, lang, units)

获取 7 天天气预报

- `lat`: 纬度
- `lon`: 经度
- `lang`: 语言，默认 "zh_cn"（中文）
- `units`: 单位，默认 "metric"（摄氏度）

## 返回数据格式

详见 `weatherService.js` 中的 `formatCurrentWeather` 和 `formatWeatherForecast` 方法。
