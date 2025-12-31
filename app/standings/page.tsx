"use client"

import { useStandings } from "@/lib/api/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function StandingsPage() {
  const { data: standingsData, isLoading, error } = useStandings()

  const standings = standingsData?.data?.standings || []
  const eastStandings = standings.filter(t => t.conference === 'East').sort((a, b) => (a.winRank || 999) - (b.winRank || 999))
  const westStandings = standings.filter(t => t.conference === 'West').sort((a, b) => (a.winRank || 999) - (b.winRank || 999))

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse space-y-8">
          <div className="h-20 bg-muted rounded" />
          <div className="h-96 bg-muted rounded" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Standings</h1>
          <p className="text-muted-foreground">{error.message || 'Failed to load standings data'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold tracking-tight">
          <Trophy className="h-10 w-10 text-yellow-600" />
          NBA Standings
        </h1>
        <p className="text-muted-foreground">
          Conference rankings and team performance
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Teams</TabsTrigger>
          <TabsTrigger value="east">Eastern Conference</TabsTrigger>
          <TabsTrigger value="west">Western Conference</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eastern Conference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {eastStandings.map((team, index) => (
                  <Link key={team.teamID} href={`/team/${team.teamID}`}>
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                          {index + 1}
                        </div>
                        {team.logoUrl && (
                          <div className="relative h-12 w-12">
                            <Image src={team.logoUrl} alt={team.teamName} fill className="object-contain" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{team.teamName}</p>
                          <p className="text-sm text-muted-foreground">{team.teamAbbreviation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge>Win Rank: #{team.winRank || 'N/A'}</Badge>
                        <Badge variant="outline">Def: #{team.defRatingRank || 'N/A'}</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Western Conference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {westStandings.map((team, index) => (
                  <Link key={team.teamID} href={`/team/${team.teamID}`}>
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">
                          {index + 1}
                        </div>
                        {team.logoUrl && (
                          <div className="relative h-12 w-12">
                            <Image src={team.logoUrl} alt={team.teamName} fill className="object-contain" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{team.teamName}</p>
                          <p className="text-sm text-muted-foreground">{team.teamAbbreviation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge>Win Rank: #{team.winRank || 'N/A'}</Badge>
                        <Badge variant="outline">Def: #{team.defRatingRank || 'N/A'}</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="east">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {eastStandings.map((team, index) => (
                  <Link key={team.teamID} href={`/team/${team.teamID}`}>
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                          {index + 1}
                        </div>
                        {team.logoUrl && (
                          <div className="relative h-12 w-12">
                            <Image src={team.logoUrl} alt={team.teamName} fill className="object-contain" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{team.teamName}</p>
                          <p className="text-sm text-muted-foreground">{team.teamAbbreviation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge>Win Rank: #{team.winRank || 'N/A'}</Badge>
                        <Badge variant="outline">Def: #{team.defRatingRank || 'N/A'}</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="west">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {westStandings.map((team, index) => (
                  <Link key={team.teamID} href={`/team/${team.teamID}`}>
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">
                          {index + 1}
                        </div>
                        {team.logoUrl && (
                          <div className="relative h-12 w-12">
                            <Image src={team.logoUrl} alt={team.teamName} fill className="object-contain" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{team.teamName}</p>
                          <p className="text-sm text-muted-foreground">{team.teamAbbreviation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge>Win Rank: #{team.winRank || 'N/A'}</Badge>
                        <Badge variant="outline">Def: #{team.defRatingRank || 'N/A'}</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
