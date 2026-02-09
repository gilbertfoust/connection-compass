import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LOVE_LANGUAGE_INFO, type LoveLanguageKey, type LoveLanguageResult } from '@/data/loveLanguages';

interface PartnerComparisonProps {
  myResult: LoveLanguageResult;
  partnerResult: LoveLanguageResult;
  myName: string;
  partnerName: string;
}

const LANGUAGE_KEYS: LoveLanguageKey[] = [
  'words_of_affirmation',
  'acts_of_service',
  'receiving_gifts',
  'quality_time',
  'physical_touch',
];

const PartnerComparison = ({ myResult, partnerResult, myName, partnerName }: PartnerComparisonProps) => {
  const myPrimary = myResult.primary_language as LoveLanguageKey;
  const partnerPrimary = partnerResult.primary_language as LoveLanguageKey;
  const myInfo = LOVE_LANGUAGE_INFO[myPrimary];
  const partnerInfo = LOVE_LANGUAGE_INFO[partnerPrimary];

  // Generate compatibility insights
  const sameLanguage = myPrimary === partnerPrimary;
  const partnerTips = LOVE_LANGUAGE_INFO[partnerPrimary]?.tips || [];

  return (
    <div className="space-y-3">
      {/* Side by side primary */}
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            💞 Your Love Languages
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center space-y-1.5 p-3 rounded-xl bg-accent/30">
              <span className="text-2xl">{myInfo?.emoji}</span>
              <p className="text-[10px] text-muted-foreground uppercase">{myName}</p>
              <p className="text-xs font-bold text-foreground">{myInfo?.label}</p>
            </div>
            <div className="text-center space-y-1.5 p-3 rounded-xl bg-accent/30">
              <span className="text-2xl">{partnerInfo?.emoji}</span>
              <p className="text-[10px] text-muted-foreground uppercase">{partnerName}</p>
              <p className="text-xs font-bold text-foreground">{partnerInfo?.label}</p>
            </div>
          </div>

          {sameLanguage && (
            <div className="mt-3 p-2.5 rounded-lg bg-primary/10 text-center">
              <p className="text-xs text-primary font-medium">
                🎉 You share the same primary love language!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison bars */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">📊 Comparison</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          {LANGUAGE_KEYS.map((key) => {
            const info = LOVE_LANGUAGE_INFO[key];
            const myTotal = LANGUAGE_KEYS.reduce((s, k) => s + myResult[k], 0);
            const partnerTotal = LANGUAGE_KEYS.reduce((s, k) => s + partnerResult[k], 0);
            const myPct = myTotal > 0 ? (myResult[key] / myTotal) * 100 : 0;
            const partnerPct = partnerTotal > 0 ? (partnerResult[key] / partnerTotal) * 100 : 0;

            return (
              <div key={key} className="space-y-1">
                <p className="text-xs text-foreground flex items-center gap-1">
                  {info.emoji} {info.label}
                </p>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-12 text-right shrink-0">{myName}</span>
                    <div className="flex-1 bg-muted/50 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all bg-primary"
                        style={{ width: `${myPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground w-8">{Math.round(myPct)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-12 text-right shrink-0">{partnerName}</span>
                    <div className="flex-1 bg-muted/50 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all bg-chart-2"
                        style={{ width: `${partnerPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground w-8">{Math.round(partnerPct)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Tips for partner */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            💡 How to Love {partnerName}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-xs text-muted-foreground mb-2">
            {partnerName}&apos;s primary language is <strong className="text-foreground">{partnerInfo?.label}</strong>. Try these:
          </p>
          <ul className="space-y-1.5">
            {partnerTips.map((tip, i) => (
              <li key={i} className="text-xs text-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerComparison;
