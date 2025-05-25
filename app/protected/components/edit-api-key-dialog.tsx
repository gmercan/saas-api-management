'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Copy } from 'lucide-react';

interface EditApiKeyDialogProps {
  apiKey: {
    id: string;
    name: string;
    type: 'dev' | 'prod';
    limit: number;
    api_key: string;
    usage: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function EditApiKeyDialog({
  apiKey,
  isOpen,
  onClose,
}: EditApiKeyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const type = formData.get('type') as 'dev' | 'prod';
    const limit = parseInt(formData.get('limit') as string);

    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ name, type, limit })
        .eq('id', apiKey.id);

      if (error) throw error;

      toast.success('API Key başarıyla güncellendi');
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error('API Key güncellenirken hata:', error);
      toast.error(error?.message || 'API Key güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success('API Key panoya kopyalandı');
    } catch (err) {
      toast.error('API Key kopyalanırken hata oluştu');
    }
  };

  const maskApiKey = (key: string) => {
    return `${key.slice(0, 8)}...${key.slice(-8)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg">
        <div className="bg-card border rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-semibold">API Key'i Düzenle</h2>
              <p className="text-sm text-muted-foreground mt-1">
                API Key ayarlarını güncelleyin.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                API Key Adı
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={apiKey.name}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1.5">
                Tip
              </label>
              <select
                id="type"
                name="type"
                required
                defaultValue={apiKey.type}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="dev">Development</option>
                <option value="prod">Production</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                API Key
              </label>
              <div className="relative">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border font-mono text-sm">
                  {showApiKey ? apiKey.api_key : maskApiKey(apiKey.api_key)}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(apiKey.api_key)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="limit" className="block text-sm font-medium mb-1.5">
                Kullanım Limiti
              </label>
              <input
                type="number"
                id="limit"
                name="limit"
                required
                min="1"
                defaultValue={apiKey.limit}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Her ay yenilenecek API istek limitiniz.
                </p>
                <p className="text-xs text-muted-foreground">
                  Mevcut Kullanım: {apiKey.usage}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                disabled={isLoading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 