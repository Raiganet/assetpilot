import { Metadata } from 'next';
import { LogsClient } from './logs-client';

export const metadata: Metadata = {
  title: 'Activity Logs - AssetPilot',
};

export default function LogsPage() {
  return <LogsClient />;
}