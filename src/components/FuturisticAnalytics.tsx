import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { BarChart3, TrendingUp, Calendar, Filter, Download, Zap, Target, DollarSign, Users, Eye, MousePointer, Activity, Sparkles, Bot, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Campaign {
  id: string;
  campaign_name: string;
  platform: 'meta_ads' | 'google_ads';
  cost: number;
  clicks: number;
  impressions: number;
  conversions: number;
  cpc: number;
  ctr: number;
  created_at: string;
  status: string;
  budget_amount: number;
  currency: string;
  creative_performance?: {
    image_url: string;
    video_url?: string;
    headline: string;
    description: string;
    clicks: number;
    impressions: number;
    ctr: number;
  }[];
}

interface AIInsight {
  type: 'optimization' | 'warning' | 'opportunity' | 'success';
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export function FuturisticAnalytics() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const NEON_COLORS = [
    'hsl(210, 100%, 50%)', // Neon Blue
    'hsl(270, 100%, 60%)', // Neon Purple  
    'hsl(320, 100%, 60%)', // Neon Pink
    'hsl(120, 100%, 50%)', // Neon Green
    'hsl(30, 100%, 60%)',  // Neon Orange
    'hsl(180, 100%, 50%)', // Neon Cyan
  ];

  useEffect(() => {
    if (user) {
      fetchCampaignsData();
      generateAIInsights();
    }
  }, [user, timeRange, selectedPlatform]);

  const fetchCampaignsData = async () => {
    try {
      let query = supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedPlatform !== 'all') {
        query = query.eq('platform', selectedPlatform);
      }

      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      query = query.gte('created_at', startDate.toISOString());

      const { data, error } = await query;
      if (error) throw error;

      // Enrich campaigns with creative performance data (simulated)
      const enrichedCampaigns = (data || []).map(campaign => ({
        ...campaign,
        platform: campaign.platform as 'meta_ads' | 'google_ads',
        creative_performance: generateCreativePerformanceData(campaign)
      })) as Campaign[];

      setCampaigns(enrichedCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados das campanhas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCreativePerformanceData = (campaign: any) => {
    return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
      image_url: `https://picsum.photos/400/300?random=${campaign.id}_${i}`,
      video_url: Math.random() > 0.7 ? `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4` : undefined,
      headline: `Creative ${i + 1} - ${campaign.campaign_name}`,
      description: `High-performing creative for ${campaign.platform} campaign`,
      clicks: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 10000),
      ctr: Math.random() * 5,
    }));
  };

  const generateAIInsights = async () => {
    // Simulate AI analysis
    const insights: AIInsight[] = [
      {
        type: 'optimization',
        title: 'Otimização de Palavras-chave',
        description: 'Detectamos 5 palavras-chave com baixo QS que podem ser otimizadas',
        action: 'Revisar palavras-chave negativas e ajustar lances',
        priority: 'high'
      },
      {
        type: 'opportunity', 
        title: 'Oportunidade de Expansão',
        description: 'Campanhas Google Ads estão com 40% de economia de orçamento',
        action: 'Aumentar lances para palavras-chave de alta conversão',
        priority: 'medium'
      },
      {
        type: 'warning',
        title: 'CPC Elevado Meta Ads',
        description: 'CPC médio aumentou 25% nos últimos 7 dias',
        action: 'Revisar segmentação e testar novos públicos',
        priority: 'critical'
      },
      {
        type: 'success',
        title: 'Performance Excepcional',
        description: 'CTR das campanhas de conversão 50% acima da média',
        action: 'Replicar estratégia para outras campanhas',
        priority: 'low'
      }
    ];
    setAiInsights(insights);
  };

  const generateAdvancedMetrics = () => {
    const totalCost = campaigns.reduce((sum, c) => sum + (c.cost || 0), 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
    
    return {
      totalCost,
      totalClicks, 
      totalImpressions,
      totalConversions,
      avgCPC: totalClicks > 0 ? totalCost / totalClicks : 0,
      avgCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      costPerConversion: totalConversions > 0 ? totalCost / totalConversions : 0,
      roas: totalCost > 0 ? (totalConversions * 100) / totalCost : 0, // Simulated revenue
    };
  };

  const getPlatformPerformance = () => {
    const platformStats = campaigns.reduce((acc, campaign) => {
      const platform = campaign.platform;
      if (!acc[platform]) {
        acc[platform] = {
          name: platform === 'meta_ads' ? 'Meta Ads' : 'Google Ads',
          cost: 0,
          clicks: 0,
          impressions: 0,
          conversions: 0,
          campaigns: 0
        };
      }
      acc[platform].cost += campaign.cost || 0;
      acc[platform].clicks += campaign.clicks || 0; 
      acc[platform].impressions += campaign.impressions || 0;
      acc[platform].conversions += campaign.conversions || 0;
      acc[platform].campaigns += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(platformStats);
  };

  const getPerformanceTrends = () => {
    // Generate trend data for the last 30 days
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        cost: Math.random() * 1000 + 500,
        clicks: Math.floor(Math.random() * 500 + 100),
        impressions: Math.floor(Math.random() * 5000 + 1000),
        conversions: Math.floor(Math.random() * 50 + 10),
        ctr: Math.random() * 3 + 1,
        cpc: Math.random() * 5 + 1,
      };
    });
  };

  const getCreativeInsights = () => {
    const allCreatives = campaigns.flatMap(c => c.creative_performance || []);
    return allCreatives
      .sort((a, b) => b.ctr - a.ctr)
      .slice(0, 10);
  };

  const generatePDFReport = async () => {
    setGeneratingPDF(true);
    try {
      const metrics = generateAdvancedMetrics();
      const platformData = getPlatformPerformance();
      
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(103, 58, 183); // Purple
      pdf.text('Relatório Profissional de Campanhas', pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Período: ${timeRange} | Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 40, { align: 'center' });
      
      // Metrics Summary
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Resumo Executivo', 20, 60);
      
      const metricsText = [
        `• Investimento Total: R$ ${metrics.totalCost.toFixed(2)}`,
        `• Cliques Totais: ${metrics.totalClicks.toLocaleString()}`,
        `• Impressões Totais: ${metrics.totalImpressions.toLocaleString()}`,
        `• Conversões: ${metrics.totalConversions}`,
        `• CPC Médio: R$ ${metrics.avgCPC.toFixed(2)}`,
        `• CTR Médio: ${metrics.avgCTR.toFixed(2)}%`,
        `• Taxa de Conversão: ${metrics.conversionRate.toFixed(2)}%`,
        `• ROAS: ${metrics.roas.toFixed(2)}x`
      ];
      
      metricsText.forEach((text, index) => {
        pdf.text(text, 20, 80 + (index * 10));
      });
      
      // Platform Performance
      pdf.text('Performance por Plataforma', 20, 180);
      platformData.forEach((platform, index) => {
        const platformText = `${platform.name}: R$ ${platform.cost.toFixed(2)} | ${platform.clicks} cliques | ${platform.conversions} conversões`;
        pdf.text(platformText, 20, 200 + (index * 10));
      });
      
      // AI Insights
      pdf.addPage();
      pdf.text('Insights da IA', 20, 30);
      aiInsights.forEach((insight, index) => {
        const yPos = 50 + (index * 30);
        pdf.setFontSize(12);
        pdf.setTextColor(103, 58, 183);
        pdf.text(`${insight.title} (${insight.priority})`, 20, yPos);
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(insight.description, 20, yPos + 10);
        pdf.text(`Ação: ${insight.action}`, 20, yPos + 20);
      });
      
      pdf.save(`relatorio-campanhas-${timeRange}-${Date.now()}.pdf`);
      
      toast({
        title: "PDF Gerado!",
        description: "Relatório profissional baixado com sucesso",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório PDF",
        variant: "destructive",
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  const metrics = generateAdvancedMetrics();
  const platformData = getPlatformPerformance();
  const trendData = getPerformanceTrends();
  const topCreatives = getCreativeInsights();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="h-20 bg-muted/50 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Futuristic Header */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  Análise Futurística de Campanhas
                </CardTitle>
                <p className="text-muted-foreground">
                  Análise avançada com IA • Meta Ads & Google Ads • Tempo real
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32 bg-card/50 backdrop-blur-sm border-border/50">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 dias</SelectItem>
                    <SelectItem value="30d">30 dias</SelectItem>
                    <SelectItem value="90d">90 dias</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-40 bg-card/50 backdrop-blur-sm border-border/50">
                    <Filter className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as plataformas</SelectItem>
                    <SelectItem value="google_ads">Google Ads</SelectItem>
                    <SelectItem value="meta_ads">Meta Ads</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={generatePDFReport} 
                  disabled={generatingPDF}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {generatingPDF ? 'Gerando...' : 'Relatório PDF'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* AI Insights Panel */}
        <Card className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border-accent/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Insights da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {aiInsights.map((insight, index) => (
                <Card key={index} className={`relative overflow-hidden ${
                  insight.priority === 'critical' ? 'border-destructive/50 bg-destructive/5' :
                  insight.priority === 'high' ? 'border-warning/50 bg-warning/5' :
                  insight.priority === 'medium' ? 'border-primary/50 bg-primary/5' :
                  'border-success/50 bg-success/5'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={insight.priority === 'critical' ? 'destructive' : 'secondary'}>
                        {insight.priority}
                      </Badge>
                      <div className={`p-1 rounded ${
                        insight.type === 'optimization' ? 'bg-primary/10 text-primary' :
                        insight.type === 'warning' ? 'bg-warning/10 text-warning' :
                        insight.type === 'opportunity' ? 'bg-success/10 text-success' :
                        'bg-accent/10 text-accent-foreground'
                      }`}>
                        {insight.type === 'optimization' && <Zap className="h-4 w-4" />}
                        {insight.type === 'warning' && <Target className="h-4 w-4" />}
                        {insight.type === 'opportunity' && <TrendingUp className="h-4 w-4" />}
                        {insight.type === 'success' && <Activity className="h-4 w-4" />}
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{insight.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                    <p className="text-xs font-medium">{insight.action}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[
            { title: 'Investimento Total', value: `R$ ${metrics.totalCost.toFixed(2)}`, icon: DollarSign, color: 'text-chart-1', gradient: 'from-chart-1/10 to-chart-1/5' },
            { title: 'Cliques Totais', value: metrics.totalClicks.toLocaleString(), icon: MousePointer, color: 'text-chart-2', gradient: 'from-chart-2/10 to-chart-2/5' },
            { title: 'Impressões', value: metrics.totalImpressions.toLocaleString(), icon: Eye, color: 'text-chart-3', gradient: 'from-chart-3/10 to-chart-3/5' },
            { title: 'Conversões', value: metrics.totalConversions.toString(), icon: Target, color: 'text-chart-4', gradient: 'from-chart-4/10 to-chart-4/5' },
            { title: 'ROAS', value: `${metrics.roas.toFixed(2)}x`, icon: TrendingUp, color: 'text-chart-5', gradient: 'from-chart-5/10 to-chart-5/5' },
          ].map((metric, index) => (
            <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${metric.gradient} border-border/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-background/50 ${metric.color}`}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Tendências de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="cost" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#costGradient)" />
                  <Area type="monotone" dataKey="clicks" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#clicksGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Distribuição por Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cost"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={NEON_COLORS[index % NEON_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* CTR vs CPC Analysis */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Análise CTR vs CPC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={campaigns.map(c => ({ ctr: c.ctr, cpc: c.cpc, name: c.campaign_name }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" dataKey="ctr" name="CTR" unit="%" stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="number" dataKey="cpc" name="CPC" unit="R$" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Scatter data={campaigns.map(c => ({ ctr: c.ctr, cpc: c.cpc, name: c.campaign_name }))} fill="hsl(var(--primary))" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campaign Performance Radar */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Performance Radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={[
                  { subject: 'CTR', A: metrics.avgCTR, fullMark: 5 },
                  { subject: 'CPC', A: 5 - metrics.avgCPC, fullMark: 5 },
                  { subject: 'Conv Rate', A: metrics.conversionRate, fullMark: 10 },
                  { subject: 'ROAS', A: metrics.roas, fullMark: 5 },
                  { subject: 'Quality', A: 4, fullMark: 5 },
                ]}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                  <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                  <Radar name="Performance" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Creatives */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Top Criativos (por CTR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {topCreatives.slice(0, 5).map((creative, index) => (
                <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
                    <img 
                      src={creative.image_url} 
                      alt={creative.headline}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' fill='%236b7280'%3ECreative Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm mb-1 truncate">{creative.headline}</h3>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>CTR: {creative.ctr.toFixed(2)}%</span>
                      <span>{creative.clicks} cliques</span>
                    </div>
                  </CardContent>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      #{index + 1}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Detalhamento de Campanhas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2">Campanha</th>
                    <th className="text-left p-2">Plataforma</th>
                    <th className="text-right p-2">Investimento</th>
                    <th className="text-right p-2">Cliques</th>
                    <th className="text-right p-2">CTR</th>
                    <th className="text-right p-2">CPC</th>
                    <th className="text-right p-2">Conversões</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.slice(0, 10).map((campaign) => (
                    <tr key={campaign.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-2 font-medium">{campaign.campaign_name}</td>
                      <td className="p-2">
                        <Badge variant={campaign.platform === 'meta_ads' ? 'secondary' : 'outline'}>
                          {campaign.platform === 'meta_ads' ? 'Meta' : 'Google'}
                        </Badge>
                      </td>
                      <td className="p-2 text-right">R$ {(campaign.cost || 0).toFixed(2)}</td>
                      <td className="p-2 text-right">{(campaign.clicks || 0).toLocaleString()}</td>
                      <td className="p-2 text-right">{(campaign.ctr || 0).toFixed(2)}%</td>
                      <td className="p-2 text-right">R$ {(campaign.cpc || 0).toFixed(2)}</td>
                      <td className="p-2 text-right">{campaign.conversions || 0}</td>
                      <td className="p-2">
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}