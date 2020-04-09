// miniprogram/pages/add/add.js
var util=require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    leibie: ['增加积分项目', '消费积分项目'],
    lbindex:0,
    startdate:'2001-01-01',
    enddate:'2001-01-01',
    shuoming:'',
    name:'',
    num:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //得到当前时间
    var now = util.formatDate(new Date());
    this.setData({
      startdate: now,
      enddate: now
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onLeibieChange:function(e){
    this.setData({
      lbindex: e.detail.value
    })
  },

  onBindStartDateChange:function(e){
    this.setData({
      startdate: e.detail.value
    })
  },

  onBindEndDateChange: function (e) {
    this.setData({
      enddate: e.detail.value
    })
  },

  onInputShuoming: function (e) {
    this.setData({
      shuoming: e.detail.value
    })
  },

  onInputName:function(e){
    this.setData({
      name: e.detail.value
    })
  },

  onInputNum:function(e){
    this.setData({
      num: e.detail.value
    })
  },

  onAdd:function(e){
    //检查各项参数
    if(this.checkInput()==false){
      return;
    }

    //写入数据库
    const db = wx.cloud.database()
    db.collection('plan').add({
      data: {
        leibie: this.data.lbindex,
        name: this.data.name,
        num:this.data.num,
        shuoming:this.data.shuoming,
        startdate:this.data.startdate,
        enddate:this.data.enddate,
        dr:0
      },
      success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        /*wx.navigateTo({
          url: '../planlist/planlist'
        })*/
        setTimeout(function(){
          wx.navigateBack({
          })
        },1000)
        
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

  checkInput:function(){
    if ((this.data.name == null) || (this.data.name == '')) {
      wx.showToast({
        title: '名称不能为空',
        icon:'none'
      })
      return false;
    }

    if ((this.data.num == null) || (this.data.num == '')) {
      wx.showToast({
        title: '积分不能为空',
        icon: 'none'
      })
      return false;
    }
  }
})