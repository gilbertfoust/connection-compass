export interface TriggerProfile {
  id: string;
  user_id: string;
  couple_id: string;
  emotional_triggers: string[];
  childhood_triggers: string[];
  hangups: string[];
  conflict_style: string;
  stress_response: string;
  needs_when_triggered: string;
  misread_signals: string;
  created_at: string;
  updated_at: string;
}

export interface TriggerInsights {
  dynamic_insights: {
    title: string;
    description: string;
    tip: string;
  }[];
  potential_misunderstandings: {
    scenario: string;
    partner_a_perspective: string;
    partner_b_perspective: string;
    bridge: string;
  }[];
  growth_areas: string[];
}

export const EMOTIONAL_TRIGGER_OPTIONS = [
  'Feeling dismissed or ignored',
  'Being criticized or judged',
  'Feeling controlled or micromanaged',
  'Lack of affection or attention',
  'Broken promises or trust issues',
  'Feeling inadequate or not enough',
  'Being compared to others',
  'Feeling abandoned or alone',
  'Loud arguments or raised voices',
  'Silent treatment or stonewalling',
  'Financial stress or money conflicts',
  'Feeling unappreciated',
  'Jealousy or possessiveness',
  'Feeling rushed or pressured',
  'Disrespect of boundaries',
];

export const CHILDHOOD_TRIGGER_OPTIONS = [
  'Parents who were emotionally unavailable',
  'Grew up in a high-conflict household',
  'Experienced emotional neglect',
  'Parentification — had to be the "adult" child',
  'Perfectionism was expected or demanded',
  'Love felt conditional on performance',
  'Witnessed unhealthy relationship patterns',
  'Experienced bullying or social exclusion',
  'Family avoided conflict entirely',
  'Unstable home environment or frequent moves',
  'Overly strict or authoritarian parenting',
  'Loss of a parent or significant caregiver',
  'Sibling rivalry or favoritism',
  'Lack of emotional vocabulary in family',
];

export const HANGUP_OPTIONS = [
  'Difficulty asking for help',
  'Fear of vulnerability or openness',
  'Needing to be "right" in arguments',
  'Avoiding conflict at all costs',
  'Difficulty trusting others fully',
  'Fear of abandonment',
  'Overthinking and anxiety spirals',
  'Difficulty receiving compliments or love',
  'Comparing myself to others',
  'Perfectionism and self-criticism',
  'Fear of rejection or disapproval',
  'Difficulty setting boundaries',
  'People-pleasing tendencies',
  'Emotional shutdown under stress',
];

export const CONFLICT_STYLES = [
  { value: 'avoider', label: '🏃 Avoider', description: 'I tend to withdraw or avoid confrontation' },
  { value: 'pursuer', label: '🗣️ Pursuer', description: 'I want to talk things through right away' },
  { value: 'peacemaker', label: '🕊️ Peacemaker', description: 'I try to smooth things over quickly' },
  { value: 'analyzer', label: '🧠 Analyzer', description: 'I need time to think before responding' },
  { value: 'expresser', label: '💥 Expresser', description: 'I tend to express emotions intensely' },
];

export const STRESS_RESPONSES = [
  { value: 'fight', label: '⚡ Fight', description: 'I get defensive or confrontational' },
  { value: 'flight', label: '🏃 Flight', description: 'I withdraw, shut down, or leave' },
  { value: 'freeze', label: '🧊 Freeze', description: 'I go blank, numb, or can\'t respond' },
  { value: 'fawn', label: '🤝 Fawn', description: 'I people-please and try to fix everything' },
];
