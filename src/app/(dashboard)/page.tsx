import { Metadata } from 'next';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { DashboardCharts } from '@/components/dashboard/dashboard-charts';
import { TopTechnicians } from '@/components/dashboard/top-technicians';
import { RecentActivities } from '@/components/dashboard/recent-activities';

export const metadata: Metadata = { title: 'Dashboard - AssetPilot' };

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to AssetPilot</p>
      </div>
      <DashboardStats />
      <DashboardCharts />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopTechnicians />
        <RecentActivities />
      </div>
    </div>
  );
}
