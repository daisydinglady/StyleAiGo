// profile.js
Page({
  data: {
    userInfo: {
      avatar: "", // 默认为空，实际应用中可从服务器获取
      username: "时尚达人",
      description: "AI为你的每日穿搭提供灵感",
      city: "杭州",
      gender: "男",
      bodyType: "未设置",
      personalDescription: "添加个人描述...",
    },
    settings: {
      pushNotifications: true,
      // autoLocation: true,
      temperatureUnit: "摄氏度",
    },
    // 弹窗显示状态
    modals: {
      cityModal: false,
      genderModal: false,
      descriptionModal: false,
      temperatureUnitModal: false,
    },
    // 临时存储编辑内容
    tempInputs: {
      city: "",
      gender: "",
      description: "",
      temperatureUnit: "摄氏度",
    },
  },

  onLoad: function (options) {
    console.log("profile页面加载");
    // 强制从本地存储获取最新用户信息
    this.forceUpdateUserInfo();
  },

  onShow: function () {
    console.log("profile页面显示");
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
      });
    }

    // 每次显示页面时强制从本地存储获取最新数据
    this.forceUpdateUserInfo();
  },

  // 从本地存储获取用户信息
  forceUpdateUserInfo: function () {
    console.log("强制更新用户信息");

    // 直接从本地存储读取数据
    try {
      const city = wx.getStorageSync("userCity");
      const gender = wx.getStorageSync("userGender");
      const description = wx.getStorageSync("userPersonalDescription");

      console.log("读取到的本地数据:", { city, gender, description });

      // 构建新的用户信息对象
      const userInfo = {
        avatar: "", // 默认为空
        username: "时尚达人",
        description: description || "AI为你的每日穿搭提供灵感",
        city: city || "未设置",
        gender: gender || "未设置",
        bodyType: "未设置",
        personalDescription: description || "添加个人描述...",
      };

      // 强制更新数据
      this.setData({
        userInfo: userInfo,
      });

      console.log("用户信息已更新为:", userInfo);
    } catch (e) {
      console.error("强制更新用户信息失败", e);
    }
  },

  // 打开弹窗
  showModal: function (e) {
    const modalType = e.currentTarget.dataset.modal;
    const modals = { ...this.data.modals };
    const tempInputs = { ...this.data.tempInputs };

    modals[modalType] = true;

    // 初始化临时输入值
    if (modalType === "cityModal") {
      tempInputs.city = this.data.userInfo.city;
    } else if (modalType === "genderModal") {
      tempInputs.gender = this.data.userInfo.gender;
    } else if (modalType === "descriptionModal") {
      tempInputs.description = this.data.userInfo.personalDescription;
    } else if (modalType === "temperatureUnitModal") {
      tempInputs.temperatureUnit = this.data.settings.temperatureUnit;
    }

    this.setData({
      modals,
      tempInputs,
    });
  },

  // 关闭弹窗
  hideModal: function (e) {
    const modalType = e.currentTarget.dataset.modal;
    const modals = { ...this.data.modals };
    modals[modalType] = false;
    this.setData({ modals });
  },

  // 输入值变化处理
  inputChange: function (e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const tempInputs = { ...this.data.tempInputs };
    tempInputs[field] = value;
    this.setData({ tempInputs });
  },

  // 选择性别
  selectGender: function (e) {
    const gender = e.currentTarget.dataset.gender;
    const tempInputs = { ...this.data.tempInputs };
    tempInputs.gender = gender;
    this.setData({ tempInputs });
  },

  // 选择温度单位
  selectTemperatureUnit: function (e) {
    const unit = e.currentTarget.dataset.unit;
    const tempInputs = { ...this.data.tempInputs };
    tempInputs.temperatureUnit = unit;
    this.setData({ tempInputs });
  },

  // 保存编辑内容
  saveChanges: function (e) {
    const modalType = e.currentTarget.dataset.modal;
    const userInfo = { ...this.data.userInfo };
    const settings = { ...this.data.settings };
    const modals = { ...this.data.modals };

    if (modalType === "cityModal") {
      // 检查城市是否有变化
      const oldCity = userInfo.city;
      userInfo.city = this.data.tempInputs.city;

      // 保存到本地存储
      this.saveToStorage("userCity", userInfo.city);
      console.log("保存城市:", userInfo.city);

      // 如果城市发生变化，发布一个全局事件
      if (oldCity !== userInfo.city) {
        // 更新首页的天气城市
        try {
          const pages = getCurrentPages();
          for (let i = 0; i < pages.length; i++) {
            if (pages[i].route === "pages/index/index") {
              // 找到首页，更新其天气城市
              pages[i].setData({
                "weatherData.city": userInfo.city,
              });
              console.log("已更新首页的天气城市为:", userInfo.city);
              break;
            }
          }
        } catch (e) {
          console.error("更新首页天气城市失败:", e);
        }
      }
    } else if (modalType === "genderModal") {
      userInfo.gender = this.data.tempInputs.gender;
      // 保存到本地存储
      this.saveToStorage("userGender", userInfo.gender);
      console.log("保存性别:", userInfo.gender);
    } else if (modalType === "descriptionModal") {
      userInfo.personalDescription = this.data.tempInputs.description;
      userInfo.description = this.data.tempInputs.description;
      // 保存到本地存储
      this.saveToStorage(
        "userPersonalDescription",
        userInfo.personalDescription
      );
      console.log("保存个人描述:", userInfo.personalDescription);
    } else if (modalType === "temperatureUnitModal") {
      settings.temperatureUnit = this.data.tempInputs.temperatureUnit;
      // 保存到本地存储
      this.saveToStorage("temperatureUnit", settings.temperatureUnit);
    }

    modals[modalType] = false;

    this.setData({
      userInfo,
      settings,
      modals,
    });

    // 更新全局数据
    try {
      const app = getApp();
      if (app.globalData && app.globalData.userInfo) {
        if (modalType === "cityModal") {
          app.globalData.userInfo.city = userInfo.city;
        } else if (modalType === "genderModal") {
          app.globalData.userInfo.gender = userInfo.gender;
        } else if (modalType === "descriptionModal") {
          app.globalData.userInfo.description = userInfo.description;
          app.globalData.userInfo.personalDescription =
            userInfo.personalDescription;
        }
        console.log("已更新全局数据:", app.globalData.userInfo);
      }
    } catch (e) {
      console.error("更新全局数据失败:", e);
    }

    wx.showToast({
      title: "保存成功",
      icon: "success",
      duration: 2000,
    });
  },

  // 切换推送通知设置
  togglePushNotifications: function (e) {
    const settings = { ...this.data.settings };
    settings.pushNotifications = e.detail.value;
    this.setData({ settings });

    // 保存到本地存储
    this.saveToStorage(
      "pushNotifications",
      settings.pushNotifications.toString()
    );

    wx.showToast({
      title: settings.pushNotifications ? "已开启通知" : "已关闭通知",
      icon: "success",
      duration: 2000,
    });
  },

  // 切换自动定位设置
  toggleAutoLocation: function (e) {
    //   const settings = { ...this.data.settings };
    //   settings.autoLocation = e.detail.value;
    //   if (settings.autoLocation) {
    //     // 先检查位置权限
    //     wx.getSetting({
    //       success: (res) => {
    //         if (!res.authSetting["scope.userLocation"]) {
    //           // 如果没有授权，先请求授权
    //           wx.authorize({
    //             scope: "scope.userLocation",
    //             success: () => {
    //               // 授权成功，保存设置并获取位置
    //               this.setData({ settings });
    //               this.saveToStorage("autoLocation", "true");
    //               this.getAndUpdateLocation();
    //             },
    //             fail: () => {
    //               // 授权失败，回退开关状态
    //               settings.autoLocation = false;
    //               this.setData({ settings });
    //               this.saveToStorage("autoLocation", "false");
    //               // 提示用户需要开启权限
    //               wx.showModal({
    //                 title: "提示",
    //                 content: "需要获取您的位置信息，请在设置中打开位置权限",
    //                 confirmText: "去设置",
    //                 cancelText: "取消",
    //                 success: (res) => {
    //                   if (res.confirm) {
    //                     wx.openSetting();
    //                   }
    //                 },
    //               });
    //             },
    //           });
    //         } else {
    //           // 已有权限，保存设置并获取位置
    //           this.setData({ settings });
    //           this.saveToStorage("autoLocation", "true");
    //           this.getAndUpdateLocation();
    //         }
    //       },
    //       fail: () => {
    //         // 获取设置信息失败，回退开关状态
    //         settings.autoLocation = false;
    //         this.setData({ settings });
    //         this.saveToStorage("autoLocation", "false");
    //         wx.showToast({
    //           title: "获取位置权限失败",
    //           icon: "none",
    //           duration: 2000,
    //         });
    //       },
    //     });
    //   } else {
    //     // 用户主动关闭自动定位，直接更新设置
    //     this.setData({ settings });
    //     this.saveToStorage("autoLocation", "false");
    //     // 使用用户设置的城市
    //     try {
    //       const userCity =
    //         wx.getStorageSync("userCity") || this.data.userInfo.city;
    //       // 更新首页的天气城市
    //       const pages = getCurrentPages();
    //       for (let i = 0; i < pages.length; i++) {
    //         if (pages[i].route === "pages/index/index") {
    //           // 找到首页，更新其天气城市
    //           pages[i].setData({
    //             "weatherData.city": userCity,
    //           });
    //           console.log(
    //             "自动定位已关闭，更新首页的天气城市为用户设置:",
    //             userCity
    //           );
    //           break;
    //         }
    //       }
    //     } catch (e) {
    //       console.error("更新首页天气城市失败:", e);
    //     }
    //     wx.showToast({
    //       title: "已关闭自动定位",
    //       icon: "success",
    //       duration: 2000,
    //     });
    //   }
  },

  // 新增获取位置并更新的函数
  // getAndUpdateLocation: function () {
  //   console.log("尝试获取位置...");

  //   // 先检查定位权限状态并打印
  //   wx.getSetting({
  //     success: (settingRes) => {
  //       console.log("权限设置状态:", settingRes.authSetting);
  //       console.log(
  //         "位置权限状态:",
  //         settingRes.authSetting["scope.userLocation"]
  //       );
  //     },
  //   });

  //   // 简化定位请求，使用基本参数增加成功率
  //   wx.getLocation({
  //     type: "wgs84", // 使用更稳定的坐标系
  //     success: (res) => {
  //       // 使用经纬度获取城市，实际应用中需要调用地理位置API
  //       console.log("位置获取成功", res);

  //       // 使用实际的反向地理编码获取城市名
  //       this.getLocationCity(res.latitude, res.longitude);
  //     },
  //     fail: (err) => {
  //       console.error("获取位置失败:", err);
  //       // 打印更详细的错误信息
  //       if (err.errMsg) {
  //         console.error("错误信息:", err.errMsg);
  //       }
  //       if (err.errCode) {
  //         console.error("错误代码:", err.errCode);

  //         // 根据错误代码给出更具体的提示
  //         let errorMessage =
  //           "请确保微信有位置权限，并在小程序设置中允许使用位置信息";
  //         if (err.errCode === 2) {
  //           errorMessage =
  //             "位置权限已开启，但未能获取到位置信息。可能是GPS信号弱或被屏蔽";
  //         } else if (err.errCode === 11) {
  //           errorMessage = "系统拒绝定位请求，请确保系统位置服务已开启";
  //         } else if (err.errCode === 12) {
  //           errorMessage = "定位超时，请检查网络连接并重试";
  //         } else if (err.errCode === 13) {
  //           errorMessage = "定位失败，请在开阔地区重试或手动设置城市";
  //         }
  //       }

  //       // 获取位置失败处理
  //       wx.showToast({
  //         title: "获取位置失败",
  //         icon: "none",
  //         duration: 2000,
  //       });

  //       // 关闭自动定位开关
  //       this.setData({
  //         "settings.autoLocation": false,
  //       });

  //       // 更新本地存储
  //       this.saveToStorage("autoLocation", "false");

  //       // 提示用户如何开启权限 - 使用备用方案
  //       setTimeout(() => {
  //         wx.showModal({
  //           title: "位置获取失败",
  //           content:
  //             "虽然权限已开启，但获取位置信息失败。可能原因：\n1. GPS信号弱\n2. 系统定位服务未开启\n3. 网络问题\n\n建议：\n- 确保手机定位服务开启\n- 尝试在开阔区域重试\n- 或手动设置您的城市",
  //           confirmText: "手动设置",
  //           cancelText: "稍后再试",
  //           success: (res) => {
  //             if (res.confirm) {
  //               // 打开修改城市的弹窗
  //               this.showModal({
  //                 currentTarget: { dataset: { modal: "cityModal" } },
  //               });
  //             }
  //           },
  //         });
  //       }, 1500);
  //     },
  //     complete: () => {
  //       console.log("位置获取操作完成");
  //     },
  //   });
  // },

  // 新增：根据经纬度获取城市名
  // getLocationCity: function (latitude, longitude) {
  //   console.log("开始根据经纬度获取城市名...");

  //   // 直接使用微信的网络请求能力调用腾讯地图WebService API获取城市
  //   wx.request({
  //     url: "https://apis.map.qq.com/ws/geocoder/v1/",
  //     data: {
  //       location: `${latitude},${longitude}`,
  //       key: "YGGBZ-GNYLT-3YVXG-L2O7F-YL7NQ-2LF7S", // 使用腾讯位置服务的key
  //       get_poi: 0,
  //     },
  //     success: (res) => {
  //       console.log("地理位置解析结果:", res);
  //       let locationCity = "";

  //       if (
  //         res.statusCode === 200 &&
  //         res.data &&
  //         res.data.result &&
  //         res.data.result.address_component
  //       ) {
  //         // 从返回的数据中获取城市名
  //         locationCity = res.data.result.address_component.city || "";
  //         console.log("获取到的城市名:", locationCity);

  //         if (locationCity) {
  //           // 更新用户信息中的城市
  //           const userInfo = { ...this.data.userInfo };
  //           userInfo.city = locationCity;
  //           this.setData({ userInfo });

  //           // 保存到本地存储
  //           this.saveToStorage("userCity", locationCity);

  //           // 更新首页的天气城市
  //           try {
  //             const pages = getCurrentPages();
  //             for (let i = 0; i < pages.length; i++) {
  //               if (pages[i].route === "pages/index/index") {
  //                 // 找到首页，更新其天气城市
  //                 pages[i].setData({
  //                   "weatherData.city": locationCity,
  //                 });
  //                 console.log(
  //                   "自动定位已开启，更新首页的天气城市为:",
  //                   locationCity
  //                 );
  //                 break;
  //               }
  //             }
  //           } catch (e) {
  //             console.error("更新首页天气城市失败:", e);
  //           }

  //           wx.showToast({
  //             title: "已获取位置",
  //             icon: "success",
  //             duration: 2000,
  //           });
  //         } else {
  //           this.handleLocationFailure();
  //         }
  //       } else {
  //         console.error("地理位置解析返回异常:", res);
  //         this.handleLocationFailure();
  //       }
  //     },
  //     fail: (err) => {
  //       console.error("地理位置解析请求失败:", err);
  //       this.handleLocationFailure();
  //     },
  //   });
  // },

  // 处理位置获取失败的情况
  // handleLocationFailure: function () {
  //   wx.showModal({
  //     title: "无法获取位置",
  //     content: "无法自动获取您的位置，请手动设置城市。",
  //     confirmText: "去设置",
  //     cancelText: "稍后再试",
  //     success: (res) => {
  //       if (res.confirm) {
  //         // 打开修改城市的弹窗
  //         this.showModal({
  //           currentTarget: { dataset: { modal: "cityModal" } },
  //         });
  //       }

  //       // 关闭自动定位开关
  //       this.setData({
  //         "settings.autoLocation": false,
  //       });

  //       // 更新本地存储
  //       this.saveToStorage("autoLocation", "false");
  //     },
  //   });
  // },

  // 保存到本地存储
  saveToStorage: function (key, value) {
    try {
      wx.setStorageSync(key, value);
      console.log(`保存数据成功: ${key} = ${value}`);

      // 立即验证数据是否已正确保存
      const savedValue = wx.getStorageSync(key);
      console.log(`验证保存的数据: ${key} = ${savedValue}`);

      if (savedValue !== value) {
        console.error(`数据保存不一致: 期望 ${value}, 实际 ${savedValue}`);
        // 再次尝试保存
        wx.setStorageSync(key, value);
      }
    } catch (e) {
      console.error(`保存数据失败: ${key}`, e);
    }
  },

  // 导航到关于我们页面
  navigateToAbout: function () {
    wx.showToast({
      title: "关于我们页面开发中",
      icon: "none",
      duration: 2000,
    });
  },

  // 导航到用户协议页面
  navigateToTerms: function () {
    wx.showToast({
      title: "用户协议页面开发中",
      icon: "none",
      duration: 2000,
    });
  },

  // 导航到隐私政策页面
  navigateToPrivacy: function () {
    wx.showToast({
      title: "隐私政策页面开发中",
      icon: "none",
      duration: 2000,
    });
  },

  // 导航到其他页面
  // navigateTo: function (e) {
  //   const page = e.currentTarget.dataset.page;
  //   wx.switchTab({
  //     url: `/pages/${page}/${page}`,
  //   });
  // },

  // 退出登录
  logout: function () {
    wx.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储中的用户信息
          try {
            wx.removeStorageSync("userCity");
            wx.removeStorageSync("userGender");
            wx.removeStorageSync("userPersonalDescription");
            wx.removeStorageSync("onboardingCompleted");

            console.log("已清除本地存储数据");
          } catch (e) {
            console.error("清除本地存储失败", e);
          }

          wx.showToast({
            title: "已退出登录",
            icon: "success",
            duration: 2000,
          });

          // 跳转到引导页
          setTimeout(() => {
            wx.redirectTo({
              url: "/pages/onboarding/onboarding",
              success: (res) => {
                console.log("跳转到引导页成功", res);
              },
              fail: (err) => {
                console.error("跳转到引导页失败", err);
                // 备用跳转方式
                wx.redirectTo({
                  url: "../onboarding/onboarding",
                });
              },
            });
          }, 2000);
        }
      },
    });
  },
});
