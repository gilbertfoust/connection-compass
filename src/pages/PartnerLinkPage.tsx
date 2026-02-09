import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Copy, Heart, Link2, Check, UserPlus, Lock, Unlock,
  CalendarHeart, Calendar, ClipboardList, DollarSign,
  HeartHandshake, ShieldAlert, Eye,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const PARTNER_FEATURES = [
  { icon: CalendarHeart, label: 'Date Night', description: 'AI-powered date suggestions tailored to both of you' },
  { icon: Calendar, label: 'Shared Calendar', description: 'Sync events, reminders, and date nights' },
  { icon: ClipboardList, label: 'Goals & Todos', description: 'Set shared goals and track progress together' },
  { icon: DollarSign, label: 'Couple Budget', description: 'Track spending and build financial harmony' },
  { icon: HeartHandshake, label: 'Love Languages', description: 'Discover and compare how you give and receive love' },
  { icon: ShieldAlert, label: 'Triggers & Understanding', description: 'Understand each other\'s triggers and avoid misunderstandings' },
  { icon: Eye, label: 'Vision Board', description: 'Build a shared vision for your future together' },
];

const PartnerLinkPage = () => {
  const { profile, linkPartner, coupleId } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  if (coupleId) {
    return (
      <div className="space-y-5 animate-fade-in-up">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-primary fill-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">You're Connected! 💕</h2>
          <p className="text-sm text-muted-foreground mt-2">
            You and your partner are linked. All features are unlocked and your data is shared.
          </p>
        </div>

        {/* Unlocked Features */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Unlock className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">All Features Unlocked</span>
            </div>
            <div className="space-y-2">
              {PARTNER_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.label} className="flex items-center gap-3 py-1.5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{feature.label}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{feature.description}</p>
                    </div>
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h2 className="text-xl font-bold text-foreground">Link Your Partner</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Connect with your partner to unlock all shared features
        </p>
      </div>

      {/* Features that unlock */}
      <Card className="border-0 shadow-card bg-primary/5">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Features That Require a Partner</span>
          </div>
          <p className="text-xs text-muted-foreground">
            These features need both partners linked to work. Link your partner to unlock them all.
          </p>
          <div className="space-y-2">
            {PARTNER_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-center gap-3 py-1.5">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{feature.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{feature.description}</p>
                  </div>
                  <Lock className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Your Invite Code */}
      <Card className="border-0 shadow-card gradient-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Your Invite Code</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Share this code with your partner so they can link their account to yours.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-card rounded-xl px-4 py-3 text-center">
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
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Enter Partner's Code</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Got a code from your partner? Enter it below to link your accounts.
          </p>
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

      {/* How it works */}
      <div className="space-y-3 px-2">
        <h3 className="text-sm font-semibold text-foreground">How it works</h3>
        {[
          { step: '1', text: 'Share your invite code with your partner' },
          { step: '2', text: 'They sign up and enter your code' },
          { step: '3', text: 'All 7 shared features unlock instantly' },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">{item.step}</span>
            </div>
            <p className="text-sm text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerLinkPage;