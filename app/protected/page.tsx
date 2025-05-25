import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ApiKeyTable from "./components/api-key-table";
import NewApiKeyButton from "./components/new-api-key-button";
import { InfoIcon } from "lucide-react";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // API Key'leri getir
  const { data: apiKeys, error } = await supabase
    .from("api_keys")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("API Keys yüklenirken hata oluştu:", error);
    return (
      <div className="flex-1 w-full flex flex-col gap-6 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-semibold">API Key Yönetimi</h1>
            <NewApiKeyButton />
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 text-center text-muted-foreground">
              API Key'ler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Toplam kullanım hesapla
  const totalUsage = apiKeys?.reduce((sum, key) => sum + key.usage, 0) || 0;
  const totalLimit = apiKeys?.reduce((sum, key) => sum + key.limit, 0) || 0;

  return (
    <div className="flex-1 w-full flex flex-col gap-6 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col gap-4">
        {/* Plan Kartı */}
        <div className="bg-gradient-to-r from-rose-100 via-purple-100 to-blue-100 rounded-xl p-6 mt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">MEVCUT PLAN</div>
              <h2 className="text-2xl font-semibold">Researcher</h2>
            </div>
            <button className="text-sm bg-white/90 hover:bg-white px-3 py-1.5 rounded-md transition">
              Planı Yönet
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">API Kullanımı</span>
                <InfoIcon size={14} className="text-muted-foreground" />
              </div>
              <div className="bg-white/50 rounded-full h-2 w-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all" 
                  style={{ width: `${(totalUsage / totalLimit) * 100}%` }}
                />
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-sm text-muted-foreground">
                  {totalUsage} / {totalLimit} Kredi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* API Keys Bölümü */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">API Keys</h2>
              <p className="text-sm text-muted-foreground">
                API isteklerinizi doğrulamak için kullanılan anahtarlar. Daha fazla bilgi için{" "}
                <a href="/docs" className="text-primary hover:underline">
                  dokümantasyon
                </a>{" "}
                sayfasına göz atın.
              </p>
            </div>
            <NewApiKeyButton />
          </div>

          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <ApiKeyTable apiKeys={apiKeys || []} />
          </div>
        </div>

        {/* İletişim Kartı */}
        <div className="flex justify-between items-center bg-muted/50 rounded-xl p-6 mt-6">
          <p className="text-sm text-muted-foreground">
            Sorularınız veya geri bildiriminiz mi var? Size yardımcı olmaktan mutluluk duyarız!
          </p>
          <button className="text-sm bg-white hover:bg-white/90 px-4 py-2 rounded-md border transition">
            İletişime Geç
          </button>
        </div>
      </div>
    </div>
  );
}
