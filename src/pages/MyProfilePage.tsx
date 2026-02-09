import ProfileQuestionnaire from '@/components/profile/ProfileQuestionnaire';

const MyProfilePage = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">About You</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Help us personalize your experience — only you can see your answers
        </p>
      </div>

      <ProfileQuestionnaire />
    </div>
  );
};

export default MyProfilePage;
