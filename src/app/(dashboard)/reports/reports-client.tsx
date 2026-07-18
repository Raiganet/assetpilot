'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText, Download, BarChart3, TrendingUp, Package } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';

export const ReportsClient = () => {
  const toast = useToast();

  const handleExport = (type: string) => {
    toast.success('Generating ' + type + ' report... (Feature coming soon)');
  };

  const reportModules = [
    { title: 'Outstanding Assets', icon: Package, desc: 'Assets currently with technicians or merchants' },
    { title: 'Assets by Technician', icon: BarChart3, desc: 'Performance and asset allocation per technician' },
    { title: 'Warehouse Stock', icon: TrendingUp, desc: 'Current stock levels across all warehouses' },
    { title: 'Repair Report', icon: FileText, desc: 'History and costs of all repairs' },
    { title: 'Scrap Report', icon: FileText, desc: 'List of assets marked for scrapping' },
    { title: 'Merchant History', icon: FileSpreadsheet, desc: 'Complete asset history per merchant' },
    { title: 'Movement History', icon: TrendingUp, desc: 'Chain of custody and movement logs' },
    { title: 'Work Order Report', icon: FileSpreadsheet, desc: 'Summary of all work orders' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and export system reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportModules.map((report, index) => {
          const Icon = report.icon;
          return (
            <Card key={index} variant="glass" className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{report.desc}</p>
                <div className="flex gap-2">
                  <Button size="small" variant="outlined" className="flex-1 gap-1" onClick={() => handleExport('Excel')}>
                    <FileSpreadsheet size={16} /> Excel
                  </Button>
                  <Button size="small" variant="outlined" className="flex-1 gap-1" onClick={() => handleExport('PDF')}>
                    <FileText size={16} /> PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};