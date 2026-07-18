'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Clock, Star } from 'lucide-react';

export const TopTechnicians = () => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/top-technicians')
      .then(r => r.ok ? r.json() : [])
      .then(data => setTechnicians(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Card><Skeleton className="h-64 w-full" /></Card>;

  return (
    <Card variant="glass">
      <CardHeader><CardTitle>Top Technicians</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {technicians.map((tech, index) => (
            <div key={tech.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">{tech.name.charAt(0)}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{tech.name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Award size={14} />{tech.completedWO} WO</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{tech.avgResponseTime}m</span>
                  <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-500 text-yellow-500" />{tech.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary-600">#{index + 1}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
