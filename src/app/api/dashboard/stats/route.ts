import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [o, a, l, r, i, rs, s, w] = await Promise.all([
      supabase.from('work_orders').select('*', { count: 'exact', head: true }).in('status', ['pending', 'assigned', 'in_progress']),
      supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'on_technician'),
      supabase.from('work_orders').select('*', { count: 'exact', head: true }).lt('target_date', new Date().toISOString()).in('status', ['pending', 'assigned', 'in_progress']),
      supabase.from('receives').select('*', { count: 'exact', head: true }).gte('receive_date', new Date().toISOString().split('T')[0]),
      supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'in_repair'),
      supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'ready_stock'),
      supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'scrap'),
      supabase.from('assets').select('*', { count: 'exact', head: true }).in('status', ['ready_stock', 'in_qc', 'in_repair']),
    ]);

    return NextResponse.json({
      outstandingWO: o.count || 0, assetOnTechnician: a.count || 0, lateReturn: l.count || 0,
      receivedToday: r.count || 0, inRepair: i.count || 0, readyStock: rs.count || 0,
      scrap: s.count || 0, warehouseStock: w.count || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
