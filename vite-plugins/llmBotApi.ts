/**
 * Vite middleware: Ollama Cloud chat for LLM bot (API key server-side only).
 * Location: vite-plugins/llmBotApi.ts
 */
import type { Plugin, Connect } from 'vite';
import { parseLlmBotResponse } from '../src/services/bot/parseLlmBotResponse';

type Body = {
  system?: string;
  user?: string;
  actionCount?: number;
};

function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export function llmBotApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'letz-fetz-llm-bot-api',
    configureServer(server) {
      server.middlewares.use('/api/llm-bot', async (req, res, next) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        try {
          const apiKey = env.OLLAMA_API_KEY?.trim();
          if (!apiKey) {
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'OLLAMA_API_KEY missing in .env' }));
            return;
          }

          const model = (env.OLLAMA_BOT_MODEL || 'glm-5.2:cloud').trim();
          const raw = await readBody(req);
          const body = JSON.parse(raw) as Body;
          if (!body.system || !body.user || typeof body.actionCount !== 'number') {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid body' }));
            return;
          }

          const ollamaRes = await fetch('https://ollama.com/api/chat', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              stream: false,
              format: 'json',
              messages: [
                { role: 'system', content: body.system },
                { role: 'user', content: body.user },
              ],
            }),
          });

          if (!ollamaRes.ok) {
            const errText = await ollamaRes.text();
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: `Ollama ${ollamaRes.status}`,
                detail: errText.slice(0, 500),
              }),
            );
            return;
          }

          const data = (await ollamaRes.json()) as {
            message?: { content?: string };
          };
          const content = data.message?.content ?? '';
          // Validate shape early so the client gets a clear error
          parseLlmBotResponse(content, body.actionCount);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ content, model }));
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Unknown error';
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}
