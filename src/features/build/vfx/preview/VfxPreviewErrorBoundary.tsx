/**
 * Isolates WebGL / R3F preview crashes so the VFX Studio shell stays usable.
 * Location: src/features/build/vfx/preview/VfxPreviewErrorBoundary.tsx
 */
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../../../../components/ui/Button';

interface VfxPreviewErrorBoundaryProps {
  children: ReactNode;
  /** Bump to clear a caught error after the parent remounts the scene. */
  resetKey?: string | number;
}

interface VfxPreviewErrorBoundaryState {
  hasError: boolean;
  resetNonce: number;
}

export class VfxPreviewErrorBoundary extends Component<
  VfxPreviewErrorBoundaryProps,
  VfxPreviewErrorBoundaryState
> {
  state: VfxPreviewErrorBoundaryState = { hasError: false, resetNonce: 0 };

  static getDerivedStateFromError(): Partial<VfxPreviewErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: VfxPreviewErrorBoundaryProps): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, resetNonce: this.state.resetNonce + 1 });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[VfxPreviewErrorBoundary]', error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState((prev) => ({
      hasError: false,
      resetNonce: prev.resetNonce + 1,
    }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-3 p-4 text-center"
          data-testid="vfx-shared-preview-error"
        >
          <p className="text-sm text-stone-400">3D-Vorschau abgestürzt</p>
          <p className="max-w-xs text-xs text-stone-600">
            Die Studio-Ansicht bleibt nutzbar. Vorschau neu laden.
          </p>
          <Button variant="ghost" size="sm" onClick={this.handleReset}>
            Vorschau neu laden
          </Button>
        </div>
      );
    }

    return (
      <React.Fragment key={this.state.resetNonce}>{this.props.children}</React.Fragment>
    );
  }
}
