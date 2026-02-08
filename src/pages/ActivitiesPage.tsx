import { activities } from '@/data/activities';
import ActivityCard from '@/components/activities/ActivityCard';

const ActivitiesPage = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Activities & Games</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Fun ways to connect, reflect, and play together
        </p>
      </div>

      <div className="space-y-3">
        {activities.map((activity, i) => (
          <ActivityCard key={activity.id} activity={activity} index={i} />
        ))}
      </div>
    </div>
  );
};

export default ActivitiesPage;
