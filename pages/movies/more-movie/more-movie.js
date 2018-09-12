var app = getApp()
var utils = require('../../../utils/util')
Page({
  data: {
    movies: [],
    navigateTitle: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true // 当前movies为空
  },
  onLoad(options){
    var category = options.category
    var dataUrl = ""
    switch(category){
      case "正在热映":
        dataUrl = app.globalData.doubanBase + 'v2/movie/in_theaters'
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + 'v2/movie/coming_soon'
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + 'v2/movie/top250'
        break;
    }
    this.setData({
      navigateTitle: category,
      requestUrl: dataUrl
    })
    utils.http(dataUrl, this.processDoubanData)
  },
  onMovieTap(event){
    console.log('event', event.target, event.currentTarget)
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
  onPullDownRefresh(event){
    console.log('下拉刷新')
    this.setData({
      movies: [],
      isEmpty: true,
      totalCount: 0
    })
    var refreshUrl = this.data.requestUrl + '?start=0&count=20'
    utils.http(refreshUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  onReachBottom(event){
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20'
    utils.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  // onScrollLower(event) {
  //   console.log('加载更多')
  //   var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20'
  //   utils.http(nextUrl, this.processDoubanData)
  //   wx.showNavigationBarLoading()
  // },
  processDoubanData(movieDouban){
    var movies = []
    for(var idx in movieDouban.subjects){
      var subject = movieDouban.subjects[idx]
      var title = subject.title
      if (title.length >= 6){
        title = title.substring(0,6) + '...'
      }
      // [1,1,1,1,1] 五颗星
      // [1,1,0,0,0] 二颗星
      var temp = {
        stars: utils.convertToStarsArray(subject.rating.stars),
        title,
        average: subject.rating.average,
        images: subject.images,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies = []
    // 如果要绑定新家在的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.setData({
        isEmpty: false
      })
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  onReady(){
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },
  
})