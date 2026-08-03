/**
 * Pure leave-Play navigation policy for AppShell tab/history gates.
 * Location: src/features/shell/leavePlayGuard.ts
 */
import type { AppView } from './AppNav';

/** What AppShell must ask before leaving the Play view. */
export type LeavePlayAction =
  | 'none'
  /** Soft-pause match; keep GameState mounted (Material / Build). */
  | 'confirm-pause-match'
  /**
   * Active match must not reach Hauptmenü via tabs/history.
   * Only explicit Quit / brand-home may end the session.
   */
  | 'block-leave-to-menu'
  /** Leave Play while still on setup (no live GameState). */
  | 'confirm-leave-setup';

/**
 * Classify leaving Play.
 * Never soft-pause into the main menu — and never end a match via history Zurück.
 */
export function classifyLeavePlay(
  from: AppView,
  to: AppView,
  matchActive: boolean,
): LeavePlayAction {
  if (from !== 'play' || to === 'play') return 'none';
  if (matchActive) {
    return to === 'menu' ? 'block-leave-to-menu' : 'confirm-pause-match';
  }
  return 'confirm-leave-setup';
}
