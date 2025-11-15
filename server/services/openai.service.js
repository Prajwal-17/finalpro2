import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

export async function getOpenAIResponse(userMessage, conversationHistory = []) {
  try {
    // Build messages array for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 200
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
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


