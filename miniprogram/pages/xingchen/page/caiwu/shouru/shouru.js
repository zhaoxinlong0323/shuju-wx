import * as echarts from '../../../../../ec-canvas/echarts';

const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec:{
      onInit:initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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

  }
})

function initChart(canvas,width,height){
  const chart=echarts.init(canvas,null,{
    width:width,
    height:height
  })

  canvas.setChart(chart);
  var option={
    color:["#37A2DA","#67E0E3","#9FE6B8"],
    legend:{
      data:['A','B','C'],
      top:20,
      left:'center',
      z:100
    },
    grid:{
      left:'3%',
      right:'4%',
      bottom:'3%',
      containLabel:true
    },
    xAxis:{
      type:'category',
      boundaryGap:false,
      data:['周一','周二','周三','周四','周五','周六','周日'],
    },
    yAxis:{
      x:'center',
      type:'value',
      splitLine:{
        lineStyle:{
          type:'solid'
        }
      }
    },
    series:[{
      name:'A',
      type:'line',
      smooth:true,
      data:[18,36,65,30,78,40,33]
    },{
      name:'C',
      type:'line',
      smooth:true,
      data:[10,30,31,50,40,20,10]
    }]
  };

  chart.setOption(option);
  return chart;
}