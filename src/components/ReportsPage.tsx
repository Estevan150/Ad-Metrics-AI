import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MousePointer,
  Target,
  Calendar,
  Download,
  Filter,
  Eye,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

// Sample data for charts
const performanceData = [
  { month: 'Jan', investment: 15000, revenue: 25000, roas: 1.67, clicks: 2500, conversions: 125 },
  { month: 'Fev', investment: 18000, revenue: 32000, roas: 1.78, clicks: 3200, conversions: 160 },
  { month: 'Mar', investment: 22000, revenue: 45000, roas: 2.05, clicks: 4100, conversions: 205 },
  { month: 'Abr', investment: 28000, revenue: 58000, roas: 2.07, clicks: 5200, conversions: 260 },
  { month: 'Mai', investment: 35000, revenue: 75000, roas: 2.14, clicks: 6800, conversions: 340 },
  { month: 'Jun', investment: 42000, revenue: 95000, roas: 2.26, clicks: 8500, conversions: 425 }
];

const platformData = [
  { name: 'Meta Ads', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'Google Ads', value: 35, color: 'hsl(var(--chart-2))' },
  { name: 'LinkedIn', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'TikTok', value: 5, color: 'hsl(var(--chart-4))' }
];

const campaignPerformance = [
  { name: 'Black Friday', roas: 3.2, investment: 15000, revenue: 48000, status: 'active' },
  { name: 'Lançamento Produto', roas: 2.8, investment: 12000, revenue: 33600, status: 'active' },
  { name: 'Retargeting Q2', roas: 4.1, investment: 8000, revenue: 32800, status: 'paused' },
  { name: 'Awareness Brand', roas: 1.9, investment: 20000, revenue: 38000, status: 'active' },
  { name: 'Promoção Verão', roas: 2.6, investment: 10000, revenue: 26000, status: 'ended' }
];

export function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('roas');

  // Calculate totals
  const totalInvestment = performanceData.reduce((sum, item) => sum + item.investment, 0);
  const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0);
  const totalROAS = totalRevenue / totalInvestment;
  const totalConversions = performanceData.reduce((sum, item) => sum + item.conversions, 0);

  const exportReport = () => {
    // Logic for exporting report
    console.log('Exporting report...');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Relatórios de Performance
          </h1>
          <p className="text-muted-foreground mt-2">
            Análise completa do desempenho das suas campanhas publicitárias
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportReport} className="bg-gradient-primary shadow-primary">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-card bg-gradient-to-br from-card to-card/80 hover:shadow-primary transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {totalInvestment.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% vs mês anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-card to-card/80 hover:shadow-success transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Gerada</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +28% vs mês anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-card to-card/80 hover:shadow-primary transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS Médio</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalROAS.toFixed(2)}x
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +0.3 vs mês anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-card to-card/80 hover:shadow-card transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <Users className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">
              {totalConversions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15% vs mês anterior
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="performance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="platforms" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <PieChartIcon className="w-4 h-4 mr-2" />
            Plataformas
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Target className="w-4 h-4 mr-2" />
            Campanhas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Evolução do ROAS</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="roasGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="roas" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#roasGradient)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Investimento vs Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="investment" fill="hsl(var(--chart-1))" name="Investimento" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" fill="hsl(var(--success))" name="Receita" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-card">
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
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Performance por Plataforma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {platformData.map((platform, index) => (
                  <div key={platform.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{platform.name}</span>
                      <Badge variant="outline">{platform.value}%</Badge>
                    </div>
                    <Progress value={platform.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Top Campanhas por Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.map((campaign, index) => (
                  <div key={campaign.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <Badge 
                          variant={campaign.status === 'active' ? 'default' : campaign.status === 'paused' ? 'secondary' : 'outline'}
                          className={campaign.status === 'active' ? 'bg-success text-success-foreground' : ''}
                        >
                          {campaign.status === 'active' ? 'Ativa' : campaign.status === 'paused' ? 'Pausada' : 'Finalizada'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Investimento: R$ {campaign.investment.toLocaleString()}</span>
                        <span>Receita: R$ {campaign.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{campaign.roas.toFixed(1)}x</div>
                      <div className="text-sm text-muted-foreground">ROAS</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}