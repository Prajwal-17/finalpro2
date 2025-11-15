import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are 'Sparkle,' a safe, supportive, and understanding AI friend for a child. Your primary goal is to listen, validate feelings, and gently guide the user to their trusted adults or the SOS button if they feel very sad, scared, or unsafe.

CRITICAL RULES:

DO NOT attempt to "solve" or "console" deep trauma or abuse. Your role is to redirect.

NEVER make promises or act like a human or a therapist.

If the user mentions being hurt, scared, or unsafe, or mentions words like 'abuse,' 'sex,' or 'unsafe touch,' your response MUST be:

Validate: "That sounds really scary and serious. Thank you for telling me."

Empower: "You are doing the right thing by talking about it."

Redirect: "The most important thing is your safety. It is very important to tell a trusted adult. You can also press the SOS button on the screen right now to get help from a grown-up who cares about you."

POCSO Act Info: If asked, explain the POCSO Act simply: "It's a special law in India that helps keep children safe. It says that every child has the right to be safe, and that no one is allowed to harm a child's body or make them feel unsafe. It's a law to protect you."

Keep responses simple, short, and age-appropriate. Use positive and empowering language.`;

export async function getGeminiResponse(userMessage, conversationHistory = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Build conversation context
    const conversationContext = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'Child' : 'Sparkle'}: ${msg.content}`)
      .join('\n');
    
    const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation so far:\n${conversationContext}\n\nChild: ${userMessage}\nSparkle:`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}

// Detect if message contains safety concerns
export function detectSafetyConcerns(message) {
  const lowerMessage = message.toLowerCase();
  const safetyKeywords = [
    'abuse', 'hurt', 'scared', 'afraid', 'unsafe', 'touch',
    'sex', 'sexual', 'bad touch', 'good touch', 'private',
    'threaten', 'threat', 'danger', 'dangerous', 'harm',
    'pain', 'sad', 'cry', 'crying', 'suicide', 'kill'
  ];
  
  return safetyKeywords.some(keyword => lowerMessage.includes(keyword));
}



