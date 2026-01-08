
import { GoogleGenAI } from "@google/genai";
import { Feedback } from "../types";

export const analyzeFeedback = async (feedbacks: Feedback[]): Promise<string> => {
  // Always use a named parameter and direct process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const feedbackTexts = feedbacks
    .filter(f => f.comment)
    .map(f => `- ${f.comment}`)
    .join('\n');

  const prompt = `
    Como um consultor de experiência do cliente para os Supermercados Kibabo em Angola, analise o seguinte feedback dos clientes:
    
    ${feedbackTexts || "Nenhum comentário de texto fornecido, apenas avaliações numéricas."}
    
    Por favor, forneça:
    1. Um resumo geral do sentimento.
    2. Principais áreas de melhoria identificadas.
    3. Uma sugestão acionável para a gerência da loja.
    
    Responda em português profissional e direto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // The .text property directly returns the string output (do not use text())
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Erro ao conectar com a inteligência artificial para análise.";
  }
};
