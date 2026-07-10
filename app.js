// ============================================================
// app.js - Main Application Logic
// JLPT N5 Reading & Comprehension App
// ============================================================

class App {
  constructor() {
    // Core modules
    this.detector = null;
    this.analytics = null;
    this.game = null;

    // App state
    this.currentBlockId = 1;
    this.currentQuestionIndex = 0;
    this.settings = {
      showFurigana: true,
      showTranslation: false,
      showGrammar: false,
      ttsSpeed: 1.0,
      darkMode: false,
      fontSize: "medium",
    };
    this.isPlayingTTS = false;
    this.ttsHighlightIndex = -1;
    this.quizResults = [];
    this.blockScores = {};
    this.hintVisible = false;
    this.currentUtterance = null;
    this.quizAnswered = false;

    // DOM references
    this.elements = {};

    // Initialize
    this.init();
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  init() {
    if (typeof window.appData === "undefined" || !window.appData) {
      console.error("❌ appData not found! Check data.js loading.");
      this.showError("Data not loaded. Please refresh the page.");
      return;
    }

    console.log(
      "✅ appData found:",
      window.appData.blocks?.length || 0,
      "blocks",
    );

    this.loadSettings();
    this.initModules();
    this.initDOMReferences();
    this.initEventListeners();
    this.loadBlock(this.currentBlockId);
    this.applySettings();
    this.initTTS();

    console.log("🎌 JLPT N5 Reading App initialized");
    console.log(`📚 Loaded ${window.appData?.blocks?.length || 0} blocks`);
    console.log(
      `📖 ${window.appData?.grammarPatterns?.length || 0} grammar patterns available`,
    );
  }

  showError(message) {
    const container = document.getElementById("app");
    if (container) {
      container.innerHTML = `
        <div style="padding: 40px; text-align: center; font-family: sans-serif;">
          <h1 style="color: #e74c3c;">⚠️ Error</h1>
          <p>${message}</p>
          <p style="color: #666; font-size: 14px;">Check the console for more details.</p>
          <button onclick="location.reload()" style="padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
            🔄 Refresh
          </button>
        </div>
      `;
    }
  }

  initModules() {
    this.detector = new GrammarPatternDetector();
    if (window.appData && window.appData.grammarPatterns) {
      this.detector.loadPatterns(window.appData.grammarPatterns);
    }
    this.analytics = new LearningAnalytics();
    this.game = new GrammarGame();
    this.game.setDetector(this.detector);
    this.game.setAnalytics(this.analytics);
  }

  initDOMReferences() {
    this.elements = {
      app: document.getElementById("app"),
      storyContainer: document.getElementById("story-container"),
      quizContainer: document.getElementById("quiz-container"),
      grammarContainer: document.getElementById("grammar-container"),
      blockSelector: document.getElementById("block-selector"),
      furiganaToggle: document.getElementById("furigana-toggle"),
      translationToggle: document.getElementById("translation-toggle"),
      grammarToggle: document.getElementById("grammar-toggle"),
      ttsSpeed: document.getElementById("tts-speed"),
      darkModeToggle: document.getElementById("dark-mode-toggle"),
      ttsPlayBtn: document.getElementById("tts-play"),
      ttsStopBtn: document.getElementById("tts-stop"),
      ttsProgress: document.getElementById("tts-progress"),
      questionDisplay: document.getElementById("question-display"),
      optionsContainer: document.getElementById("options-container"),
      submitBtn: document.getElementById("submit-btn"),
      nextBtn: document.getElementById("next-btn"),
      hintBtn: document.getElementById("hint-btn"),
      feedbackArea: document.getElementById("feedback-area"),
      scoreDisplay: document.getElementById("score-display"),
      progressDisplay: document.getElementById("progress-display"),
      streakDisplay: document.getElementById("streak-display"),
      grammarList: document.getElementById("grammar-list"),
      modeSelector: document.getElementById("mode-selector"),
      gameContainer: document.getElementById("game-container"),
      kanjiList: document.getElementById("kanji-list"),
      controlsBar: document.getElementById("controls-bar"),
    };
  }

  initEventListeners() {
    if (this.elements.blockSelector) {
      this.elements.blockSelector.addEventListener("change", (e) => {
        this.loadBlock(parseInt(e.target.value));
      });
    }

    if (this.elements.furiganaToggle) {
      this.elements.furiganaToggle.addEventListener("change", (e) => {
        this.settings.showFurigana = e.target.checked;
        this.saveSettings();
        this.renderStory();
        this.renderQuiz();
        this.renderGrammar();
      });
    }

    if (this.elements.translationToggle) {
      this.elements.translationToggle.addEventListener("change", (e) => {
        this.settings.showTranslation = e.target.checked;
        this.saveSettings();
        this.renderStory();
        this.renderQuiz();
      });
    }

    if (this.elements.grammarToggle) {
      this.elements.grammarToggle.addEventListener("change", (e) => {
        this.settings.showGrammar = e.target.checked;
        this.saveSettings();
        this.renderStory();
        this.renderGrammar();
      });
    }

    if (this.elements.darkModeToggle) {
      this.elements.darkModeToggle.addEventListener("change", (e) => {
        this.settings.darkMode = e.target.checked;
        this.saveSettings();
        this.applySettings();
      });
    }

    if (this.elements.ttsSpeed) {
      this.elements.ttsSpeed.addEventListener("change", (e) => {
        this.settings.ttsSpeed = parseFloat(e.target.value);
        this.saveSettings();
      });
    }

    // TTS buttons - Play and Stop only
    if (this.elements.ttsPlayBtn) {
      this.elements.ttsPlayBtn.addEventListener("click", () => {
        this.toggleTTS();
      });
    }

    if (this.elements.ttsStopBtn) {
      this.elements.ttsStopBtn.addEventListener("click", () => {
        this.stopTTS();
      });
    }

    if (this.elements.submitBtn) {
      this.elements.submitBtn.addEventListener("click", () => {
        this.submitQuizAnswer();
      });
    }

    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener("click", () => {
        this.nextQuizQuestion();
      });
    }

    if (this.elements.hintBtn) {
      this.elements.hintBtn.addEventListener("click", () => {
        this.toggleHint();
      });
    }

    // Mode selector - FIXED
    if (this.elements.modeSelector) {
      this.elements.modeSelector.addEventListener("change", (e) => {
        console.log("🎮 Mode changed to:", e.target.value);
        this.switchMode(e.target.value);
      });
    }

    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });
  }

  // ============================================================
  // TTS - SIMPLIFIED: Play/Stop, NO Highlighting
  // ============================================================

  initTTS() {
    console.log("🔧 Initializing TTS...");

    if (!window.speechSynthesis) {
      console.warn("❌ Speech synthesis not supported in this browser.");
      alert(
        "Your browser does not support speech synthesis. Please use Chrome, Edge, or Safari.",
      );
      return;
    }

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log(`🗣️ Total voices available: ${voices.length}`);

      this.japaneseVoices = voices.filter((v) => v.lang.startsWith("ja"));
      console.log(`🗣️ Japanese voices: ${this.japaneseVoices.length}`);

      if (this.japaneseVoices.length > 0) {
        this.selectedVoice = this.japaneseVoices[0];
        console.log(
          `🎤 Selected voice: ${this.selectedVoice.name} (${this.selectedVoice.lang})`,
        );
      } else {
        console.warn("⚠️ No Japanese voices found. Using default voice.");
        if (voices.length > 0) {
          this.selectedVoice = voices[0];
        }
      }
    };

    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    }

    speechSynthesis.onvoiceschanged = loadVoices;

    this.currentUtterance = null;
    this.isPlayingTTS = false;
    this.ttsRetryCount = 0;

    console.log("✅ TTS initialized");
  }

  updateTTSButtons(isPlaying) {
    if (this.elements.ttsPlayBtn) {
      this.elements.ttsPlayBtn.textContent = isPlaying
        ? "⏹️ Playing..."
        : "🔊 Play Story";
      if (isPlaying) {
        this.elements.ttsPlayBtn.classList.add("playing");
        this.elements.ttsPlayBtn.disabled = true;
      } else {
        this.elements.ttsPlayBtn.classList.remove("playing");
        this.elements.ttsPlayBtn.disabled = false;
      }
    }
    if (this.elements.ttsSpeed) {
      this.elements.ttsSpeed.disabled = isPlaying;
    }
  }

  toggleTTS() {
    console.log("🔄 toggleTTS called, isPlaying:", this.isPlayingTTS);

    if (this.isPlayingTTS) {
      this.stopTTS();
    } else {
      this.playStoryTTS();
    }
  }

  playStoryTTS() {
    console.log("🔊 playStoryTTS called, isPlaying:", this.isPlayingTTS);

    if (this.isPlayingTTS) {
      console.log("Already playing, ignoring");
      return;
    }

    if (!this.currentBlockData) {
      console.warn("❌ No story to play");
      return;
    }

    const fullText = this.currentBlockData.story.fullJapanese;
    if (!fullText) {
      console.warn("❌ No text to speak");
      return;
    }

    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    // Cancel any lingering speech
    try {
      window.speechSynthesis.cancel();
      console.log("🔄 Cancelled previous speech");
    } catch (e) {
      // ignore
    }

    // Reset state
    this.isPlayingTTS = false;
    this.currentUtterance = null;

    // Update UI
    this.updateTTSButtons(true);

    if (this.elements.ttsProgress) {
      this.elements.ttsProgress.style.width = "0%";
    }

    console.log(`📝 Full text length: ${fullText.length} characters`);

    // Create utterance
    console.log("🗣️ Creating utterance...");
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "ja-JP";
    utterance.rate = this.settings.ttsSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    if (this.japaneseVoices && this.japaneseVoices.length > 0) {
      utterance.voice = this.japaneseVoices[0];
      console.log(`🎤 Using Japanese voice: ${this.japaneseVoices[0].name}`);
    } else {
      console.warn("⚠️ No Japanese voice found, using default voice");
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices[0];
      }
    }

    this.currentUtterance = utterance;

    // ---- PROGRESS TRACKING ONLY (no highlighting) ----
    utterance.onboundary = (event) => {
      if (event.name === "sentence" || event.name === "word") {
        const progress = Math.min(
          (event.charIndex / fullText.length) * 100,
          100,
        );
        if (this.elements.ttsProgress) {
          this.elements.ttsProgress.style.width = `${progress}%`;
        }
      }
    };

    // ---- END OF SPEECH ----
    utterance.onend = () => {
      console.log("✅ TTS playback ended naturally");
      this.isPlayingTTS = false;
      this.currentUtterance = null;
      this.updateTTSButtons(false);

      if (this.elements.ttsProgress) {
        this.elements.ttsProgress.style.width = "100%";
        setTimeout(() => {
          if (this.elements.ttsProgress) {
            this.elements.ttsProgress.style.width = "0%";
          }
        }, 500);
      }
    };

    // ---- ERROR HANDLING ----
    utterance.onerror = (event) => {
      console.error("❌ TTS error:", event.error);

      if (event.error === "interrupted") {
        console.log("TTS was interrupted (expected)");
        return;
      }

      if (event.error === "not-allowed") {
        console.error("❌ Speech synthesis not allowed!");
        alert(
          "Please click anywhere on the page first, then try playing again.",
        );
        this.stopTTS();
        return;
      }

      this.isPlayingTTS = false;
      this.currentUtterance = null;
      this.updateTTSButtons(false);

      if (this.elements.ttsProgress) {
        this.elements.ttsProgress.style.width = "0%";
      }
    };

    // ---- START SPEAKING ----
    try {
      console.log("🗣️ Calling speechSynthesis.speak()...");
      console.log(`   Text: "${fullText.substring(0, 60)}..."`);

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
        console.log("✅ speechSynthesis.speak() called");
      }, 50);

      this.isPlayingTTS = true;
      console.log("✅ TTS started successfully");
    } catch (e) {
      console.error("❌ Failed to start TTS:", e);
      this.isPlayingTTS = false;
      this.currentUtterance = null;
      this.updateTTSButtons(false);
    }
  }

  stopTTS() {
    console.log("⏹️ stopTTS called");

    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not available");
      this.isPlayingTTS = false;
      this.currentUtterance = null;
      this.updateTTSButtons(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      console.log("🔄 speechSynthesis.cancel() called");
    } catch (e) {
      console.warn("Error cancelling speech:", e);
    }

    this.isPlayingTTS = false;
    this.currentUtterance = null;
    this.ttsRetryCount = 0;

    this.updateTTSButtons(false);

    if (this.elements.ttsProgress) {
      this.elements.ttsProgress.style.width = "0%";
    }

    console.log("✅ TTS stopped");
  }

  // ============================================================
  // RENDER HELPERS - Using furigana.js
  // ============================================================

  renderWithFurigana(text) {
    const showFurigana = this.settings.showFurigana;

    if (!text) return "";

    if (showFurigana && typeof renderFurigana === "function") {
      return renderFurigana(text);
    }

    if (typeof stripFurigana === "function") {
      return stripFurigana(text);
    }

    return text.replace(/（[^（）]+）/g, "");
  }

  hasFurigana(text) {
    if (typeof hasFurigana === "function") {
      return hasFurigana(text);
    }
    return /（[^（）]+）/.test(text);
  }

  renderWithFuriganaFromTokens(tokens) {
    const showFurigana = this.settings.showFurigana;
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return "";
    }

    return tokens
      .map((token) => {
        if (token.furigana && showFurigana) {
          return `<ruby>${token.text}<rt>${token.furigana}</rt></ruby>`;
        }
        return token.text;
      })
      .join("");
  }

  // ============================================================
  // BLOCK LOADING & RENDERING
  // ============================================================

  loadBlock(blockId) {
    this.currentBlockId = blockId;
    this.currentBlockData = window.appData?.blocks?.find(
      (b) => b.id === blockId,
    );

    if (!this.currentBlockData) {
      console.error(`Block ${blockId} not found`);
      return;
    }

    // Reset quiz state when loading a new block
    this.quizResults = [];
    this.currentQuestionIndex = 0;
    this.quizAnswered = false;

    if (this.elements.blockSelector) {
      this.elements.blockSelector.value = blockId;
    }

    this.renderKanjiList();
    this.renderStory();
    this.renderQuiz();
    this.renderGrammar();
    this.updateProgress();
    this.updateStats();
  }

  renderKanjiList() {
    if (!this.elements.kanjiList || !this.currentBlockData) return;

    const kanjiHTML = this.currentBlockData.kanjiList
      .map((kanji) => {
        return `<span class="kanji-item" data-kanji="${kanji}">${kanji}</span>`;
      })
      .join("");

    this.elements.kanjiList.innerHTML = `
      <h3>Kanji in this block (${this.currentBlockData.kanjiList.length})</h3>
      <div class="kanji-grid">${kanjiHTML}</div>
    `;
  }

  renderStory() {
    if (!this.elements.storyContainer || !this.currentBlockData) return;

    const story = this.currentBlockData.story;
    const sentences = story.sentences || [];

    const storyHTML = sentences
      .map((sentence, index) => {
        const rendered = this.renderSentence(sentence, index);
        return `
        <div class="sentence-wrapper" data-sentence-index="${index}">
          ${rendered}
        </div>
      `;
      })
      .join("");

    this.elements.storyContainer.innerHTML = `
      <h2>${this.currentBlockData.title}</h2>
      <h3 class="subtitle">${this.currentBlockData.titleJapanese || ""}</h3>
      <div class="story-content">${storyHTML}</div>
      ${
        this.settings.showTranslation
          ? `
        <div class="full-translation">
          <h4>Full Translation</h4>
          <p>${story.fullTranslation || ""}</p>
        </div>
      `
          : ""
      }
    `;
  }

  renderSentence(sentence, index) {
    const showTranslation = this.settings.showTranslation;

    let japaneseHTML = "";
    const textWithFurigana = sentence.japaneseWithFurigana || sentence.japanese;
    japaneseHTML = this.renderWithFurigana(textWithFurigana);

    if (
      this.settings.showGrammar &&
      sentence.patternIds &&
      sentence.patternIds.length > 0
    ) {
      const patternClasses = sentence.patternIds
        .map((id) => `pattern-${id}`)
        .join(" ");
      japaneseHTML = `<span class="pattern-highlight ${patternClasses}">${japaneseHTML}</span>`;
    }

    return `
      <div class="sentence">
        <p class="japanese">${japaneseHTML}</p>
        ${showTranslation ? `<p class="translation">${sentence.translation || ""}</p>` : ""}
        ${
          this.settings.showGrammar && sentence.patternIds
            ? `
          <div class="sentence-patterns">
            <small>📘 Patterns: ${sentence.patternIds
              .map((id) => {
                const pattern = window.appData?.grammarPatterns?.find(
                  (p) => p.id === id,
                );
                return pattern ? pattern.shortTitle : id;
              })
              .join(", ")}</small>
          </div>
        `
            : ""
        }
      </div>
    `;
  }
  // ============================================================
  // HELP MODAL
  // ============================================================

  openHelp() {
    alert(
      "📖 JLPT N5 Reading & Comprehension\n\n" +
        "📚 Kenji's Tokyo School Days\n\n" +
        "How to use:\n" +
        "• Select a block from the dropdown\n" +
        "• Read the story with furigana support\n" +
        "• Toggle translations, grammar, and dark mode\n" +
        "• Answer comprehension questions\n" +
        "• Play the Grammar Detective game\n" +
        "• Track your progress in Review mode\n\n" +
        "Keyboard Shortcuts:\n" +
        "• 1-9 = Switch blocks\n" +
        "• Space = Play/Stop TTS\n" +
        "• F = Toggle Furigana\n" +
        "• T = Toggle Translation\n" +
        "• G = Toggle Grammar\n" +
        "• Enter = Submit answer\n" +
        "• H = Show hint\n\n" +
        "💥 Reset Everything = Clears ALL data!",
    );
  }

  // ============================================================
  // QUIZ
  // ============================================================

  renderQuiz() {
    if (!this.elements.quizContainer || !this.currentBlockData) return;

    const questions = this.currentBlockData.questions || [];

    if (questions.length === 0) {
      this.elements.quizContainer.innerHTML = `
        <div class="quiz-empty">
          <p>No questions available for this block.</p>
        </div>
      `;
      return;
    }

    if (this.currentQuestionIndex >= questions.length) {
      this.currentQuestionIndex = 0;
    }

    this.renderQuestion(this.currentQuestionIndex);
  }

  renderQuestion(index) {
    const questions = this.currentBlockData?.questions || [];
    if (index >= questions.length) {
      this.showQuizComplete();
      return;
    }

    const question = questions[index];
    this.currentQuestion = question;
    this.hintVisible = false;
    this.quizAnswered = false;

    let questionText = question.question;
    if (this.hasFurigana(question.question)) {
      questionText = this.renderWithFurigana(question.question);
    }

    const questionHTML = `
      <div class="question-header">
        <span class="question-number">Question ${index + 1} of ${questions.length}</span>
      </div>
      <div class="question-text">
        <p>${questionText}</p>
        ${this.settings.showTranslation ? `<p class="question-translation">${question.translation}</p>` : ""}
      </div>
    `;

    const options = this.buildOptions(question);

    this.elements.quizContainer.innerHTML = `
      <div class="quiz-section">
        <h3>📝 Comprehension Check</h3>
        <div class="question-display">${questionHTML}</div>
        <div class="options-container">${options}</div>
        <div class="quiz-actions">
          <button id="submit-btn" class="btn btn-primary">Check Answer</button>
          <button id="hint-btn" class="btn btn-secondary">💡 Hint</button>
          <button id="next-btn" class="btn btn-secondary" style="display:none;">Next Question →</button>
        </div>
        <div id="feedback-area" class="feedback-area"></div>
      </div>
    `;

    this.initDOMReferences();
    this.initEventListeners();

    this.quizFeedback = null;
  }

  buildOptions(question) {
    const allOptions = [
      {
        text: question.correct,
        isCorrect: true,
      },
    ];

    if (question.distractors && question.distractors.length > 0) {
      question.distractors.forEach((d) => {
        allOptions.push({
          text: d,
          isCorrect: false,
        });
      });
    }

    const shuffled = this.shuffleArray(allOptions);

    return shuffled
      .map((option, index) => {
        const optionId = `option-${index}`;

        let optionHTML = option.text;
        if (this.hasFurigana(option.text)) {
          optionHTML = this.renderWithFurigana(option.text);
        }

        return `
        <div class="option">
          <input type="radio" name="quiz-option" id="${optionId}" value="${option.text}">
          <label for="${optionId}">
            ${optionHTML}
          </label>
        </div>
      `;
      })
      .join("");
  }

  toggleHint() {
    if (!this.currentQuestion) return;

    const hint = this.currentQuestion.hint;
    const feedback = document.getElementById("feedback-area");
    const hintBtn = document.getElementById("hint-btn");

    if (!feedback) return;

    const isHintShowing = feedback.classList.contains("hint-visible");

    if (isHintShowing) {
      feedback.className = "feedback-area";
      feedback.innerHTML = "";
      feedback.style.display = "none";
      if (hintBtn) {
        hintBtn.textContent = "💡 Hint";
        hintBtn.classList.remove("hint-active");
      }
      this.hintVisible = false;
      return;
    }

    if (hint) {
      feedback.className = "feedback-area info hint-visible";
      feedback.style.display = "block";
      feedback.innerHTML = `<p>💡 Hint: ${hint}</p>`;
      if (hintBtn) {
        hintBtn.textContent = "🔽 Hide Hint";
        hintBtn.classList.add("hint-active");
      }
      this.hintVisible = true;
    } else {
      feedback.className = "feedback-area info";
      feedback.style.display = "block";
      feedback.innerHTML = `<p>No hint available for this question.</p>`;
      this.hintVisible = true;
    }
  }

  submitQuizAnswer() {
    if (this.quizAnswered) return;

    const selected = document.querySelector(
      'input[name="quiz-option"]:checked',
    );
    if (!selected) {
      this.showFeedback("Please select an answer.", "warning");
      return;
    }

    const selectedValue = selected.value;
    const question = this.currentQuestion;
    const isCorrect = selectedValue === question.correct;

    // Add result to quizResults array for scoring
    this.quizResults.push({
      questionId: question.id || this.currentQuestionIndex,
      selected: selectedValue,
      correct: isCorrect,
    });

    this.quizAnswered = true;
    this.quizFeedback = { selected: selectedValue, correct: isCorrect };

    if (this.analytics) {
      const patternIds = question.patternIds || [];
      patternIds.forEach((patternId) => {
        this.analytics.recordAttempt(patternId, isCorrect, 5);
      });
    }

    const feedback = document.getElementById("feedback-area");
    if (feedback) {
      feedback.className = "feedback-area";
      feedback.innerHTML = "";
      feedback.style.display = "none";
    }
    if (this.elements.hintBtn) {
      this.elements.hintBtn.textContent = "💡 Hint";
    }
    this.hintVisible = false;

    this.showFeedback(
      isCorrect
        ? "🎉 Correct!"
        : `❌ Incorrect. The answer is: ${question.correct}`,
      isCorrect ? "success" : "error",
    );

    document.querySelectorAll(".option").forEach((el) => {
      const input = el.querySelector("input");
      if (input) {
        if (input.value === question.correct) {
          el.classList.add("correct");
        } else if (input.value === selectedValue && !isCorrect) {
          el.classList.add("incorrect");
        }
      }
    });

    const nextBtn = document.getElementById("next-btn");
    if (nextBtn) {
      nextBtn.style.display = "inline-block";
    }

    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
    }
  }

  nextQuizQuestion() {
    const questions = this.currentBlockData?.questions || [];
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= questions.length) {
      this.showQuizComplete();
    } else {
      this.renderQuestion(this.currentQuestionIndex);
    }
  }

  showQuizComplete() {
    const total = this.currentBlockData?.questions?.length || 0;
    const correctCount = this.quizResults.filter((r) => r.correct).length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    if (this.analytics) {
      this.analytics.recordBlockCompletion(this.currentBlockId);
    }

    this.elements.quizContainer.innerHTML = `
      <div class="quiz-complete">
        <h3>🎊 Quiz Complete!</h3>
        <div class="quiz-score">
          <div class="score-circle">
            <span class="score-number">${percentage}%</span>
          </div>
          <p>You got ${correctCount} out of ${total} correct</p>
        </div>
        <div class="quiz-actions">
          <button class="btn btn-primary" onclick="app.loadBlock(${this.currentBlockId})">
            🔄 Try Again
          </button>
          <button class="btn btn-secondary" onclick="app.loadBlock(${this.currentBlockId + 1})">
            Next Block →
          </button>
        </div>
      </div>
    `;
  }

  showFeedback(message, type = "info") {
    const feedback = document.getElementById("feedback-area");
    if (feedback) {
      feedback.className = `feedback-area ${type}`;
      feedback.style.display = "block";
      feedback.innerHTML = `<p>${message}</p>`;
      this.hintVisible = false;
      if (this.elements.hintBtn) {
        this.elements.hintBtn.textContent = "💡 Hint";
      }
    }
  }

  // ============================================================
  // GRAMMAR
  // ============================================================

  renderGrammar() {
    if (!this.elements.grammarContainer || !this.currentBlockData) return;

    const grammarFocus = this.currentBlockData.grammar || [];
    const showGrammar = this.settings.showGrammar;

    if (!showGrammar || grammarFocus.length === 0) {
      this.elements.grammarContainer.style.display = "none";
      return;
    }

    this.elements.grammarContainer.style.display = "block";

    const grammarHTML = grammarFocus
      .map((item) => {
        const pattern = window.appData?.grammarPatterns?.find(
          (p) => p.id === item.patternId,
        );
        const mastery = this.analytics
          ? this.analytics.getPatternMastery(item.patternId)
          : null;
        const showFurigana = this.settings.showFurigana;

        const examplesHTML = (item.examples || [])
          .map((ex) => {
            let exampleText = ex;
            if (showFurigana && this.hasFurigana(ex)) {
              exampleText = this.renderWithFurigana(ex);
            }
            return `
              <div class="example">
                <span class="example-jp">${exampleText}</span>
              </div>
            `;
          })
          .join("");

        return `
        <div class="grammar-item ${mastery?.masteryLevel || "new"}">
          <div class="grammar-header">
            <span class="grammar-title">${pattern ? pattern.title : item.title || item.patternId}</span>
            <span class="grammar-level">${mastery?.masteryLevel || "New"}</span>
          </div>
          <p class="grammar-explanation">${item.explanation || pattern?.meaning || ""}</p>
          <div class="grammar-examples">
            ${examplesHTML}
          </div>
          ${pattern ? `<div class="grammar-tips">${pattern.tips || ""}</div>` : ""}
        </div>
      `;
      })
      .join("");

    this.elements.grammarContainer.innerHTML = `
      <h3>📘 Grammar Focus</h3>
      <p class="text-muted" style="font-size: var(--font-sm); margin-bottom: var(--spacing-md);">
        Grammar patterns used in this block's story.
      </p>
      <div class="grammar-list">${grammarHTML}</div>
    `;
  }

  // ============================================================
  // MODE SWITCHING - FIXED WITH REVIEW MODE
  // ============================================================

  switchMode(mode) {
    console.log("🔄 Switching mode to:", mode);

    const storyContainer = document.getElementById("story-container");
    const quizContainer = document.getElementById("quiz-container");
    const gameContainer = document.getElementById("game-container");
    const grammarContainer = document.getElementById("grammar-container");
    const progressDisplay = document.getElementById("progress-display");
    const statsDisplay = document.getElementById("score-display");

    // Hide ALL containers first
    if (storyContainer) storyContainer.style.display = "none";
    if (quizContainer) quizContainer.style.display = "none";
    if (gameContainer) {
      gameContainer.style.display = "none";
      gameContainer.classList.remove("active");
    }
    if (grammarContainer) grammarContainer.style.display = "none";
    if (progressDisplay) progressDisplay.style.display = "none";
    if (statsDisplay) statsDisplay.style.display = "none";

    // Update mode selector
    if (this.elements.modeSelector) {
      this.elements.modeSelector.value = mode;
    }

    switch (mode) {
      case "read":
        console.log("📖 Read & Quiz mode");
        if (storyContainer) storyContainer.style.display = "block";
        if (quizContainer) quizContainer.style.display = "block";
        if (grammarContainer) grammarContainer.style.display = "block";
        if (progressDisplay) progressDisplay.style.display = "block";
        if (statsDisplay) statsDisplay.style.display = "block";
        // Update stats
        this.updateStats();
        break;

      case "game":
        console.log("🎯 Grammar Detective mode");
        if (gameContainer) {
          gameContainer.style.display = "block";
          gameContainer.classList.add("active");
          // Start the game
          this.startGame();
        }
        break;

      case "review":
        console.log("📊 Review mode");
        if (storyContainer) storyContainer.style.display = "block";
        if (progressDisplay) progressDisplay.style.display = "block";
        if (statsDisplay) statsDisplay.style.display = "block";
        // Update stats with proper review data
        this.updateReviewStats();
        break;

      default:
        console.log("📖 Default: Read & Quiz mode");
        if (storyContainer) storyContainer.style.display = "block";
        if (quizContainer) quizContainer.style.display = "block";
        if (grammarContainer) grammarContainer.style.display = "block";
        if (progressDisplay) progressDisplay.style.display = "block";
        if (statsDisplay) statsDisplay.style.display = "block";
    }
  }

  // ============================================================
  // REVIEW MODE - Detailed Progress Display with Game Stats
  // ============================================================

  updateReviewStats() {
    if (!this.elements.scoreDisplay || !this.analytics) return;

    const stats = this.analytics.getOverallStats();
    const weakest = this.analytics.getWeakestPatterns(5);
    const strongest = this.analytics.getStrongestPatterns(5);
    const due = this.analytics.getDueForReview(5);
    const recommendations = this.analytics.getRecommendations();
    const achievements = this.analytics.getAchievements();

    // Get game stats if available
    let gameStats = { score: 0, combo: 0, maxCombo: 0, accuracy: 0 };
    if (this.game) {
      const gStats = this.game.getStats();
      gameStats = {
        score: gStats.score || 0,
        combo: gStats.combo || 0,
        maxCombo: gStats.maxCombo || 0,
        accuracy: gStats.accuracy || 0,
      };
    }

    // Build weak patterns HTML
    let weakHTML = "";
    if (weakest.length > 0) {
      weakHTML = `
        <div style="margin-top: var(--spacing-md);">
          <h4 style="color: #e74c3c; font-size: var(--font-sm);">🔴 Patterns Needing Review</h4>
          ${weakest
            .map(
              (w) => `
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--border-light); font-size: var(--font-sm);">
              <span>${w.pattern?.shortTitle || w.patternId}</span>
              <span style="color: ${w.strength < 40 ? "#e74c3c" : "#f39c12"}; font-weight: 600;">${w.strength}%</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    } else {
      weakHTML = `
        <div style="margin-top: var(--spacing-md); padding: var(--spacing-sm); background: var(--success-bg); border-radius: var(--radius-sm);">
          <p style="color: #155724; font-size: var(--font-sm);">✅ No weak patterns! Keep up the great work!</p>
        </div>
      `;
    }

    // Build strong patterns HTML
    let strongHTML = "";
    if (strongest.length > 0) {
      strongHTML = `
        <div style="margin-top: var(--spacing-md);">
          <h4 style="color: #27ae60; font-size: var(--font-sm);">🟢 Strong Patterns</h4>
          ${strongest
            .map(
              (s) => `
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--border-light); font-size: var(--font-sm);">
              <span>${s.pattern?.shortTitle || s.patternId}</span>
              <span style="color: #27ae60; font-weight: 600;">${s.strength}%</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    }

    // Build due for review HTML
    let dueHTML = "";
    if (due.length > 0) {
      dueHTML = `
        <div style="margin-top: var(--spacing-md);">
          <h4 style="color: #3498db; font-size: var(--font-sm);">📅 Due for Review</h4>
          ${due
            .map(
              (d) => `
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--border-light); font-size: var(--font-sm);">
              <span>${d.pattern?.shortTitle || d.patternId}</span>
              <span style="color: #3498db; font-weight: 600;">${Math.round(d.daysSinceLastSeen || 0)} days ago</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    }

    // Build achievements HTML
    let achievementHTML = "";
    if (achievements.length > 0) {
      achievementHTML = `
        <div style="margin-top: var(--spacing-md);">
          <h4 style="color: #f39c12; font-size: var(--font-sm);">🏆 Achievements</h4>
          ${achievements
            .map(
              (a) => `
            <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px solid var(--border-light); font-size: var(--font-sm);">
              <span>${a.title}</span>
              <span style="color: #666; font-size: var(--font-xs);">${a.description}</span>
              ${a.progress ? `<span style="margin-left: auto; color: #27ae60; font-weight: 600;">${a.progress}</span>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    }

    // Build recommendations HTML
    let recHTML = "";
    if (recommendations.length > 0) {
      recHTML = `
        <div style="margin-top: var(--spacing-md); padding: var(--spacing-md); background: var(--bg-card); border-radius: var(--radius-sm); border-left: 4px solid var(--info);">
          <h4 style="font-size: var(--font-sm); color: var(--text-secondary);">💡 Recommendations</h4>
          ${recommendations
            .slice(0, 3)
            .map(
              (rec) => `
            <div style="display: flex; align-items: center; gap: 8px; padding: var(--spacing-xs) 0; font-size: var(--font-sm);">
              <span class="rec-priority ${rec.priority}">${rec.priority}</span>
              <span>${rec.message}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    }

    // Calculate study streak
    const streak = this.analytics.calculateStreak();

    this.elements.scoreDisplay.innerHTML = `
      <h3 style="color: var(--accent); margin-bottom: var(--spacing-md);">📊 Review Dashboard</h3>

      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">${stats.masteredCount || 0}</span>
          <span class="stat-label">Patterns Mastered</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${stats.blocksCompleted || 0}/10</span>
          <span class="stat-label">Blocks Done</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${stats.overallAccuracy || 0}%</span>
          <span class="stat-label">Accuracy</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${streak || 0}🔥</span>
          <span class="stat-label">Study Streak</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${stats.sessionMinutes || 0}m</span>
          <span class="stat-label">Study Time</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${stats.questionsAttempted || 0}</span>
          <span class="stat-label">Questions Answered</span>
        </div>
      </div>

      <!-- Game Stats -->
      <div style="margin-top: var(--spacing-md);">
        <h4 style="color: #8b1a1a; font-size: var(--font-sm);">🎮 Grammar Detective Stats</h4>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-sm); margin-top: var(--spacing-xs);">
          <div style="text-align: center; padding: var(--spacing-xs); background: var(--bg-card); border-radius: var(--radius-sm);">
            <span style="display: block; font-size: var(--font-lg); font-weight: 700; color: var(--accent);">${gameStats.score}</span>
            <span style="font-size: var(--font-xs); color: var(--text-muted);">Score</span>
          </div>
          <div style="text-align: center; padding: var(--spacing-xs); background: var(--bg-card); border-radius: var(--radius-sm);">
            <span style="display: block; font-size: var(--font-lg); font-weight: 700; color: #f39c12;">${gameStats.combo}</span>
            <span style="font-size: var(--font-xs); color: var(--text-muted);">Current Combo</span>
          </div>
          <div style="text-align: center; padding: var(--spacing-xs); background: var(--bg-card); border-radius: var(--radius-sm);">
            <span style="display: block; font-size: var(--font-lg); font-weight: 700; color: #27ae60;">${gameStats.maxCombo}</span>
            <span style="font-size: var(--font-xs); color: var(--text-muted);">Max Combo</span>
          </div>
          <div style="text-align: center; padding: var(--spacing-xs); background: var(--bg-card); border-radius: var(--radius-sm);">
            <span style="display: block; font-size: var(--font-lg); font-weight: 700; color: #3498db;">${gameStats.accuracy}%</span>
            <span style="font-size: var(--font-xs); color: var(--text-muted);">Accuracy</span>
          </div>
        </div>
      </div>

      ${weakHTML}
      ${strongHTML}
      ${dueHTML}
      ${achievementHTML}
      ${recHTML}

      <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-md); border-top: 2px solid var(--border-light); display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
        <button class="btn btn-secondary btn-sm" onclick="app.analytics.exportProgress(); alert('📊 Progress exported to console. Press F12 to view.')" style="font-size: var(--font-xs);">
          📤 Export Progress
        </button>
        <button class="btn btn-secondary btn-sm" onclick="app.resetAll()" style="font-size: var(--font-xs); color: #e74c3c; border-color: #e74c3c;">
          💥 Reset All Data
        </button>
        <button class="btn btn-secondary btn-sm" onclick="app.switchMode('read')" style="font-size: var(--font-xs);">
          📖 Back to Reading
        </button>
        <button class="btn btn-secondary btn-sm" onclick="app.switchMode('game')" style="font-size: var(--font-xs);">
          🎮 Play Game
        </button>
      </div>
    `;
  }

  // ============================================================
  // GRAMMAR DETECTIVE GAME
  // ============================================================

  startGame() {
    console.log("🎮 Starting Grammar Detective Game...");

    if (!this.game) {
      console.error("❌ Game module not initialized");
      return;
    }

    if (!this.currentBlockData) {
      console.error("❌ No block data loaded");
      this.elements.gameContainer.innerHTML = `
        <div style="padding: 40px; text-align: center;">
          <p style="font-size: 20px;">📚</p>
          <p style="font-weight: 500; color: #e74c3c;">Please load a block first!</p>
          <p style="font-size: 14px; color: #888;">Select a block from the dropdown above.</p>
          <button class="btn btn-primary" onclick="app.loadBlock(app.currentBlockId || 1)">
            🔄 Load Block
          </button>
        </div>
      `;
      return;
    }

    try {
      const question = this.game.generateQuestion(this.currentBlockData);
      if (question) {
        this.renderGameQuestion(question);
        console.log("✅ Game question generated:", question.id);
      } else {
        console.error("❌ Failed to generate question");
        this.elements.gameContainer.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <p style="font-size: 20px;">🎮</p>
            <p style="font-weight: 500;">No more sentences available!</p>
            <p style="font-size: 14px; color: #888;">Try switching to a different block.</p>
            <button class="btn btn-secondary" onclick="app.game.usedSentences.clear(); app.startGame();">
              🔄 Reset Game
            </button>
            <button class="btn btn-secondary" onclick="app.switchMode('read')" style="margin-left: 8px;">
              📖 Back to Read
            </button>
          </div>
        `;
      }
    } catch (error) {
      console.error("❌ Game error:", error);
      this.elements.gameContainer.innerHTML = `
        <div style="padding: 40px; text-align: center;">
          <p style="font-size: 20px;">⚠️</p>
          <p style="font-weight: 500; color: #e74c3c;">Game error: ${error.message}</p>
          <button class="btn btn-primary" onclick="app.startGame()">
            🔄 Try Again
          </button>
          <button class="btn btn-secondary" onclick="app.switchMode('read')" style="margin-left: 8px;">
            📖 Back to Read
          </button>
        </div>
      `;
    }
  }

  renderGameQuestion(question) {
    if (!this.elements.gameContainer) return;

    const optionsHTML = question.options
      .map((option) => {
        return `
        <button class="game-option" data-pattern-id="${option.id}">
          <span class="option-title">${option.shortTitle || option.title}</span>
          <span class="option-meaning">${option.meaning}</span>
        </button>
      `;
      })
      .join("");

    this.elements.gameContainer.innerHTML = `
      <div class="game-header">
        <div class="game-stats">
          <span>Score: ${this.game.score}</span>
          <span>Combo: 🔥 ${this.game.combo}</span>
          <span>Difficulty: ${this.game.difficulty}</span>
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm" onclick="app.game.usedSentences.clear(); app.startGame();" style="font-size: 11px; padding: 3px 10px;">
            🔄 New
          </button>
          <button class="btn btn-secondary btn-sm" onclick="app.switchMode('read')" style="font-size: 11px; padding: 3px 10px;">
            📖 Back
          </button>
        </div>
      </div>
      <div class="game-question">
        <h3>🔍 Which grammar pattern is used?</h3>
        <div class="game-sentence">
          <p class="sentence-jp">${this.renderSentenceText(question.sentence)}</p>
          <p class="sentence-en">${question.sentence.translation}</p>
        </div>
        <div class="game-options">${optionsHTML}</div>
        <div class="game-actions">
          <button class="btn btn-secondary" id="game-hint-btn">💡 Hint</button>
          <button class="btn btn-secondary" id="game-skip-btn">⏭️ Skip</button>
        </div>
        <div id="game-feedback" class="feedback-area"></div>
      </div>
    `;

    document.querySelectorAll(".game-option").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const patternId = e.currentTarget.dataset.patternId;
        this.handleGameAnswer(patternId);
      });
    });

    document.getElementById("game-hint-btn")?.addEventListener("click", () => {
      this.handleGameHint();
    });

    document.getElementById("game-skip-btn")?.addEventListener("click", () => {
      this.handleGameSkip();
    });
  }

  renderSentenceText(sentence) {
    const textWithFurigana = sentence.japaneseWithFurigana || sentence.japanese;
    return this.renderWithFurigana(textWithFurigana);
  }

  handleGameAnswer(patternId) {
    const result = this.game.submitAnswer(patternId, 5);

    const feedback = document.getElementById("game-feedback");
    if (feedback) {
      feedback.className = `feedback-area ${result.correct ? "success" : "error"}`;
      feedback.innerHTML = `
        <p>${result.feedback}</p>
        <p>Pattern: ${result.correctPattern.shortTitle}</p>
        <p>${result.correctPattern.meaning}</p>
        ${!result.correct ? `<p>💡 ${result.correctPattern.tips || ""}</p>` : ""}
      `;
    }

    const stats = this.game.getStats();
    const statsEl = document.querySelector(".game-stats");
    if (statsEl) {
      statsEl.innerHTML = `
        <span>Score: ${stats.score}</span>
        <span>Combo: 🔥 ${stats.combo}</span>
        <span>Difficulty: ${stats.difficulty}</span>
      `;
    }

    document.querySelectorAll(".game-option").forEach((btn) => {
      btn.disabled = true;
    });

    setTimeout(() => {
      const nextQuestion = this.game.generateQuestion(this.currentBlockData);
      if (nextQuestion) {
        this.renderGameQuestion(nextQuestion);
      }
    }, 2000);
  }

  handleGameHint() {
    const hint = this.game.useHint();
    const feedback = document.getElementById("game-feedback");
    if (feedback) {
      feedback.className = "feedback-area info";
      feedback.innerHTML = `<p>💡 ${hint.hint.text}</p>`;
    }
  }

  handleGameSkip() {
    const result = this.game.skipQuestion();
    const nextQuestion = this.game.generateQuestion(this.currentBlockData);
    if (nextQuestion) {
      this.renderGameQuestion(nextQuestion);
    }
  }

  // ============================================================
  // PROGRESS & STATS
  // ============================================================

  updateProgress() {
    if (!this.elements.progressDisplay || !this.analytics) return;

    const stats = this.analytics.getOverallStats();
    const progress = {
      blocks: stats.blocksCompleted || 0,
      totalBlocks: 10,
      patterns: stats.masteredCount || 0,
      totalPatterns: stats.totalPatterns || 10,
      accuracy: stats.overallAccuracy || 0,
    };

    this.elements.progressDisplay.innerHTML = `
      <div class="progress-bars">
        <div class="progress-item">
          <label>Blocks Completed</label>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(progress.blocks / progress.totalBlocks) * 100}%"></div>
            <span>${progress.blocks}/${progress.totalBlocks}</span>
          </div>
        </div>
        <div class="progress-item">
          <label>Patterns Mastered</label>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(progress.patterns / progress.totalPatterns) * 100}%"></div>
            <span>${progress.patterns}/${progress.totalPatterns}</span>
          </div>
        </div>
        <div class="progress-item">
          <label>Overall Accuracy</label>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress.accuracy}%"></div>
            <span>${progress.accuracy}%</span>
          </div>
        </div>
      </div>
    `;
  }

  updateStats() {
    if (!this.elements.scoreDisplay || !this.analytics) return;

    const stats = this.analytics.getOverallStats();
    const recommendations = this.analytics.getRecommendations();

    this.elements.scoreDisplay.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">${stats.masteredCount || 0}</span>
          <span class="stat-label">Patterns Mastered</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${stats.blocksCompleted || 0}/10</span>
          <span class="stat-label">Blocks Done</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${stats.overallAccuracy || 0}%</span>
          <span class="stat-label">Accuracy</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${stats.sessionMinutes || 0}m</span>
          <span class="stat-label">Study Time</span>
        </div>
      </div>
      ${
        recommendations.length > 0
          ? `
        <div class="recommendations">
          <h4>💡 Recommendations</h4>
          ${recommendations
            .slice(0, 2)
            .map(
              (rec) => `
            <div class="recommendation-item">
              <span class="rec-priority ${rec.priority}">${rec.priority}</span>
              <span>${rec.message}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
    `;
  }

  // ============================================================
  // PRINT FULL STORY - With and Without Furigana
  // ============================================================

  printFullStory() {
    if (!this.currentBlockData) {
      alert("Please load a block first!");
      return;
    }

    const block = this.currentBlockData;
    const title = block.title;
    const titleJapanese = block.titleJapanese || "";

    // Get all sentences
    const sentences = block.story.sentences || [];

    // Build content
    let content = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title} - Full Story</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', 'Times New Roman', 'Noto Sans JP', serif;
                    background: white;
                    color: black;
                    line-height: 2.0;
                    padding: 60px 80px;
                    max-width: 900px;
                    margin: 0 auto;
                }
                h1 {
                    font-size: 28px;
                    text-align: center;
                    margin-bottom: 4px;
                    font-weight: 700;
                }
                .subtitle {
                    text-align: center;
                    font-size: 18px;
                    color: #4a4a4a;
                    margin-bottom: 8px;
                }
                .divider {
                    border-top: 2px solid #333;
                    margin: 30px 0 20px 0;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin-top: 30px;
                    margin-bottom: 12px;
                    color: #1a3a5a;
                }
                .sentence {
                    font-size: 17px;
                    margin-bottom: 6px;
                    padding-left: 4px;
                }
                .sentence-with-furigana {
                    font-size: 17px;
                    margin-bottom: 6px;
                    padding-left: 4px;
                    color: #000;
                }
                .sentence-with-furigana .furigana {
                    color: #8b1a1a;
                    font-size: 0.85em;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #ccc;
                    font-size: 14px;
                    color: #666;
                    font-style: italic;
                }
                .page-break {
                    page-break-after: always;
                }
                @media print {
                    body { padding: 40px; }
                    .page-break { page-break-after: always; }
                }
                @media (max-width: 600px) {
                    body { padding: 20px; }
                    h1 { font-size: 22px; }
                    .sentence { font-size: 15px; }
                }
            </style>
        </head>
        <body>
            <h1>📖 ${title}</h1>
            <p class="subtitle">${titleJapanese}</p>
            <p style="text-align: center; font-size: 14px; color: #888; margin-bottom: 20px;">
                Printed: ${new Date().toLocaleString()}
            </p>
    `;

    // ============================================================
    // SECTION 1: Story WITHOUT Furigana
    // ============================================================
    content += `
        <div class="section-title">📖 Story (No Furigana)</div>
    `;

    sentences.forEach((sentence, index) => {
      // Strip furigana from japaneseWithFurigana or use japanese
      let cleanText = sentence.japaneseWithFurigana || sentence.japanese;
      // Remove furigana markers: （...）
      cleanText = cleanText.replace(/（[^（）]+）/g, "");
      content += `<div class="sentence">${cleanText}</div>`;
    });

    // Add translation if available
    if (block.story.fullTranslation) {
      content += `
            <div style="margin-top: 16px; padding: 12px 16px; background: #f5f5f5; border-radius: 6px; border-left: 4px solid #4a7a9a;">
                <strong>Translation:</strong><br>
                ${block.story.fullTranslation}
            </div>
        `;
    }

    // ============================================================
    // SECTION 2: Story WITH Furigana
    // ============================================================
    content += `
        <div class="page-break"></div>
        <div class="section-title">📖 Story (With Furigana)</div>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
            ※ Furigana shown in <span style="color: #8b1a1a;">red parentheses</span>
        </p>
    `;

    sentences.forEach((sentence, index) => {
      let textWithFurigana = sentence.japaneseWithFurigana || sentence.japanese;
      // Keep furigana markers but style them
      // Convert （furigana） to styled span
      let displayText = textWithFurigana.replace(
        /（([^（）]+)）/g,
        '<span class="furigana">（$1）</span>',
      );
      content += `<div class="sentence-with-furigana">${displayText}</div>`;
    });

    // ============================================================
    // FOOTER
    // ============================================================
    content += `
            <div class="footer">
                The End — ${title}
            </div>
        </body>
        </html>
    `;

    // Open print window
    const printWindow = window.open("", "_blank", "width=900,height=800");
    if (!printWindow) {
      alert("Please allow pop-ups to print the story.");
      return;
    }

    printWindow.document.write(content);
    printWindow.document.close();

    printWindow.onload = function () {
      setTimeout(function () {
        printWindow.print();
      }, 500);
    };
  }

  // ============================================================
  // RESET ALL - Complete Reset
  // ============================================================

  resetAll() {
    // Double confirmation to prevent accidental reset
    if (
      !confirm(
        "⚠️ Are you sure you want to reset EVERYTHING?\n\nThis will:\n• Reset all progress (blocks, patterns, quiz scores)\n• Reset game scores and stats\n• Reset all settings to default\n\nThis cannot be undone!",
      )
    ) {
      return;
    }

    if (!confirm("🔄 Final confirmation: Reset all data?")) {
      return;
    }

    console.log("🔄 Resetting all data...");

    // 1. Reset analytics (progress)
    if (this.analytics) {
      this.analytics.resetProgress();
      // Re-initialize analytics data
      this.analytics.initializeMasteryData();
      this.analytics.startSession();
      this.analytics.saveProgress();
    }

    // 2. Reset game state
    if (this.game) {
      this.game.resetGame();
      this.game.usedSentences.clear();
    }

    // 3. Reset quiz state
    this.quizResults = [];
    this.currentQuestionIndex = 0;
    this.quizAnswered = false;
    this.quizFeedback = null;

    // 4. Reset settings to defaults
    this.settings = {
      showFurigana: true,
      showTranslation: false,
      showGrammar: false,
      ttsSpeed: 1.0,
      darkMode: false,
      fontSize: "medium",
    };
    this.saveSettings();
    this.applySettings();

    // 5. Reset TTS state
    this.stopTTS();

    // 6. Reset block scores
    this.blockScores = {};

    // 7. Reset answered questions cache
    if (typeof answeredQuestions !== "undefined") {
      answeredQuestions = {};
    }

    // 8. Clear localStorage (all app data)
    try {
      localStorage.removeItem("jlpt_n5_analytics");
      localStorage.removeItem("jlpt_app_settings");
      localStorage.removeItem("grammar_game_state");
      localStorage.removeItem("storyReaderProgress");
      localStorage.removeItem("storyReaderCurrentLesson");
      localStorage.removeItem("storyReaderWorkbookAnswers");
      localStorage.removeItem("storyReaderVisited");
      console.log("✅ localStorage cleared");
    } catch (e) {
      console.warn("Could not clear all localStorage items:", e);
    }

    // 9. Update UI
    this.updateProgress();
    this.updateStats();

    // 10. Reload current block to refresh all views
    const currentBlock = this.currentBlockId || 1;
    this.loadBlock(current);

    // 11. Show success message
    this.showToast("🔄 All data has been reset!", false);

    // 12. Update mode selector to Read mode
    if (this.elements.modeSelector) {
      this.elements.modeSelector.value = "read";
    }
    this.switchMode("read");

    console.log("✅ Reset complete!");
  }

  // ============================================================
  // TOAST NOTIFICATION
  // ============================================================

  showToast(message, isError = false) {
    // Check if toast element exists, create if not
    let toast = document.getElementById("reset-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "reset-toast";
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #333;
        color: white;
        padding: 14px 28px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 500;
        z-index: 2000;
        opacity: 0;
        transition: all 0.4s ease;
        max-width: 90%;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        pointer-events: none;
        font-family: 'Segoe UI', 'Helvetica Neue', 'Noto Sans JP', Arial, sans-serif;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.background = isError ? "#e74c3c" : "#27ae60";
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(100px)";
    }, 3000);
  }

  // ============================================================
  // SETTINGS MANAGEMENT
  // ============================================================

  loadSettings() {
    try {
      const saved = localStorage.getItem("jlpt_app_settings");
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn("Failed to load settings:", error);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem("jlpt_app_settings", JSON.stringify(this.settings));
    } catch (error) {
      console.warn("Failed to save settings:", error);
    }
  }

  applySettings() {
    if (this.settings.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    document.body.classList.remove("font-small", "font-medium", "font-large");
    document.body.classList.add(`font-${this.settings.fontSize || "medium"}`);
  }

  // ============================================================
  // KEYBOARD SHORTCUTS
  // ============================================================

  handleKeyboardShortcuts(e) {
    const shortcuts = {
      1: () => this.loadBlock(1),
      2: () => this.loadBlock(2),
      3: () => this.loadBlock(3),
      4: () => this.loadBlock(4),
      5: () => this.loadBlock(5),
      6: () => this.loadBlock(6),
      7: () => this.loadBlock(7),
      8: () => this.loadBlock(8),
      9: () => this.loadBlock(9),
      0: () => this.loadBlock(10),
      f: () => this.toggleFurigana(),
      t: () => this.toggleTranslation(),
      g: () => this.toggleGrammar(),
      " ": () => {
        e.preventDefault();
        this.toggleTTS();
      },
      Enter: () => {
        if (!this.quizAnswered) this.submitQuizAnswer();
      },
      h: () => this.toggleHint(),
      r: () => this.renderQuiz(),
    };

    if (shortcuts[e.key]) {
      shortcuts[e.key]();
    }
  }

  toggleFurigana() {
    this.settings.showFurigana = !this.settings.showFurigana;
    this.saveSettings();
    this.renderStory();
    this.renderQuiz();
    this.renderGrammar();
    if (this.elements.furiganaToggle) {
      this.elements.furiganaToggle.checked = this.settings.showFurigana;
    }
  }

  toggleTranslation() {
    this.settings.showTranslation = !this.settings.showTranslation;
    this.saveSettings();
    this.renderStory();
    this.renderQuiz();
    if (this.elements.translationToggle) {
      this.elements.translationToggle.checked = this.settings.showTranslation;
    }
  }

  toggleGrammar() {
    this.settings.showGrammar = !this.settings.showGrammar;
    this.saveSettings();
    this.renderStory();
    this.renderGrammar();
    if (this.elements.grammarToggle) {
      this.elements.grammarToggle.checked = this.settings.showGrammar;
    }
  }

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getCurrentBlock() {
    return this.currentBlockData;
  }

  getSettings() {
    return { ...this.settings };
  }

  // ============================================================
  // STICKY CONTROLS
  // ============================================================

  setupStickyControls() {
    const controlsBar =
      this.elements.controlsBar || document.querySelector(".controls-bar");
    if (!controlsBar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          controlsBar.classList.add("is-sticky");
        } else {
          controlsBar.classList.remove("is-sticky");
        }
      },
      {
        threshold: [0],
        rootMargin: "-1px 0px 0px 0px",
      },
    );

    const sentinel = document.createElement("div");
    sentinel.style.height = "1px";
    sentinel.style.position = "absolute";
    sentinel.style.top = "-1px";
    controlsBar.parentNode.insertBefore(sentinel, controlsBar);

    observer.observe(sentinel);
  }
}

// ============================================================
// Initialize app when DOM is ready
// ============================================================
let app = null;

document.addEventListener("DOMContentLoaded", () => {
  app = new App();
  window.app = app;

  setTimeout(() => {
    if (app && typeof app.setupStickyControls === "function") {
      app.setupStickyControls();
    }
  }, 100);
});

// ============================================================
// EXPORT
// ============================================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = App;
}