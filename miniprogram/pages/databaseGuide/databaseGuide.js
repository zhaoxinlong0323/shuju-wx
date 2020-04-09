// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({
  //一、data用于定义当前页面当中的变量
  //wxml当中用{{count}}来绑定count这个变量
  //在js当中使用this.setData({count: 1})的时候，页面上的{{count}}变会替换为1
  data: {
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
  },
  //二、固定方法onLoad，在加载页面的时候调用
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        //给openid赋值，以便访问数据库
        openid: app.globalData.openid
      })
    }
  },
  //三、自定义的方法，用于绑定wxml当中的标识
  //用bindtap来绑定这个方法名称
  //<button size="mini" type="default" bindtap="onAdd">新增记录</button>
  onAdd: function () {
     //得到云数据库
     const db = wx.cloud.database()
     //连接数据库的counters集合
     //add方法里要传入三个变量，data、success、fail
     db.collection('counters').add({
       //向数据库里插入的数据
       // 系统会自动插入_id字段和_openid字段
       // _id这个字段就相当于一个主键
       // _openid这个字段需要在onload的时候给openid赋值
       data: {
         count: 1
       },
       // 成功时执行sucess里的方法，用一个es6里的=>号来表达
       //res => 的意思是function(res)的意思
       success: res => {
         // 在返回结果中会包含新创建的记录的 _id
         // 向data这个变量里赋上刚才插入的数据的_id，相当于主键
         this.setData({
           counterId: res._id,
           count: 1
         })
         //显示弹出信息，这个信息会一闪而过
         wx.showToast({
           title: '新增记录成功',
         })
         console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
       },
       fail: err => {
         wx.showToast({
           icon: 'none',
           title: '新增记录失败'
         })
         console.error('[数据库] [新增记录] 失败：', err)
       }
     })
  },

  onQuery: function() {
    //得到数据库
     const db = wx.cloud.database()
     // 查询当前用户所有的 counters
     //查询：使用where方法输入条件，然后再用get方法得到数据
     //get方法里面又嵌套着成功和失败的两个方法
     db.collection('counters').where({
       _openid: this.data.openid
     }).get({
       success: res => {
         this.setData({
           //JSON.stringify用于把json对象转成字符串
           //第二个参数可以为数组
           //第三个参数是输出的{}与数据之间隔几个空格，这里是2个空格
           queryResult: JSON.stringify(res.data, null, 2)
         })
         console.log('[数据库] [查询记录] 成功: ', res)
       },
       fail: err => {
         wx.showToast({
           icon: 'none',
           title: '查询记录失败'
         })
         console.error('[数据库] [查询记录] 失败：', err)
       }
     })
  },

  onCounterInc: function() {
     //得到数据库
     const db = wx.cloud.database()
     //把当前的count值加1后赋给newCount
     const newCount = this.data.count + 1
     //使用doc方法，输入counterId，其实就是插入数据的主键_id
     //使用update方法更新数据，把count字段更新为newCount的值
     db.collection('counters').doc(this.data.counterId).update({
       data: {
         count: newCount
       },
       success: res => {
         //成功之后把newCount赋值给页面上的count储存下来
         //在界面上更新
         this.setData({
           count: newCount
         })
       },
       fail: err => {
         icon: 'none',
         console.error('[数据库] [更新记录] 失败：', err)
       }
     })
  },

  onCounterDec: function() {
     const db = wx.cloud.database()
     const newCount = this.data.count - 1
     db.collection('counters').doc(this.data.counterId).update({
       data: {
         count: newCount
       },
       success: res => {
         this.setData({
           count: newCount
         })
       },
       fail: err => {
         icon: 'none',
         console.error('[数据库] [更新记录] 失败：', err)
       }
     })
  },

  onRemove: function() {
    //如果这个_id还存在的话，才删除这一条记录，不然无记录可删
     if (this.data.counterId) {
       //得到数据库
       const db = wx.cloud.database()
       //用doc指向数据，然后用remove删除
       db.collection('counters').doc(this.data.counterId).remove({
         //成功后函数
         success: res => {
           wx.showToast({
             title: '删除成功',
           })
           //把原来的_id给删除掉，把count值为变为空
           this.setData({
             counterId: '',
             count: null,
           })
         },
         fail: err => {
           wx.showToast({
             icon: 'none',
             title: '删除失败',
           })
           console.error('[数据库] [删除记录] 失败：', err)
         }
       })
     } else {
       wx.showToast({
         title: '无记录可删，请见创建一个记录',
       })
     }
  },

  nextStep: function () {
    // 在第一步，需检查是否有 openid，如无需获取
    if (this.data.step === 1 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function() {} : function() {
        console.group('数据库文档')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})