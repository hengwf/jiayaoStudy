Page({
  data: {
    title: '拼音学习'
  },
  onLoad() {
    console.log('拼音学习页面加载')
  },
  goBack() {
    wx.navigateBack()
  }
})