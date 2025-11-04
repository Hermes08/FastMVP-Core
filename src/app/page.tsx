// src/app/page.tsx
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, CreditCard, Sparkles } from 'lucide-react';

export default function MyProjectsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <span>5 Day Sprint</span>
          <span>›</span>
          <span>Members Area</span>
          <span>›</span>
          <span className="text-gray-900 font-medium">My Projects</span>
        </div>

        {/* Main Membership Card */}
        <Card className="relative overflow-hidden mb-6 border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
            {/* Animated dots pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute right-0 top-0 w-96 h-96">
                <div className="grid grid-cols-8 gap-3 transform rotate-12">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-white rounded-full animate-pulse" 
                         style={{ animationDelay: `${i * 0.05}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="relative z-10 p-8 text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm mb-4">
              <Sparkles size={14} />
              <span>@5ds/framework</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-2">AI Framework & Community</h2>
            <p className="text-blue-100 mb-6">Full Access</p>
            
            <div className="flex items-baseline gap-4 mb-4">
              <div className="text-5xl font-bold">$199</div>
              <div className="text-blue-100">Billed monthly</div>
            </div>
            
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2">
              <span>Switch to Annual</span>
              <span className="bg-green-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded">-60%</span>
            </button>
          </CardContent>
        </Card>

        {/* Benefits List */}
        <div className="space-y-3">
          {[
            { icon: '🚀', title: 'The Framework', locked: false },
            { icon: '💬', title: '24/7 Private Community', locked: false },
            { icon: '🎓', title: 'Classroom', locked: false },
            { icon: '📞', title: 'Live Calls', locked: false },
            { icon: '💡', title: '1 on 1 Support', locked: false },
          ].map((benefit, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  {benefit.icon}
                </div>
                <span className="font-medium text-gray-900">{benefit.title}</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Email Signup */}
        <div className="mt-8">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
            <span>Unlock Full Access</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Social Proof */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
            ))}
          </div>
          <span>6 members recently joined</span>
        </div>
      </div>
    </div>
  );
}
