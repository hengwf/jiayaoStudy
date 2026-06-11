App({
  onLaunch: function () {
    console.log('衡佳瑶学习乐园启动')
  },
  
  onShow: function () {
    console.log('小程序显示')
  },
  
  onHide: function () {
    console.log('小程序隐藏')
  },
  
  globalData: {
    userInfo: null,
    score: 0,
    unlockedLevels: {
      puzzle: 1,
      whack: 1,
      memory: 1
    }
  }
})