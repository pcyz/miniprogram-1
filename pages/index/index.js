// index.js
const db = wx.cloud.database()
Page({
  data:{
    listData:[],
    searchText: "",
  },
  onLoad: function(options) {
    this.getList()
  },
  getList(){
    var that = this
    wx.cloud.callFunction({
      name:'jinrijingxuan'
    }).then(res=>{
      console.log(res)
      that.setData({
        listData:res.result.data
      })
    })
  },
  // 模糊搜索
  search(e) {
    let that = this
    console.log(e);
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?searchText=' + e.detail.value.trim()
    })
    this.setData({
      searchText: ""
    })
  },
  // 跳转详情页
  gotoDetail(event){
    // console.log(event.currentTarget.dataset.item);
    wx.navigateTo({
      url: '../detail/detail?id='+event.currentTarget.dataset.item._id+'&title='+event.currentTarget.dataset.item.title,
    })
  }
})
