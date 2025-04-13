// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    currentPage: 'ootd',
    weatherData: {
      city: '北京市',
      date: '2023年10月25日 周三',
      temperature: '25°',
      condition: '晴',
      wind: '微风',
      icon: 'sun' // 这个可以根据实际天气情况来显示不同的图标
    },
    forecastData: [
      { day: '今天', icon: '🌞', highTemp: '25°', lowTemp: '18°' },
      { day: '明天', icon: '⛅', highTemp: '23°', lowTemp: '17°' },
      { day: '周四', icon: '☁️', highTemp: '22°', lowTemp: '16°' },
      { day: '周五', icon: '🌧️', highTemp: '20°', lowTemp: '15°' },
      { day: '周六', icon: '🌧️', highTemp: '19°', lowTemp: '14°' },
      { day: '周日', icon: '🌧️', highTemp: '21°', lowTemp: '15°' },
      { day: '下周一', icon: '⛅', highTemp: '23°', lowTemp: '16°' }
    ],
    styles: [
      { id: 1, name: '运动休闲风', icon: 'casual-icon' },
      { id: 2, name: '商务精英风', icon: 'business-icon' },
      { id: 3, name: '日系潮流风', icon: 'japanese-icon' },
      { id: 4, name: '韩系简约风', icon: 'korean-icon' },
      { id: 5, name: '学院风', icon: 'academic-icon' },
      { id: 6, name: '街头嘻哈风', icon: 'hiphop-icon' },
      { id: 7, name: '户外机能风', icon: 'outdoor-icon' },
      { id: 8, name: '复古文艺风', icon: 'retro-icon' },
      { id: 9, name: '极简主义风', icon: 'minimal-icon' },
      { id: 10, name: '工装风', icon: 'workwear-icon' }
    ],
    selectedStyle: '',
    outfitData: {
      imageUrl: '/images/outfit-placeholder.svg',
      description: '简约舒适风格'
    },
    isIPhoneX: false, // 用于判断是否为iPhone X及以上机型
    deviceInfo: {}, // 用于存储设备信息
    
    // OOTD弹窗相关数据
    showOOTDPopup: false,
    ootdRecommendation: {
      weather: {
        temperature: "25°",
        condition: "晴"
      },
      styleType: "",
      description: "",
      items: [],
      images: [],
      tip: ""
    },
    wardrobe: {
      recent: [
        { id: 1, name: '黑色T恤', image: '/images/clothing/tshirt-black.png', type: 'top' },
        { id: 2, name: '牛仔裤', image: '/images/clothing/jeans-blue.png', type: 'bottom' },
        { id: 3, name: '白色运动鞋', image: '/images/clothing/sneakers-white.png', type: 'shoes' }
      ],
      recommended: [
        { id: 1, name: '休闲套装', image: '/images/outfits/casual-set.png' },
        { id: 2, name: '商务套装', image: '/images/outfits/business-set.png' }
      ]
    }
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad() {
    console.log('首页加载中...');
    
    // 检查引导状态
    this.checkOnboardingStatus();
    
    // 检测设备信息，进行适配
    this.checkDeviceInfo();

    // 页面加载时获取天气数据和当前日期
    this.getCurrentDate();
    
    // 从本地存储获取用户设置的城市
    this.syncCityFromStorage();
    
    // 获取天气数据
    this.getWeatherData();

    // 获取用户位置
    this.getUserLocation();
  },
  
  // 检查是否需要跳转到引导页
  checkOnboardingStatus() {
    try {
      // 检查本地存储中的引导完成标记
      const onboardingCompleted = wx.getStorageSync('onboardingCompleted');
      console.log('引导完成状态检查:', onboardingCompleted);
      
      // 从全局状态获取引导完成状态
      const app = getApp();
      const globalStatus = app.globalData.onboardingCompleted;
      console.log('全局引导状态:', globalStatus);
      
      // 如果本地存储或全局状态中已标记为完成引导，则不跳转
      if (onboardingCompleted === 'true' || globalStatus === true) {
        console.log('引导已完成，不需要跳转');
        return;
      }
      
      // 检查是否有任何用户数据，如果有，也视为已完成引导
      const userCity = wx.getStorageSync('userCity');
      const userGender = wx.getStorageSync('userGender');
      const userPersonalDescription = wx.getStorageSync('userPersonalDescription');
      
      if (userCity || userGender || userPersonalDescription) {
        console.log('发现用户数据，视为已完成引导');
        // 补充设置完成标记，避免后续重复检查
        wx.setStorageSync('onboardingCompleted', 'true');
        app.globalData.onboardingCompleted = true;
        return;
      }
      
      console.log('未完成引导，准备跳转到引导页...');
      // 未完成引导，跳转到引导页
      wx.redirectTo({
        url: '/pages/onboarding/onboarding'
      });
    } catch (e) {
      console.error('检查引导状态失败:', e);
    }
  },
  
  // 保存到本地存储
  saveToStorage: function(key, value) {
    try {
      wx.setStorageSync(key, value);
      console.log(`保存数据成功: ${key} = ${value}`);
    } catch (e) {
      console.error(`保存数据失败: ${key}`, e);
    }
  },

  // 检测设备信息，进行适配
  checkDeviceInfo() {
    try {
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync();
      const deviceInfo = {
        brand: systemInfo.brand,
        model: systemInfo.model,
        system: systemInfo.system,
        platform: systemInfo.platform,
        screenWidth: systemInfo.screenWidth,
        screenHeight: systemInfo.screenHeight,
        windowWidth: systemInfo.windowWidth,
        windowHeight: systemInfo.windowHeight,
        statusBarHeight: systemInfo.statusBarHeight,
        safeArea: systemInfo.safeArea || {},
      };

      // 判断是否为iPhone X及以上机型（有底部安全区域的机型）
      const isIPhoneX = systemInfo.model.indexOf('iPhone X') >= 0 ||
        (systemInfo.safeArea && systemInfo.safeArea.bottom < systemInfo.screenHeight);

      this.setData({
        deviceInfo,
        isIPhoneX
      });

      console.log('设备信息:', deviceInfo);
      console.log('是否为iPhone X及以上机型:', isIPhoneX);
    } catch (e) {
      console.error('获取设备信息失败:', e);
    }
  },

  // 获取当前日期和星期，同时更新七日天气预报
  getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekDay = weekDays[now.getDay()];

    // 确保月份和日期为两位数
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;

    const dateString = `${year}年${formattedMonth}月${formattedDay}日 周${weekDay}`;

    // 更新七日天气预报日期
    this.updateForecastDates(now);

    // 直接更新天气数据中的日期
    this.setData({
      'weatherData.date': dateString
    });

    return dateString;
  },

  // 更新七日天气预报的日期标签
  updateForecastDates(currentDate) {
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const forecastData = [];

    // 保存原有的图标和温度数据
    const originalData = this.data.forecastData;

    // 生成未来七天的日期标签
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);

      const dayOfWeek = date.getDay();

      // 计算日期标签：今天、明天或周几
      let dayLabel;
      if (i === 0) {
        dayLabel = '今天';
      } else if (i === 1) {
        dayLabel = '明天';
      } else {
        // 统一显示为"周X"，不区分本周和下周
        dayLabel = `周${weekDays[dayOfWeek]}`;
      }

      // 保持原有的图标和温度数据
      forecastData.push({
        day: dayLabel,
        icon: originalData[i] ? originalData[i].icon : '🌤️',
        highTemp: originalData[i] ? originalData[i].highTemp : '25°',
        lowTemp: originalData[i] ? originalData[i].lowTemp : '18°'
      });
    }

    // 更新forecastData
    this.setData({
      forecastData: forecastData
    });
  },

  // 获取穿搭推荐的方法
  getOutfitRecommendation() {
    // 这里可以添加获取穿搭推荐的API调用
    // 示例代码
    /*
    wx.request({
      url: 'outfit-api-url',
      success: (res) => {
        this.setData({
          outfitData: {
            imageUrl: res.data.imageUrl,
            description: res.data.description
          }
        });
      }
    });
    */
  },

  // 监听页面显示
  onShow() {
    // 每次显示页面时都同步城市设置
    this.syncCityFromStorage();
    
    // 更新天气数据
    this.getWeatherData();
    
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
    // 每次页面显示时检查设备方向
    this.checkDeviceOrientation();
  },

  // 检查设备方向
  checkDeviceOrientation() {
    wx.onDeviceMotionChange((res) => {
      // 可以根据设备方向调整UI
      console.log('设备方向变化:', res);
    });
  },

  // 错误处理
  onError(err) {
    console.error('页面发生错误:', err);
  },

  // 从本地存储同步城市设置
  syncCityFromStorage() {
    try {
      const userCity = wx.getStorageSync('userCity');
      console.log('从本地存储读取到城市:', userCity);
      
      // 如果有设置城市，更新天气卡片中的城市
      if (userCity) {
        this.setData({
          'weatherData.city': userCity
        });
        console.log('天气卡片城市已更新为:', userCity);
      }
    } catch (e) {
      console.error('同步城市设置失败:', e);
    }
  },

  // 获取用户位置
  getUserLocation() {
    // 检查是否开启了自动定位
    const autoLocation = wx.getStorageSync('autoLocation');
    console.log('自动定位设置:', autoLocation);
    
    // 如果明确关闭了自动定位，则使用用户设置的城市
    if (autoLocation === 'false') {
      console.log('自动定位已关闭，使用用户设置的城市');
      return;
    }
    
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        console.log('当前位置:', latitude, longitude);

        // 根据经纬度获取城市信息
        this.getCityFromLocation(latitude, longitude);
      },
      fail: (err) => {
        console.error('获取位置失败:', err);
        // 获取失败时使用用户设置的城市或默认城市
        const userCity = wx.getStorageSync('userCity');
        this.setData({
          'weatherData.city': userCity || '北京市'
        });
      }
    });
  },

  // 根据经纬度获取城市信息
  getCityFromLocation(latitude, longitude) {
    // 可以调用微信的逆地址解析API或其他第三方地图API
    // 这里使用模拟数据
    /*
    wx.request({
      url: 'https://api.map.baidu.com/reverse_geocoding/v3',
      data: {
        ak: 'YOUR_BAIDU_MAP_KEY',
        location: `${latitude},${longitude}`,
        output: 'json'
      },
      success: (res) => {
        if (res.data && res.data.result && res.data.result.addressComponent) {
          const city = res.data.result.addressComponent.city;
          
          // 检查自动定位是否开启
          const autoLocation = wx.getStorageSync('autoLocation');
          if (autoLocation !== 'false') {
            this.setData({
              'weatherData.city': city
            });
            
            // 获取该城市的天气数据
            this.getWeatherData(city);
          }
        }
      },
      fail: (err) => {
        console.error('获取城市信息失败:', err);
      }
    });
    */

    // 模拟数据
    setTimeout(() => {
      // 检查自动定位是否开启
      const autoLocation = wx.getStorageSync('autoLocation');
      if (autoLocation !== 'false') {
        const locationCity = '深圳市';
        this.setData({
          'weatherData.city': locationCity
        });
        console.log('位置已更新为:', locationCity);
      }
    }, 1000);
  },

  switchTab(e) {
    const page = e.currentTarget.dataset.page;
    console.log('切换到页面:', page);

    if (page === 'ootd') {
      // 当前页面，不需要跳转
      this.setData({
        currentPage: 'ootd'
      });
    } else if (page === 'wardrobe') {
      // 跳转到智衣橱页面
      wx.navigateTo({
        url: '../wardrobe/wardrobe'
      });
    } else if (page === 'profile') {
      // 跳转到个人页面
      wx.navigateTo({
        url: '../profile/profile'
      });
    }
  },

  // 选择穿搭风格
  selectStyle(e) {
    const index = e.currentTarget.dataset.index;
    const style = this.data.styles[index].name;

    this.setData({
      selectedStyle: style
    });
  },

  // 生成今日OOTD
  generateOOTD() {
    if (!this.data.selectedStyle) {
      wx.showToast({
        title: '请先选择穿搭风格',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '生成穿搭中...',
    });
    
    // 这里可以添加实际的AI生成逻辑或API调用
    // 以下为模拟数据
    
    // 根据选择的风格和天气情况，生成穿搭推荐
    const styleDescriptions = {
      '运动休闲风': '舒适动感的运动休闲风格，活力十足',
      '商务精英风': '干练专业的商务精英风格，展现职场魅力',
      '日系潮流风': '清新可爱的日系潮流风格，展现少女感',
      '韩系简约风': '简约大方的韩系风格，展现优雅质感',
      '学院风': '青春洋溢的学院风格，展现文艺气息',
      '街头嘻哈风': '个性十足的街头嘻哈风格，彰显叛逆态度',
      '户外机能风': '实用主义的户外机能风格，注重功能性',
      '复古文艺风': '怀旧优雅的复古文艺风格，展现独特气质',
      '极简主义风': '简洁利落的极简主义风格，追求纯粹美感',
      '工装风': '硬朗有力的工装风格，展现力量感'
    };
    
    const weatherCondition = this.data.weatherData.condition;
    const temperature = parseInt(this.data.weatherData.temperature.replace('°', ''));
    let weatherDesc = '';
    
    if (temperature > 30) {
      weatherDesc = '天气炎热';
    } else if (temperature > 20) {
      weatherDesc = '天气温暖';
    } else if (temperature > 10) {
      weatherDesc = '天气凉爽';
    } else {
      weatherDesc = '天气寒冷';
    }
    
    // 构建OOTD推荐数据
    const styleType = this.data.selectedStyle;
    const recommendation = {
      weather: weatherDesc + '，' + weatherCondition,
      styleType: styleType,
      description: `今天${weatherDesc}，${weatherCondition}，非常适合穿着${styleType}风格的服装。以下是根据天气和您的风格偏好推荐的搭配：`,
      items: this.getClothingItems(styleType, temperature, weatherCondition),
      images: this.getStyleImages(styleType),
      tip: this.getFashionTip(styleType, temperature)
    };
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 更新数据并显示弹窗
      this.setData({
        ootdRecommendation: recommendation,
        showOOTDPopup: true
      });
    }, 1500);
  },
  
  // 根据风格和天气获取衣物推荐
  getClothingItems(style, temperature, weatherCondition) {
    // 这里可以根据实际需求编写更复杂的逻辑
    // 以下为示例数据
    const items = [];
    
    // 上衣推荐
    let topDesc = '';
    if (temperature > 25) {
      topDesc = style === '运动休闲风' ? '宽松棉质T恤或运动背心' : 
               style === '商务精英风' ? '轻薄短袖衬衫或polo衫' :
               style === '韩系简约风' ? '宽松麻质短袖或背心' : '轻薄透气短袖';
    } else if (temperature > 15) {
      topDesc = style === '运动休闲风' ? '长袖T恤或轻薄卫衣' : 
               style === '商务精英风' ? '长袖衬衫或针织衫' :
               style === '韩系简约风' ? '针织开衫或轻薄毛衣' : '长袖衬衫或轻薄毛衣';
    } else {
      topDesc = style === '运动休闲风' ? '保暖卫衣或运动外套' : 
               style === '商务精英风' ? '毛衣或西装外套' :
               style === '韩系简约风' ? '高领毛衣或长款大衣' : '保暖厚毛衣或外套';
    }
    
    items.push({
      type: 'top',
      title: '上装',
      desc: topDesc,
      icon: '👕',
      iconBg: 'icon-top'
    });
    
    // 下装推荐
    let bottomDesc = '';
    if (temperature > 25) {
      bottomDesc = style === '运动休闲风' ? '运动短裤或轻薄休闲裤' : 
                  style === '商务精英风' ? '轻薄西裤或休闲裤' :
                  style === '韩系简约风' ? '宽松阔腿裤或短裙' : '短裤或轻便裤装';
    } else {
      bottomDesc = style === '运动休闲风' ? '运动长裤或束脚卫裤' : 
                  style === '商务精英风' ? '商务西裤或直筒休闲裤' :
                  style === '韩系简约风' ? '直筒牛仔裤或宽松阔腿裤' : '长裤或牛仔裤';
    }
    
    items.push({
      type: 'bottom',
      title: '下装',
      desc: bottomDesc,
      icon: '👖',
      iconBg: 'icon-bottom'
    });
    
    // 鞋子推荐
    let shoesDesc = '';
    if (weatherCondition.includes('雨')) {
      shoesDesc = '防水鞋或雨靴';
    } else {
      shoesDesc = style === '运动休闲风' ? '运动鞋或休闲鞋' : 
                 style === '商务精英风' ? '皮鞋或乐福鞋' :
                 style === '韩系简约风' ? '小白鞋或帆布鞋' : '舒适休闲鞋';
    }
    
    items.push({
      type: 'shoes',
      title: '鞋子',
      desc: shoesDesc,
      icon: '👟',
      iconBg: 'icon-shoes'
    });
    
    // 配饰推荐
    const accessoryDesc = style === '运动休闲风' ? '运动手表、棒球帽' : 
                         style === '商务精英风' ? '简约手表、皮带、领带' :
                         style === '韩系简约风' ? '简约首饰、小巧挎包' : '配合风格的饰品';
    
    items.push({
      type: 'accessory',
      title: '配饰',
      desc: accessoryDesc,
      icon: '💍',
      iconBg: 'icon-accessory'
    });
    
    return items;
  },
  
  // 获取风格示例图片
  getStyleImages(style) {
    // 实际项目中可以根据不同风格返回不同图片URL
    // 这里使用示例图片
    const baseImages = [
      'https://images.unsplash.com/photo-1611428813653-cf6a5a40025b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513135467390-a0a25a2be9de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ];
    
    return baseImages;
  },
  
  // 获取穿搭小贴士
  getFashionTip(style, temperature) {
    const tips = {
      '运动休闲风': '运动休闲搭配注重舒适度，可以通过配色增加活力感。',
      '商务精英风': '商务搭配要注重细节，合身的剪裁能提升整体专业感。',
      '日系潮流风': '日系风格强调层次感，可以尝试不同单品的叠穿。',
      '韩系简约风': '韩系风格讲究简约不简单，色彩搭配和面料质感很重要。',
      '学院风': '学院风强调清新感，可以通过小物件点缀增加趣味性。',
      '街头嘻哈风': '街头风格大胆前卫，可以通过配饰展现个性。',
      '户外机能风': '机能风格注重实用性，多口袋设计既实用又时尚。',
      '复古文艺风': '复古风格可以混搭现代元素，避免过于老气。',
      '极简主义风': '极简风格注重单品品质，一件好外套胜过多件平庸单品。',
      '工装风': '工装风格粗犷有型，可以通过软质面料中和硬朗感。'
    };
    
    let weatherTip = '';
    if (temperature > 30) {
      weatherTip = '天气炎热，注意选择透气面料，避免深色系吸热。';
    } else if (temperature > 20) {
      weatherTip = '天气温暖舒适，适合展示多样风格，注意早晚温差。';
    } else if (temperature > 10) {
      weatherTip = '天气转凉，可以尝试轻薄层叠穿搭，增加保暖性。';
    } else {
      weatherTip = '天气寒冷，外套选择很重要，内搭保暖不臃肿是关键。';
    }
    
    return `${tips[style]} ${weatherTip}`;
  },
  
  // 关闭OOTD弹窗
  onCloseOOTDPopup() {
    this.setData({
      showOOTDPopup: false
    });
  },
  
  // 收藏OOTD
  onFavoriteOOTD() {
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    });
    
    // 这里可以添加实际的收藏逻辑
  },
  
  // 保存OOTD到我的搭配
  onSaveOOTD() {
    wx.showToast({
      title: '已保存到我的搭配',
      icon: 'success'
    });
    
    // 这里可以添加实际的保存逻辑
  },

  // 获取天气数据
  getWeatherData(city) {
    // 真实应用中应调用天气API
    // 这里使用模拟数据
    console.log('获取天气数据, 城市:', city || this.data.weatherData.city);

    // 可以使用wx.request调用实际API
    /*
    wx.request({
      url: 'weather-api-url',
      data: {
        city: city || this.data.weatherData.city
      },
      success: (res) => {
        // 处理返回数据
        this.setData({
          weatherData: {
            city: city || this.data.weatherData.city,
            date: this.getCurrentDate(),
            temperature: res.data.temperature,
            condition: res.data.condition,
            wind: res.data.wind,
            humidity: res.data.humidity
          },
          forecastData: res.data.forecast
        });
      }
    });
    */
  },
})
