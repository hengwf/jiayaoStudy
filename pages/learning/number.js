Page({
  data: {
    title: '数字学习'
  },
  onLoad() {
    console.log('数字学习页面加载')
  },
  goBack() {
    wx.navigateBack()
  }
})