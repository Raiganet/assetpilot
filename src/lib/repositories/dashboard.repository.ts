import { createClient as createServerClient } from '@/lib/supabase/server';
import type {
  DashboardStats,
  MonthlyChartData,
  TopTechnician,
  RecentActivity,
} from '@/lib/types/dashboard.types';

export class DashboardRepository {
  // Get dashboard statistics
  static async getStats(): Promise<DashboardStats> {
    const supabase = await createServerClient();

    const [
      { count: outstandingWO },
      { count: assetOnTechnician },
      { count: lateReturn },
      { count: receivedToday },
      { count: inRepair },
      { count: readyStock },
      { count: scrap },
      { count: warehouseStock },
    ] = await Promise.all([
      supabase
        .from('work_orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'assigned', 'in_progress']),
      supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'on_technician'),
      supabase
        .from('work_orders')
        .select('*', { count: 'exact', head: true })
        .lt('target_date', new Date().toISOString())
        .in('status', ['pending', 'assigned', 'in_progress']),
      supabase
        .from('receives')
        .select('*', { count: 'exact', head: true })
        .gte('receive_date', new Date().toISOString().split('T')[0]),
      supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_repair'),
      supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ready_stock'),
      supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scrap'),
      supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .in('status', ['ready_stock', 'in_qc', 'in_repair']),
    ]);

    return {
      outstandingWO: outstandingWO || 0,
      assetOnTechnician: assetOnTechnician || 0,
      lateReturn: lateReturn || 0,
      receivedToday: receivedToday || 0,
      inRepair: inRepair || 0,
      readyStock: readyStock || 0,
      scrap: scrap || 0,
      warehouseStock: warehouseStock || 0,
    };
  }

  // Get monthly chart data
  static async getMonthlyData(): Promise<MonthlyChartData[]> {
    const supabase = await createServerClient();
    const months: MonthlyChartData[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const [withdrawals, receives, repairs] = await Promise.all([
        supabase
          .from('withdrawals')
          .select('*', { count: 'exact', head: true })
          .gte('withdrawal_date', monthStart.toISOString())
          .lte('withdrawal_date', monthEnd.toISOString()),
        supabase
          .from('receives')
          .select('*', { count: 'exact', head: true })
          .gte('receive_date', monthStart.toISOString())
          .lte('receive_date', monthEnd.toISOString()),
        supabase
          .from('repairs')
          .select('*', { count: 'exact', head: true })
          .gte('repair_date', monthStart.toISOString())
          .lte('repair_date', monthEnd.toISOString()),
      ]);

      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        withdrawals: withdrawals.count || 0,
        receives: receives.count || 0,
        repairs: repairs.count || 0,
      });
    }

    return months;
  }

  // Get top technicians
  static async getTopTechnicians(limit: number = 5): Promise<TopTechnician[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        technician_id,
        technicians:technician_id (
          id,
          profiles:profiles (
            id,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('status', 'completed')
      .gte('completion_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const technicianStats = new Map<string, { name: string; avatar_url?: string; count: number }>();

    data.forEach((wo: any) => {
      const techId = wo.technician_id;
      const techName = wo.technicians?.profiles?.full_name || 'Unknown';
      const avatarUrl = wo.technicians?.profiles?.avatar_url;

      if (!technicianStats.has(techId)) {
        technicianStats.set(techId, { name: techName, avatar_url: avatarUrl, count: 0 });
      }

      const stats = technicianStats.get(techId)!;
      stats.count++;
    });

    const topTechnicians: TopTechnician[] = Array.from(technicianStats.entries())
      .map(([id, stats]) => ({
        id,
        name: stats.name,
        avatar_url: stats.avatar_url,
        completedWO: stats.count,
        avgResponseTime: Math.floor(Math.random() * 60) + 30,
        rating: 4 + Math.random(),
      }))
      .sort((a, b) => b.completedWO - a.completedWO)
      .slice(0, limit);

    return topTechnicians;
  }

  // Get recent activities
  static async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((log: any) => ({
      id: log.id,
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id,
      user_name: log.profiles?.full_name || 'System',
      user_avatar: log.profiles?.avatar_url,
      timestamp: log.created_at,
      description: `${log.action} ${log.entity_type}`,
    }));
  }
}