import type { Organ } from "./anatomy";

/**
 * AI realistic reference images.
 *
 * The studio is a static site; the EASI platform that hosts it under
 * /atlas/organs/ exposes POST /api/atlas/organ-image on the same origin. There
 * gpt-oss writes a specimen-photography prompt from the organ entry and an
 * image-capable provider renders it. The learner's EASI session (the same
 * token the Science Museum halls use) authorises the call.
 */
export type AiReference =
  | { status: "ready"; url: string; provider: string; model: string; prompt: string; promptSource: string; cached: boolean }
  | { status: "unavailable"; reason: string }
  | { status: "signin" }
  | { status: "loading" };

type ImageResponse = {
  status?: string;
  url?: string;
  provider?: string;
  model?: string;
  prompt?: string;
  promptSource?: string;
  cached?: boolean;
  reason?: string;
  error?: string;
};

const TOKEN_KEY = "rag_platform_api_token";
const cache = new Map<string, AiReference>();

export function sessionToken() {
  try {
    return window.sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function referenceKey(organ: Organ, structure?: string | null) {
  return `${organ.id}|${(structure || "").toLowerCase()}`;
}

export function cachedReference(organ: Organ, structure?: string | null) {
  return cache.get(referenceKey(organ, structure)) ?? null;
}

export async function requestAiReference(
  organ: Organ,
  structure?: { name: string; meaning?: string } | null,
  { force = false }: { force?: boolean } = {},
): Promise<AiReference> {
  const key = referenceKey(organ, structure?.name);
  const existing = cache.get(key);
  if (existing && existing.status !== "loading" && !force) return existing;

  const token = sessionToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(new URL("/api/atlas/organ-image", window.location.origin).toString(), {
      method: "POST",
      credentials: "same-origin",
      headers,
      body: JSON.stringify({
        organId: organ.id,
        name: organ.name,
        latin: organ.latin,
        system: organ.system,
        summary: organ.summary,
        structure: structure?.name ?? "",
        structureMeaning: structure?.meaning ?? "",
        terms: organ.terms.map((term) => term.term),
      }),
    });
  } catch {
    const result: AiReference = { status: "unavailable", reason: "The EASI image service could not be reached." };
    cache.set(key, result);
    return result;
  }

  let result: AiReference;
  if (response.status === 401 || response.status === 403) {
    result = { status: "signin" };
  } else if (response.status === 404) {
    result = { status: "unavailable", reason: "This host does not provide the EASI image service." };
  } else if (!response.ok) {
    let reason = `The image service answered ${response.status}.`;
    try {
      const body = (await response.json()) as ImageResponse;
      if (body?.error) reason = String(body.error);
    } catch {
      /* keep the status reason */
    }
    result = { status: "unavailable", reason };
  } else {
    const body = (await response.json()) as ImageResponse;
    if (body?.status === "ready" && body.url) {
      result = {
        status: "ready",
        url: new URL(body.url, window.location.origin).toString(),
        provider: String(body.provider || ""),
        model: String(body.model || ""),
        prompt: String(body.prompt || ""),
        promptSource: String(body.promptSource || ""),
        cached: Boolean(body.cached),
      };
    } else {
      result = { status: "unavailable", reason: String(body?.reason || "The image providers are not available right now.") };
    }
  }
  if (result.status !== "signin") cache.set(key, result);
  return result;
}
