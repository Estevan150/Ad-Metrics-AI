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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message, context, userId } = await req.json();
    
    console.log(`AI Contextual Assistant - User: ${userId}, Context: ${context}`);

    // Get user's current data for context
    const { data: campaigns } = await supabaseClient
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .limit(10);

    const { data: alerts } = await supabaseClient
      .from('alert_settings')
      .select('*')
      .eq('user_id', userId);

    const { data: automations } = await supabaseClient
      .from('automation_rules')
      .select('*')
      .eq('user_id', userId);

    // Build contextual prompt based on current screen/data
    let systemPrompt = `Você é um assistente de marketing digital especializado em campanhas publicitárias. 
    
Contexto atual do usuário:
- Tela atual: ${context}
- Campanhas ativas: ${campaigns?.length || 0}
- Alertas configurados: ${alerts?.length || 0}
- Regras de automação: ${automations?.length || 0}

Dados das campanhas:
${campaigns?.map(c => `- ${c.campaign_name}: Impressões: ${c.impressions}, Cliques: ${c.clicks}, CPC: R$${c.cpc?.toFixed(2)}`).join('\n')}

Forneça insights personalizados, sugestões de otimização e respostas específicas ao contexto atual do usuário.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro na API do OpenAI');
    }

    const aiResponse = data.choices[0].message.content;

    // Log interaction for learning
    await supabaseClient.from('change_history').insert({
      user_id: userId,
      action: 'ai_interaction',
      field_changed: 'ai_query',
      old_value: message,
      new_value: aiResponse,
      reason: `Context: ${context}`
    });

    return new Response(JSON.stringify({ 
      response: aiResponse,
      context,
      suggestions: generateContextualSuggestions(context, campaigns, alerts, automations)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-contextual-assistant:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateContextualSuggestions(context: string, campaigns: any[], alerts: any[], automations: any[]) {
  const suggestions = [];

  if (context === 'dashboard') {
    suggestions.push('Ver campanhas com maior CPC para otimização');
    if (campaigns?.length > 0) {
      suggestions.push('Configurar alertas para campanhas de baixa performance');
    }
  } else if (context === 'campaigns') {
    suggestions.push('Criar regras de automação para ajuste de orçamento');
    suggestions.push('Analisar performance por período específico');
  } else if (context === 'automation') {
    suggestions.push('Configurar alertas para quando regras são ativadas');
    suggestions.push('Criar backup de configurações importantes');
  }

  return suggestions;
}