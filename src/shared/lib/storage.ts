import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET || "property-images";

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

export async function uploadPropertyImage(
  file: File,
  propertyId: string
): Promise<{ url: string; path: string } | null> {
  const client = getSupabase();
  if (!client) return null;

  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `properties/${propertyId}/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("[Storage] Upload failed:", error);
    return null;
  }

  const { data: urlData } = client.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl, path: filePath };
}

export async function deletePropertyImage(filePath: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error("[Storage] Delete failed:", error);
    return false;
  }

  return true;
}

export async function deletePropertyImages(propertyId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const { data: files, error: listError } = await client.storage
    .from(BUCKET_NAME)
    .list(`properties/${propertyId}`);

  if (listError || !files) return false;

  const filePaths = files.map((f) => `properties/${propertyId}/${f.name}`);
  if (filePaths.length === 0) return true;

  const { error } = await client.storage
    .from(BUCKET_NAME)
    .remove(filePaths);

  return !error;
}

export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseKey;
}

export async function uploadLogo(
  file: File,
  agencyId: string
): Promise<{ url: string; path: string } | null> {
  const client = getSupabase();
  if (!client) return null;

  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `logos/${agencyId}/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error("[Storage] Logo upload failed:", error);
    return null;
  }

  const { data: urlData } = client.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl, path: filePath };
}

export async function deleteLogo(filePath: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error("[Storage] Logo delete failed:", error);
    return false;
  }

  return true;
}
