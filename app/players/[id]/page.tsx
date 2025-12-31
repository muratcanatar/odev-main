import { redirect } from 'next/navigation'

// Redirect /players/[id] to /player/[id] for consistency
export default async function PlayersRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/player/${id}`)
}
