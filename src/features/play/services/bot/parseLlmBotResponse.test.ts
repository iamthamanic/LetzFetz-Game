/**
 * Unit tests for LLM bot response parsing.
 * Location: src/features/play/services/bot/parseLlmBotResponse.test.ts
 */
import { describe, it, expect } from 'vitest';
import { parseLlmBotResponse } from './parseLlmBotResponse';

describe('parseLlmBotResponse', () => {
  it('parses plain JSON', () => {
    const pick = parseLlmBotResponse(
      '{"actionIndex":1,"reason":"Angriff lohnt sich."}',
      3,
    );
    expect(pick.actionIndex).toBe(1);
    expect(pick.reason).toContain('Angriff');
  });

  it('parses fenced JSON and rejects OOB index', () => {
    const pick = parseLlmBotResponse('Sure.\n```json\n{"actionIndex":0,"reason":"x"}\n```', 2);
    expect(pick.actionIndex).toBe(0);
    expect(() => parseLlmBotResponse('{"actionIndex":9,"reason":"x"}', 2)).toThrow();
  });
});
