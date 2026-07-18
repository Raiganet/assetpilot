import { Metadata } from 'next';
import TechniciansClient from './technicians-client';

export const metadata: Metadata = {
  title: 'Technicians - AssetPilot',
};

export default function TechniciansPage() {
  return <TechniciansClient />;
}