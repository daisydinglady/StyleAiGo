// wardrobe.js
Page({
  data: {
    // 当前选中的类别
    currentCategory: 'all',
    
    // 搜索关键词
    searchKeyword: '',
    
    // 筛选条件
    filters: {
      colors: [],
      seasons: []
    },
    
    // 弹窗状态
    showAddItemModal: false,
    showFilterModal: false,
    
    // 新衣物数据
    newItem: {
      name: '',
      category: '',
      image: ''
    },
    
    // 分类选项
    categoryOptions: ['上装', '裤子', '外套', '鞋子', '配饰', '包包'],
    
    // 颜色选项
    colorOptions: [
      { color: '黑色', bg: '#000000' },
      { color: '白色', bg: '#FFFFFF' },
      { color: '灰色', bg: '#808080' },
      { color: '红色', bg: '#FF0000' },
      { color: '蓝色', bg: '#0000FF' },
      { color: '绿色', bg: '#008000' },
      { color: '黄色', bg: '#FFFF00' },
      { color: '紫色', bg: '#800080' },
      { color: '粉色', bg: '#FFC0CB' },
      { color: '棕色', bg: '#A52A2A' }
    ],
    
    // 季节选项
    seasonOptions: [
      { season: 'spring', label: '春季' },
      { season: 'summer', label: '夏季' },
      { season: 'autumn', label: '秋季' },
      { season: 'winter', label: '冬季' }
    ],
    
    // 衣物列表（示例数据）
    wardrobeItems: [
      {
        id: 1,
        name: '黑色T恤',
        category: '上装',
        image: '/miniprogram/images/wardrobe/tshirt.png',
        color: '白色',
        seasons: ['spring', 'summer']
      },
      {
        id: 2,
        name: '蓝色牛仔裤',
        category: '裤子',
        image: '/miniprogram/images/wardrobe/jeans.png',
        color: '蓝色',
        seasons: ['spring', 'autumn']
      },
      {
        id: 3,
        name: '黑色夹克',
        category: '外套',
        image: '/miniprogram/images/wardrobe/jacket.png',
        color: '黑色',
        seasons: ['autumn', 'winter']
      },
      {
        id: 4,
        name: '运动鞋',
        category: '鞋子',
        image: '/miniprogram/images/wardrobe/sneakers.png',
        color: '白色',
        seasons: ['spring', 'summer', 'autumn']
      }
    ],
    
    // 推荐穿搭（示例数据）
    recommendedOutfits: [
      {
        id: 1,
        title: '休闲日常搭配',
        description: '适合日常休闲场合，舒适自然的穿搭风格',
        image: '/miniprogram/images/wardrobe/outfit1.png',
        isFavorite: false
      },
      {
        id: 2,
        title: '商务通勤搭配',
        description: '正式但不失时尚的商务通勤穿搭',
        image: '/miniprogram/images/wardrobe/outfit2.png',
        isFavorite: true
      }
    ],
    
    // 经过筛选后的衣物列表
    filteredItems: []
  },

  onLoad: function() {
    // 初始化过滤后的衣物列表
    this.filterItems();
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  // 切换分类
  changeCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category
    });
    this.filterItems();
  },

  // 搜索衣物
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.filterItems();
  },

  // 显示筛选弹窗
  showFilterModal: function() {
    this.setData({
      showFilterModal: true
    });
  },

  // 隐藏筛选弹窗
  hideFilterModal: function() {
    this.setData({
      showFilterModal: false
    });
  },

  // 切换颜色筛选
  toggleColorFilter: function(e) {
    const color = e.currentTarget.dataset.color;
    const colors = [...this.data.filters.colors];
    
    const index = colors.indexOf(color);
    if (index === -1) {
      colors.push(color);
    } else {
      colors.splice(index, 1);
    }
    
    this.setData({
      'filters.colors': colors
    });
  },

  // 切换季节筛选
  toggleSeasonFilter: function(e) {
    const season = e.currentTarget.dataset.season;
    const seasons = [...this.data.filters.seasons];
    
    const index = seasons.indexOf(season);
    if (index === -1) {
      seasons.push(season);
    } else {
      seasons.splice(index, 1);
    }
    
    this.setData({
      'filters.seasons': seasons
    });
  },

  // 重置筛选
  resetFilters: function() {
    this.setData({
      filters: {
        colors: [],
        seasons: []
      }
    });
  },

  // 应用筛选
  applyFilters: function() {
    this.filterItems();
    this.hideFilterModal();
  },

  // 筛选衣物
  filterItems: function() {
    let items = [...this.data.wardrobeItems];
    
    // 按类别筛选
    if (this.data.currentCategory !== 'all') {
      const categoryMap = {
        'tops': '上装',
        'pants': '裤子',
        'outerwear': '外套',
        'shoes': '鞋子',
        'accessories': '配饰',
        'bags': '包包'
      };
      
      const category = categoryMap[this.data.currentCategory];
      items = items.filter(item => item.category === category);
    }
    
    // 按关键词搜索
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(keyword) || 
        item.category.toLowerCase().includes(keyword)
      );
    }
    
    // 按颜色筛选
    if (this.data.filters.colors.length > 0) {
      items = items.filter(item => this.data.filters.colors.includes(item.color));
    }
    
    // 按季节筛选
    if (this.data.filters.seasons.length > 0) {
      items = items.filter(item => {
        return item.seasons.some(season => this.data.filters.seasons.includes(season));
      });
    }
    
    this.setData({
      filteredItems: items
    });
  },

  // 显示添加衣物弹窗
  showAddItemModal: function() {
    this.setData({
      showAddItemModal: true,
      newItem: {
        name: '',
        category: '',
        image: ''
      }
    });
  },

  // 隐藏添加衣物弹窗
  hideAddItemModal: function() {
    this.setData({
      showAddItemModal: false
    });
  },

  // 衣物名称输入
  onItemNameInput: function(e) {
    this.setData({
      'newItem.name': e.detail.value
    });
  },

  // 选择衣物类别
  onCategoryChange: function(e) {
    const index = e.detail.value;
    const category = this.data.categoryOptions[index];
    this.setData({
      'newItem.category': category
    });
  },

  // 选择衣物图片
  chooseImage: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          'newItem.image': tempFilePath
        });
      }
    });
  },

  // 添加衣物
  addItem: function() {
    // 校验表单
    if (!this.data.newItem.name) {
      wx.showToast({
        title: '请输入衣物名称',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.newItem.category) {
      wx.showToast({
        title: '请选择衣物类别',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.newItem.image) {
      wx.showToast({
        title: '请上传衣物照片',
        icon: 'none'
      });
      return;
    }
    
    // 添加新衣物
    const newItem = {
      id: this.data.wardrobeItems.length + 1,
      name: this.data.newItem.name,
      category: this.data.newItem.category,
      image: this.data.newItem.image,
      color: '黑色', // 默认颜色，实际应用中可通过算法从图片提取
      seasons: ['spring'] // 默认季节，实际应用中可让用户选择
    };
    
    const wardrobeItems = [...this.data.wardrobeItems, newItem];
    
    this.setData({
      wardrobeItems,
      showAddItemModal: false
    });
    
    // 重新筛选衣物
    this.filterItems();
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  // 显示衣物详情
  showItemDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    // 跳转到衣物详情页面，实际应用中可能需要额外开发该页面
    wx.showToast({
      title: '查看衣物：' + id,
      icon: 'none'
    });
  },

  // 保存穿搭
  saveOutfit: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '保存穿搭成功',
      icon: 'success'
    });
  },

  // 收藏/取消收藏穿搭
  toggleFavorite: function(e) {
    const id = e.currentTarget.dataset.id;
    const outfits = [...this.data.recommendedOutfits];
    const index = outfits.findIndex(outfit => outfit.id === id);
    
    if (index !== -1) {
      outfits[index].isFavorite = !outfits[index].isFavorite;
      this.setData({
        recommendedOutfits: outfits
      });
      
      wx.showToast({
        title: outfits[index].isFavorite ? '已收藏' : '已取消收藏',
        icon: 'success'
      });
    }
  },

  // 导航到其他页面
  navigateTo: function(e) {
    const page = e.currentTarget.dataset.page;
    wx.switchTab({
      url: `/pages/${page}/${page}`
    });
  }
}); 