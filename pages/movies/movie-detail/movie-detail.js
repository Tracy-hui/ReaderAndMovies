var app = getApp()
var utils = require('../../../utils/util')
Page({
  data: {
    movie: {}
  },
  onLoad(options){
    console.log(options)
    var movieId = options.id
    console.log('movieId', movieId)
    var url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId
    utils.http(url, this.processDoubanData)
  },
  // 查看图片
  viewMoviePostImg (event) {
    var src = event.currentTarget.dataset.src
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  processDoubanData(data) {
    console.log('processDoubanData', data)
    var director = {
      avatar: '',
      name: '',
      id: ''
    }
    if(data.directors[0]!==null){
      if(data.directors[0]!==null){
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name
      director.id = data.directors[0].id
    }
    var movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join('、'),
      stars: utils.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: utils.convertToCastString(data.casts),
      castsInfo: utils.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.setData({
      movie
    })
  }
})