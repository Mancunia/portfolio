import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Neon Object Storage bucket declared in neon.ts (public_read).
const BUCKET = "assets";

function publicBase(): string {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  if (!endpoint) throw new Error("AWS_ENDPOINT_URL_S3 is not set");
  return `${endpoint.replace(/\/$/, "")}/${BUCKET}/`;
}

// Credentials, endpoint and region come from the standard AWS_* env vars.
// Neon requires path-style addressing.
let client: S3Client | null = null;
function getClient() {
  client ??= new S3Client({ forcePathStyle: true });
  return client;
}

export async function uploadObject(key: string, body: Buffer, contentType: string) {
  await getClient().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      // Every upload gets a new key, so objects never change once written.
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

// The DB stores bucket keys for our own files (so URLs survive branch/endpoint
// changes) and full URLs for anything external.
export function toPublicUrl(stored: string): string {
  if (!stored || /^https?:\/\//.test(stored)) return stored;
  return publicBase() + stored;
}

export function toStoredRef(url: string): string {
  const base = publicBase();
  return url?.startsWith(base) ? url.slice(base.length).split("?")[0] : url;
}
