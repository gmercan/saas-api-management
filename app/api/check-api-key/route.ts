import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key gerekli" },
        { status: 400 }
      )
    }

    // Supabase istemcisini oluştur
    const supabase = await createClient()

    try {
      // API Key'i veritabanında kontrol et
      const { data, error } = await supabase
        .from('api_keys')
        .select('api_key')
        .eq('api_key', apiKey)
        .maybeSingle()

      if (error) {
        // Tablo bulunamadı hatası
        if (error.code === 'PGRST204') {
          console.error("api_keys tablosu bulunamadı")
          return NextResponse.json(
            { error: "API Keys sistemi henüz kurulmamış" },
            { status: 500 }
          )
        }

        console.error("Veritabanı sorgu hatası:", error)
        return NextResponse.json(
          { error: "Veritabanı sorgusu başarısız oldu" },
          { status: 500 }
        )
      }

      return NextResponse.json({ found: !!data })
    } catch (error) {
      console.error("Veritabanı işlemi hatası:", error)
      return NextResponse.json(
        { error: "Veritabanı işlemi başarısız oldu" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("API Key doğrulama hatası:", error)
    return NextResponse.json(
      { error: "İstek işlenirken bir hata oluştu" },
      { status: 500 }
    )
  }
} 