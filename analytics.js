// ============================================================
// analytics.js - Learning Analytics & Pattern Mastery Tracking
// JLPT N5 Progress Tracker
// ============================================================

class LearningAnalytics {
  constructor() {
    this.storageKey = 'jlpt_n5_analytics';
    this.masteryData = {};
    this.sessionData = {
      startTime: null,
      questionsAttempted: 0,
      correctAnswers: 0,
      studyTime: 0,
      blocksCompleted: []
    };
    this.history = [];
    this.patternMasteryThresholds = {
      new: { attempts: 0, correct: 0 },
      learning: { attempts: 3, correct: 0.4 },
      practicing: { attempts: 5, correct: 0.6 },
      mastered: { attempts: 8, correct: 0.8 }
    };
    
    this.loadProgress();
    this.startSession();
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  /**
   * Load saved progress from localStorage
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        this.masteryData = data.masteryData || {};
        this.history = data.history || [];
        this.sessionData = data.sessionData || this.sessionData;
        this.initializeMissingPatterns();
      } else {
        this.initializeMasteryData();
      }
    } catch (error) {
      console.warn('Failed to load progress:', error);
      this.initializeMasteryData();
    }
  }

  /**
   * Initialize mastery data for all patterns
   */
  initializeMasteryData() {
    const patterns = window.appData ? window.appData.grammarPatterns : [];
    patterns.forEach(pattern => {
      if (!this.masteryData[pattern.id]) {
        this.masteryData[pattern.id] = {
          patternId: pattern.id,
          attempts: 0,
          correct: 0,
          lastAttempt: null,
          totalTime: 0,
          averageTime: 0,
          masteryLevel: 'new',
          firstSeen: new Date().toISOString(),
          lastSeen: null,
          strength: 0, // 0-100
          reviewHistory: []
        };
      }
    });
  }

  /**
   * Initialize patterns that might have been added later
   */
  initializeMissingPatterns() {
    const patterns = window.appData ? window.appData.grammarPatterns : [];
    patterns.forEach(pattern => {
      if (!this.masteryData[pattern.id]) {
        this.masteryData[pattern.id] = {
          patternId: pattern.id,
          attempts: 0,
          correct: 0,
          lastAttempt: null,
          totalTime: 0,
          averageTime: 0,
          masteryLevel: 'new',
          firstSeen: new Date().toISOString(),
          lastSeen: null,
          strength: 0,
          reviewHistory: []
        };
      }
    });
  }

  /**
   * Start a new study session
   */
  startSession() {
    this.sessionData.startTime = new Date();
    this.sessionData.questionsAttempted = 0;
    this.sessionData.correctAnswers = 0;
    this.sessionData.studyTime = 0;
    this.sessionData.blocksCompleted = [];
  }

  /**
   * Save current progress to localStorage
   */
  saveProgress() {
    try {
      const data = {
        masteryData: this.masteryData,
        history: this.history,
        sessionData: this.sessionData,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save progress:', error);
    }
  }

  // ============================================================
  // MASTERY TRACKING
  // ============================================================

  /**
   * Record a quiz attempt for a pattern
   * @param {string} patternId - ID of the grammar pattern
   * @param {boolean} correct - Whether the answer was correct
   * @param {number} timeSpent - Time spent in seconds
   */
  recordAttempt(patternId, correct, timeSpent = 0) {
    if (!this.masteryData[patternId]) {
      this.initializeMasteryData();
    }

    const data = this.masteryData[patternId];
    data.attempts++;
    if (correct) data.correct++;
    data.lastAttempt = new Date().toISOString();
    data.lastSeen = new Date().toISOString();
    data.totalTime += timeSpent;
    data.averageTime = data.totalTime / data.attempts;
    
    // Calculate strength (0-100)
    data.strength = this.calculateStrength(data);
    
    // Update mastery level
    data.masteryLevel = this.determineMasteryLevel(data);
    
    // Add to history
    this.history.push({
      timestamp: new Date().toISOString(),
      patternId: patternId,
      correct: correct,
      timeSpent: timeSpent,
      masteryLevel: data.masteryLevel
    });

    // Update session data
    this.sessionData.questionsAttempted++;
    if (correct) this.sessionData.correctAnswers++;

    // Save progress
    this.saveProgress();
  }

  /**
   * Record block completion
   * @param {number} blockId - ID of the completed block
   */
  recordBlockCompletion(blockId) {
    if (!this.sessionData.blocksCompleted.includes(blockId)) {
      this.sessionData.blocksCompleted.push(blockId);
      
      // Record block completion in history
      this.history.push({
        timestamp: new Date().toISOString(),
        type: 'block_completed',
        blockId: blockId
      });
      
      this.saveProgress();
    }
  }

  /**
   * Calculate strength score for a pattern (0-100)
   */
  calculateStrength(data) {
    if (data.attempts === 0) return 0;
    
    // Base score from correct rate
    const successRate = data.correct / data.attempts;
    const baseScore = successRate * 100;
    
    // Bonus for consistency (recent attempts matter more)
    const recentAttempts = data.reviewHistory.slice(-5);
    let recentBonus = 0;
    if (recentAttempts.length > 0) {
      const recentCorrect = recentAttempts.filter(a => a.correct).length;
      const recentRate = recentCorrect / recentAttempts.length;
      recentBonus = (recentRate - 0.5) * 20;
    }
    
    // Penalty for no recent practice
    let recencyPenalty = 0;
    if (data.lastSeen) {
      const daysSinceLastSeen = (new Date() - new Date(data.lastSeen)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastSeen > 7) {
        recencyPenalty = Math.min(20, daysSinceLastSeen * 2);
      }
    }
    
    // Combine scores
    let finalScore = baseScore + recentBonus - recencyPenalty;
    finalScore = Math.max(0, Math.min(100, finalScore));
    
    return Math.round(finalScore);
  }

  /**
   * Determine mastery level based on attempts and success rate
   */
  determineMasteryLevel(data) {
    const { attempts, correct, strength } = data;
    const rate = attempts > 0 ? correct / attempts : 0;
    
    if (attempts === 0) return 'new';
    if (attempts >= 8 && rate >= 0.8 && strength >= 70) return 'mastered';
    if (attempts >= 5 && rate >= 0.6 && strength >= 50) return 'practicing';
    if (attempts >= 3 && rate >= 0.4) return 'learning';
    return 'new';
  }

  /**
   * Get mastery data for a specific pattern
   */
  getPatternMastery(patternId) {
    return this.masteryData[patternId] || {
      attempts: 0,
      correct: 0,
      masteryLevel: 'new',
      strength: 0
    };
  }

  // ============================================================
  // ANALYTICS & INSIGHTS
  // ============================================================

  /**
   * Get overall learning statistics
   */
  getOverallStats() {
    const totalPatterns = Object.keys(this.masteryData).length;
    const patterns = Object.values(this.masteryData);
    const mastered = patterns.filter(p => p.masteryLevel === 'mastered');
    const learning = patterns.filter(p => p.masteryLevel === 'learning' || p.masteryLevel === 'practicing');
    const newPatterns = patterns.filter(p => p.masteryLevel === 'new');
    const totalAttempts = patterns.reduce((sum, p) => sum + p.attempts, 0);
    const totalCorrect = patterns.reduce((sum, p) => sum + p.correct, 0);
    
    const sessionDuration = this.sessionData.startTime ? 
      (new Date() - new Date(this.sessionData.startTime)) / (1000 * 60) : 0;

    return {
      totalPatterns,
      masteredCount: mastered.length,
      learningCount: learning.length,
      newCount: newPatterns.length,
      totalAttempts,
      totalCorrect,
      overallAccuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      blocksCompleted: this.sessionData.blocksCompleted.length,
      sessionMinutes: Math.round(sessionDuration),
      questionsAttempted: this.sessionData.questionsAttempted,
      sessionAccuracy: this.sessionData.questionsAttempted > 0 ? 
        Math.round((this.sessionData.correctAnswers / this.sessionData.questionsAttempted) * 100) : 0
    };
  }

  /**
   * Get weakest patterns (need review)
   * @param {number} limit - Max number to return
   */
  getWeakestPatterns(limit = 5) {
    const patterns = Object.values(this.masteryData)
      .filter(p => p.attempts > 0)
      .map(p => ({
        ...p,
        pattern: window.appData?.grammarPatterns?.find(g => g.id === p.patternId) || null,
        successRate: p.attempts > 0 ? Math.round((p.correct / p.attempts) * 100) : 0
      }))
      .filter(p => p.pattern !== null)
      .sort((a, b) => a.strength - b.strength || a.successRate - b.successRate)
      .slice(0, limit);

    return patterns;
  }

  /**
   * Get strongest patterns (already mastered)
   */
  getStrongestPatterns(limit = 5) {
    const patterns = Object.values(this.masteryData)
      .filter(p => p.attempts > 0)
      .map(p => ({
        ...p,
        pattern: window.appData?.grammarPatterns?.find(g => g.id === p.patternId) || null,
        successRate: p.attempts > 0 ? Math.round((p.correct / p.attempts) * 100) : 0
      }))
      .filter(p => p.pattern !== null)
      .sort((a, b) => b.strength - a.strength || b.successRate - a.successRate)
      .slice(0, limit);

    return patterns;
  }

  /**
   * Get patterns due for review (spaced repetition)
   * @param {number} limit - Max number to return
   */
  getDueForReview(limit = 10) {
    const now = new Date();
    const patterns = Object.values(this.masteryData)
      .filter(p => p.attempts > 0)
      .map(p => ({
        ...p,
        pattern: window.appData?.grammarPatterns?.find(g => g.id === p.patternId) || null,
        daysSinceLastSeen: p.lastSeen ? 
          (now - new Date(p.lastSeen)) / (1000 * 60 * 60 * 24) : 999,
        // Patterns with strength < 60 and not practiced recently
        priority: (100 - p.strength) + (p.lastSeen ? (new Date() - new Date(p.lastSeen)) / (1000 * 60 * 60 * 24) : 0)
      }))
      .filter(p => p.pattern !== null && p.strength < 70)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);

    return patterns;
  }

  /**
   * Get personalized recommendations
   */
  getRecommendations() {
    const stats = this.getOverallStats();
    const weak = this.getWeakestPatterns(3);
    const due = this.getDueForReview(3);
    
    const recommendations = [];
    
    // Case 1: No patterns studied yet
    if (stats.totalAttempts === 0) {
      recommendations.push({
        type: 'start',
        message: 'Start with Block 1 to begin your journey! 📚',
        action: 'Go to Block 1',
        priority: 'high'
      });
    }
    
    // Case 2: Weak patterns need review
    if (weak.length > 0) {
      recommendations.push({
        type: 'weak_patterns',
        message: `Focus on: ${weak.map(w => w.pattern?.shortTitle || w.patternId).join(', ')}`,
        action: 'Review Weak Patterns',
        priority: 'high',
        data: weak
      });
    }
    
    // Case 3: Patterns due for review
    if (due.length > 0) {
      recommendations.push({
        type: 'review_due',
        message: `${due.length} pattern(s) need review`,
        action: 'Start Review',
        priority: 'medium',
        data: due
      });
    }
    
    // Case 4: Next block recommendation
    const nextBlockId = this.sessionData.blocksCompleted.length + 1;
    if (nextBlockId <= 10) {
      recommendations.push({
        type: 'next_block',
        message: `Ready for Block ${nextBlockId}?`,
        action: `Go to Block ${nextBlockId}`,
        priority: 'medium',
        blockId: nextBlockId
      });
    }
    
    // Case 5: Achievement near completion
    if (stats.masteredCount >= 8 && stats.masteredCount < 10) {
      recommendations.push({
        type: 'achievement_near',
        message: `You've mastered ${stats.masteredCount}/10 patterns! Complete the rest! 🏆`,
        action: 'View Progress',
        priority: 'low'
      });
    }
    
    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return recommendations;
  }

  /**
   * Get learning trends (progress over time)
   * @param {number} days - Number of days to look back
   */
  getTrends(days = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const recentHistory = this.history
      .filter(h => new Date(h.timestamp) > cutoff)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    const trends = {
      daily: [],
      weekly: [],
      cumulative: []
    };
    
    // Daily breakdown
    const dailyData = {};
    recentHistory.forEach(h => {
      const date = h.timestamp.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { attempts: 0, correct: 0 };
      }
      dailyData[date].attempts++;
      if (h.correct) dailyData[date].correct++;
    });
    
    trends.daily = Object.entries(dailyData).map(([date, data]) => ({
      date,
      attempts: data.attempts,
      correct: data.correct,
      accuracy: data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : 0
    }));
    
    // Weekly breakdown
    const weeklyData = {};
    recentHistory.forEach(h => {
      const date = new Date(h.timestamp);
      const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      if (!weeklyData[week]) {
        weeklyData[week] = { attempts: 0, correct: 0 };
      }
      weeklyData[week].attempts++;
      if (h.correct) weeklyData[week].correct++;
    });
    
    trends.weekly = Object.entries(weeklyData).map(([week, data]) => ({
      week,
      attempts: data.attempts,
      correct: data.correct,
      accuracy: data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : 0
    }));
    
    // Cumulative progress
    let cumulativeCorrect = 0;
    let cumulativeAttempts = 0;
    trends.cumulative = recentHistory.map(h => {
      cumulativeAttempts++;
      if (h.correct) cumulativeCorrect++;
      return {
        timestamp: h.timestamp,
        cumulativeAttempts,
        cumulativeCorrect,
        cumulativeAccuracy: Math.round((cumulativeCorrect / cumulativeAttempts) * 100)
      };
    });
    
    return trends;
  }

  /**
   * Get progress by block
   */
  getBlockProgress(blockData) {
    const block = blockData;
    const detector = new GrammarPatternDetector();
    const summary = detector.getBlockGrammarSummary(block);
    
    return {
      blockId: block.id,
      title: block.title,
      totalPatterns: summary.totalPatterns,
      patternsFound: summary.patternsFound.map(p => ({
        ...p,
        mastery: this.getPatternMastery(p.id)
      })),
      completed: this.sessionData.blocksCompleted.includes(block.id),
      score: this.calculateBlockScore(block)
    };
  }

  /**
   * Calculate block score based on pattern mastery
   */
  calculateBlockScore(block) {
    const detector = new GrammarPatternDetector();
    const summary = detector.getBlockGrammarSummary(block);
    
    if (summary.patternsFound.length === 0) return 0;
    
    let totalScore = 0;
    summary.patternsFound.forEach(p => {
      const mastery = this.getPatternMastery(p.id);
      totalScore += mastery.strength || 0;
    });
    
    return Math.round(totalScore / summary.patternsFound.length);
  }

  /**
   * Get achievement status
   */
  getAchievements() {
    const stats = this.getOverallStats();
    const achievements = [];
    
    // First Read
    if (stats.blocksCompleted > 0) {
      achievements.push({
        id: 'first_read',
        title: '🎯 First Read',
        description: 'Completed your first block',
        unlocked: true,
        unlockedAt: this.history.find(h => h.type === 'block_completed')?.timestamp
      });
    }
    
    // Kanji Master
    if (stats.masteredCount >= 5) {
      achievements.push({
        id: 'kanji_master',
        title: '📚 Kanji Master',
        description: `Mastered ${stats.masteredCount} grammar patterns`,
        unlocked: true,
        progress: `${stats.masteredCount}/10`
      });
    }
    
    // Perfect Score
    if (stats.sessionAccuracy === 100 && stats.questionsAttempted >= 5) {
      achievements.push({
        id: 'perfect_score',
        title: '💯 Perfect Score',
        description: 'Got 100% on a session',
        unlocked: true,
        unlockedAt: new Date().toISOString()
      });
    }
    
    // Study Streak
    const streak = this.calculateStreak();
    if (streak >= 3) {
      achievements.push({
        id: 'streak',
        title: '🔥 Study Streak',
        description: `${streak} days of consistent study`,
        unlocked: true,
        progress: `${streak}/7`
      });
    }
    
    // All Patterns
    if (stats.masteredCount === stats.totalPatterns) {
      achievements.push({
        id: 'all_patterns',
        title: '👑 Grammar Master',
        description: 'Mastered all grammar patterns!',
        unlocked: true,
        unlockedAt: new Date().toISOString()
      });
    }
    
    return achievements;
  }

  /**
   * Calculate current study streak
   */
  calculateStreak() {
    const dates = this.history
      .filter(h => h.type !== 'block_completed')
      .map(h => h.timestamp.split('T')[0])
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    
    if (dates.length === 0) return 0;
    
    let streak = 1;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(dates[dates.length - 1]);
    
    // Check if last study was today or yesterday
    const daysSinceLastStudy = (new Date() - currentDate) / (1000 * 60 * 60 * 24);
    if (daysSinceLastStudy > 2) return 0;
    
    // Count backwards
    for (let i = dates.length - 2; i >= 0; i--) {
      const prevDate = new Date(dates[i]);
      const diff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
      if (diff <= 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }
    
    return streak;
  }

  /**
   * Reset all progress (with confirmation)
   */
  resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem(this.storageKey);
      this.masteryData = {};
      this.history = [];
      this.sessionData = {
        startTime: new Date(),
        questionsAttempted: 0,
        correctAnswers: 0,
        studyTime: 0,
        blocksCompleted: []
      };
      this.initializeMasteryData();
      this.saveProgress();
      return true;
    }
    return false;
  }

  /**
   * Export progress data as JSON
   */
  exportProgress() {
    return JSON.stringify({
      masteryData: this.masteryData,
      history: this.history,
      sessionData: this.sessionData,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }, null, 2);
  }

  /**
   * Import progress data from JSON
   */
  importProgress(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (data.masteryData && data.history) {
        this.masteryData = data.masteryData;
        this.history = data.history;
        this.sessionData = data.sessionData || this.sessionData;
        this.initializeMissingPatterns();
        this.saveProgress();
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Failed to import progress:', error);
      return false;
    }
  }

  // ============================================================
  // STUDY SESSION MANAGEMENT
  // ============================================================

  /**
   * Get next recommended study item
   */
  getNextStudyItem() {
    const recommendations = this.getRecommendations();
    
    // Return highest priority recommendation
    if (recommendations.length > 0) {
      return recommendations[0];
    }
    
    // Default: next block
    const nextBlockId = this.sessionData.blocksCompleted.length + 1;
    return {
      type: 'next_block',
      message: `Continue with Block ${nextBlockId}`,
      action: `Go to Block ${nextBlockId}`,
      priority: 'medium',
      blockId: nextBlockId
    };
  }

  /**
   * Get study session summary
   */
  getSessionSummary() {
    const duration = this.sessionData.startTime ? 
      Math.round((new Date() - new Date(this.sessionData.startTime)) / (1000 * 60)) : 0;
    
    return {
      duration: duration,
      questionsAnswered: this.sessionData.questionsAttempted,
      correctAnswers: this.sessionData.correctAnswers,
      accuracy: this.sessionData.questionsAttempted > 0 ? 
        Math.round((this.sessionData.correctAnswers / this.sessionData.questionsAttempted) * 100) : 0,
      blocksCompleted: this.sessionData.blocksCompleted.length,
      patternsPracticed: this.getPatternsPracticedInSession()
    };
  }

  /**
   * Get patterns practiced in the current session
   */
  getPatternsPracticedInSession() {
    const sessionStart = this.sessionData.startTime ? 
      new Date(this.sessionData.startTime) : new Date();
    
    const practiced = new Set();
    this.history
      .filter(h => new Date(h.timestamp) > sessionStart)
      .forEach(h => {
        if (h.patternId) practiced.add(h.patternId);
      });
    
    return Array.from(practiced);
  }
}

// ============================================================
// EXPORT
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LearningAnalytics;
}