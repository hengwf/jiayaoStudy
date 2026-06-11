Page({
  data: {
    title: '古诗学习'
  },
  onLoad() {
    console.log('古诗学习页面加载')
  },
  goBack() {
    wx.navigateBack()
  }
})