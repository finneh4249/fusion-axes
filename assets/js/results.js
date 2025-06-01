/**
 * Results Module
 * Handles the results display functionality for the Fusion Party Value Alignment Quiz
 */

import { QuizUtils, DOMUtils } from './common.js';

export class ResultsManager {
    constructor() {
        this.fusionValues = [
            { name: "Personal Liberty", id: "liberty", param: "liberty", positiveImg: "liberty_positive.png", negativeImg: "liberty_negative.png", positiveColor: "#5FACFF", negativeColor: "#505060"},
            { name: "Advancement", id: "advancement", param: "advance", positiveImg: "advancement_positive.png", negativeImg: "advancement_negative.png", positiveColor: "#91313D", negativeColor: "#D3A0A8"},
            { name: "Ecological Harmony", id: "harmony", param: "harmony", positiveImg: "harmony_positive.png", negativeImg: "harmony_negative.png", positiveColor: "#008C65", negativeColor: "#866C60"},
            { name: "Safety", id: "safety", param: "safety", positiveImg: "safety_positive.png", negativeImg: "safety_negative.png", positiveColor: "#3D4DCB", negativeColor: "#EC3F42"},
            { name: "Ethical Conduct", id: "ethics", param: "ethics", positiveImg: "ethics_positive.png", negativeImg: "ethics_negative.png", positiveColor: "#98A7C6", negativeColor: "#606070"},
            { name: "Equity", id: "equity", param: "equity", positiveImg: "equity_positive.png", negativeImg: "equity_negative.png", positiveColor: "#D9B487", negativeColor: "#707070"}
        ];

        this.userScores = {};
        this.initialize();
    }

    /**
     * Initialize the results display
     */
    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadScores();
            this.displayBars();
            this.calculateArchetypeMatch();
            this.drawCanvas();
            this.setupEventListeners();
            this.addAnimations();
        });
    }

    /**
     * Load scores from URL parameters
     */
    loadScores() {
        this.fusionValues.forEach(value => {
            const score = parseFloat(QuizUtils.getQueryVariable(value.param));
            this.userScores[value.id] = isNaN(score) ? 50 : score; // Default to 50 if param not found
        });
    }

    /**
     * Display the score bars for each value
     */
    displayBars() {
        this.fusionValues.forEach(value => {
            this.setBarValue(value.id, this.userScores[value.id]);
            // Update label with percentage
            const labelElement = DOMUtils.getElementById(`value-${value.id}-label`);
            if (labelElement) {
                labelElement.innerHTML = `${value.name}: ${this.userScores[value.id].toFixed(0)}%`;
            }
        });
    }

    /**
     * Set the visual representation of a value bar
     * @param {string} valueName - The name of the value
     * @param {number} score - Score from 0-100
     */
    setBarValue(valueName, score) {
        const positiveBar = DOMUtils.getElementById(`bar-${valueName}-positive`);
        const negativeBar = DOMUtils.getElementById(`bar-${valueName}-negative`);
        const positiveText = DOMUtils.getElementById(`${valueName}-positive`);
        const negativeText = DOMUtils.getElementById(`${valueName}-negative`);

        const positiveScore = score;
        const negativeScore = 100 - score;

        if (positiveBar) positiveBar.style.width = positiveScore + "%";
        if (positiveText) {
            positiveText.innerHTML = positiveScore + "%";
            // Hide text if bar is too small
            if (positiveText.offsetWidth + 20 > positiveBar.offsetWidth) {
                positiveText.style.visibility = "hidden";
            } else {
                positiveText.style.visibility = "visible";
            }
        }
        
        if (negativeBar) negativeBar.style.width = negativeScore + "%";
        if (negativeText) {
            negativeText.innerHTML = negativeScore + "%";
            if (negativeText.offsetWidth + 20 > negativeBar.offsetWidth) {
                negativeText.style.visibility = "hidden";
            } else {
                negativeText.style.visibility = "visible";
            }
        }
    }

    /**
     * Calculate similarity between user's scores and an archetype's stats
     * @param {Object} userScores - User's value scores
     * @param {Object} archetypeStats - Archetype's value scores
     * @returns {Object} - { difference, similarity }
     */
    calculateSimilarity(userScores, archetypeStats) {
        let totalDifference = 0;
        let valueCount = 0;
        
        for (const valueKey in archetypeStats) {
            if (userScores.hasOwnProperty(valueKey)) {
                totalDifference += Math.abs(userScores[valueKey] - archetypeStats[valueKey]);
                valueCount++;
            }
        }
        
        if (valueCount === 0) return { difference: Infinity, similarity: 0 };

        const maxPossibleDifference = valueCount * 100;
        let similarityPercentage = (1 - (totalDifference / maxPossibleDifference)) * 100;
        return { 
            difference: totalDifference, 
            similarity: Math.max(0, Math.round(similarityPercentage))
        };
    }

    /**
     * Calculate and display archetype matches
     */
    calculateArchetypeMatch() {
        let closestArchetype = { name: "Unknown", similarity: -1, description: "" };
        let fusionMatchStats = {};

        // Ensure ideologies are loaded from ideologies.js
        if (typeof ideologies !== 'undefined') {
            ideologies.forEach(archetype => {
                const matchStats = this.calculateSimilarity(this.userScores, archetype.stats);
                if (archetype.name === "Fusion Party Alignment") {
                    fusionMatchStats = { 
                        ...matchStats, 
                        name: archetype.name, 
                        description: archetype.description 
                    };
                }
                
                // Find the closest OTHER archetype
                if (matchStats.similarity > closestArchetype.similarity && 
                    archetype.name !== "Fusion Party Alignment") {
                    closestArchetype = { 
                        name: archetype.name, 
                        similarity: matchStats.similarity, 
                        description: archetype.description 
                    };
                }
            });
        }

        // If Fusion Party Alignment is the closest overall, reflect that
        if (fusionMatchStats.similarity >= closestArchetype.similarity) {
            closestArchetype = { 
                name: fusionMatchStats.name, 
                similarity: fusionMatchStats.similarity, 
                description: fusionMatchStats.description 
            };
        }

        // Update the UI with match results
        DOMUtils.setHTML("fusion-match-percentage", 
            fusionMatchStats.similarity !== undefined ? fusionMatchStats.similarity.toFixed(0) : "N/A");
        DOMUtils.setHTML("fusion-match-description", 
            fusionMatchStats.description || "See how your values align with the Fusion Party's approach.");
        
        DOMUtils.setHTML("archetype-label", closestArchetype.name);
        DOMUtils.setHTML("archetype-match-percentage", 
            closestArchetype.similarity !== undefined ? closestArchetype.similarity.toFixed(0) : "N/A");
        DOMUtils.setHTML("archetype-match-description", 
            closestArchetype.description || "This archetype represents a general philosophical leaning.");
    }

    /**
     * Draw the results canvas
     */
    drawCanvas() {
        window.addEventListener('load', () => {
            const canvas = DOMUtils.getElementById("banner");
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#EEEEEE";
            ctx.fillRect(0, 0, 800, 800);

            const barHeight = 80;
            const barGap = 40;
            const initialY = 70;
            const imgSize = 100;
            const barAreaXStart = 120;
            const barAreaWidth = 560;

            // Title
            ctx.fillStyle = "#222222";
            ctx.font = "700 60px Inter";
            ctx.textAlign = "center";
            ctx.fillText("Fusion Value Alignment", 400, 50);

            this.fusionValues.forEach((value, index) => {
                const yPos = initialY + index * (barHeight + barGap);
                const barYPos = yPos + (imgSize - barHeight) / 2 + 5;
                const textYPos = barYPos + barHeight / 2 + 15;

                // Draw Images
                let imgPositive = new Image();
                imgPositive.src = `value_images/${value.positiveImg}`;
                imgPositive.onload = () => ctx.drawImage(imgPositive, 20, yPos, imgSize, imgSize);
                
                let imgNegative = new Image();
                imgNegative.src = `value_images/${value.negativeImg}`;
                imgNegative.onload = () => ctx.drawImage(imgNegative, 680, yPos, imgSize, imgSize);

                // Background for bars
                ctx.fillStyle = "#DDDDDD";
                ctx.fillRect(barAreaXStart, barYPos, barAreaWidth, barHeight);

                // Positive score bar
                const positiveWidth = (this.userScores[value.id] / 100) * barAreaWidth;
                ctx.fillStyle = value.positiveColor;
                ctx.fillRect(barAreaXStart, barYPos, positiveWidth, barHeight);

                // Negative score bar
                const negativeWidth = barAreaWidth - positiveWidth;
                ctx.fillStyle = value.negativeColor;
                ctx.fillRect(barAreaXStart + positiveWidth, barYPos, negativeWidth, barHeight);
                
                // Text on bars
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 30px Inter";
                ctx.textAlign = "left";
                if (this.userScores[value.id] > 15) {
                    ctx.fillText(`${this.userScores[value.id].toFixed(0)}%`, barAreaXStart + 5, textYPos);
                }
                ctx.textAlign = "right";
                if ((100 - this.userScores[value.id]) > 15) {
                    ctx.fillText(`${(100 - this.userScores[value.id]).toFixed(0)}%`, 
                        barAreaXStart + barAreaWidth - 5, textYPos);
                }

                // Value Name Label
                ctx.fillStyle = "#222222";
                ctx.font = "bold 24px Inter";
                ctx.textAlign = "center";
                ctx.fillText(value.name, 400, yPos - 5);
            });

            // Footer text
            ctx.font = "300 20px Inter";
            ctx.fillStyle = "#555555";
            ctx.textAlign = "center";
            ctx.fillText("FusionParty.org.au/values-quiz", 400, 780);
        });
    }

    /**
     * Setup event listeners for interactive elements
     */
    setupEventListeners() {
        // Back to quiz button
        const backButton = document.querySelector('button[onclick*="index.html"]');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // How-to-vote button
        const htvButton = document.querySelector('button[onclick*="generateHTV"]');
        if (htvButton) {
            htvButton.addEventListener('click', () => this.generateHTV());
        }
    }

    /**
     * Generate How-To-Vote suggestions
     */
    generateHTV() {
        let scoresString = "Your Fusion Value Scores:\n";
        for (const valueId in this.userScores) {
            const value = this.fusionValues.find(v => v.id === valueId);
            if (value) {
                scoresString += `${value.name}: ${this.userScores[valueId].toFixed(0)}%\n`;
            }
        }
        scoresString += "\n(These scores will be sent to the AI for your How-To-Vote suggestion)";
        
        // For now, just show the scores
        alert(scoresString);
        console.log('User scores for HTV:', this.userScores);

        // TODO: Implement actual AI agent integration
        // This would involve calling an API endpoint with the user scores
        // and receiving personalized voting recommendations
    }

    /**
     * Add animations to the results page
     */
    addAnimations() {
        // Add fade-in animation for initial load
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);

        // Animate bars after a delay
        setTimeout(() => {
            this.fusionValues.forEach((value, index) => {
                const positiveBar = DOMUtils.getElementById(`bar-${value.id}-positive`);
                const negativeBar = DOMUtils.getElementById(`bar-${value.id}-negative`);
                
                if (positiveBar) {
                    positiveBar.style.transition = 'width 1s ease-in-out';
                    positiveBar.style.transitionDelay = `${index * 0.1}s`;
                }
                
                if (negativeBar) {
                    negativeBar.style.transition = 'width 1s ease-in-out';
                    negativeBar.style.transitionDelay = `${index * 0.1}s`;
                }
            });
        }, 500);
    }

    /**
     * Share results functionality
     */
    shareResults() {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: 'My Fusion Party Value Alignment Results',
                text: 'Check out my political value alignment results!',
                url: url
            });
        } else {
            // Fallback for browsers without Web Share API
            navigator.clipboard.writeText(url).then(() => {
                alert('Results link copied to clipboard!');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Results link copied to clipboard!');
            });
        }
    }
}

// Create global results manager instance
let resultsManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    resultsManager = new ResultsManager();
});

// Global functions for backward compatibility
window.generateHTV = () => {
    if (resultsManager) {
        resultsManager.generateHTV();
    }
};

window.shareResults = () => {
    if (resultsManager) {
        resultsManager.shareResults();
    }
};

// Export for module use
export default ResultsManager;
