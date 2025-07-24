import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SortableItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function SortableItem({ id, title, children }: SortableItemProps) {
  const [isVisible, setIsVisible] = useState(true);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="relative group">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="h-8 w-8 p-0"
          >
            {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <div
            className="cursor-grab active:cursor-grabbing h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
        
        {isVisible && (
          <div className="p-0">
            {children}
          </div>
        )}
        
        {!isVisible && (
          <div className="p-4 text-center text-muted-foreground">
            <p className="text-sm">{title} está oculto</p>
          </div>
        )}
      </Card>
    </div>
  );
}