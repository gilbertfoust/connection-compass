import { activities } from '@/data/activities';
import ActivityCard from '@/components/activities/ActivityCard';

const ActivitiesPage = () => {
  return (
    <div className="space-y-3">
      {activities.map((activity, i) => (
        <ActivityCard key={activity.id} activity={activity} index={i} />
      ))}
    </div>
  );
};

export default ActivitiesPage;
