// fix.js - Perbaikan untuk file yang mengandung backticks
const fs = require('fs');
const path = require('path');

function writeFileSafe(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed: ${filePath}`);
}

console.log('🔧 Fixing problematic files...\n');

// ============================================
// FIX 1: README.MD (menggunakan array join)
// ============================================
const readmeLines = [
  '# 🚀 AssetPilot - EDC Asset Management System',
  '',
  'Enterprise Asset Lifecycle Management System untuk mengelola aset EDC dari instalasi hingga pengembalian ke gudang.',
  '',
  '## 📋 Tech Stack',
  '',
  '- **Frontend**: Next.js 16, TypeScript, Material UI, Tailwind CSS',
  '- **Backend**: Next.js API Routes',
  '- **Database**: Supabase PostgreSQL',
  '- **Auth**: Supabase Auth',
  '- **Storage**: Supabase Storage',
  '- **Deployment**: Vercel',
  '',
  '## 🚀 Quick Start',
  '',
  '### 1. Install Dependencies',
  '',
  '```bash',
  'npm install',
  '```',
  '',
  '### 2. Setup Environment Variables',
  '',
  'Copy `.env.example` ke `.env.local` dan isi dengan credentials Supabase Anda:',
  '',
  '```bash',
  'cp .env.example .env.local',
  '```',
  '',
  'Isi variabel berikut:',
  '- `NEXT_PUBLIC_SUPABASE_URL` - URL project Supabase Anda',
  '- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key dari Supabase',
  '- `SUPABASE_SERVICE_ROLE_KEY` - Service role key dari Supabase',
  '',
  '### 3. Setup Database',
  '',
  '1. Buka [Supabase Dashboard](https://supabase.com)',
  '2. Buat project baru atau gunakan yang sudah ada',
  '3. Buka **SQL Editor**',
  '4. Jalankan file migration secara berurutan dari `001` sampai `014` di folder `supabase/migrations/`',
  '5. (Opsional) Jalankan `supabase/seed.sql` untuk sample data',
  '',
  '### 4. Create Storage Buckets',
  '',
  'Di Supabase Dashboard → Storage, buat 3 bucket:',
  '- `assets` (public)',
  '- `photos` (public)',
  '- `signatures` (public)',
  '',
  '### 5. Create First Admin User',
  '',
  '1. Buka Supabase Dashboard → Authentication',
  '2. Klik **Add User** → **Create New User**',
  '3. Isi email dan password',
  '4. Buka **Table Editor** → `profiles`',
  '5. Update role user tersebut menjadi `administrator`',
  '',
  '### 6. Run Development Server',
  '',
  '```bash',
  'npm run dev',
  '```',
  '',
  'Buka [http://localhost:3000](http://localhost:3000)',
  '',
  '## 📁 Project Structure',
  '',
  '```',
  'assetpilot/',
  '├── src/',
  '│   ├── app/                    # Next.js App Router',
  '│   │   ├── (auth)/            # Auth pages',
  '│   │   ├── (dashboard)/       # Dashboard pages',
  '│   │   └── api/               # API routes',
  '│   ├── components/            # React components',
  '│   └── lib/                   # Utilities & services',
  '├── supabase/',
  '│   ├── migrations/           # SQL migrations',
  '│   └── seed.sql             # Seed data',
  '└── public/                  # Static assets',
  '```',
  '',
  '## 👥 User Roles',
  '',
  '- **Administrator**: Full access to all features',
  '- **Supervisor**: Manage operations, view reports',
  '- **Warehouse**: Manage assets, receives, QC',
  '- **Technician**: Create withdrawals, repairs',
  '- **Management**: View reports and dashboards',
  '',
  '## 🔐 Security Features',
  '',
  '- Role-Based Access Control (RBAC)',
  '- Row Level Security (RLS) di database',
  '- JWT Authentication',
  '- Audit Trail',
  '- Input Validation',
  '',
  '## 📦 Available Scripts',
  '',
  '```bash',
  'npm run dev          # Run development server',
  'npm run build        # Build for production',
  'npm run start        # Start production server',
  'npm run lint         # Run ESLint',
  'npm run format       # Format code with Prettier',
  '```',
  '',
  '## 🚢 Deployment to Vercel',
  '',
  '1. Push code ke GitHub',
  '2. Connect repository ke Vercel',
  '3. Add environment variables di Vercel dashboard',
  '4. Deploy!',
  '',
  '## 📝 Environment Variables',
  '',
  '```env',
  'NEXT_PUBLIC_SUPABASE_URL=your_supabase_url',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key',
  'SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key',
  'NEXT_PUBLIC_APP_URL=http://localhost:3000',
  '```',
  '',
  '---',
  '',
  '**Built with ❤️ by AssetPilot Team**',
];

writeFileSafe('README.md', readmeLines.join('\n'));

// ============================================
// FIX 2: INSTALL.SH (menggunakan array join)
// ============================================
const installShLines = [
  '#!/bin/bash',
  'echo "🚀 Installing AssetPilot dependencies..."',
  'echo ""',
  'npm install',
  'echo ""',
  'echo "✅ Installation complete!"',
  'echo ""',
  'echo "📝 Next steps:"',
  'echo "1. Copy .env.example to .env.local and fill with your Supabase credentials"',
  'echo "2. Run SQL migrations in Supabase SQL Editor"',
  'echo "3. Run npm run dev to start development server"',
  'echo ""',
];

writeFileSafe('install.sh', installShLines.join('\n'));

// ============================================
// FIX 3: QUICK-SETUP.SH
// ============================================
const quickSetupShLines = [
  '#!/bin/bash',
  'echo "🚀 Quick Setup AssetPilot..."',
  'echo ""',
  'echo "[1/4] Creating project files..."',
  'node setup.js',
  'echo ""',
  'echo "[2/4] Installing dependencies..."',
  'npm install',
  'echo ""',
  'echo "[3/4] Setup complete!"',
  'echo ""',
  'echo "[4/4] Next steps:"',
  'echo "  - Setup Supabase (see README.md)"',
  'echo "  - Run SQL migrations"',
  'echo "  - npm run dev"',
  'echo ""',
];

writeFileSafe('quick-setup.sh', quickSetupShLines.join('\n'));

// ============================================
// FIX 4: UPDATE SETUP.JS (comment out problematic section)
// ============================================
// Kita akan membuat file baru yang overwrite README.md setelah setup.js selesai
// Jadi user bisa jalankan: node setup.js && node fix.js

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   ✅  FIX COMPLETE!                                       ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('\n');
console.log('📝 CARA JALANKAN:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('Karena setup.js masih ada error di bagian README.md,');
console.log('Anda punya 2 opsi:');
console.log('');
console.log('🔵 OPSI 1: Setup Manual (RECOMMENDED)');
console.log('   Hapus bagian README.md di setup.js (baris 2288 sampai akhir),');
console.log('   lalu jalankan:');
console.log('     node setup.js');
console.log('     node fix.js');
console.log('');
console.log('🔵 OPSI 2: Gunakan setup-v2.js (sudah diperbaiki)');
console.log('   Download setup-v2.js dari pesan berikutnya');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');