'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  Settings,
  Home,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <Home size={20} />,
  },
  {
    label: 'Trend Detector',
    href: '/trends',
    icon: <TrendingUp size={20} />,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 size={20} />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={20} />,
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(isOpen);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleClose = () => {
    setMobileOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg transition-transform duration-300 ease-in-out z-40 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 size={28} />
            FastMVP
          </h1>
          <p className="text-blue-100 text-sm mt-1">Core Analytics</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      active
                        ? 'bg-white/20 border-l-4 border-white font-semibold'
                        : 'hover:bg-white/10 text-blue-100'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-500">
          <div className="bg-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-100">
              Version 1.0.0
            </p>
            <p className="text-xs text-blue-200 mt-1">
              5-Day Sprint Edition
            </p>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-64" />
    </>
  );
}
