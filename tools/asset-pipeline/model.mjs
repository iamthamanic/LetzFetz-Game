#!/usr/bin/env node
/**
 * Optional Meshy text→3D behind asset:model (opt-in + local secret).
 * Location: tools/asset-pipeline/model.mjs
 *
 * Exit codes:
 *   0 — GLB downloaded to docs/engine-system/raw/<id>/model.glb
 *   1 — missing opt-in/key/network/provider failure (fail closed; no partial publish)
 *   2 — usage / unsafe id
 *
 * Disabled by default. Never writes public/engine-parts until author normalizes.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MESHY_BASE = 'https://api.meshy.ai/openapi/v2/text-to-3d';
const POLL_MS = 5_000;
const MAX_WAIT_MS = 10 * 60_000;

function usage() {
  console.error(`Usage: npm run asset:model -- <asset-id> --provider=meshy [--prompt "..."]

DE: Optional Meshy Text→3D. Opt-in Pflicht; Secret nur lokal (MESHY_API_KEY).
EN: Optional Meshy text→3D. Explicit opt-in required; secret local only (MESHY_API_KEY).

Output (on success only): docs/engine-system/raw/<id>/model.glb
Then: npm run asset:normalize -- <id> --out … (do not overwrite MVP blindly)

Examples:
  MESHY_API_KEY=… npm run asset:model -- v3-part-fire-traeger-01 --provider=meshy
  MESHY_API_KEY=… npm run asset:model -- v3-part-fire-traeger-01 --provider=meshy --prompt "low poly fire chassis"
`);
}

function isSafeAssetId(id) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id);
}

function defaultPrompt(assetId) {
  return `Low-poly cartoon game prop chassis for card game part ${assetId}, single solid mesh, no people`;
}

/**
 * @param {string} apiKey
 * @param {string} prompt
 * @returns {Promise<string>} task id
 */
async function createPreviewTask(apiKey, prompt) {
  const res = await fetch(MESHY_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'preview',
      prompt,
      target_formats: ['glb'],
      should_remesh: true,
      target_polycount: 8000,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof body === 'object' && body && 'message' in body
        ? String(body.message)
        : res.statusText;
    throw new Error(`Meshy create failed (${res.status}): ${msg}`);
  }
  const result =
    typeof body === 'object' && body && 'result' in body
      ? body.result
      : null;
  if (typeof result !== 'string' || !result) {
    throw new Error('Meshy create: missing result task id');
  }
  return result;
}

/**
 * @param {string} apiKey
 * @param {string} taskId
 * @returns {Promise<{ glbUrl: string }>}
 */
async function waitForGlb(apiKey, taskId) {
  const started = Date.now();
  while (Date.now() - started < MAX_WAIT_MS) {
    const res = await fetch(`${MESHY_BASE}/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const task = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(`Meshy poll failed (${res.status})`);
    }
    const status =
      typeof task === 'object' && task && 'status' in task
        ? String(task.status)
        : '';
    if (status === 'SUCCEEDED') {
      const urls =
        typeof task === 'object' && task && 'model_urls' in task
          ? task.model_urls
          : null;
      const glbUrl =
        urls && typeof urls === 'object' && 'glb' in urls
          ? urls.glb
          : null;
      if (typeof glbUrl !== 'string' || !glbUrl) {
        throw new Error('Meshy SUCCEEDED but model_urls.glb missing');
      }
      return { glbUrl };
    }
    if (status === 'FAILED' || status === 'CANCELED') {
      const err =
        typeof task === 'object' &&
        task &&
        'task_error' in task &&
        task.task_error &&
        typeof task.task_error === 'object' &&
        'message' in task.task_error
          ? String(task.task_error.message)
          : status;
      throw new Error(`Meshy task ${status}: ${err}`);
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  throw new Error('Meshy poll timeout — no file written');
}

/**
 * @param {string} url
 * @param {string} destPath
 */
async function downloadGlb(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GLB download failed (${res.status})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 12) {
    throw new Error('GLB download too small — refusing to write');
  }
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, buf);
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--');
  const providerFlag = args.find((a) => a.startsWith('--provider='));
  const promptIdx = args.indexOf('--prompt');
  /** @type {string | null} */
  let prompt = null;
  if (promptIdx !== -1) {
    prompt = args[promptIdx + 1] ?? null;
    if (!prompt || prompt.startsWith('-')) {
      console.error('DE: --prompt braucht Text.\nEN: --prompt requires text.');
      usage();
      process.exit(2);
    }
  }

  const positional = args.filter((a, i) => {
    if (a.startsWith('-')) return false;
    if (promptIdx !== -1 && i === promptIdx + 1) return false;
    return true;
  });
  const unknown = args.filter(
    (a) =>
      a.startsWith('-') &&
      !a.startsWith('--provider=') &&
      a !== '--prompt',
  );
  if (unknown.length > 0) {
    console.error(`Unknown flag: ${unknown[0]}`);
    usage();
    process.exit(2);
  }

  const assetId = positional[0];
  if (!assetId) {
    usage();
    process.exit(2);
  }
  if (!isSafeAssetId(assetId)) {
    console.error(
      'DE: Ungültige Asset-ID.\nEN: Invalid asset id (path traversal blocked).',
    );
    process.exit(2);
  }
  if (positional.length > 1) {
    console.error(`Unexpected extra args: ${positional.slice(1).join(' ')}`);
    usage();
    process.exit(2);
  }

  const provider = providerFlag?.slice('--provider='.length)?.toLowerCase() ?? '';
  if (!provider) {
    console.error(`asset:model (DISABLED)

DE: Kein Provider — Opt-in erforderlich: --provider=meshy und MESHY_API_KEY in der Umgebung.
EN: No provider — opt-in required: --provider=meshy and MESHY_API_KEY in the environment.

Tripo: not wired (YAGNI). See docs/engine-system/asset-pipeline.md.
`);
    process.exit(1);
  }
  if (provider !== 'meshy') {
    console.error(
      `DE: Unbekannter Provider „${provider}“ (nur meshy).\nEN: Unknown provider "${provider}" (meshy only).`,
    );
    process.exit(1);
  }

  const apiKey = process.env.MESHY_API_KEY?.trim() ?? '';
  if (!apiKey) {
    console.error(`asset:model (FAIL)

DE: MESHY_API_KEY fehlt — Secret nur lokal (.env, nicht committen).
EN: MESHY_API_KEY missing — local secret only (.env, never commit).
`);
    process.exit(1);
  }

  const outPath = join(ROOT, 'docs', 'engine-system', 'raw', assetId, 'model.glb');
  const text = prompt ?? defaultPrompt(assetId);

  console.log(`asset:model (meshy)
  id:     ${assetId}
  out:    ${outPath}
  prompt: ${text.slice(0, 80)}${text.length > 80 ? '…' : ''}
`);

  try {
    const taskId = await createPreviewTask(apiKey, text);
    console.log(`  task:  ${taskId}`);
    const { glbUrl } = await waitForGlb(apiKey, taskId);
    await downloadGlb(glbUrl, outPath);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`DE: Meshy fehlgeschlagen — keine Datei geschrieben.\nEN: Meshy failed — no file written.\n${msg}`);
    if (existsSync(outPath)) {
      console.error('(pre-existing out file left untouched)');
    }
    process.exit(1);
  }

  console.log(`DE: OK — Roh-GLB gespeichert. Als Nächstes normalize/validate.
EN: OK — raw GLB saved. Next: normalize/validate.
EXIT  0`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
