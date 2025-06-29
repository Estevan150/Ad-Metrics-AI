
import { DashboardMetrics } from "./DashboardMetrics";
import { ChartSection } from "./ChartSection";
import { RecentCampaigns } from "./RecentCampaigns";
import { AIInsights } from "./AIInsights";

export function MainDashboard() {
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
      
      <DashboardMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSection />
        </div>
        <div>
          <AIInsights />
        </div>
      </div>
      
      <RecentCampaigns />
    </div>
  );
}
