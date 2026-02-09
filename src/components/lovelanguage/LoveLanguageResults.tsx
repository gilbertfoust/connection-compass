import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LOVE_LANGUAGE_INFO, type LoveLanguageKey, type LoveLanguageResult } from '@/data/loveLanguages';

interface LoveLanguageResultsProps {
  result: LoveLanguageResult;
  label: string;
}

const LANGUAGE_KEYS: LoveLanguageKey[] = [
  'words_of_affirmation',
  'acts_of_service',
  'receiving_gifts',
  'quality_time',
  'physical_touch',
];

const LoveLanguageResults = ({ result, label }: LoveLanguageResultsProps) => {
  const total = LANGUAGE_KEYS.reduce((sum, k) => sum + result[k], 0);
  const primaryKey = result.primary_language as LoveLanguageKey;
  const secondaryKey = result.secondary_language as LoveLanguageKey;
  const primaryInfo = LOVE_LANGUAGE_INFO[primaryKey];
  const secondaryInfo = LOVE_LANGUAGE_INFO[secondaryKey];

  const sorted = LANGUAGE_KEYS
    .map((k) => ({ key: k, score: result[k], ...LOVE_LANGUAGE_INFO[k] }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-3">
      {/* Primary language highlight */}
      <Card className="border-primary/30">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <span className="text-3xl">{primaryInfo?.emoji}</span>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}&apos;s Primary Language</p>
              <p className="text-base font-bold text-foreground">{primaryInfo?.label}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{primaryInfo?.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Secondary */}
      {secondaryInfo && (
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <span className="text-xl">{secondaryInfo.emoji}</span>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Secondary Language</p>
              <p className="text-sm font-semibold text-foreground">{secondaryInfo.label}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          {sorted.map((lang) => {
            const pct = total > 0 ? (lang.score / total) * 100 : 0;
            return (
              <div key={lang.key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground flex items-center gap-1.5">
                    {lang.emoji} {lang.label}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {lang.score}/{total} ({Math.round(pct)}%)
                  </span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: lang.color }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoveLanguageResults;
