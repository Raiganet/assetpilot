import { Metadata } from 'next';
import { MerchantsClient } from './merchants-client';

export const metadata: Metadata = {
  title: 'Merchants - AssetPilot',
};

export default function MerchantsPage() {
  return <MerchantsClient />;
}
