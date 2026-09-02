import { supabaseAdmin } from '../config/supabase.js';
export async function uploadToBucket(bucket:string, path:string, buffer:Buffer, mimetype:string){
  const { data, error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, { contentType: mimetype, upsert: true });
  if(error) throw error;
  const { data: pub } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return pub.publicUrl;
}
