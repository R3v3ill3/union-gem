import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple UUID generation function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function callGemini(
  prompt: string,
  apiKey: string
): Promise<{ id: string; content: string; error?: string }> {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is missing. Please obtain a key from Google AI Studio (https://makersuite.google.com/app/apikey)');
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the model (using Gemini 1.5 Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    return {
      id: generateUUID(),
      content: text,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Provide more specific error messages
    let errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('404')) {
      errorMessage = 'API error: Please check that you:\n1. Have enabled the Gemini API in your Google AI Studio project\n2. Have billing set up\n3. Are using the correct model name (gemini-1.5-pro)';
    } else if (errorMessage.includes('403')) {
      errorMessage = 'Authentication error: Please verify your API key and ensure billing is enabled.';
    }

    return {
      id: '',
      content: '',
      error: errorMessage,
    };
  }
}