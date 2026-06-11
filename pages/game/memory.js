Page({
  data: {
    cards: [],
    score: 0,
    matches: 0,
    totalPairs: 0,
    currentLevel: 1,
    unlockedLevel: 1,
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    flippedCards: [],
    isLocked: false,
    matchedPairs: []
  },

  onLoad(options) {
    if (options && options.level) {
      this.setData({
        currentLevel: parseInt(options.level)
      });
    }
    this.initGame();
  },

  initGame() {
    const level = this.data.currentLevel;
    const pairs = Math.min(4 + level, 12);
    const cardTypes = ['🎮', '🎯', '🎲', '🧩', '🎨', '🎭', '🎪', '🎰', '🎳', '🎸', '📚', '🌟'];
    
    let cards = [];
    for (let i = 0; i < pairs; i++) {
      const emoji = cardTypes[i % cardTypes.length];
      cards.push({ id: i * 2, emoji: emoji, flipped: false, matched: false });
      cards.push({ id: i * 2 + 1, emoji: emoji, flipped: false, matched: false });
    }
    
    setTimeout(() => {
      cards = this.shuffleArray(cards);
      this.setData({
        cards: cards,
        score: 0,
        matches: 0,
        totalPairs: pairs,
        flippedCards: [],
        isLocked: false,
        matchedPairs: []
      });
    }, 0);
  },

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  },

  flipCard(e) {
    if (this.data.isLocked) return;
    
    const index = parseInt(e.currentTarget.dataset.index);
    const card = this.data.cards[index];
    
    if (card.flipped || card.matched) return;
    if (this.data.flippedCards.length >= 2) return;

    const cards = [...this.data.cards];
    cards[index].flipped = true;
    
    const flippedCards = [...this.data.flippedCards, index];
    
    this.setData({
      cards: cards,
      flippedCards: flippedCards
    });

    if (flippedCards.length === 2) {
      this.checkMatch(flippedCards);
    }
  },

  checkMatch([first, second]) {
    this.setData({ isLocked: true });
    
    const firstCard = this.data.cards[first];
    const secondCard = this.data.cards[second];

    if (firstCard.emoji === secondCard.emoji) {
      setTimeout(() => {
        const cards = [...this.data.cards];
        cards[first].matched = true;
        cards[second].matched = true;
        
        const newMatches = this.data.matches + 1;
        const newScore = this.data.score + 100 * this.data.currentLevel;
        
        this.setData({
          cards: cards,
          matches: newMatches,
          score: newScore,
          flippedCards: [],
          isLocked: false
        });

        if (newMatches === this.data.totalPairs) {
          this.gameWin();
        }
      }, 500);
    } else {
      setTimeout(() => {
        const cards = [...this.data.cards];
        cards[first].flipped = false;
        cards[second].flipped = false;
        
        this.setData({
          cards: cards,
          flippedCards: [],
          isLocked: false
        });
      }, 1000);
    }
  },

  gameWin() {
    const level = this.data.currentLevel;
    const nextLevel = level + 1;
    
    if (nextLevel <= 10) {
      this.setData({
        unlockedLevel: Math.max(this.data.unlockedLevel, nextLevel)
      });
    }
    
    wx.showModal({
      title: '🎉 恭喜过关！',
      content: `第 ${level} 关完成！得分：${this.data.score}`,
      confirmText: '下一关',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm && nextLevel <= 10) {
          this.setData({ currentLevel: nextLevel });
          this.initGame();
        } else {
          this.goBack();
        }
      }
    });
  },

  resetGame() {
    this.initGame();
  },

  selectLevel(e) {
    const level = parseInt(e.currentTarget.dataset.level);
    if (level <= this.data.unlockedLevel) {
      this.setData({ currentLevel: level });
      this.initGame();
    }
  },

  goBack() {
    wx.navigateBack();
  }
});