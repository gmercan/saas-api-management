'use client';

import { useState } from 'react';
import { Eye, EyeOff, Copy, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import DeleteApiKeyDialog from './delete-api-key-dialog';
import EditApiKeyDialog from './edit-api-key-dialog';

// API Key tipi tanımı
type ApiKey = {
  id: string;
  name: string;
  api_key: string;
  type: 'dev' | 'prod';
  usage: number;
  limit: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

interface ApiKeyTableProps {
  apiKeys: ApiKey[];
}

export default function ApiKeyTable({ apiKeys }: ApiKeyTableProps) {
  // Görünür API Key'leri takip etmek için state
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; apiKey: ApiKey | null }>({
    isOpen: false,
    apiKey: null,
  });
  const [editDialog, setEditDialog] = useState<{ isOpen: boolean; apiKey: ApiKey | null }>({
    isOpen: false,
    apiKey: null,
  });

  // API Key görünürlüğünü değiştir
  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // API Key'i panoya kopyala
  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success('API Key panoya kopyalandı');
    } catch (err) {
      toast.error('API Key kopyalanırken hata oluştu');
    }
  };

  // API Key'i maskele
  const maskApiKey = (key: string | null) => {
    if (!key) return '••••••••';
    return `${key.slice(0, 8)}...${key.slice(-8)}`;
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">İSİM</th>
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">TİP</th>
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">KULLANIM</th>
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">API KEY</th>
              <th className="text-right p-4 font-medium text-sm text-muted-foreground">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                  Henüz hiç API Key oluşturmadınız.
                </td>
              </tr>
            ) : (
              apiKeys.map((apiKey) => (
                <tr key={apiKey.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm">{apiKey.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      apiKey.type === 'prod' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {apiKey.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm">{apiKey.usage} / {apiKey.limit}</div>
                      <div className="bg-muted rounded-full h-1.5 w-24 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full transition-all" 
                          style={{ width: `${(apiKey.usage / apiKey.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm">
                    {visibleKeys[apiKey.id] ? apiKey.api_key : maskApiKey(apiKey.api_key)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={visibleKeys[apiKey.id] ? 'API Key\'i gizle' : 'API Key\'i göster'}
                      >
                        {visibleKeys[apiKey.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.api_key)}
                        className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="API Key'i kopyala"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => setEditDialog({ isOpen: true, apiKey })}
                        className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="API Key'i düzenle"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, apiKey })}
                        className="p-2 hover:bg-muted rounded-md text-red-500 hover:text-red-600 transition-colors"
                        aria-label="API Key'i sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteApiKeyDialog
        apiKeyId={deleteDialog.apiKey?.id || ''}
        apiKeyName={deleteDialog.apiKey?.name || ''}
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, apiKey: null })}
      />

      {editDialog.apiKey && (
        <EditApiKeyDialog
          apiKey={editDialog.apiKey}
          isOpen={editDialog.isOpen}
          onClose={() => setEditDialog({ isOpen: false, apiKey: null })}
        />
      )}
    </>
  );
} 