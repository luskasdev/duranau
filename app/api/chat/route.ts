import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'O DuranAI ainda não foi configurado. Adicione ANTHROPIC_API_KEY nas variáveis de ambiente da Vercel.' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Envie uma mensagem para começar.' }, { status: 400 });
    }

    const safeMessages = messages.slice(-30).filter(
      (m: { role?: unknown; content?: unknown }) =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    );

    if (!safeMessages.length) {
      return NextResponse.json({ error: 'A conversa não contém mensagens válidas.' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const result = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system: 'Você é o DuranAI, um assistente de IA útil, honesto, criativo e acolhedor. Responda em português brasileiro por padrão, a menos que o usuário peça outro idioma. Explique assuntos com clareza, ajude com programação e reconheça incertezas. Nunca afirme ter realizado ações externas que não realizou.',
      messages: safeMessages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
        role: m.role,
        content: m.content.slice(0, 12000),
      })),
    });

    const reply = result.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return NextResponse.json({ reply: reply || 'Não consegui gerar uma resposta agora. Tente novamente.' });
  } catch (error) {
    console.error('DuranAI chat error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Ocorreu um erro ao conversar com o DuranAI. Tente novamente em instantes.' }, { status: 500 });
  }
}
