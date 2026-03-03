import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const API_KEY = Deno.env.get('GROQ_API_KEY')
const API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, url } = await req.json()
    let contentToAnalyze = text;

    if (!contentToAnalyze && url) {
      // If URL is provided instead of text, fetch it
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });
      if (!response.ok) throw new Error(`Impossible de récupérer l'URL: ${response.statusText}`);
      const rawHtml = await response.text();
      // Rudimentary stripping of HTML tags for better context and fewer tokens
      contentToAnalyze = rawHtml.replace(/<[^>]*>?/gm, ' ')
                                .replace(/\s+/g, ' ')
                                .trim();
    }

    if (!contentToAnalyze || !API_KEY) {
      return new Response(JSON.stringify({ error: !API_KEY ? 'GROQ_API_KEY non configurée' : 'Données manquant pour l\'analyse' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const prompt = `Analyze this job offer content and extract a clean JSON object. 
    If the content is not a job offer, return an error field in JSON.
    Fields: company_name, job_profile, proposed_salary (as text, ex: 50-60k€), main_missions (brief bullet points), primary_skills (comma separated), company_info (short description).
    Job Content: ${contentToAnalyze.substring(0, 6000)}`

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an HR expert system. Answer ONLY with a valid JSON object. No intro, no outro.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0,
        response_format: { type: "json_object" }
      }),
    })

    const result = await response.json()
    if (!result.choices?.[0]?.message?.content) {
        throw new Error('Erreur lors de l\'appel à l\'IA');
    }
    
    const content = result.choices[0].message.content
    const data = typeof content === 'string' ? JSON.parse(content) : content;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
