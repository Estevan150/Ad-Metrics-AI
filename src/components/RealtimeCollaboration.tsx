import { useState, useEffect } from 'react';
import { Users, MessageSquare, Eye, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CollaborationProps {
  campaignId?: string;
  context: string;
}

interface ActiveUser {
  id: string;
  name: string;
  lastSeen: Date;
  currentPage: string;
}

interface Comment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  user_name?: string;
}

export function RealtimeCollaboration({ campaignId, context }: CollaborationProps) {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Set up presence tracking
    const channel = supabase.channel(`presence-${context}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.entries(presenceState).map(([userId, presence]: [string, any]) => ({
          id: userId,
          name: presence[0]?.name || 'Usuário Anônimo',
          lastSeen: new Date(presence[0]?.last_seen || Date.now()),
          currentPage: presence[0]?.current_page || context,
        }));
        setActiveUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          await channel.track({
            name: user.email?.split('@')[0] || 'Usuário',
            last_seen: new Date().toISOString(),
            current_page: context,
          });
        }
      });

    // Load existing comments if campaignId is provided
    if (campaignId) {
      loadComments();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, context, campaignId]);

  const loadComments = async () => {
    if (!campaignId) return;

    const { data } = await supabase
      .from('campaign_comments')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: true });

    if (data) {
      // Get user profiles separately
      const userIds = [...new Set(data.map(comment => comment.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const profileMap = profiles?.reduce((acc: any, profile: any) => {
        acc[profile.id] = profile.full_name;
        return acc;
      }, {}) || {};

      setComments(data.map(comment => ({
        ...comment,
        user_name: profileMap[comment.user_id] || 'Usuário Anônimo'
      })));
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !user || !campaignId) return;

    const { data, error } = await supabase
      .from('campaign_comments')
      .insert({
        user_id: user.id,
        campaign_id: campaignId,
        comment: newComment,
        is_internal: true
      })
      .select()
      .single();

    if (!error && data) {
      setComments(prev => [...prev, {
        ...data,
        user_name: user.email?.split('@')[0] || 'Você'
      }]);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            Usuários Ativos
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {activeUsers.map((activeUser) => (
              <div key={activeUser.id} className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {activeUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{activeUser.name}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
            {activeUsers.length === 0 && (
              <span className="text-xs text-muted-foreground">Nenhum usuário ativo</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      {campaignId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              Comentários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-muted p-2 rounded text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-xs">
                        {comment.user_name}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(comment.created_at).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                    <p>{comment.comment}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicionar comentário..."
                className="text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addComment()}
              />
              <Button size="sm" onClick={addComment}>
                Enviar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}