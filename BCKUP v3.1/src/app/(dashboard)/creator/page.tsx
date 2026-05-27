import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileEditor from '@/components/forms/ProfileEditor'
import CreatorCard from '@/components/ui/CreatorCard'

export default async function CreatorDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://mockproject.supabase.co"

  if (!isMock && !user) {
    redirect('/login')
  }

  let profile = null

  if (isMock) {
    profile = {
      id: 'mock-prof-1',
      display_name: 'Alex "Test" Smith',
      handle: '@alextest',
      bio: 'Just a mock creator profile for testing the UI layout! I stream games and stuff.',
      categories: ['Gaming', 'Just Chatting'],
      social_links: { tiktok: 'https://tiktok.com/@alextest', instagram: 'https://instagram.com/alextest' },
      status: 'active'
    }
  } else {
    // Fetch or create profile
    const { data: dbProfile } = await supabase
      .from('creator_profiles')
      .select('*')
      .eq('user_id', user!.id)
      .single()
      
    profile = dbProfile

    if (!profile) {
      // Attempt to create empty profile
      const { data: newProfile, error } = await supabase
        .from('creator_profiles')
        .insert({ user_id: user!.id })
        .select()
        .single()
        
      if (!error) {
        profile = newProfile
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-michroma)]">Creator Dashboard</h1>
        <div className="text-sm px-3 py-1 bg-white/10 rounded-full border border-white/20">
          Status: {profile?.status || 'inactive'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-6">Edit Your Creator Card</h2>
            <ProfileEditor initialData={profile || {}} />
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md mb-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Card Preview</h2>
            <div className="min-h-[400px]">
              <CreatorCard profile={profile || {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
