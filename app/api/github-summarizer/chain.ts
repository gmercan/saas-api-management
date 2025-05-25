import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

// Özet çıktısı için şema tanımlama
export const SummaryOutputSchema = z.object({
  summary: z.string().min(1),
  keyPoints: z.array(z.string()),
  technicalStack: z.array(z.string()).optional(),
  projectType: z.string(),
});

export type SummaryOutput = z.infer<typeof SummaryOutputSchema>;

// Readme özetleme fonksiyonu
export async function summarizeReadme(readmeContent: string): Promise<SummaryOutput> {
  try {
    // LLM modelini başlat
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.2, // Daha tutarlı çıktılar için düşük sıcaklık
    });

    // Chat prompt şablonunu oluştur
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "Sen bir teknik dokümantasyon uzmanısın. GitHub README dosyalarını yöneticiler için özetlemekte uzmanlaşmışsın."],
      ["user", `Lütfen aşağıdaki README dosyasını özetle ve yanıtını tam olarak şu formatta ver:

Özet: [Kısa özet]
Ana Noktalar:
- [Madde 1]
- [Madde 2]
- [Madde 3]
Teknik Stack: [Teknolojiler]
Proje Tipi: [Tip]

README içeriği:
{content}`]
    ]);

    // Chain'i oluştur ve çalıştır
    const chain = prompt.pipe(model).pipe(new StringOutputParser());
    const result = await chain.invoke({
      content: readmeContent
    });

    // Çıktıyı parse et
    const lines = result.split('\n');
    const summary = lines.find((l: string) => l.startsWith('Özet:'))?.replace('Özet:', '').trim() || '';
    const keyPoints = lines
      .filter((l: string) => l.startsWith('-'))
      .map((l: string) => l.replace('-', '').trim());
    const technicalStack = lines
      .find((l: string) => l.startsWith('Teknik Stack:'))
      ?.replace('Teknik Stack:', '')
      .split(',')
      .map((t: string) => t.trim()) || [];
    const projectType = lines.find((l: string) => l.startsWith('Proje Tipi:'))?.replace('Proje Tipi:', '').trim() || '';

    // Şemaya uygun çıktı oluştur
    const output: SummaryOutput = {
      summary,
      keyPoints,
      technicalStack,
      projectType,
    };

    // Şema validasyonu yap
    return SummaryOutputSchema.parse(output);
  } catch (error) {
    console.error('LangChain işlemi hatası:', error);
    throw new Error('README özeti oluşturulurken bir hata oluştu');
  }
} 