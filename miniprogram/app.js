// app.js
App({
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    onboardingCompleted: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  onLaunch() {
    console.log('应用启动');
    
    // 检查是否完成引导
    this.checkOnboardingStatus();
    
    // 获取用户信息
    this.initUserInfo();
    
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录成功', res);
      }
    })
  },
  
  // 检查是否已完成引导
  checkOnboardingStatus() {
    try {
      // 首先从本地存储中读取状态标记
      const onboardingCompleted = wx.getStorageSync('onboardingCompleted');
      
      // 直接检查userData对象，确保和onboarding.js保存的格式一致
      const userData = wx.getStorageSync('userData');
      
      // 读取独立的数据项作为备份检查
      const userCity = wx.getStorageSync('userCity');
      const userGender = wx.getStorageSync('userGender');
      const userPersonalDescription = wx.getStorageSync('userPersonalDescription');
      
      console.log('全局引导状态检查:', {
        onboardingCompleted,
        userData,
        userCity,
        userGender,
        userPersonalDescription
      });
      
      // 检查引导完成状态标记
      if (onboardingCompleted === 'true') {
        this.globalData.onboardingCompleted = true;
        console.log('已明确标记为完成引导');
        return;
      }
      
      // 检查userData对象
      if (userData && userData.onboardingCompleted === true) {
        this.globalData.onboardingCompleted = true;
        // 同步设置标准标记，确保其他检查也能通过
        wx.setStorageSync('onboardingCompleted', 'true');
        console.log('通过userData检测到已完成引导');
        return;
      }
      
      // 检查单独的用户数据项
      if (userCity || userGender || userPersonalDescription) {
        this.globalData.onboardingCompleted = true;
        // 设置完成标记，确保一致性
        wx.setStorageSync('onboardingCompleted', 'true');
        console.log('根据用户数据判定已完成引导，并设置完成标记');
        return;
      }
      
      // 如果以上所有检查都未通过，则设置为未完成引导
      this.globalData.onboardingCompleted = false;
      console.log('未检测到任何引导完成标记或用户数据，设置为未完成引导');
      
      console.log('最终全局引导状态:', this.globalData.onboardingCompleted);
    } catch (e) {
      console.error('检查引导状态失败:', e);
      // 出错时默认为未完成引导
      this.globalData.onboardingCompleted = false;
    }
  },
  
  // 初始化用户信息
  initUserInfo() {
    try {
      // 检查设备信息
      const systemInfo = wx.getSystemInfoSync()
      this.globalData.canIUseGetUserProfile = systemInfo.SDKVersion >= '2.10.3'
      
      // 初始化用户信息
      const city = wx.getStorageSync('userCity') || '未设置';
      const gender = wx.getStorageSync('userGender') || '未设置';
      const description = wx.getStorageSync('userPersonalDescription') || 'AI为你的每日穿搭提供灵感';
      
      const userInfo = {
        city: city,
        gender: gender,
        description: description,
        personalDescription: description
      };
      
      console.log('初始化全局用户信息:', userInfo);
      this.globalData.userInfo = userInfo;
      this.globalData.hasUserInfo = true;
    } catch (e) {
      console.error('初始化用户信息失败:', e);
    }
  }
})
