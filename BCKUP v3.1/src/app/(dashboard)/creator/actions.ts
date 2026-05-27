'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const updates = {
    display_name: formData.get('display_name') as string,
    handle: formData.get('handle') as string,
    bio: formData.get('bio') as string,
    categories: JSON.parse((formData.get('categories') as string) || '[]'),
    social_links: JSON.parse((formData.get('social_links') as string) || '{}'),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('creator_profiles')
    .update(updates)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/creator')
  return { success: true }
}
