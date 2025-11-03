'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import '@/styles/globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: 'FastMVP - 5 Day Sprint',
  description: 'Build faster with the 5 Day Sprint methodology',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <div className="layout-container">
          {/* Top Navigation */}
          <TopNav />
          
          {/* Main Content Area */}
          <div className="layout-main">
            {/* Sidebar Navigation */}
            <Sidebar />
            
            {/* Page Content */}
            <main className="layout-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
