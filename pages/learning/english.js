Page({
  data: {
    title: '英语学习'
  },
  onLoad() {
    console.log('英语学习页面加载')
  },
  goBack() {
    wx.navigateBack()
  }
})