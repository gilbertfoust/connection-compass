import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { usePersonalProfile } from '@/hooks/usePersonalProfile';

const ProfilePromptCard = () => {
  const navigate = useNavigate();
  const { profile, loading } = usePersonalProfile();

  // Don't show if loading or already completed
  if (loading || profile?.completed) return null;

  return (
    <Card className="border-0 shadow-card gradient-card animate-fade-in-up">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Tell us about yourself</h3>
              <p className="text-xs text-muted-foreground">
                Answer a few questions so we can personalize your experience. Only you can see your answers.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/settings')}
              className="text-xs"
            >
              {profile ? 'Continue Setup' : 'Get Started'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePromptCard;
