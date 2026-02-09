import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CONFLICT_STYLES, STRESS_RESPONSES, type TriggerProfile } from '@/types/triggers';

interface TriggerProfileViewProps {
  profile: TriggerProfile;
  label: string;
}

const TriggerProfileView = ({ profile, label }: TriggerProfileViewProps) => {
  const conflictInfo = CONFLICT_STYLES.find((s) => s.value === profile.conflict_style);
  const stressInfo = STRESS_RESPONSES.find((s) => s.value === profile.stress_response);

  return (
    <div className="space-y-3">
      {/* Emotional Triggers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">💔 {label}&apos;s Emotional Triggers</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {profile.emotional_triggers.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Childhood Patterns */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">🧒 Childhood Patterns</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {profile.childhood_triggers.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hangups */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">🔒 Personal Hangups</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {profile.hangups.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conflict & Stress */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground uppercase">Conflict Style</p>
              <p className="text-sm font-medium text-foreground">{conflictInfo?.label || profile.conflict_style}</p>
              <p className="text-xs text-muted-foreground">{conflictInfo?.description}</p>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground uppercase">Stress Response</p>
              <p className="text-sm font-medium text-foreground">{stressInfo?.label || profile.stress_response}</p>
              <p className="text-xs text-muted-foreground">{stressInfo?.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Needs */}
      {profile.needs_when_triggered && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">💛 What {label} Needs When Triggered</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-sm text-foreground leading-relaxed">{profile.needs_when_triggered}</p>
          </CardContent>
        </Card>
      )}

      {/* Misread signals */}
      {profile.misread_signals && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">⚠️ Signals Often Misread</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-sm text-foreground leading-relaxed">{profile.misread_signals}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TriggerProfileView;
