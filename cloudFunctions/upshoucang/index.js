// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('shoucang').where({
    uid: event.uid,
    mid:event.mid
  }).update({
    data:{
      shoucang: event.shoucang,
      dianzan: event.dianzan
    }
  })
  .then(res=>{
    return res
  })
}