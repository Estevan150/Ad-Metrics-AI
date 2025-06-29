
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

const insights = [
  {
    type: "opportunity",
    icon: TrendingUp,
    title: "Oportunidade Detectada",
    message: "Campanha 'Verão 2024' tem CPM 23% menor que a média. Considere aumentar o orçamento.",
    priority: "high",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Atenção Necessária",
    message: "CPC do Google Ads subiu 15% esta semana. Revisar palavras-chave negativas.",
    priority: "medium",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  {
    type: "tip",
    icon: Lightbulb,
    title: "Dica de Otimização",
    message: "Horário das 18h-20h apresenta melhor CTR. Aumente os lances neste período.",
    priority: "low",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  }
];

export function AIInsights() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          Insights da IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-1 rounded ${insight.color}`}>
                <insight.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm text-gray-800">{insight.title}</h4>
                  <Badge 
                    variant={insight.priority === "high" ? "destructive" : insight.priority === "medium" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {insight.priority === "high" ? "Alta" : insight.priority === "medium" ? "Média" : "Baixa"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{insight.message}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
