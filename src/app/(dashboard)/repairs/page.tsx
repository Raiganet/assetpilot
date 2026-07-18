import { Metadata } from 'next';
import { RepairsClient } from './repairs-client';

export const metadata: Metadata = {
  title: 'Repairs - AssetPilot',
};

export default function RepairsPage() {
  return <RepairsClient />;
}