/**
 * Common Utilities Module
 * Shared functions used across multiple quiz components
 */

export class QuizUtils {
    /**
     * Shuffles an array in place using the Fisher-Yates algorithm.
     * @param {Array} array - The array to shuffle
     */
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // ES6 swap
        }
    }

    /**
     * Gets a query parameter value from the URL
     * @param {string} variable - The name of the query parameter
     * @returns {string|NaN} - The parameter value or NaN if not found
     */
    static getQueryVariable(variable) {
        const query = window.location.search.substring(1);
        const vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return NaN; // Return NaN if not found
    }

    /**
     * Normalizes a pillar score to a 0-100 range for display
     * @param {number} score - The raw pillar score
     * @returns {number} - Normalized score (0-100)
     */
    static normalizePillarScore(score) {
        // The theoretical range for pillar scores depends on the number of questions
        // For now, we'll use a simple linear transformation
        // This may need adjustment based on your actual scoring methodology
        const maxPossibleScore = 48; // Adjust based on your quiz structure
        const minPossibleScore = -48;
        
        // Clamp the score to the expected range
        const clampedScore = Math.max(minPossibleScore, Math.min(maxPossibleScore, score));
        
        // Transform to 0-100 scale
        const normalizedScore = ((clampedScore - minPossibleScore) / (maxPossibleScore - minPossibleScore)) * 100;
        
        return Math.round(normalizedScore);
    }

    /**
     * Updates the quiz progress bar
     * @param {number} currentQuestion - Current question number (0-based)
     * @param {number} totalQuestions - Total number of questions
     */
    static updateProgressBar(currentQuestion, totalQuestions) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const percentage = ((currentQuestion) / totalQuestions) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    /**
     * Shows/hides navigation buttons based on quiz state
     * @param {number} currentIndex - Current question index
     * @param {number} totalQuestions - Total number of questions
     */
    static updateNavigationButtons(currentIndex, totalQuestions) {
        const backButton = document.getElementById("back_button");
        const backButtonOff = document.getElementById("back_button_off");
        
        if (backButton && backButtonOff) {
            if (currentIndex === 0) {
                backButton.style.display = 'none';
                backButtonOff.style.display = 'block';
            } else {
                backButton.style.display = 'block';
                backButtonOff.style.display = 'none';
            }
        }
    }

    /**
     * Builds the results URL with score parameters
     * @param {Array} pillarScores - Array of pillar scores
     * @returns {string} - Results URL with parameters
     */
    static buildResultsUrl(pillarScores) {
        const params = [
            `liberty=${this.normalizePillarScore(pillarScores[0])}`,
            `advance=${this.normalizePillarScore(pillarScores[1])}`,
            `harmony=${this.normalizePillarScore(pillarScores[2])}`,
            `safety=${this.normalizePillarScore(pillarScores[3])}`,
            `ethics=${this.normalizePillarScore(pillarScores[4])}`,
            `equity=${this.normalizePillarScore(pillarScores[5])}`
        ];
        
        return `results.html?${params.join('&')}`;
    }
}

/**
 * DOM Utility Functions
 */
export class DOMUtils {
    /**
     * Safely gets an element by ID
     * @param {string} id - Element ID
     * @returns {Element|null} - The element or null if not found
     */
    static getElementById(id) {
        return document.getElementById(id);
    }

    /**
     * Safely sets text content for an element
     * @param {string} id - Element ID
     * @param {string} text - Text content to set
     */
    static setText(id, text) {
        const element = this.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    /**
     * Safely sets HTML content for an element
     * @param {string} id - Element ID
     * @param {string} html - HTML content to set
     */
    static setHTML(id, html) {
        const element = this.getElementById(id);
        if (element) {
            element.innerHTML = html;
        }
    }

    /**
     * Safely sets the width of an element (typically for progress bars)
     * @param {string} id - Element ID
     * @param {string} width - Width value (e.g., "50%")
     */
    static setWidth(id, width) {
        const element = this.getElementById(id);
        if (element) {
            element.style.width = width;
        }
    }

    /**
     * Shows an element
     * @param {string} id - Element ID
     */
    static show(id) {
        const element = this.getElementById(id);
        if (element) {
            element.style.display = 'block';
        }
    }

    /**
     * Hides an element
     * @param {string} id - Element ID
     */
    static hide(id) {
        const element = this.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }
}

/**
 * Event handling utilities
 */
export class EventUtils {
    /**
     * Adds an event listener with error handling
     * @param {string|Element} element - Element or element ID
     * @param {string} event - Event type
     * @param {Function} handler - Event handler function
     */
    static addEventListener(element, event, handler) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (el) {
            el.addEventListener(event, handler);
        }
    }

    /**
     * Removes an event listener
     * @param {string|Element} element - Element or element ID
     * @param {string} event - Event type
     * @param {Function} handler - Event handler function
     */
    static removeEventListener(element, event, handler) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (el) {
            el.removeEventListener(event, handler);
        }
    }
}

