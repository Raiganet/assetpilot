import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const [w, r, p] = await Promise.all([
        supabase.from('withdrawals').select('*', { count: 'exact', head: true }).gte('withdrawal_date', start.toISOString()).lte('withdrawal_date', end.toISOString()),
        supabase.from('receives').select('*', { count: 'exact', head: true }).gte('receive_date', start.toISOString()).lte('receive_date', end.toISOString()),
        supabase.from('repairs').select('*', { count: 'exact', head: true }).gte('repair_date', start.toISOString()).lte('repair_date', end.toISOString()),
      ]);

      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        withdrawals: w.count || 0, receives: r.count || 0, repairs: p.count || 0,
      });
    }
    return NextResponse.json(months);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
