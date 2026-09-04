/*
 * Lightweight client-side publish helper.
 * - If `VITE_PUBLISH_API_URL` is configured, POSTs site JSON to that endpoint.
 * - Otherwise provides an export helper that downloads the JSON for manual commit.
 *
 * Expectation: a server-side endpoint should verify authentication and persist/commit
 * the content (this file deliberately avoids embedding any repo credentials).
 */

import { SiteContent } from '../types';
import { isFirebaseConfigured, publishSiteContentToFirestore, fetchSiteContentFromFirestore } from './publishFirebase';

const PUBLISH_URL = import.meta.env.VITE_PUBLISH_API_URL as string | undefined;
const PUBLISH_KEY = import.meta.env.VITE_PUBLISH_API_KEY as string | undefined;

export async function publishSiteContentRemote(content: SiteContent): Promise<{ ok: boolean; status?: number; json?: any; error?: string }> {
  // Prefer Firebase when configured
  if (isFirebaseConfigured()) {
    const res = await publishSiteContentToFirestore(content);
    return { ok: res.ok, error: res.error };
  }

  if (!PUBLISH_URL) {
    return { ok: false, status: 0, error: 'No remote publish URL configured (VITE_PUBLISH_API_URL).' };
  }

  try {
    const resp = await fetch(PUBLISH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(PUBLISH_KEY ? { Authorization: `Bearer ${PUBLISH_KEY}` } : {}),
      },
      body: JSON.stringify({ siteContent: content }),
    });

    const json = await resp.json().catch(() => undefined);
    return { ok: resp.ok, status: resp.status, json };
  } catch (err: any) {
    return { ok: false, status: 0, error: err?.message || String(err) };
  }
}

export async function fetchRemoteSiteContent(): Promise<SiteContent | null> {
  if (isFirebaseConfigured()) {
    return await fetchSiteContentFromFirestore();
  }

  if (!PUBLISH_URL) return null;

  try {
    const resp = await fetch(PUBLISH_URL.replace(/\/publish\/?$/, '/site-content.json'));
    if (!resp.ok) return null;
    const json = await resp.json().catch(() => null);
    return json || null;
  } catch (err) {
    console.error('fetchRemoteSiteContent error', err);
    return null;
  }
}

export function exportSiteContentAsFile(content: SiteContent, fileName = 'site-content.json') {
  try {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Export failed', err);
    return false;
  }
}

export function isRemotePublishConfigured(): boolean {
  return Boolean(PUBLISH_URL) || isFirebaseConfigured();
}
