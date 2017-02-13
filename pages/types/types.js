var app = getApp()
var dialog = require("../../utils/dialog.js")
var wxNotificationCenter = require("../../utils/WxNotificationCenter.js")

Page({
  data:{
    types:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      types:wx.getStorageSync('types')
    })
    console.log(this.data.types)
  },
  changeTypeStatus:function(event){
    var value = event.currentTarget.dataset.value
    var currentType = wx.getStorageSync('currentType')
    var showCount = 0, isCurrentHide = false
    var types = this.data.types.map(function(item){
      if(item.value == value)
      {
        item.is_show = !item.is_show
        if(value == currentType && !item.is_show)
        {
          isCurrentHide = true
        }
      }
      if(item.is_show)
      {
        showCount++;
      }
      return item
    })
    if(showCount < 1)
    {
      dialog.toast("不能全部隐藏")
      return
    }
    if(isCurrentHide)
    {
      types.every(function(item){
        if(item.is_show)
        {
          wx.setStorageSync('currentType', item.value)
          return false
        }else{
          return true
        }
      })
    }
    this.setData({types:types})
    wx.setStorageSync('types', types)
    wxNotificationCenter.postNotificationName("typesChangeNotification")
  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})