
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MainDashboard } from "@/components/MainDashboard";
import { AdAccountsPage } from "@/components/AdAccountsPage";
import { CampaignsPage } from "@/components/CampaignsPage";
import { AIAssistant } from "@/components/AIAssistant";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [showAIChat, setShowAIChat] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <MainDashboard />;
      case "meta-ads":
        return <AdAccountsPage />;
      case "google-ads":
        return <AdAccountsPage />;
      case "campaigns":
        return <CampaignsPage />;
      case "settings":
        return <div className="p-6"><h2 className="text-2xl font-bold">Configurações</h2></div>;
      default:
        return <MainDashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
