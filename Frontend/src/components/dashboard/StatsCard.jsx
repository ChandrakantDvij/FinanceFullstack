// Removed LucideIcon import as it's not needed
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatsCard({ title, value, icon: Icon, trend, gradient = 'primary' }) {
  const gradients = {
    primary: 'bg-gradient-primary',
    secondary: 'bg-gradient-secondary',
    success: 'bg-gradient-success',
    warning: 'from-warning to-warning/80',
   
  };

  // Special-case styling: make the Total Expenses icon background red
  const iconBgClass = title === 'Total Expenses' ? 'bg-red-500' : (gradients[gradient] || 'bg-gradient-primary');

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up border-border/50 backdrop-blur-sm bg-card/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
          {trend && (
            <p className={cn("text-sm font-medium flex items-center", trend.isPositive ? "text-success" : "text-destructive")}>
              
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl shadow-lg", iconBgClass)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}