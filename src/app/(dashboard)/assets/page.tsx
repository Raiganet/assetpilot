import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assets - AssetPilot',
};

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assets</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage EDC assets and devices</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <p>Assets page - Coming soon</p>
      </div>
    </div>
  );
}