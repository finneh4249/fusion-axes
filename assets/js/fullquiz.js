/**
 * Full Quiz Module
 * Handles the comprehensive quiz functionality for the Fusion Party Value Alignment Quiz
 */

import { QuizUtils, DOMUtils } from './common.js';
import { questions } from '../questions.js'; // Import questions as a module

export class FullQuizManager {
    constructor() {
        this.pillarScores = [0, 0, 0, 0, 0, 0];
        this.currentQuestionIndex = 0;
        this.userResponses = [];
        this.questionsInOrder = [];
        this.scoreLevelValues = [4, 3, 2, 1, -1, -2, -3, -4];
        
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.prepareAllQuestions();
            this.renderCurrentQuestion();
            this.setupKeyboardShortcuts();
            this.updateProgress();
            this.setupAnswerButtonListeners(); // New: Setup listeners for answer buttons
        });
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

    renderCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questionsInOrder.length) {
            this.showResults();
            return;
        }

        const [pillarIdx, scoreLevelIdx, questionInLevelIdx] = this.questionsInOrder[this.currentQuestionIndex];
        
        const questionText = DOMUtils.getElementById("question-text");
        if (questionText) {
            questionText.innerHTML = questions[pillarIdx][scoreLevelIdx][questionInLevelIdx];
            questionText.style.opacity = '0';
            setTimeout(() => {
                questionText.style.opacity = '1';
            }, 50);
        }

        this.updateProgress();

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

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
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

    setupAnswerButtonListeners() {
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const userChoice = parseInt(event.currentTarget.dataset.value);
                this.answerQuestion(userChoice);
            });
        });
    }

    answerQuestion(userChoice) {
        const answerBtns = document.querySelectorAll('.answer-btn');
        answerBtns.forEach(btn => {
            if (parseInt(btn.dataset.value) === userChoice) {
                btn.classList.add('selected');
                setTimeout(() => btn.classList.remove('selected'), 200);
            }
        });

        const [pillarIdx, scoreLevelIdx] = this.questionsInOrder[this.currentQuestionIndex];
        const propositionScoreValue = this.scoreLevelValues[scoreLevelIdx];
        const scoreContribution = (userChoice / 2.0) * propositionScoreValue;
        this.pillarScores[pillarIdx] += scoreContribution;
        
        this.userResponses[this.currentQuestionIndex] = userChoice;
        this.currentQuestionIndex++;

        setTimeout(() => {
            if (this.currentQuestionIndex < this.questionsInOrder.length) {
                this.renderCurrentQuestion();
            } else {
                this.showResults();
            }
        }, 150);
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

        setTimeout(() => {
            const resultsUrl = QuizUtils.buildResultsUrl(this.pillarScores);
            window.location.href = resultsUrl;
        }, 1500);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FullQuizManager();
});
