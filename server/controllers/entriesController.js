import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const getEntries = async (req, res) => {
    try {
        const entries = await prisma.entry.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(entries);
    } catch (error) {
        console.error('Get entries error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getEntryById = async (req, res) => {
    try {
        const entry = await prisma.entry.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        })
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' })
        }
        res.json(entry)
    } catch (error) {
        console.error('Get entry by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const analyzeEntry = async (req, res) => {
    try {
        const { text } = req.body;
        
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base',
            { inputs: text },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log(`Hugging face response for ${text}`, response.data);
        
        const emotions = response.data[0].reduce((acc, { label, score }) => {
            acc[label] = score;
            return acc;
        }, {});

        // Generate summary
        const dominantEmotion = Object.entries(emotions)
            .sort((a, b) => b[1] - a[1])[0];

        const summaries = {
            joy: "I sense positive energy in your words!",
            sadness: "I notice some heaviness in your words.",
            anger: "I sense frustration coming through.",
            fear: "It seems there's some apprehension here.",
            surprise: "Unexpected emotions can be insightful!",
            disgust: "Strong reactions often point to important boundaries.",
            neutral: "Your entry seems balanced and reflective."
        };

        const summary = summaries[dominantEmotion[0]] || "Thank you for sharing your thoughts.";

        res.json({ emotions, summary });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ message: 'Analysis failed' });
    }
};





const createEntry = async (req, res) => {
    try {
        const { content, emotions, triggers, summary } = req.body;
        const entry = await prisma.entry.create({
            data: {
                content,
                emotions,
                triggers,
                summary,
                userId: req.user.id
            }
        })
        res.status(201).json(entry)
    } catch (error) {
        console.error('Create entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateEntry = async (req, res) => {
    try {
        const { content, emotions, triggers, summary } = req.body;
        let entry = await prisma.entry.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        })
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' })
        }
        entry = await prisma.entry.update({
            where: { id: entry.id },
            data: { content, emotions, triggers, summary }
        })
        res.json(entry)
    } catch (error) {
        console.error('Update entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteEntry = async (req, res) => {
    try {
        const entry = await prisma.entry.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        })
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' })
        }
        await prisma.entry.delete({ where: { id: entry.id } })
        res.json({ message: 'Entry removed' })
    } catch (error) {
        console.error('Delete entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
const extractTriggers = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: 'Text is required' });
        }

        console.log(`Fast trigger extraction: "${text}"`);
        
        // OPTION 1: Use DistilBART (3x faster than BART-large)
        // This is the fastest zero-shot classification model
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/valhalla/distilbart-mnli-12-1',
            { 
                inputs: text,
                parameters: {
                    candidate_labels: [
                        // Work triggers (8)
                        "work deadline", "boss meeting", "project completion", 
                        "work overwhelm", "career milestone", "workplace conflict",
                        "team collaboration", "performance review",
                        
                        // Personal life triggers (8)
                        "family gathering", "household chores", "personal accomplishment",
                        "social event", "relationship issue", "friend meetup",
                        "family conflict", "quality time",
                        
                        // Daily activities (8)
                        "exercise routine", "meal preparation", "cleaning tasks",
                        "errands", "shopping", "commute", "studying", "hobbies",
                        
                        // Challenges (6)
                        "time pressure", "financial stress", "technology problem",
                        "health concern", "sleep issue", "unexpected event"
                    ],
                    multi_label: true
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 12000
            }
        );
        
        console.log('DistilBART response:', response.data);

        let triggers = [];
        
        if (response.data && response.data.labels && response.data.scores) {
            triggers = response.data.labels
                .map((label, index) => ({
                    label,
                    score: response.data.scores[index]
                }))
                .filter(item => item.score > 0.25) // Lower threshold for distilbart
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map(item => item.label);
        }

        // Enhanced contextual extraction as backup
        if (triggers.length < 2) {
            const contextualTriggers = extractDetailedTriggers(text, triggers);
            triggers = [...new Set([...triggers, ...contextualTriggers])].slice(0, 5);
        }

        console.log('Final triggers:', triggers);
        
        res.json({ 
            triggers,
            model: 'distilbart-mnli-fast'
        });
        
    } catch (error) {
        console.error('Trigger extraction error:', error.message);
        
        // Robust fallback with pattern-based extraction
        const triggers = extractDetailedTriggers(req.body.text || '', []);
        res.json({ 
            triggers: triggers.length > 0 ? triggers : ['general reflection'],
            fallback: true
        });
    }
};

// Enhanced trigger extraction from text patterns
function extractDetailedTriggers(text, existingTriggers) {
    if (!text || text.trim().length === 0) return [];
    
    const lower = text.toLowerCase();
    const triggers = [];
    
    // Comprehensive trigger patterns
    const triggerPatterns = {
        // Work-related
        'work deadline': ['deadline', 'due date', 'submit', 'presentation due'],
        'project completion': ['finish project', 'complete', 'done with', 'accomplish'],
        'work meeting': ['meeting', 'presentation', 'boss', 'manager'],
        'work stress': ['overwhelm at work', 'too much work', 'workload', 'pressure'],
        
        // Family & relationships
        'family time': ['family', 'mom', 'dad', 'parents', 'siblings', 'relatives'],
        'family conflict': ['argue with', 'fight with family', 'family problem'],
        'relationship issue': ['partner', 'boyfriend', 'girlfriend', 'spouse'],
        'friend hangout': ['friend', 'friends', 'hangout', 'catch up'],
        
        // Personal achievements
        'homework completion': ['homework', 'assignment', 'study', 'exam'],
        'household chores': ['laundry', 'dishes', 'cleaning', 'chores', 'organize'],
        'personal goal': ['goal', 'achieve', 'accomplish', 'milestone'],
        'exercise': ['workout', 'gym', 'run', 'exercise', 'fitness'],
        
        // Daily activities
        'cooking': ['cook', 'meal', 'dinner', 'lunch', 'breakfast', 'recipe'],
        'shopping': ['shop', 'grocery', 'buy', 'purchase', 'store'],
        'commute': ['drive', 'traffic', 'commute', 'travel'],
        
        // Challenges
        'time management': ['busy', 'no time', 'rushed', 'hurry'],
        'financial stress': ['money', 'expensive', 'cost', 'budget', 'afford'],
        'technology issue': ['computer', 'phone', 'wifi', 'internet', 'device'],
        'sleep problem': ['tired', 'sleep', 'exhausted', 'fatigue', 'insomnia'],
        'health concern': ['sick', 'pain', 'doctor', 'health', 'medication'],
        
        // Positive moments
        'relaxation': ['relax', 'calm', 'peaceful', 'rest', 'chill'],
        'celebration': ['celebrate', 'party', 'birthday', 'anniversary'],
        'nice weather': ['sunny', 'beautiful day', 'pretty day', 'weather'],
        'hobby time': ['hobby', 'paint', 'read', 'game', 'music', 'creative']
    };
    
    // Score each trigger based on keyword matches
    const triggerScores = {};
    
    for (const [trigger, keywords] of Object.entries(triggerPatterns)) {
        let score = 0;
        for (const keyword of keywords) {
            if (lower.includes(keyword)) {
                score += keyword.length; // Longer matches = more specific
            }
        }
        if (score > 0 && !existingTriggers.includes(trigger)) {
            triggerScores[trigger] = score;
        }
    }
    
    // Get top scoring triggers
    const sortedTriggers = Object.entries(triggerScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([trigger]) => trigger);
    
    triggers.push(...sortedTriggers);
    
    // Extract key phrases if we still need more triggers
    if (triggers.length < 3) {
        const phrases = extractKeyPhrases(text);
        triggers.push(...phrases.filter(p => !triggers.includes(p)));
    }
    
    return triggers.slice(0, 5);
}

function extractKeyPhrases(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const phrases = [];
    
    // Activity verbs that indicate triggers
    const activityVerbs = [
        'finish', 'complete', 'start', 'begin', 'do', 'make', 'create',
        'attend', 'meet', 'call', 'visit', 'help', 'fix', 'solve'
    ];
    
    for (const sentence of sentences) {
        const lower = sentence.toLowerCase().trim();
        const words = lower.split(/\s+/);
        
        // Look for verb + noun patterns
        for (let i = 0; i < words.length - 1; i++) {
            const verb = words[i];
            if (activityVerbs.includes(verb)) {
                // Get next 1-2 words as the activity
                const activity = words.slice(i, Math.min(i + 3, words.length)).join(' ');
                if (activity.length > 5 && activity.length < 30) {
                    phrases.push(activity);
                    break;
                }
            }
        }
    }
    
    return phrases.slice(0, 2);
}


export { 
    getEntries, 
    getEntryById, 
    analyzeEntry, 
    extractTriggers, 
    createEntry, 
    updateEntry, 
    deleteEntry 
};