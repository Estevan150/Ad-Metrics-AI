import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { DashboardMetrics } from './DashboardMetrics';
import { ChartSection } from './ChartSection';
import { RecentCampaigns } from './RecentCampaigns';
import { AIInsights } from './AIInsights';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const componentMap = {
  metrics: { component: DashboardMetrics, title: 'Métricas Principais' },
  charts: { component: ChartSection, title: 'Gráficos' },
  campaigns: { component: RecentCampaigns, title: 'Campanhas Recentes' },
  insights: { component: AIInsights, title: 'Insights da IA' },
  analytics: { component: AdvancedAnalytics, title: 'Analytics Avançados' },
};

export function DashboardGrid() {
  const { preferences, updatePreferences } = useUserPreferences();
  const [items, setItems] = useState(preferences.dashboardLayout);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      
      setItems(newOrder);
      updatePreferences({ dashboardLayout: newOrder });
    }
  }

  return (
    <div className="space-y-6" data-tour="dashboard">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id) => {
            const { component: Component, title } = componentMap[id as keyof typeof componentMap];
            return (
              <SortableItem key={id} id={id} title={title}>
                <Component />
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}