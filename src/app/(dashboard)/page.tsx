import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard - AssetPilot' };

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to AssetPilot</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold">Total Assets</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold">Work Orders</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold">Merchants</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}