
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ResponsiveDashboard } from "@/components/ResponsiveDashboard";
import { AdAccountsPage } from "@/components/AdAccountsPage";
import { CampaignsPage } from "@/components/CampaignsPage";
import { ReportsPage } from "@/components/ReportsPage";
import { FuturisticAnalytics } from "@/components/FuturisticAnalytics";
import { AIMarketingAssistant } from "@/components/AIMarketingAssistant";
import { AIAssistant } from "@/components/AIAssistant";
import { MobileNavigation } from "@/components/MobileNavigation";
import { OnboardingTour } from "@/components/OnboardingTour";
import { ContextualAI } from "@/components/ContextualAI";
import { RealtimeCollaboration } from "@/components/RealtimeCollaboration";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAdvancedAI, setShowAdvancedAI] = useState(false);
  const { user, loading } = useAuth();
  const { isConnected } = useRealtimeSync();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <FuturisticAnalytics />;
      case "meta-ads":
        return <AdAccountsPage />;
      case "google-ads":
        return <AdAccountsPage />;
      case "campaigns":
        return <CampaignsPage />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return <div className="p-6"><h2 className="text-2xl font-bold">Configurações</h2></div>;
      default:
        return <FuturisticAnalytics />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingTour />
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {!isMobile && (
            <AppSidebar activePage={activePage} setActivePage={setActivePage} />
          )}
          
          <main className="flex-1 flex flex-col">
            {!isMobile && (
              <DashboardHeader 
                onToggleAI={() => setShowAIChat(!showAIChat)}
                onToggleAdvancedAI={() => setShowAdvancedAI(!showAdvancedAI)}
              />
            )}
            
            <div className="flex-1 relative">
              <div className={isMobile ? "" : "lg:grid lg:grid-cols-4 lg:gap-6 lg:p-6"}>
                <div className={isMobile ? "" : "lg:col-span-3"}>
                  {renderContent()}
                </div>
                
                {!isMobile && (
                  <div className="space-y-4">
                    <ContextualAI currentContext={activePage} />
                    <RealtimeCollaboration context={activePage} />
                  </div>
                )}
              </div>
              
              {showAIChat && (
                <AIAssistant onClose={() => setShowAIChat(false)} />
              )}
              
              {showAdvancedAI && (
                <AIMarketingAssistant 
                  onClose={() => setShowAdvancedAI(false)}
                  campaignData={[]}
                />
              )}
            </div>
          </main>
        </div>
        
        <MobileNavigation 
          activePage={activePage} 
          setActivePage={setActivePage} 
        />
      </SidebarProvider>
    </div>
  );
};

export default Index;
