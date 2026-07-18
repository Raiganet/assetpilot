'use client';
import { useEffect, useState } from 'react';
import { StatCard } from './stat-card';
import { ClipboardList, Package, AlertTriangle, CheckCircle, Hammer, Boxes, Trash2, Warehouse } from 'lucide-react';

export const DashboardStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStats(d); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard title="Outstanding WO" value={stats?.outstandingWO || 0} icon={ClipboardList} color="blue" loading={loading} />
      <StatCard title="Asset On Technician" value={stats?.assetOnTechnician || 0} icon={Package} color="purple" loading={loading} />
      <StatCard title="Late Return" value={stats?.lateReturn || 0} icon={AlertTriangle} color="red" loading={loading} />
      <StatCard title="Received Today" value={stats?.receivedToday || 0} icon={CheckCircle} color="green" loading={loading} />
      <StatCard title="In Repair" value={stats?.inRepair || 0} icon={Hammer} color="orange" loading={loading} />
      <StatCard title="Ready Stock" value={stats?.readyStock || 0} icon={Boxes} color="green" loading={loading} />
      <StatCard title="Scrap" value={stats?.scrap || 0} icon={Trash2} color="red" loading={loading} />
      <StatCard title="Warehouse Stock" value={stats?.warehouseStock || 0} icon={Warehouse} color="blue" loading={loading} />
    </div>
  );
};
