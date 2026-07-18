// setup-final.js - AssetPilot Complete Setup (Fixed Version)
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

console.log('🚀 Starting AssetPilot Final Setup...\n');

// ============================================
// CORE CONFIG FILES
// ============================================
writeFile('package.json', JSON.stringify({
  name: "assetpilot",
  version: "1.0.0",
  private: true,
  scripts: {
    dev: "next dev",
    build: "next build",
    start: "next start",
    lint: "next lint",
    format: "prettier --write ."
  },
  dependencies: {
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "@hookform/resolvers": "^3.9.0",
    "@mui/icons-material": "^6.0.0",
    "@mui/material": "^6.0.0",
    "@supabase/ssr": "^0.5.0",
    "@supabase/supabase-js": "^2.45.0",
    "@zxing/browser": "^0.1.0",
    clsx: "^2.1.0",
    "date-fns": "^3.6.0",
    "framer-motion": "^11.0.0",
    jspdf: "^2.5.0",
    "jspdf-autotable": "^3.8.0",
    "lucide-react": "^0.400.0",
    next: "14.2.35",
    "next-themes": "^0.3.0",
    qrcode: "^1.5.0",
    react: "18.3.1",
    "react-dom": "18.3.1",
    "react-hook-form": "^7.53.0",
    recharts: "^2.12.0",
    sonner: "^1.5.0",
    swr: "^2.2.0",
    "tailwind-merge": "^2.5.0",
    xlsx: "^0.18.0",
    zod: "^3.23.0",
    zustand: "^4.5.0"
  },
  devDependencies: {
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    autoprefixer: "^10.4.0",
    eslint: "^8.57.0",
    "eslint-config-next": "14.2.35",
    postcss: "^8.4.0",
    prettier: "^3.3.0",
    tailwindcss: "^3.4.0",
    typescript: "^5.5.0"
  }
}, null, 2));

writeFile('next.config.mjs', `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    }],
  },
};
export default nextConfig;`);

writeFile('tsconfig.json', JSON.stringify({
  compilerOptions: {
    target: "ES2020",
    lib: ["dom", "dom.iterable", "esnext"],
    allowJs: true,
    skipLibCheck: true,
    strict: false,
    noEmit: true,
    esModuleInterop: true,
    module: "esnext",
    moduleResolution: "bundler",
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: "preserve",
    incremental: true,
    plugins: [{ name: "next" }],
    paths: { "@/*": ["./src/*"] }
  },
  include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  exclude: ["node_modules"]
}, null, 2));

writeFile('tailwind.config.ts', `import type { Config } from 'tailwindcss';
const config: Config = {
  darkMode: ['class'],
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
};
export default config;`);

writeFile('postcss.config.mjs', `const config = { plugins: { tailwindcss: {}, autoprefixer: {} } };
export default config;`);

writeFile('.env.example', `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000`);

writeFile('.env.local', `NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000`);

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
// CORE APP FILES
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
}`);

writeFile('src/app/layout.tsx', `import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
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
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}`);

writeFile('src/middleware.ts', `import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return supabaseResponse;

    if (!user && !request.nextUrl.pathname.startsWith('/login')) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    if (user && request.nextUrl.pathname.startsWith('/login')) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  } catch (e) {
    console.error('Middleware error:', e);
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
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
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
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
};`);

// ============================================
// UTILS
// ============================================
writeFile('src/lib/utils/cn.ts', `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }`);

writeFile('src/lib/utils/format.ts', `import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
export const formatDate = (date: Date | string, formatStr: string = 'dd MMM yyyy') => format(new Date(date), formatStr, { locale: id });
export const formatDateTime = (date: Date | string) => format(new Date(date), 'dd MMM yyyy HH:mm', { locale: id });
export const formatRelativeTime = (date: Date | string) => formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
export const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);`);

// ============================================
// HOOKS
// ============================================
writeFile('src/lib/hooks/use-auth.ts', `'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          setUser(currentUser);
          const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
          setProfile(data);
        }
      } finally { setLoading(false); }
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(data);
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

writeFile('src/lib/hooks/use-toast.ts', `'use client';
import { toast as sonnerToast } from 'sonner';
export const useToast = () => ({
  success: (message: string, options?: any) => sonnerToast.success(message, options),
  error: (message: string, options?: any) => sonnerToast.error(message, options),
  info: (message: string, options?: any) => sonnerToast.info(message, options),
});`);

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

// ============================================
// PROVIDERS
// ============================================
writeFile('src/components/providers/auth-provider.tsx', `'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';

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

// ============================================
// UI COMPONENTS
// ============================================
writeFile('src/components/ui/button.tsx', `'use client';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { cn } from '@/lib/utils/cn';
import { forwardRef } from 'react';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text' | 'glass';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'contained', children, ...props }, ref) => {
    const variantStyles = {
      contained: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md',
      outlined: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
      text: 'text-primary-600 hover:bg-primary-50',
      glass: 'bg-white/70 backdrop-blur-md border border-white/20 text-gray-900',
    };
    return (
      <MuiButton ref={ref} className={cn('font-medium rounded-lg transition-all', variantStyles[variant], className)} disableElevation {...props}>
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
export const Skeleton = ({ className }: any) => <div className={cn('bg-gray-200 dark:bg-gray-700 animate-pulse h-4 rounded', className)} />;`);

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
      window.location.href = '/';
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
        </form>
      </CardContent>
    </Card>
  );
}`);

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

writeFile('src/app/(dashboard)/page.tsx', `import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard - AssetPilot' };

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to AssetPilot</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold">Total Assets</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold">Work Orders</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold">Merchants</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}`);

console.log('\n');
console.log('═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   ✅  SETUP COMPLETE!                                    ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('\n');
console.log('📦 Next Steps:');
console.log('  1. Run: npm install --legacy-peer-deps');
console.log('  2. Run: git init');
console.log('  3. Run: git add .');
console.log('  4. Run: git commit -m "Initial commit: AssetPilot setup"');
console.log('  5. Run: git remote add origin https://github.com/Raiganet/Assetpilot.git');
console.log('  6. Run: git branch -M main');
console.log('  7. Run: git push -u origin main --force');
console.log('\n');