// profile.js
Page({
  data: {
    userInfo: {
      avatar: '',  // 默认为空，实际应用中可从服务器获取
      username: '时尚达人',
      description: 'AI为你的每日穿搭提供灵感',
      city: '杭州',
      gender: '男',
      bodyType: '未设置',
      personalDescription: '添加个人描述...'
    },
    settings: {
      pushNotifications: true,
      autoLocation: true,
      temperatureUnit: '摄氏度'
    },
    // 弹窗显示状态
    modals: {
      cityModal: false,
      genderModal: false,
      descriptionModal: false,
      temperatureUnitModal: false
    },
    // 临时存储编辑内容
    tempInputs: {
      city: '',
      gender: '',
      description: '',
      temperatureUnit: '摄氏度'
    }
  },

  onLoad: function(options) {
    // 页面加载时获取用户信息
    // 实际应用中应该从服务器获取数据
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  // 打开弹窗
  showModal: function(e) {
    const modalType = e.currentTarget.dataset.modal;
    const modals = {...this.data.modals};
    const tempInputs = {...this.data.tempInputs};
    
    modals[modalType] = true;
    
    // 初始化临时输入值
    if (modalType === 'cityModal') {
      tempInputs.city = this.data.userInfo.city;
    } else if (modalType === 'genderModal') {
      tempInputs.gender = this.data.userInfo.gender;
    } else if (modalType === 'descriptionModal') {
      tempInputs.description = this.data.userInfo.personalDescription;
    } else if (modalType === 'temperatureUnitModal') {
      tempInputs.temperatureUnit = this.data.settings.temperatureUnit;
    }
    
    this.setData({
      modals,
      tempInputs
    });
  },

  // 关闭弹窗
  hideModal: function(e) {
    const modalType = e.currentTarget.dataset.modal;
    const modals = {...this.data.modals};
    modals[modalType] = false;
    this.setData({ modals });
  },

  // 输入值变化处理
  inputChange: function(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const tempInputs = {...this.data.tempInputs};
    tempInputs[field] = value;
    this.setData({ tempInputs });
  },

  // 选择性别
  selectGender: function(e) {
    const gender = e.currentTarget.dataset.gender;
    const tempInputs = {...this.data.tempInputs};
    tempInputs.gender = gender;
    this.setData({ tempInputs });
  },

  // 选择温度单位
  selectTemperatureUnit: function(e) {
    const unit = e.currentTarget.dataset.unit;
    const tempInputs = {...this.data.tempInputs};
    tempInputs.temperatureUnit = unit;
    this.setData({ tempInputs });
  },

  // 保存编辑内容
  saveChanges: function(e) {
    const modalType = e.currentTarget.dataset.modal;
    const userInfo = {...this.data.userInfo};
    const settings = {...this.data.settings};
    const modals = {...this.data.modals};
    
    if (modalType === 'cityModal') {
      userInfo.city = this.data.tempInputs.city;
    } else if (modalType === 'genderModal') {
      userInfo.gender = this.data.tempInputs.gender;
    } else if (modalType === 'descriptionModal') {
      userInfo.personalDescription = this.data.tempInputs.description;
      userInfo.description = this.data.tempInputs.description;
    } else if (modalType === 'temperatureUnitModal') {
      settings.temperatureUnit = this.data.tempInputs.temperatureUnit;
    }
    
    modals[modalType] = false;
    
    this.setData({
      userInfo,
      settings,
      modals
    });
    
    // 实际应用中应该将更新后的数据同步到服务器
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000
    });
  },

  // 切换推送通知设置
  togglePushNotifications: function(e) {
    const settings = {...this.data.settings};
    settings.pushNotifications = e.detail.value;
    this.setData({ settings });
    
    // 实际应用中应该将更新后的数据同步到服务器
    wx.showToast({
      title: settings.pushNotifications ? '已开启通知' : '已关闭通知',
      icon: 'success',
      duration: 2000
    });
  },

  // 切换自动定位设置
  toggleAutoLocation: function(e) {
    const settings = {...this.data.settings};
    settings.autoLocation = e.detail.value;
    this.setData({ settings });
    
    if (settings.autoLocation) {
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          // 使用经纬度获取城市，实际应用中需要调用地理位置API
          console.log("位置获取成功", res);
          wx.showToast({
            title: '已获取位置',
            icon: 'success',
            duration: 2000
          });
        },
        fail: () => {
          // 获取位置失败处理
          wx.showToast({
            title: '获取位置失败',
            icon: 'none',
            duration: 2000
          });
          // 关闭自动定位开关
          this.setData({
            'settings.autoLocation': false
          });
        }
      });
    } else {
      wx.showToast({
        title: '已关闭自动定位',
        icon: 'success',
        duration: 2000
      });
    }
  },

  // 导航到关于我们页面
  navigateToAbout: function() {
    wx.showToast({
      title: '关于我们页面开发中',
      icon: 'none',
      duration: 2000
    });
  },

  // 导航到用户协议页面
  navigateToTerms: function() {
    wx.showToast({
      title: '用户协议页面开发中',
      icon: 'none',
      duration: 2000
    });
  },

  // 导航到隐私政策页面
  navigateToPrivacy: function() {
    wx.showToast({
      title: '隐私政策页面开发中',
      icon: 'none',
      duration: 2000
    });
  },

  // 导航到其他页面
  navigateTo: function(e) {
    const page = e.currentTarget.dataset.page;
    wx.switchTab({
      url: `/pages/${page}/${page}`
    });
  },

  // 退出登录
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          // 实际应用中应该清除本地登录状态并跳转到登录页
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 2000
          });
        }
      }
    });
  }
}); 