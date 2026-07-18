// setup.js - AssetPilot Auto Setup Script
const fs = require('fs');
const path = require('path');

// Helper: Create directory recursively
function mkdirp(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created: ${dirPath}`);
  }
}

// Helper: Write file with content
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  mkdirp(dir);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`✅ Created: ${filePath}`);
}

console.log('🚀 Starting AssetPilot Setup...\n');

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
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "@mui/material": "^6.0.0",
    "@mui/icons-material": "^6.0.0",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "recharts": "^2.12.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.23.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "@zxing/browser": "^0.1.0",
    "qrcode": "^1.5.0",
    "xlsx": "^0.18.0",
    "jspdf": "^2.5.0",
    "jspdf-autotable": "^3.8.0",
    "sonner": "^1.5.0",
    "next-themes": "^0.3.0",
    "zustand": "^4.5.0",
    "swr": "^2.2.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.5.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0",
    "prettier": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}`);

// ============================================
// NEXT.CONFIG.TS
// ============================================
writeFile('next.config.ts', `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'recharts'],
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
    "strict": true,
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
writeFile('postcss.config.mjs', `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;`);

// ============================================
// .ENV.EXAMPLE
// ============================================
writeFile('.env.example', `# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AssetPilot`);

// ============================================
// .ENV.LOCAL
// ============================================
writeFile('.env.local', `# Copy from .env.example and fill with your values
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=`);

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
writeFile('src/app/globals.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }

  body {
    @apply bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white;
  }
}

@layer utilities {
  .glass-effect {
    @apply bg-white/70 backdrop-blur-md border border-white/20;
  }

  .dark .glass-effect {
    @apply bg-gray-900/70 backdrop-blur-md border border-gray-700/20;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .animate-slide-up {
    animation: slideUp 0.5s ease-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { @apply bg-gray-100 dark:bg-gray-800; }
::-webkit-scrollbar-thumb { @apply bg-gray-300 dark:bg-gray-600 rounded-full; }
::-webkit-scrollbar-thumb:hover { @apply bg-gray-400 dark:bg-gray-500; }`);

// ============================================
// ROOT LAYOUT
// ============================================
writeFile('src/app/layout.tsx', `import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AssetPilot - EDC Asset Management System',
  description: 'Enterprise Asset Lifecycle Management System',
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`);

// ============================================
// MIDDLEWARE
// ============================================
writeFile('src/middleware.ts', `import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};`);

// ============================================
// SUPABASE CLIENTS
// ============================================
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

// ============================================
// UTILS
// ============================================
writeFile('src/lib/utils/cn.ts', `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`);

writeFile('src/lib/utils/constants.ts', `export const APP_NAME = 'AssetPilot';
export const APP_TAGLINE = 'Enterprise Asset Lifecycle Management System';

export const USER_ROLES = {
  ADMINISTRATOR: 'administrator',
  WAREHOUSE: 'warehouse',
  TECHNICIAN: 'technician',
  SUPERVISOR: 'supervisor',
  MANAGEMENT: 'management',
} as const;

export const ASSET_TYPES = {
  EDC: 'edc', SIM_CARD: 'sim_card', SAM_CARD: 'sam_card',
  BATTERY: 'battery', ADAPTER: 'adapter', PRINTER: 'printer',
  SCANNER: 'scanner', OTHER_DEVICE: 'other_device',
} as const;

export const ASSET_STATUS = {
  READY_STOCK: 'ready_stock', DEPLOYED: 'deployed', ON_TECHNICIAN: 'on_technician',
  IN_TRANSIT: 'in_transit', IN_QC: 'in_qc', IN_REPAIR: 'in_repair',
  SCRAP: 'scrap', LOST: 'lost', RETURNED: 'returned',
} as const;

export const ASSET_CONDITION = {
  GOOD: 'good', MINOR_DAMAGE: 'minor_damage', MAJOR_DAMAGE: 'major_damage',
  BROKEN: 'broken', REPAIR_REQUIRED: 'repair_required', SCRAP: 'scrap',
} as const;

export const WORK_ORDER_STATUS = {
  PENDING: 'pending', ASSIGNED: 'assigned', IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed', CANCELLED: 'cancelled', ON_HOLD: 'on_hold',
} as const;`);

writeFile('src/lib/utils/format.ts', `import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (date: Date | string, formatStr: string = 'dd MMM yyyy') => {
  return format(new Date(date), formatStr, { locale: id });
};

export const formatDateTime = (date: Date | string) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: id });
};

export const formatRelativeTime = (date: Date | string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
};`);

// ============================================
// PERMISSIONS
// ============================================
writeFile('src/lib/utils/permissions.ts', `import type { UserRole, ModulePermissions } from '@/lib/types/user.types';

const FULL_ACCESS = { canView: true, canCreate: true, canUpdate: true, canDelete: true, canExport: true };
const READ_ONLY = { canView: true, canCreate: false, canUpdate: false, canDelete: false, canExport: true };
const NO_ACCESS = { canView: false, canCreate: false, canUpdate: false, canDelete: false, canExport: false };

export const ROLE_PERMISSIONS: Record<UserRole, ModulePermissions> = {
  administrator: {
    dashboard: FULL_ACCESS, users: FULL_ACCESS, merchants: FULL_ACCESS,
    technicians: FULL_ACCESS, assets: FULL_ACCESS, warehouses: FULL_ACCESS,
    workOrders: FULL_ACCESS, withdrawals: FULL_ACCESS, receives: FULL_ACCESS,
    qc: FULL_ACCESS, repairs: FULL_ACCESS, stock: FULL_ACCESS,
    reports: FULL_ACCESS, logs: FULL_ACCESS, settings: FULL_ACCESS,
  },
  supervisor: {
    dashboard: FULL_ACCESS, users: READ_ONLY, merchants: FULL_ACCESS,
    technicians: FULL_ACCESS, assets: FULL_ACCESS, warehouses: FULL_ACCESS,
    workOrders: FULL_ACCESS, withdrawals: FULL_ACCESS, receives: FULL_ACCESS,
    qc: FULL_ACCESS, repairs: FULL_ACCESS, stock: FULL_ACCESS,
    reports: FULL_ACCESS, logs: READ_ONLY, settings: READ_ONLY,
  },
  warehouse: {
    dashboard: READ_ONLY, users: NO_ACCESS, merchants: READ_ONLY,
    technicians: READ_ONLY, assets: FULL_ACCESS, warehouses: FULL_ACCESS,
    workOrders: READ_ONLY, withdrawals: READ_ONLY, receives: FULL_ACCESS,
    qc: FULL_ACCESS, repairs: READ_ONLY, stock: FULL_ACCESS,
    reports: READ_ONLY, logs: NO_ACCESS, settings: NO_ACCESS,
  },
  technician: {
    dashboard: READ_ONLY, users: NO_ACCESS, merchants: READ_ONLY,
    technicians: READ_ONLY, assets: READ_ONLY, warehouses: READ_ONLY,
    workOrders: { canView: true, canCreate: false, canUpdate: true, canDelete: false, canExport: false },
    withdrawals: { canView: true, canCreate: true, canUpdate: true, canDelete: false, canExport: false },
    receives: READ_ONLY, qc: READ_ONLY,
    repairs: { canView: true, canCreate: true, canUpdate: true, canDelete: false, canExport: false },
    stock: READ_ONLY, reports: NO_ACCESS, logs: NO_ACCESS, settings: NO_ACCESS,
  },
  management: {
    dashboard: FULL_ACCESS, users: READ_ONLY, merchants: READ_ONLY,
    technicians: READ_ONLY, assets: READ_ONLY, warehouses: READ_ONLY,
    workOrders: READ_ONLY, withdrawals: READ_ONLY, receives: READ_ONLY,
    qc: READ_ONLY, repairs: READ_ONLY, stock: READ_ONLY,
    reports: FULL_ACCESS, logs: READ_ONLY, settings: READ_ONLY,
  },
};

export const hasPermission = (role: UserRole, module: keyof ModulePermissions, action: keyof typeof FULL_ACCESS): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions[module][action];
};`);

// ============================================
// TYPES
// ============================================
writeFile('src/lib/types/common.types.ts', `export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}`);

writeFile('src/lib/types/user.types.ts', `export type UserRole = 'administrator' | 'warehouse' | 'technician' | 'supervisor' | 'management';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}

export interface UserUpdate {
  full_name?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface RolePermission {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canExport: boolean;
}

export interface ModulePermissions {
  dashboard: RolePermission;
  users: RolePermission;
  merchants: RolePermission;
  technicians: RolePermission;
  assets: RolePermission;
  warehouses: RolePermission;
  workOrders: RolePermission;
  withdrawals: RolePermission;
  receives: RolePermission;
  qc: RolePermission;
  repairs: RolePermission;
  stock: RolePermission;
  reports: RolePermission;
  logs: RolePermission;
  settings: RolePermission;
}`);

writeFile('src/lib/types/dashboard.types.ts', `export interface DashboardStats {
  outstandingWO: number;
  assetOnTechnician: number;
  lateReturn: number;
  receivedToday: number;
  inRepair: number;
  readyStock: number;
  scrap: number;
  warehouseStock: number;
}

export interface MonthlyChartData {
  month: string;
  withdrawals: number;
  receives: number;
  repairs: number;
}

export interface TopTechnician {
  id: string;
  name: string;
  avatar_url?: string;
  completedWO: number;
  avgResponseTime: number;
  rating: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_name: string;
  user_avatar?: string;
  timestamp: string;
  description: string;
}`);

// ============================================
// HOOKS
// ============================================
writeFile('src/lib/hooks/use-auth.ts', `'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/lib/types/user.types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          setUser(currentUser);
          const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
          setProfile(data as UserProfile);
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(data as UserProfile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return { user, profile, loading, signOut };
};`);

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
writeFile('src/components/providers/auth-provider.tsx', `'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import type { UserProfile } from '@/lib/types/user.types';
import type { User } from '@supabase/supabase-js';

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};`);

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
writeFile('src/components/ui/button.tsx', `'use client';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { cn } from '@/lib/utils/cn';
import { forwardRef } from 'react';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text' | 'glass';
  size?: 'small' | 'medium' | 'large';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'contained', size = 'medium', children, ...props }, ref) => {
    const variantStyles = {
      contained: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md',
      outlined: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
      text: 'text-primary-600 hover:bg-primary-50',
      glass: 'bg-white/70 backdrop-blur-md border border-white/20 text-gray-900',
    };
    const sizeStyles = { small: 'px-3 py-1.5 text-sm', medium: 'px-4 py-2 text-base', large: 'px-6 py-3 text-lg' };
    return (
      <MuiButton ref={ref} className={cn('font-medium rounded-lg transition-all', variantStyles[variant], sizeStyles[size], className)} disableElevation {...props}>
        {children}
      </MuiButton>
    );
  }
);
Button.displayName = 'Button';`);

writeFile('src/components/ui/card.tsx', `'use client';
import { cn } from '@/lib/utils/cn';
import { forwardRef, HTMLAttributes } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'glass' }>(
  ({ className, variant = 'default', children, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-2xl p-6 transition-all', variant === 'glass' ? 'bg-white/70 backdrop-blur-md border border-white/20 shadow-md' : 'bg-white shadow-md dark:bg-gray-800', className)} {...props}>
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('mb-4', className)} {...props}>{children}</div>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-xl font-semibold text-gray-900 dark:text-white', className)} {...props}>{children}</h3>
));
CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props}>{children}</div>
));
CardContent.displayName = 'CardContent';`);

writeFile('src/components/ui/skeleton.tsx', `'use client';
import { cn } from '@/lib/utils/cn';

export const Skeleton = ({ className, variant = 'text', width, height }: any) => {
  const variants = { text: 'h-4 rounded', circular: 'rounded-full', rectangular: 'rounded-lg' };
  return <div className={cn('bg-gray-200 dark:bg-gray-700 animate-pulse', variants[variant], className)} style={{ width, height }} />;
};`);

writeFile('src/components/ui/badge.tsx', `'use client';
import { cn } from '@/lib/utils/cn';
import { ReactNode } from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'info'; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm', lg: 'px-3 py-1.5 text-base' };
  return <span className={cn('inline-flex items-center font-medium rounded-full', variants[variant], sizes[size], className)}>{children}</span>;
};`);

writeFile('src/components/ui/modal.tsx', `'use client';
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean; onClose: () => void; title?: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl', sizes[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};`);

// ============================================
// FORM COMPONENTS
// ============================================
writeFile('src/components/forms/form-field.tsx', `'use client';
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string; error?: string; icon?: LucideIcon;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon: Icon, className, ...props }, ref) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}{props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon size={20} /></div>}
        <input ref={ref} className={cn('w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500', Icon && 'pl-10', error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600', className)} {...props} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
);
FormField.displayName = 'FormField';`);

writeFile('src/components/forms/form-select.tsx', `'use client';
import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface Option { value: string; label: string; }
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string; options: Option[]; error?: string; placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, placeholder, className, ...props }, ref) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}{props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select ref={ref} className={cn('w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500', error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600', className)} {...props}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
);
FormSelect.displayName = 'FormSelect';`);

// ============================================
// LAYOUT COMPONENTS
// ============================================
writeFile('src/components/layout/sidebar.tsx', `'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { LayoutDashboard, Users, Store, Wrench, Package, Warehouse, ClipboardList, ArrowUpFromLine, ArrowDownToLine, CheckCircle, Hammer, Boxes, FileText, Settings, ScrollText, X } from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/merchants', label: 'Merchants', icon: Store },
  { href: '/technicians', label: 'Technicians', icon: Wrench },
  { href: '/assets', label: 'Assets', icon: Package },
  { href: '/warehouses', label: 'Warehouses', icon: Warehouse },
  { href: '/work-orders', label: 'Work Orders', icon: ClipboardList },
  { href: '/withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine },
  { href: '/receives', label: 'Receives', icon: ArrowDownToLine },
  { href: '/qc', label: 'Quality Check', icon: CheckCircle },
  { href: '/repairs', label: 'Repairs', icon: Hammer },
  { href: '/stock', label: 'Stock', icon: Boxes },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/logs', label: 'Logs', icon: ScrollText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const pathname = usePathname();
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn('fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary-600">AssetPilot</h1>
          <button onClick={onClose} className="lg:hidden text-gray-500"><X size={20} /></button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={onClose} className={cn('flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors', isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700')}>
                <Icon size={20} /><span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};`);

writeFile('src/components/layout/header.tsx', `'use client';
import { useState } from 'react';
import { Menu, Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500"><Menu size={24} /></button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><Bell size={20} /></button>
          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><User size={20} /></button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};`);

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

writeFile('src/app/(auth)/login/page.tsx', `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password min 6 chars'),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
      if (error) { toast.error(error.message); return; }
      toast.success('Login successful!');
      router.push('/');
      router.refresh();
    } finally { setLoading(false); }
  };

  return (
    <Card variant="glass" className="animate-slide-up">
      <CardContent>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input {...register('email')} type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input {...register('password')} type="password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" placeholder="••••••••" />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
          <div className="text-center"><Link href="/forgot-password" className="text-sm text-primary-600">Forgot password?</Link></div>
        </form>
      </CardContent>
    </Card>
  );
}`);

// ============================================
// DASHBOARD LAYOUT
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

writeFile('src/app/(dashboard)/page.tsx', `import { Metadata } from 'next';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { DashboardCharts } from '@/components/dashboard/dashboard-charts';
import { TopTechnicians } from '@/components/dashboard/top-technicians';
import { RecentActivities } from '@/components/dashboard/recent-activities';

export const metadata: Metadata = { title: 'Dashboard - AssetPilot' };

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to AssetPilot</p>
      </div>
      <DashboardStats />
      <DashboardCharts />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopTechnicians />
        <RecentActivities />
      </div>
    </div>
  );
}`);

// ============================================
// DASHBOARD COMPONENTS
// ============================================
writeFile('src/components/dashboard/stat-card.tsx', `'use client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'blue', loading = false }: any) => {
  const colors: any = {
    blue: 'bg-blue-500', green: 'bg-green-500', red: 'bg-red-500',
    yellow: 'bg-yellow-500', purple: 'bg-purple-500', orange: 'bg-orange-500',
  };
  if (loading) return <Card variant="glass"><Skeleton className="h-24 w-full" /></Card>;
  return (
    <Card variant="glass" className="hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
          {trend && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
              {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', colors[color])}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
};`);

writeFile('src/components/dashboard/dashboard-stats.tsx', `'use client';
import { useEffect, useState } from 'react';
import { StatCard } from './stat-card';
import { ClipboardList, Package, AlertTriangle, CheckCircle, Hammer, Boxes, Trash2, Warehouse } from 'lucide-react';

export const DashboardStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats').then(r => r.ok ? r.json() : null).then(d => { if (d) setStats(d); }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard title="Outstanding WO" value={stats?.outstandingWO || 0} icon={ClipboardList} color="blue" loading={loading} />
      <StatCard title="Asset On Technician" value={stats?.assetOnTechnician || 0} icon={Package} color="purple" loading={loading} />
      <StatCard title="Late Return" value={stats?.lateReturn || 0} icon={AlertTriangle} color="red" loading={loading} />
      <StatCard title="Received Today" value={stats?.receivedToday || 0} icon={CheckCircle} color="green" loading={loading} />
      <StatCard title="In Repair" value={stats?.inRepair || 0} icon={Hammer} color="orange" loading={loading} />
      <StatCard title="Ready Stock" value={stats?.readyStock || 0} icon={Boxes} color="green" loading={loading} />
      <StatCard title="Scrap" value={stats?.scrap || 0} icon={Trash2} color="red" loading={loading} />
      <StatCard title="Warehouse Stock" value={stats?.warehouseStock || 0} icon={Warehouse} color="blue" loading={loading} />
    </div>
  );
};`);

writeFile('src/components/dashboard/dashboard-charts.tsx', `'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DashboardCharts = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/monthly').then(r => r.ok ? r.json() : []).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Card><Skeleton className="h-80 w-full" /></Card><Card><Skeleton className="h-80 w-full" /></Card></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card variant="glass">
        <CardHeader><CardTitle>Monthly Transactions</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="withdrawals" stroke="#3b82f6" strokeWidth={2} name="Withdrawals" />
              <Line type="monotone" dataKey="receives" stroke="#10b981" strokeWidth={2} name="Receives" />
              <Line type="monotone" dataKey="repairs" stroke="#f59e0b" strokeWidth={2} name="Repairs" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card variant="glass">
        <CardHeader><CardTitle>Transaction Comparison</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip /><Legend />
              <Bar dataKey="withdrawals" fill="#3b82f6" name="Withdrawals" radius={[8, 8, 0, 0]} />
              <Bar dataKey="receives" fill="#10b981" name="Receives" radius={[8, 8, 0, 0]} />
              <Bar dataKey="repairs" fill="#f59e0b" name="Repairs" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};`);

writeFile('src/components/dashboard/top-technicians.tsx', `'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Clock, Star } from 'lucide-react';

export const TopTechnicians = () => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/top-technicians').then(r => r.ok ? r.json() : []).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Card><Skeleton className="h-64 w-full" /></Card>;

  return (
    <Card variant="glass">
      <CardHeader><CardTitle>Top Technicians</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {technicians.map((tech, index) => (
            <div key={tech.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">{tech.name.charAt(0)}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{tech.name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Award size={14} />{tech.completedWO} WO</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{tech.avgResponseTime}m</span>
                  <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-500 text-yellow-500" />{tech.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary-600">#{index + 1}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};`);

writeFile('src/components/dashboard/recent-activities.tsx', `'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRelativeTime } from '@/lib/utils/format';

export const RecentActivities = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/recent-activities').then(r => r.ok ? r.json() : []).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Card><Skeleton className="h-64 w-full" /></Card>;

  return (
    <Card variant="glass">
      <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">{activity.user_name.charAt(0)}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white"><span className="font-semibold">{activity.user_name}</span> {activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(activity.timestamp)}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && <div className="text-center py-8 text-gray-500">No recent activities</div>}
        </div>
      </CardContent>
    </Card>
  );
};`);

// ============================================
// DATA TABLE
// ============================================
writeFile('src/components/data-display/data-table.tsx', `'use client';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableSortLabel, Checkbox, IconButton, Tooltip } from '@mui/material';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Column<T> {
  id: string; label: string; minWidth?: number; align?: 'left' | 'right' | 'center';
  sortable?: boolean; render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[]; data: T[]; totalCount: number;
  page: number; pageSize: number;
  onPageChange: (page: number) => void; onPageSizeChange: (size: number) => void;
  onEdit?: (row: T) => void; onDelete?: (row: T) => void; onView?: (row: T) => void;
  loading?: boolean; emptyMessage?: string; actions?: boolean;
}

export function DataTable<T extends { id: string }>({ columns, data, totalCount, page, pageSize, onPageChange, onPageSizeChange, onEdit, onDelete, onView, loading, emptyMessage = 'No data', actions = true }: DataTableProps<T>) {
  if (loading) return <Card><div className="p-6 space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div></Card>;

  return (
    <Card variant="glass">
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>
                  {col.sortable ? <TableSortLabel>{col.label}</TableSortLabel> : col.label}
                </TableCell>
              ))}
              {actions && <TableCell align="center" style={{ minWidth: 150 }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" className="py-12 text-gray-500">{emptyMessage}</TableCell></TableRow>
            ) : data.map((row) => (
              <TableRow key={row.id} hover className="cursor-pointer">
                {columns.map((col) => {
                  const value = (row as any)[col.id];
                  return <TableCell key={col.id} align={col.align}>{col.render ? col.render(value, row) : value}</TableCell>;
                })}
                {actions && (
                  <TableCell align="center">
                    <div className="flex items-center justify-center gap-1">
                      {onView && <Tooltip title="View"><IconButton size="small" onClick={() => onView(row)} className="text-blue-600"><Eye size={18} /></IconButton></Tooltip>}
                      {onEdit && <Tooltip title="Edit"><IconButton size="small" onClick={() => onEdit(row)} className="text-green-600"><Edit size={18} /></IconButton></Tooltip>}
                      {onDelete && <Tooltip title="Delete"><IconButton size="small" onClick={() => onDelete(row)} className="text-red-600"><Trash2 size={18} /></IconButton></Tooltip>}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={totalCount} page={page - 1} onPageChange={(_, p) => onPageChange(p + 1)} rowsPerPage={pageSize} onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value))} rowsPerPageOptions={[10, 25, 50, 100]} />
    </Card>
  );
}`);

// ============================================
// USERS PAGE
// ============================================
writeFile('src/app/(dashboard)/users/page.tsx', `import { Metadata } from 'next';
import { UsersClient } from './users-client';
export const metadata: Metadata = { title: 'Users - AssetPilot' };
export default function UsersPage() { return <UsersClient />; }`);

writeFile('src/app/(dashboard)/users/users-client.tsx', `'use client';
import { useEffect, useState, useCallback } from 'react';
import { DataTable } from '@/components/data-display/data-table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/forms/form-field';
import { FormSelect } from '@/components/forms/form-select';
import { useToast } from '@/lib/hooks/use-toast';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Plus, Search, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { UserProfile } from '@/lib/types/user.types';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).optional(),
  full_name: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(['administrator', 'warehouse', 'technician', 'supervisor', 'management']),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

export const UsersClient = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(userSchema) });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
      if (debouncedSearch) params.append('search', debouncedSearch);
      const response = await fetch(\`/api/users?\${params}\`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
        setTotalCount(data.total);
      }
    } finally { setLoading(false); }
  }, [page, pageSize, debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = () => { setEditingUser(null); reset(); setIsModalOpen(true); };
  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    reset({ email: user.email, full_name: user.full_name, phone: user.phone, role: user.role, status: user.status });
    setIsModalOpen(true);
  };
  const handleDelete = async (user: UserProfile) => {
    if (!confirm(\`Delete \${user.full_name}?\`)) return;
    try {
      const response = await fetch(\`/api/users/\${user.id}\`, { method: 'DELETE' });
      if (response.ok) { toast.success('Deleted'); fetchUsers(); }
      else toast.error('Failed');
    } catch { toast.error('Failed'); }
  };

  const onSubmit = async (data: any) => {
    try {
      const url = editingUser ? \`/api/users/\${editingUser.id}\` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      const payload = editingUser ? { ...data, password: undefined } : data;
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (response.ok) { toast.success(editingUser ? 'Updated' : 'Created'); setIsModalOpen(false); fetchUsers(); }
      else toast.error('Failed');
    } catch { toast.error('Failed'); }
  };

  const columns = [
    { id: 'full_name', label: 'Name', sortable: true, render: (v: string, r: UserProfile) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">{v.charAt(0)}</div>
        <div><div className="font-medium">{v}</div><div className="text-sm text-gray-500">{r.email}</div></div>
      </div>
    )},
    { id: 'role', label: 'Role', sortable: true, render: (v: string) => <Badge variant={v === 'administrator' ? 'error' : v === 'supervisor' ? 'warning' : 'info'}>{v}</Badge> },
    { id: 'status', label: 'Status', sortable: true, render: (v: string) => <Badge variant={v === 'active' ? 'success' : v === 'inactive' ? 'warning' : 'error'}>{v}</Badge> },
    { id: 'phone', label: 'Phone' },
    { id: 'created_at', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
  ];

  const roleOptions = [
    { value: 'administrator', label: 'Administrator' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'technician', label: 'Technician' },
    { value: 'management', label: 'Management' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Users</h1><p className="text-gray-600 mt-1">Manage system users</p></div>
        <Button onClick={handleCreate} className="gap-2"><Plus size={20} />Add User</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
        </div>
      </div>
      <DataTable columns={columns} data={users} totalCount={totalCount} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Create User'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Full Name" {...register('full_name')} error={errors.full_name?.message} required />
          <FormField label="Email" type="email" {...register('email')} error={errors.email?.message} required disabled={!!editingUser} />
          {!editingUser && <FormField label="Password" type="password" {...register('password')} error={errors.password?.message} required />}
          <FormField label="Phone" {...register('phone')} />
          <FormSelect label="Role" options={roleOptions} {...register('role')} required />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingUser ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};`);

// ============================================
// API ROUTES
// ============================================
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

writeFile('src/app/api/users/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = request.nextUrl.searchParams;
    const page = parseInt(params.get('page') || '1');
    const pageSize = parseInt(params.get('pageSize') || '10');
    const search = params.get('search');

    let query = supabase.from('profiles').select('*', { count: 'exact' });
    if (search) query = query.or(\`full_name.ilike.%\${search}%,email.ilike.%\${search}%\`);

    const from = (page - 1) * pageSize;
    const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, from + pageSize - 1);

    if (error) throw error;
    return NextResponse.json({ data, total: count || 0, page, pageSize, totalPages: Math.ceil((count || 0) / pageSize) });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const adminClient = createAdminClient();

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: body.email, password: body.password, email_confirm: true,
      user_metadata: { full_name: body.full_name, role: body.role },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    const { data: profileData, error: profileError } = await adminClient
      .from('profiles').update({ full_name: body.full_name, phone: body.phone, role: body.role })
      .eq('id', authData.user.id).select().single();

    if (profileError) throw profileError;
    return NextResponse.json(profileData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 400 });
  }
}`);

writeFile('src/app/api/users/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.from('profiles').update(body).eq('id', params.id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.deleteUser(params.id);
    if (error) throw error;
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 });
  }
}`);

// ============================================
// SQL MIGRATIONS
// ============================================
writeFile('supabase/migrations/001_create_auth_tables.sql', `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('administrator', 'warehouse', 'technician', 'supervisor', 'management');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'technician',
  status user_status NOT NULL DEFAULT 'active',
  avatar_url TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'technician'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();`);

writeFile('supabase/migrations/002_create_merchants_tables.sql', `CREATE TABLE public.merchants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_name TEXT NOT NULL,
  merchant_code TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  country TEXT DEFAULT 'Indonesia',
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  mid TEXT, tid TEXT, mcc TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON public.merchants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_merchants_merchant_code ON public.merchants(merchant_code);
CREATE INDEX idx_merchants_city ON public.merchants(city);
CREATE INDEX idx_merchants_status ON public.merchants(status);`);

writeFile('supabase/migrations/003_create_technicians_tables.sql', `CREATE TABLE public.technicians (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  specialization TEXT,
  service_area TEXT,
  phone TEXT NOT NULL,
  emergency_contact TEXT,
  join_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  current_location_lat DECIMAL(10, 8),
  current_location_lng DECIMAL(11, 8),
  last_location_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON public.technicians FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_technicians_employee_id ON public.technicians(employee_id);
CREATE INDEX idx_technicians_status ON public.technicians(status);`);

writeFile('supabase/migrations/004_create_warehouses_tables.sql', `CREATE TABLE public.warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_name TEXT NOT NULL,
  warehouse_code TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  country TEXT DEFAULT 'Indonesia',
  phone TEXT, email TEXT, capacity INTEGER,
  manager_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON public.warehouses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_warehouses_warehouse_code ON public.warehouses(warehouse_code);
CREATE INDEX idx_warehouses_city ON public.warehouses(city);`);

writeFile('supabase/migrations/005_create_assets_tables.sql', `CREATE TYPE asset_type AS ENUM ('edc', 'sim_card', 'sam_card', 'battery', 'adapter', 'printer', 'scanner', 'other_device');
CREATE TYPE asset_status AS ENUM ('ready_stock', 'deployed', 'on_technician', 'in_transit', 'in_qc', 'in_repair', 'scrap', 'lost', 'returned');
CREATE TYPE asset_condition AS ENUM ('good', 'minor_damage', 'major_damage', 'broken', 'repair_required', 'scrap');

CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id TEXT UNIQUE NOT NULL,
  asset_type asset_type NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  barcode TEXT UNIQUE,
  qr_code TEXT UNIQUE,
  status asset_status NOT NULL DEFAULT 'ready_stock',
  condition asset_condition DEFAULT 'good',
  current_holder_id UUID REFERENCES public.profiles(id),
  current_holder_type TEXT CHECK (current_holder_type IN ('merchant', 'technician', 'warehouse')),
  warehouse_id UUID REFERENCES public.warehouses(id),
  merchant_id UUID REFERENCES public.merchants(id),
  purchase_date DATE,
  purchase_cost DECIMAL(12, 2),
  warranty_expiry DATE,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_assets_asset_id ON public.assets(asset_id);
CREATE INDEX idx_assets_serial_number ON public.assets(serial_number);
CREATE INDEX idx_assets_barcode ON public.assets(barcode);
CREATE INDEX idx_assets_status ON public.assets(status);
CREATE INDEX idx_assets_warehouse_id ON public.assets(warehouse_id);
CREATE INDEX idx_assets_merchant_id ON public.assets(merchant_id);`);

writeFile('supabase/migrations/006_create_work_orders_tables.sql', `CREATE TYPE work_order_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'on_hold');
CREATE TYPE case_type AS ENUM ('installation', 'replacement', 'maintenance', 'repair', 'withdrawal', 'inspection');

CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wo_number TEXT UNIQUE NOT NULL,
  reference_number TEXT,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id),
  technician_id UUID REFERENCES public.technicians(id),
  supervisor_id UUID REFERENCES public.profiles(id),
  service_point TEXT,
  target_date DATE NOT NULL,
  response_date DATE,
  completion_date DATE,
  description TEXT NOT NULL,
  activity TEXT,
  case_type case_type NOT NULL,
  product TEXT, serial_number TEXT, sim_number TEXT,
  status work_order_status NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON public.work_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_work_orders_wo_number ON public.work_orders(wo_number);
CREATE INDEX idx_work_orders_merchant_id ON public.work_orders(merchant_id);
CREATE INDEX idx_work_orders_technician_id ON public.work_orders(technician_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);`);

writeFile('supabase/migrations/007_create_withdrawals_tables.sql', `CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  withdrawal_number TEXT UNIQUE NOT NULL,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id),
  technician_id UUID NOT NULL REFERENCES public.technicians(id),
  merchant_id UUID NOT NULL REFERENCES public.merchants(id),
  asset_id UUID NOT NULL REFERENCES public.assets(id),
  sim_card_id UUID REFERENCES public.assets(id),
  edc_barcode TEXT NOT NULL,
  sim_barcode TEXT,
  photo_front_url TEXT, photo_back_url TEXT, photo_serial_url TEXT, photo_merchant_url TEXT,
  gps_latitude DECIMAL(10, 8) NOT NULL,
  gps_longitude DECIMAL(11, 8) NOT NULL,
  gps_address TEXT,
  google_maps_link TEXT,
  merchant_signature_url TEXT NOT NULL,
  remarks TEXT,
  withdrawal_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON public.withdrawals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_withdrawals_withdrawal_number ON public.withdrawals(withdrawal_number);
CREATE INDEX idx_withdrawals_work_order_id ON public.withdrawals(work_order_id);
CREATE INDEX idx_withdrawals_technician_id ON public.withdrawals(technician_id);
CREATE INDEX idx_withdrawals_merchant_id ON public.withdrawals(merchant_id);
CREATE INDEX idx_withdrawals_asset_id ON public.withdrawals(asset_id);`);

writeFile('supabase/migrations/008_create_receives_tables.sql', `CREATE TABLE public.receives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receive_number TEXT UNIQUE NOT NULL,
  withdrawal_id UUID NOT NULL REFERENCES public.withdrawals(id),
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id),
  asset_id UUID NOT NULL REFERENCES public.assets(id),
  received_by UUID NOT NULL REFERENCES public.profiles(id),
  serial_number TEXT NOT NULL,
  sim_number TEXT,
  wo_number TEXT NOT NULL,
  condition asset_condition NOT NULL,
  photo_url TEXT,
  warehouse_signature_url TEXT NOT NULL,
  receive_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'rejected')),
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_receives_updated_at BEFORE UPDATE ON public.receives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_receives_receive_number ON public.receives(receive_number);
CREATE INDEX idx_receives_withdrawal_id ON public.receives(withdrawal_id);
CREATE INDEX idx_receives_warehouse_id ON public.receives(warehouse_id);
CREATE INDEX idx_receives_asset_id ON public.receives(asset_id);`);

writeFile('supabase/migrations/009_create_qc_tables.sql', `CREATE TABLE public.quality_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qc_number TEXT UNIQUE NOT NULL,
  receive_id UUID NOT NULL REFERENCES public.receives(id),
  asset_id UUID NOT NULL REFERENCES public.assets(id),
  inspected_by UUID NOT NULL REFERENCES public.profiles(id),
  condition asset_condition NOT NULL,
  check_result TEXT NOT NULL CHECK (check_result IN ('pass', 'fail', 'repair_required')),
  defects_description TEXT,
  repair_required BOOLEAN DEFAULT FALSE,
  repair_notes TEXT,
  photos JSONB DEFAULT '[]',
  qc_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TRIGGER update_quality_checks_updated_at BEFORE UPDATE ON public.quality_checks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_quality_checks_qc_number ON public.quality_checks(qc_number);
CREATE INDEX idx_quality_checks_receive_id ON public.quality_checks(receive_id);
CREATE INDEX idx_quality_checks_asset_id ON public.quality_checks(asset_id);
CREATE INDEX idx_quality_checks_inspected_by ON public.quality_checks(inspected_by);
CREATE INDEX idx_quality_checks_check_result ON public.quality_checks(check_result);`);

// ============================================
// MIGRATION 010: REPAIRS
// ============================================
writeFile('supabase/migrations/010_create_repairs_tables.sql', `CREATE TABLE public.repairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repair_number TEXT UNIQUE NOT NULL,
  qc_id UUID REFERENCES public.quality_checks(id),
  asset_id UUID NOT NULL REFERENCES public.assets(id),
  technician_id UUID NOT NULL REFERENCES public.technicians(id),
  repair_date DATE NOT NULL,
  completion_date DATE,
  parts_replaced JSONB DEFAULT '[]',
  repair_cost DECIMAL(12, 2) DEFAULT 0,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_repairs_updated_at BEFORE UPDATE ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_repairs_repair_number ON public.repairs(repair_number);
CREATE INDEX idx_repairs_qc_id ON public.repairs(qc_id);
CREATE INDEX idx_repairs_asset_id ON public.repairs(asset_id);
CREATE INDEX idx_repairs_technician_id ON public.repairs(technician_id);
CREATE INDEX idx_repairs_status ON public.repairs(status);`);

// ============================================
// MIGRATION 011: CHAIN OF CUSTODY
// ============================================
writeFile('supabase/migrations/011_create_chain_of_custody_tables.sql', `CREATE TABLE public.chain_of_custody (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID NOT NULL REFERENCES public.assets(id),
  from_holder_id UUID REFERENCES public.profiles(id),
  from_holder_type TEXT CHECK (from_holder_type IN ('merchant', 'technician', 'warehouse', 'qc', 'repair')),
  to_holder_id UUID REFERENCES public.profiles(id),
  to_holder_type TEXT CHECK (to_holder_type IN ('merchant', 'technician', 'warehouse', 'qc', 'repair')),
  action TEXT NOT NULL CHECK (action IN ('install', 'replacement', 'withdraw', 'on_technician', 'receive_warehouse', 'qc', 'repair', 'ready_stock', 'deploy', 'transfer')),
  reference_type TEXT CHECK (reference_type IN ('work_order', 'withdrawal', 'receive', 'qc', 'repair')),
  reference_id UUID,
  notes TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chain_of_custody_asset_id ON public.chain_of_custody(asset_id);
CREATE INDEX idx_chain_of_custody_action ON public.chain_of_custody(action);
CREATE INDEX idx_chain_of_custody_created_at ON public.chain_of_custody(created_at);
CREATE INDEX idx_chain_of_custody_from_holder ON public.chain_of_custody(from_holder_id);
CREATE INDEX idx_chain_of_custody_to_holder ON public.chain_of_custody(to_holder_id);

-- IMPORTANT: This table is IMMUTABLE - no UPDATE or DELETE allowed`);

// ============================================
// MIGRATION 012: NOTIFICATIONS
// ============================================
writeFile('supabase/migrations/012_create_notifications_tables.sql', `CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  category TEXT CHECK (category IN ('late_return', 'outstanding', 'receive', 'repair', 'system')),
  reference_type TEXT,
  reference_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_notifications_type ON public.notifications(type);`);

// ============================================
// MIGRATION 013: ACTIVITY LOGS
// ============================================
writeFile('supabase/migrations/013_create_logs_tables.sql', `CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity_type ON public.activity_logs(entity_type);
CREATE INDEX idx_activity_logs_entity_id ON public.activity_logs(entity_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);`);

// ============================================
// MIGRATION 014: RLS POLICIES
// ============================================
writeFile('supabase/migrations/014_create_rls_policies.sql', `-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chain_of_custody ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.get_user_role(auth.uid()) = 'administrator');
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.get_user_role(auth.uid()) = 'administrator');

-- Merchants policies
CREATE POLICY "Authenticated users can view merchants" ON public.merchants FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and supervisors can manage merchants" ON public.merchants FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'supervisor'));

-- Technicians policies
CREATE POLICY "Authenticated users can view technicians" ON public.technicians FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage technicians" ON public.technicians FOR ALL USING (public.get_user_role(auth.uid()) = 'administrator');

-- Warehouses policies
CREATE POLICY "Authenticated users can view warehouses" ON public.warehouses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and warehouse staff can manage warehouses" ON public.warehouses FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'warehouse'));

-- Assets policies
CREATE POLICY "Authenticated users can view assets" ON public.assets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and warehouse staff can manage assets" ON public.assets FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'warehouse'));

-- Work orders policies
CREATE POLICY "Authenticated users can view work orders" ON public.work_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and supervisors can manage work orders" ON public.work_orders FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'supervisor'));

-- Withdrawals policies
CREATE POLICY "Authenticated users can view withdrawals" ON public.withdrawals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Technicians can create withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'technician');
CREATE POLICY "Admins and supervisors can update withdrawals" ON public.withdrawals FOR UPDATE USING (public.get_user_role(auth.uid()) IN ('administrator', 'supervisor'));

-- Receives policies
CREATE POLICY "Authenticated users can view receives" ON public.receives FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Warehouse staff can manage receives" ON public.receives FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'warehouse'));

-- Quality checks policies
CREATE POLICY "Authenticated users can view quality checks" ON public.quality_checks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and warehouse staff can manage quality checks" ON public.quality_checks FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'warehouse'));

-- Repairs policies
CREATE POLICY "Authenticated users can view repairs" ON public.repairs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and technicians can manage repairs" ON public.repairs FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'technician'));

-- Chain of custody policies (IMMUTABLE - only insert)
CREATE POLICY "Authenticated users can view chain of custody" ON public.chain_of_custody FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create chain of custody" ON public.chain_of_custody FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Authenticated users can view activity logs" ON public.activity_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "System can create activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');`);

// ============================================
// SEED DATA
// ============================================
writeFile('supabase/seed.sql', `-- Seed data for testing
-- Run this after migrations are applied

-- Insert sample admin user (password: admin123)
-- Note: You need to create the user via Supabase Auth first
-- Then run this SQL to set the role

-- INSERT INTO public.profiles (id, email, full_name, role, status)
-- VALUES (
--   'your-user-uuid-here',
--   'admin@assetpilot.com',
--   'System Administrator',
--   'administrator',
--   'active'
-- );

-- Sample warehouses
INSERT INTO public.warehouses (warehouse_name, warehouse_code, address, city, province, phone, email, capacity)
VALUES
  ('Main Warehouse Jakarta', 'WH-JKT-001', 'Jl. Sudirman No. 1', 'Jakarta', 'DKI Jakarta', '021-1234567', 'jakarta@assetpilot.com', 1000),
  ('Warehouse Surabaya', 'WH-SBY-001', 'Jl. Basuki Rahmat No. 10', 'Surabaya', 'Jawa Timur', '031-1234567', 'surabaya@assetpilot.com', 500),
  ('Warehouse Bandung', 'WH-BDG-001', 'Jl. Asia Afrika No. 5', 'Bandung', 'Jawa Barat', '022-1234567', 'bandung@assetpilot.com', 300);

-- Sample merchants
INSERT INTO public.merchants (merchant_name, merchant_code, address, city, province, contact_person, contact_phone, mid, tid)
VALUES
  ('Toko Sejahtera', 'MRC-001', 'Jl. Merdeka No. 10', 'Jakarta', 'DKI Jakarta', 'Budi Santoso', '081234567890', 'MID001', 'TID001'),
  ('Warung Makmur', 'MRC-002', 'Jl. Gatot Subroto No. 20', 'Jakarta', 'DKI Jakarta', 'Siti Aminah', '081234567891', 'MID002', 'TID002'),
  ('Restoran Enak', 'MRC-003', 'Jl. Thamrin No. 30', 'Jakarta', 'DKI Jakarta', 'Ahmad Hidayat', '081234567892', 'MID003', 'TID003');

-- Sample technicians
-- Note: You need to create user accounts first via Supabase Auth
-- Then link them to technicians table

-- Sample assets
INSERT INTO public.assets (asset_id, asset_type, brand, model, serial_number, barcode, status, condition, warehouse_id)
VALUES
  ('AST-EDC-001', 'edc', 'Verifone', 'VX520', 'SN-VX520-001', 'BC-VX520-001', 'ready_stock', 'good', (SELECT id FROM warehouses WHERE warehouse_code = 'WH-JKT-001')),
  ('AST-EDC-002', 'edc', 'Ingenico', 'iCT250', 'SN-ICT250-001', 'BC-ICT250-001', 'ready_stock', 'good', (SELECT id FROM warehouses WHERE warehouse_code = 'WH-JKT-001')),
  ('AST-SIM-001', 'sim_card', 'Telkomsel', '4G LTE', 'SN-SIM-001', 'BC-SIM-001', 'ready_stock', 'good', (SELECT id FROM warehouses WHERE warehouse_code = 'WH-JKT-001'));`);

// ============================================
// README.MD (FIXED VERSION - menggunakan array join)
// ============================================
const readmeLines = [
  '# 🚀 AssetPilot - EDC Asset Management System',
  '',
  'Enterprise Asset Lifecycle Management System.',
  '',
  '## 🚀 Quick Start',
  '',
  '1. Install dependencies: `npm install`',
  '2. Copy `.env.example` ke `.env.local`',
  '3. Setup Supabase credentials',
  '4. Run SQL migrations di Supabase SQL Editor',
  '5. Create storage buckets: assets, photos, signatures',
  '6. Create admin user di Supabase Authentication',
  '7. Run: `npm run dev`',
  '8. Open: http://localhost:3000',
  '',
  '## 📦 Scripts',
  '',
  '- `npm run dev` - Development server',
  '- `npm run build` - Build production',
  '- `npm run start` - Start production',
  '- `npm run lint` - Run ESLint',
  '',
  '## 👥 User Roles',
  '',
  '- Administrator, Supervisor, Warehouse, Technician, Management',
  '',
  '---',
  '**Built with ❤️ by AssetPilot Team**',
];

writeFile('README.md', readmeLines.join('\n'));

// ============================================
// VERCEL.JSON
// ============================================
writeFile('vercel.json', `{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install"
}`);

// ============================================
// .PRETTIERRC
// ============================================
writeFile('.prettierrc', `{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}`);

// ============================================
// .ESLINTRC.JSON
// ============================================
writeFile('.eslintrc.json', `{
  "extends": ["next/core-web-vitals", "next/typescript"]
}`);

// ============================================
// NEXT-ENV.D.TS
// ============================================
writeFile('next-env.d.ts', `/// <reference types="next" />
/// <reference types="next/image-types/global" />`);

// ============================================
// INSTALL.BAT (FIXED - tanpa backticks)
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

// ============================================
// INSTALL.SH (FIXED - menggunakan array join)
// ============================================
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
// QUICK-SETUP.BAT (FIXED)
// ============================================
const quickSetupBatLines = [
  '@echo off',
  'echo Quick Setup AssetPilot...',
  'echo.',
  'echo [1/4] Creating project files...',
  'node setup.js',
  'echo.',
  'echo [2/4] Installing dependencies...',
  'call npm install',
  'echo.',
  'echo [3/4] Setup complete!',
  'echo.',
  'echo [4/4] Next steps:',
  'echo   - Setup Supabase (see README.md)',
  'echo   - Run SQL migrations',
  'echo   - npm run dev',
  'echo.',
  'pause',
];

writeFile('quick-setup.bat', quickSetupBatLines.join('\r\n'));

// ============================================
// QUICK-SETUP.SH (FIXED)
// ============================================
const quickSetupShLines = [
  '#!/bin/bash',
  'echo "Quick Setup AssetPilot..."',
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
];

writeFile('quick-setup.sh', quickSetupShLines.join('\n'));

// ============================================
// DONE!
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
console.log('   Or: npm install');
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
console.log('   - Go to Supabase -> Storage');
console.log('   - Create buckets: assets, photos, signatures (all public)');
console.log('');
console.log('5. Create Admin User:');
console.log('   - Supabase -> Authentication -> Add User');
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