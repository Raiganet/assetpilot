#  AssetPilot - EDC Asset Management System

Enterprise Asset Lifecycle Management System untuk mengelola aset EDC dari instalasi hingga pengembalian ke gudang.

##  Tech Stack

- **Frontend**: Next.js 14, TypeScript, Material UI, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` ke `.env.local` dan isi dengan credentials Supabase Anda:

```bash
cp .env.example .env.local
```

Isi variabel berikut:
- `NEXT_PUBLIC_SUPABASE_URL` - URL project Supabase Anda
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key dari Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key dari Supabase

### 3. Setup Database

1. Buka [Supabase Dashboard](https://supabase.com)
2. Buat project baru atau gunakan yang sudah ada
3. Buka **SQL Editor**
4. Jalankan file migration secara berurutan dari folder `supabase/migrations/`
5. (Opsional) Jalankan `supabase/seed.sql` untuk sample data

### 4. Create Storage Buckets

Di Supabase Dashboard → Storage, buat 3 bucket:
- `assets` (public)
- `photos` (public)
- `signatures` (public)

### 5. Create First Admin User

1. Buka Supabase Dashboard → Authentication
2. Klik **Add User** → **Create New User**
3. Isi email dan password
4. Buka **Table Editor** → `profiles`
5. Update role user tersebut menjadi `administrator`

### 6. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 👥 User Roles

- **Administrator**: Full access to all features
- **Supervisor**: Manage operations, view reports
- **Warehouse**: Manage assets, receives, QC
- **Technician**: Create withdrawals, repairs
- **Management**: View reports and dashboards

## 🔐 Security Features

- Role-Based Access Control (RBAC)
- Row Level Security (RLS) di database
- JWT Authentication
- Audit Trail
- Input Validation

## 📦 Available Scripts

```bash
npm run dev          # Run development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🚢 Deployment to Vercel

1. Push code ke GitHub
2. Connect repository ke Vercel
3. Add environment variables di Vercel dashboard
4. Deploy!

---

**Built with ❤️ by AssetPilot Team**
