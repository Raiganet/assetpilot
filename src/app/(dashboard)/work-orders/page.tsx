import { Metadata } from 'next';
import { WorkOrdersClient } from './work-orders-client';

export const metadata: Metadata = {
  title: 'Work Orders - AssetPilot',
};

export default function WorkOrdersPage() {
  return <WorkOrdersClient />;
}