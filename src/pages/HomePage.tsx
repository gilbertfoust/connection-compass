import QuestionOfTheDay from '@/components/home/QuestionOfTheDay';
import StreakCounter from '@/components/home/StreakCounter';
import QuickActions from '@/components/home/QuickActions';
import RecommendedCard from '@/components/home/RecommendedCard';
import heroBg from '@/assets/hero-bg.jpg';

const HomePage = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden -mx-4 -mt-6">
        <img
          src={heroBg}
          alt="Warm romantic background"
          className="w-full h-40 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background flex items-end p-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Welcome back 💕</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Let's grow closer today</p>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="flex justify-center">
        <StreakCounter />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Question of the Day */}
      <QuestionOfTheDay />

      {/* Recommended Activity */}
      <RecommendedCard />
    </div>
  );
};

export default HomePage;
