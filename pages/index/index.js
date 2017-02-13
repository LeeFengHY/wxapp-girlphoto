//index.js
//获取应用实例
var app = getApp()
var dialog = require("../../utils/dialog.js")
var wxNotificationCenter = require("../../utils/WxNotificationCenter.js")

Page({
  //初始data
   data: {
    contentList: [],
    currentType: wx.getStorageSync('currentType'),
    types: wx.getStorageSync('types') ? wx.getStorageSync('types') : app.globalData.types,
    navgationTitle:"比基尼",
  },  

  //加载第一个类型列表
  onLoad: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    if (!this.data.currentType) {
      console.log("currentType is null")
      this.data.types.every(function (item) {
        if (item.is_show) {
          wx.setStorageSync('currentType', item.value)
          this.setData({ currentType: item.value })
          console.log(item.value)
          return false
        } else {
          return true
        }
      })
    }
    console.log(that.data.currentType)
    this.getList(that.data.currentType)
    //添加通知
    wxNotificationCenter.addNotification("typesChangeNotification", that.typesChangeNotificationHandler, that)
  },
  //notification selector
  typesChangeNotificationHandler: function () {
    //接收类别编辑页面中修改了类别标签的通知，重新处理
    this.setData({
      types: wx.getStorageSync('types'),
      currentType: wx.getStorageSync('currentType')
    })
    this.getList(wx.getStorageSync('currentType'))
  },

  getList: function (type) {
    dialog.loading()
      var that = this
      //请求数据
      wx.request({
        url:app.globalData.api.listBaseUrl+type,
        success:function(ret){
          console.log(ret)
          ret = ret['data']
          if(ret['showapi_res_code'] === 0 && ret['showapi_res_body'] && ret['showapi_res_body']['ret_code'] ==0)
          {
            console.log("request success")
            that.setData({
              contentList:ret['showapi_res_body']['pagebean']['contentlist']
            })
          }else{
            setTimeout(function(){
              dialog.toast("网络出错啦！！！")
            },1)
          }
        },
        complete:function(){
          wx.stopPullDownRefresh()
          setTimeout(function(){
            dialog.hide()
          },1000)
        },
        fail:function(rep){
          console.log('request faile!!!!')
        },
      })
  },
  //下拉刷新
  onPullDownRefresh:function(){
    this.getList(this.data.currentType)
  },

  //点击某一个title跳
  changeType:function(event){
    var type = event.currentTarget.dataset.value
    var title = event.currentTarget.dataset.title
    console.log(type,title,event)
    if(type == this.data.currentType) {
      return;
    }
    wx.setNavigationBarTitle({
      title: title,
      success: function(res) {
        // success
        console.log("修改导航标题成功成功！！！")
      }
    })
    this.setData({
      currentType:type,
      navgationTitle:title
    })
    app.globalData.currentType = type
    this.getList(type)
  },

  gotoTypeEdit:function(event){
    wx.navigateTo({
      url:'../types/types?id=1',
    })
  },

  gotoAlbum:function(event){
    let param = event.currentTarget.dataset, title = param.title, id = param.id
    var url = "../album/album?title="+title+"&id="+id.replace(".","##")
    wx.navigateTo({
      url:url
    })
  },
 
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})