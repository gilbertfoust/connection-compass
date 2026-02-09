import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight } from 'lucide-react';
import { QUIZ_QUESTIONS, type LoveLanguageKey } from '@/data/loveLanguages';

interface LoveLanguageQuizProps {
  onComplete: (scores: Record<LoveLanguageKey, number>) => void;
}

const LoveLanguageQuiz = ({ onComplete }: LoveLanguageQuizProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<LoveLanguageKey, number>>({
    words_of_affirmation: 0,
    acts_of_service: 0,
    receiving_gifts: 0,
    quality_time: 0,
    physical_touch: 0,
  });

  const question = QUIZ_QUESTIONS[currentQ];
  const progress = ((currentQ) / QUIZ_QUESTIONS.length) * 100;

  const handleSelect = (language: LoveLanguageKey) => {
    const newScores = { ...scores, [language]: scores[language] + 1 };
    setScores(newScores);

    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onComplete(newScores);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-foreground mb-4">{question.prompt}</p>
          <div className="space-y-2">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt.language)}
                className="w-full text-left p-3 rounded-xl border border-border/50 bg-background hover:bg-accent hover:border-primary/30 transition-all text-sm text-foreground flex items-center justify-between group"
              >
                <span>{opt.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentQ > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentQ(currentQ - 1)}
          className="text-xs text-muted-foreground"
        >
          ← Go back
        </Button>
      )}
    </div>
  );
};

export default LoveLanguageQuiz;
