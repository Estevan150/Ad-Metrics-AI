import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  user_id: string;
  campaign_id: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

interface CampaignCommentsProps {
  campaignId: string;
  campaignName: string;
}

export function CampaignComments({ campaignId, campaignName }: CampaignCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (campaignId) {
      fetchComments();
    }
  }, [campaignId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('campaign_comments')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user info for each comment
      const commentsWithUsers = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', comment.user_id)
            .single();

          return {
            ...comment,
            user_name: profile?.full_name || 'Usuário',
            user_email: profile?.email || '',
          };
        })
      );

      setComments(commentsWithUsers);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar comentários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('campaign_comments')
        .insert({
          user_id: user?.id,
          campaign_id: campaignId,
          comment: newComment.trim(),
          is_internal: true,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Comentário adicionado",
      });

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar comentário",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('campaign_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Comentário removido",
      });

      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover comentário",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comentários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comentários - {campaignName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário sobre esta campanha..."
              className="flex-1"
            />
            <Button onClick={addComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum comentário ainda
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {comment.user_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.user_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()} às {new Date(comment.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                    </div>
                    
                    {comment.user_id === user?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}