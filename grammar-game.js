// ============================================================
// grammar-game.js - Grammar Detective Game Mode
// Interactive Pattern Identification Game
// ============================================================

class GrammarGame {
  constructor() {
    this.currentQuestion = null;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;
    this.difficulty = 'easy'; // easy, medium, hard
    this.difficultyLevels = {
      easy: {
        optionsCount: 3,
        hintsAvailable: 3,
        timeLimit: 30,
        pointsMultiplier: 1,
        confidenceThreshold: 60
      },
      medium: {
        optionsCount: 4,
        hintsAvailable: 2,
        timeLimit: 20,
        pointsMultiplier: 1.5,
        confidenceThreshold: 70
      },
      hard: {
        optionsCount: 4,
        hintsAvailable: 1,
        timeLimit: 15,
        pointsMultiplier: 2,
        confidenceThreshold: 80
      }
    };
    this.hintsUsed = 0;
    this.totalHintsAvailable = 3;
    this.sentencePool = [];
    this.usedSentences = new Set();
    this.gameHistory = [];
    this.detector = null;
    this.analytics = null;
    this.isPlaying = false;
    this.timer = null;
    this.timeRemaining = 0;
    
    this.init();
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  /**
   * Initialize the game with dependencies
   */
  init() {
    // Detector will be set via setDetector()
    // Analytics will be set via setAnalytics()
    this.loadGameState();
  }

  /**
   * Set the grammar pattern detector
   */
  setDetector(detector) {
    this.detector = detector;
  }

  /**
   * Set the analytics engine
   */
  setAnalytics(analytics) {
    this.analytics = analytics;
  }

  /**
   * Load game state from localStorage
   */
  loadGameState() {
    try {
      const saved = localStorage.getItem('grammar_game_state');
      if (saved) {
        const data = JSON.parse(saved);
        this.score = data.score || 0;
        this.combo = data.combo || 0;
        this.maxCombo = data.maxCombo || 0;
        this.questionsAnswered = data.questionsAnswered || 0;
        this.correctAnswers = data.correctAnswers || 0;
        this.difficulty = data.difficulty || 'easy';
        this.gameHistory = data.gameHistory || [];
        this.usedSentences = new Set(data.usedSentences || []);
      }
    } catch (error) {
      console.warn('Failed to load game state:', error);
    }
  }

  /**
   * Save game state to localStorage
   */
  saveGameState() {
    try {
      const data = {
        score: this.score,
        combo: this.combo,
        maxCombo: this.maxCombo,
        questionsAnswered: this.questionsAnswered,
        correctAnswers: this.correctAnswers,
        difficulty: this.difficulty,
        gameHistory: this.gameHistory.slice(-100), // Keep last 100
        usedSentences: Array.from(this.usedSentences)
      };
      localStorage.setItem('grammar_game_state', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save game state:', error);
    }
  }

  // ============================================================
  // QUESTION GENERATION
  // ============================================================

  /**
   * Generate a new question
   * @param {Array} blockData - Optional block data to use
   * @returns {Object} Question object
   */
  generateQuestion(blockData = null) {
    const detector = this.detector;
    if (!detector) {
      throw new Error('Grammar pattern detector not set');
    }

    // Build sentence pool
    let sentences = [];
    if (blockData) {
      sentences = blockData.story.sentences;
    } else {
      // Use all blocks
      const allBlocks = window.appData?.blocks || [];
      allBlocks.forEach(block => {
        sentences = sentences.concat(block.story.sentences);
      });
    }

    // Filter out used sentences if needed
    const availableSentences = sentences.filter(s => 
      !this.usedSentences.has(s.japanese)
    );

    // If all sentences used, reset
    if (availableSentences.length === 0) {
      this.usedSentences.clear();
      return this.generateQuestion(blockData);
    }

    // Pick a random sentence
    const sentence = availableSentences[Math.floor(Math.random() * availableSentences.length)];
    
    // Analyze the sentence
    const matches = detector.analyzeSentence(sentence.japanese, sentence.tokens);
    
    // Filter matches by confidence threshold
    const threshold = this.difficultyLevels[this.difficulty].confidenceThreshold;
    const validMatches = matches.filter(m => m.confidence >= threshold);

    // If no matches found, try fallback
    if (validMatches.length === 0) {
      // Try with lower threshold
      const lowerThreshold = threshold - 20;
      const fallbackMatches = matches.filter(m => m.confidence >= lowerThreshold);
      
      if (fallbackMatches.length === 0) {
        // Skip this sentence and try again
        this.usedSentences.add(sentence.japanese);
        return this.generateQuestion(blockData);
      }
      
      return this.buildQuestion(sentence, fallbackMatches, blockData);
    }

    return this.buildQuestion(sentence, validMatches, blockData);
  }

  /**
   * Build a question object from a sentence and its matches
   */
  buildQuestion(sentence, matches, blockData) {
    // Pick the best match (highest confidence)
    const bestMatch = matches.reduce((a, b) => a.confidence > b.confidence ? a : b);
    const correctPattern = bestMatch.pattern;

    // Generate distractors
    const allPatterns = window.appData?.grammarPatterns || [];
    const distractors = this.generateDistractors(correctPattern, allPatterns);

    // Build options
    const options = this.shuffleArray([
      correctPattern,
      ...distractors
    ]);

    // Mark sentence as used
    this.usedSentences.add(sentence.japanese);

    const question = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      sentence: sentence,
      correctPattern: correctPattern,
      options: options,
      distractors: distractors,
      confidence: bestMatch.confidence,
      matches: matches,
      blockData: blockData,
      hints: this.generateHints(sentence, correctPattern, matches),
      timeLimit: this.difficultyLevels[this.difficulty].timeLimit,
      points: this.calculatePoints(bestMatch.confidence)
    };

    this.currentQuestion = question;
    return question;
  }

  /**
   * Generate distractors (wrong answers)
   */
  generateDistractors(correctPattern, allPatterns) {
    const count = this.difficultyLevels[this.difficulty].optionsCount - 1;
    const available = allPatterns.filter(p => p.id !== correctPattern.id);
    
    // Shuffle and pick distractors
    const shuffled = this.shuffleArray(available);
    const distractors = [];
    
    // Try to pick distractors that are plausible
    const similarPatterns = this.findSimilarPatterns(correctPattern, available);
    const priority = this.shuffleArray([...similarPatterns, ...shuffled]);
    
    for (const pattern of priority) {
      if (distractors.length >= count) break;
      if (!distractors.find(d => d.id === pattern.id)) {
        distractors.push(pattern);
      }
    }
    
    // If not enough distractors, fill with any remaining
    while (distractors.length < count) {
      const remaining = available.filter(p => !distractors.find(d => d.id === p.id));
      if (remaining.length === 0) break;
      distractors.push(remaining[0]);
    }
    
    return distractors;
  }

  /**
   * Find similar patterns (based on particles)
   */
  findSimilarPatterns(correctPattern, available) {
    return available.filter(p => {
      // Check if they share particles
      const sharedParticles = p.particles.filter(particle => 
        correctPattern.particles.includes(particle)
      );
      return sharedParticles.length > 0;
    });
  }

  /**
   * Generate hints for the question
   */
  generateHints(sentence, correctPattern, matches) {
    const hints = [];
    const particles = sentence.tokens ? 
      sentence.tokens.filter(t => ['は','が','を','に','で','へ','か'].includes(t.text))
        .map(t => t.text) :
      [];

    // Hint 1: Particle hint
    if (particles.length > 0) {
      hints.push({
        level: 1,
        text: `Look for particles: ${particles.join(', ')}`,
        reveal: true
      });
    }

    // Hint 2: Sentence ending hint
    const ending = this.getSentenceEnding(sentence.japanese);
    if (ending) {
      hints.push({
        level: 2,
        text: `The sentence ends with: "${ending}"`,
        reveal: true
      });
    }

    // Hint 3: Pattern type hint
    hints.push({
      level: 3,
      text: `Think about ${correctPattern.type.replace('_', ' ')} patterns`,
      reveal: true
    });

    // Hint 4: Example hint (only for medium/hard)
    if (this.difficulty !== 'easy') {
      hints.push({
        level: 4,
        text: `Hint: ${correctPattern.examples[0]?.japanese || ''}`,
        reveal: false
      });
    }

    return hints;
  }

  /**
   * Get sentence ending
   */
  getSentenceEnding(sentence) {
    const endings = ['です', 'だ', 'ます', 'る', 'た', 'ない', 'かった', 'か'];
    for (const ending of endings) {
      if (sentence.includes(ending)) {
        return ending;
      }
    }
    return null;
  }

  /**
   * Calculate points for a question
   */
  calculatePoints(confidence) {
    const basePoints = 10;
    const confidenceBonus = Math.floor(confidence / 10);
    const difficultyMultiplier = this.difficultyLevels[this.difficulty].pointsMultiplier;
    const comboBonus = Math.floor(this.combo / 3) * 2;
    
    return Math.round((basePoints + confidenceBonus + comboBonus) * difficultyMultiplier);
  }

  // ============================================================
  // GAME LOGIC
  // ============================================================

  /**
   * Submit an answer
   * @param {string} selectedPatternId - ID of the selected pattern
   * @param {number} timeSpent - Time spent in seconds
   * @returns {Object} Result object
   */
  submitAnswer(selectedPatternId, timeSpent = 0) {
    if (!this.currentQuestion) {
      throw new Error('No active question');
    }

    const question = this.currentQuestion;
    const isCorrect = selectedPatternId === question.correctPattern.id;
    
    // Update stats
    this.questionsAnswered++;
    if (isCorrect) {
      this.correctAnswers++;
      this.combo++;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }
      
      // Bonus for speed
      let speedBonus = 0;
      const timeLimit = question.timeLimit;
      if (timeSpent < timeLimit / 3) {
        speedBonus = 5;
      } else if (timeSpent < timeLimit / 2) {
        speedBonus = 3;
      }
      
      // Apply points with speed bonus
      const earnedPoints = question.points + speedBonus;
      this.score += earnedPoints;
      
      // Check for difficulty increase
      if (this.combo >= 5 && this.difficulty === 'easy') {
        this.difficulty = 'medium';
      } else if (this.combo >= 8 && this.difficulty === 'medium') {
        this.difficulty = 'hard';
      }
      
      // Record in analytics
      if (this.analytics) {
        this.analytics.recordAttempt(
          question.correctPattern.id,
          true,
          timeSpent
        );
      }
      
    } else {
      this.combo = 0;
      this.hintsUsed = 0;
      
      // Check for difficulty decrease
      if (this.difficulty === 'hard' && this.questionsAnswered > 5) {
        this.difficulty = 'medium';
      } else if (this.difficulty === 'medium' && this.questionsAnswered > 3) {
        this.difficulty = 'easy';
      }
      
      // Record in analytics
      if (this.analytics) {
        this.analytics.recordAttempt(
          selectedPatternId,
          false,
          timeSpent
        );
      }
    }

    // Record in game history
    this.gameHistory.push({
      timestamp: new Date().toISOString(),
      questionId: question.id,
      selectedPatternId: selectedPatternId,
      correctPatternId: question.correctPattern.id,
      isCorrect: isCorrect,
      timeSpent: timeSpent,
      difficulty: this.difficulty,
      score: this.score
    });

    // Save game state
    this.saveGameState();

    // Build result
    const result = {
      correct: isCorrect,
      selectedPattern: question.options.find(p => p.id === selectedPatternId),
      correctPattern: question.correctPattern,
      earnedPoints: isCorrect ? question.points : 0,
      score: this.score,
      combo: this.combo,
      difficulty: this.difficulty,
      timeSpent: timeSpent,
      feedback: this.getFeedback(isCorrect, question),
      details: this.getAnswerDetails(question, isCorrect)
    };

    this.currentQuestion = null;
    return result;
  }

  /**
   * Get feedback message
   */
  getFeedback(isCorrect, question) {
    if (isCorrect) {
      const messages = [
        '🎉 Perfect!',
        '⭐ Excellent!',
        '🌟 Amazing!',
        '👏 Great job!',
        '🎯 Nailed it!'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else {
      const messages = [
        '💪 Keep trying!',
        '📚 Study more!',
        '🤔 Think again!',
        '💡 Read carefully!'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  }

  /**
   * Get detailed answer information
   */
  getAnswerDetails(question, isCorrect) {
    const correct = question.correctPattern;
    return {
      patternName: correct.title,
      patternMeaning: correct.meaning,
      formula: correct.formula,
      example: correct.examples[0]?.japanese || '',
      explanation: correct.tips || ''
    };
  }

  /**
   * Use a hint
   * @returns {Object} Hint object
   */
  useHint() {
    if (!this.currentQuestion) {
      throw new Error('No active question');
    }

    const question = this.currentQuestion;
    const availableHints = question.hints.filter(h => !h.used);
    
    if (availableHints.length === 0) {
      return { message: 'No more hints available' };
    }

    const hint = availableHints[0];
    hint.used = true;
    this.hintsUsed++;
    
    return {
      hint: hint,
      remaining: availableHints.length - 1
    };
  }

  /**
   * Skip the current question
   */
  skipQuestion() {
    if (!this.currentQuestion) {
      throw new Error('No active question');
    }
    
    const question = this.currentQuestion;
    this.usedSentences.add(question.sentence.japanese);
    this.currentQuestion = null;
    this.combo = 0;
    
    this.saveGameState();
    
    return {
      skipped: true,
      correctPattern: question.correctPattern
    };
  }

  /**
   * Get game statistics
   */
  getStats() {
    const accuracy = this.questionsAnswered > 0 ? 
      Math.round((this.correctAnswers / this.questionsAnswered) * 100) : 0;
    
    return {
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      questionsAnswered: this.questionsAnswered,
      correctAnswers: this.correctAnswers,
      accuracy: accuracy,
      difficulty: this.difficulty,
      hintsUsed: this.hintsUsed,
      totalHintsAvailable: this.totalHintsAvailable
    };
  }

  /**
   * Get performance breakdown by pattern
   */
  getPatternPerformance() {
    const performance = {};
    
    this.gameHistory.forEach(entry => {
      const patternId = entry.correctPatternId;
      if (!performance[patternId]) {
        performance[patternId] = {
          attempts: 0,
          correct: 0,
          totalTime: 0
        };
      }
      
      performance[patternId].attempts++;
      if (entry.isCorrect) performance[patternId].correct++;
      performance[patternId].totalTime += entry.timeSpent || 0;
    });
    
    // Calculate averages and add pattern info
    const allPatterns = window.appData?.grammarPatterns || [];
    return Object.entries(performance).map(([patternId, data]) => ({
      patternId: patternId,
      pattern: allPatterns.find(p => p.id === patternId),
      attempts: data.attempts,
      correct: data.correct,
      accuracy: Math.round((data.correct / data.attempts) * 100),
      avgTime: Math.round(data.totalTime / data.attempts)
    })).filter(p => p.pattern);
  }

  // ============================================================
  // TIMER MANAGEMENT
  // ============================================================

  /**
   * Start the timer for the current question
   * @param {Function} onTick - Callback on each tick
   * @param {Function} onTimeout - Callback when time runs out
   */
  startTimer(onTick, onTimeout) {
    if (!this.currentQuestion) return;
    
    this.timeRemaining = this.currentQuestion.timeLimit;
    this.isPlaying = true;
    
    this.timer = setInterval(() => {
      this.timeRemaining--;
      
      if (onTick) {
        onTick(this.timeRemaining);
      }
      
      if (this.timeRemaining <= 0) {
        this.stopTimer();
        if (onTimeout) {
          onTimeout();
        }
      }
    }, 1000);
  }

  /**
   * Stop the timer
   */
  stopTimer() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================

  /**
   * Shuffle an array (Fisher-Yates)
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Reset the game
   */
  resetGame() {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;
    this.difficulty = 'easy';
    this.hintsUsed = 0;
    this.gameHistory = [];
    this.usedSentences.clear();
    this.currentQuestion = null;
    this.stopTimer();
    this.saveGameState();
  }

  /**
   * Get a summary of the game session
   */
  getSessionSummary() {
    const stats = this.getStats();
    const patternPerformance = this.getPatternPerformance();
    
    return {
      stats: stats,
      patternPerformance: patternPerformance,
      strongestPattern: patternPerformance
        .sort((a, b) => b.accuracy - a.accuracy)
        .slice(0, 3),
      weakestPattern: patternPerformance
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 3)
    };
  }
}

// ============================================================
// EXPORT
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GrammarGame;
}