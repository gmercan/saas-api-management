import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Özet çıktısı için şema tanımlama
const OutputSchema = z.object({
  summary: z.string().min(1).describe("README dosyasının kısa ve öz özeti"),
  keyPoints: z.array(z.string()).describe("Önemli noktaların listesi"),
  technicalStack: z.array(z.string()).describe("Kullanılan teknolojilerin listesi"),
  projectType: z.string().describe("Projenin tipi veya kategorisi")
});

export type SummaryOutput = z.infer<typeof OutputSchema>;

// Readme özetleme fonksiyonu
export async function summarizeReadme(readmeContent: string): Promise<SummaryOutput> {
  try {
    // LLM modelini başlat
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.2,
    }).withStructuredOutput(OutputSchema);

    // Chat prompt şablonunu oluştur
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "Sen bir teknik dokümantasyon uzmanısın. GitHub README dosyalarını yöneticiler için özetlemekte uzmanlaşmışsın."],
      ["user", `Lütfen aşağıdaki README dosyasını analiz et ve yapılandırılmış bir özet çıkar.

README içeriği:
{content}`]
    ]);

    // Chain'i oluştur ve çalıştır
    const chain = prompt.pipe(model);
    const result = await chain.invoke({
      content: readmeContent
    });

    return result;
  } catch (error) {
    console.error('LangChain işlemi hatası:', error);
    throw new Error('README özeti oluşturulurken bir hata oluştu');
  }
} 