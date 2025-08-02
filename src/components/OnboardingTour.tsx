import { useTour } from '@reactour/tour';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useEffect } from 'react';
import { X } from 'lucide-react';

const tourSteps = [
  {
    selector: '[data-tour="dashboard"]',
    content: (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">🎯 Bem-vindo ao Dashboard!</h3>
        <p className="text-muted-foreground mb-4">
          Aqui você monitora todas as suas campanhas publicitárias em tempo real.
        </p>
      </div>
    ),
    styles: {
      popover: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)',
      }),
      badge: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
      })
    }
  },
  {
    selector: '[data-tour="metrics"]',
    content: (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">📊 Métricas Principais</h3>
        <p className="text-muted-foreground mb-4">
          Acompanhe performance, ROAS, cliques e conversões em tempo real.
        </p>
      </div>
    ),
    styles: {
      popover: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)',
      }),
      badge: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
      })
    }
  },
  {
    selector: '[data-tour="charts"]',
    content: (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">📈 Gráficos Interativos</h3>
        <p className="text-muted-foreground mb-4">
          Visualize tendências e padrões para otimizar suas campanhas.
        </p>
      </div>
    ),
    styles: {
      popover: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)',
      }),
      badge: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
      })
    }
  },
  {
    selector: '[data-tour="ai-assistant"]',
    content: (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">🤖 Assistente IA</h3>
        <p className="text-muted-foreground mb-4">
          Obtenha insights personalizados e recomendações inteligentes.
        </p>
      </div>
    ),
    styles: {
      popover: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)',
      }),
      badge: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
      })
    }
  },
  {
    selector: '[data-tour="notifications"]',
    content: (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">🔔 Central de Notificações</h3>
        <p className="text-muted-foreground mb-4">
          Mantenha-se atualizado com alertas importantes das suas campanhas.
        </p>
      </div>
    ),
    styles: {
      popover: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)',
      }),
      badge: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
      })
    }
  }
];

export function OnboardingTour() {
  const { isOnboardingComplete, completeOnboarding } = useUserPreferences();
  const { setIsOpen, setSteps, setCurrentStep, currentStep, isOpen } = useTour();

  useEffect(() => {
    if (!isOnboardingComplete) {
      setSteps([
        ...tourSteps,
        {
          selector: 'body',
          content: (
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-card-foreground mb-3">🎉 Tour Concluído!</h3>
              <p className="text-muted-foreground mb-6">
                Agora você conhece as principais funcionalidades da plataforma.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => {
                    completeOnboarding();
                    setIsOpen(false);
                  }}
                  className="w-full"
                >
                  Finalizar e não mostrar novamente
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Finalizar (mostrar na próxima vez)
                </Button>
              </div>
            </div>
          ),
          styles: {
            popover: (base: any) => ({
              ...base,
              backgroundColor: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)',
            })
          }
        }
      ]);
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, [isOnboardingComplete, setIsOpen, setSteps, completeOnboarding]);

  return null;
}

export function OnboardingTrigger() {
  const { resetOnboarding } = useUserPreferences();
  const { setIsOpen, setSteps } = useTour();

  const startTour = () => {
    setSteps([
      ...tourSteps,
      {
        selector: 'body',
        content: (
          <div className="bg-card border border-border rounded-lg p-6 shadow-lg text-center">
            <h3 className="text-xl font-semibold text-card-foreground mb-3">🎉 Tour Concluído!</h3>
            <p className="text-muted-foreground mb-6">
              Você revisou todas as funcionalidades principais da plataforma.
            </p>
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Fechar
            </Button>
          </div>
        ),
        styles: {
          popover: (base: any) => ({
            ...base,
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)',
          })
        }
      }
    ]);
    setIsOpen(true);
  };

  return (
    <Button variant="outline" onClick={startTour}>
      Refazer Tour
    </Button>
  );
}