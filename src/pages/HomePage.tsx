import { useAuth } from '@/contexts/AuthContext';
import DailyCheckIn from '@/components/home/DailyCheckIn';
import QuestionOfTheDay from '@/components/home/QuestionOfTheDay';
import SuggestedAction from '@/components/home/SuggestedAction';
import DailyReflection from '@/components/home/DailyReflection';
import StreakCounter from '@/components/home/StreakCounter';
import PartnerBanner from '@/components/home/PartnerBanner';
import heroBg from '@/assets/hero-bg.jpg';

const HomePage = () => {
  const { profile } = useAuth();
  const displayName = profile?.display_name || 'there';

  return (
    <div className="space-y-5">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden -mx-4 -mt-6">
        <img
          src={heroBg}
          alt="Warm romantic background"
          className="w-full h-36 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background flex items-end p-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Hey, {displayName} 💕</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Let's grow closer today</p>
          </div>
        </div>
      </div>

      {/* Partner Link Banner */}
      <PartnerBanner />

      {/* Streak */}
      <div className="flex justify-center">
        <StreakCounter />
      </div>

      {/* Daily Core Loop */}
      <DailyCheckIn />
      <QuestionOfTheDay />
      <SuggestedAction />
      <DailyReflection />
    </div>
  );
};

export default HomePage;
