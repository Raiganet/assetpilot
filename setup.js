// setup.js - AssetPilot Complete Setup Script
const fs = require('fs');
const path = require('path');

function mkdirp(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created: ${dirPath}`);
  }
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  mkdirp(dir);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`✅ Created: ${filePath}`);
}

console.log('🚀 Starting AssetPilot Complete Setup...\n');

// ============================================
// PACKAGE.JSON
// ============================================
writeFile('package.json', `{
  "name": "assetpilot",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "@hookform/resolvers": "^3.9.0",
    "@mui/icons-material": "^6.0.0",
    "@mui/material": "^6.0.0",
    "@supabase/ssr": "^0.5.0",
    "@supabase/supabase-js": "^2.45.0",
    "@zxing/browser": "^0.1.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.6.0",
    "framer-motion": "^11.0.0",
    "jspdf": "^2.5.0",
    "jspdf-autotable": "^3.8.0",
    "lucide-react": "^0.400.0",
    "next": "14.2.35",
    "next-themes": "^0.3.0",
    "qrcode": "^1.5.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-hook-form": "^7.53.0",
    "recharts": "^2.12.0",
    "sonner": "^1.5.0",
    "swr": "^2.2.0",
    "tailwind-merge": "^2.5.0",
    "xlsx": "^0.18.0",
    "zod": "^3.23.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.35",
    "postcss": "^8.4.0",
    "prettier": "^3.3.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0"
  }
}`);

// ============================================
// NEXT.CONFIG.MJS
// ============================================
writeFile('next.config.mjs', `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;`);

// ============================================
// TAILWIND.CONFIG.TS
// ============================================
writeFile('tailwind.config.ts', `import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;`);

// ============================================
// TSCONFIG.JSON
// ============================================
writeFile('tsconfig.json', `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`);

// ============================================
// POSTCSS.CONFIG.MJS
// ============================================
writeFile('postcss.config.mjs', `const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;`);

// ============================================
// .ENV.EXAMPLE
// ============================================
writeFile('.env.example', `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AssetPilot`);

// ============================================
// .ENV.LOCAL
// ============================================
writeFile('.env.local', `NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AssetPilot`);

// ============================================
// .GITIGNORE
// ============================================
writeFile('.gitignore', `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts`);

// ============================================
// GLOBALS.CSS
// ============================================
const globalsCssLines = [
  '@tailwind base;',
  '@tailwind components;',
  '@tailwind utilities;',
  '',
  '@layer base {',
  '  :root {',
  '    --background: 0 0% 100%;',
  '    --foreground: 222.2 84% 4.9%;',
  '  }',
  '',
  '  .dark {',
  '    --background: 222.2 84% 4.9%;',
  '    --foreground: 210 40% 98%;',
  '  }',
  '',
  '  body {',
  '    @apply bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white;',
  '  }',
  '}',
  '',
  '@layer utilities {',
  '  .glass-effect {',
  '    @apply bg-white/70 backdrop-blur-md border border-white/20;',
  '  }',
  '',
  '  .dark .glass-effect {',
  '    @apply bg-gray-900/70 backdrop-blur-md border border-gray-700/20;',
  '  }',
  '',
  '  .animate-fade-in {',
  '    animation: fadeIn 0.5s ease-in-out;',
  '  }',
  '',
  '  .animate-slide-up {',
  '    animation: slideUp 0.5s ease-out;',
  '  }',
  '}',
  '',
  '@keyframes fadeIn {',
  '  from { opacity: 0; }',
  '  to { opacity: 1; }',
  '}',
  '',
  '@keyframes slideUp {',
  '  from { transform: translateY(20px); opacity: 0; }',
  '  to { transform: translateY(0); opacity: 1; }',
  '}',
  '',
  '::-webkit-scrollbar { width: 8px; height: 8px; }',
  '::-webkit-scrollbar-track { @apply bg-gray-100 dark:bg-gray-800; }',
  '::-webkit-scrollbar-thumb { @apply bg-gray-300 dark:bg-gray-600 rounded-full; }',
  '::-webkit-scrollbar-thumb:hover { @apply bg-gray-400 dark:bg-gray-500; }',
];

writeFile('src/app/globals.css', globalsCssLines.join('\n'));

// ============================================
// LAYOUT.TSX
// ============================================
const layoutLines = [
  'import type { Metadata, Viewport } from \'next\';',
  'import { Inter } from \'next/font/google\';',
  'import { Toaster } from \'sonner\';',
  'import { AuthProvider } from \'@/components/providers/auth-provider\';',
  'import \'./globals.css\';',
  '',
  'const inter = Inter({ subsets: [\'latin\'] });',
  '',
  'export const metadata: Metadata = {',
  '  title: \'AssetPilot - EDC Asset Management System\',',
  '  description: \'Enterprise Asset Lifecycle Management System\',',
  '};',
  '',
  'export const viewport: Viewport = {',
  '  themeColor: \'#2563eb\',',
  '  width: \'device-width\',',
  '  initialScale: 1,',
  '};',
  '',
  'export default function RootLayout({',
  '  children,',
  '}: {',
  '  children: React.ReactNode;',
  '}) {',
  '  return (',
  '    <html lang="en" suppressHydrationWarning>',
  '      <body className={inter.className}>',
  '        <AuthProvider>',
  '          {children}',
  '          <Toaster position="top-right" richColors closeButton />',
  '        </AuthProvider>',
  '      </body>',
  '    </html>',
  '  );',
  '}',
];

writeFile('src/app/layout.tsx', layoutLines.join('\n'));

// ============================================
// MIDDLEWARE.TS
// ============================================
const middlewareLines = [
  'import { createServerClient } from \'@supabase/ssr\';',
  'import { NextResponse, type NextRequest } from \'next/server\';',
  '',
  'export async function middleware(request: NextRequest) {',
  '  let supabaseResponse = NextResponse.next({',
  '    request,',
  '  });',
  '',
  '  try {',
  '    const supabase = createServerClient(',
  '      process.env.NEXT_PUBLIC_SUPABASE_URL!,',
  '      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,',
  '      {',
  '        cookies: {',
  '          getAll() {',
  '            return request.cookies.getAll();',
  '          },',
  '          setAll(cookiesToSet) {',
  '            cookiesToSet.forEach(({ name, value }) =>',
  '              request.cookies.set(name, value)',
  '            );',
  '            supabaseResponse = NextResponse.next({',
  '              request,',
  '            });',
  '            cookiesToSet.forEach(({ name, value, options }) =>',
  '              supabaseResponse.cookies.set(name, value, options)',
  '            );',
  '          },',
  '        },',
  '      }',
  '    );',
  '',
  '    const {',
  '      data: { user },',
  '      error,',
  '    } = await supabase.auth.getUser();',
  '',
  '    if (error) {',
  '      return supabaseResponse;',
  '    }',
  '',
  '    if (!user && !request.nextUrl.pathname.startsWith(\'/login\')) {',
  '      const url = request.nextUrl.clone();',
  '      url.pathname = \'/login\';',
  '      return NextResponse.redirect(url);',
  '    }',
  '',
  '    if (user && request.nextUrl.pathname.startsWith(\'/login\')) {',
  '      const url = request.nextUrl.clone();',
  '      url.pathname = \'/\';',
  '      return NextResponse.redirect(url);',
  '    }',
  '  } catch (e) {',
  '    console.error(\'Middleware error:\', e);',
  '  }',
  '',
  '  return supabaseResponse;',
  '}',
  '',
  'export const config = {',
  '  matcher: [',
  '    \'/((?!_next/static|_next/image|favicon.ico|.*\\\\\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)\',',
  '  ],',
  '};',
];

writeFile('src/middleware.ts', middlewareLines.join('\n'));

// ============================================
// Continue with more files...
// ============================================

// Supabase Clients
writeFile('src/lib/supabase/client.ts', `import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};`);

writeFile('src/lib/supabase/server.ts', `import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
};`);

writeFile('src/lib/supabase/admin.ts', `import { createClient } from '@supabase/supabase-js';

export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
};`);

// Utils
writeFile('src/lib/utils/cn.ts', `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`);

const constantsLines = [
  'export const APP_NAME = \'AssetPilot\';',
  'export const APP_TAGLINE = \'Enterprise Asset Lifecycle Management System\';',
  '',
  'export const USER_ROLES = {',
  '  ADMINISTRATOR: \'administrator\',',
  '  WAREHOUSE: \'warehouse\',',
  '  TECHNICIAN: \'technician\',',
  '  SUPERVISOR: \'supervisor\',',
  '  MANAGEMENT: \'management\',',
  '} as const;',
  '',
  'export const ASSET_TYPES = {',
  '  EDC: \'edc\', SIM_CARD: \'sim_card\', SAM_CARD: \'sam_card\',',
  '  BATTERY: \'battery\', ADAPTER: \'adapter\', PRINTER: \'printer\',',
  '  SCANNER: \'scanner\', OTHER_DEVICE: \'other_device\',',
  '} as const;',
  '',
  'export const ASSET_STATUS = {',
  '  READY_STOCK: \'ready_stock\', DEPLOYED: \'deployed\', ON_TECHNICIAN: \'on_technician\',',
  '  IN_TRANSIT: \'in_transit\', IN_QC: \'in_qc\', IN_REPAIR: \'in_repair\',',
  '  SCRAP: \'scrap\', LOST: \'lost\', RETURNED: \'returned\',',
  '} as const;',
  '',
  'export const ASSET_CONDITION = {',
  '  GOOD: \'good\', MINOR_DAMAGE: \'minor_damage\', MAJOR_DAMAGE: \'major_damage\',',
  '  BROKEN: \'broken\', REPAIR_REQUIRED: \'repair_required\', SCRAP: \'scrap\',',
  '} as const;',
  '',
  'export const WORK_ORDER_STATUS = {',
  '  PENDING: \'pending\', ASSIGNED: \'assigned\', IN_PROGRESS: \'in_progress\',',
  '  COMPLETED: \'completed\', CANCELLED: \'cancelled\', ON_HOLD: \'on_hold\',',
  '} as const;',
];

writeFile('src/lib/utils/constants.ts', constantsLines.join('\n'));

const formatLines = [
  'import { format, formatDistanceToNow } from \'date-fns\';',
  'import { id } from \'date-fns/locale\';',
  '',
  'export const formatDate = (date: Date | string, formatStr: string = \'dd MMM yyyy\') => {',
  '  return format(new Date(date), formatStr, { locale: id });',
  '};',
  '',
  'export const formatDateTime = (date: Date | string) => {',
  '  return format(new Date(date), \'dd MMM yyyy HH:mm\', { locale: id });',
  '};',
  '',
  'export const formatRelativeTime = (date: Date | string) => {',
  '  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });',
  '};',
  '',
  'export const formatCurrency = (amount: number) => {',
  '  return new Intl.NumberFormat(\'id-ID\', {',
  '    style: \'currency\', currency: \'IDR\', minimumFractionDigits: 0,',
  '  }).format(amount);',
  '};',
  '',
  'export const formatNumber = (num: number) => {',
  '  return new Intl.NumberFormat(\'id-ID\').format(num);',
  '};',
];

writeFile('src/lib/utils/format.ts', formatLines.join('\n'));

// Permissions
const permissionsLines = [
  'import type { UserRole, ModulePermissions } from \'@/lib/types/user.types\';',
  '',
  'const FULL_ACCESS = { canView: true, canCreate: true, canUpdate: true, canDelete: true, canExport: true };',
  'const READ_ONLY = { canView: true, canCreate: false, canUpdate: false, canDelete: false, canExport: true };',
  'const NO_ACCESS = { canView: false, canCreate: false, canUpdate: false, canDelete: false, canExport: false };',
  '',
  'export const ROLE_PERMISSIONS: Record<UserRole, ModulePermissions> = {',
  '  administrator: {',
  '    dashboard: FULL_ACCESS, users: FULL_ACCESS, merchants: FULL_ACCESS,',
  '    technicians: FULL_ACCESS, assets: FULL_ACCESS, warehouses: FULL_ACCESS,',
  '    workOrders: FULL_ACCESS, withdrawals: FULL_ACCESS, receives: FULL_ACCESS,',
  '    qc: FULL_ACCESS, repairs: FULL_ACCESS, stock: FULL_ACCESS,',
  '    reports: FULL_ACCESS, logs: FULL_ACCESS, settings: FULL_ACCESS,',
  '  },',
  '  supervisor: {',
  '    dashboard: FULL_ACCESS, users: READ_ONLY, merchants: FULL_ACCESS,',
  '    technicians: FULL_ACCESS, assets: FULL_ACCESS, warehouses: FULL_ACCESS,',
  '    workOrders: FULL_ACCESS, withdrawals: FULL_ACCESS, receives: FULL_ACCESS,',
  '    qc: FULL_ACCESS, repairs: FULL_ACCESS, stock: FULL_ACCESS,',
  '    reports: FULL_ACCESS, logs: READ_ONLY, settings: READ_ONLY,',
  '  },',
  '  warehouse: {',
  '    dashboard: READ_ONLY, users: NO_ACCESS, merchants: READ_ONLY,',
  '    technicians: READ_ONLY, assets: FULL_ACCESS, warehouses: FULL_ACCESS,',
  '    workOrders: READ_ONLY, withdrawals: READ_ONLY, receives: FULL_ACCESS,',
  '    qc: FULL_ACCESS, repairs: READ_ONLY, stock: FULL_ACCESS,',
  '    reports: READ_ONLY, logs: NO_ACCESS, settings: NO_ACCESS,',
  '  },',
  '  technician: {',
  '    dashboard: READ_ONLY, users: NO_ACCESS, merchants: READ_ONLY,',
  '    technicians: READ_ONLY, assets: READ_ONLY, warehouses: READ_ONLY,',
  '    workOrders: { canView: true, canCreate: false, canUpdate: true, canDelete: false, canExport: false },',
  '    withdrawals: { canView: true, canCreate: true, canUpdate: true, canDelete: false, canExport: false },',
  '    receives: READ_ONLY, qc: READ_ONLY,',
  '    repairs: { canView: true, canCreate: true, canUpdate: true, canDelete: false, canExport: false },',
  '    stock: READ_ONLY, reports: NO_ACCESS, logs: NO_ACCESS, settings: NO_ACCESS,',
  '  },',
  '  management: {',
  '    dashboard: FULL_ACCESS, users: READ_ONLY, merchants: READ_ONLY,',
  '    technicians: READ_ONLY, assets: READ_ONLY, warehouses: READ_ONLY,',
  '    workOrders: READ_ONLY, withdrawals: READ_ONLY, receives: READ_ONLY,',
  '    qc: READ_ONLY, repairs: READ_ONLY, stock: READ_ONLY,',
  '    reports: FULL_ACCESS, logs: READ_ONLY, settings: READ_ONLY,',
  '  },',
  '};',
  '',
  'export const hasPermission = (role: UserRole, module: keyof ModulePermissions, action: keyof typeof FULL_ACCESS): boolean => {',
  '  const permissions = ROLE_PERMISSIONS[role];',
  '  if (!permissions) return false;',
  '  return permissions[module][action];',
  '};',
];

writeFile('src/lib/utils/permissions.ts', permissionsLines.join('\n'));

// Types
const commonTypesLines = [
  'export interface PaginationParams {',
  '  page: number;',
  '  pageSize: number;',
  '  sortBy?: string;',
  '  sortOrder?: \'asc\' | \'desc\';',
  '}',
  '',
  'export interface PaginatedResponse<T> {',
  '  data: T[];',
  '  total: number;',
  '  page: number;',
  '  pageSize: number;',
  '  totalPages: number;',
  '}',
  '',
  'export interface ApiResponse<T> {',
  '  success: boolean;',
  '  data?: T;',
  '  error?: string;',
  '  message?: string;',
  '}',
];

writeFile('src/lib/types/common.types.ts', commonTypesLines.join('\n'));

const userTypesLines = [
  'export type UserRole = \'administrator\' | \'warehouse\' | \'technician\' | \'supervisor\' | \'management\';',
  'export type UserStatus = \'active\' | \'inactive\' | \'suspended\';',
  '',
  'export interface UserProfile {',
  '  id: string;',
  '  email: string;',
  '  full_name: string;',
  '  phone?: string;',
  '  role: UserRole;',
  '  status: UserStatus;',
  '  avatar_url?: string;',
  '  last_login?: string;',
  '  created_at: string;',
  '  updated_at: string;',
  '}',
  '',
  'export interface UserCreate {',
  '  email: string;',
  '  password: string;',
  '  full_name: string;',
  '  phone?: string;',
  '  role: UserRole;',
  '}',
  '',
  'export interface UserUpdate {',
  '  full_name?: string;',
  '  phone?: string;',
  '  role?: UserRole;',
  '  status?: UserStatus;',
  '}',
  '',
  'export interface UserFilters {',
  '  search?: string;',
  '  role?: UserRole;',
  '  status?: UserStatus;',
  '}',
  '',
  'export interface RolePermission {',
  '  canView: boolean;',
  '  canCreate: boolean;',
  '  canUpdate: boolean;',
  '  canDelete: boolean;',
  '  canExport: boolean;',
  '}',
  '',
  'export interface ModulePermissions {',
  '  dashboard: RolePermission;',
  '  users: RolePermission;',
  '  merchants: RolePermission;',
  '  technicians: RolePermission;',
  '  assets: RolePermission;',
  '  warehouses: RolePermission;',
  '  workOrders: RolePermission;',
  '  withdrawals: RolePermission;',
  '  receives: RolePermission;',
  '  qc: RolePermission;',
  '  repairs: RolePermission;',
  '  stock: RolePermission;',
  '  reports: RolePermission;',
  '  logs: RolePermission;',
  '  settings: RolePermission;',
  '}',
];

writeFile('src/lib/types/user.types.ts', userTypesLines.join('\n'));

const dashboardTypesLines = [
  'export interface DashboardStats {',
  '  outstandingWO: number;',
  '  assetOnTechnician: number;',
  '  lateReturn: number;',
  '  receivedToday: number;',
  '  inRepair: number;',
  '  readyStock: number;',
  '  scrap: number;',
  '  warehouseStock: number;',
  '}',
  '',
  'export interface MonthlyChartData {',
  '  month: string;',
  '  withdrawals: number;',
  '  receives: number;',
  '  repairs: number;',
  '}',
  '',
  'export interface TopTechnician {',
  '  id: string;',
  '  name: string;',
  '  avatar_url?: string;',
  '  completedWO: number;',
  '  avgResponseTime: number;',
  '  rating: number;',
  '}',
  '',
  'export interface RecentActivity {',
  '  id: string;',
  '  action: string;',
  '  entity_type: string;',
  '  entity_id: string;',
  '  user_name: string;',
  '  user_avatar?: string;',
  '  timestamp: string;',
  '  description: string;',
  '}',
];

writeFile('src/lib/types/dashboard.types.ts', dashboardTypesLines.join('\n'));

// Hooks
const useAuthLines = [
  '\'use client\';',
  '',
  'import { useEffect, useState } from \'react\';',
  'import { createClient } from \'@/lib/supabase/client\';',
  'import type { User } from \'@supabase/supabase-js\';',
  'import type { UserProfile } from \'@/lib/types/user.types\';',
  '',
  'export const useAuth = () => {',
  '  const [user, setUser] = useState<User | null>(null);',
  '  const [profile, setProfile] = useState<UserProfile | null>(null);',
  '  const [loading, setLoading] = useState(true);',
  '  const supabase = createClient();',
  '',
  '  useEffect(() => {',
  '    const getUser = async () => {',
  '      try {',
  '        const { data: { user: currentUser } } = await supabase.auth.getUser();',
  '        if (currentUser) {',
  '          setUser(currentUser);',
  '          const { data } = await supabase.from(\'profiles\').select(\'*\').eq(\'id\', currentUser.id).single();',
  '          setProfile(data as UserProfile);',
  '        }',
  '      } finally {',
  '        setLoading(false);',
  '      }',
  '    };',
  '    getUser();',
  '    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {',
  '      if (event === \'SIGNED_IN\' && session?.user) {',
  '        setUser(session.user);',
  '        const { data } = await supabase.from(\'profiles\').select(\'*\').eq(\'id\', session.user.id).single();',
  '        setProfile(data as UserProfile);',
  '      } else if (event === \'SIGNED_OUT\') {',
  '        setUser(null);',
  '        setProfile(null);',
  '      }',
  '    });',
  '    return () => subscription.unsubscribe();',
  '  }, []);',
  '',
  '  const signOut = async () => {',
  '    await supabase.auth.signOut();',
  '    setUser(null);',
  '    setProfile(null);',
  '  };',
  '',
  '  return { user, profile, loading, signOut };',
  '};',
];

writeFile('src/lib/hooks/use-auth.ts', useAuthLines.join('\n'));

writeFile('src/lib/hooks/use-debounce.ts', `'use client';
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}`);

writeFile('src/lib/hooks/use-pagination.ts', `'use client';
import { useState, useMemo } from 'react';

export const usePagination = ({ totalItems, initialPage = 1, initialPageSize = 10 }: any) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / pageSize)), [totalItems, pageSize]);
  const canGoNext = page < totalPages;
  const canGoPrevious = page > 1;
  return { page, pageSize, totalPages, setPage, setPageSize, canGoNext, canGoPrevious };
};`);

writeFile('src/lib/hooks/use-toast.ts', `'use client';
import { toast as sonnerToast } from 'sonner';

export const useToast = () => ({
  success: (message: string, options?: any) => sonnerToast.success(message, options),
  error: (message: string, options?: any) => sonnerToast.error(message, options),
  info: (message: string, options?: any) => sonnerToast.info(message, options),
  warning: (message: string, options?: any) => sonnerToast.warning(message, options),
});`);

// ============================================
// PROVIDERS
// ============================================
const authProviderLines = [
  '\'use client\';',
  'import { createContext, useContext, ReactNode } from \'react\';',
  'import { useAuth } from \'@/lib/hooks/use-auth\';',
  'import type { UserProfile } from \'@/lib/types/user.types\';',
  'import type { User } from \'@supabase/supabase-js\';',
  '',
  'const AuthContext = createContext<any>(undefined);',
  '',
  'export const AuthProvider = ({ children }: { children: ReactNode }) => {',
  '  const auth = useAuth();',
  '  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;',
  '};',
  '',
  'export const useAuthContext = () => {',
  '  const context = useContext(AuthContext);',
  '  if (!context) throw new Error(\'useAuthContext must be used within AuthProvider\');',
  '  return context;',
  '};',
];

writeFile('src/components/providers/auth-provider.tsx', authProviderLines.join('\n'));

writeFile('src/components/providers/permission-guard.tsx', `'use client';
import { ReactNode } from 'react';
import { useAuthContext } from './auth-provider';
import { hasPermission } from '@/lib/utils/permissions';
import type { ModulePermissions } from '@/lib/types/user.types';

export const PermissionGuard = ({
  module, action = 'canView', children, fallback = null,
}: { module: keyof ModulePermissions; action?: any; children: ReactNode; fallback?: ReactNode }) => {
  const { profile } = useAuthContext();
  if (!profile) return <>{fallback}</>;
  return hasPermission(profile.role, module, action) ? <>{children}</> : <>{fallback}</>;
};`);

// ============================================
// UI COMPONENTS
// ============================================
const buttonLines = [
  '\'use client\';',
  'import { Button as MuiButton, ButtonProps as MuiButtonProps } from \'@mui/material\';',
  'import { cn } from \'@/lib/utils/cn\';',
  'import { forwardRef } from \'react\';',
  '',
  'interface ButtonProps extends Omit<MuiButtonProps, \'variant\'> {',
  '  variant?: \'contained\' | \'outlined\' | \'text\' | \'glass\';',
  '  size?: \'small\' | \'medium\' | \'large\';',
  '}',
  '',
  'export const Button = forwardRef<HTMLButtonElement, ButtonProps>(',
  '  ({ className, variant = \'contained\', size = \'medium\', children, ...props }, ref) => {',
  '    const variantStyles = {',
  '      contained: \'bg-primary-600 hover:bg-primary-700 text-white shadow-md\',',
  '      outlined: \'border-2 border-primary-600 text-primary-600 hover:bg-primary-50\',',
  '      text: \'text-primary-600 hover:bg-primary-50\',',
  '      glass: \'bg-white/70 backdrop-blur-md border border-white/20 text-gray-900\',',
  '    };',
  '    const sizeStyles = { small: \'px-3 py-1.5 text-sm\', medium: \'px-4 py-2 text-base\', large: \'px-6 py-3 text-lg\' };',
  '    return (',
  '      <MuiButton ref={ref} className={cn(\'font-medium rounded-lg transition-all\', variantStyles[variant], sizeStyles[size], className)} disableElevation {...props}>',
  '        {children}',
  '      </MuiButton>',
  '    );',
  '  }',
  ');',
  'Button.displayName = \'Button\';',
];

writeFile('src/components/ui/button.tsx', buttonLines.join('\n'));

const cardLines = [
  '\'use client\';',
  'import { cn } from \'@/lib/utils/cn\';',
  'import { forwardRef, HTMLAttributes } from \'react\';',
  '',
  'export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { variant?: \'default\' | \'glass\' }>(',
  '  ({ className, variant = \'default\', children, ...props }, ref) => (',
  '    <div ref={ref} className={cn(\'rounded-2xl p-6 transition-all\', variant === \'glass\' ? \'bg-white/70 backdrop-blur-md border border-white/20 shadow-md\' : \'bg-white shadow-md dark:bg-gray-800\', className)} {...props}>',
  '      {children}',
  '    </div>',
  '  )',
  ');',
  'Card.displayName = \'Card\';',
  '',
  'export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (',
  '  <div ref={ref} className={cn(\'mb-4\', className)} {...props}>{children}</div>',
  '));',
  'CardHeader.displayName = \'CardHeader\';',
  '',
  'export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, children, ...props }, ref) => (',
  '  <h3 ref={ref} className={cn(\'text-xl font-semibold text-gray-900 dark:text-white\', className)} {...props}>{children}</h3>',
  '));',
  'CardTitle.displayName = \'CardTitle\';',
  '',
  'export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (',
  '  <div ref={ref} className={cn(\'\', className)} {...props}>{children}</div>',
  '));',
  'CardContent.displayName = \'CardContent\';',
];

writeFile('src/components/ui/card.tsx', cardLines.join('\n'));

writeFile('src/components/ui/skeleton.tsx', `'use client';
import { cn } from '@/lib/utils/cn';

export const Skeleton = ({ className, variant = 'text', width, height }: any) => {
  const variants = { text: 'h-4 rounded', circular: 'rounded-full', rectangular: 'rounded-lg' };
  return <div className={cn('bg-gray-200 dark:bg-gray-700 animate-pulse', variants[variant], className)} style={{ width, height }} />;
};`);

const badgeLines = [
  '\'use client\';',
  'import { cn } from \'@/lib/utils/cn\';',
  'import { ReactNode } from \'react\';',
  '',
  'export const Badge = ({ children, variant = \'default\', size = \'md\', className }: { children: ReactNode; variant?: \'default\' | \'success\' | \'warning\' | \'error\' | \'info\'; size?: \'sm\' | \'md\' | \'lg\'; className?: string }) => {',
  '  const variants = {',
  '    default: \'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200\',',
  '    success: \'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400\',',
  '    warning: \'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400\',',
  '    error: \'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400\',',
  '    info: \'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400\',',
  '  };',
  '  const sizes = { sm: \'px-2 py-0.5 text-xs\', md: \'px-2.5 py-1 text-sm\', lg: \'px-3 py-1.5 text-base\' };',
  '  return <span className={cn(\'inline-flex items-center font-medium rounded-full\', variants[variant], sizes[size], className)}>{children}</span>;',
  '};',
];

writeFile('src/components/ui/badge.tsx', badgeLines.join('\n'));

const modalLines = [
  '\'use client\';',
  'import { ReactNode, useEffect } from \'react\';',
  'import { X } from \'lucide-react\';',
  'import { cn } from \'@/lib/utils/cn\';',
  '',
  'export const Modal = ({ isOpen, onClose, title, children, size = \'md\' }: { isOpen: boolean; onClose: () => void; title?: string; children: ReactNode; size?: \'sm\' | \'md\' | \'lg\' | \'xl\' }) => {',
  '  useEffect(() => {',
  '    if (isOpen) document.body.style.overflow = \'hidden\';',
  '    else document.body.style.overflow = \'\';',
  '    return () => { document.body.style.overflow = \'\'; };',
  '  }, [isOpen]);',
  '',
  '  if (!isOpen) return null;',
  '',
  '  const sizes = { sm: \'max-w-md\', md: \'max-w-lg\', lg: \'max-w-2xl\', xl: \'max-w-4xl\' };',
  '',
  '  return (',
  '    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">',
  '      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />',
  '      <div className={cn(\'relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl\', sizes[size])}>',
  '        {title && (',
  '          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">',
  '            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>',
  '            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>',
  '          </div>',
  '        )}',
  '        <div className="p-6">{children}</div>',
  '      </div>',
  '    </div>',
  '  );',
  '};',
];

writeFile('src/components/ui/modal.tsx', modalLines.join('\n'));

// Form Components
const formFieldLines = [
  '\'use client\';',
  'import { forwardRef, InputHTMLAttributes } from \'react\';',
  'import { cn } from \'@/lib/utils/cn\';',
  'import { LucideIcon } from \'lucide-react\';',
  '',
  'interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {',
  '  label: string; error?: string; icon?: LucideIcon;',
  '}',
  '',
  'export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(',
  '  ({ label, error, icon: Icon, className, ...props }, ref) => (',
  '    <div className="space-y-2">',
  '      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">',
  '        {label}{props.required && <span className="text-red-500 ml-1">*</span>}',
  '      </label>',
  '      <div className="relative">',
  '        {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon size={20} /></div>}',
  '        <input ref={ref} className={cn(\'w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500\', Icon && \'pl-10\', error ? \'border-red-500\' : \'border-gray-300 dark:border-gray-600\', className)} {...props} />',
  '      </div>',
  '      {error && <p className="text-sm text-red-600">{error}</p>}',
  '    </div>',
  '  )',
  ');',
  'FormField.displayName = \'FormField\';',
];

writeFile('src/components/forms/form-field.tsx', formFieldLines.join('\n'));

const formSelectLines = [
  '\'use client\';',
  'import { forwardRef, SelectHTMLAttributes } from \'react\';',
  'import { cn } from \'@/lib/utils/cn\';',
  '',
  'interface Option { value: string; label: string; }',
  'interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {',
  '  label: string; options: Option[]; error?: string; placeholder?: string;',
  '}',
  '',
  'export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(',
  '  ({ label, options, error, placeholder, className, ...props }, ref) => (',
  '    <div className="space-y-2">',
  '      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">',
  '        {label}{props.required && <span className="text-red-500 ml-1">*</span>}',
  '      </label>',
  '      <select ref={ref} className={cn(\'w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500\', error ? \'border-red-500\' : \'border-gray-300 dark:border-gray-600\', className)} {...props}>',
  '        {placeholder && <option value="" disabled>{placeholder}</option>}',
  '        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}',
  '      </select>',
  '      {error && <p className="text-sm text-red-600">{error}</p>}',
  '    </div>',
  '  )',
  ');',
  'FormSelect.displayName = \'FormSelect\';',
];

writeFile('src/components/forms/form-select.tsx', formSelectLines.join('\n'));

// ============================================
// LAYOUT COMPONENTS
// ============================================
const sidebarLines = [
  '\'use client\';',
  'import { usePathname } from \'next/navigation\';',
  'import Link from \'next/link\';',
  'import { cn } from \'@/lib/utils/cn\';',
  'import { LayoutDashboard, Users, Store, Wrench, Package, Warehouse, ClipboardList, ArrowUpFromLine, ArrowDownToLine, CheckCircle, Hammer, Boxes, FileText, Settings, ScrollText, X } from \'lucide-react\';',
  '',
  'const menuItems = [',
  '  { href: \'/\', label: \'Dashboard\', icon: LayoutDashboard },',
  '  { href: \'/users\', label: \'Users\', icon: Users },',
  '  { href: \'/merchants\', label: \'Merchants\', icon: Store },',
  '  { href: \'/technicians\', label: \'Technicians\', icon: Wrench },',
  '  { href: \'/assets\', label: \'Assets\', icon: Package },',
  '  { href: \'/warehouses\', label: \'Warehouses\', icon: Warehouse },',
  '  { href: \'/work-orders\', label: \'Work Orders\', icon: ClipboardList },',
  '  { href: \'/withdrawals\', label: \'Withdrawals\', icon: ArrowUpFromLine },',
  '  { href: \'/receives\', label: \'Receives\', icon: ArrowDownToLine },',
  '  { href: \'/qc\', label: \'Quality Check\', icon: CheckCircle },',
  '  { href: \'/repairs\', label: \'Repairs\', icon: Hammer },',
  '  { href: \'/stock\', label: \'Stock\', icon: Boxes },',
  '  { href: \'/reports\', label: \'Reports\', icon: FileText },',
  '  { href: \'/logs\', label: \'Logs\', icon: ScrollText },',
  '  { href: \'/settings\', label: \'Settings\', icon: Settings },',
  '];',
  '',
  'export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {',
  '  const pathname = usePathname();',
  '  return (',
  '    <>',
  '      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}',
  '      <aside className={cn(\'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0\', open ? \'translate-x-0\' : \'-translate-x-full\')}>',
  '        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">',
  '          <h1 className="text-xl font-bold text-primary-600">AssetPilot</h1>',
  '          <button onClick={onClose} className="lg:hidden text-gray-500"><X size={20} /></button>',
  '        </div>',
  '        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">',
  '          {menuItems.map((item) => {',
  '            const Icon = item.icon;',
  '            const isActive = pathname === item.href;',
  '            return (',
  '              <Link key={item.href} href={item.href} onClick={onClose} className={cn(\'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors\', isActive ? \'bg-primary-50 text-primary-600 dark:bg-primary-900/20\' : \'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700\')}>',
  '                <Icon size={20} /><span className="font-medium">{item.label}</span>',
  '              </Link>',
  '            );',
  '          })}',
  '        </nav>',
  '      </aside>',
  '    </>',
  '  );',
  '};',
];

writeFile('src/components/layout/sidebar.tsx', sidebarLines.join('\n'));

const headerLines = [
  '\'use client\';',
  'import { useState } from \'react\';',
  'import { Menu, Bell, Moon, Sun, LogOut, User } from \'lucide-react\';',
  'import { useTheme } from \'next-themes\';',
  'import { createClient } from \'@/lib/supabase/client\';',
  'import { useRouter } from \'next/navigation\';',
  'import { toast } from \'sonner\';',
  '',
  'export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {',
  '  const { theme, setTheme } = useTheme();',
  '  const [showUserMenu, setShowUserMenu] = useState(false);',
  '  const router = useRouter();',
  '  const supabase = createClient();',
  '',
  '  const handleLogout = async () => {',
  '    await supabase.auth.signOut();',
  '    toast.success(\'Logged out\');',
  '    router.push(\'/login\');',
  '    router.refresh();',
  '  };',
  '',
  '  return (',
  '    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">',
  '      <div className="flex items-center justify-between h-16 px-4 md:px-6">',
  '        <button onClick={onMenuClick} className="lg:hidden text-gray-500"><Menu size={24} /></button>',
  '        <div className="flex-1" />',
  '        <div className="flex items-center gap-2">',
  '          <button onClick={() => setTheme(theme === \'light\' ? \'dark\' : \'light\')} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">',
  '            {theme === \'light\' ? <Moon size={20} /> : <Sun size={20} />}',
  '          </button>',
  '          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><Bell size={20} /></button>',
  '          <div className="relative">',
  '            <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><User size={20} /></button>',
  '            {showUserMenu && (',
  '              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">',
  '                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">',
  '                  <LogOut size={16} /> Logout',
  '                </button>',
  '              </div>',
  '            )}',
  '          </div>',
  '        </div>',
  '      </div>',
  '    </header>',
  '  );',
  '};',
];

writeFile('src/components/layout/header.tsx', headerLines.join('\n'));

// ============================================
// AUTH PAGES
// ============================================
writeFile('src/app/(auth)/layout.tsx', `export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">AssetPilot</h1>
          <p className="text-gray-600 dark:text-gray-400">Enterprise Asset Lifecycle Management</p>
        </div>
        {children}
      </div>
    </div>
  );
}`);

const loginLines = [
  '\'use client\';',
  'import { useState } from \'react\';',
  'import { useRouter } from \'next/navigation\';',
  'import { useForm } from \'react-hook-form\';',
  'import { zodResolver } from \'@hookform/resolvers/zod\';',
  'import { z } from \'zod\';',
  'import { Card, CardContent } from \'@/components/ui/card\';',
  'import { Button } from \'@/components/ui/button\';',
  'import { createClient } from \'@/lib/supabase/client\';',
  'import { toast } from \'sonner\';',
  'import Link from \'next/link\';',
  '',
  'const loginSchema = z.object({',
  '  email: z.string().email(\'Invalid email\'),',
  '  password: z.string().min(6, \'Password min 6 chars\'),',
  '});',
  '',
  'export default function LoginPage() {',
  '  const router = useRouter();',
  '  const [loading, setLoading] = useState(false);',
  '  const supabase = createClient();',
  '  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });',
  '',
  '  const onSubmit = async (data: any) => {',
  '    setLoading(true);',
  '    try {',
  '      const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });',
  '      if (error) { toast.error(error.message); return; }',
  '      toast.success(\'Login successful!\');',
  '      window.location.href = \'/\';',
  '    } finally { setLoading(false); }',
  '  };',
  '',
  '  return (',
  '    <Card variant="glass" className="animate-slide-up">',
  '      <CardContent>',
  '        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sign In</h2>',
  '        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">',
  '          <div>',
  '            <label className="block text-sm font-medium mb-2">Email</label>',
  '            <input {...register(\'email\')} type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" placeholder="you@example.com" />',
  '            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}',
  '          </div>',
  '          <div>',
  '            <label className="block text-sm font-medium mb-2">Password</label>',
  '            <input {...register(\'password\')} type="password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" placeholder="••••••••" />',
  '            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}',
  '          </div>',
  '          <Button type="submit" className="w-full" disabled={loading}>{loading ? \'Signing in...\' : \'Sign In\'}</Button>',
  '          <div className="text-center"><Link href="/forgot-password" className="text-sm text-primary-600">Forgot password?</Link></div>',
  '        </form>',
  '      </CardContent>',
  '    </Card>',
  '  );',
  '}',
];

writeFile('src/app/(auth)/login/page.tsx', loginLines.join('\n'));

// ============================================
// DASHBOARD LAYOUT & PAGE
// ============================================
writeFile('src/app/(dashboard)/layout.tsx', `'use client';
import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}`);

const dashboardPageLines = [
  'import { Metadata } from \'next\';',
  'import { DashboardStats } from \'@/components/dashboard/dashboard-stats\';',
  'import { DashboardCharts } from \'@/components/dashboard/dashboard-charts\';',
  'import { TopTechnicians } from \'@/components/dashboard/top-technicians\';',
  'import { RecentActivities } from \'@/components/dashboard/recent-activities\';',
  '',
  'export const metadata: Metadata = { title: \'Dashboard - AssetPilot\' };',
  '',
  'export default function DashboardPage() {',
  '  return (',
  '    <div className="space-y-6 animate-fade-in">',
  '      <div>',
  '        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>',
  '        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to AssetPilot</p>',
  '      </div>',
  '      <DashboardStats />',
  '      <DashboardCharts />',
  '      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">',
  '        <TopTechnicians />',
  '        <RecentActivities />',
  '      </div>',
  '    </div>',
  '  );',
  '}',
];

writeFile('src/app/(dashboard)/page.tsx', dashboardPageLines.join('\n'));

// ============================================
// DASHBOARD COMPONENTS
// ============================================
const statCardLines = [
  '\'use client\';',
  'import { Card } from \'@/components/ui/card\';',
  'import { Skeleton } from \'@/components/ui/skeleton\';',
  'import { cn } from \'@/lib/utils/cn\';',
  'import { LucideIcon, TrendingUp, TrendingDown } from \'lucide-react\';',
  '',
  'export const StatCard = ({ title, value, icon: Icon, trend, color = \'blue\', loading = false }: any) => {',
  '  const colors: any = {',
  '    blue: \'bg-blue-500\', green: \'bg-green-500\', red: \'bg-red-500\',',
  '    yellow: \'bg-yellow-500\', purple: \'bg-purple-500\', orange: \'bg-orange-500\',',
  '  };',
  '  if (loading) return <Card variant="glass"><Skeleton className="h-24 w-full" /></Card>;',
  '  return (',
  '    <Card variant="glass" className="hover:shadow-lg transition-all">',
  '      <div className="flex items-start justify-between">',
  '        <div className="flex-1">',
  '          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>',
  '          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>',
  '          {trend && (',
  '            <div className={cn(\'flex items-center gap-1 text-sm font-medium\', trend.isPositive ? \'text-green-600\' : \'text-red-600\')}>',
  '              {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}',
  '              <span>{Math.abs(trend.value)}%</span>',
  '            </div>',
  '          )}',
  '        </div>',
  '        <div className={cn(\'p-3 rounded-xl\', colors[color])}>',
  '          <Icon className="h-6 w-6 text-white" />',
  '        </div>',
  '      </div>',
  '    </Card>',
  '  );',
  '};',
];

writeFile('src/components/dashboard/stat-card.tsx', statCardLines.join('\n'));

const dashboardStatsLines = [
  '\'use client\';',
  'import { useEffect, useState } from \'react\';',
  'import { StatCard } from \'./stat-card\';',
  'import { ClipboardList, Package, AlertTriangle, CheckCircle, Hammer, Boxes, Trash2, Warehouse } from \'lucide-react\';',
  '',
  'export const DashboardStats = () => {',
  '  const [stats, setStats] = useState<any>(null);',
  '  const [loading, setLoading] = useState(true);',
  '',
  '  useEffect(() => {',
  '    fetch(\'/api/dashboard/stats\')',
  '      .then(r => r.ok ? r.json() : null)',
  '      .then(d => { if (d) setStats(d); })',
  '      .finally(() => setLoading(false));',
  '  }, []);',
  '',
  '  return (',
  '    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">',
  '      <StatCard title="Outstanding WO" value={stats?.outstandingWO || 0} icon={ClipboardList} color="blue" loading={loading} />',
  '      <StatCard title="Asset On Technician" value={stats?.assetOnTechnician || 0} icon={Package} color="purple" loading={loading} />',
  '      <StatCard title="Late Return" value={stats?.lateReturn || 0} icon={AlertTriangle} color="red" loading={loading} />',
  '      <StatCard title="Received Today" value={stats?.receivedToday || 0} icon={CheckCircle} color="green" loading={loading} />',
  '      <StatCard title="In Repair" value={stats?.inRepair || 0} icon={Hammer} color="orange" loading={loading} />',
  '      <StatCard title="Ready Stock" value={stats?.readyStock || 0} icon={Boxes} color="green" loading={loading} />',
  '      <StatCard title="Scrap" value={stats?.scrap || 0} icon={Trash2} color="red" loading={loading} />',
  '      <StatCard title="Warehouse Stock" value={stats?.warehouseStock || 0} icon={Warehouse} color="blue" loading={loading} />',
  '    </div>',
  '  );',
  '};',
];

writeFile('src/components/dashboard/dashboard-stats.tsx', dashboardStatsLines.join('\n'));

const dashboardChartsLines = [
  '\'use client\';',
  'import { useEffect, useState } from \'react\';',
  'import { Card, CardHeader, CardTitle, CardContent } from \'@/components/ui/card\';',
  'import { Skeleton } from \'@/components/ui/skeleton\';',
  'import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from \'recharts\';',
  '',
  'export const DashboardCharts = () => {',
  '  const [data, setData] = useState<any[]>([]);',
  '  const [loading, setLoading] = useState(true);',
  '',
  '  useEffect(() => {',
  '    fetch(\'/api/dashboard/monthly\')',
  '      .then(r => r.ok ? r.json() : [])',
  '      .then(data => setData(data))',
  '      .finally(() => setLoading(false));',
  '  }, []);',
  '',
  '  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Card><Skeleton className="h-80 w-full" /></Card><Card><Skeleton className="h-80 w-full" /></Card></div>;',
  '',
  '  return (',
  '    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">',
  '      <Card variant="glass">',
  '        <CardHeader><CardTitle>Monthly Transactions</CardTitle></CardHeader>',
  '        <CardContent>',
  '          <ResponsiveContainer width="100%" height={320}>',
  '            <LineChart data={data}>',
  '              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />',
  '              <XAxis dataKey="month" stroke="#6b7280" />',
  '              <YAxis stroke="#6b7280" />',
  '              <Tooltip /><Legend />',
  '              <Line type="monotone" dataKey="withdrawals" stroke="#3b82f6" strokeWidth={2} name="Withdrawals" />',
  '              <Line type="monotone" dataKey="receives" stroke="#10b981" strokeWidth={2} name="Receives" />',
  '              <Line type="monotone" dataKey="repairs" stroke="#f59e0b" strokeWidth={2} name="Repairs" />',
  '            </LineChart>',
  '          </ResponsiveContainer>',
  '        </CardContent>',
  '      </Card>',
  '      <Card variant="glass">',
  '        <CardHeader><CardTitle>Transaction Comparison</CardTitle></CardHeader>',
  '        <CardContent>',
  '          <ResponsiveContainer width="100%" height={320}>',
  '            <BarChart data={data}>',
  '              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />',
  '              <XAxis dataKey="month" stroke="#6b7280" />',
  '              <YAxis stroke="#6b7280" />',
  '              <Tooltip /><Legend />',
  '              <Bar dataKey="withdrawals" fill="#3b82f6" name="Withdrawals" radius={[8, 8, 0, 0]} />',
  '              <Bar dataKey="receives" fill="#10b981" name="Receives" radius={[8, 8, 0, 0]} />',
  '              <Bar dataKey="repairs" fill="#f59e0b" name="Repairs" radius={[8, 8, 0, 0]} />',
  '            </BarChart>',
  '          </ResponsiveContainer>',
  '        </CardContent>',
  '      </Card>',
  '    </div>',
  '  );',
  '};',
];

writeFile('src/components/dashboard/dashboard-charts.tsx', dashboardChartsLines.join('\n'));

const topTechniciansLines = [
  '\'use client\';',
  'import { useEffect, useState } from \'react\';',
  'import { Card, CardHeader, CardTitle, CardContent } from \'@/components/ui/card\';',
  'import { Skeleton } from \'@/components/ui/skeleton\';',
  'import { Award, Clock, Star } from \'lucide-react\';',
  '',
  'export const TopTechnicians = () => {',
  '  const [technicians, setTechnicians] = useState<any[]>([]);',
  '  const [loading, setLoading] = useState(true);',
  '',
  '  useEffect(() => {',
  '    fetch(\'/api/dashboard/top-technicians\')',
  '      .then(r => r.ok ? r.json() : [])',
  '      .then(data => setTechnicians(data))',
  '      .finally(() => setLoading(false));',
  '  }, []);',
  '',
  '  if (loading) return <Card><Skeleton className="h-64 w-full" /></Card>;',
  '',
  '  return (',
  '    <Card variant="glass">',
  '      <CardHeader><CardTitle>Top Technicians</CardTitle></CardHeader>',
  '      <CardContent>',
  '        <div className="space-y-4">',
  '          {technicians.map((tech, index) => (',
  '            <div key={tech.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">',
  '              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">{tech.name.charAt(0)}</div>',
  '              <div className="flex-1">',
  '                <p className="font-semibold text-gray-900 dark:text-white">{tech.name}</p>',
  '                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">',
  '                  <span className="flex items-center gap-1"><Award size={14} />{tech.completedWO} WO</span>',
  '                  <span className="flex items-center gap-1"><Clock size={14} />{tech.avgResponseTime}m</span>',
  '                  <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-500 text-yellow-500" />{tech.rating.toFixed(1)}</span>',
  '                </div>',
  '              </div>',
  '              <div className="text-2xl font-bold text-primary-600">#{index + 1}</div>',
  '            </div>',
  '          ))}',
  '        </div>',
  '      </CardContent>',
  '    </Card>',
  '  );',
  '};',
];

writeFile('src/components/dashboard/top-technicians.tsx', topTechniciansLines.join('\n'));

const recentActivitiesLines = [
  '\'use client\';',
  'import { useEffect, useState } from \'react\';',
  'import { Card, CardHeader, CardTitle, CardContent } from \'@/components/ui/card\';',
  'import { Skeleton } from \'@/components/ui/skeleton\';',
  'import { formatRelativeTime } from \'@/lib/utils/format\';',
  '',
  'export const RecentActivities = () => {',
  '  const [activities, setActivities] = useState<any[]>([]);',
  '  const [loading, setLoading] = useState(true);',
  '',
  '  useEffect(() => {',
  '    fetch(\'/api/dashboard/recent-activities\')',
  '      .then(r => r.ok ? r.json() : [])',
  '      .then(data => setActivities(data))',
  '      .finally(() => setLoading(false));',
  '  }, []);',
  '',
  '  if (loading) return <Card><Skeleton className="h-64 w-full" /></Card>;',
  '',
  '  return (',
  '    <Card variant="glass">',
  '      <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>',
  '      <CardContent>',
  '        <div className="space-y-4">',
  '          {activities.map((activity) => (',
  '            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">',
  '              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">{activity.user_name.charAt(0)}</div>',
  '              <div className="flex-1">',
  '                <p className="text-sm text-gray-900 dark:text-white"><span className="font-semibold">{activity.user_name}</span> {activity.description}</p>',
  '                <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(activity.timestamp)}</p>',
  '              </div>',
  '            </div>',
  '          ))}',
  '          {activities.length === 0 && <div className="text-center py-8 text-gray-500">No recent activities</div>}',
  '        </div>',
  '      </CardContent>',
  '    </Card>',
  '  );',
  '};',
];

writeFile('src/components/dashboard/recent-activities.tsx', recentActivitiesLines.join('\n'));

// ============================================
// DATA TABLE COMPONENT
// ============================================
const dataTableLines = [
  '\'use client\';',
  'import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableSortLabel, IconButton, Tooltip } from \'@mui/material\';',
  'import { Edit, Trash2, Eye } from \'lucide-react\';',
  'import { Card } from \'@/components/ui/card\';',
  'import { Skeleton } from \'@/components/ui/skeleton\';',
  '',
  'interface Column<T> {',
  '  id: string; label: string; minWidth?: number; align?: \'left\' | \'right\' | \'center\';',
  '  sortable?: boolean; render?: (value: any, row: T) => React.ReactNode;',
  '}',
  '',
  'interface DataTableProps<T> {',
  '  columns: Column<T>[]; data: T[]; totalCount: number;',
  '  page: number; pageSize: number;',
  '  onPageChange: (page: number) => void; onPageSizeChange: (size: number) => void;',
  '  onEdit?: (row: T) => void; onDelete?: (row: T) => void; onView?: (row: T) => void;',
  '  loading?: boolean; emptyMessage?: string; actions?: boolean;',
  '}',
  '',
  'export function DataTable<T extends { id: string }>({ columns, data, totalCount, page, pageSize, onPageChange, onPageSizeChange, onEdit, onDelete, onView, loading, emptyMessage = \'No data\', actions = true }: DataTableProps<T>) {',
  '  if (loading) return <Card><div className="p-6 space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div></Card>;',
  '',
  '  return (',
  '    <Card variant="glass">',
  '      <TableContainer sx={{ maxHeight: 600 }}>',
  '        <Table stickyHeader>',
  '          <TableHead>',
  '            <TableRow>',
  '              {columns.map((col) => (',
  '                <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>',
  '                  {col.sortable ? <TableSortLabel>{col.label}</TableSortLabel> : col.label}',
  '                </TableCell>',
  '              ))}',
  '              {actions && <TableCell align="center" style={{ minWidth: 150 }}>Actions</TableCell>}',
  '            </TableRow>',
  '          </TableHead>',
  '          <TableBody>',
  '            {data.length === 0 ? (',
  '              <TableRow><TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" className="py-12 text-gray-500">{emptyMessage}</TableCell></TableRow>',
  '            ) : data.map((row) => (',
  '              <TableRow key={row.id} hover className="cursor-pointer">',
  '                {columns.map((col) => {',
  '                  const value = (row as any)[col.id];',
  '                  return <TableCell key={col.id} align={col.align}>{col.render ? col.render(value, row) : value}</TableCell>;',
  '                })}',
  '                {actions && (',
  '                  <TableCell align="center">',
  '                    <div className="flex items-center justify-center gap-1">',
  '                      {onView && <Tooltip title="View"><IconButton size="small" onClick={() => onView(row)} className="text-blue-600"><Eye size={18} /></IconButton></Tooltip>}',
  '                      {onEdit && <Tooltip title="Edit"><IconButton size="small" onClick={() => onEdit(row)} className="text-green-600"><Edit size={18} /></IconButton></Tooltip>}',
  '                      {onDelete && <Tooltip title="Delete"><IconButton size="small" onClick={() => onDelete(row)} className="text-red-600"><Trash2 size={18} /></IconButton></Tooltip>}',
  '                    </div>',
  '                  </TableCell>',
  '                )}',
  '              </TableRow>',
  '            ))}',
  '          </TableBody>',
  '        </Table>',
  '      </TableContainer>',
  '      <TablePagination component="div" count={totalCount} page={page - 1} onPageChange={(_, p) => onPageChange(p + 1)} rowsPerPage={pageSize} onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value))} rowsPerPageOptions={[10, 25, 50, 100]} />',
  '    </Card>',
  '  );',
  '}',
];

writeFile('src/components/data-display/data-table.tsx', dataTableLines.join('\n'));

// ============================================
// USERS PAGE
// ============================================
writeFile('src/app/(dashboard)/users/page.tsx', `import { Metadata } from 'next';
import { UsersClient } from './users-client';
export const metadata: Metadata = { title: 'Users - AssetPilot' };
export default function UsersPage() { return <UsersClient />; }`);

const usersClientLines = [
  '\'use client\';',
  'import { useEffect, useState, useCallback } from \'react\';',
  'import { DataTable } from \'@/components/data-display/data-table\';',
  'import { Button } from \'@/components/ui/button\';',
  'import { Modal } from \'@/components/ui/modal\';',
  'import { Badge } from \'@/components/ui/badge\';',
  'import { FormField } from \'@/components/forms/form-field\';',
  'import { FormSelect } from \'@/components/forms/form-select\';',
  'import { useToast } from \'@/lib/hooks/use-toast\';',
  'import { useDebounce } from \'@/lib/hooks/use-debounce\';',
  'import { Plus, Search } from \'lucide-react\';',
  'import { useForm } from \'react-hook-form\';',
  'import { zodResolver } from \'@hookform/resolvers/zod\';',
  'import { z } from \'zod\';',
  'import type { UserProfile } from \'@/lib/types/user.types\';',
  '',
  'const userSchema = z.object({',
  '  email: z.string().email(),',
  '  password: z.string().min(8).optional(),',
  '  full_name: z.string().min(2),',
  '  phone: z.string().optional(),',
  '  role: z.enum([\'administrator\', \'warehouse\', \'technician\', \'supervisor\', \'management\']),',
  '  status: z.enum([\'active\', \'inactive\', \'suspended\']).optional(),',
  '});',
  '',
  'export const UsersClient = () => {',
  '  const [users, setUsers] = useState<UserProfile[]>([]);',
  '  const [totalCount, setTotalCount] = useState(0);',
  '  const [loading, setLoading] = useState(true);',
  '  const [searchTerm, setSearchTerm] = useState(\'\');',
  '  const [isModalOpen, setIsModalOpen] = useState(false);',
  '  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);',
  '  const [page, setPage] = useState(1);',
  '  const [pageSize, setPageSize] = useState(10);',
  '  const debouncedSearch = useDebounce(searchTerm, 500);',
  '  const toast = useToast();',
  '  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(userSchema) });',
  '',
  '  const fetchUsers = useCallback(async () => {',
  '    setLoading(true);',
  '    try {',
  '      const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });',
  '      if (debouncedSearch) params.append(\'search\', debouncedSearch);',
  '      const response = await fetch(`/api/users?${params}`);',
  '      if (response.ok) {',
  '        const data = await response.json();',
  '        setUsers(data.data);',
  '        setTotalCount(data.total);',
  '      }',
  '    } finally { setLoading(false); }',
  '  }, [page, pageSize, debouncedSearch]);',
  '',
  '  useEffect(() => { fetchUsers(); }, [fetchUsers]);',
  '',
  '  const handleCreate = () => { setEditingUser(null); reset(); setIsModalOpen(true); };',
  '  const handleEdit = (user: UserProfile) => {',
  '    setEditingUser(user);',
  '    reset({ email: user.email, full_name: user.full_name, phone: user.phone, role: user.role, status: user.status });',
  '    setIsModalOpen(true);',
  '  };',
  '  const handleDelete = async (user: UserProfile) => {',
  '    if (!confirm(`Delete ${user.full_name}?`)) return;',
  '    try {',
  '      const response = await fetch(`/api/users/${user.id}`, { method: \'DELETE\' });',
  '      if (response.ok) { toast.success(\'Deleted\'); fetchUsers(); }',
  '      else toast.error(\'Failed\');',
  '    } catch { toast.error(\'Failed\'); }',
  '  };',
  '',
  '  const onSubmit = async (data: any) => {',
  '    try {',
  '      const url = editingUser ? `/api/users/${editingUser.id}` : \'/api/users\';',
  '      const method = editingUser ? \'PUT\' : \'POST\';',
  '      const payload = editingUser ? { ...data, password: undefined } : data;',
  '      const response = await fetch(url, { method, headers: { \'Content-Type\': \'application/json\' }, body: JSON.stringify(payload) });',
  '      if (response.ok) { toast.success(editingUser ? \'Updated\' : \'Created\'); setIsModalOpen(false); fetchUsers(); }',
  '      else toast.error(\'Failed\');',
  '    } catch { toast.error(\'Failed\'); }',
  '  };',
  '',
  '  const columns = [',
  '    { id: \'full_name\', label: \'Name\', sortable: true, render: (v: string, r: UserProfile) => (',
  '      <div className="flex items-center gap-3">',
  '        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">{v.charAt(0)}</div>',
  '        <div><div className="font-medium">{v}</div><div className="text-sm text-gray-500">{r.email}</div></div>',
  '      </div>',
  '    )},',
  '    { id: \'role\', label: \'Role\', sortable: true, render: (v: string) => <Badge variant={v === \'administrator\' ? \'error\' : v === \'supervisor\' ? \'warning\' : \'info\'}>{v}</Badge> },',
  '    { id: \'status\', label: \'Status\', sortable: true, render: (v: string) => <Badge variant={v === \'active\' ? \'success\' : v === \'inactive\' ? \'warning\' : \'error\'}>{v}</Badge> },',
  '    { id: \'phone\', label: \'Phone\' },',
  '    { id: \'created_at\', label: \'Created\', render: (v: string) => new Date(v).toLocaleDateString() },',
  '  ];',
  '',
  '  const roleOptions = [',
  '    { value: \'administrator\', label: \'Administrator\' },',
  '    { value: \'supervisor\', label: \'Supervisor\' },',
  '    { value: \'warehouse\', label: \'Warehouse\' },',
  '    { value: \'technician\', label: \'Technician\' },',
  '    { value: \'management\', label: \'Management\' },',
  '  ];',
  '',
  '  return (',
  '    <div className="space-y-6 animate-fade-in">',
  '      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">',
  '        <div><h1 className="text-3xl font-bold">Users</h1><p className="text-gray-600 mt-1">Manage system users</p></div>',
  '        <Button onClick={handleCreate} className="gap-2"><Plus size={20} />Add User</Button>',
  '      </div>',
  '      <div className="flex flex-col sm:flex-row gap-4">',
  '        <div className="flex-1 relative">',
  '          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />',
  '          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />',
  '        </div>',
  '      </div>',
  '      <DataTable columns={columns} data={users} totalCount={totalCount} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />',
  '      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? \'Edit User\' : \'Create User\'}>',
  '        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">',
  '          <FormField label="Full Name" {...register(\'full_name\')} error={errors.full_name?.message} required />',
  '          <FormField label="Email" type="email" {...register(\'email\')} error={errors.email?.message} required disabled={!!editingUser} />',
  '          {!editingUser && <FormField label="Password" type="password" {...register(\'password\')} error={errors.password?.message} required />}',
  '          <FormField label="Phone" {...register(\'phone\')} />',
  '          <FormSelect label="Role" options={roleOptions} {...register(\'role\')} required />',
  '          <div className="flex gap-3 pt-4">',
  '            <Button type="submit" className="flex-1">{editingUser ? \'Update\' : \'Create\'}</Button>',
  '            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>',
  '          </div>',
  '        </form>',
  '      </Modal>',
  '    </div>',
  '  );',
  '};',
];

writeFile('src/app/(dashboard)/users/users-client.tsx', usersClientLines.join('\n'));

// ============================================
// API ROUTES
// ============================================
const usersApiLines = [
  'import { NextRequest, NextResponse } from \'next/server\';',
  'import { createClient } from \'@/lib/supabase/server\';',
  'import { createAdminClient } from \'@/lib/supabase/admin\';',
  '',
  'export async function GET(request: NextRequest) {',
  '  try {',
  '    const supabase = await createClient();',
  '    const { data: { user } } = await supabase.auth.getUser();',
  '    if (!user) return NextResponse.json({ error: \'Unauthorized\' }, { status: 401 });',
  '',
  '    const params = request.nextUrl.searchParams;',
  '    const page = parseInt(params.get(\'page\') || \'1\');',
  '    const pageSize = parseInt(params.get(\'pageSize\') || \'10\');',
  '    const search = params.get(\'search\');',
  '',
  '    let query = supabase.from(\'profiles\').select(\'*\', { count: \'exact\' });',
  '    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);',
  '',
  '    const from = (page - 1) * pageSize;',
  '    const { data, error, count } = await query.order(\'created_at\', { ascending: false }).range(from, from + pageSize - 1);',
  '',
  '    if (error) throw error;',
  '    return NextResponse.json({ data, total: count || 0, page, pageSize, totalPages: Math.ceil((count || 0) / pageSize) });',
  '  } catch (error) {',
  '    return NextResponse.json({ error: \'Internal server error\' }, { status: 500 });',
  '  }',
  '}',
  '',
  'export async function POST(request: NextRequest) {',
  '  try {',
  '    const supabase = await createClient();',
  '    const { data: { user } } = await supabase.auth.getUser();',
  '    if (!user) return NextResponse.json({ error: \'Unauthorized\' }, { status: 401 });',
  '',
  '    const body = await request.json();',
  '    const adminClient = createAdminClient();',
  '',
  '    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({',
  '      email: body.email, password: body.password, email_confirm: true,',
  '      user_metadata: { full_name: body.full_name, role: body.role },',
  '    });',
  '',
  '    if (authError) throw authError;',
  '    if (!authData.user) throw new Error(\'Failed to create user\');',
  '',
  '    const { data: profileData, error: profileError } = await adminClient',
  '      .from(\'profiles\').update({ full_name: body.full_name, phone: body.phone, role: body.role })',
  '      .eq(\'id\', authData.user.id).select().single();',
  '',
  '    if (profileError) throw profileError;',
  '    return NextResponse.json(profileData, { status: 201 });',
  '  } catch (error) {',
  '    return NextResponse.json({ error: error instanceof Error ? error.message : \'Failed\' }, { status: 400 });',
  '  }',
  '}',
];

writeFile('src/app/api/users/route.ts', usersApiLines.join('\n'));

const usersIdApiLines = [
  'import { NextRequest, NextResponse } from \'next/server\';',
  'import { createClient } from \'@/lib/supabase/server\';',
  'import { createAdminClient } from \'@/lib/supabase/admin\';',
  '',
  'export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {',
  '  try {',
  '    const supabase = await createClient();',
  '    const { data: { user } } = await supabase.auth.getUser();',
  '    if (!user) return NextResponse.json({ error: \'Unauthorized\' }, { status: 401 });',
  '',
  '    const body = await request.json();',
  '    const { data, error } = await supabase.from(\'profiles\').update(body).eq(\'id\', params.id).select().single();',
  '    if (error) throw error;',
  '    return NextResponse.json(data);',
  '  } catch (error) {',
  '    return NextResponse.json({ error: \'Failed\' }, { status: 400 });',
  '  }',
  '}',
  '',
  'export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {',
  '  try {',
  '    const supabase = await createClient();',
  '    const { data: { user } } = await supabase.auth.getUser();',
  '    if (!user) return NextResponse.json({ error: \'Unauthorized\' }, { status: 401 });',
  '',
  '    const adminClient = createAdminClient();',
  '    const { error } = await adminClient.auth.admin.deleteUser(params.id);',
  '    if (error) throw error;',
  '    return NextResponse.json({ message: \'Deleted\' });',
  '  } catch (error) {',
  '    return NextResponse.json({ error: \'Failed\' }, { status: 400 });',
  '  }',
  '}',
];

writeFile('src/app/api/users/[id]/route.ts', usersIdApiLines.join('\n'));

// Dashboard API Routes
writeFile('src/app/api/dashboard/stats/route.ts', `import { NextResponse } from 'next/server';
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
}`);

writeFile('src/app/api/dashboard/monthly/route.ts', `import { NextResponse } from 'next/server';
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
}`);

writeFile('src/app/api/dashboard/top-technicians/route.ts', `import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
}`);

writeFile('src/app/api/dashboard/recent-activities/route.ts', `import { NextResponse } from 'next/server';
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
      timestamp: log.created_at, description: \`\${log.action} \${log.entity_type}\`,
    }));
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`);

// ============================================
// MERCHANTS PAGE & API
// ============================================
writeFile('src/app/(dashboard)/merchants/page.tsx', `import { Metadata } from 'next';
import { MerchantsClient } from './merchants-client';

export const metadata: Metadata = {
  title: 'Merchants - AssetPilot',
};

export default function MerchantsPage() {
  return <MerchantsClient />;
}`);

const merchantsClientLines = [
  '\'use client\';',
  'import { useEffect, useState } from \'react\';',
  'import { DataTable } from \'@/components/data-display/data-table\';',
  'import { Button } from \'@/components/ui/button\';',
  'import { Modal } from \'@/components/ui/modal\';',
  'import { Badge } from \'@/components/ui/badge\';',
  'import { FormField } from \'@/components/forms/form-field\';',
  'import { useToast } from \'@/lib/hooks/use-toast\';',
  'import { Plus, Search } from \'lucide-react\';',
  'import { useForm } from \'react-hook-form\';',
  'import { zodResolver } from \'@hookform/resolvers/zod\';',
  'import { z } from \'zod\';',
  '',
  'const merchantSchema = z.object({',
  '  merchant_name: z.string().min(2, \'Name must be at least 2 characters\'),',
  '  merchant_code: z.string().min(2, \'Code must be at least 2 characters\'),',
  '  address: z.string().min(5, \'Address must be at least 5 characters\'),',
  '  city: z.string().min(2, \'City is required\'),',
  '  province: z.string().min(2, \'Province is required\'),',
  '  contact_person: z.string().min(2, \'Contact person is required\'),',
  '  contact_phone: z.string().min(10, \'Phone must be at least 10 digits\'),',
  '  contact_email: z.string().email(\'Invalid email\').optional().or(z.literal(\'\')),',
  '  mid: z.string().optional(),',
  '  tid: z.string().optional(),',
  '  notes: z.string().optional(),',
  '});',
  '',
  'type MerchantFormData = z.infer<typeof merchantSchema>;',
  '',
  'export const MerchantsClient = () => {',
  '  const [merchants, setMerchants] = useState<any[]>([]);',
  '  const [loading, setLoading] = useState(true);',
  '  const [isModalOpen, setIsModalOpen] = useState(false);',
  '  const [editingMerchant, setEditingMerchant] = useState<any>(null);',
  '  const [searchTerm, setSearchTerm] = useState(\'\');',
  '',
  '  const toast = useToast();',
  '  const { register, handleSubmit, reset, formState: { errors } } = useForm<MerchantFormData>({',
  '    resolver: zodResolver(merchantSchema),',
  '  });',
  '',
  '  useEffect(() => {',
  '    fetchMerchants();',
  '  }, []);',
  '',
  '  const fetchMerchants = async () => {',
  '    setLoading(true);',
  '    try {',
  '      const response = await fetch(\'/api/merchants\');',
  '      if (response.ok) {',
  '        const data = await response.json();',
  '        setMerchants(data);',
  '      }',
  '    } finally {',
  '      setLoading(false);',
  '    }',
  '  };',
  '',
  '  const handleCreate = () => {',
  '    setEditingMerchant(null);',
  '    reset();',
  '    setIsModalOpen(true);',
  '  };',
  '',
  '  const handleEdit = (merchant: any) => {',
  '    setEditingMerchant(merchant);',
  '    reset(merchant);',
  '    setIsModalOpen(true);',
  '  };',
  '',
  '  const handleDelete = async (merchant: any) => {',
  '    if (!confirm(`Delete merchant ${merchant.merchant_name}?`)) return;',
  '    ',
  '    try {',
  '      const response = await fetch(`/api/merchants/${merchant.id}`, { method: \'DELETE\' });',
  '      if (response.ok) {',
  '        toast.success(\'Merchant deleted\');',
  '        fetchMerchants();',
  '      }',
  '    } catch {',
  '      toast.error(\'Failed to delete\');',
  '    }',
  '  };',
  '',
  '  const onSubmit = async (data: MerchantFormData) => {',
  '    try {',
  '      const url = editingMerchant ? `/api/merchants/${editingMerchant.id}` : \'/api/merchants\';',
  '      const method = editingMerchant ? \'PUT\' : \'POST\';',
  '      ',
  '      const response = await fetch(url, {',
  '        method,',
  '        headers: { \'Content-Type\': \'application/json\' },',
  '        body: JSON.stringify(data),',
  '      });',
  '',
  '      if (response.ok) {',
  '        toast.success(editingMerchant ? \'Merchant updated\' : \'Merchant created\');',
  '        setIsModalOpen(false);',
  '        fetchMerchants();',
  '      }',
  '    } catch {',
  '      toast.error(\'Failed to save\');',
  '    }',
  '  };',
  '',
  '  const columns = [',
  '    { id: \'merchant_name\', label: \'Name\', sortable: true },',
  '    { id: \'merchant_code\', label: \'Code\', sortable: true },',
  '    { id: \'city\', label: \'City\', sortable: true },',
  '    { id: \'contact_person\', label: \'Contact\', sortable: false },',
  '    { id: \'contact_phone\', label: \'Phone\', sortable: false },',
  '    { ',
  '      id: \'status\', ',
  '      label: \'Status\', ',
  '      render: (value: string) => (',
  '        <Badge variant={value === \'active\' ? \'success\' : \'warning\'}>',
  '          {value}',
  '        </Badge>',
  '      )',
  '    },',
  '  ];',
  '',
  '  return (',
  '    <div className="space-y-6 animate-fade-in">',
  '      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">',
  '        <div>',
  '          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Merchants</h1>',
  '          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage merchants and retailers</p>',
  '        </div>',
  '        <Button onClick={handleCreate} className="gap-2">',
  '          <Plus size={20} />',
  '          Add Merchant',
  '        </Button>',
  '      </div>',
  '',
  '      <div className="flex gap-4">',
  '        <div className="flex-1 relative">',
  '          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />',
  '          <input',
  '            type="text"',
  '            placeholder="Search merchants..."',
  '            value={searchTerm}',
  '            onChange={(e) => setSearchTerm(e.target.value)}',
  '            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"',
  '          />',
  '        </div>',
  '      </div>',
  '',
  '      <DataTable',
  '        columns={columns}',
  '        data={merchants}',
  '        totalCount={merchants.length}',
  '        page={1}',
  '        pageSize={10}',
  '        onPageChange={() => {}}',
  '        onPageSizeChange={() => {}}',
  '        onEdit={handleEdit}',
  '        onDelete={handleDelete}',
  '        loading={loading}',
  '        emptyMessage="No merchants found"',
  '      />',
  '',
  '      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMerchant ? \'Edit Merchant\' : \'Create Merchant\'} size="lg">',
  '        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">',
  '          <div className="grid grid-cols-2 gap-4">',
  '            <FormField label="Merchant Name" {...register(\'merchant_name\')} error={errors.merchant_name?.message} required />',
  '            <FormField label="Merchant Code" {...register(\'merchant_code\')} error={errors.merchant_code?.message} required />',
  '          </div>',
  '          <FormField label="Address" {...register(\'address\')} error={errors.address?.message} required />',
  '          <div className="grid grid-cols-2 gap-4">',
  '            <FormField label="City" {...register(\'city\')} error={errors.city?.message} required />',
  '            <FormField label="Province" {...register(\'province\')} error={errors.province?.message} required />',
  '          </div>',
  '          <div className="grid grid-cols-2 gap-4">',
  '            <FormField label="Contact Person" {...register(\'contact_person\')} error={errors.contact_person?.message} required />',
  '            <FormField label="Phone" {...register(\'contact_phone\')} error={errors.contact_phone?.message} required />',
  '          </div>',
  '          <FormField label="Email" type="email" {...register(\'contact_email\')} error={errors.contact_email?.message} />',
  '          <div className="grid grid-cols-2 gap-4">',
  '            <FormField label="MID" {...register(\'mid\')} />',
  '            <FormField label="TID" {...register(\'tid\')} />',
  '          </div>',
  '          <FormField label="Notes" {...register(\'notes\')} />',
  '          ',
  '          <div className="flex gap-3 pt-4">',
  '            <Button type="submit" className="flex-1">{editingMerchant ? \'Update\' : \'Create\'}</Button>',
  '            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>',
  '          </div>',
  '        </form>',
  '      </Modal>',
  '    </div>',
  '  );',
  '};',
];

writeFile('src/app/(dashboard)/merchants/merchants-client.tsx', merchantsClientLines.join('\n'));

const merchantsApiLines = [
  'import { NextRequest, NextResponse } from \'next/server\';',
  'import { createClient } from \'@/lib/supabase/server\';',
  '',
  'export async function GET() {',
  '  try {',
  '    const supabase = await createClient();',
  '    const { data, error } = await supabase',
  '      .from(\'merchants\')',
  '      .select(\'*\')',
  '      .order(\'created_at\', { ascending: false });',
  '',
  '    if (error) throw error;',
  '    return NextResponse.json(data || []);',
  '  } catch (error) {',
  '    return NextResponse.json({ error: \'Failed to fetch merchants\' }, { status: 500 });',
  '  }',
  '}',
  '',
  'export async function POST(request: NextRequest) {',
  '  try {',
  '    const supabase = await createClient();',
  '    const body = await request.json();',
  '    ',
  '    const { data, error } = await supabase',
  '      .from(\'merchants\')',
  '      .insert(body)',
  '      .select()',
  '      .single();',
  '',
  '    if (error) throw error;',
  '    return NextResponse.json(data, { status: 201 });',
  '  } catch (error) {',
  '    return NextResponse.json({ error: \'Failed to create merchant\' }, { status: 400 });',
  '  }',
  '}',
];

writeFile('src/app/api/merchants/route.ts', merchantsApiLines.join('\n'));

const merchantsIdApiLines = [
  'import { NextRequest, NextResponse } from \'next/server\';',
  'import { createClient } from \'@/lib/supabase/server\';',
  '',
  'export async function PUT(',
  '  request: NextRequest,',
  '  { params }: { params: { id: string } }',
  ') {',
  '  try {',
  '    const supabase = await createClient();',
  '    const body = await request.json();',
  '    ',
  '    const { data, error } = await supabase',
  '      .from(\'merchants\')',
  '      .update(body)',
  '      .eq(\'id\', params.id)',
  '      .select()',
  '      .single();',
  '',
  '    if (error) throw error;',
  '    return NextResponse.json(data);',
  '  } catch (error) {',
  '    return NextResponse.json({ error: \'Failed to update merchant\' }, { status: 400 });',
  '  }',
  '}',
  '',
  'export async function DELETE(',
  '  request: NextRequest,',
  '  { params }: { params: { id: string } }',
  ') {',
  '  try {',
  '    const supabase = await createClient();',
  '    ',
  '    const { error } = await supabase',
  '      .from(\'merchants\')',
  '      .delete()',
  '      .eq(\'id\', params.id);',
  '',
  '    if (error) throw error;',
  '    return NextResponse.json({ message: \'Merchant deleted\' });',
  '  } catch (error) {',
  '    return NextResponse.json({ error: \'Failed to delete merchant\' }, { status: 400 });',
  '  }',
  '}',
];

writeFile('src/app/api/merchants/[id]/route.ts', merchantsIdApiLines.join('\n'));

// ============================================
// README.MD
// ============================================
const readmeLines = [
  '#  AssetPilot - EDC Asset Management System',
  '',
  'Enterprise Asset Lifecycle Management System untuk mengelola aset EDC dari instalasi hingga pengembalian ke gudang.',
  '',
  '##  Tech Stack',
  '',
  '- **Frontend**: Next.js 14, TypeScript, Material UI, Tailwind CSS',
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
  '4. Jalankan file migration secara berurutan dari folder `supabase/migrations/`',
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
  '---',
  '',
  '**Built with ❤️ by AssetPilot Team**',
];

writeFile('README.md', readmeLines.join('\n'));

// ============================================
// INSTALL SCRIPTS
// ============================================
const installBatLines = [
  '@echo off',
  'echo Installing AssetPilot dependencies...',
  'echo.',
  'call npm install',
  'echo.',
  'echo Installation complete!',
  'echo.',
  'echo Next steps:',
  'echo 1. Copy .env.example to .env.local and fill with your Supabase credentials',
  'echo 2. Run SQL migrations in Supabase SQL Editor',
  'echo 3. Run npm run dev to start development server',
  'echo.',
  'pause',
];

writeFile('install.bat', installBatLines.join('\r\n'));

const installShLines = [
  '#!/bin/bash',
  'echo "Installing AssetPilot dependencies..."',
  'echo ""',
  'npm install',
  'echo ""',
  'echo "Installation complete!"',
  'echo ""',
  'echo "Next steps:"',
  'echo "1. Copy .env.example to .env.local"',
  'echo "2. Run SQL migrations in Supabase SQL Editor"',
  'echo "3. Run npm run dev to start development server"',
];

writeFile('install.sh', installShLines.join('\n'));

// ============================================
// FINAL MESSAGE
// ============================================
console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   ✅  ASSETPILOT SETUP COMPLETE!                         ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('\n');
console.log('📦 Files created successfully!');
console.log('\n');
console.log('🚀 NEXT STEPS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('1. Install dependencies:');
console.log('   Windows:  install.bat');
console.log('   Mac/Linux: chmod +x install.sh && ./install.sh');
console.log('   Or: npm install --legacy-peer-deps');
console.log('');
console.log('2. Setup Supabase:');
console.log('   - Create project at https://supabase.com');
console.log('   - Copy .env.example to .env.local');
console.log('   - Fill in your Supabase credentials');
console.log('');
console.log('3. Run SQL Migrations:');
console.log('   - Open Supabase SQL Editor');
console.log('   - Run files in supabase/migrations/ sequentially (001 to 014)');
console.log('   - Optional: Run supabase/seed.sql for sample data');
console.log('');
console.log('4. Create Storage Buckets:');
console.log('   - Go to Supabase → Storage');
console.log('   - Create buckets: assets, photos, signatures (all public)');
console.log('');
console.log('5. Create Admin User:');
console.log('   - Supabase → Authentication → Add User');
console.log('   - Update role to "administrator" in profiles table');
console.log('');
console.log('6. Start Development Server:');
console.log('   npm run dev');
console.log('');
console.log('7. Open browser:');
console.log('   http://localhost:3000');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('📖 Check README.md for detailed documentation');
console.log('');