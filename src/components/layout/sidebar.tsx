'use client';
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
};