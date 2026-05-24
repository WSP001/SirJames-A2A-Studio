/**
 * Knight School Challenges - Web Implementation
 * Converted from Swift KnightSchoolModules (April 2025)
 * 
 * Source: C:\WSP001\OneDrive\Desktop\SirJames_Interactive_Bundle\Sources\KnightSchoolModules\
 * - KnightlyReadingRhythmChallenge.swift (449 lines)
 * - KnightlyListeningChallenge.swift (578 lines)
 * - KnightlyTypingChallenge.swift (556 lines)
 * - KnightlyMemoryPatternChallenge.swift (551 lines)
 *
 * Commons Good Compliance
 * - Cost: under $1 per chapter
 * - Attribution: AI systems credited
 * - Transparency: logged via telemetry
 * - Privacy: no PII stored
 * - Ethics: age-appropriate content (5-8 years)
 */

// ============================================================
// READING RHYTHM CHALLENGE
// From: KnightlyReadingRhythmChallenge.swift
// Purpose: Read-along with word highlighting, speed control
// ============================================================

class ReadingRhythmChallenge {
    constructor(options = {}) {
        this.story = options.story || ReadingRhythmChallenge.STORIES[0];
        this.words = this.story.text.split(' ');
        this.currentWordIndex = 0;
        this.isReading = false;
        this.isCompleted = false;
        this.readingSpeed = 1.0;
        this.elapsedTime = 0;
        this.startTime = null;
        this.timer = null;
        this.knightSchoolPoints = 0;
        this.virtuePoints = {};

        this.onWordChange = options.onWordChange || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onFeedback = options.onFeedback || (() => {});
    }

    static STORIES = [
        {
            title: 'The Brave Little Knight',
            theme: 'courage',
            difficulty: 1,
            text: 'Once there was a little knight who was very brave. He helped his friends when they were scared. His dog Claude was always by his side. Together they could do anything!',
            virtueAssociation: 'Courage',
            grampsIntro: "Here's a tale of bravery that reminds me of you, young Sir James!"
        },
        {
            title: 'The Kind Forest Friend',
            theme: 'kindness',
            difficulty: 1,
            text: 'In the magical forest lived many animals. A small deer found some food. He shared it with all his friends. They were so happy! Being kind makes everyone smile.',
            virtueAssociation: 'Kindness',
            grampsIntro: 'Listen well, lad. This story teaches us about sharing what we have.'
        },
        {
            title: 'The Truthful Dragon',
            theme: 'honesty',
            difficulty: 2,
            text: 'The little dragon had made a mistake. He had accidentally burned a flower. When asked what happened, he told the truth. Everyone was proud of his honesty. The flower grew back even prettier than before.',
            virtueAssociation: 'Honesty',
            grampsIntro: "Dragons and knights aren't so different when it comes to telling the truth, Sir James."
        }
    ];

    startReading() {
        if (this.isReading) return;
        this.isReading = true;
        this.isCompleted = false;
        this.currentWordIndex = 0;
        this.elapsedTime = 0;
        this.startTime = Date.now();

        this.onFeedback({
            gramps: this.story.grampsIntro,
            claude: 'Listen carefully, Sir James!'
        });

        this.timer = setInterval(() => {
            this.elapsedTime = (Date.now() - this.startTime) / 1000;
        }, 100);

        setTimeout(() => this._readNextWord(), 2000);
    }

    _readNextWord() {
        if (!this.isReading || this.currentWordIndex >= this.words.length) {
            if (this.currentWordIndex >= this.words.length) this._completeReading();
            return;
        }

        this.onWordChange({
            word: this.words[this.currentWordIndex],
            index: this.currentWordIndex,
            total: this.words.length
        });

        const word = this.words[this.currentWordIndex];
        const baseDelay = 300;
        const wordComplexity = (Math.min(word.length, 8) / 4.0) * 1000;
        const delay = (baseDelay + wordComplexity) / this.readingSpeed;

        this.currentWordIndex++;

        if (this.currentWordIndex < this.words.length) {
            setTimeout(() => this._readNextWord(), delay);
        } else {
            setTimeout(() => this._completeReading(), 1000);
        }
    }

    _completeReading() {
        this.isReading = false;
        this.isCompleted = true;
        clearInterval(this.timer);

        this.knightSchoolPoints = 5 + this.story.difficulty;
        this.virtuePoints[this.story.virtueAssociation] = 2;
        this.virtuePoints['Focus'] = 1;
        this.virtuePoints['Patience'] = 1;

        const claudeThoughts = {
            courage: "I felt braver just listening to you read that story!",
            kindness: "Your kind heart makes these words shine even brighter.",
            honesty: "Truth in words, truth in heart. That's my knight!"
        };

        this.onFeedback({
            gramps: 'Well read, young Sir James! The stories of old contain wisdom for the future.',
            claude: claudeThoughts[this.story.theme] || "You're becoming a true storyteller, Sir James!"
        });

        this.onComplete({
            knightSchoolPoints: this.knightSchoolPoints,
            virtuePoints: this.virtuePoints,
            elapsedTime: this.elapsedTime
        });
    }

    adjustSpeed(newSpeed) {
        this.readingSpeed = Math.max(0.5, Math.min(1.5, newSpeed));
    }

    reset() {
        this.isReading = false;
        this.isCompleted = false;
        this.currentWordIndex = 0;
        this.elapsedTime = 0;
        clearInterval(this.timer);
        this.timer = null;
        this.startTime = null;
    }

    static getStory(theme, difficulty = 1) {
        if (theme) {
            const match = this.STORIES.find(s => s.theme === theme && s.difficulty <= difficulty);
            if (match) return match;
        }
        return this.STORIES.find(s => s.difficulty <= difficulty) || this.STORIES[0];
    }
}


// ============================================================
// LISTENING CHALLENGE
// From: KnightlyListeningChallenge.swift
// Purpose: Sound sequence memory game
// ============================================================

class ListeningChallenge {
    constructor(options = {}) {
        this.difficulty = options.difficulty || 'easy';
        this.sounds = ListeningChallenge.SOUNDS;
        this.currentSequence = [];
        this.playerSequence = [];
        this.isPlaying = false;
        this.isCompleted = false;
        this.currentlyPlayingIndex = null;
        this.attemptsCount = 0;
        this.knightSchoolPoints = 0;
        this.virtuePoints = {};

        this.onSequencePlay = options.onSequencePlay || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onFeedback = options.onFeedback || (() => {});
        this.onSoundPlay = options.onSoundPlay || (() => {});
    }

    static DIFFICULTIES = { easy: 2, medium: 3, hard: 4 };

    static SOUNDS = [
        { name: 'Wind', file: 'wind.mp3', icon: 'wind', color: '#3b82f6', category: 'nature' },
        { name: 'River', file: 'river.mp3', icon: 'water', color: '#06b6d4', category: 'nature' },
        { name: 'Rain', file: 'rain.mp3', icon: 'cloud-rain', color: '#6b7280', category: 'nature' },
        { name: 'Fire', file: 'fire.mp3', icon: 'flame', color: '#f97316', category: 'nature' },
        { name: 'Wolf', file: 'wolf.mp3', icon: 'moon', color: '#6b7280', category: 'animals' },
        { name: 'Bird', file: 'bird.mp3', icon: 'feather', color: '#ef4444', category: 'animals' },
        { name: 'Cricket', file: 'cricket.mp3', icon: 'bug', color: '#22c55e', category: 'animals' },
        { name: 'Frog', file: 'frog.mp3', icon: 'droplet', color: '#22c55e', category: 'animals' },
        { name: 'Sword', file: 'sword.mp3', icon: 'shield', color: '#6b7280', category: 'knight' },
        { name: 'Armor', file: 'armor.mp3', icon: 'user', color: '#9ca3af', category: 'knight' },
        { name: 'Horn', file: 'horn.mp3', icon: 'volume-2', color: '#eab308', category: 'knight' },
        { name: 'Horse', file: 'horse.mp3', icon: 'zap', color: '#92400e', category: 'knight' },
        { name: 'Spell', file: 'spell.mp3', icon: 'sparkles', color: '#a855f7', category: 'magic' },
        { name: 'Crystal', file: 'crystal.mp3', icon: 'diamond', color: '#14b8a6', category: 'magic' },
        { name: 'Portal', file: 'portal.mp3', icon: 'loader', color: '#6366f1', category: 'magic' },
        { name: 'Potion', file: 'potion.mp3', icon: 'flask-conical', color: '#22c55e', category: 'magic' }
    ];

    get sequenceLength() {
        return ListeningChallenge.DIFFICULTIES[this.difficulty] || 2;
    }

    startChallenge() {
        this.currentSequence = [];
        this.playerSequence = [];
        this.isPlaying = false;
        this.isCompleted = false;
        this.currentlyPlayingIndex = null;
        this.attemptsCount = 0;

        this._generateSequence();

        this.onFeedback({
            whindle: 'Listen carefully to the sounds in order.',
            claude: "I'm all ears!"
        });

        setTimeout(() => this.playSequence(), 1000);
    }

    _generateSequence() {
        const available = [...this.sounds];
        this.currentSequence = [];
        for (let i = 0; i < this.sequenceLength; i++) {
            const idx = Math.floor(Math.random() * available.length);
            this.currentSequence.push(available[idx]);
            if (this.difficulty !== 'hard') available.splice(idx, 1);
        }
    }

    playSequence() {
        if (this.currentSequence.length === 0 || this.isPlaying) return;
        this.isPlaying = true;
        this.playerSequence = [];
        this._playNextSound(0);
    }

    _playNextSound(index) {
        if (index >= this.currentSequence.length) {
            setTimeout(() => {
                this.isPlaying = false;
                this.currentlyPlayingIndex = null;
                this.onFeedback({ claude: 'Your turn! What did you hear?' });
                this.onSequencePlay({ done: true });
            }, 500);
            return;
        }

        this.currentlyPlayingIndex = index;
        const sound = this.currentSequence[index];
        this.onSoundPlay({ sound, index, total: this.currentSequence.length });

        setTimeout(() => {
            this.currentlyPlayingIndex = null;
            setTimeout(() => this._playNextSound(index + 1), 500);
        }, 1500);
    }

    selectSound(sound) {
        if (this.isPlaying || this.isCompleted) return;

        this.playerSequence.push(sound);
        const currentIndex = this.playerSequence.length - 1;
        const isCorrect = currentIndex < this.currentSequence.length &&
            this.playerSequence[currentIndex].name === this.currentSequence[currentIndex].name;

        if (isCorrect) {
            if (this.playerSequence.length === this.currentSequence.length) {
                this._handleSuccess();
            } else {
                this.onFeedback({ claude: "Good! What's next?" });
            }
            return true;
        } else {
            this._handleIncorrect();
            return false;
        }
    }

    _handleSuccess() {
        this.isCompleted = true;
        const basePoints = ListeningChallenge.DIFFICULTIES[this.difficulty] || 2;
        const attemptBonus = Math.max(0, 3 - this.attemptsCount);
        this.knightSchoolPoints = basePoints + attemptBonus;
        this.virtuePoints = { Listening: basePoints, Memory: attemptBonus };

        this.onFeedback({
            claude: "Amazing listening, Sir James! That's how a true knight hears!",
            whindle: "Whooo listens well learns the forest's secrets."
        });

        this.onComplete({
            knightSchoolPoints: this.knightSchoolPoints,
            virtuePoints: this.virtuePoints,
            attempts: this.attemptsCount
        });
    }

    _handleIncorrect() {
        this.attemptsCount++;
        this.onFeedback({ claude: "Hmm, that doesn't sound right. Try again!" });
        this.playerSequence = [];

        if (this.attemptsCount >= 2) {
            this.onFeedback({ whindle: 'Remember, start with the first sound and build from there.' });
        }
        if (this.attemptsCount >= 3) {
            setTimeout(() => this.playSequence(), 1000);
        }
    }

    replaySequence() {
        if (this.isPlaying || this.isCompleted) return;
        this.playerSequence = [];
        this.playSequence();
    }
}


// ============================================================
// TYPING CHALLENGE
// From: KnightlyTypingChallenge.swift
// Purpose: Letter-by-letter word spelling with finger guides
// ============================================================

class TypingChallenge {
    constructor(options = {}) {
        this.challenge = options.word || TypingChallenge.getWord(options.virtue, options.theme, options.difficulty);
        this.currentIndex = 0;
        this.completedIndices = [];
        this.incorrectAttempts = {};
        this.isCompleted = false;
        this.knightSchoolPoints = 0;
        this.virtuePoints = {};
        this.showFingerGuide = options.showFingerGuide !== false;

        this.onKeyResult = options.onKeyResult || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onFeedback = options.onFeedback || (() => {});
    }

    static BEGINNER_WORDS = [
        { word: 'ECHO', difficulty: 1, virtue: 'listening', theme: 'magic' },
        { word: 'BRAVE', difficulty: 1, virtue: 'courage', theme: 'knight' },
        { word: 'KIND', difficulty: 1, virtue: 'kindness', theme: 'values' },
        { word: 'TRUST', difficulty: 2, virtue: 'trust', theme: 'bridge' },
        { word: 'MAGIC', difficulty: 2, virtue: 'wonder', theme: 'magic' }
    ];

    static THEMATIC_WORDS = [
        { word: 'CLAUDE', difficulty: 2, virtue: 'loyalty', theme: 'companion' },
        { word: 'GRAMPS', difficulty: 2, virtue: 'wisdom', theme: 'mentor' },
        { word: 'SCROLL', difficulty: 3, virtue: 'knowledge', theme: 'artifact' },
        { word: 'KNIGHT', difficulty: 2, virtue: 'honor', theme: 'knight' },
        { word: 'FOREST', difficulty: 3, virtue: 'nature', theme: 'adventure' }
    ];

    static FINGER_MAP = {
        'q': 'Left Pinky', 'a': 'Left Pinky', 'z': 'Left Pinky',
        'w': 'Left Ring', 's': 'Left Ring', 'x': 'Left Ring',
        'e': 'Left Middle', 'd': 'Left Middle', 'c': 'Left Middle',
        'r': 'Left Index', 'f': 'Left Index', 'v': 'Left Index',
        't': 'Left Index', 'g': 'Left Index', 'b': 'Left Index',
        'y': 'Right Index', 'h': 'Right Index', 'n': 'Right Index',
        'u': 'Right Middle', 'j': 'Right Middle', 'm': 'Right Middle',
        'i': 'Right Ring', 'k': 'Right Ring',
        'o': 'Right Pinky', 'l': 'Right Pinky', 'p': 'Right Pinky'
    };

    static getWord(virtue, theme, difficulty = 1) {
        const allWords = [...TypingChallenge.BEGINNER_WORDS, ...TypingChallenge.THEMATIC_WORDS];
        let filtered = allWords;
        if (virtue) filtered = filtered.filter(w => w.virtue === virtue);
        if (theme) filtered = filtered.filter(w => w.theme === theme);
        filtered = filtered.filter(w => w.difficulty <= (difficulty || 1));
        if (filtered.length === 0) filtered = TypingChallenge.BEGINNER_WORDS;
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    processKeyPress(key) {
        if (this.isCompleted || this.currentIndex >= this.challenge.word.length) return;

        const targetChar = this.challenge.word[this.currentIndex];
        if (key.toUpperCase() === targetChar.toUpperCase()) {
            this._handleCorrect();
        } else {
            this._handleIncorrect();
        }
    }

    _handleCorrect() {
        this.completedIndices.push(this.currentIndex);
        this.knightSchoolPoints += 1;
        this.currentIndex++;

        this.onKeyResult({ correct: true, index: this.currentIndex - 1 });

        if (this.currentIndex >= this.challenge.word.length) {
            this._completeChallenge();
        }
    }

    _handleIncorrect() {
        this.incorrectAttempts[this.currentIndex] = (this.incorrectAttempts[this.currentIndex] || 0) + 1;
        this.onKeyResult({ correct: false, index: this.currentIndex });

        if ((this.incorrectAttempts[this.currentIndex] || 0) > 2) {
            this.onFeedback({ gramps: 'Remember, each finger has its special job.' });
        }
    }

    _completeChallenge() {
        this.isCompleted = true;
        const totalErrors = Object.values(this.incorrectAttempts).reduce((a, b) => a + b, 0);
        const perfectScore = totalErrors === 0;

        if (this.challenge.virtue) {
            this.virtuePoints[this.challenge.virtue] = perfectScore ? 3 : 1;
        }
        this.knightSchoolPoints += perfectScore ? 5 : 2;

        this.onFeedback({
            claude: 'My knight is becoming a master of the magical letters!',
            gramps: perfectScore
                ? 'The extra mile makes a knight worthy of legend!'
                : 'Such dedication! The Knight School records your triumph!'
        });

        this.onComplete({
            knightSchoolPoints: this.knightSchoolPoints,
            virtuePoints: this.virtuePoints,
            perfectScore,
            totalErrors
        });
    }

    getFingerForKey(key) {
        return TypingChallenge.FINGER_MAP[key.toLowerCase()] || null;
    }

    getHintText() {
        if (this.isCompleted) return "Challenge complete! You've gone the extra mile!";
        const totalErrors = Object.values(this.incorrectAttempts).reduce((a, b) => a + b, 0);
        if (totalErrors === 0) return "You're doing great! Keep using the right fingers!";
        if (totalErrors < 3) return 'Remember: each finger has its own special keys!';
        return 'Watch the colored fingers to see which one to use.';
    }

    getClaudeThought() {
        if (this.isCompleted) return 'My knight is becoming a master of the magical letters!';
        const progress = `${this.currentIndex}/${this.challenge.word.length} letters`;
        if (Object.keys(this.incorrectAttempts).length === 0) return `Perfect so far! ${progress}`;
        return `Keep trying! Knights never give up. ${progress}`;
    }
}


// ============================================================
// MEMORY PATTERN CHALLENGE
// From: KnightlyMemoryPatternChallenge.swift
// Purpose: Symbol pattern recall with themed elements
// ============================================================

class MemoryPatternChallenge {
    constructor(options = {}) {
        this.difficulty = options.difficulty || 'easy';
        this.theme = options.theme || 'knightly';
        this.elements = MemoryPatternChallenge.THEMES[this.theme] || MemoryPatternChallenge.THEMES.knightly;
        this.currentPattern = [];
        this.playerInputPattern = [];
        this.isShowingPattern = false;
        this.isPlayerTurn = false;
        this.isCompleted = false;
        this.attemptCount = 0;
        this.knightSchoolPoints = 0;
        this.virtuePoints = {};

        this.onElementShow = options.onElementShow || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onFeedback = options.onFeedback || (() => {});
        this.onStateChange = options.onStateChange || (() => {});
    }

    static DIFFICULTIES = { easy: 3, medium: 4, hard: 5 };
    static POINT_VALUES = { easy: 1, medium: 2, hard: 3 };

    static THEMES = {
        knightly: [
            { symbol: 'shield', color: '#3b82f6', sound: 'shield_sound' },
            { symbol: 'sword', color: '#ef4444', sound: 'sword_sound' },
            { symbol: 'crown', color: '#eab308', sound: 'crown_sound' },
            { symbol: 'scroll', color: '#a855f7', sound: 'scroll_sound' }
        ],
        forest: [
            { symbol: 'leaf', color: '#22c55e', sound: 'leaf_sound' },
            { symbol: 'water', color: '#3b82f6', sound: 'water_sound' },
            { symbol: 'wind', color: '#6b7280', sound: 'wind_sound' },
            { symbol: 'rabbit', color: '#92400e', sound: 'animal_sound' }
        ],
        magical: [
            { symbol: 'sparkles', color: '#eab308', sound: 'magic_chime' },
            { symbol: 'moon', color: '#a855f7', sound: 'night_sound' },
            { symbol: 'flame', color: '#f97316', sound: 'fire_sound' },
            { symbol: 'droplet', color: '#3b82f6', sound: 'water_drop' }
        ]
    };

    get patternLength() {
        return MemoryPatternChallenge.DIFFICULTIES[this.difficulty] || 3;
    }

    startChallenge() {
        this.currentPattern = [];
        this.playerInputPattern = [];
        this.isShowingPattern = false;
        this.isPlayerTurn = false;
        this.isCompleted = false;
        this.attemptCount = 0;

        this._generatePattern();
        this._showPattern();
    }

    _generatePattern() {
        this.currentPattern = [];
        for (let i = 0; i < this.patternLength; i++) {
            const randomEl = this.elements[Math.floor(Math.random() * this.elements.length)];
            this.currentPattern.push(randomEl);
        }
    }

    _showPattern() {
        this.isShowingPattern = true;
        this.isPlayerTurn = false;

        this.onFeedback({
            claude: 'Watch carefully, Sir James!',
            gramps: 'Focus on each symbol, one by one.'
        });

        this.onStateChange({ state: 'showing' });

        setTimeout(() => this._showElementByElement(0), 1000);
    }

    _showElementByElement(index) {
        if (index >= this.currentPattern.length) {
            setTimeout(() => {
                this.isShowingPattern = false;
                this.isPlayerTurn = true;
                this.onFeedback({ claude: 'Your turn! Can you remember the pattern?' });
                this.onStateChange({ state: 'player_turn' });
            }, 500);
            return;
        }

        this.onElementShow({
            element: this.currentPattern[index],
            index,
            total: this.currentPattern.length
        });

        setTimeout(() => this._showElementByElement(index + 1), 1000);
    }

    selectElement(element) {
        if (!this.isPlayerTurn || this.isCompleted) return;

        this.playerInputPattern.push(element);
        const currentIndex = this.playerInputPattern.length - 1;
        const isCorrect = currentIndex < this.currentPattern.length &&
            this.playerInputPattern[currentIndex].symbol === this.currentPattern[currentIndex].symbol;

        if (isCorrect) {
            if (this.playerInputPattern.length === this.currentPattern.length) {
                this._handleSuccess();
            } else {
                this.onFeedback({ claude: 'Good! Keep going!' });
            }
            return true;
        } else {
            this._handleIncorrect();
            return false;
        }
    }

    _handleSuccess() {
        this.isCompleted = true;
        this.isPlayerTurn = false;
        const basePoints = MemoryPatternChallenge.POINT_VALUES[this.difficulty] || 1;
        const attemptBonus = Math.max(0, 3 - this.attemptCount);
        this.knightSchoolPoints = basePoints + attemptBonus;
        this.virtuePoints = { Memory: basePoints, Focus: attemptBonus };

        this.onFeedback({
            claude: "Amazing memory, Sir James! That's a true knight!",
            gramps: 'Well done! A knight who remembers well learns twice as fast.',
            whindle: 'Whooo remembers the patterns of old may unlock the secrets of new.'
        });

        this.onStateChange({ state: 'completed' });
        this.onComplete({
            knightSchoolPoints: this.knightSchoolPoints,
            virtuePoints: this.virtuePoints,
            attempts: this.attemptCount
        });
    }

    _handleIncorrect() {
        this.attemptCount++;
        this.onFeedback({ claude: "Hmm, that doesn't seem right. Try again!" });
        this.playerInputPattern = [];

        if (this.attemptCount >= 2) {
            this.onFeedback({ gramps: 'Remember, start with the first symbol and build from there.' });
        }
        if (this.attemptCount >= 3) {
            this._showPattern();
        }
    }
}


// ============================================================
// KNIGHT SCHOOL ENGINE
// Orchestrates challenges within the LoopEngine scene flow
// ============================================================

class KnightSchoolEngine {
    constructor(loopEngine) {
        this.loopEngine = loopEngine;
        this.activeChallenge = null;
        this.challengeHistory = [];
    }

    launchChallenge(type, options = {}) {
        const challengeMap = {
            'reading_rhythm': ReadingRhythmChallenge,
            'listening': ListeningChallenge,
            'typing': TypingChallenge,
            'memory_pattern': MemoryPatternChallenge
        };

        const ChallengeClass = challengeMap[type];
        if (!ChallengeClass) {
            console.error(`Unknown challenge type: ${type}`);
            return null;
        }

        const sharedCallbacks = {
            onComplete: (results) => this._onChallengeComplete(type, results),
            onFeedback: (feedback) => this._onChallengeFeedback(feedback)
        };

        this.activeChallenge = new ChallengeClass({ ...options, ...sharedCallbacks });
        return this.activeChallenge;
    }

    _onChallengeComplete(type, results) {
        const record = {
            type,
            timestamp: new Date().toISOString(),
            ...results
        };
        this.challengeHistory.push(record);

        this._logToParentDashboard(record);

        if (this.loopEngine) {
            this.loopEngine.onChallengeComplete(record);
        }
    }

    _onChallengeFeedback(feedback) {
        if (this.loopEngine) {
            if (feedback.claude) this.loopEngine.showClaudeThought(feedback.claude);
            if (feedback.gramps) this.loopEngine.showGrampsAdvice(feedback.gramps);
            if (feedback.whindle) this.loopEngine.showWhindleWisdom(feedback.whindle);
        }
    }

    _logToParentDashboard(record) {
        try {
            const existing = JSON.parse(localStorage.getItem('sj:knight_school') || '[]');
            existing.push(record);
            localStorage.setItem('sj:knight_school', JSON.stringify(existing));
        } catch (e) {
            console.warn('Failed to log to parent dashboard:', e);
        }

        try {
            const metrics = {
                challengeType: record.type,
                timeSpent: record.elapsedTime || 0,
                attemptsCount: record.attempts || 0,
                completionSuccess: true,
                virtuesExercised: Object.keys(record.virtuePoints || {}),
                skillProgress: {
                    accuracy: record.perfectScore ? 1.0 : 0.8,
                    memory: (record.virtuePoints || {}).Memory || 0
                },
                knightSchoolPoints: record.knightSchoolPoints || 0
            };

            fetch('/.netlify/functions/scene-metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metrics)
            }).catch(() => {});
        } catch (e) {
            // Silently fail — localStorage is the fallback
        }
    }

    getTotalKnightSchoolPoints() {
        return this.challengeHistory.reduce((sum, r) => sum + (r.knightSchoolPoints || 0), 0);
    }

    getChallengeCount() {
        return this.challengeHistory.length;
    }

    getVirtuesSummary() {
        const summary = {};
        this.challengeHistory.forEach(r => {
            Object.entries(r.virtuePoints || {}).forEach(([virtue, points]) => {
                summary[virtue] = (summary[virtue] || 0) + points;
            });
        });
        return summary;
    }
}


// ============================================================
// EXPORTS (for use in browser or module systems)
// ============================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ReadingRhythmChallenge,
        ListeningChallenge,
        TypingChallenge,
        MemoryPatternChallenge,
        KnightSchoolEngine
    };
}

if (typeof window !== 'undefined') {
    window.KnightSchool = {
        ReadingRhythmChallenge,
        ListeningChallenge,
        TypingChallenge,
        MemoryPatternChallenge,
        KnightSchoolEngine
    };
}
