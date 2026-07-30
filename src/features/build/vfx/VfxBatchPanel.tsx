/**
 * VFX Studio Batch mode — pending recipes, run batch, German job status.
 * Location: src/features/build/vfx/VfxBatchPanel.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Play, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { listFormulaRecipes, saveFormulaRecipe } from './registry';
import type { FormulaRecipe } from './types/assets';
import {
  checkVfxWorkerHealth,
  renderBatchHeroFrame,
  VfxWorkerError,
  type BatchRenderClientResult,
} from './workerClient';
import {
  VFX_BATCH_STATUS_LABEL_DE,
  type VfxBatchJobStatus,
} from './batch/batchStatusDe';

interface BatchRowState {
  recipeId: string;
  name: string;
  uiStatus: VfxBatchJobStatus;
  error: string | null;
  pngUrl: string | null;
}

function recipeNeedsHeroFrame(recipe: FormulaRecipe): boolean {
  if (!recipe.heroFrame?.url) return true;
  return recipe.heroFrame.url.startsWith('data:');
}

function buildInitialRows(recipes: FormulaRecipe[]): BatchRowState[] {
  return recipes.map((recipe) => ({
    recipeId: recipe.id,
    name: recipe.name,
    uiStatus: recipeNeedsHeroFrame(recipe) ? 'PENDING' : 'SUCCEEDED',
    error: null,
    pngUrl: recipe.heroFrame?.url?.startsWith('/') ? recipe.heroFrame.url : null,
  }));
}

function pendingRows(rows: BatchRowState[]): BatchRowState[] {
  return rows.filter((row) => row.uiStatus === 'PENDING' || row.uiStatus === 'FAILED');
}

export function VfxBatchPanel() {
  const [rows, setRows] = useState<BatchRowState[]>(() =>
    buildInitialRows(listFormulaRecipes()),
  );
  const [workerOnline, setWorkerOnline] = useState<boolean | null>(null);
  const [running, setRunning] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const refreshRecipes = () => {
    setRows(buildInitialRows(listFormulaRecipes()));
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const ok = await checkVfxWorkerHealth();
      if (!cancelled) setWorkerOnline(ok);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const applySuccessToRegistry = (recipeId: string, result: BatchRenderClientResult) => {
    if (!result.renderOutput) return;
    const recipes = listFormulaRecipes();
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;
    saveFormulaRecipe({
      ...recipe,
      heroFrame: result.renderOutput,
      status: 'READY',
      updatedAt: new Date().toISOString(),
    });
  };

  const runOne = async (recipeId: string): Promise<void> => {
    setRows((prev) =>
      prev.map((row) =>
        row.recipeId === recipeId
          ? { ...row, uiStatus: 'IN_PROGRESS', error: null }
          : row,
      ),
    );

    try {
      const result = await renderBatchHeroFrame(recipeId);
      if (cancelledRef.current) return;

      if (result.status === 'SUCCEEDED' && result.renderOutput) {
        applySuccessToRegistry(recipeId, result);
        setRows((prev) =>
          prev.map((row) =>
            row.recipeId === recipeId
              ? {
                  ...row,
                  uiStatus: 'SUCCEEDED',
                  error: result.error,
                  pngUrl: result.pngUrl,
                }
              : row,
          ),
        );
      } else {
        setRows((prev) =>
          prev.map((row) =>
            row.recipeId === recipeId
              ? {
                  ...row,
                  uiStatus: 'FAILED',
                  error: result.error ?? 'Render fehlgeschlagen',
                }
              : row,
          ),
        );
      }
    } catch (err) {
      const message =
        err instanceof VfxWorkerError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Unbekannter Fehler';
      setRows((prev) =>
        prev.map((row) =>
          row.recipeId === recipeId
            ? { ...row, uiStatus: 'FAILED', error: message }
            : row,
        ),
      );
    }
  };

  const handleRunBatch = async () => {
    const queue = pendingRows(rows);
    if (queue.length === 0 || running) return;

    setGlobalError(null);
    setRunning(true);
    cancelledRef.current = false;

    const ok = await checkVfxWorkerHealth();
    setWorkerOnline(ok);
    if (!ok) {
      setGlobalError('VFX-Worker nicht erreichbar — bitte npm run vfx-worker starten.');
      setRunning(false);
      return;
    }

    for (const row of queue) {
      if (cancelledRef.current) break;
      await runOne(row.recipeId);
    }

    setRunning(false);
  };

  const pendingCount = pendingRows(rows).length;

  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden"
      data-testid="vfx-batch-panel"
    >
      <div className="flex flex-none flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-800 bg-stone-950/80 px-3 py-2">
        <div>
          <p className="text-xs font-semibold text-stone-200">Batch-Render</p>
          <p className="text-[10px] text-stone-500">
            {pendingCount} ausstehend · gleiche Vorschau-Szene wie Formeln
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={refreshRecipes}
            disabled={running}
            data-testid="vfx-batch-refresh"
          >
            Aktualisieren
          </Button>
          <Button
            variant="accent"
            size="sm"
            icon={
              running ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )
            }
            onClick={() => void handleRunBatch()}
            disabled={running || pendingCount === 0}
            data-testid="vfx-batch-run"
          >
            Batch starten
          </Button>
        </div>
      </div>

      <div
        className="flex flex-none items-center gap-2 rounded-lg border border-stone-800 bg-stone-950/60 px-3 py-2 text-[10px]"
        data-testid="vfx-batch-worker-status"
      >
        {workerOnline === null ? (
          <span className="text-stone-500">Worker-Status wird geprüft…</span>
        ) : workerOnline ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-300">VFX-Worker erreichbar</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-amber-200">
              VFX-Worker offline — npm run vfx-worker + npm run dev
            </span>
          </>
        )}
      </div>

      {globalError ? (
        <p className="flex-none text-xs text-red-300" data-testid="vfx-batch-global-error">
          {globalError}
        </p>
      ) : null}

      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-stone-800">
        {rows.length === 0 ? (
          <div
            className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 p-6 text-center"
            data-testid="vfx-batch-empty"
          >
            <p className="text-sm text-stone-400">Keine Kombinationen in der Registry.</p>
            <p className="text-xs text-stone-600">
              Speichere zuerst eine Kombination unter Build → Combinate.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-800">
            {rows.map((row) => (
              <li
                key={row.recipeId}
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5"
                data-testid={`vfx-batch-row-${row.recipeId}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-stone-200">{row.name}</p>
                  <p className="truncate text-[10px] text-stone-500">{row.recipeId}</p>
                  {row.error ? (
                    <p className="mt-0.5 text-[10px] text-red-400">{row.error}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  {row.pngUrl ? (
                    <img
                      src={row.pngUrl}
                      alt=""
                      className="h-10 w-10 rounded border border-stone-700 object-cover"
                      data-testid={`vfx-batch-thumb-${row.recipeId}`}
                    />
                  ) : null}
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      row.uiStatus === 'SUCCEEDED'
                        ? 'border-emerald-700/60 bg-emerald-950/50 text-emerald-300'
                        : row.uiStatus === 'FAILED'
                          ? 'border-red-700/60 bg-red-950/50 text-red-300'
                          : row.uiStatus === 'IN_PROGRESS'
                            ? 'border-amber-700/60 bg-amber-950/50 text-amber-200'
                            : 'border-stone-700 bg-stone-900 text-stone-400'
                    }`}
                    data-testid={`vfx-batch-status-${row.recipeId}`}
                  >
                    {VFX_BATCH_STATUS_LABEL_DE[row.uiStatus]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
