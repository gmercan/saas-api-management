'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlayCircle, FileText, CreditCard, Settings, ExternalLink, Database } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-64 border-r bg-card flex flex-col h-screen fixed">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-semibold text-xl">ZK</span>
        </Link>
      </div>

      {/* Workspace Selector */}
      <div className="px-3 mb-6">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium bg-muted/50 rounded-md hover:bg-muted transition-colors">
          <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center">
            P
          </span>
          <span className="flex-1 text-left">Personal</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Ana Menü */}
      <div className="flex-1 px-3">
        <div className="space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              isActive('/') 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Home size={16} />
            <span>Overview</span>
          </Link>
          <Link
            href="/protected/playground"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              isActive('/protected/playground') 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <PlayCircle size={16} />
            <span>API Playground</span>
          </Link>
          <Link
            href="/use-cases"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              isActive('/use-cases') 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <FileText size={16} />
            <span>Use Cases</span>
          </Link>
          <Link
            href="/billing"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              isActive('/billing') 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <CreditCard size={16} />
            <span>Billing</span>
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              isActive('/settings') 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Settings size={16} />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Alt Menü */}
      <div className="p-3 border-t">
        <div className="space-y-1">
          <Link
            href="/docs"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground rounded-md hover:bg-muted transition-colors"
          >
            <FileText size={16} />
            <span>Documentation</span>
            <ExternalLink size={12} className="ml-auto" />
          </Link>
          <Link
            href="/mcp"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground rounded-md hover:bg-muted transition-colors"
          >
            <Database size={16} />
            <span>ZK MCP</span>
            <ExternalLink size={12} className="ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  );
} 