// pages/detail/detail.js
const app = getApp()
let shoucang = false
let dianzan = false
Page({
  //  页面的初始数据
  data: {
    detail:'',
    openid:'',
    shoucangUrl:"../../images/jialiu/shoucang-no.png",
    dianzanUrl:"../../images/jialiu/dianzan-no.png"
  },

  //  生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this
    console.log(options.id);
    wx.setNavigationBarTitle({
      title: options.title
    })
    wx.getStorage({
      key: 'openid',
      success (res) {
        console.log(res)
        that.setData({
          openid: res.data
        })
      }
    })
    wx.cloud.database().collection('menu').doc(options.id).get().then(res=>{
      console.log(res);
      this.setData({
        detail: res.data
      })
    })
    if(app.globalData.userInfo){
      wx.cloud.callFunction({
        name:'getshoucang',
        data:{
          uid: app.globalData.openid,
          mid: options.id
        },
        success: function(res) {
          console.log(res.result)
          if(!res.result.data){
            wx.cloud.callFunction({
              name:'addshoucang',
              data:{
                uid: app.globalData.openid,
                mid: options.id,
                shoucang:false,
                dianzan:false
              },
              success: function(res){
                console.log(res);
              }
            })
          }
          else{
            shoucang = res.result.data[0].shoucang
            dianzan = res.result.data[0].dianzan
            that.setData({
              shoucangUrl: shoucang ? "../../images/jialiu/shoucang-yes.png" : "../../images/jialiu/shoucang-no.png",
              dianzanUrl: dianzan ? "../../images/jialiu/dianzan-yes.png" : "../../images/jialiu/dianzan-no.png",
            })
          }
        },
      })
    }
  },
  shoucang(){
    var that = this
    if(app.globalData.userInfo){
      this.setData({
        shoucangUrl: shoucang ? "../../images/jialiu/shoucang-yes.png" : "../../images/jialiu/shoucang-no.png",
      })
      shoucang = !shoucang
      wx.cloud.callFunction({
        name:'upshoucang',
        data:{
          uid: that.data.openid,
          mid: that.data.detail._id,
          shoucang: shoucang,
        }
      }).then(res=>{
        console.log(res);
      })
    }else{
      wx.showToast({
        title: '请登录',
        icon: 'none'
      })
    }
  },
  dianzan(){
    var that = this
    if(app.globalData.userInfo){
      this.setData({
        dianzanUrl: dianzan ? "../../images/jialiu/dianzan-yes.png" : "../../images/jialiu/dianzan-no.png",
      })
      dianzan = !dianzan
      wx.cloud.callFunction({
        name:'upshoucang',
        data:{
          uid: that.data.openid,
          mid: that.data.detail._id,
          dianzan: dianzan
        }
      }).then(res=>{
        console.log(res);
      })
    }else{
      wx.showToast({
        title: '请登录',
        icon: 'none'
      })
    }
  }
})