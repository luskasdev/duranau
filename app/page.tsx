'use client';

import { FormEvent, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const starters = [
  { icon: '✦', title: 'Explique um assunto', prompt: 'Explique um assunto difícil de um jeito simples.' },
  { icon: '⌘', title: 'Ajude com código', prompt: 'Me ajude a criar um projeto de programação.' },
  { icon: '✎', title: 'Crie algo', prompt: 'Me ajude a desenvolver uma ideia criativa.' },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Message[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível obter uma resposta.');
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void sendMessage();
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">D</div><span>Duran<span className="brand-ai">AI</span></span></div>
        <button className="new-chat" onClick={() => { setMessages([]); setError(''); setInput(''); }}>＋ <span>Nova conversa</span></button>
        <div className="side-label">SEU ESPAÇO</div>
        <div className="side-note">Suas ideias começam aqui.</div>
        <div className="sidebar-bottom"><span className="status-dot" /> Claude conectado via servidor</div>
      </aside>

      <section className="workspace">
        <header className="topbar"><div className="mobile-brand">Duran<span className="brand-ai">AI</span></div><span className="model-pill"><span className="status-dot" /> Claude · Assistente</span></header>
        <div className={`chat-area ${messages.length ? 'has-messages' : ''}`}>
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="eyebrow"><span>✦</span> INTELIGÊNCIA PARA SUAS IDEIAS</div>
              <h1>O que vamos<br /><span>criar hoje?</span></h1>
              <p>Sou o DuranAI. Posso ajudar você a aprender, programar, escrever e tirar projetos do papel.</p>
              <div className="starter-grid">{starters.map((s) => <button key={s.title} className="starter" onClick={() => void sendMessage(s.prompt)}><span className="starter-icon">{s.icon}</span><strong>{s.title}</strong><span className="starter-arrow">↗</span></button>)}</div>
            </div>
          ) : (
            <div className="messages">{messages.map((m, i) => <div key={i} className={`message ${m.role}`}><div className="avatar">{m.role === 'assistant' ? 'D' : 'Você'}</div><div className="message-body"><div className="message-label">{m.role === 'assistant' ? 'DuranAI' : 'Você'}</div><div className="message-text">{m.content}</div></div></div>)}{loading && <div className="message assistant"><div className="avatar">D</div><div className="message-body"><div className="message-label">DuranAI</div><div className="typing"><i></i><i></i><i></i></div></div></div>}<div id="bottom" /></div>
          )}
        </div>
        <div className="composer-wrap">
          {error && <div className="error-message">{error}</div>}
          <form className="composer" onSubmit={handleSubmit}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }} placeholder="Pergunte qualquer coisa ao DuranAI..." rows={1} disabled={loading} />
            <button className="send-button" aria-label="Enviar mensagem" type="submit" disabled={loading || !input.trim()}>{loading ? '…' : '↑'}</button>
          </form>
          <div className="disclaimer">O DuranAI pode cometer erros. Confira informações importantes.</div>
        </div>
      </section>
    </main>
  );
}
