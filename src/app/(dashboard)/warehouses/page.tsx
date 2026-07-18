import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Warehouses - AssetPilot',
};

export default function WarehousesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Warehouses</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage warehouse locations</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <p className="text-gray-500">Warehouse management page</p>
      </div>
    </div>
  );
}