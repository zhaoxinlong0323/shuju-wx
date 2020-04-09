// 云函数入口文件
const cloud = require('wx-server-sdk')
var result

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //return {ok:1,result:555}
  const table=event.table;
  const openid = event.userInfo.openid;
  const pkcolumn=event.pkcolumn;
  console.log('拿到openid: ', openid)
  db.collection(table).where({
    pkcolumn: openid
  }).get({
    success: res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      return {
        ok:1,
        result:res.data
      }
    },
    fail: err => {
      console.error('[数据库] [查询记录] 失败：', err)
      return {
        ok:0,
        result:err
      }
    }
  })
}