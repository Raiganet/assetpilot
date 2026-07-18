import { Metadata } from 'next';
import { StockClient } from './stock-client';

export const metadata: Metadata = {
  title: 'Stock - AssetPilot',
};

export default function StockPage() {
  return <StockClient />;
}