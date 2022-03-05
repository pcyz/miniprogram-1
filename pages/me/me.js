const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  onLoad() {
  },

  // 登录功能
  login(){
    var that = this
    wx.getUserProfile({
      desc: '展示用户信息',
      success(res){
        // console.log(res.userInfo);
        var user = res.userInfo
        app.globalData.userInfo = user
        that.setData({
          userInfo: user
        })
        // 获取用户的openid
        wx.getStorage({
          key: 'openid',
          success (res) {
            console.log(res);
            app.globalData.openid = res.data
            that.setData({
              openid:res.data
            })
          }
        })        
        // 检查是否之前已经授权登录
        wx.cloud.database().collection('user').where({
          _openid: that.openid
        }).get({
          success(res){
            if(res.data.length==0){
              // 把用户信息插入云数据库
              wx.cloud.database().collection('user').add({
                data:{
                  avatarUrl: user.avatarUrl,
                  nickName: user.nickName
                },
                success(res){
                  console.log(res);
                  wx.showToast({
                  title: '登录成功',
                  })
                }
              })
            }else{
              that.setData({
                userInfo:res.data[0]
              })
            }
          }
        })
      }
    })
  },

  // 退出功能
  loginOut(){
    app.globalData.userInfo = null
    wx.setStorage({
      key:"openid",
      data:null
    })
    // wx.getStorage({
    //   key: 'openid',
    //   success (res) {
    //     console.log(res.data);
    //   }
    // })
    console.log();
    this.setData({
      userInfo: null
    })
  },

  // 更换头像
  updataImg(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).then(res=>{
      console.log(res);
    // 产生随机数
    var num = Math.random()
    // 当前时间
    var time = Date.now()
    wx.cloud.uploadFile({
      cloudPath: `users/${num}-${time}-abc.png`,
      filePath: res.tempFilePaths[0]
    }).then(result=>{
      that.setData({
        yunImgUrl: result.fileID
      })
      that.updateImgUrl()
      wx.showToast({
        title: '上传成功',
      })
    })
  })
  },
  updateImgUrl(){
    var that = this
    wx.cloud.database().collection('user').where({
      _openid:that.data.openid
    }).update({
      data:{
        avatarUrl:that.data.yunImgUrl
      }
    }).then(res=>{
      console.log(res);
    })

  }
})