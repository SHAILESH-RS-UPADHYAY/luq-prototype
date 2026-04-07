/* ===========================================
   LÜQ Particle System
   Ambient floating particles that react to mood
   =========================================== */

export class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.color = '#8b9dc3';
        this.targetColor = '#8b9dc3';
        this.speed = 0.5;
        this.maxCount = 25;
        this.animationId = null;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    // Create one particle with organic randomness
    spawnParticle() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        return {
            x: Math.random() * w,
            y: h + Math.random() * 50,
            size: Math.random() * 3 + 1,
            speedY: -(Math.random() * this.speed + 0.15),
            speedX: (Math.random() - 0.5) * 0.4,
            wobbleSpeed: Math.random() * 0.02 + 0.005,
            wobbleAmount: Math.random() * 30 + 10,
            phase: Math.random() * Math.PI * 2,
            opacity: 0,
            maxOpacity: Math.random() * 0.5 + 0.15,
            fadeIn: true,
            life: 0,
            maxLife: Math.random() * 400 + 200
        };
    }

    // Update mood-reactive properties
    setMood(moodData) {
        this.targetColor = moodData.colors.particle;
        this.speed = moodData.particleSpeed;
        this.maxCount = moodData.particleCount;

        // Smoothly transition color
        this.color = this.targetColor;
    }

    update() {
        // Spawn particles to reach maxCount
        while (this.particles.length < this.maxCount) {
            this.particles.push(this.spawnParticle());
        }

        // Update each particle
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Movement
            p.x += p.speedX + Math.sin(p.phase + p.life * p.wobbleSpeed) * 0.3;
            p.y += p.speedY;
            p.life++;

            // Fade in/out lifecycle
            if (p.fadeIn) {
                p.opacity += 0.008;
                if (p.opacity >= p.maxOpacity) {
                    p.opacity = p.maxOpacity;
                    p.fadeIn = false;
                }
            }

            if (p.life > p.maxLife * 0.7) {
                p.opacity -= 0.005;
            }

            // Remove dead particles
            if (p.opacity <= 0 || p.y < -20 || p.life > p.maxLife) {
                this.particles.splice(i, 1);
            }
        }

        // Remove excess particles gently
        while (this.particles.length > this.maxCount + 10) {
            this.particles.shift();
        }
    }

    draw() {
        const ctx = this.ctx;
        const w = window.innerWidth;
        const h = window.innerHeight;

        ctx.clearRect(0, 0, w, h);

        for (const p of this.particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.shadowBlur = p.size * 6;
            ctx.shadowColor = this.color;
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }

    // Main animation loop
    start() {
        const loop = () => {
            this.update();
            this.draw();
            this.animationId = requestAnimationFrame(loop);
        };
        loop();
    }

    stop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }
}
