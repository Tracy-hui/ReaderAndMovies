// components/component-tag-name.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToDetail(event){
      console.log(1111111111111, event.target)
      var postId = event.target.dataset.postId
      wx.navigateTo({
        url: '../../pages/posts/post-detail/post-detail?id'+postId
      })
    }
  }
})
