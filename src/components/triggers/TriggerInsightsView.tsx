import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TriggerInsights } from '@/types/triggers';

interface TriggerInsightsViewProps {
  insights: TriggerInsights;
}

const TriggerInsightsView = ({ insights }: TriggerInsightsViewProps) => {
  return (
    <div className="space-y-3">
      {/* Dynamic Insights */}
      {insights.dynamic_insights?.length > 0 && (
        <div className="space-y-2">
          {insights.dynamic_insights.map((insight, i) => (
            <Card key={i} className="border-primary/15">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-1">💡 {insight.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{insight.description}</p>
                <div className="p-2.5 rounded-lg bg-primary/5">
                  <p className="text-xs text-foreground">
                    <span className="font-medium text-primary">Tip:</span> {insight.tip}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Potential Misunderstandings */}
      {insights.potential_misunderstandings?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              🔄 Potential Misunderstandings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            {insights.potential_misunderstandings.map((m, i) => (
              <div key={i} className="space-y-2 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                <p className="text-xs font-semibold text-foreground">📌 {m.scenario}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-chart-1/10">
                    <p className="text-[10px] text-muted-foreground uppercase mb-0.5">You might feel</p>
                    <p className="text-xs text-foreground">{m.partner_a_perspective}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-chart-2/10">
                    <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Partner might feel</p>
                    <p className="text-xs text-foreground">{m.partner_b_perspective}</p>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-primary/5">
                  <p className="text-xs text-foreground">
                    <span className="font-medium text-primary">Bridge:</span> {m.bridge}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Growth Areas */}
      {insights.growth_areas?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              🌱 Growth Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {insights.growth_areas.map((area, i) => (
                <Badge key={i} variant="outline" className="text-xs py-1.5 px-3">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TriggerInsightsView;
