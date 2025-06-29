
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, TrendingUp } from "lucide-react";

const campaigns = [
  {
    name: "Campanha Black Friday 2024",
    platform: "Meta Ads",
    status: "Ativa",
    budget: "R$ 5.000",
    spent: "R$ 3.245",
    impressions: "125.4K",
    clicks: "2.1K",
    ctr: "1.68%",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    name: "Google Search - Tênis Esportivos",
    platform: "Google Ads",
    status: "Ativa",
    budget: "R$ 3.000",
    spent: "R$ 2.890",
    impressions: "89.2K",
    clicks: "1.5K",
    ctr: "1.68%",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    name: "Retargeting - Carrinho Abandonado",
    platform: "Meta Ads",
    status: "Pausada",
    budget: "R$ 1.500",
    spent: "R$ 890",
    impressions: "45.1K",
    clicks: "892",
    ctr: "1.98%",
    statusColor: "bg-gray-100 text-gray-800"
  },
  {
    name: "Display - Awareness Marca",
    platform: "Google Ads",
    status: "Ativa",
    budget: "R$ 2.200",
    spent: "R$ 1.756",
    impressions: "234.5K",
    clicks: "3.2K",
    ctr: "1.36%",
    statusColor: "bg-green-100 text-green-800"
  }
];

export function RecentCampaigns() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Campanhas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Campanha</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Orçamento</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Gasto</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Impressões</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">CTR</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-2">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{campaign.name}</div>
                      <div className="text-xs text-gray-500">{campaign.platform}</div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <Badge className={`${campaign.statusColor} text-xs`}>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-700">{campaign.budget}</td>
                  <td className="py-4 px-2 text-sm text-gray-700">{campaign.spent}</td>
                  <td className="py-4 px-2 text-sm text-gray-700">{campaign.impressions}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-gray-700">{campaign.ctr}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
