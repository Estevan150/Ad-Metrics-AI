
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, BarChart, Activity } from "lucide-react";

const metrics = [
  {
    title: "Gastos Totais",
    value: "R$ 24.350",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Impressões",
    value: "1.2M",
    change: "+8.3%",
    trend: "up",
    icon: Activity,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Cliques",
    value: "45.2K",
    change: "-2.1%",
    trend: "down",
    icon: BarChart,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Conversões",
    value: "892",
    change: "+15.7%",
    trend: "up",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
            <div className="flex items-center text-xs mt-1">
              {metric.trend === "up" ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                {metric.change}
              </span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
