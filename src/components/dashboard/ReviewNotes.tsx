'use client'

import { useState } from 'react'
import { addReviewNote } from '@/app/(dashboard)/crm/actions'

export default function ReviewNotes({ creatorId }: { creatorId: string }) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setMessage('')
    
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('creator_id', creatorId)
      
      await addReviewNote(formData)
      setMessage('Note added successfully.')
      e.currentTarget.reset()
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-white/80">Add Internal Note</h4>
      
      {message && (
        <div className={`p-3 rounded-md text-sm ${message.includes('Error') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <select 
            name="review_type" 
            className="rounded-md px-3 py-1.5 text-sm bg-black/50 border border-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-500 flex-1"
            required
            defaultValue="performance"
          >
            <option value="performance">Performance</option>
            <option value="technical">Technical</option>
            <option value="content">Content</option>
            <option value="growth">Growth</option>
          </select>
          <select 
            name="priority" 
            className="rounded-md px-3 py-1.5 text-sm bg-black/50 border border-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-500 flex-1"
            required
            defaultValue="medium"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <textarea
          name="notes"
          rows={3}
          className="w-full rounded-md px-3 py-2 text-sm bg-black/50 border border-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          placeholder="Write internal notes here... (Not visible to creator)"
          required
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-cyan-900 hover:bg-cyan-800 border border-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white text-sm rounded-md px-4 py-1.5 self-start transition-colors"
        >
          {isPending ? 'Saving...' : 'Save Note'}
        </button>
      </form>
    </div>
  )
}
