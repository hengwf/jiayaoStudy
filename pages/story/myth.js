Page({
  data: {
    title: '神话故事'
  },
  onLoad() {
    console.log('神话故事页面加载')
  },
  goBack() {
    wx.navigateBack()
  }
})