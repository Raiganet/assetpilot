// setup-phase4.js - AssetPilot Phase 4 Setup Script
const fs = require('fs');
const path = require('path');

function mkdirp(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('📁 Created: ' + dirPath);
  }
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  mkdirp(dir);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Created: ' + filePath);
}

console.log('🚀 Starting AssetPilot Phase 4 Setup...\n');

// ============================================
// WORK ORDERS API
// ============================================
writeFile('src/app/api/work-orders/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('work_orders')
      .select('*, merchants:merchant_id (merchant_name), technicians:technician_id (employee_id)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch work orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('work_orders')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create work order' }, { status: 400 });
  }
}`);

writeFile('src/app/api/work-orders/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
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
}`);

// ============================================
// WITHDRAWALS API
// ============================================
writeFile('src/app/api/withdrawals/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*, work_orders:work_order_id (wo_number), merchants:merchant_id (merchant_name), assets:asset_id (asset_id, serial_number)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('withdrawals')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create withdrawal' }, { status: 400 });
  }
}`);

writeFile('src/app/api/withdrawals/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('withdrawals')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('withdrawals')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Withdrawal deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete withdrawal' }, { status: 400 });
  }
}`);

// ============================================
// RECEIVES API
// ============================================
writeFile('src/app/api/receives/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('receives')
      .select('*, withdrawals:withdrawal_id (withdrawal_number), warehouses:warehouse_id (warehouse_name), assets:asset_id (asset_id, serial_number)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch receives' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('receives')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create receive' }, { status: 400 });
  }
}`);

writeFile('src/app/api/receives/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('receives')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update receive' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('receives')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Receive deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete receive' }, { status: 400 });
  }
}`);

// ============================================
// QUALITY CHECK API
// ============================================
writeFile('src/app/api/qc/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('quality_checks')
      .select('*, receives:receive_id (receive_number), assets:asset_id (asset_id, serial_number)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quality checks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('quality_checks')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quality check' }, { status: 400 });
  }
}`);

writeFile('src/app/api/qc/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('quality_checks')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quality check' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('quality_checks')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Quality check deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete quality check' }, { status: 400 });
  }
}`);

// ============================================
// REPAIRS API
// ============================================
writeFile('src/app/api/repairs/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('repairs')
      .select('*, quality_checks:qc_id (qc_number), assets:asset_id (asset_id, serial_number), technicians:technician_id (employee_id)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch repairs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('repairs')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create repair' }, { status: 400 });
  }
}`);

writeFile('src/app/api/repairs/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('repairs')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update repair' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('repairs')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Repair deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete repair' }, { status: 400 });
  }
}`);

// ============================================
// STOCK API
// ============================================
writeFile('src/app/api/stock/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouse_id');
    
    let query = supabase
      .from('assets')
      .select('*, warehouses:warehouse_id (warehouse_name, warehouse_code)')
      .eq('status', 'ready_stock')
      .order('created_at', { ascending: false });

    if (warehouseId) {
      query = query.eq('warehouse_id', warehouseId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
}`);

console.log('\n');
console.log('═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   ✅  PHASE 4 API ROUTES COMPLETE!                       ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('\n');
console.log('📦 APIs created:');
console.log('  ✅ Work Orders API (GET, POST, PUT, DELETE)');
console.log('  ✅ Withdrawals API (GET, POST, PUT, DELETE)');
console.log('  ✅ Receives API (GET, POST, PUT, DELETE)');
console.log('  ✅ Quality Check API (GET, POST, PUT, DELETE)');
console.log('  ✅ Repairs API (GET, POST, PUT, DELETE)');
console.log('  ✅ Stock API (GET with filters)');
console.log('\n');
console.log('Next Steps:');
console.log('  1. Commit and push to GitHub');
console.log('  2. Wait for Vercel deployment');
console.log('  3. Create page components for each module');
console.log('');