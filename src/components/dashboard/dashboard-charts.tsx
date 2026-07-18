'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DashboardCharts = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/monthly').then(r => r.ok ? r.json() : []).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Card><Skeleton className="h-80 w-full" /></Card><Card><Skeleton className="h-80 w-full" /></Card></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card variant="glass">
        <CardHeader><CardTitle>Monthly Transactions</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="withdrawals" stroke="#3b82f6" strokeWidth={2} name="Withdrawals" />
              <Line type="monotone" dataKey="receives" stroke="#10b981" strokeWidth={2} name="Receives" />
              <Line type="monotone" dataKey="repairs" stroke="#f59e0b" strokeWidth={2} name="Repairs" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card variant="glass">
        <CardHeader><CardTitle>Transaction Comparison</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip /><Legend />
              <Bar dataKey="withdrawals" fill="#3b82f6" name="Withdrawals" radius={[8, 8, 0, 0]} />
              <Bar dataKey="receives" fill="#10b981" name="Receives" radius={[8, 8, 0, 0]} />
              <Bar dataKey="repairs" fill="#f59e0b" name="Repairs" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
