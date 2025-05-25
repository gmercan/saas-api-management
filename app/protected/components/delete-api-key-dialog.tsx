'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteApiKeyDialogProps {
  apiKeyId: string;
  apiKeyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteApiKeyDialog({
  apiKeyId,
  apiKeyName,
  isOpen,
  onClose,
}: DeleteApiKeyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', apiKeyId);

      if (error) throw error;

      toast.success('API Key başarıyla silindi');
      onClose();
      router.refresh();
    } catch (error) {
      console.error('API Key silinirken hata:', error);
      toast.error('API Key silinirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-sm">
        <div className="bg-card border rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-2">API Key'i Sil</h2>
          <p className="text-sm text-muted-foreground mb-4">
            &quot;{apiKeyName}&quot; API Key'ini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-muted"
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Siliniyor...' : 'Sil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 