export interface DashboardStats {
  outstandingWO: number;
  assetOnTechnician: number;
  lateReturn: number;
  receivedToday: number;
  inRepair: number;
  readyStock: number;
  scrap: number;
  warehouseStock: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface MonthlyChartData {
  month: string;
  withdrawals: number;
  receives: number;
  repairs: number;
}

export interface DailyChartData {
  date: string;
  count: number;
}

export interface TopTechnician {
  id: string;
  name: string;
  avatar_url?: string;
  completedWO: number;
  avgResponseTime: number;
  rating: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_name: string;
  user_avatar?: string;
  timestamp: string;
  description: string;
}