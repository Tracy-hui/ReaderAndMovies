var app = getApp()
var utils = require('../../utils/util')
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },
  onLoad(event){
    var inTheatersUrl = app.globalData.doubanBase + 'v2/movie/in_theaters' + '?start=0&count=3'
    var comingSoonUrl = app.globalData.doubanBase + 'v2/movie/coming_soon' + '?start=0&count=3'
    var top250Url = app.globalData.doubanBase + 'v2/movie/top250' + '?start=0&count=3'
    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映')
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映')
    this.getMovieListData(top250Url, 'top250', '豆瓣Top250')
  },
  onMovieTap(event){
    console.log('event', event.target, event.currentTarget)
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },
  onBindFocus(event){
    console.log('onBindFocus')
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onBindChange(event){
    var text = event.detail.value
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text
    this.getMovieListData(searchUrl, 'searchResult', '')
  },
  onCancelImgTap(event){
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },
  onMoreTap(event){
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },
  getMovieListData(url, settedKey, categoryTitle) {
    var that = this
    wx.request({
      url,
      // data: {},
      method: 'GET', // options get head post put delete trace connect
      header: {
        "Content-Type": "application/xml"
      },
      success: function(res){
        console.log(res)
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function(){

      },
      complete: function(){

      }
    })
  },
  processDoubanData(movieDouban, settedKey, categoryTitle){
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
    var readyData = {}
    readyData[settedKey] = {
      movies: movies,
      categoryTitle: categoryTitle
    }
    this.setData(readyData)
  }
})
