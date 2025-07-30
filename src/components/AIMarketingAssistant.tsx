import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Bot, Send, Sparkles, TrendingUp, Target, Zap, AlertTriangle, CheckCircle, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  insights?: string[];
}

interface AIMarketingAssistantProps {
  onClose: () => void;
  campaignData?: any[];
}

export function AIMarketingAssistant({ onClose, campaignData = [] }: AIMarketingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const quickActions = [
    {
      title: "Análise de Performance",
      description: "Analise o desempenho atual das campanhas",
      action: "analyze_performance",
      icon: TrendingUp,
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    },
    {
      title: "Sugestões de Otimização", 
      description: "Receba dicas para melhorar ROI",
      action: "optimize_suggestions",
      icon: Zap,
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-200"
    },
    {
      title: "Análise de Tendências",
      description: "Previsões e tendências futuras",
      action: "forecast_analysis", 
      icon: Target,
      color: "bg-purple-500/10 text-purple-600 border-purple-200"
    }
  ];

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou sua IA especialista em marketing digital. Posso analisar suas campanhas Meta Ads e Google Ads para fornecer insights personalizados e sugestões de otimização. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
      insights: [
        'Análise de performance em tempo real',
        'Otimização de orçamento e lances',
        'Identificação de oportunidades',
        'Relatórios personalizados'
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-marketing-insights', {
        body: {
          action: 'general_analysis',
          campaignData: campaignData,
          userMessage: messageToSend
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.insights,
        timestamp: new Date(),
        insights: generateContextualInsights(messageToSend)
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive"
      });

      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateFallbackResponse(messageToSend),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-marketing-insights', {
        body: {
          action,
          campaignData: campaignData
        }
      });

      if (error) throw error;

      const actionMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.insights,
        timestamp: new Date(),
        insights: getActionInsights(action)
      };

      setMessages(prev => [...prev, actionMessage]);
    } catch (error) {
      console.error('Error executing quick action:', error);
      toast({
        title: "Erro",
        description: "Não foi possível executar a ação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('ctr') || message.includes('taxa de clique')) {
      return 'Para melhorar o CTR, recomendo: 1) Testar novos títulos e descrições mais chamativos, 2) Segmentar públicos mais específicos, 3) Usar extensões de anúncio relevantes, 4) Ajustar horários de exibição para períodos de maior engajamento.';
    }
    
    if (message.includes('cpc') || message.includes('custo por clique')) {
      return 'Para reduzir o CPC: 1) Otimize palavras-chave negativas, 2) Melhore o Quality Score, 3) Teste diferentes estratégias de lance, 4) Ajuste a segmentação geográfica e demográfica para focar nos públicos mais rentáveis.';
    }
    
    if (message.includes('conversão') || message.includes('conversões')) {
      return 'Para aumentar conversões: 1) Otimize landing pages para maior relevância, 2) Implemente rastreamento de conversões adequado, 3) Teste diferentes calls-to-action, 4) Ajuste públicos para focar em usuários com maior intenção de compra.';
    }
    
    return 'Baseado nos dados das suas campanhas, vejo oportunidades de otimização em segmentação, orçamento e criativos. Posso analisar aspectos específicos se você me fornecer mais detalhes sobre o que gostaria de melhorar.';
  };

  const generateContextualInsights = (message: string): string[] => {
    const insights = [
      'Monitore métricas principais diariamente',
      'Teste A/B diferentes criativos',
      'Otimize públicos baseado em dados',
      'Ajuste orçamentos conforme performance'
    ];
    return insights;
  };

  const getActionInsights = (action: string): string[] => {
    switch (action) {
      case 'analyze_performance':
        return [
          'CTR acima de 2% indica boa relevância',
          'CPC baixo com alta conversão é ideal',
          'ROI positivo em 80% das campanhas'
        ];
      case 'optimize_suggestions':
        return [
          'Pausar campanhas com ROI negativo',
          'Aumentar orçamento em top performers',
          'Testar novos públicos similares'
        ];
      case 'forecast_analysis':
        return [
          'Tendência de crescimento em mobile',
          'Sazonalidade influencia performance',
          'Oportunidade em novos mercados'
        ];
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-4xl h-[80vh] bg-gradient-to-br from-card/95 to-card/85 backdrop-blur-xl border-border/50 shadow-2xl">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  IA Marketing Assistant
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Especialista em Meta Ads & Google Ads • Análises em tempo real
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <Card className={`max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary/30' 
                      : 'bg-gradient-to-r from-card/90 to-card/70 backdrop-blur-sm border-border/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {message.role === 'assistant' && (
                          <div className="p-1 bg-primary/20 rounded border border-primary/30">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.insights && (
                            <div className="mt-3 space-y-2">
                              {message.insights.map((insight, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                  <Sparkles className="h-3 w-3 text-primary" />
                                  <span className="text-muted-foreground">{insight}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <span className="text-xs opacity-70 mt-2 block">
                            {message.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <Card className="bg-gradient-to-r from-card/90 to-card/70 backdrop-blur-sm border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-primary/20 rounded border border-primary/30">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Analisando dados...</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-6 border-t border-border/50 bg-gradient-to-r from-muted/20 to-transparent">
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Ações rápidas para começar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    className={`h-auto p-4 text-left justify-start ${action.color} hover:shadow-md transition-all duration-200`}
                    onClick={() => handleQuickAction(action.action)}
                    disabled={isLoading}
                  >
                    <div className="flex items-start gap-3">
                      <action.icon className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs opacity-80">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-6 border-t border-border/50 bg-gradient-to-r from-card/50 to-transparent">
            <div className="flex gap-3">
              <Input
                placeholder="Digite sua pergunta sobre as campanhas..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={isLoading}
                className="flex-1 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}