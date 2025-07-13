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

    // Buscar contas ativas do usuário
    const { data: accounts } = await supabaseClient
      .from('ad_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (!accounts || accounts.length === 0) {
      return new Response(JSON.stringify({ message: 'No active accounts found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let totalSynced = 0;

    for (const account of accounts) {
      try {
        if (account.platform === 'google_ads') {
          totalSynced += await syncGoogleAdsCampaigns(supabaseClient, account);
        } else if (account.platform === 'meta_ads') {
          totalSynced += await syncMetaAdsCampaigns(supabaseClient, account);
        }
      } catch (error) {
        console.error(`Error syncing account ${account.id}:`, error);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      campaignsSynced: totalSynced 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sync-campaigns:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncGoogleAdsCampaigns(supabaseClient: any, account: any) {
  const campaignsResponse = await fetch(
    `https://googleads.googleapis.com/v14/customers/${account.account_id}/campaigns`,
    {
      headers: {
        'Authorization': `Bearer ${account.access_token_encrypted}`,
        'developer-token': Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN')!,
      },
    }
  );

  const campaignsData = await campaignsResponse.json();
  
  if (!campaignsData.results) return 0;

  let synced = 0;
  for (const campaign of campaignsData.results) {
    await supabaseClient.from('campaigns').upsert({
      user_id: account.user_id,
      ad_account_id: account.id,
      platform: 'google_ads',
      campaign_id: campaign.campaign.id,
      campaign_name: campaign.campaign.name,
      status: campaign.campaign.status,
      budget_amount: campaign.campaign.campaign_budget?.amount_micros ? 
        campaign.campaign.campaign_budget.amount_micros / 1000000 : 0,
      last_synced_at: new Date().toISOString(),
    }, { onConflict: 'campaign_id,platform' });
    synced++;
  }

  return synced;
}

async function syncMetaAdsCampaigns(supabaseClient: any, account: any) {
  const campaignsResponse = await fetch(
    `https://graph.facebook.com/v18.0/${account.account_id}/campaigns?fields=id,name,status,daily_budget,insights.date_preset(last_30d){spend,impressions,clicks,cpc,ctr,conversions}&access_token=${account.access_token_encrypted}`
  );

  const campaignsData = await campaignsResponse.json();
  
  if (!campaignsData.data) return 0;

  let synced = 0;
  for (const campaign of campaignsData.data) {
    const insights = campaign.insights?.data?.[0] || {};
    
    await supabaseClient.from('campaigns').upsert({
      user_id: account.user_id,
      ad_account_id: account.id,
      platform: 'meta_ads',
      campaign_id: campaign.id,
      campaign_name: campaign.name,
      status: campaign.status,
      budget_amount: campaign.daily_budget ? parseFloat(campaign.daily_budget) : 0,
      cost: insights.spend ? parseFloat(insights.spend) : 0,
      impressions: insights.impressions ? parseInt(insights.impressions) : 0,
      clicks: insights.clicks ? parseInt(insights.clicks) : 0,
      cpc: insights.cpc ? parseFloat(insights.cpc) : 0,
      ctr: insights.ctr ? parseFloat(insights.ctr) : 0,
      conversions: insights.conversions ? parseInt(insights.conversions) : 0,
      last_synced_at: new Date().toISOString(),
    }, { onConflict: 'campaign_id,platform' });
    synced++;
  }

  return synced;
}