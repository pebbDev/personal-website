/**
 * Assets were moved from /assets into /public/assets without altering bytes.
 * This helper returns a Next.js public URL and does not copy/transform images.
 */
export function getAssetUrl(path: string): string {
  return `/assets/${path.replace(/^\/+/, "")}`;
}
