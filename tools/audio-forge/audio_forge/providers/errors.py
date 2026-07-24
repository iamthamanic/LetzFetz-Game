"""Provider install / capability errors — never silent cloud fallback."""

from __future__ import annotations


class ProviderInstallError(RuntimeError):
    """Raised when a local provider is not installed or not configured."""


class ProviderError(RuntimeError):
    """Raised for provider runtime failures (non-install)."""
