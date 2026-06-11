const app = getApp()

Page({
  data: {
    currentLevel: 1,
    unlockedLevel: 1,
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    holes: [],
    score: 0,
    targetScore: 8,
    timeLeft: 30,
    gameStarted: false
  },

  gameTimer: null,
  moleTimer: null,

  onLoad: function (options) {
    this.initHoles()
  },

  onUnload: function () {
    this.stopGame()
  },

  initHoles: function () {
    let holes = []
    for (let i = 0; i < 9; i++) {
      holes.push({ show: false, hit: false })
    }
    setTimeout(() => {
      this.setData({ 
        holes: holes,
        score: 0,
        targetScore: 5 + this.data.currentLevel * 3,
        timeLeft: Math.max(30 - this.data.currentLevel * 2, 10)
      })
    }, 0)
  },

  startGame: function () {
    if (this.data.gameStarted) {
      this.stopGame()
    } else {
      this.setData({ 
        gameStarted: true,
        score: 0,
        targetScore: 5 + this.data.currentLevel * 3,
        timeLeft: Math.max(30 - this.data.currentLevel * 2, 10)
      })
      this.gameTimer = setInterval(() => {
        let timeLeft = this.data.timeLeft - 1
        this.setData({ timeLeft: timeLeft })
        
        if (timeLeft <= 0) {
          this.gameOver()
        }
      }, 1000)
      
      this.showMoles()
    }
  },

  stopGame: function () {
    this.setData({ gameStarted: false })
    
    if (this.gameTimer) {
      clearInterval(this.gameTimer)
      this.gameTimer = null
    }
    
    if (this.moleTimer) {
      clearTimeout(this.moleTimer)
      this.moleTimer = null
    }
    
    let holes = this.data.holes.map(() => ({ show: false, hit: false }))
    this.setData({ holes: holes })
  },

  showMoles: function () {
    if (!this.data.gameStarted) return
    
    let holes = this.data.holes.map(h => ({ ...h, show: false }))
    
    let count = Math.min(1 + Math.floor(this.data.currentLevel / 3), 3)
    let availableIndices = []
    
    for (let i = 0; i < 9; i++) {
      availableIndices.push(i)
    }
    
    for (let i = 0; i < count; i++) {
      let randomIndex = availableIndices.splice(Math.floor(Math.random() * availableIndices.length), 1)[0]
      holes[randomIndex].show = true
    }
    
    this.setData({ holes: holes })
    
    let interval = Math.max(800 - this.data.currentLevel * 50, 500)
    this.moleTimer = setTimeout(() => {
      let holes = this.data.holes.map(h => ({ ...h, show: false }))
      this.setData({ holes: holes })
      
      if (this.data.gameStarted) {
        this.showMoles()
      }
    }, interval)
  },

  whackMole: function (e) {
    if (!this.data.gameStarted) return
    
    let index = parseInt(e.currentTarget.dataset.index)
    let holes = this.data.holes
    
    if (holes[index].show) {
      holes[index].show = false
      holes[index].hit = true
      
      let score = this.data.score + 1
      this.setData({ 
        holes: holes,
        score: score 
      })
      
      setTimeout(() => {
        let holes = this.data.holes
        holes[index].hit = false
        this.setData({ holes: holes })
      }, 300)
      
      if (score >= this.data.targetScore) {
        this.winGame()
      }
    }
  },

  winGame: function () {
    this.stopGame()
    
    let reward = this.data.score * 5
    app.globalData.score += reward
    
    if (this.data.currentLevel >= this.data.unlockedLevel && this.data.unlockedLevel < 10) {
      app.globalData.unlockedLevels.whack = this.data.currentLevel + 1
      this.setData({ unlockedLevel: this.data.currentLevel + 1 })
    }
    
    wx.showModal({
      title: '🎉 恭喜通关！',
      content: `获得 ${reward} 分！`,
      showCancel: false,
      success: (res) => {
        if (this.data.currentLevel < 10) {
          this.setData({ currentLevel: this.data.currentLevel + 1 })
          this.initHoles()
        }
      }
    })
  },

  gameOver: function () {
    this.stopGame()
    
    let reward = this.data.score * 5
    app.globalData.score += reward
    
    wx.showModal({
      title: '⏰ 时间到！',
      content: `你打中了 ${this.data.score} / ${this.data.targetScore} 只地鼠，获得 ${reward} 分`,
      showCancel: false
    })
  },

  selectLevel: function (e) {
    let level = parseInt(e.currentTarget.dataset.level)
    if (level <= this.data.unlockedLevel) {
      this.stopGame()
      this.setData({ currentLevel: level })
      this.initHoles()
    }
  },

  goBack: function () {
    this.stopGame()
    wx.navigateBack()
  }
})
