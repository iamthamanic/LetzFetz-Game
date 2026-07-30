/**
 * German labels for VFX Studio batch job UI.
 * Location: src/features/build/vfx/batch/batchStatusDe.ts
 */

export const VFX_BATCH_JOB_STATUSES = [
  'PENDING',
  'IN_PROGRESS',
  'SUCCEEDED',
  'FAILED',
] as const;

export type VfxBatchJobStatus = (typeof VFX_BATCH_JOB_STATUSES)[number];

export const VFX_BATCH_STATUS_LABEL_DE: Record<VfxBatchJobStatus, string> = {
  PENDING: 'Ausstehend',
  IN_PROGRESS: 'Wird gerendert…',
  SUCCEEDED: 'Fertig',
  FAILED: 'Fehlgeschlagen',
};

export function isVfxBatchJobStatus(value: unknown): value is VfxBatchJobStatus {
  return typeof value === 'string' && (VFX_BATCH_JOB_STATUSES as readonly string[]).includes(value);
}
