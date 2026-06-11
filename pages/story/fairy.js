Page({
  data: {
    title: '童话故事'
  },
  onLoad() {
    console.log('童话故事页面加载')
  },
  goBack() {
    wx.navigateBack()
  }
})