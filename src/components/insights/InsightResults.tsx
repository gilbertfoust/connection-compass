import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, MessageCircle, BookOpen, Heart, Tag, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AnalysisResult } from '@/hooks/useConversationAnalysis';

interface InsightResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

const focusAreaLabels: Record<string, string> = {
  communication: '🗣️ Communication',
  trust: '🤝 Trust',
  intimacy: '💕 Intimacy',
  fun: '🎉 Fun & Play',
  healing: '🌱 Healing',
};

const toolRoutes: Record<string, string> = {
  'Conversation Decks': '/engagement',
  'Goal Tracker': '/plan',
  'To-Do List': '/plan',
  'Date Night Generator': '/date-night',
  'Activities & Games': '/activities',
};

const InsightResults = ({ result, onReset }: InsightResultsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Start Over
      </Button>

      {/* Mood Insight */}
      <Card className="border-0 shadow-card overflow-hidden">
        <div className="h-1 gradient-warm" />
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              How you're doing
            </span>
          </div>
          <p className="text-sm text-foreground font-medium">{result.moodInsight}</p>
          <div className="flex items-center gap-2 mt-3">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Focus area: {focusAreaLabels[result.focusArea] || result.focusArea}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-5">
          <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {result.themes.map((theme, i) => (
              <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                {theme}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Activities */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Recommended Activities</h3>
        </div>
        <div className="space-y-2">
          {result.suggestedActivities.map((activity, i) => (
            <Card key={i} className="border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{activity.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-card-foreground">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                    <p className="text-[10px] text-primary mt-1.5 italic">
                      ✨ {activity.reason}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Conversation Starters */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <MessageCircle className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Try Talking About</h3>
        </div>
        <div className="space-y-2">
          {result.conversationStarters.map((starter, i) => (
            <Card key={i} className="border-0 shadow-card">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-card-foreground">"{starter.question}"</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">{starter.context}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Suggested Tools */}
      {result.suggestedTools && result.suggestedTools.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Wrench className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Tools for You Two</h3>
          </div>
          <div className="space-y-2">
            {result.suggestedTools.map((tool, i) => (
              <Card
                key={i}
                className="border-0 shadow-card cursor-pointer hover:shadow-glow transition-all duration-300"
                onClick={() => {
                  const route = toolRoutes[tool.tool];
                  if (route) navigate(route);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{tool.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-card-foreground">{tool.tool}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{tool.reason}</p>
                      <span className="text-[10px] text-primary mt-1.5 inline-block">Tap to open →</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reflection Prompts */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Reflect Together</h3>
        </div>
        <div className="space-y-2">
          {result.reflectionPrompts.map((prompt, i) => (
            <Card key={i} className="border-0 shadow-card gradient-card">
              <CardContent className="p-4">
                <p className="text-sm text-card-foreground italic">"{prompt}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Try Again */}
      <div className="text-center pt-2 pb-4">
        <Button variant="outline" onClick={onReset} className="gap-1.5">
          Share something else
        </Button>
      </div>
    </div>
  );
};

export default InsightResults;
