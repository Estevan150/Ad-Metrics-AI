import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Calendar, Filter, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  campaign_name: string;
  platform: string;
  cost: number;
  clicks: number;
  impressions: number;
  conversions: number;
  cpc: number;
  ctr: number;
  created_at: string;
}

interface AnalyticsData {
  date: string;
  cost: number;
  clicks: number;
  impressions: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

export function AdvancedAnalytics() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, timeRange, selectedPlatform]);

  const fetchData = async () => {
    try {
      let query = supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedPlatform !== 'all') {
        query = query.eq('platform', selectedPlatform);
      }

      // Add time range filter
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      
      query = query.gte('created_at', startDate.toISOString());

      const { data, error } = await query;

      if (error) throw error;

      setCampaigns(data || []);
      
      // Generate analytics data for charts
      const analytics = generateAnalyticsData(data || [], daysAgo);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de análise",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAnalyticsData = (campaigns: Campaign[], days: number): AnalyticsData[] => {
    const data: AnalyticsData[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // For demo purposes, we'll generate some sample data
      // In a real app, this would come from actual daily metrics
      const dayData: AnalyticsData = {
        date: dateStr,
        cost: Math.random() * 1000,
        clicks: Math.floor(Math.random() * 500),
        impressions: Math.floor(Math.random() * 10000),
        conversions: Math.floor(Math.random() * 50),
        ctr: Math.random() * 5,
        cpc: Math.random() * 10,
      };
      
      data.push(dayData);
    }
    
    return data;
  };

  const getTotalMetrics = () => {
    return {
      totalCost: campaigns.reduce((sum, c) => sum + (c.cost || 0), 0),
      totalClicks: campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0),
      totalImpressions: campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0),
      totalConversions: campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0),
      avgCPC: campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + (c.cpc || 0), 0) / campaigns.length : 0,
      avgCTR: campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + (c.ctr || 0), 0) / campaigns.length : 0,
    };
  };

  const getPlatformData = () => {
    const platforms = campaigns.reduce((acc, campaign) => {
      const platform = campaign.platform;
      if (!acc[platform]) {
        acc[platform] = {
          name: platform,
          value: 0,
          cost: 0,
          conversions: 0,
        };
      }
      acc[platform].value += 1;
      acc[platform].cost += campaign.cost || 0;
      acc[platform].conversions += campaign.conversions || 0;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(platforms);
  };

  const getTopCampaigns = () => {
    return campaigns
      .sort((a, b) => (b.conversions || 0) - (a.conversions || 0))
      .slice(0, 5);
  };

  const exportData = () => {
    const csvData = campaigns.map(campaign => ({
      Nome: campaign.campaign_name,
      Plataforma: campaign.platform,
      Custo: campaign.cost,
      Cliques: campaign.clicks,
      Impressões: campaign.impressions,
      Conversões: campaign.conversions,
      CPC: campaign.cpc,
      CTR: campaign.ctr,
    }));

    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(csvData[0]).join(",") + "\n" +
      csvData.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const metrics = getTotalMetrics();
  const platformData = getPlatformData();
  const topCampaigns = getTopCampaigns();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análise Avançada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Análise Avançada
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="90d">90 dias</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as plataformas</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="meta">Meta Ads</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={exportData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Custo Total</p>
                    <p className="text-2xl font-bold">R$ {metrics.totalCost.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Cliques</p>
                    <p className="text-2xl font-bold">{metrics.totalClicks.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Impressões</p>
                    <p className="text-2xl font-bold">{metrics.totalImpressions.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Conversões</p>
                    <p className="text-2xl font-bold">{metrics.totalConversions}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">CPC Médio</p>
                    <p className="text-2xl font-bold">R$ {metrics.avgCPC.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">CTR Médio</p>
                    <p className="text-2xl font-bold">{metrics.avgCTR.toFixed(2)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Custo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cost" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#8884d8" />
                <Bar dataKey="conversions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{campaign.campaign_name}</p>
                    <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{campaign.conversions} conversões</p>
                    <p className="text-sm text-muted-foreground">R$ {(campaign.cost || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}