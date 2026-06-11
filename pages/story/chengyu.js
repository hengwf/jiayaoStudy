Page({
  data: {
    title: '成语故事'
  },
  onLoad() {
    console.log('成语故事页面加载')
  },
  goBack() {
    wx.navigateBack()
  }
})