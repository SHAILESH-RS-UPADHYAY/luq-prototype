/* ===========================================
   LÜQ Mood Engine
   Reads human text → returns emotional data
   =========================================== */

const MOODS = {
    joy: {
        keywords: [
            'happy', 'excited', 'great', 'wonderful', 'amazing', 'awesome',
            'fantastic', 'brilliant', 'incredible', 'perfect', 'beautiful',
            'laugh', 'smile', 'fun', 'celebrate', 'proud', 'blessed',
            'cheerful', 'delighted', 'thrilled', 'joyful', 'glad',
            'yay', 'haha', 'nice', 'wow', 'cool', 'sweet', 'best',
            'enjoying', 'winning', 'success', 'good', 'love it'
        ],
        colors: {
            bg: '#0f0d05', glow: 'rgba(255, 213, 79, 0.35)',
            glowSolid: '#ffd54f', body: '#fff3e0',
            highlight: '#ffffff', shadow: '#ffe0b2',
            eye: '#5d4037', whisper: '#ffd54f', particle: '#ffd54f'
        },
        whispers: ['...that warmth ✨', 'I see the light in that', '...radiant', '...keep glowing'],
        eyeStyle: 'happy', bodyAnim: 'body-bounce',
        particleSpeed: 1.5, particleCount: 50
    },
    sadness: {
        keywords: [
            'sad', 'lonely', 'depressed', 'unhappy', 'miss', 'crying', 'hurt',
            'pain', 'broken', 'lost', 'empty', 'tears', 'sorry', 'grief',
            'heartbreak', 'alone', 'gloomy', 'disappointed', 'hopeless',
            'miserable', 'down', 'despair', 'numb', 'hollow'
        ],
        colors: {
            bg: '#050810', glow: 'rgba(92, 107, 192, 0.25)',
            glowSolid: '#5c6bc0', body: '#c5cae9',
            highlight: '#e8eaf6', shadow: '#7986cb',
            eye: '#1a237e', whisper: '#7986cb', particle: '#5c6bc0'
        },
        whispers: ["...I'm right here", "you don't have to explain", '...I know', '...not alone'],
        eyeStyle: 'sad', bodyAnim: 'body-slow-drift',
        particleSpeed: 0.3, particleCount: 20
    },
    calm: {
        keywords: [
            'calm', 'peaceful', 'relaxed', 'serene', 'comfortable',
            'tranquil', 'quiet', 'gentle', 'chill', 'mellow', 'zen',
            'balanced', 'mindful', 'meditate', 'soothing', 'grounded'
        ],
        colors: {
            bg: '#051010', glow: 'rgba(77, 182, 172, 0.25)',
            glowSolid: '#4db6ac', body: '#b2dfdb',
            highlight: '#e0f2f1', shadow: '#80cbc4',
            eye: '#004d40', whisper: '#4db6ac', particle: '#4db6ac'
        },
        whispers: ['...breathe', 'this is enough', '...peace', '...be here'],
        eyeStyle: 'calm', bodyAnim: 'body-gentle-pulse',
        particleSpeed: 0.5, particleCount: 25
    },
    anxiety: {
        keywords: [
            'anxious', 'worried', 'nervous', 'stressed', 'overwhelmed', 'panic',
            'fear', 'scared', 'afraid', 'tense', 'restless', 'dread',
            'terrified', 'uncertain', 'insecure', 'doubt', 'overthink'
        ],
        colors: {
            bg: '#0a050f', glow: 'rgba(171, 71, 188, 0.25)',
            glowSolid: '#ab47bc', body: '#e1bee7',
            highlight: '#f3e5f5', shadow: '#ce93d8',
            eye: '#4a148c', whisper: '#ab47bc', particle: '#ab47bc'
        },
        whispers: ["...you're safe here", 'one breath at a time', "...I'm not leaving", '...slow down with me'],
        eyeStyle: 'anxious', bodyAnim: 'body-tremble',
        particleSpeed: 2, particleCount: 40
    },
    anger: {
        keywords: [
            'angry', 'frustrated', 'annoyed', 'furious', 'mad', 'irritated',
            'rage', 'hate', 'pissed', 'livid', 'bitter', 'disgusted',
            'fed up', 'fuming', 'ugh', 'damn', 'stupid'
        ],
        colors: {
            bg: '#0f0505', glow: 'rgba(239, 83, 80, 0.3)',
            glowSolid: '#ef5350', body: '#ffcdd2',
            highlight: '#ffebee', shadow: '#ef9a9a',
            eye: '#b71c1c', whisper: '#ef5350', particle: '#ef5350'
        },
        whispers: ['...I hear you', 'that matters', '...let it be felt', '...valid'],
        eyeStyle: 'angry', bodyAnim: 'body-shake',
        particleSpeed: 2.5, particleCount: 45
    },
    tired: {
        keywords: [
            'tired', 'exhausted', 'sleepy', 'drained', 'fatigue', 'weary',
            'burnout', 'drowsy', 'sluggish', 'no energy', 'worn out', 'yawn'
        ],
        colors: {
            bg: '#0a0510', glow: 'rgba(149, 117, 205, 0.25)',
            glowSolid: '#9575cd', body: '#d1c4e9',
            highlight: '#ede7f6', shadow: '#b39ddb',
            eye: '#311b92', whisper: '#9575cd', particle: '#9575cd'
        },
        whispers: ['...rest now', 'no rush', '...shhh', "...it's okay to pause"],
        eyeStyle: 'tired', bodyAnim: 'body-slow-drift',
        particleSpeed: 0.2, particleCount: 15
    },
    love: {
        keywords: [
            'love', 'adore', 'grateful', 'thankful', 'appreciate', 'care',
            'cherish', 'warmth', 'heart', 'compassion', 'kindness',
            'hug', 'embrace', 'devoted', 'fond', 'tender'
        ],
        colors: {
            bg: '#0f050a', glow: 'rgba(236, 64, 122, 0.3)',
            glowSolid: '#ec407a', body: '#fce4ec',
            highlight: '#fff0f5', shadow: '#f48fb1',
            eye: '#880e4f', whisper: '#ec407a', particle: '#ec407a'
        },
        whispers: ['...beautiful', 'hold onto that', '...warm', "...that's everything"],
        eyeStyle: 'love', bodyAnim: 'body-gentle-sway',
        particleSpeed: 0.8, particleCount: 35
    }
};

// Neutral fallback
const NEUTRAL = {
    colors: {
        bg: '#0a0a0f', glow: 'rgba(139, 157, 195, 0.25)',
        glowSolid: '#8b9dc3', body: '#d0d5e2',
        highlight: '#e8eaf6', shadow: '#9fa8c5',
        eye: '#2c3e50', whisper: '#8b9dc3', particle: '#8b9dc3'
    },
    whispers: ["...I'm here", '...', '...listening'],
    eyeStyle: 'neutral', bodyAnim: '',
    particleSpeed: 0.5, particleCount: 25
};

// Words that amplify intensity
const INTENSIFIERS = ['very', 'so', 'really', 'extremely', 'super', 'absolutely', 'deeply', 'completely', 'utterly', 'incredibly'];

/**
 * Analyze text and return the dominant mood with visual properties
 */
export function analyzeMood(text) {
    const lower = text.toLowerCase().trim();
    if (!lower) return { mood: 'neutral', intensity: 0, ...NEUTRAL };

    const scores = {};

    // Score each mood based on keyword matches
    for (const [moodName, moodData] of Object.entries(MOODS)) {
        let score = 0;
        for (const keyword of moodData.keywords) {
            if (lower.includes(keyword)) {
                score += 1;
                // Bonus points for longer / more specific keywords
                if (keyword.length > 5) score += 0.5;
            }
        }
        if (score > 0) scores[moodName] = score;
    }

    // Find the winning mood
    const entries = Object.entries(scores);
    if (entries.length === 0) return { mood: 'neutral', intensity: 0.3, ...NEUTRAL };

    entries.sort((a, b) => b[1] - a[1]);
    const [winningMood, winningScore] = entries[0];
    const moodData = MOODS[winningMood];

    // Calculate intensity (0 to 1)
    let intensity = Math.min(winningScore / 4, 1);
    const hasIntensifier = INTENSIFIERS.some(w => lower.includes(w));
    if (hasIntensifier) intensity = Math.min(intensity + 0.3, 1);

    // Pick a random whisper
    const whisper = moodData.whispers[Math.floor(Math.random() * moodData.whispers.length)];

    return {
        mood: winningMood,
        intensity,
        colors: moodData.colors,
        whisper,
        eyeStyle: moodData.eyeStyle,
        bodyAnim: moodData.bodyAnim,
        particleSpeed: moodData.particleSpeed,
        particleCount: moodData.particleCount
    };
}

export { NEUTRAL };
