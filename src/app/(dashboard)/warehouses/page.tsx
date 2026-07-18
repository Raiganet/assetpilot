import { Metadata } from 'next';
import WarehousesClient from './warehouses-client';

export const metadata: Metadata = {
  title: 'Warehouses - AssetPilot',
};

export default function WarehousesPage() {
  return <WarehousesClient />;
}