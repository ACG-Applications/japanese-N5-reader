// ============================================================
// grammar-patterns.js - Grammar Pattern Detection Engine
// JLPT N5 Sentence Pattern Analyzer
// ============================================================

class GrammarPatternDetector {
  constructor() {
    // Reference to grammar patterns from data.js
    this.patterns = [];
    this.analysisCache = new Map();
    this.particlePatterns = this.initializeParticlePatterns();
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  /**
   * Load patterns from the data file
   * @param {Array} patterns - Array of grammar pattern objects from data.js
   */
  loadPatterns(patterns) {
    this.patterns = patterns;
    this.buildPatternIndex();
  }

  /**
   * Build search index for faster pattern matching
   */
  buildPatternIndex() {
    this.patternIndex = {
      byParticle: {},
      byKeyword: {},
      byEnding: {}
    };

    this.patterns.forEach(pattern => {
      // Index by particles
      pattern.particles.forEach(p => {
        if (!this.patternIndex.byParticle[p]) {
          this.patternIndex.byParticle[p] = [];
        }
        this.patternIndex.byParticle[p].push(pattern.id);
      });

      // Index by keywords
      const keywords = this.extractKeywords(pattern);
      keywords.forEach(keyword => {
        if (!this.patternIndex.byKeyword[keyword]) {
          this.patternIndex.byKeyword[keyword] = [];
        }
        this.patternIndex.byKeyword[keyword].push(pattern.id);
      });
    });
  }

  /**
   * Extract keywords from pattern examples and descriptions
   */
  extractKeywords(pattern) {
    const keywords = [];
    
    pattern.examples.forEach(ex => {
      const words = ex.japanese.split(/[\s、。、…]/);
      words.forEach(word => {
        if (word.length > 0) {
          keywords.push(word);
        }
      });
    });

    const formulaWords = pattern.formula.match(/[^\s\[\]]+/g) || [];
    formulaWords.forEach(word => {
      if (word.length > 1) {
        keywords.push(word);
      }
    });

    return keywords;
  }

  /**
   * Initialize particle-specific detection patterns
   */
  initializeParticlePatterns() {
    return {
      'は': {
        description: 'Topic marker',
        patterns: ['g1', 'g2', 'g4', 'g5', 'g8', 'g9']
      },
      'が': {
        description: 'Subject / emotion / ability marker',
        patterns: ['g3', 'g4', 'g5', 'g9']
      },
      'を': {
        description: 'Direct object marker',
        patterns: ['g2', 'g7', 'g8']
      },
      'に': {
        description: 'Location / time / destination marker',
        patterns: ['g3', 'g6', 'g8']
      },
      'で': {
        description: 'Location of action / means marker',
        patterns: ['g7']
      },
      'へ': {
        description: 'Direction marker',
        patterns: ['g6']
      },
      'か': {
        description: 'Question marker',
        patterns: ['g10']
      }
    };
  }

  // ============================================================
  // CORE ANALYSIS FUNCTIONS
  // ============================================================

  /**
   * Analyze a sentence and detect all matching grammar patterns
   * @param {string} sentence - Japanese sentence text
   * @param {Array} tokens - Optional token array for better analysis
   * @returns {Array} - Array of match objects with pattern info
   */
  analyzeSentence(sentence, tokens = null) {
    // Check cache first
    const cacheKey = sentence + (tokens ? JSON.stringify(tokens) : '');
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey);
    }

    const matches = [];
    const analyzedPatterns = new Set();

    // 1. Quick particle-based filtering
    const particles = this.extractParticles(sentence);
    const candidatePatterns = this.getCandidatePatterns(particles);

    // 2. Detailed analysis on candidates
    candidatePatterns.forEach(patternId => {
      const pattern = this.patterns.find(p => p.id === patternId);
      if (!pattern || analyzedPatterns.has(patternId)) return;

      const match = this.matchPattern(sentence, pattern, tokens);
      if (match) {
        matches.push(match);
        analyzedPatterns.add(patternId);
      }
    });

    // 3. If no matches found, try more lenient matching
    if (matches.length === 0) {
      const fallbackMatches = this.fallbackAnalysis(sentence);
      matches.push(...fallbackMatches);
    }

    // Cache results
    this.analysisCache.set(cacheKey, matches);

    return matches;
  }

  /**
   * Extract particles from a sentence
   */
  extractParticles(sentence) {
    const particles = ['は', 'が', 'を', 'に', 'で', 'へ', 'か', 'と', 'から', 'まで'];
    const found = [];
    particles.forEach(p => {
      if (sentence.includes(p)) {
        found.push(p);
      }
    });
    return found;
  }

  /**
   * Get candidate patterns based on particles present
   */
  getCandidatePatterns(particles) {
    const candidates = new Set();
    
    particles.forEach(p => {
      if (this.patternIndex.byParticle[p]) {
        this.patternIndex.byParticle[p].forEach(id => {
          candidates.add(id);
        });
      }
    });

    if (candidates.size === 0) {
      this.patterns.forEach(p => candidates.add(p.id));
    }

    return Array.from(candidates);
  }

  /**
   * Match a specific pattern against a sentence
   */
  matchPattern(sentence, pattern, tokens = null) {
    const score = this.calculateMatchScore(sentence, pattern, tokens);
    
    // Only return matches with confidence > 30% to avoid false positives
    if (score > 30) {
      return {
        pattern: pattern,
        patternId: pattern.id,
        confidence: score,
        matchedParts: this.extractMatchedParts(sentence, pattern, tokens),
        particles: this.extractParticles(sentence),
        sentence: sentence,
        explanation: this.generateExplanation(pattern, sentence)
      };
    }

    return null;
  }

  /**
   * Calculate match score for a pattern
   * Returns a score from 0-100
   */
  calculateMatchScore(sentence, pattern, tokens = null) {
    let score = 0;
    const totalChecks = 5;
    let passedChecks = 0;

    // Check 1: Particles match
    const sentenceParticles = this.extractParticles(sentence);
    const hasRequiredParticles = pattern.particles.every(p => sentenceParticles.includes(p));
    if (hasRequiredParticles) passedChecks++;

    // Check 2: Pattern-specific detection
    const patternSpecific = this.checkPatternSpecific(sentence, pattern);
    if (patternSpecific) passedChecks++;

    // Check 3: Keywords appear
    const hasKeywords = this.checkKeywords(sentence, pattern);
    if (hasKeywords) passedChecks++;

    // Check 4: Sentence ending matches
    const endingMatches = this.checkSentenceEnding(sentence, pattern);
    if (endingMatches) passedChecks++;

    // Check 5: Structure matches (if tokens available)
    if (tokens) {
      const structureMatches = this.checkStructure(tokens, pattern);
      if (structureMatches) passedChecks++;
    } else {
      passedChecks += 0.5;
    }

    // Calculate percentage
    score = (passedChecks / totalChecks) * 100;

    // Bonus: Exact match with formula
    if (this.exactFormulaMatch(sentence, pattern)) {
      score = Math.min(100, score + 20);
    }

    return Math.min(100, Math.round(score));
  }

  /**
   * Pattern-specific detection logic - FIXED
   */
  checkPatternSpecific(sentence, pattern) {
    switch(pattern.id) {
      case 'g1': // X は Y です / だ
        return (sentence.includes('です') || sentence.includes('だ')) && 
               sentence.includes('は') &&
               !sentence.includes('ます') &&
               !sentence.includes('ました');

      case 'g2': // X は Y を [V]ます / [V]る
        return sentence.includes('を') && 
               (sentence.includes('ます') || sentence.includes('る') || 
                sentence.includes('た') || sentence.includes('て')) &&
               !sentence.includes('あげます') && 
               !sentence.includes('あげる') &&
               !sentence.includes('くれます') &&
               !sentence.includes('くれる');

      case 'g3': // [場所] に [もの] が あります / います
        return (sentence.includes('あります') || sentence.includes('います') || 
                sentence.includes('ある') || sentence.includes('いる')) && 
               sentence.includes('に') && 
               sentence.includes('が');

      case 'g4': // X は Y が 好きです / だ
        return (sentence.includes('好き') || sentence.includes('嫌い')) && 
               sentence.includes('が') &&
               (sentence.includes('です') || sentence.includes('だ'));

      case 'g5': // X は Y が できます / できる
        return (sentence.includes('できます') || sentence.includes('できる')) && 
               sentence.includes('が');

      case 'g6': // [場所] へ / に 行きます / 来ます
        return (sentence.includes('行きます') || sentence.includes('来ます') || 
                sentence.includes('行く') || sentence.includes('来る')) && 
               (sentence.includes('へ') || sentence.includes('に'));

      case 'g7': // [場所/手段] で [動作] を します / する
        return (sentence.includes('で') && sentence.includes('を')) && 
               (sentence.includes('します') || sentence.includes('する') ||
                sentence.includes('ました') || sentence.includes('た'));

      case 'g8': // [Giver] は [Receiver] に [Thing] を あげます
        // CRITICAL FIX: Must contain a giving verb
        const hasGivingVerb = sentence.includes('あげます') || 
                              sentence.includes('あげる') || 
                              sentence.includes('くれます') || 
                              sentence.includes('くれる') ||
                              sentence.includes('もらいます') ||
                              sentence.includes('もらう');
        return hasGivingVerb && 
               sentence.includes('に') && 
               sentence.includes('を');

      case 'g9': // X は Y が 欲しいです / だ
        return (sentence.includes('欲しい') || sentence.includes('たい')) && 
               sentence.includes('が');

      case 'g10': // [Statement] + か
        return sentence.trim().endsWith('か');

      default:
        return false;
    }
  }

  /**
   * Check if keywords from pattern appear in sentence
   */
  checkKeywords(sentence, pattern) {
    const keywords = this.extractKeywords(pattern);
    const matches = keywords.filter(kw => sentence.includes(kw));
    return matches.length >= Math.min(2, keywords.length / 2);
  }

  /**
   * Check if sentence ending matches pattern
   */
  checkSentenceEnding(sentence, pattern) {
    const endings = {
      'g1': ['です', 'だ', 'でした', 'だった'],
      'g2': ['ます', 'る', 'ました', 'た'],
      'g3': ['あります', 'います', 'ある', 'いる'],
      'g4': ['好き', '嫌い'],
      'g5': ['できます', 'できる'],
      'g6': ['行きます', '来ます', '行く', '来る'],
      'g7': ['します', 'する', 'しました', 'した'],
      'g8': ['あげます', 'あげる', 'あげました', 'あげた'],
      'g9': ['欲しい', 'たい'],
      'g10': ['か']
    };

    const patternEndings = endings[pattern.id] || [];
    return patternEndings.some(ending => sentence.includes(ending));
  }

  /**
   * Check if token structure matches pattern
   */
  checkStructure(tokens, pattern) {
    const tokenTexts = tokens.map(t => t.text);
    const hasParticle = (p) => tokenTexts.includes(p);
    
    let score = 0;
    pattern.particles.forEach(p => {
      if (hasParticle(p)) score++;
    });

    return score >= pattern.particles.length * 0.5;
  }

  /**
   * Check if sentence exactly matches the formula pattern
   */
  exactFormulaMatch(sentence, pattern) {
    const formula = pattern.formula.replace(/[\[\]]/g, '').replace(/[X Y Z V]/g, '');
    const cleanedSentence = sentence.replace(/[\s、。、…]/g, '');
    return cleanedSentence.includes(formula.replace(/[\s、。、…]/g, ''));
  }

  /**
   * Extract the parts of the sentence that match the pattern
   */
  extractMatchedParts(sentence, pattern, tokens = null) {
    const parts = {
      full: sentence,
      particles: this.extractParticles(sentence),
      matchedPattern: pattern.id
    };

    if (tokens) {
      const tokenTexts = tokens.map(t => t.text);
      parts.tokens = tokenTexts;
      
      pattern.particles.forEach(p => {
        const index = tokenTexts.indexOf(p);
        if (index > -1) {
          const before = tokenTexts.slice(0, index).join('');
          const after = tokenTexts.slice(index + 1).join('');
          parts[`around_${p}`] = { before, after };
        }
      });
    }

    return parts;
  }

  /**
   * Generate explanation for the match
   */
  generateExplanation(pattern, sentence) {
    return {
      patternName: pattern.title,
      meaning: pattern.meaning,
      why: `This sentence contains particles: ${this.extractParticles(sentence).join(', ')}`,
      example: pattern.examples[0]?.japanese || '',
      usage: pattern.tips || ''
    };
  }

  // ============================================================
  // FALLBACK ANALYSIS
  // ============================================================

  /**
   * Fallback analysis for sentences with no clear pattern match
   */
  fallbackAnalysis(sentence) {
    const matches = [];
    const particles = this.extractParticles(sentence);

    if (sentence.includes('か') || sentence.trim().endsWith('か')) {
      const pattern = this.patterns.find(p => p.id === 'g10');
      if (pattern) {
        matches.push({
          pattern: pattern,
          patternId: 'g10',
          confidence: 60,
          matchedParts: { full: sentence, particles: particles },
          explanation: {
            patternName: pattern.title,
            meaning: pattern.meaning,
            why: 'Ends with question marker',
            example: pattern.examples[0]?.japanese || '',
            usage: pattern.tips || ''
          }
        });
      }
    }

    if (sentence.includes('あります') || sentence.includes('います')) {
      const pattern = this.patterns.find(p => p.id === 'g3');
      if (pattern && !matches.find(m => m.patternId === 'g3')) {
        matches.push({
          pattern: pattern,
          patternId: 'g3',
          confidence: 50,
          matchedParts: { full: sentence, particles: particles },
          explanation: {
            patternName: pattern.title,
            meaning: pattern.meaning,
            why: 'Contains existence verb',
            example: pattern.examples[0]?.japanese || '',
            usage: pattern.tips || ''
          }
        });
      }
    }

    return matches;
  }

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================

  /**
   * Get all patterns that appear in a text
   */
  getPatternsInText(text, tokensBySentence = null) {
    const allMatches = new Map();
    const sentences = text.split(/[。、\n]/).filter(s => s.trim().length > 0);

    sentences.forEach((sentence, index) => {
      const tokens = tokensBySentence && tokensBySentence[index] ? tokensBySentence[index] : null;
      const matches = this.analyzeSentence(sentence.trim(), tokens);
      
      matches.forEach(match => {
        if (!allMatches.has(match.patternId)) {
          allMatches.set(match.patternId, {
            pattern: match.pattern,
            count: 0,
            sentences: []
          });
        }
        const data = allMatches.get(match.patternId);
        data.count++;
        data.sentences.push({
          text: sentence.trim(),
          confidence: match.confidence
        });
      });
    });

    return Array.from(allMatches.values());
  }

  /**
   * Get grammar summary for a block
   */
  getBlockGrammarSummary(blockData) {
    const summary = {
      blockId: blockData.id,
      title: blockData.title,
      patternsFound: [],
      totalPatterns: 0,
      grammarFocus: blockData.grammarFocus || []
    };

    const allSentences = blockData.story.sentences.map(s => s.japanese);
    const allTokens = blockData.story.sentences.map(s => s.tokens || null);

    allSentences.forEach((sentence, index) => {
      const matches = this.analyzeSentence(sentence, allTokens[index] || null);
      
      matches.forEach(match => {
        const existing = summary.patternsFound.find(p => p.id === match.patternId);
        if (existing) {
          existing.count++;
          if (existing.confidence < match.confidence) {
            existing.confidence = match.confidence;
          }
        } else {
          summary.patternsFound.push({
            id: match.patternId,
            title: match.pattern.title,
            count: 1,
            confidence: match.confidence,
            description: match.pattern.meaning
          });
        }
      });
    });

    summary.totalPatterns = summary.patternsFound.length;
    return summary;
  }

  /**
   * Compare which patterns are missing from the block vs expected
   */
  getMissingPatterns(blockData) {
    const expected = blockData.grammarFocus || [];
    const summary = this.getBlockGrammarSummary(blockData);
    const found = summary.patternsFound.map(p => p.id);
    
    return expected.filter(id => !found.includes(id));
  }

  /**
   * Clear analysis cache
   */
  clearCache() {
    this.analysisCache.clear();
  }

  /**
   * Get statistics about pattern usage
   */
  getStatistics() {
    const stats = {
      totalPatterns: this.patterns.length,
      patternsWithExamples: 0,
      mostCommonParticles: {},
      patternUsage: {}
    };

    this.patterns.forEach(pattern => {
      stats.patternsWithExamples += pattern.examples.length > 0 ? 1 : 0;
      
      pattern.particles.forEach(p => {
        stats.mostCommonParticles[p] = (stats.mostCommonParticles[p] || 0) + 1;
      });
    });

    return stats;
  }
}

// ============================================================
// EXPORT
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GrammarPatternDetector;
}