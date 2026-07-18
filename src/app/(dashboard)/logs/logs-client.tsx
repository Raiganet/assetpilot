'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-display/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, Search } from 'lucide-react';

export const LogsClient = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'created_at', label: 'Timestamp', sortable: true, render: (v: string) => v ? new Date(v).toLocaleString() : '-' },
    { id: 'user_name', label: 'User', sortable: true },
    { id: 'action', label: 'Action', sortable: true },
    { id: 'entity_type', label: 'Entity', sortable: true },
    { id: 'ip_address', label: 'IP Address', sortable: false },
    { 
      id: 'status', 
      label: 'Status', 
      render: () => <Badge variant="success">Success</Badge>
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Audit trail and system activity history</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ScrollText className="h-6 w-6 text-primary-600" />
            <CardTitle>Recent Activities</CardTitle>
          </div>
        </CardHeader>
      </Card>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        totalCount={logs.length}
        page={1}
        pageSize={25}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        loading={loading}
        emptyMessage="No activity logs found"
        actions={false}
      />
    </div>
  );
};