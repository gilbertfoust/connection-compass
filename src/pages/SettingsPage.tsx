import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Copy, Heart, Link2, Check, UserPlus, LogOut, User, Sparkles, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ProfileQuestionnaire from '@/components/profile/ProfileQuestionnaire';

const SettingsPage = () => {
  const { profile, signOut, linkPartner, coupleId } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const copyCode = async () => {
    if (profile?.invite_code) {
      await navigator.clipboard.writeText(profile.invite_code);
      setCopied(true);
      toast({ title: 'Copied!', description: 'Share this code with your partner.' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLink = async () => {
    if (!inviteCode.trim()) return;
    setLoading(true);
    const result = await linkPartner(inviteCode.trim());
    if (result.success) {
      toast({ title: 'Partner linked! 💕', description: `You're now connected with ${result.partnerName}` });
    } else {
      toast({ title: 'Linking failed', description: result.error, variant: 'destructive' });
    }
    setLoading(false);
    setInviteCode('');
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h2 className="text-xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Account, partner link, and preferences
        </p>
      </div>

      {/* Account Info */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {profile?.display_name || 'Your Account'}
              </p>
              <p className="text-xs text-muted-foreground">
                {coupleId ? '💕 Partner linked' : '🔗 No partner linked yet'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Link Section */}
      {coupleId ? (
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-2xl px-4 py-2.5">
          <Heart className="h-4 w-4 text-primary fill-primary shrink-0" />
          <span className="text-xs text-foreground">You're connected with your partner — all shared data syncs in real time ✨</span>
        </div>
      ) : (
        <>
          {/* Your Invite Code */}
          <Card className="border-0 shadow-card gradient-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Your Invite Code</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this code with your partner to link your accounts.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-card rounded-xl px-4 py-2.5 text-center">
                  <span className="text-lg font-mono font-bold tracking-widest text-foreground">
                    {profile?.invite_code || '...'}
                  </span>
                </div>
                <Button variant="outline" size="icon" onClick={copyCode} className="shrink-0 rounded-xl">
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enter Partner Code */}
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Enter Partner's Code</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="font-mono tracking-wider"
                />
                <Button onClick={handleLink} disabled={!inviteCode.trim() || loading}>
                  {loading ? '...' : 'Link'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Separator />

      {/* Personal Profile Questionnaire (collapsible) */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-4">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">About You</p>
                <p className="text-xs text-muted-foreground">Personalize your experience</p>
              </div>
            </div>
            {showProfile ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {showProfile && (
            <div className="mt-4">
              <ProfileQuestionnaire />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Button
        variant="outline"
        className="w-full gap-2 text-muted-foreground"
        onClick={signOut}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default SettingsPage;
