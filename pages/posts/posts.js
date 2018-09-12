//index.js
//获取应用实例
const app = getApp()
const {postList} = require("../../data/posts-data")
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUsePhone: wx.canIUse('button.open-type.getPhoneNumber')
  },
  //事件处理函数
  goToDetail(event){
    console.log(1111111111111, event.currentTarget)
    var postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: '../../pages/posts/post-detail/post-detail?id='+postId
    })
  },
  onLoad: function () {
    // this.data.postList = postList
    this.setData({
      postList: postList
    })
    console.log('postList', postList)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  }
})
