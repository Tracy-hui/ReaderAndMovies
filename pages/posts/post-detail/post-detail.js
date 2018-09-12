//index.js
//获取应用实例
const {postList} = require("../../../data/posts-data")
const app = getApp()
Page({
  data: {
    play: false
  },
  onLoad: function(option){
    console.log('id', option)
    var postId = option.id
    this.data.postId = postId
    var postData = postList[postId]
    console.log(postId)
    console.log(postData)
    this.setData({
      postData
    })
    // 
    // var postCollected = {
    //   1: "true",
    //   2: "false"
    // }
    var postsCollected = wx.getStorageSync('posts_Collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      postCollected = postCollected ? postCollected : false
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync('posts_Collected', postsCollected)
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.postId){
      this.setData({
        play: true
      })
    }
    this.setAudioMonitor()
  },
  setAudioMonitor(){
    wx.onBackgroundAudioPlay(()=>{
      this.setData({
        play: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_currentMusicPostId = this.data.postId
    })
    wx.onBackgroundAudioPause(()=>{
      this.setData({
        play: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentMusicPostId = null
    })
  },
  onMusicTap(event){
    console.log('jkfdjsklfjdslkfjdkslf', this.data.play)
    if (this.data.play) {
      wx.stopBackgroundAudio()
      // this.data.play = false
      this.setData({
        play: false
      })
      app.globalData.g_isPlayingMusic = false
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.postData.music.dataUrl,
        title: this.data.postData.music.title,
        coverImgUrl: this.data.postData.music.coverImgUrl
      })
      // this.data.play = true
      this.setData({
        play: true
      })
      app.globalData.g_isPlayingMusic = true
    }
  },
  onCollectionTap: function(event) {
    var postsCollected = wx.getStorageSync('posts_Collected')
    var postCollected = postsCollected[this.data.postId]
    this.getShowToast(postsCollected, postCollected)
    // this.getShowModal(postsCollected, postCollected)
  },
  getShowToast(postsCollected, postCollected){
    postCollected = !postCollected;
    postsCollected[this.data.postId] = postCollected
    wx.setStorageSync('posts_Collected', postsCollected)
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: 'success'
    })
  },
  getShowModal(postsCollected, postCollected){
    var self = this
    wx.showModal({
      title: '收藏',
      content: postCollected ? '是否收藏该文章?' : '取消收藏该文章?',
      showCancel: true,
      cancelText: '不收藏',
      cancelColor: '#333',
      confirmText: '收藏',
      confirmColor: '#405f80',
      success: function(res) {
        if (res.confirm) {
          postCollected = true;
          postsCollected[self.data.postId] = postCollected
          wx.setStorageSync('posts_Collected', postsCollected)
          self.setData({
            collected: postCollected
          })
        } else if (res.cancel) {
          postCollected = false
          postsCollected[self.data.postId] = postCollected
          wx.setStorageSync('posts_Collected', postsCollected)
          self.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  onShareTap: function(event) {
    // wx.removeStorageSync('key')
    // 缓存最大上线10MB
    // wx.clearStorageSync()
    var self = this
    var itemList = ['分享到朋友圈', '分享到QQ空间', '分享到微博']
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        console.log(res.tapIndex)
        wx.showModal({
          title: '提示',
          content: itemList[res.tapIndex],
          confirmColor: '#405f80',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }
})
