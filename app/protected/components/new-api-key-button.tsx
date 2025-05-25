'use client';

import { useState } from 'react';
import { Plus, Copy } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewApiKeyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const api_key = crypto.randomUUID().replace(/-/g, '');

      const { error: insertError } = await supabase.from('api_keys').insert({
        name,
        api_key,
        type,
        limit,
        created_by: user.id,
        usage: 0
      });

      if (insertError) throw insertError;

      setNewApiKey(api_key);
      toast.success('API Key başarıyla oluşturuldu');
      router.refresh();
    } catch (error: any) {
      console.error('API Key oluşturulurken hata:', error);
      toast.error(error?.message || 'API Key oluşturulurken bir hata oluştu');
      setIsOpen(false);
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

  const handleClose = () => {
    setIsOpen(false);
    setNewApiKey(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <Plus size={16} />
        Yeni API Key
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg">
            <div className="bg-card border rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Yeni API Key Oluştur</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bu API Key ile uygulamanızdan istekler gönderebilirsiniz.
                  </p>
                </div>
              </div>

              {newApiKey ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">API Key</span>
                      <button
                        onClick={() => copyToClipboard(newApiKey)}
                        className="text-primary hover:text-primary/90 transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <code className="text-sm font-mono break-all">{newApiKey}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Bu API Key'i güvenli bir yerde saklayın. Güvenlik nedeniyle bir daha gösterilmeyecektir.
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Tamam
                    </button>
                  </div>
                </div>
              ) : (
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
                      className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      placeholder="Örn: Test API"
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
                      className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    >
                      <option value="dev">Development</option>
                      <option value="prod">Production</option>
                    </select>
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
                      defaultValue="1000"
                      className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Her ay yenilenecek API istek limitiniz.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleClose}
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
                      {isLoading ? 'Oluşturuluyor...' : 'Oluştur'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 