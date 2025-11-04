// src/components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles,
  PlusSquare, 
  GraduationCap, 
  Lightbulb, 
  Package, 
  Wrench, 
  Video, 
  Mail, 
  Folder,
  Users, 
  UserCircle, 
  MessageSquare, 
  Zap,
  HelpCircle
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export default function Sidebar() {
  const pathname = usePathname();

  const buildAIItems: NavItem[] = [
    { name: 'The Framework', href: '/', icon: Sparkles },
    { name: 'New Project', href: '/new-project', icon: PlusSquare },
    { name: 'Classroom', href: '/classroom', icon: GraduationCap },
  ];

  const aiResourcesItems: NavItem[] = [
    { name: 'Prompts', href: '/prompts', icon: Lightbulb },
    { name: 'Components', href: '/components', icon: Package },
    { name: 'AI Tools', href: '/tools', icon: Wrench },
    { name: 'Tutorials', href: '/tutorials', icon: Video },
    { name: 'Live Show', href: '/live', icon: Zap },
    { name: 'Newsletter', href: '/newsletter', icon: Mail },
  ];

  const membersAreaItems: NavItem[] = [
    { name: 'My Projects', href: '/my-projects', icon: Folder },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Meet Members', href: '/meet-members', icon: UserCircle },
    { name: 'My Prompts', href: '/my-prompts', icon: MessageSquare },
  ];

  const supportItems: NavItem[] = [
    { name: 'Instant Support', href: '/support', icon: Zap },
    { name: 'Ask Omar', href: '/ask-omar', icon: MessageSquare },
  ];

  const isActive = (href: string) => pathname === href;

  const NavSection = ({ title, items }: { title: string; items: NavItem[] }) => (
    <div className="mb-8">
      <h3 className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all
                ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-blue-600/10 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 fixed left-0 top-0 overflow-y-auto border-r border-blue-800/50">
      {/* Header */}
      <div className="p-4 border-b border-blue-800/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">5D</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm leading-tight">5 Day Sprint</h1>
            <p className="text-blue-300 text-xs">Member Login</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="p-4">
        <NavSection title="Build AI" items={buildAIItems} />
        <NavSection title="AI Resources" items={aiResourcesItems} />
        <NavSection title="Members Area" items={membersAreaItems} />
        <NavSection title="Support" items={supportItems} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800/50 mt-auto">
        <div className="space-y-3">
          <div className="text-xs text-blue-300">Watch Omar Build</div>
          <Link href="/guilty-chef" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800/30 transition-colors">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">GC</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">Guilty Chef</div>
              <div className="text-blue-300 text-xs truncate">#1 Google Ranked Directory</div>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}
