import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('work_orders')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update work order' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Work order deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete work order' }, { status: 400 });
  }
}