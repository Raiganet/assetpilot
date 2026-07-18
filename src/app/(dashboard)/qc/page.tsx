import { Metadata } from 'next';
import { QCClient } from './qc-client';

export const metadata: Metadata = {
  title: 'Quality Check - AssetPilot',
};

export default function QCPage() {
  return <QCClient />;
}