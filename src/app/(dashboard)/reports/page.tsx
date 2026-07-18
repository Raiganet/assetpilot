import { Metadata } from 'next';
import { ReportsClient } from './reports-client';

export const metadata: Metadata = {
  title: 'Reports - AssetPilot',
};

export default function ReportsPage() {
  return <ReportsClient />;
}