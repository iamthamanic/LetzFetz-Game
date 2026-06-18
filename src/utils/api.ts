/**
 * Centralized API helper for Supabase Edge Function calls.
 * Eliminates duplicated fetch boilerplate across components.
 */

import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c701770f`;

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        ...(options.headers || {}),
      },
    });

    if (response.ok) {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }
    console.error(`API ${endpoint} failed:`, await response.text());
    return null;
  } catch (error) {
    console.error(`API ${endpoint} error:`, error);
    return null;
  }
}

export function apiGet<T>(endpoint: string): Promise<T | null> {
  return apiRequest<T>(endpoint);
}

export function apiPost<T>(endpoint: string, body: unknown): Promise<T | null> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function apiPut<T>(endpoint: string, body: unknown): Promise<T | null> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function apiDelete(endpoint: string): Promise<boolean> {
  return apiRequest<never>(endpoint, { method: 'DELETE' }).then((r) => r !== null);
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
