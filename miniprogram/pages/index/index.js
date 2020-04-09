//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    globalnum:0,
    openid:''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    //拿到openid，并查出总积分
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({ openid: res.result.openid})
        //拿到当前微信号的总积分
        const db = wx.cloud.database()
        db.collection('user').where({
          _openid: this.data.openid
        }).get({
          success: res => {
            //console.log('[数据库] [查询记录] 成功: ', res)
            //如果能查到数据，取第一个数据
            if (res.data.length >0) {
              this.setData({ globalnum: res.data[0].globalnum })
            }
            else {
              //如果查不到数据，那就向表当中添加一条数据
              var date = new Date();
              db.collection('user').add({
                data: {
                  globalnum: 0,
                  editdate: date.toLocaleString()
                },
                success: res => {
                  this.setData({
                    counterId: res._id,
                    globalnum: 0
                  })
                  //显示弹出信息，这个信息会一闪而过
                  wx.showToast({
                    title: '欢迎使用',
                  })
                },
                fail: err => {
                  wx.showToast({
                    title: '数据库连接失败'
                  })
                  console.error('[数据库] [新增记录] 失败：', err)
                }
              })
            }
          },
          fail: err => {
            wx.showToast({
              title: '数据库连接失败',
            })
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
})
