"use client"

import { useLeaders, useTeams } from "@/lib/api/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, Users, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const { data: pointsLeaders } = useLeaders({ category: 'PTS', season: 'REGULAR', limit: 5 })
  const { data: assistsLeaders } = useLeaders({ category: 'AST', season: 'REGULAR', limit: 5 })
  const { data: reboundsLeaders } = useLeaders({ category: 'REB', season: 'REGULAR', limit: 5 })
  const { data: teams } = useTeams({ per_page: 30 })

  // Note: Backend doesn't have a standings endpoint, so we just show teams by conference
  // To get actual rankings, we'd need to fetch individual team stats which is expensive
  const allTeams = teams?.data?.teams || []
  const eastStandings = allTeams.filter(t => t.conference === 'East').slice(0, 5)
  const westStandings = allTeams.filter(t => t.conference === 'West').slice(0, 5)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full border-b overflow-hidden py-24">
        {/* Basketball Court Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-orange-600/20 animate-pulse"></div>

          {/* Court Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="court-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#court-grid)"/>
              <circle cx="50%" cy="50%" r="100" fill="none" stroke="white" strokeWidth="2" opacity="0.3"/>
              <circle cx="50%" cy="50%" r="200" fill="none" stroke="white" strokeWidth="2" opacity="0.2"/>
            </svg>
          </div>

          {/* Floating Stats Numbers */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 text-6xl font-bold text-white/5 animate-float">23</div>
            <div className="absolute top-40 right-20 text-8xl font-bold text-white/5 animate-float-delayed">NBA</div>
            <div className="absolute bottom-32 left-1/4 text-5xl font-bold text-white/5 animate-float">2024</div>
            <div className="absolute bottom-20 right-1/3 text-7xl font-bold text-white/5 animate-float-delayed">🏀</div>
          </div>
        </div>

        {/* Content */}
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-block animate-fade-in">
              <div className="text-orange-500 text-sm font-semibold tracking-wider uppercase mb-2">Welcome to</div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-white">
                NBA Stats Hub
              </h1>
            </div>
            <p className="mb-8 text-xl text-slate-300 animate-fade-in-delayed">
              Complete NBA statistics, player analytics, team standings, and live game schedules
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-delayed">
              <Link href="/teams">
                <Button size="lg" className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
                  <Trophy className="h-5 w-5" />
                  Browse Teams
                </Button>
              </Link>
              <Link href="/players">
                <Button size="lg" variant="outline" className="gap-2 border-slate-600 text-white hover:bg-slate-800">
                  <Users className="h-5 w-5" />
                  View Players
                </Button>
              </Link>
              <Link href="/stats">
                <Button size="lg" variant="outline" className="gap-2 border-slate-600 text-white hover:bg-slate-800">
                  <TrendingUp className="h-5 w-5" />
                  League Leaders
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
          .animate-fade-in-delayed {
            animation: fade-in 1s ease-out 0.3s forwards;
            opacity: 0;
          }
        `}</style>
      </section>

      {/* Main Content */}
      <div className="container py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* League Leaders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-slate-600" />
                    League Leaders
                  </CardTitle>
                  <CardDescription>Top performers this season</CardDescription>
                </div>
                <Link href="/stats">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="points">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="points">Points</TabsTrigger>
                  <TabsTrigger value="assists">Assists</TabsTrigger>
                  <TabsTrigger value="rebounds">Rebounds</TabsTrigger>
                </TabsList>
                <TabsContent value="points" className="space-y-3">
                  {(pointsLeaders?.data || []).map((leader, index) => (
                    <Link key={leader.playerID} href={`/player/${leader.playerID}`}>
                      <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{leader.playerName}</p>
                            <p className="text-sm text-muted-foreground">{leader.teamAbbreviation} • {leader.position}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{leader.value?.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">PPG</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </TabsContent>
                <TabsContent value="assists" className="space-y-3">
                  {(assistsLeaders?.data || []).map((leader, index) => (
                    <Link key={leader.playerID} href={`/player/${leader.playerID}`}>
                      <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{leader.playerName}</p>
                            <p className="text-sm text-muted-foreground">{leader.teamAbbreviation} • {leader.position}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{leader.value?.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">APG</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </TabsContent>
                <TabsContent value="rebounds" className="space-y-3">
                  {(reboundsLeaders?.data || []).map((leader, index) => (
                    <Link key={leader.playerID} href={`/player/${leader.playerID}`}>
                      <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{leader.playerName}</p>
                            <p className="text-sm text-muted-foreground">{leader.teamAbbreviation} • {leader.position}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{leader.value?.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">RPG</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Standings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-slate-600" />
                    Standings
                  </CardTitle>
                  <CardDescription>Conference rankings</CardDescription>
                </div>
                <Link href="/standings">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="east">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="east">Eastern</TabsTrigger>
                  <TabsTrigger value="west">Western</TabsTrigger>
                </TabsList>
                <TabsContent value="east" className="space-y-2">
                  {eastStandings.map((team, index) => (
                    <Link key={team.teamID} href={`/team/${team.teamID}`}>
                      <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            {team.logoUrl && (
                              <div className="relative h-8 w-8">
                                <Image src={team.logoUrl} alt={team.teamName} fill className="object-contain" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{team.teamName}</p>
                              <p className="text-xs text-muted-foreground">{team.teamAbbreviation}</p>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{team.conference}</Badge>
                      </div>
                    </Link>
                  ))}
                </TabsContent>
                <TabsContent value="west" className="space-y-2">
                  {westStandings.map((team, index) => (
                    <Link key={team.teamID} href={`/team/${team.teamID}`}>
                      <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            {team.logoUrl && (
                              <div className="relative h-8 w-8">
                                <Image src={team.logoUrl} alt={team.teamName} fill className="object-contain" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{team.teamName}</p>
                              <p className="text-xs text-muted-foreground">{team.teamAbbreviation}</p>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{team.conference}</Badge>
                      </div>
                    </Link>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teams?.results || 0}</div>
              <p className="text-xs text-muted-foreground">Active in the league</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Season Type</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Regular</div>
              <p className="text-xs text-muted-foreground">2023-24 Season</p>
            </CardContent>
          </Card>
          <Link href="/stats" className="block">
            <Card className="transition-colors hover:bg-muted">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Leaders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">View Stats</div>
                <p className="text-xs text-muted-foreground">Browse all categories</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/schedule" className="block">
            <Card className="transition-colors hover:bg-muted">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Schedule</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">View Games</div>
                <p className="text-xs text-muted-foreground">Full match calendar</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
