#!/usr/bin/env node
/**
 * Thin MCP wrapper: tools only spawn existing npm asset:* scripts (no duplicate logic).
 * Location: tools/letz-fetz-assets-mcp/server.mjs
 *
 * Cursor MCP config example — see docs/engine-system/mcp-and-cli-setup.md
 *
 * Security: asset ids validated; cwd fixed to repo root; no arbitrary shell.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** @type {Record<string, { script: string, needsId: boolean, description: string }>} */
const TOOLS = {
  validate_model: {
    script: 'asset:validate',
    needsId: true,
    description: 'Runs npm run asset:validate -- <asset-id>',
  },
  normalize_part: {
    script: 'asset:normalize',
    needsId: true,
    description: 'Runs npm run asset:normalize -- <asset-id>',
  },
  optimize_part: {
    script: 'asset:optimize',
    needsId: true,
    description: 'Runs npm run asset:optimize -- <asset-id>',
  },
  preview_part: {
    script: 'asset:preview',
    needsId: true,
    description: 'Runs npm run asset:preview -- <asset-id>',
  },
};

function isSafeAssetId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id);
}

/**
 * @param {string} name
 * @param {Record<string, unknown>} args
 */
function runTool(name, args) {
  const def = TOOLS[name];
  if (!def) {
    return { ok: false, text: `Unknown tool: ${name}` };
  }
  /** @type {string[]} */
  const npmArgs = ['run', def.script];
  if (def.needsId) {
    const id = args.asset_id;
    if (!isSafeAssetId(id)) {
      return {
        ok: false,
        text: 'Invalid or missing asset_id (safe path segment required)',
      };
    }
    npmArgs.push('--', id);
  }
  const r = spawnSync('npm', npmArgs, {
    cwd: ROOT,
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 4 * 1024 * 1024,
  });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim();
  const code = r.status ?? 1;
  return {
    ok: code === 0,
    text: out || `(exit ${code}, no output)`,
    code,
  };
}

function send(msg) {
  process.stdout.write(`${JSON.stringify(msg)}\n`);
}

function handle(msg) {
  if (!msg || typeof msg !== 'object') return;
  const id = 'id' in msg ? msg.id : undefined;
  const method = 'method' in msg ? msg.method : undefined;

  if (method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'letz-fetz-assets-mcp', version: '0.1.0' },
      },
    });
    return;
  }

  if (method === 'notifications/initialized') {
    return;
  }

  if (method === 'tools/list') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        tools: Object.entries(TOOLS).map(([name, def]) => ({
          name,
          description: def.description,
          inputSchema: def.needsId
            ? {
                type: 'object',
                properties: {
                  asset_id: {
                    type: 'string',
                    description: 'Safe asset id e.g. v3-part-water-traeger-01',
                  },
                },
                required: ['asset_id'],
              }
            : { type: 'object', properties: {} },
        })),
      },
    });
    return;
  }

  if (method === 'tools/call') {
    const params =
      typeof msg === 'object' && msg && 'params' in msg ? msg.params : {};
    const name =
      typeof params === 'object' && params && 'name' in params
        ? String(params.name)
        : '';
    const args =
      typeof params === 'object' &&
      params &&
      'arguments' in params &&
      typeof params.arguments === 'object' &&
      params.arguments
        ? /** @type {Record<string, unknown>} */ (params.arguments)
        : {};
    const result = runTool(name, args);
    send({
      jsonrpc: '2.0',
      id,
      result: {
        content: [{ type: 'text', text: result.text }],
        isError: !result.ok,
      },
    });
    return;
  }

  if (id !== undefined) {
    send({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${String(method)}` },
    });
  }
}

const rl = createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    handle(JSON.parse(trimmed));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`MCP parse error: ${msg}\n`);
  }
});
