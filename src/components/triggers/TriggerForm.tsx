import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import {
  EMOTIONAL_TRIGGER_OPTIONS,
  CHILDHOOD_TRIGGER_OPTIONS,
  HANGUP_OPTIONS,
  CONFLICT_STYLES,
  STRESS_RESPONSES,
  type TriggerProfile,
} from '@/types/triggers';

interface TriggerFormProps {
  onComplete: (profile: Omit<TriggerProfile, 'id' | 'user_id' | 'couple_id' | 'created_at' | 'updated_at'>) => void;
  existingProfile?: TriggerProfile | null;
}

const STEPS = [
  { key: 'emotional', title: '💔 Emotional Triggers', subtitle: 'What situations or behaviors trigger strong emotional reactions for you?' },
  { key: 'childhood', title: '🧒 Childhood Patterns', subtitle: 'What experiences from growing up still affect how you react today?' },
  { key: 'hangups', title: '🔒 Personal Hangups', subtitle: 'What personal struggles or patterns do you bring into your relationship?' },
  { key: 'conflict', title: '⚡ Conflict & Stress', subtitle: 'How do you typically handle conflict and stress?' },
  { key: 'needs', title: '💛 Needs & Signals', subtitle: 'What do you need when triggered, and what signals might your partner misread?' },
];

const TriggerForm = ({ onComplete, existingProfile }: TriggerFormProps) => {
  const [step, setStep] = useState(0);
  const [emotionalTriggers, setEmotionalTriggers] = useState<string[]>(existingProfile?.emotional_triggers || []);
  const [childhoodTriggers, setChildhoodTriggers] = useState<string[]>(existingProfile?.childhood_triggers || []);
  const [hangups, setHangups] = useState<string[]>(existingProfile?.hangups || []);
  const [conflictStyle, setConflictStyle] = useState(existingProfile?.conflict_style || '');
  const [stressResponse, setStressResponse] = useState(existingProfile?.stress_response || '');
  const [needsWhenTriggered, setNeedsWhenTriggered] = useState(existingProfile?.needs_when_triggered || '');
  const [misreadSignals, setMisreadSignals] = useState(existingProfile?.misread_signals || '');

  const progress = ((step + 1) / STEPS.length) * 100;

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return emotionalTriggers.length > 0;
      case 1: return childhoodTriggers.length > 0;
      case 2: return hangups.length > 0;
      case 3: return conflictStyle !== '' && stressResponse !== '';
      case 4: return needsWhenTriggered.trim() !== '';
      default: return false;
    }
  };

  const handleFinish = () => {
    onComplete({
      emotional_triggers: emotionalTriggers,
      childhood_triggers: childhoodTriggers,
      hangups,
      conflict_style: conflictStyle,
      stress_response: stressResponse,
      needs_when_triggered: needsWhenTriggered,
      misread_signals: misreadSignals,
    });
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{STEPS[step].title}</CardTitle>
          <p className="text-xs text-muted-foreground">{STEPS[step].subtitle}</p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {/* Step 0: Emotional triggers */}
          {step === 0 && (
            <div className="flex flex-wrap gap-2">
              {EMOTIONAL_TRIGGER_OPTIONS.map((opt) => (
                <Badge
                  key={opt}
                  variant={emotionalTriggers.includes(opt) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs py-1.5 px-3 transition-all"
                  onClick={() => toggleItem(emotionalTriggers, setEmotionalTriggers, opt)}
                >
                  {opt}
                </Badge>
              ))}
            </div>
          )}

          {/* Step 1: Childhood triggers */}
          {step === 1 && (
            <div className="flex flex-wrap gap-2">
              {CHILDHOOD_TRIGGER_OPTIONS.map((opt) => (
                <Badge
                  key={opt}
                  variant={childhoodTriggers.includes(opt) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs py-1.5 px-3 transition-all"
                  onClick={() => toggleItem(childhoodTriggers, setChildhoodTriggers, opt)}
                >
                  {opt}
                </Badge>
              ))}
            </div>
          )}

          {/* Step 2: Hangups */}
          {step === 2 && (
            <div className="flex flex-wrap gap-2">
              {HANGUP_OPTIONS.map((opt) => (
                <Badge
                  key={opt}
                  variant={hangups.includes(opt) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs py-1.5 px-3 transition-all"
                  onClick={() => toggleItem(hangups, setHangups, opt)}
                >
                  {opt}
                </Badge>
              ))}
            </div>
          )}

          {/* Step 3: Conflict & Stress */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-foreground mb-2">My conflict style:</p>
                <div className="space-y-2">
                  {CONFLICT_STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setConflictStyle(s.value)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${
                        conflictStyle === s.value
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border/50 bg-background text-foreground hover:border-primary/30'
                      }`}
                    >
                      <span className="font-medium">{s.label}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground mb-2">My stress response:</p>
                <div className="grid grid-cols-2 gap-2">
                  {STRESS_RESPONSES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStressResponse(s.value)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        stressResponse === s.value
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border/50 bg-background text-foreground hover:border-primary/30'
                      }`}
                    >
                      <span className="text-sm font-medium">{s.label}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{s.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Needs & Signals */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-foreground mb-1.5">
                  When I&apos;m triggered, I need my partner to...
                </p>
                <Textarea
                  value={needsWhenTriggered}
                  onChange={(e) => setNeedsWhenTriggered(e.target.value)}
                  placeholder="e.g., Give me 10 minutes of space, then come check on me gently..."
                  className="text-sm min-h-[80px]"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground mb-1.5">
                  Signals my partner might misread (optional)
                </p>
                <Textarea
                  value={misreadSignals}
                  onChange={(e) => setMisreadSignals(e.target.value)}
                  placeholder="e.g., When I go quiet, it doesn't mean I'm angry — I'm processing..."
                  className="text-sm min-h-[80px]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            size="sm"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="text-xs"
          >
            Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleFinish}
            disabled={!canProceed()}
            className="text-xs"
          >
            Save Profile 💛
          </Button>
        )}
      </div>
    </div>
  );
};

export default TriggerForm;
