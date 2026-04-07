/* ===========================================
   LÜQ Character Controller
   Manages expressions, animations, whispers
   =========================================== */

export class Luq {
    constructor() {
        this.body = document.getElementById('luq-body');
        this.aura = document.getElementById('luq-aura');
        this.eyeLeft = document.getElementById('luq-eye-left');
        this.eyeRight = document.getElementById('luq-eye-right');
        this.whisperEl = document.getElementById('luq-whisper');
        this.currentMood = 'neutral';
        this.currentAnim = '';
        this.whisperTimeout = null;
        this.idleTimer = null;

        // Start idle behavior after entrance
        setTimeout(() => this.startIdleCycle(), 4000);
    }

    // Update LÜQ's visual state based on mood data
    setMood(moodData) {
        this.currentMood = moodData.mood || 'neutral';

        // Update CSS variables for smooth color transitions
        const root = document.documentElement;
        const c = moodData.colors;
        root.style.setProperty('--bg-color', c.bg);
        root.style.setProperty('--glow-color', c.glow);
        root.style.setProperty('--glow-solid', c.glowSolid);
        root.style.setProperty('--body-color', c.body);
        root.style.setProperty('--body-highlight', c.highlight);
        root.style.setProperty('--body-shadow', c.shadow);
        root.style.setProperty('--eye-color', c.eye);
        root.style.setProperty('--whisper-color', c.whisper);

        // Set eye expression
        this.setFace(moodData.eyeStyle);

        // Set body animation
        this.setBodyAnimation(moodData.bodyAnim);

        // Show whisper
        if (moodData.whisper) {
            this.showWhisper(moodData.whisper);
        }

        // Reset idle timer — user is active
        this.resetIdleTimer();
    }

    // Change face expression (eyes + mouth)
    setFace(style) {
        const eyes = [this.eyeLeft, this.eyeRight];
        const allStyles = ['happy', 'sad', 'calm', 'anxious', 'angry', 'tired', 'love', 'neutral'];
        
        // --- 1. Reset mouth styling ---
        this.mouth = document.getElementById('luq-mouth');
        if(this.mouth) {
            this.mouth.style.transform = 'translateX(-50%) scale(1)';
            this.mouth.style.borderRadius = '4px';
            this.mouth.style.width = '14px';
            this.mouth.style.height = '4px';
            this.mouth.style.top = '55%';
            this.mouth.style.opacity = '0.6';
        }

        // --- 2. Update eyes & mouth based on mood ---
        eyes.forEach(eye => {
            allStyles.forEach(s => eye.classList.remove(s));

            switch (style) {
                case 'happy':
                    // Happy eyes ^ ^ and big smile
                    eye.style.transform = 'scaleY(0.65)';
                    eye.style.borderRadius = '50% 50% 40% 40%';
                    if(this.mouth) {
                        this.mouth.style.transform = 'translateX(-50%) rotate(0deg)';
                        this.mouth.style.borderRadius = '0 0 10px 10px';
                        this.mouth.style.height = '10px';
                        this.mouth.style.width = '20px';
                        this.mouth.style.top = '56%';
                    }
                    break;
                case 'sad':
                    // Droopy eyes and slight frown
                    eye.style.transform = 'scaleY(0.85) translateY(3px)';
                    eye.style.borderRadius = '50%';
                    eye.style.opacity = '0.75';
                    if(this.mouth) {
                        this.mouth.style.transform = 'translateX(-50%) rotate(0deg)';
                        this.mouth.style.borderRadius = '10px 10px 0 0';
                        this.mouth.style.height = '8px';
                        this.mouth.style.width = '16px';
                        this.mouth.style.top = '58%';
                    }
                    break;
                case 'calm':
                    // Half-closed relaxed eyes, soft minimal mouth
                    eye.style.transform = 'scaleY(0.45)';
                    eye.style.borderRadius = '50%';
                    if(this.mouth) {
                        this.mouth.style.width = '10px';
                        this.mouth.style.height = '2px';
                        this.mouth.style.opacity = '0.4';
                    }
                    break;
                case 'anxious':
                    // Wide eyes, wobbly/shrunk mouth
                    eye.style.transform = 'scale(1.25)';
                    eye.style.borderRadius = '50%';
                    if(this.mouth) {
                        this.mouth.style.width = '8px';
                        this.mouth.style.height = '8px';
                        this.mouth.style.borderRadius = '50%';
                        this.mouth.style.top = '58%';
                    }
                    break;
                case 'angry':
                    // Glaring eyes, tight straight mouth
                    eye.style.transform = 'scaleY(0.6) scaleX(1.1)';
                    eye.style.borderRadius = '40%';
                    if(this.mouth) {
                        this.mouth.style.width = '22px';
                        this.mouth.style.height = '3px';
                        this.mouth.style.top = '54%';
                    }
                    break;
                case 'tired':
                    // Very droopy eyes, sleepy open mouth
                    eye.style.transform = 'scaleY(0.25)';
                    eye.style.borderRadius = '50%';
                    if(this.mouth) {
                        this.mouth.style.width = '12px';
                        this.mouth.style.height = '12px';
                        this.mouth.style.borderRadius = '50%';
                        this.mouth.style.opacity = '0.3';
                        this.mouth.style.top = '57%';
                    }
                    break;
                case 'love':
                    // Soft eyes, sweet little smile
                    eye.style.transform = 'scaleY(0.7)';
                    eye.style.borderRadius = '50% 50% 45% 45%';
                    if(this.mouth) {
                        this.mouth.style.borderRadius = '0 0 10px 10px';
                        this.mouth.style.height = '6px';
                        this.mouth.style.width = '12px';
                    }
                    break;
                default:
                    // Neutral baseline
                    eye.style.transform = 'scaleY(1)';
                    eye.style.borderRadius = '50%';
                    eye.style.opacity = '1';
            }
        });
    }

    // Switch body animation class
    setBodyAnimation(animClass) {
        if (this.currentAnim) {
            this.body.classList.remove(this.currentAnim);
        }
        if (animClass) {
            this.body.classList.add(animClass);
            this.currentAnim = animClass;
        }
    }

    // Display a whisper with fade in/out
    showWhisper(text) {
        // Clear any existing whisper timeout
        if (this.whisperTimeout) clearTimeout(this.whisperTimeout);

        // Fade out current whisper
        this.whisperEl.classList.remove('visible');

        // After fade out, change text and fade in
        setTimeout(() => {
            this.whisperEl.textContent = text;
            this.whisperEl.classList.add('visible');
        }, 400);

        // Auto-fade after some time
        this.whisperTimeout = setTimeout(() => {
            this.whisperEl.classList.remove('visible');
        }, 6000);
    }

    // Idle behaviors when user isn't typing
    startIdleCycle() {
        // First whisper after entrance
        this.showWhisper('...hello');

        this.resetIdleTimer();
    }

    resetIdleTimer() {
        if (this.idleTimer) clearTimeout(this.idleTimer);

        this.idleTimer = setTimeout(() => {
            const idleWhispers = ['...still here', '...take your time', '...', '...listening'];
            const pick = idleWhispers[Math.floor(Math.random() * idleWhispers.length)];
            this.showWhisper(pick);

            // Continue idle cycle
            this.resetIdleTimer();
        }, 15000 + Math.random() * 10000);
    }

    // Return to neutral state
    reset() {
        this.setEyes('neutral');
        this.setBodyAnimation('');
    }
}
