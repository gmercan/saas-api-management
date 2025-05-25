import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { summarizeReadme } from "./chain";

export async function POST(request: Request) {
  try {
    // API Key'i request header'dan al
    const apiKey = request.headers.get('x-api-key');
    


    // Supabase istemcisini oluştur
    const supabase = await createClient();

    // API Key'i veritabanında kontrol et
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('api_key', apiKey)
      .maybeSingle();

    if (keyError) {
      // Tablo bulunamadı hatası
      if (keyError.code === 'PGRST204') {
        console.error("api_keys tablosu bulunamadı");
        return NextResponse.json(
          { error: "API Keys sistemi henüz kurulmamış" },
          { status: 500 }
        );
      }

      console.error("Veritabanı sorgu hatası:", keyError);
      return NextResponse.json(
        { error: "Veritabanı sorgusu başarısız oldu" },
        { status: 500 }
      );
    }

    // API Key bulunamadıysa hata döndür
    if (!keyData) {
      return NextResponse.json(
        { error: "Geçersiz API Key" },
        { status: 401 }
      );
    }

    // Request body'den GitHub URL'sini al
    const { githubUrl } = await request.json();

    if (!githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL'si gereklidir" },
        { status: 400 }
      );
    }

    // GitHub URL'sinden kullanıcı adı ve repo adını ayıkla
    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
    const [owner, repo] = urlParts;

    // GitHub API'den README dosyasını al
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw'
        }
      }
    );

    if (!readmeResponse.ok) {
      if (readmeResponse.status === 404) {
        return NextResponse.json(
          { error: "README.md dosyası bulunamadı" },
          { status: 404 }
        );
      }
      throw new Error('GitHub API isteği başarısız oldu');
    }

    const readmeContent = await readmeResponse.text();
    
    // Readme içeriğini özetle
    const summary = await summarizeReadme(readmeContent);

    return NextResponse.json({
      success: true,
      message: "README.md dosyası başarıyla özetlendi",
      data: {
        // content: readmeContent,
        summary,
        repository: {
          owner,
          repo,
          url: githubUrl
        }
      }
    });

  } catch (error) {
    console.error("İşlem hatası:", error);
    return NextResponse.json(
      { error: "İstek işlenirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 