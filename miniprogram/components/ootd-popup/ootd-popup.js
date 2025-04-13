Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    weatherInfo: {
      type: String,
      value: '晴天 25°C'
    },
    styleType: {
      type: String,
      value: '韩系简约风'
    },
    ootdDesc: {
      type: String,
      value: '今天阳光明媚，温度适中，非常适合穿着简约舒适的韩系风格服装。以下是根据天气和您的风格偏好推荐的搭配：'
    },
    fashionTip: {
      type: String,
      value: '穿搭小贴士：简约不等于单调，可以通过面料质感和剪裁来提升整体搭配效果。'
    },
    clothingItems: {
      type: Array,
      value: [
        {
          type: 'top',
          title: '上装',
          desc: '白色宽松T恤或浅色简约衬衫',
          icon: '👕',
          iconBg: 'icon-top'
        },
        {
          type: 'bottom',
          title: '下装',
          desc: '直筒牛仔裤或卡其色休闲裤',
          icon: '👖',
          iconBg: 'icon-bottom'
        },
        {
          type: 'shoes',
          title: '鞋子',
          desc: '小白鞋或简约帆布鞋',
          icon: '👟',
          iconBg: 'icon-shoes'
        },
        {
          type: 'accessory',
          title: '配饰',
          desc: '简约手表、小巧耳饰',
          icon: '💍',
          iconBg: 'icon-accessory'
        }
      ]
    },
    styleImages: {
      type: Array,
      value: [
        'https://images.unsplash.com/photo-1611428813653-cf6a5a40025b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1513135467390-a0a25a2be9de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentSlide: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    stopPropagation(e) {
      // 阻止冒泡，避免误触关闭弹窗
    },
    
    onClose() {
      this.setData({ show: false });
      this.triggerEvent('close');
    },
    
    prevSlide() {
      let current = this.data.currentSlide;
      let total = this.properties.styleImages.length;
      
      current = (current - 1 + total) % total;
      
      this.setData({
        currentSlide: current
      });
    },
    
    nextSlide() {
      let current = this.data.currentSlide;
      let total = this.properties.styleImages.length;
      
      current = (current + 1) % total;
      
      this.setData({
        currentSlide: current
      });
    },
    
    goToSlide(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        currentSlide: index
      });
    },
    
    onFavorite() {
      this.triggerEvent('favorite');
    },
    
    onSave() {
      this.triggerEvent('save');
    }
  }
}) 