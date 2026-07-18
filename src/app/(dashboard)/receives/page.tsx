import { Metadata } from 'next';
import { ReceivesClient } from './receives-client';

export const metadata: Metadata = {
  title: 'Receives - AssetPilot',
};

export default function ReceivesPage() {
  return <ReceivesClient />;
}