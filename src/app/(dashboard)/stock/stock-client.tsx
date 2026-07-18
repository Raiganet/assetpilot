'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-display/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Boxes, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';

export const StockClient = () => {
  const [stock, setStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);

  const toast = useToast();

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stock');
      if (response.ok) {
        const data = await response.json();
        setStock(data);
        
        const total = data.reduce((sum: number, item: any) => {
          return sum + (parseFloat(item.purchase_cost) || 0);
        }, 0);
        setTotalValue(total);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'asset_id', label: 'Asset ID', sortable: true },
    { id: 'asset_type', label: 'Type', sortable: true },
    { id: 'brand', label: 'Brand', sortable: true },
    { id: 'model', label: 'Model', sortable: true },
    { id: 'serial_number', label: 'Serial Number', sortable: true },
    { 
      id: 'condition', 
      label: 'Condition', 
      render: (value: string) => (
        <Badge variant={value === 'good' ? 'success' : value === 'minor_damage' ? 'warning' : 'error'}>
          {value?.replace('_', ' ')}
        </Badge>
      )
    },
    { id: 'warehouse_name', label: 'Warehouse', sortable: true },
    { id: 'purchase_cost', label: 'Value', sortable: true, render: (v: string) => v ? 'Rp ' + parseInt(v).toLocaleString() : '-' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage available assets in warehouse</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stock.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500">
              <Boxes className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">Rp {totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Warehouses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {new Set(stock.map((s: any) => s.warehouse_id)).size}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={stock}
        totalCount={stock.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        loading={loading}
        emptyMessage="No stock available"
        actions={false}
      />
    </div>
  );
};