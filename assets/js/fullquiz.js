/**
 * Full Quiz Module
 * Handles the comprehensive quiz functionality for the Fusion Party Value Alignment Quiz
 */

import { QuizUtils, DOMUtils } from './common.js';

export class FullQuizManager {
    constructor() {
        // pillarScores stores the raw accumulated score for each of the 6 Fusion values.
        // Order: PersonalLiberty, Advancement, EcologicalHarmony, Safety, EthicalConduct, Equity
        this.pillarScores = [0, 0, 0, 0, 0, 0];
        this.currentQuestionIndex = 0;
        this.userResponses = []; // Stores the raw user choice (-2 to +2) for each question
        this.questionsInOrder = []; // Array of [pillarIdx, scoreLevelIdx, questionInLevelIdx]
        
        // scoreLevelValues maps the 'score_level_index' (0-7) from questions.js 
        // to the inherent point value of that proposition (+4 for most aligned, -4 for least).
        this.scoreLevelValues = [4, 3, 2, 1, -1, -2, -3, -4]; // Index 0 is +4, Index 7 is -4
        
        this.initialize();
    }

    /**
     * Initialize the full quiz
     */
    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.prepareAllQuestions();
            this.renderCurrentQuestion();
            this.setupKeyboardShortcuts();
            this.updateProgress();
        });
    }

    /**
     * Flattens the 3D questions array into a 1D array of question references, then shuffles it.
     */
    prepareAllQuestions() {
        // Assuming 'questions' is globally available from questions.js
        if (typeof questions === 'undefined') {
            console.error('Questions array not found. Make sure questions.js is loaded.');
            return;
        }

        for (let pillarIdx = 0; pillarIdx < questions.length; pillarIdx++) {
            for (let scoreLevelIdx = 0; scoreLevelIdx < questions[pillarIdx].length; scoreLevelIdx++) {
                for (let questionInLevelIdx = 0; questionInLevelIdx < questions[pillarIdx][scoreLevelIdx].length; questionInLevelIdx++) {
                    this.questionsInOrder.push([pillarIdx, scoreLevelIdx, questionInLevelIdx]);
                }
            }
        }
        QuizUtils.shuffleArray(this.questionsInOrder);
    }

    /**
     * Updates the progress bar and question counter
     */
    updateProgress() {
        const progressPercent = this.questionsInOrder.length > 0 ? 
            ((this.currentQuestionIndex) / this.questionsInOrder.length) * 100 : 0;
        
        const progressFill = DOMUtils.getElementById("progress-fill");
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
        
        const questionNumber = DOMUtils.getElementById("question-number");
        if (questionNumber) {
            if (this.questionsInOrder.length > 0) {
                questionNumber.innerHTML = `Question ${this.currentQuestionIndex + 1} of ${this.questionsInOrder.length}`;
            } else {
                questionNumber.innerHTML = "Loading...";
            }
        }
    }

    /**
     * Displays the current question and updates the UI
     */
    renderCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questionsInOrder.length) {
            this.showResults();
            return;
        }

        const [pillarIdx, scoreLevelIdx, questionInLevelIdx] = this.questionsInOrder[this.currentQuestionIndex];
        
        const questionText = DOMUtils.getElementById("question-text");
        if (questionText) {
            questionText.innerHTML = questions[pillarIdx][scoreLevelIdx][questionInLevelIdx];
            // Add fade-in animation
            questionText.style.opacity = '0';
            setTimeout(() => {
                questionText.style.opacity = '1';
            }, 50);
        }

        this.updateProgress();

        // Toggle "Previous" button visibility
        const backButton = DOMUtils.getElementById("back_button");
        const backButtonOff = DOMUtils.getElementById("back_button_off");
        if (this.currentQuestionIndex === 0) {
            if (backButton) backButton.style.display = 'none';
            if (backButtonOff) backButtonOff.style.display = 'block';
        } else {
            if (backButton) backButton.style.display = 'block';
            if (backButtonOff) backButtonOff.style.display = 'none';
        }
    }

    /**
     * Setup keyboard shortcuts for better UX
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Prevent shortcuts if user is typing in an input field
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            switch(event.key) {
                case '1':
                    event.preventDefault();
                    this.answerQuestion(2);
                    break;
                case '2':
                    event.preventDefault();
                    this.answerQuestion(1);
                    break;
                case '3':
                case ' ':
                    event.preventDefault();
                    this.answerQuestion(0);
                    break;
                case '4':
                    event.preventDefault();
                    this.answerQuestion(-1);
                    break;
                case '5':
                    event.preventDefault();
                    this.answerQuestion(-2);
                    break;
                case 'ArrowLeft':
                case 'Backspace':
                    event.preventDefault();
                    this.prevQuestion();
                    break;
            }
        });
    }

    /**
     * Processes the user's answer to the current question
     * @param {number} userChoice - Integer from -2 (Strongly Disagree) to +2 (Strongly Agree)
     */
    answerQuestion(userChoice) {
        // Add visual feedback
        const answerBtns = document.querySelectorAll('.answer-btn');
        answerBtns.forEach(btn => {
            if (parseInt(btn.dataset.value) === userChoice) {
                btn.classList.add('selected');
                setTimeout(() => btn.classList.remove('selected'), 200);
            }
        });

        const [pillarIdx, scoreLevelIdx] = this.questionsInOrder[this.currentQuestionIndex];
        
        // Get the inherent score value of the current question's proposition
        const propositionScoreValue = this.scoreLevelValues[scoreLevelIdx];

        // Calculate the score contribution for this question
        const scoreContribution = (userChoice / 2.0) * propositionScoreValue;
        this.pillarScores[pillarIdx] += scoreContribution;
        
        this.userResponses[this.currentQuestionIndex] = userChoice;
        this.currentQuestionIndex++;

        // Small delay for better UX
        setTimeout(() => {
            if (this.currentQuestionIndex < this.questionsInOrder.length) {
                this.renderCurrentQuestion();
            } else {
                this.showResults();
            }
        }, 150);
    }

    /**
     * Handles the "Previous" button click
     */
    prevQuestion() {
        if (this.currentQuestionIndex === 0) {
            return; // Cannot go back from the first question
        }
        this.currentQuestionIndex--; // Move back to the previous question's index

        const [pillarIdx, scoreLevelIdx] = this.questionsInOrder[this.currentQuestionIndex];
        const previousUserChoice = this.userResponses[this.currentQuestionIndex];
        const propositionScoreValue = this.scoreLevelValues[scoreLevelIdx];

        // Subtract the score that was previously added for this question
        const scoreToRevert = (previousUserChoice / 2.0) * propositionScoreValue;
        this.pillarScores[pillarIdx] -= scoreToRevert;
        
        this.renderCurrentQuestion();
    }

    /**
     * Normalizes a raw pillar score to a 0-100 scale
     * @param {number} rawScore - The raw pillar score
     * @returns {number} - Normalized score (0-100)
     */
    normalizePillarScore(rawScore) {
        const minRawScore = -32; // 8 questions * -4 points (min score per question)
        const maxRawScore = 32;  // 8 questions * +4 points (max score per question)
        
        // Cap rawScore to prevent issues
        const cappedScore = Math.max(minRawScore, Math.min(rawScore, maxRawScore));
        const normalized = ((cappedScore - minRawScore) / (maxRawScore - minRawScore)) * 100;
        return Math.round(normalized);
    }

    /**
     * Constructs the results URL and redirects the user
     */
    showResults() {
        // Show completion animation
        const questionCard = document.querySelector('.question-card');
        if (questionCard) {
            questionCard.style.opacity = '0.5';
            questionCard.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div class="loading-spinner"></div>
                    <h3>Processing your results...</h3>
                    <p>Analyzing your responses and calculating alignment scores.</p>
                </div>
            `;
        }

        // Redirect after a short delay
        setTimeout(() => {
            const resultsUrl = QuizUtils.buildResultsUrl(this.pillarScores);
            window.location.href = resultsUrl;
        }, 1500);
    }
}

// Create global full quiz manager instance
let fullQuizManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fullQuizManager = new FullQuizManager();
});

// Global functions for backward compatibility with inline onclick handlers
window.answer_question = (userChoice) => {
    if (fullQuizManager) {
        fullQuizManager.answerQuestion(userChoice);
    }
};

window.prev_question = () => {
    if (fullQuizManager) {
        fullQuizManager.prevQuestion();
    }
};

// Export for module use
export default FullQuizManager;
