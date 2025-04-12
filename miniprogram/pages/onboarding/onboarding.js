// onboarding.js
Page({
  data: {
    city: '',
    gender: '',
    description: '',
    showLocationIcon: true
  },

  onLoad: function() {
    // 检查本地是否已有用户数据
    const userData = wx.getStorageSync('userData');
    if (userData) {
      this.setData({
        city: userData.city || '',
        gender: userData.gender || '',
        description: userData.description || ''
      });
    }
  },

  // 输入城市
  inputCity: function(e) {
    this.setData({
      city: e.detail.value
    });
  },

  // 选择性别
  selectGender: function(e) {
    this.setData({
      gender: e.currentTarget.dataset.gender
    });
  },

  // 输入个人描述
  inputDescription: function(e) {
    this.setData({
      description: e.detail.value
    });
  },

  // 获取位置
  getLocation: function() {
    const that = this;
    wx.showLoading({
      title: '获取位置中...',
    });
    
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // 使用腾讯地图API根据经纬度获取城市信息
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            location: res.latitude + ',' + res.longitude,
            key: 'YOUR_KEY_HERE', // 需要替换为实际的腾讯地图API密钥
            get_poi: 0
          },
          success: function(res) {
            if (res.data.status === 0) {
              that.setData({
                city: res.data.result.address_component.city
              });
            } else {
              wx.showToast({
                title: '获取城市失败',
                icon: 'none'
              });
            }
          },
          fail: function() {
            wx.showToast({
              title: '获取城市失败',
              icon: 'none'
            });
          },
          complete: function() {
            wx.hideLoading();
          }
        });
      },
      fail: function() {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '获取位置失败，请检查位置权限或手动输入城市',
          showCancel: false
        });
      }
    });
  },

  // 完成设置
  finishOnboarding: function() {
    // 验证输入
    if (!this.data.city.trim()) {
      wx.showToast({
        title: '请输入城市',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.gender) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      });
      return;
    }
    
    // 把性别从英文转为中文保存
    const genderText = this.data.gender === 'male' ? '男' : '女';
    
    try {
      // 保存单独的数据项以兼容现有检查逻辑
      wx.setStorageSync('userCity', this.data.city);
      wx.setStorageSync('userGender', genderText);
      if (this.data.description) {
        wx.setStorageSync('userPersonalDescription', this.data.description);
      }
      
      // 特别是这一项，确保与app.js中的检查逻辑一致
      wx.setStorageSync('onboardingCompleted', 'true');
      
      // 也保存到userData中作为备份
      const userData = {
        city: this.data.city,
        gender: genderText,
        description: this.data.description,
        onboardingCompleted: true
      };
      wx.setStorageSync('userData', userData);
      
      // 设置全局数据
      const app = getApp();
      if (app.globalData) {
        app.globalData.onboardingCompleted = true;
        app.globalData.userInfo = {
          city: this.data.city,
          gender: genderText,
          description: this.data.description || 'AI为你的每日穿搭提供灵感',
          personalDescription: this.data.description || '添加个人描述...'
        };
      }
      
      console.log('引导完成，保存的数据:', {
        city: wx.getStorageSync('userCity'),
        gender: wx.getStorageSync('userGender'),
        description: wx.getStorageSync('userPersonalDescription'),
        completed: wx.getStorageSync('onboardingCompleted')
      });
      
      // 提示用户设置成功
      wx.showToast({
        title: '设置成功',
        icon: 'success',
        duration: 1500
      });
      
      // 延迟跳转，确保存储完成
      setTimeout(() => {
        // 使用reLaunch避免导航栈问题
        wx.reLaunch({
          url: '/pages/index/index',
          success: function(res) {
            console.log('跳转首页成功');
          },
          fail: function(err) {
            console.error('跳转失败:', err);
            // 再次尝试使用switchTab
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        });
      }, 1800);
    } catch (e) {
      console.error('保存数据失败:', e);
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
    }
  },

  // 跳过设置
  skipOnboarding: function() {
    wx.showModal({
      title: '确认跳过',
      content: '您可以在个人资料页面随时完善您的信息',
      cancelText: '返回',
      confirmText: '确认跳过',
      success: (res) => {
        if (res.confirm) {
          try {
            // 标记引导已完成
            wx.setStorageSync('onboardingCompleted', 'true');
            
            // 更新全局状态
            const app = getApp();
            if (app.globalData) {
              app.globalData.onboardingCompleted = true;
            }
            
            console.log('已跳过引导，设置完成标记');
            
            // 延迟跳转，确保存储完成
            setTimeout(() => {
              // 使用reLaunch避免导航栈问题
              wx.reLaunch({
                url: '/pages/index/index',
                success: function(res) {
                  console.log('跳转首页成功');
                },
                fail: function(err) {
                  console.error('跳转失败:', err);
                  // 再次尝试使用switchTab
                  wx.switchTab({
                    url: '/pages/index/index'
                  });
                }
              });
            }, 300);
          } catch (e) {
            console.error('设置跳过状态失败:', e);
            wx.showToast({
              title: '操作失败，请重试',
              icon: 'none'
            });
          }
        }
      }
    });
  }
}); 