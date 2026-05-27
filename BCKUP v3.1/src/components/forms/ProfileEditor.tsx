'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/(dashboard)/creator/actions'

export default function ProfileEditor({ initialData }: { initialData: any }) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState('')

  const categories = initialData.categories || []
  const socialLinks = initialData.social_links || {}

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setMessage('')
    
    try {
      const formData = new FormData(e.currentTarget)
      // We encode categories and social_links as JSON strings for the server action
      formData.set('categories', JSON.stringify(categories))
      formData.set('social_links', JSON.stringify(socialLinks))
      
      await updateProfile(formData)
      setMessage('Profile updated successfully!')
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${message.includes('Error') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">Display Name</label>
          <input
            type="text"
            name="display_name"
            defaultValue={initialData.display_name || ''}
            className="w-full rounded-md px-4 py-2 bg-black/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g. CreatorName"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">TikTok Handle</label>
          <input
            type="text"
            name="handle"
            defaultValue={initialData.handle || ''}
            className="w-full rounded-md px-4 py-2 bg-black/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g. @creatorname"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white/80">Bio</label>
        <textarea
          name="bio"
          rows={4}
          defaultValue={initialData.bio || ''}
          className="w-full rounded-md px-4 py-2 bg-black/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Tell your audience about your streams..."
        />
      </div>

      <div className="pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={isPending}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-white rounded-md px-6 py-2 transition-colors w-full sm:w-auto"
        >
          {isPending ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}
