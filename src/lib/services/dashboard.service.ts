import { DashboardRepository } from '@/lib/repositories/dashboard.repository';
import type {
  DashboardStats,
  MonthlyChartData,
  TopTechnician,
  RecentActivity,
} from '@/lib/types/dashboard.types';
import type { ApiResponse } from '@/lib/types/common.types';

export class DashboardService {
  static async getStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const data = await DashboardRepository.getStats();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
      };
    }
  }

  static async getMonthlyData(): Promise<ApiResponse<MonthlyChartData[]>> {
    try {
      const data = await DashboardRepository.getMonthlyData();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      };
    }
  }

  static async getTopTechnicians(
    limit: number = 5
  ): Promise<ApiResponse<TopTechnician[]>> {
    try {
      const data = await DashboardRepository.getTopTechnicians(limit);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      };
    }
  }

  static async getRecentActivities(
    limit: number = 10
  ): Promise<ApiResponse<RecentActivity[]>> {
    try {
      const data = await DashboardRepository.getRecentActivities(limit);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      };
    }
  }
}