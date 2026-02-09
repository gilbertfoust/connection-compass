import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { PROFILE_QUESTIONS } from '@/data/profileQuestions';
import { usePersonalProfile, type PersonalProfile } from '@/hooks/usePersonalProfile';

const ProfileQuestionnaire = () => {
  const { profile, loading, saving, saveProfile } = usePersonalProfile();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  // Seed answers from existing profile
  useEffect(() => {
    if (profile) {
      const existing: Record<string, string | string[]> = {};
      PROFILE_QUESTIONS.forEach((q) => {
        const val = (profile as any)[q.field];
        if (val !== undefined && val !== '' && !(Array.isArray(val) && val.length === 0)) {
          existing[q.field] = val;
        }
      });
      setAnswers(existing);
    }
  }, [profile]);

  const currentQ = PROFILE_QUESTIONS[step];
  const progress = ((step + 1) / PROFILE_QUESTIONS.length) * 100;

  const getAnswer = (field: string): string | string[] => answers[field] ?? (currentQ.type === 'text' || currentQ.type === 'single-select' ? '' : []);

  const toggleMulti = (field: string, option: string) => {
    const current = (getAnswer(field) as string[]) || [];
    setAnswers({
      ...answers,
      [field]: current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option],
    });
  };

  const setSingle = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value });
  };

  const canProceed = () => {
    const answer = getAnswer(currentQ.field);
    if (currentQ.type === 'multi-select') return (answer as string[]).length > 0;
    if (currentQ.type === 'single-select') return (answer as string) !== '';
    if (currentQ.type === 'text') return (answer as string).trim().length > 0;
    return false;
  };

  const handleFinish = async () => {
    // Build the update payload
    const payload: Partial<PersonalProfile> = { completed: true };
    PROFILE_QUESTIONS.forEach((q) => {
      const val = answers[q.field];
      if (val !== undefined) {
        (payload as any)[q.field] = val;
      }
    });
    await saveProfile(payload);
  };

  const handleSaveProgress = async () => {
    const payload: Partial<PersonalProfile> = {};
    PROFILE_QUESTIONS.forEach((q) => {
      const val = answers[q.field];
      if (val !== undefined) {
        (payload as any)[q.field] = val;
      }
    });
    await saveProfile(payload);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Completed state
  if (profile?.completed && step === 0) {
    return (
      <div className="space-y-4 animate-fade-in-up">
        <Card className="border-0 shadow-card">
          <CardContent className="p-5 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Profile Complete!</h3>
            <p className="text-sm text-muted-foreground">
              Your answers are shaping the experience just for you. You can update them anytime.
            </p>
            <Button variant="outline" onClick={() => setStep(0)} className="text-sm">
              Review & Edit Answers
            </Button>
          </CardContent>
        </Card>

        {/* Summary preview */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-4 space-y-3">
            {PROFILE_QUESTIONS.filter((q) => {
              const val = answers[q.field];
              return val && (Array.isArray(val) ? val.length > 0 : val.trim() !== '');
            }).map((q) => {
              const val = answers[q.field];
              return (
                <div key={q.key} className="space-y-1">
                  <p className="text-xs font-medium text-foreground">{q.title}</p>
                  {Array.isArray(val) ? (
                    <div className="flex flex-wrap gap-1">
                      {(val as string[]).map((v) => (
                        <Badge key={v} variant="secondary" className="text-[10px]">{v}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">{val as string}</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Button
          variant="ghost"
          className="w-full text-xs text-muted-foreground"
          onClick={() => {
            // Reset to editing mode — jump to first question
            setStep(0);
            // Force re-render in edit mode by temporarily unsetting completed
          }}
        >
          Start from the beginning
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {step + 1} of {PROFILE_QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-0 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{currentQ.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{currentQ.subtitle}</p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {currentQ.type === 'multi-select' && (
            <div className="flex flex-wrap gap-2">
              {currentQ.options!.map((opt) => (
                <Badge
                  key={opt}
                  variant={(getAnswer(currentQ.field) as string[]).includes(opt) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs py-1.5 px-3 transition-all"
                  onClick={() => toggleMulti(currentQ.field, opt)}
                >
                  {opt}
                </Badge>
              ))}
            </div>
          )}

          {currentQ.type === 'single-select' && (
            <div className="space-y-2">
              {currentQ.options!.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSingle(currentQ.field, opt)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${
                    getAnswer(currentQ.field) === opt
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border/50 bg-background text-foreground hover:border-primary/30'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'text' && (
            <Textarea
              value={(getAnswer(currentQ.field) as string) || ''}
              onChange={(e) => setSingle(currentQ.field, e.target.value)}
              placeholder={currentQ.placeholder}
              className="text-sm min-h-[100px]"
            />
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

        <div className="flex gap-2">
          {step > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveProgress}
              disabled={saving}
              className="text-xs text-muted-foreground"
            >
              Save progress
            </Button>
          )}

          {step < PROFILE_QUESTIONS.length - 1 ? (
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
              disabled={!canProceed() || saving}
              className="text-xs"
            >
              {saving ? 'Saving...' : 'Complete Profile ✨'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileQuestionnaire;
