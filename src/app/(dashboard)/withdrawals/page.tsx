import { Metadata } from 'next';
import { WithdrawalsClient } from './withdrawals-client';

export const metadata: Metadata = {
  title: 'Withdrawals - AssetPilot',
};

export default function WithdrawalsPage() {
  return <WithdrawalsClient />;
}