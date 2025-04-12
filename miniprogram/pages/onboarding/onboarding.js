// onboarding.js
Page({
  data: {
    currentPage: 1,
    selectedGender: null,
    userInfo: {
      city: '',
      gender: '',
      personalDescription: ''
    }
  },

  onLoad: function() {
    // 页面加载时初始化数据
    // 清除之前可能存在的引导完成标记，确保完成所有步骤
    try {
      wx.removeStorageSync('onboardingCompleted');
    } catch (e) {
      console.error('清除引导标记失败', e);
    }
    
    console.log('引导页面加载完成');
  },

  // 页面切换
  goToPage: function(e) {
    const pageNum = parseInt(e.currentTarget.dataset.page);
    this.setData({
      currentPage: pageNum
    });
    
    // 如果是从城市页面跳转，记录城市信息
    if (this.data.currentPage === 2 && pageNum === 3 && this.data.userInfo.city) {
      this.saveToStorage('userCity', this.data.userInfo.city);
      console.log('保存城市信息:', this.data.userInfo.city);
    }
    
    // 如果是从性别页面跳转，记录性别信息
    if (this.data.currentPage === 3 && pageNum === 4 && this.data.selectedGender) {
      const genderText = this.data.selectedGender === 'male' ? '男' : '女';
      this.setData({
        'userInfo.gender': genderText
      });
      this.saveToStorage('userGender', genderText);
      console.log('保存性别信息:', genderText);
    }
  },

  // 性别选择
  selectGender: function(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      selectedGender: gender
    });
    console.log('选择性别:', gender);
  },

  // 城市输入
  onCityInput: function(e) {
    this.setData({
      'userInfo.city': e.detail.value
    });
  },

  // 个人描述输入
  onDescriptionInput: function(e) {
    this.setData({
      'userInfo.personalDescription': e.detail.value
    });
  },

  // 获取位置
  getLocation: function() {
    wx.showLoading({
      title: '获取位置中...',
    });
    
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        // 使用经纬度获取城市
        this.getCityFromLocation(res.latitude, res.longitude);
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '获取位置失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 根据经纬度获取城市名
  getCityFromLocation: function(latitude, longitude) {
    // 微信小程序中可以使用微信地图API获取城市名
    // 这里简化处理，使用一个固定的城市名作为示例
    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        'userInfo.city': '杭州'
      });
      wx.showToast({
        title: '位置获取成功',
        icon: 'success',
        duration: 2000
      });
    }, 1000);
  },

  // 保存到本地存储
  saveToStorage: function(key, value) {
    try {
      // 尝试3次保存，确保数据被正确保存
      for (let i = 0; i < 3; i++) {
        wx.setStorageSync(key, value);
        
        // 验证数据
        const savedValue = wx.getStorageSync(key);
        if (savedValue === value) {
          console.log(`成功保存数据(第${i+1}次尝试): ${key} = ${value}`);
          return; // 保存成功，退出循环
        } else {
          console.error(`第${i+1}次保存不一致: 期望 ${value}, 实际 ${savedValue}`);
          // 继续尝试
        }
      }
      console.error(`保存数据失败: ${key}, 尝试3次后仍未成功`);
    } catch (e) {
      console.error(`保存数据失败: ${key}`, e);
      
      // 使用替代方法尝试保存
      try {
        wx.setStorage({
          key: key,
          data: value,
          success: () => {
            console.log(`使用异步方法成功保存数据: ${key} = ${value}`);
          },
          fail: (err) => {
            console.error(`使用异步方法保存数据失败: ${key}`, err);
          }
        });
      } catch (e2) {
        console.error(`所有保存方法均失败: ${key}`, e2);
      }
    }
  },
  
  // 完成引导
  finishOnboarding: function() {
    console.log('开始完成引导流程...');
    
    // 保存个人描述
    if (this.data.userInfo.personalDescription) {
      this.saveToStorage('userPersonalDescription', this.data.userInfo.personalDescription);
      console.log('保存个人描述:', this.data.userInfo.personalDescription);
    }
    
    // 检查并确保数据已保存
    try {
      // 检查是否有城市数据
      if (this.data.userInfo.city) {
        this.saveToStorage('userCity', this.data.userInfo.city);
        console.log('保存城市信息:', this.data.userInfo.city);
      }
      
      // 检查是否有性别数据
      if (this.data.selectedGender) {
        const genderText = this.data.selectedGender === 'male' ? '男' : '女';
        this.saveToStorage('userGender', genderText);
        console.log('保存性别信息:', genderText);
      }

      // 设置完成引导标识，必须在跳转前设置，避免循环跳转
      this.saveToStorage('onboardingCompleted', 'true');
      
      // 设置全局引导状态
      const app = getApp();
      app.globalData.onboardingCompleted = true;
      
      // 创建一个全局用户信息对象，确保各个页面能访问到相同的数据
      const userInfo = {
        city: this.data.userInfo.city || wx.getStorageSync('userCity') || '未设置',
        gender: (this.data.selectedGender === 'male' ? '男' : (this.data.selectedGender === 'female' ? '女' : '未设置')),
        description: this.data.userInfo.personalDescription || wx.getStorageSync('userPersonalDescription') || 'AI为你的每日穿搭提供灵感',
        personalDescription: this.data.userInfo.personalDescription || wx.getStorageSync('userPersonalDescription') || '添加个人描述...'
      };
      
      app.globalData.userInfo = userInfo;
      
      console.log('引导完成，全局用户信息设置为:', app.globalData.userInfo);
      console.log('所有数据已保存到本地存储:', {
        city: wx.getStorageSync('userCity'),
        gender: wx.getStorageSync('userGender'),
        description: wx.getStorageSync('userPersonalDescription'),
        completed: wx.getStorageSync('onboardingCompleted')
      });
    } catch(e) {
      console.error('保存最终数据失败:', e);
    }
    
    console.log('引导完成，准备跳转到首页');
    
    // 延迟一下确保存储完成
    setTimeout(() => {
      // 使用reLaunch而不是switchTab，避免导航栈问题
      wx.reLaunch({
        url: '/pages/index/index',
        success: (res) => {
          console.log('跳转成功', res);
        },
        fail: (err) => {
          console.error('跳转失败', err);
          // 再次尝试
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    }, 500); // 增加延时确保数据完全保存
  }
}); 