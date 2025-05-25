import { GeistSans } from 'geist/font/sans';
import { Toaster } from 'sonner';
import './globals.css';
import Sidebar from '@/components/sidebar';
import { Github, Mail, Moon, Twitter } from 'lucide-react';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'ZK - API Key Yönetimi',
  description: 'API Key yönetim paneli',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Ana İçerik */}
          <div className="flex-1 pl-64">
            {/* Üst Bar */}
            <div className="h-16 border-b px-6 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Operational
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Github size={20} />
                </a>
                <a href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="mailto:contact@example.com" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail size={20} />
                </a>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Moon size={20} />
                </button>
              </div>
            </div>

            {/* Sayfa İçeriği */}
            <div className="py-6">
              {children}
            </div>

            {/* Alt Bilgi */}
            <div className="border-t py-6 px-6">
              <div className="flex justify-between items-center max-w-5xl mx-auto text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
                  <a href="/terms" className="hover:text-foreground transition-colors">Terms of Use</a>
                  <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
                </div>
                <div>
                  © 2024 ZK. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
