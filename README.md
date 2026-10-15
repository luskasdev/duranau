# DuranAI

Agente de IA com interface de chat, desenvolvido com Next.js e Anthropic Claude, pronto para deploy na Vercel.

## Segurança primeiro
- **Não coloque chaves de API no código, no GitHub ou em mensagens.**
- Como uma chave foi compartilhada em uma conversa, revogue-a no painel da Anthropic e crie uma nova.
- Configure a nova chave em `ANTHROPIC_API_KEY` nas variáveis de ambiente da Vercel.
- Nunca faça commit do `.env.local`.

## Rodar localmente
1. Instale Node.js 20+.
2. Extraia o projeto e execute `npm install`.
3. Copie `.env.example` para `.env.local` e coloque sua nova chave no arquivo local.
4. Execute `npm run dev` e abra http://localhost:3000.

## Deploy na Vercel
1. Crie um repositório **privado** no GitHub chamado `duranai`.
2. Envie os arquivos deste projeto ao repositório.
3. Na Vercel, importe o repositório e use as configurações detectadas do Next.js.
4. Em **Project Settings → Environment Variables**, adicione `ANTHROPIC_API_KEY` com a nova chave e habilite Production, Preview e Development conforme necessário.
5. Faça o deploy. Após alterar a variável, redeploy para que ela seja aplicada.

## O que já vem pronto
- Interface responsiva de chat em português.
- Respostas via Anthropic Claude no servidor.
- Mensagens de erro amigáveis e indicador de carregamento.
- Chave de API mantida exclusivamente no backend.
