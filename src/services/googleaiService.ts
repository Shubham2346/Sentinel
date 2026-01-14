import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

// Gemini Vision-capable model
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
});

// Utility: convert base64 image URL to Gemini format
const fileFromBase64 = (base64: string) => {
  const [, data] = base64.split(',');
  return {
    inlineData: {
      data,
      mimeType: 'image/jpeg' // or image/png
    }
  };
};

export const analyzeScene = async (imageData: string): Promise<string> => {
  try {
    const result = await model.generateContent([
      {
        text: 'Describe this scene for a visually impaired person. Focus on important objects, people, and potential hazards.'
      },
      fileFromBase64(imageData)
    ]);

    return result.response.text() || 'Could not analyze scene';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Error analyzing scene';
  }
};

export const answerQuestion = async (
  imageData: string,
  question: string
): Promise<string> => {
  try {
    const result = await model.generateContent([
      { text: question },
      fileFromBase64(imageData)
    ]);

    return result.response.text() || 'Could not answer question';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Error processing question';
  }
};
