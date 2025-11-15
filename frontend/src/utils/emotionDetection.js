/**
 * Simple emotion detection based on keyword matching
 * Detects negative emotions and safety concerns
 */

const NEGATIVE_KEYWORDS = [
  'sad', 'scared', 'afraid', 'hurt', 'pain', 'cry', 'crying',
  'hate', 'angry', 'mad', 'frustrated', 'worried', 'anxious',
  'lonely', 'alone', 'bad', 'terrible', 'awful', 'horrible'
];

const SAFETY_KEYWORDS = [
  'abuse', 'hurt', 'unsafe', 'danger', 'dangerous', 'threat',
  'scared', 'afraid', 'touch', 'private', 'sex', 'sexual',
  'harm', 'pain', 'kill', 'suicide'
];

export function detectEmotion(text) {
  if (!text || typeof text !== 'string') {
    return { emotion: 'neutral', level: 0, hasSafetyConcern: false };
  }
  
  const lowerText = text.toLowerCase();
  let negativeCount = 0;
  let safetyCount = 0;
  
  // Count negative keywords
  NEGATIVE_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      negativeCount++;
    }
  });
  
  // Count safety keywords
  SAFETY_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      safetyCount++;
    }
  });
  
  // Determine emotion
  if (safetyCount > 0) {
    return {
      emotion: 'concerned',
      level: Math.min(safetyCount * 2, 10),
      hasSafetyConcern: true
    };
  } else if (negativeCount > 2) {
    return {
      emotion: 'negative',
      level: Math.min(negativeCount, 10),
      hasSafetyConcern: false
    };
  } else if (negativeCount > 0) {
    return {
      emotion: 'slightly_negative',
      level: negativeCount,
      hasSafetyConcern: false
    };
  }
  
  return {
    emotion: 'neutral',
    level: 0,
    hasSafetyConcern: false
  };
}

export function getEmotionIcon(emotion) {
  switch (emotion) {
    case 'concerned':
      return '😟';
    case 'negative':
      return '😢';
    case 'slightly_negative':
      return '😐';
    default:
      return '✨';
  }
}

export function getEmotionColor(emotion) {
  switch (emotion) {
    case 'concerned':
      return 'text-red-400';
    case 'negative':
      return 'text-orange-400';
    case 'slightly_negative':
      return 'text-yellow-400';
    default:
      return 'text-cyan-400';
  }
}


