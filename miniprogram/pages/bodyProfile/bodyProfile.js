// bodyProfile.js
Page({
  data: {
    userInfo: {
      gender: "男", // 默认值，实际会从profile页面获取
    },
    // 基本信息
    birthday: "",
    height: "",
    weight: "",
    bust: "",
    waist: "",
    hips: "",
    // 体型相关
    bodyType: "",
    bodyProportion: "",
    collarbone: "",
    chest: "",
    waistType: "",
    hipsWidth: "",
    buttocksType: "",
    legType: "",
    thighs: "",
    calves: "",
  },

  onLoad: function () {
    // 从本地存储获取已保存的身材信息
    this.loadBodyInfo();
    // 获取用户性别
    this.getUserGender();
  },

  // 获取用户性别
  getUserGender: function () {
    try {
      const gender = wx.getStorageSync("userGender");
      if (gender) {
        this.setData({
          "userInfo.gender": gender,
        });
      }
    } catch (e) {
      console.error("获取用户性别失败", e);
    }
  },

  // 从本地存储加载身材信息
  loadBodyInfo: function () {
    try {
      const bodyInfo = wx.getStorageSync("bodyInfo");
      if (bodyInfo) {
        this.setData(bodyInfo);
      }
    } catch (e) {
      console.error("加载身材信息失败", e);
    }
  },

  // 处理生日选择
  onBirthdayChange: function (e) {
    this.setData({
      birthday: e.detail.value,
    });
  },

  // 处理身高输入
  onHeightChange: function (e) {
    this.setData({
      height: e.detail.value,
    });
  },

  // 处理体重输入
  onWeightChange: function (e) {
    this.setData({
      weight: e.detail.value,
    });
  },

  // 处理胸围输入
  onBustChange: function (e) {
    this.setData({
      bust: e.detail.value,
    });
  },

  // 处理腰围输入
  onWaistChange: function (e) {
    this.setData({
      waist: e.detail.value,
    });
  },

  // 处理臀围输入
  onHipsChange: function (e) {
    this.setData({
      hips: e.detail.value,
    });
  },

  // 选择体型
  selectBodyType: function (e) {
    this.setData({
      bodyType: e.currentTarget.dataset.type,
    });
  },

  // 选择上下身比例
  selectBodyProportion: function (e) {
    this.setData({
      bodyProportion: e.currentTarget.dataset.proportion,
    });
  },

  // 选择锁骨
  selectCollarbone: function (e) {
    this.setData({
      collarbone: e.currentTarget.dataset.type,
    });
  },

  // 选择胸部
  selectChest: function (e) {
    this.setData({
      chest: e.currentTarget.dataset.type,
    });
  },

  // 选择腰腹部
  selectWaistType: function (e) {
    this.setData({
      waistType: e.currentTarget.dataset.type,
    });
  },

  // 选择胯部
  selectHipsWidth: function (e) {
    this.setData({
      hipsWidth: e.currentTarget.dataset.type,
    });
  },

  // 选择臀型
  selectButtocksType: function (e) {
    this.setData({
      buttocksType: e.currentTarget.dataset.type,
    });
  },

  // 选择腿型
  selectLegType: function (e) {
    this.setData({
      legType: e.currentTarget.dataset.type,
    });
  },

  // 选择大腿
  selectThighs: function (e) {
    this.setData({
      thighs: e.currentTarget.dataset.type,
    });
  },

  // 选择小腿
  selectCalves: function (e) {
    this.setData({
      calves: e.currentTarget.dataset.type,
    });
  },

  // 保存身材信息
  saveProfile: function () {
    try {
      // 构建要保存的数据对象
      const bodyInfo = {
        birthday: this.data.birthday,
        height: this.data.height,
        weight: this.data.weight,
        bust: this.data.bust,
        waist: this.data.waist,
        hips: this.data.hips,
        bodyType: this.data.bodyType,
        bodyProportion: this.data.bodyProportion,
        collarbone: this.data.collarbone,
        chest: this.data.chest,
        waistType: this.data.waistType,
        hipsWidth: this.data.hipsWidth,
        buttocksType: this.data.buttocksType,
        legType: this.data.legType,
        thighs: this.data.thighs,
        calves: this.data.calves,
      };

      wx.setStorageSync("bodyInfo", bodyInfo);

      // 更新个人资料页面的体型显示
      const pages = getCurrentPages();
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].route === "pages/profile/profile") {
          pages[i].setData({
            "userInfo.bodyType": this.data.bodyType || "未设置",
          });
          break;
        }
      }

      wx.showToast({
        title: "保存成功",
        icon: "success",
        duration: 2000,
      });

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    } catch (e) {
      console.error("保存身材信息失败", e);
      wx.showToast({
        title: "保存失败",
        icon: "error",
        duration: 2000,
      });
    }
  },
});
