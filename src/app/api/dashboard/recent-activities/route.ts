import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*, profiles:user_id (full_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) return NextResponse.json([]);

    const activities = (data || []).map((log: any) => ({
      id: log.id, action: log.action, entity_type: log.entity_type, entity_id: log.entity_id,
      user_name: log.profiles?.full_name || 'System', user_avatar: log.profiles?.avatar_url,
      timestamp: log.created_at, description: `${log.action} ${log.entity_type}`,
    }));
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
