/**
 * Quiz Module
 * Handles the main quiz functionality for the Fusion Party Value Alignment Quiz
 */

import { QuizUtils, DOMUtils } from './common.js';
import { questions } from '../questions.js'; // Import questions as a module

export class QuizManager {
    constructor() {
        this.pillarScores = [0, 0, 0, 0, 0, 0];
        this.currentQuestionIndex = 0;
        this.userResponses = [];
        this.questionsInOrder = [];
        this.scoreLevelValues = [4, 3, 2, 1, -1, -2, -3, -4];
        
        this.initialize();
    }

    initialize() {
        this.prepareAllQuestions();
        this.setupEventListeners();
        this.renderCurrentQuestion();
        this.addKeyboardNavigation();
        this.addInitialAnimations();
    }

    prepareAllQuestions() {
        for (let pillarIdx = 0; pillarIdx < questions.length; pillarIdx++) {
            for (let scoreLevelIdx = 0; scoreLevelIdx < questions[pillarIdx].length; scoreLevelIdx++) {
                for (let questionInLevelIdx = 0; questionInLevelIdx < questions[pillarIdx][scoreLevelIdx].length; questionInLevelIdx++) {
                    this.questionsInOrder.push([pillarIdx, scoreLevelIdx, questionInLevelIdx]);
                }
            }
        }
        QuizUtils.shuffleArray(this.questionsInOrder);
    }

    setupEventListeners() {
        const backButton = DOMUtils.getElementById('back_button');
        if (backButton) {
            backButton.addEventListener('click', () => this.prevQuestion());
        }

        // Add event listeners for answer buttons
        const answerButtons = document.querySelectorAll('.answer-button');
        answerButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const userChoice = parseInt(event.currentTarget.dataset.value); // Assuming data-value attribute is set
                this.answerQuestion(userChoice);
            });
        });
    }

    renderCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questionsInOrder.length) {
            this.showResults();
            return;
        }

        const [pillarIdx, scoreLevelIdx, questionInLevelIdx] = this.questionsInOrder[this.currentQuestionIndex];
        const questionText = questions[pillarIdx][scoreLevelIdx][questionInLevelIdx];
        
        const questionElement = DOMUtils.getElementById('question-text');
        if (questionElement) {
            questionElement.style.opacity = '0';
            setTimeout(() => {
                questionElement.innerHTML = questionText;
                questionElement.style.opacity = '1';
            }, 150);
        }

        DOMUtils.setHTML('question-number', `Question ${this.currentQuestionIndex + 1} of ${this.questionsInOrder.length}`);
        QuizUtils.updateProgressBar(this.currentQuestionIndex, this.questionsInOrder.length);
        QuizUtils.updateNavigationButtons(this.currentQuestionIndex, this.questionsInOrder.length);
    }

    answerQuestion(userChoice) {
        this.addAnswerFeedback();

        setTimeout(() => {
            const [pillarIdx, scoreLevelIdx] = this.questionsInOrder[this.currentQuestionIndex];
            const propositionScoreValue = this.scoreLevelValues[scoreLevelIdx];
            const scoreContribution = (userChoice / 2.0) * propositionScoreValue;
            this.pillarScores[pillarIdx] += scoreContribution;
            
            this.userResponses[this.currentQuestionIndex] = userChoice;
            this.currentQuestionIndex++;

            if (this.currentQuestionIndex < this.questionsInOrder.length) {
                this.renderCurrentQuestion();
            } else {
                this.showResults();
            }
        }, 200);
    }

    prevQuestion() {
        if (this.currentQuestionIndex === 0) {
            return;
        }
        
        this.currentQuestionIndex--;

        const [pillarIdx, scoreLevelIdx] = this.questionsInOrder[this.currentQuestionIndex];
        const previousUserChoice = this.userResponses[this.currentQuestionIndex];
        const propositionScoreValue = this.scoreLevelValues[scoreLevelIdx];

        const scoreToRevert = (previousUserChoice / 2.0) * propositionScoreValue;
        this.pillarScores[pillarIdx] -= scoreToRevert;
        
        this.renderCurrentQuestion();
    }

    normalizePillarScore(rawScore) {
        const minRawScore = -32;
        const maxRawScore = 32;
        
        const cappedScore = Math.max(minRawScore, Math.min(rawScore, maxRawScore));
        const normalized = ((cappedScore - minRawScore) / (maxRawScore - minRawScore)) * 100;
        return Math.round(normalized);
    }

    showResults() {
        const resultsUrl = QuizUtils.buildResultsUrl(this.pillarScores);
        window.location.href = resultsUrl;
    }

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

    addKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case '1':
                    this.answerQuestion(2);
                    break;
                case '2':
                    this.answerQuestion(1);
                    break;
                case '3':
                    this.answerQuestion(0);
                    break;
                case '4':
                    this.answerQuestion(-1);
                    break;
                case '5':
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

    addInitialAnimations() {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
            
            this.addKeyboardHint();
        });
    }

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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new QuizManager();
});
