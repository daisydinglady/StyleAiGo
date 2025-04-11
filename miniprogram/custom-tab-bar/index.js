Component({
  data: {
    selected: 0,
    color: "#999",
    selectedColor: "#3B82F6",
    list: [
      {
      pagePath: "/pages/index/index",
      iconPath: "/images/icons/weather-icon.png",
      selectedIconPath: "/images/icons/weather-icon.png",
      text: "OOTD"
    }, {
      pagePath: "/pages/wardrobe/wardrobe",
      iconPath: "/images/icons/weather-icon.png",
      selectedIconPath: "/images/icons/weather-icon.png",
      text: "智衣橱"
    }, {
      pagePath: "/pages/profile/profile",
      iconPath: "/images/icons/weather-icon.png",
      selectedIconPath: "/images/icons/weather-icon.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      });
      this.setData({
        selected: data.index
      });
    }
  }
}) 