import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Mock data for now
    const mockData = [
      { id: '1', name: 'John Doe', completedWO: 45, avgResponseTime: 32, rating: 4.8 },
      { id: '2', name: 'Jane Smith', completedWO: 38, avgResponseTime: 45, rating: 4.6 },
      { id: '3', name: 'Mike Johnson', completedWO: 32, avgResponseTime: 38, rating: 4.5 },
      { id: '4', name: 'Sarah Wilson', completedWO: 28, avgResponseTime: 42, rating: 4.4 },
      { id: '5', name: 'David Brown', completedWO: 25, avgResponseTime: 50, rating: 4.3 },
    ];
    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
