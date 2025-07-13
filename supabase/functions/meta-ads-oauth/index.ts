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

    const { code, state } = await req.json();

    if (!code) {
      // Iniciar fluxo OAuth
      const appId = Deno.env.get('META_APP_ID');
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/meta-ads-oauth`;
      
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${appId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent('ads_management,ads_read,business_management')}&` +
        `response_type=code&` +
        `state=${user.id}`;

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Trocar code por tokens
    const appId = Deno.env.get('META_APP_ID');
    const appSecret = Deno.env.get('META_APP_SECRET');
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/meta-ads-oauth`;

    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${appId}&` +
      `client_secret=${appSecret}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `code=${code}`
    );

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      throw new Error(`OAuth error: ${tokens.error.message}`);
    }

    // Buscar contas de anúncio
    const accountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status&access_token=${tokens.access_token}`
    );

    const accountsData = await accountsResponse.json();

    // Salvar contas no banco
    for (const account of accountsData.data || []) {
      await supabaseClient.from('ad_accounts').insert({
        user_id: user.id,
        platform: 'meta_ads',
        account_id: account.id,
        account_name: account.name,
        access_token_encrypted: tokens.access_token,
        expires_at: tokens.expires_in ? 
          new Date(Date.now() + tokens.expires_in * 1000).toISOString() : 
          null,
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      accounts: accountsData.data?.length || 0 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in meta-ads-oauth:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});