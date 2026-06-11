const app = getApp()

Page({
  data: {
    currentLevel: 1,
    unlockedLevel: 1,
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    puzzleData: []
  },

  colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'],

  onLoad: function (options) {
    this.initPuzzle()
  },

  initPuzzle: function () {
    let data = []
    for (let i = 1; i <= 8; i++) {
      data.push({
        value: i,
        color: this.colors[i - 1]
      })
    }
    data.push({ value: 0, color: '#EEEEEE' })
    this.setData({ puzzleData: data })
    this.shuffle()
  },

  shuffle: function () {
    let data = [...this.data.puzzleData]
    let emptyIndex = 8
    
    for (let i = 0; i < 50; i++) {
      let neighbors = []
      let row = Math.floor(emptyIndex / 3)
      let col = emptyIndex % 3
      
      if (row > 0) neighbors.push(emptyIndex - 3)
      if (row < 2) neighbors.push(emptyIndex + 3)
      if (col > 0) neighbors.push(emptyIndex - 1)
      if (col < 2) neighbors.push(emptyIndex + 1)
      
      let randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)]
      
      let temp = data[emptyIndex]
      data[emptyIndex] = data[randomNeighbor]
      data[randomNeighbor] = temp
      
      emptyIndex = randomNeighbor
    }
    
    setTimeout(() => {
      this.setData({ puzzleData: data })
    }, 0)
  },

  reset: function () {
    this.initPuzzle()
  },

  onPuzzleClick: function (e) {
    let index = parseInt(e.currentTarget.dataset.index)
    let data = this.data.puzzleData
    let emptyIndex = -1
    
    for (let i = 0; i < data.length; i++) {
      if (data[i].value === 0) {
        emptyIndex = i
        break
      }
    }
    
    let row = Math.floor(index / 3)
    let col = index % 3
    let emptyRow = Math.floor(emptyIndex / 3)
    let emptyCol = emptyIndex % 3
    
    if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
      let temp = data[index]
      data[index] = data[emptyIndex]
      data[emptyIndex] = temp
      
      this.setData({ puzzleData: data })
      
      this.checkWin()
    }
  },

  checkWin: function () {
    let data = this.data.puzzleData
    for (let i = 0; i < 8; i++) {
      if (data[i].value !== i + 1) return
    }
    
    if (data[8].value !== 0) return
    
    wx.showModal({
      title: '🎉 恭喜通关！',
      content: `第 ${this.data.currentLevel} 关完成！`,
      showCancel: false,
      success: (res) => {
        let newScore = app.globalData.score + 100
        app.globalData.score = newScore
        
        if (this.data.currentLevel >= this.data.unlockedLevel && this.data.unlockedLevel < 10) {
          app.globalData.unlockedLevels.puzzle = this.data.currentLevel + 1
          this.setData({ unlockedLevel: this.data.currentLevel + 1 })
        }
        
        if (this.data.currentLevel < 10) {
          this.setData({ currentLevel: this.data.currentLevel + 1 })
          this.initPuzzle()
        }
      }
    })
  },

  selectLevel: function (e) {
    let level = parseInt(e.currentTarget.dataset.level)
    if (level <= this.data.unlockedLevel) {
      this.setData({ currentLevel: level })
      this.initPuzzle()
    }
  },

  goBack: function () {
    wx.navigateBack()
  }
})
