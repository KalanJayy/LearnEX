
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [], model = 'openai' } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Processing chat message:', message, 'with model:', model);

    let aiResponse;

    if (model === 'gemini') {
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
      if (!geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      // Prepare conversation context for Gemini
      const conversationText = conversationHistory
        .slice(-10)
        .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      const systemPrompt = `You are LearnEX AI, a helpful learning and career development assistant. You help users with:
- Creating learning roadmaps and career guidance
- Answering questions about skills and technologies
- Providing study tips and learning strategies
- General educational support

Keep responses conversational, helpful, and focused on learning and development. Be encouraging and provide actionable advice when possible.

Previous conversation:
${conversationText}

Current user message: ${message}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      aiResponse = data.candidates[0].content.parts[0].text;

    } else {
      // OpenAI logic (existing)
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const messages = [
        {
          role: 'system',
          content: `You are LearnEX AI, a helpful learning and career development assistant. You help users with:
          - Creating learning roadmaps and career guidance
          - Answering questions about skills and technologies
          - Providing study tips and learning strategies
          - General educational support
          
          Keep responses conversational, helpful, and focused on learning and development. Be encouraging and provide actionable advice when possible.`
        },
        ...conversationHistory.slice(-10),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      aiResponse = data.choices[0].message.content;
    }

    console.log('AI response generated successfully with', model);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString(),
      model: model
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to process chat message'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
