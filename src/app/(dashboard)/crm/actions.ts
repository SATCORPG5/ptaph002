'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addReviewNote(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const reviewData = {
    creator_id: formData.get('creator_id') as string,
    reviewer_id: user.id,
    review_type: formData.get('review_type') as string,
    notes: formData.get('notes') as string,
    priority: formData.get('priority') as string,
  }

  const { error } = await supabase
    .from('reviews')
    .insert(reviewData)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/crm')
  return { success: true }
}

export async function updateCreatorTier(
  creatorId: string,
  tier: 'staff' | 'top' | 'new' | 'recruiter',
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('creators')
    .update({ tier })
    .eq('id', creatorId)

  if (error) throw new Error(error.message)
  revalidatePath('/crm')
  return { success: true }
}
