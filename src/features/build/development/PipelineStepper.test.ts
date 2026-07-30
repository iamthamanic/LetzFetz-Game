/**
 * Unit tests for Development pipeline stepper mapping.
 * Location: src/features/build/development/PipelineStepper.test.ts
 */
import { describe, expect, it } from 'vitest';
import { buildPipelineSteps } from './PipelineStepper';

describe('buildPipelineSteps', () => {
  it('marks concept as current while awaiting review', () => {
    const steps = buildPipelineSteps({
      pipelineStatus: 'concept-sheet-awaiting-review',
      specVersion: 5,
      conceptSheetVersion: 2,
    });
    expect(steps.find((s) => s.id === 'spec')?.phase).toBe('done');
    expect(steps.find((s) => s.id === 'concept')?.phase).toBe('current');
    expect(steps.find((s) => s.id === 'concept')?.versionLabel).toContain('v2');
    expect(steps.find((s) => s.id === 'context')?.phase).toBe('upcoming');
  });

  it('marks all done when published', () => {
    const steps = buildPipelineSteps({
      pipelineStatus: 'published',
      modelVersion: 2,
    });
    expect(steps.every((s) => s.phase === 'done')).toBe(true);
  });
});
