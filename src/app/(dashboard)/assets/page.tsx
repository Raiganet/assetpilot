import { Metadata } from 'next';
import AssetsClient from './assets-client';

export const metadata: Metadata = {
  title: 'Assets - AssetPilot',
};

export default function AssetsPage() {
  return <AssetsClient />;
}