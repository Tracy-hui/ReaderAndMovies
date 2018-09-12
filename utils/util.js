const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
 // [1,1,1,1,1] 五颗星
 // [1,1,0,0,0] 二颗星
 // [1,1,2,0,0] 二颗半星
const convertToStarsArray = stars => {
  var num = stars.toString().substring(0,1)
  var num2 = stars.toString().substring(1,2)
  console.log('stars', num2)
  var array = []
  for(var i=1;i<=5;i++){
    if(i<=num && num2>0){
      array.push(2)
    }else if(i<=num && num2<=0){
      array.push(1)
    }else {
      array.push(0)
    }
  }
  return array
}

const http = (url, callBack) => {
  wx.request({
    url,
    // data: {},
    method: 'GET', // options get head post put delete trace connect
    header: {
      "Content-Type": "application/xml"
    },
    success: function(res){
      callBack(res.data)
    },
    fail: function(){

    },
    complete: function(){

    }
  })
}
const convertToCastString = (casts) => {
  var castsjoin = ''
  for(var idx in casts){
    castsjoin = castsjoin + casts[idx].name + ' / '
  }
  return castsjoin.substring(0, castsjoin.length - 2)
}
const convertToCastInfos = (casts) => {
  var castsArray = []
  for(var idx in casts){
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : '',
      name: casts[idx].name
    }
    castsArray.push(cast)
  }
  return castsArray
}
module.exports = {
  formatTime,
  convertToStarsArray,
  convertToCastString,
  convertToCastInfos,
  http
}
