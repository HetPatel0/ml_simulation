import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/jpeg";
const FALLBACK_IMAGE = "/og/home.jpg";

// Serves a photo from public/ as the body of an opengraph-image /
// twitter-image route. Returns a Response (valid per the file-convention
// docs) with an explicit JPEG content type so scrapers never see a
// mismatched extension/MIME pair.
export async function servePublicImage(
  publicPath: string,
): Promise<Response> {
  const toRelative = (p: string) => (p.startsWith("/") ? p.slice(1) : p);
  let data: Buffer;
  try {
    data = await readFile(join(process.cwd(), "public", toRelative(publicPath)));
  } catch {
    data = await readFile(
      join(process.cwd(), "public", toRelative(FALLBACK_IMAGE)),
    );
  }
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": OG_CONTENT_TYPE,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
