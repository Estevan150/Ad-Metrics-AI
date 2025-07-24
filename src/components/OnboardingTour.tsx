import { useTour } from '@reactour/tour';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useEffect } from 'react';

const tourSteps = [
  {
    selector: '[data-tour="dashboard"]',
    content: 'Bem-vindo ao seu dashboard! Aqui você monitora todas as suas campanhas publicitárias.',
  },
  {
    selector: '[data-tour="metrics"]',
    content: 'Estas são suas métricas principais. Acompanhe performance em tempo real.',
  },
  {
    selector: '[data-tour="charts"]',
    content: 'Visualize tendências e padrões com gráficos interativos.',
  },
  {
    selector: '[data-tour="ai-assistant"]',
    content: 'Use nossa IA para obter insights personalizados sobre suas campanhas.',
  },
  {
    selector: '[data-tour="notifications"]',
    content: 'Mantenha-se atualizado com notificações importantes.',
  }
];

export function OnboardingTour() {
  const { isOnboardingComplete } = useUserPreferences();
  const { setIsOpen, setSteps } = useTour();

  useEffect(() => {
    if (!isOnboardingComplete) {
      setSteps(tourSteps);
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, [isOnboardingComplete, setIsOpen, setSteps]);

  return null;
}

export function OnboardingTrigger() {
  const { resetOnboarding } = useUserPreferences();
  const { setIsOpen, setSteps } = useTour();

  const startTour = () => {
    setSteps(tourSteps);
    setIsOpen(true);
  };

  return (
    <Button variant="outline" onClick={startTour}>
      Refazer Tour
    </Button>
  );
}