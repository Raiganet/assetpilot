// setup-pages.js - AssetPilot Pages Setup (Fixed Version)
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

console.log('🚀 Starting AssetPilot Pages Setup...\n');

// ============================================
// MERCHANTS API
// ============================================
const merchantsApiGet = `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('merchants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch merchants' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('merchants')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create merchant' }, { status: 400 });
  }
}`;

writeFile('src/app/api/merchants/route.ts', merchantsApiGet);

const merchantsApiId = `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('merchants')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update merchant' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('merchants')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Merchant deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete merchant' }, { status: 400 });
  }
}`;

writeFile('src/app/api/merchants/[id]/route.ts', merchantsApiId);

// ============================================
// TECHNICIANS API
// ============================================
const techniciansApiGet = `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('technicians')
      .select('*, profiles:profiles (full_name, email, phone)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch technicians' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('technicians')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create technician' }, { status: 400 });
  }
}`;

writeFile('src/app/api/technicians/route.ts', techniciansApiGet);

const techniciansApiId = `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('technicians')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update technician' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('technicians')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Technician deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete technician' }, { status: 400 });
  }
}`;

writeFile('src/app/api/technicians/[id]/route.ts', techniciansApiId);

// ============================================
// ASSETS API
// ============================================
const assetsApiGet = `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('assets')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 400 });
  }
}`;

writeFile('src/app/api/assets/route.ts', assetsApiGet);

const assetsApiId = `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('assets')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Asset deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 400 });
  }
}`;

writeFile('src/app/api/assets/[id]/route.ts', assetsApiId);

// ============================================
// WAREHOUSES API
// ============================================
const warehousesApiGet = `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch warehouses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('warehouses')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create warehouse' }, { status: 400 });
  }
}`;

writeFile('src/app/api/warehouses/route.ts', warehousesApiGet);

const warehousesApiId = `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('warehouses')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update warehouse' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('warehouses')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Warehouse deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete warehouse' }, { status: 400 });
  }
}`;

writeFile('src/app/api/warehouses/[id]/route.ts', warehousesApiId);

console.log('\n');
console.log('═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   ✅  API ROUTES CREATED SUCCESSFULLY!                   ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('\n');
console.log('📦 APIs created:');
console.log('  ✅ Merchants API (GET, POST, PUT, DELETE)');
console.log('  ✅ Technicians API (GET, POST, PUT, DELETE)');
console.log('  ✅ Assets API (GET, POST, PUT, DELETE)');
console.log('  ✅ Warehouses API (GET, POST, PUT, DELETE)');
console.log('\n');
console.log('Next: Create the page components manually or use the UI.');
console.log('');