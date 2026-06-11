Page({
  data: {
    score: 0
  },
  onLoad() {
    console.log('首页加载')
  },
  goToGame() {
    wx.navigateTo({ url: '/pages/game/game' })
  },
  goToLearning() {
    wx.navigateTo({ url: '/pages/learning/learning' })
  },
  goToStory() {
    wx.navigateTo({ url: '/pages/story/story' })
  }
})