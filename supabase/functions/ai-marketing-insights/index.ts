import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user } } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, campaignData } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = '';
    let systemMessage = 'Você é um especialista em marketing digital e análise de campanhas publicitárias.';

    switch (action) {
      case 'analyze_performance':
        prompt = `Analise o desempenho das seguintes campanhas:
${JSON.stringify(campaignData, null, 2)}

Forneça insights sobre:
1. Campanhas com melhor ROI
2. Sugestões de otimização
3. Oportunidades de crescimento
4. Alertas importantes`;
        break;

      case 'optimize_suggestions':
        prompt = `Com base nos dados da campanha:
${JSON.stringify(campaignData, null, 2)}

Forneça recomendações específicas para:
1. Ajuste de orçamento
2. Otimização de palavras-chave
3. Melhoria de CTR
4. Redução de CPC`;
        break;

      case 'forecast_analysis':
        prompt = `Analise as tendências das campanhas:
${JSON.stringify(campaignData, null, 2)}

Forneça previsões para:
1. Performance esperada no próximo mês
2. Orçamento recomendado
3. Potencial de crescimento
4. Riscos identificados`;
        break;

      default:
        throw new Error('Invalid action');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const insights = data.choices[0].message.content;

    // Salvar insights no banco para histórico
    await supabaseClient.from('ai_insights').insert({
      user_id: user.id,
      action,
      insights,
      campaign_data: campaignData,
    });

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-marketing-insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});