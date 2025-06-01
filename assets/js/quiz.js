/**
 * Quiz Module
 * Handles the main quiz functionality for the Fusion Party Value Alignment Quiz
 */

import { QuizUtils, DOMUtils } from './common.js';

export class QuizManager {
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
     * Initialize the quiz
     */
    initialize() {
        this.prepareAllQuestions();
        this.setupEventListeners();
        this.renderCurrentQuestion();
        this.addKeyboardNavigation();
        this.addInitialAnimations();
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
     * Setup event listeners for quiz navigation
     */
    setupEventListeners() {
        // Previous button event listener
        const backButton = DOMUtils.getElementById('back_button');
        if (backButton) {
            backButton.addEventListener('click', () => this.prevQuestion());
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
        const questionText = questions[pillarIdx][scoreLevelIdx][questionInLevelIdx];
        
        // Update question text with fade animation
        const questionElement = DOMUtils.getElementById('question-text');
        if (questionElement) {
            questionElement.style.opacity = '0';
            setTimeout(() => {
                questionElement.innerHTML = questionText;
                questionElement.style.opacity = '1';
            }, 150);
        }

        // Update question counter
        DOMUtils.setHTML('question-number', `Question ${this.currentQuestionIndex + 1} of ${this.questionsInOrder.length}`);

        // Update progress bar
        QuizUtils.updateProgressBar(this.currentQuestionIndex, this.questionsInOrder.length);

        // Update navigation buttons
        QuizUtils.updateNavigationButtons(this.currentQuestionIndex, this.questionsInOrder.length);
    }

    /**
     * Processes the user's answer to the current question
     * @param {number} userChoice - Integer from -2 (Strongly Disagree) to +2 (Strongly Agree)
     */
    answerQuestion(userChoice) {
        // Add visual feedback
        this.addAnswerFeedback();

        setTimeout(() => {
            const [pillarIdx, scoreLevelIdx] = this.questionsInOrder[this.currentQuestionIndex];
            
            // Get the inherent score value of the current question's proposition
            const propositionScoreValue = this.scoreLevelValues[scoreLevelIdx];

            // Calculate the score contribution for this question
            const scoreContribution = (userChoice / 2.0) * propositionScoreValue;
            this.pillarScores[pillarIdx] += scoreContribution;
            
            // Store the user's response
            this.userResponses[this.currentQuestionIndex] = userChoice;
            this.currentQuestionIndex++;

            if (this.currentQuestionIndex < this.questionsInOrder.length) {
                this.renderCurrentQuestion();
            } else {
                this.showResults();
            }
        }, 200);
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
        const resultsUrl = QuizUtils.buildResultsUrl(this.pillarScores);
        window.location.href = resultsUrl;
    }

    /**
     * Add visual feedback when user answers
     */
    addAnswerFeedback() {
        const buttons = document.querySelectorAll('.answer-button');
        buttons.forEach(button => {
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.7';
        });

        setTimeout(() => {
            buttons.forEach(button => {
                button.style.transform = '';
                button.style.opacity = '';
            });
        }, 200);
    }

    /**
     * Add keyboard navigation
     */
    addKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case '1':
                    this.answerQuestion(2); // Strongly Agree
                    break;
                case '2':
                    this.answerQuestion(1); // Agree
                    break;
                case '3':
                    this.answerQuestion(0); // Neutral
                    break;
                case '4':
                    this.answerQuestion(-1); // Disagree
                    break;
                case '5':
                    this.answerQuestion(-2); // Strongly Disagree
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
     * Add initial animations
     */
    addInitialAnimations() {
        document.addEventListener('DOMContentLoaded', () => {
            // Add fade-in animation for initial load
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
            
            // Show keyboard shortcuts hint
            this.addKeyboardHint();
        });
    }

    /**
     * Add keyboard shortcuts hint
     */
    addKeyboardHint() {
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer) {
            const shortcutsHint = document.createElement('div');
            shortcutsHint.className = 'shortcuts-hint';
            shortcutsHint.innerHTML = `
                <p style="text-align: center; color: #666; font-size: 0.875rem; margin-top: 1rem;">
                    💡 Tip: Use keys 1-5 for quick answers, or arrow keys to navigate
                </p>
            `;
            quizContainer.appendChild(shortcutsHint);
        }
    }
}

// Create global quiz manager instance
let quizManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    quizManager = new QuizManager();
});

// Global functions for backward compatibility with inline onclick handlers
window.answer_question = (userChoice) => {
    if (quizManager) {
        quizManager.answerQuestion(userChoice);
    }
};

window.prev_question = () => {
    if (quizManager) {
        quizManager.prevQuestion();
    }
};

// Export for module use
export default QuizManager;
