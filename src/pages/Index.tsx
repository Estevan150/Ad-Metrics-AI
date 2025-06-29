
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MainDashboard } from "@/components/MainDashboard";
import { AIAssistant } from "@/components/AIAssistant";

const Index = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [showAIChat, setShowAIChat] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <MainDashboard />;
      case "meta-ads":
        return <div className="p-6"><h2 className="text-2xl font-bold">Meta Ads Analytics</h2></div>;
      case "google-ads":
        return <div className="p-6"><h2 className="text-2xl font-bold">Google Ads Analytics</h2></div>;
      case "campaigns":
        return <div className="p-6"><h2 className="text-2xl font-bold">Campaign Management</h2></div>;
      case "settings":
        return <div className="p-6"><h2 className="text-2xl font-bold">Settings</h2></div>;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar activePage={activePage} setActivePage={setActivePage} />
          
          <main className="flex-1 flex flex-col">
            <DashboardHeader onToggleAI={() => setShowAIChat(!showAIChat)} />
            
            <div className="flex-1 relative">
              {renderContent()}
              
              {showAIChat && (
                <AIAssistant onClose={() => setShowAIChat(false)} />
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
