Page({
  data: {
    title: '汉字学习'
  },
  onLoad() {
    console.log('汉字学习页面加载')
  },
  goBack() {
    wx.navigateBack()
  }
})