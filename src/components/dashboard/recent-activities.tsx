'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRelativeTime } from '@/lib/utils/format';

export const RecentActivities = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/recent-activities').then(r => r.ok ? r.json() : []).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Card><Skeleton className="h-64 w-full" /></Card>;

  return (
    <Card variant="glass">
      <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">{activity.user_name.charAt(0)}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white"><span className="font-semibold">{activity.user_name}</span> {activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(activity.timestamp)}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && <div className="text-center py-8 text-gray-500">No recent activities</div>}
        </div>
      </CardContent>
    </Card>
  );
};
