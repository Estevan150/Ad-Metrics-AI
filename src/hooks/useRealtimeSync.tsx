import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useRealtimeSync() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime subscriptions...');

    // Subscribe to campaigns table changes
    const campaignsChannel = supabase
      .channel('campaigns-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'campaigns',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Campaign updated:', payload.new);
          toast({
            title: "Campanha Atualizada",
            description: `${payload.new.campaign_name} foi sincronizada`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification:', payload.new);
          
          // Show toast for high priority notifications
          if (payload.new.priority === 'high') {
            toast({
              title: payload.new.title,
              description: payload.new.message,
              variant: payload.new.type === 'alert' ? 'destructive' : 'default',
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Campaigns subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Subscribe to automation rules triggers
    const automationChannel = supabase
      .channel('automation-triggers')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'automation_rules',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new.is_active) {
            console.log('Automation rule triggered:', payload.new);
            toast({
              title: "Regra de Automação Ativada",
              description: `${payload.new.name} foi executada`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscriptions...');
      supabase.removeChannel(campaignsChannel);
      supabase.removeChannel(automationChannel);
      setIsConnected(false);
    };
  }, [user, toast]);

  const syncCampaign = async (campaignId: string, campaignName: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('realtime-sync', {
        body: {
          action: 'sync_campaigns',
          table: 'campaigns',
          data: { campaignId, campaignName },
          userId: user.id
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error syncing campaign:', error);
      toast({
        title: "Erro na Sincronização",
        description: "Falha ao sincronizar dados da campanha",
        variant: "destructive",
      });
    }
  };

  const bulkSync = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('realtime-sync', {
        body: {
          action: 'bulk_sync',
          userId: user.id
        }
      });

      if (error) throw error;
      
      toast({
        title: "Sincronização Completa",
        description: `${data.synced} campanhas foram atualizadas`,
      });
      
      return data;
    } catch (error) {
      console.error('Error in bulk sync:', error);
      toast({
        title: "Erro na Sincronização",
        description: "Falha na sincronização em lote",
        variant: "destructive",
      });
    }
  };

  return {
    isConnected,
    syncCampaign,
    bulkSync
  };
}