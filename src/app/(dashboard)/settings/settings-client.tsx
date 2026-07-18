'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/form-field';
import { FormSelect } from '@/components/forms/form-select';
import { useToast } from '@/lib/hooks/use-toast';
import { Save, Shield, Bell, Database } from 'lucide-react';

export const SettingsClient = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage application preferences</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <Card variant="glass">
        <CardContent>
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">General Settings</h3>
              <FormField label="Application Name" defaultValue="AssetPilot" />
              <FormField label="Default Language" defaultValue="English" />
              <FormField label="Timezone" defaultValue="Asia/Jakarta (WIB)" />
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="gap-2"><Save size={18} /> Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <FormField label="Session Timeout (minutes)" type="number" defaultValue="60" />
              <FormSelect 
                label="Password Policy" 
                options={[
                  { value: 'strong', label: 'Strong (Min 8 chars, uppercase, number)' },
                  { value: 'medium', label: 'Medium (Min 6 chars)' },
                  { value: 'weak', label: 'Weak (Any)' }
                ]} 
                defaultValue="strong" 
              />
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <label className="text-sm font-medium">Enable Two-Factor Authentication (2FA)</label>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="gap-2"><Save size={18} /> Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="font-medium">Late Return Alerts</p>
                    <p className="text-sm text-gray-500">Notify when assets are not returned on time</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="font-medium">Repair Completed</p>
                    <p className="text-sm text-gray-500">Notify when a repair job is finished</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="font-medium">New Work Order</p>
                    <p className="text-sm text-gray-500">Notify technicians of new assignments</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="gap-2"><Save size={18} /> Save Changes</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};