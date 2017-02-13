var app = getApp()
var dialog = require("../../utils/dialog")

Page({
  data:{
    album:[],
    title:"",
    id:"",
    countShow:true,
    currentIndex:1
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    this.setData({
      title:options.title,
      id:options.id.replace("##",".")
    })
    dialog.loading()
    console.log("imageList id:"+ this.data.id)
    //请求数据
    var that = this
    var urlString = ""
    urlString = app.globalData.api.albumBaseUrl
    if(urlString) {
      urlString = urlString.replace("%id%",that.data.id)
      console.log(urlString)
    }
    wx.request({
      //app.globalData.api.albumBaseurl.replace("%id%",that.data.id)
      url: urlString,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(ret){
        // success
        ret = ret['data']
        console.log(ret)
        if(ret['showapi_res_code'] == 0 && ret['showapi_res_body']) {
          var imageList = [];
          imageList = ret['showapi_res_body']['imgList']
          var imgObjList = [];
          console.log("imageList:"+imageList)
          imageList.forEach(function(item,index){
            imgObjList.push({
              url:item,
              w:750,
              h:375
            })
          })
          that.setData({
            album:imgObjList,
            albumUrlList:imageList,
            total:imageList.length,
            loaded:0
          })
          setTimeout(function(){
                dialog.hide()
          },1000)
        }else{
          console.log("网络出错了了！！！");
        }
      },
      fail: function() {
        // fail
        console.log("faile！");
      },
      complete: function() {
        // complete
        setTimeout(function(){
          dialog.hide();
        },1000)
      }
    })
  },
  //加载图片
  imageload:function(event){
    console.log(event)
    var h = event.detail.height
    var w = event.detail.width
    var index = event.currentTarget.dataset.index
    var album = this.data.album
    console.log(h,w,index,album)
    album[index].h = parseInt(750 * h / w)
    this.setData({ 
      album:album
    })
  },
  //图片预览
  prviewImageHandle:function(event){
    wx.previewImage({
      current: event.currentTarget.dataset.src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: this.data.albumUrlList,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  swiperChange:function(event){
    this.setData({currentIndex:parseInt(event.detail.current) +1})
  },
  //长按图片
  imageLongTap:function(event){
    wx.showActionSheet({
      itemList:["保存图片"],
      success:function(res){
        if(res.tapIndex == 0) {
          var imageSrc = event.currentTarget.dataset.src
          console.log(imageSrc)
          wx.downloadFile({
            url: imageSrc,
            // type: 'image', // 下载资源的类型，用于客户端识别处理，有效值：image/audio/video
            // header: {}, // 设置请求的 header
            success: function(res){
              // success
              console.log(res)
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function(res){
                  // success
                  console.log(res.savedFilePath)
                  dialog.toast("保存成功")
                },
                fail: function() {
                  // fail
                  dialog.toast("保存失败")
                },
                complete: function() {
                  // complete
                }
              })
            },
            fail: function() {
              // fail
              dialog.toast("图片下载失败")
            },
            complete: function() {
              // complete
            }
          })
        }
      }
    })
  },
  hideCount:function(){
    this.setData({countShow:false})
  },
  onReady:function(){
    // 页面渲染完成
    wx.setNavigationBarTitle({
      title: this.data.title,
      success: function(res) {
        // success
      }
    })
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