import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // In mock mode, we simply return a placeholder URL
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://mockproject.supabase.co";
  if (isMock) {
    // Generate a temporary object URL for preview (only works in dev)
    const url = URL.createObjectURL(file);
    return NextResponse.json({ url }, { status: 200 });
  }

  // Real upload to Supabase Storage bucket named 'avatars'
  const { data, error } = await supabase.storage.from('avatars').upload(`${crypto.randomUUID()}_${file.name}`, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) {
    console.error('Upload error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const publicUrl = supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl;
  return NextResponse.json({ url: publicUrl }, { status: 200 });
}
