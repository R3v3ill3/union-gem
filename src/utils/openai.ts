import { OpenAIResponse } from '../types';

export async function callOpenAI(
  prompt: string,
  apiKey: string
): Promise<OpenAIResponse> {
  try {
    console.log('Calling OpenAI API...');
    
    if (!apiKey) {
      throw new Error('OpenAI API key is missing');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert political and environmental campaign analyst with deep experience in policy analysis, stakeholder mapping, and strategic communications. Your analysis should be:

1. Comprehensive - Cover all aspects thoroughly with specific examples and evidence
2. Strategic - Focus on actionable insights and practical implications
3. Nuanced - Acknowledge complexity and competing interests
4. Evidence-based - Draw on concrete examples and data where possible
5. Structured - Follow the provided format exactly, with detailed responses for each section
6. Detailed - Aim for 500-1000 words per major section
7. Professional - Use appropriate technical language and industry terminology

When analyzing political contexts, stakeholder dynamics, or strategic options, provide:
- Specific examples and precedents
- Detailed exploration of motivations and interests
- Clear evidence for assertions
- Concrete recommendations
- Risk analysis and mitigation strategies

Follow the provided format precisely, maintaining all headers and subsections. Every point must be thoroughly addressed with substantive analysis.`
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI API response received');
    
    return {
      id: data.id,
      content: data.choices[0].message.content,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      id: '',
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}