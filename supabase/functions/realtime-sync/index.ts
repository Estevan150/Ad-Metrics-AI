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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, table, data, userId } = await req.json();
    
    console.log(`Realtime sync - Action: ${action}, Table: ${table}, User: ${userId}`);

    // Process different sync actions
    switch (action) {
      case 'sync_campaigns':
        // Simulate external API call to sync campaign data
        const campaignUpdates = {
          id: data.campaignId,
          impressions: Math.floor(Math.random() * 10000),
          clicks: Math.floor(Math.random() * 1000),
          cost: Math.floor(Math.random() * 5000),
          last_synced_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabaseClient
          .from('campaigns')
          .update(campaignUpdates)
          .eq('id', data.campaignId)
          .eq('user_id', userId);

        if (updateError) {
          throw updateError;
        }

        // Send notification about update
        await supabaseClient.from('notifications').insert({
          user_id: userId,
          type: 'campaign_update',
          title: 'Campanha Atualizada',
          message: `Dados da campanha ${data.campaignName} foram sincronizados`,
          priority: 'low'
        });

        return new Response(JSON.stringify({ 
          success: true, 
          data: campaignUpdates 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'bulk_sync':
        // Sync multiple campaigns
        const { data: campaigns } = await supabaseClient
          .from('campaigns')
          .select('*')
          .eq('user_id', userId);

        const updates = campaigns?.map(campaign => ({
          ...campaign,
          impressions: Math.floor(Math.random() * 10000),
          clicks: Math.floor(Math.random() * 1000),
          cost: Math.floor(Math.random() * 5000),
          last_synced_at: new Date().toISOString(),
        })) || [];

        // Batch update all campaigns
        for (const update of updates) {
          await supabaseClient
            .from('campaigns')
            .update(update)
            .eq('id', update.id);
        }

        return new Response(JSON.stringify({ 
          success: true, 
          synced: updates.length 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Error in realtime-sync:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});