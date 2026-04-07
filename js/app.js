/* ===========================================
   LÜQ — Main Application
   Connects mood engine, character, and particles
   =========================================== */

import { analyzeMood, NEUTRAL } from './mood-engine.js';
import { Luq } from './luq.js';
import { ParticleSystem } from './particles.js';

// Wait for page to be ready
document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize components ---
    const canvas = document.getElementById('particle-canvas');
    const input = document.getElementById('feeling-input');
    const hint = document.getElementById('input-hint');

    const luq = new Luq();
    const particles = new ParticleSystem(canvas);

    // Start the particle system
    particles.start();

    // --- Handle user input ---
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            const text = input.value.trim();

            // Analyze the mood from text
            const moodResult = analyzeMood(text);

            // Update LÜQ's appearance
            luq.setMood(moodResult);

            // Update particles
            particles.setMood(moodResult);

            // Clear input with a gentle delay
            setTimeout(() => {
                input.value = '';
            }, 150);

            // Briefly hide the hint
            hint.style.opacity = '0';
            setTimeout(() => {
                hint.style.opacity = '';
            }, 3000);
        }
    });

    // Subtle input glow effect while typing
    input.addEventListener('input', () => {
        if (input.value.length > 0) {
            hint.textContent = 'press enter to share';
        }
    });

    // Focus input when clicking anywhere (except the input itself)
    document.addEventListener('click', (e) => {
        if (e.target !== input) {
            input.focus();
        }
    });

    // Auto-focus after entrance animation
    setTimeout(() => {
        input.focus();
    }, 4000);

});
