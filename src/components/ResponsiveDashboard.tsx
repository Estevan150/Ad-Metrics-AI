import { useIsMobile } from '@/hooks/use-mobile';
import { DashboardGrid } from './DashboardGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardMetrics } from './DashboardMetrics';
import { ChartSection } from './ChartSection';
import { RecentCampaigns } from './RecentCampaigns';
import { AIInsights } from './AIInsights';

export function ResponsiveDashboard() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm mt-1">Visão geral das campanhas</p>
        </div>
        
        {/* Mobile optimized layout */}
        <div className="space-y-4" data-tour="metrics">
          <DashboardMetrics />
        </div>
        
        <div className="space-y-4" data-tour="charts">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ChartSection />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Insights da IA</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <AIInsights />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Campanhas Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <RecentCampaigns />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Dashboard Principal
          </h1>
          <p className="text-gray-600 mt-1">Visão geral das suas campanhas publicitárias</p>
        </div>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleTimeString('pt-BR')}
        </div>
      </div>
      
      <DashboardGrid />
    </div>
  );
}