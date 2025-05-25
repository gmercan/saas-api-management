"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Search, FileText, Bug } from "lucide-react"

// API Key doğrulama fonksiyonu
const verifyApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/check-api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey }),
    })
    
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "API isteği başarısız oldu")
    }

    return data.found
  } catch (error) {
    console.error("API Key doğrulama hatası:", error)
    throw error
  }
}

export function Playground() {
  // State tanımlamaları
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // API Key doğrulama işleyicisi
  const handleVerify = async () => {
    if (!apiKey.trim()) {
      toast.error("Lütfen bir API Key girin")
      return
    }

    setIsLoading(true)

    try {
      const isValid = await verifyApiKey(apiKey)
      
      if (isValid) {
        toast.success("API Key bulundu! ✨", {
          duration: 3000,
          position: "top-center",
        })
      } else {
        toast.error("API Key bulunamadı! ❌", {
          duration: 3000,
          position: "top-center",
        })
      }
    } catch (error: any) {
      toast.error(error.message || "API Key doğrulama sırasında bir hata oluştu", {
        duration: 3000,
        position: "top-center",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Enter tuşu ile doğrulama
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleVerify()
    }
  }

  return (
    <div className="container max-w-3xl mx-auto p-6">
      {/* Başlık */}
      <div className="space-y-1 mb-8">
        <div className="text-sm text-muted-foreground">
          Pages / API Playground
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          API Playground
        </h1>
      </div>

     

      {/* API Key Formu */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            API key
          </label>
          <Input
            type="text"
            placeholder="default"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full"
          />
        </div>
 {/* Butonlar */}
 <div className="flex gap-3 mb-8">
        <Button 
          variant="default" 
          className="bg-blue-500 hover:bg-blue-600 text-white"
          size="lg"
          onClick={handleVerify}
          disabled={isLoading || !apiKey.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </div>
      </div>
    </div>
  )
} 