"use client"

import { use } from "react"
import { usePlayer, useTeam } from "@/lib/api/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Activity, TrendingUp, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

export default function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const playerId = parseInt(id)

  // Try to fetch player data - first without location/season filters for basic info
  const { data: basicData, isLoading: basicLoading, error: basicError } = usePlayer(playerId, { season: 'REGULAR' })
  const { data: homeData, isLoading: homeLoading } = usePlayer(playerId, { location: 'HOME', season: 'REGULAR' })
  const { data: awayData, isLoading: awayLoading } = usePlayer(playerId, { location: 'AWAY', season: 'REGULAR' })
  const { data: playoffData, isLoading: playoffLoading } = usePlayer(playerId, { season: 'PLAYOFF' })

  // Use basic data if home data doesn't have player info
  const player = homeData?.data?.player || basicData?.data?.player
  const homeStats = homeData?.data?.player?.stats
  const awayStats = awayData?.data?.player?.stats
  const playoffStats = playoffData?.data?.player?.stats
  const regularStats = basicData?.data?.player?.stats

  // Fetch current team info based on player's teamIDdd
  const { data: teamData } = useTeam(player?.teamID || null)
  const currentTeam = teamData?.data?.team

  const isLoading = basicLoading && homeLoading && awayLoading && playoffLoading

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!player || basicError) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Player not found</h1>
        <p className="text-muted-foreground mb-4">
          {basicError ? 'Error loading player data' : 'This player does not exist in the database'}
        </p>
        <Link href="/players" className="text-blue-600 hover:underline">
          Back to Players
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-10">
      {/* Player Header */}
      <div className="mb-8 flex flex-col md:flex-row items-center gap-6 rounded-lg border bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl">
        {player.headshotUrl ? (
          <div className="relative h-40 w-40 flex-shrink-0">
            <Image
              src={player.headshotUrl}
              alt={player.playerName}
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/20 border-4 border-white shadow-lg">
            <User className="h-20 w-20 text-white" />
          </div>
        )}
        <div className="flex-1 text-center md:text-left">
          <h1 className="mb-2 text-4xl font-bold text-white">{player.playerName}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Badge variant="outline" className="text-base border-white text-white hover:bg-white/20">{player.position}</Badge>
            {currentTeam && (
              <Link href={`/team/${player.teamID}`}>
                <Badge className="text-base cursor-pointer bg-white text-blue-700 hover:bg-white/90">
                  {currentTeam.teamName}
                </Badge>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          Season Statistics
        </h2>

        <Tabs defaultValue="regular">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="regular">Regular Season</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="away">Away</TabsTrigger>
          </TabsList>

          <TabsContent value="regular" className="mt-6">
            {(regularStats || homeStats) ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Points" value={(regularStats?.PTS || homeStats?.PTS)?.toFixed(1)} icon={Target} color="blue" />
                <StatsCard title="Rebounds" value={(regularStats?.REB || homeStats?.REB)?.toFixed(1)} icon={TrendingUp} color="green" />
                <StatsCard title="Assists" value={(regularStats?.AST || homeStats?.AST)?.toFixed(1)} icon={Activity} color="purple" />
                <StatsCard title="Efficiency" value={(regularStats?.efficiency || homeStats?.efficiency)?.toFixed(1)} icon={TrendingUp} color="orange" />
                <StatsCard title="FG %" value={(regularStats?.FG_PCT || homeStats?.FG_PCT) ? `${((regularStats?.FG_PCT || homeStats?.FG_PCT)! * 100).toFixed(1)}%` : 'N/A'} />
                <StatsCard title="3P %" value={(regularStats?.FG3_PCT || homeStats?.FG3_PCT) ? `${((regularStats?.FG3_PCT || homeStats?.FG3_PCT)! * 100).toFixed(1)}%` : 'N/A'} />
                <StatsCard title="FT %" value={(regularStats?.FT_PCT || homeStats?.FT_PCT) ? `${((regularStats?.FT_PCT || homeStats?.FT_PCT)! * 100).toFixed(1)}%` : 'N/A'} />
                <StatsCard title="Games" value={(regularStats?.GP_X || homeStats?.GP_X)?.toString()} />
                <StatsCard title="Minutes" value={(regularStats?.MIN_X || homeStats?.MIN_X)?.toFixed(1)} />
                <StatsCard title="Steals" value={(regularStats?.steal || homeStats?.steal)?.toFixed(1)} />
                <StatsCard title="Turnovers" value={(regularStats?.TOV || homeStats?.TOV)?.toFixed(1)} />
                <StatsCard title="+/-" value={(regularStats?.PLUS_MINUS || homeStats?.PLUS_MINUS)?.toFixed(1)} />
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No regular season stats available</p>
            )}
          </TabsContent>

          <TabsContent value="home" className="mt-6">
            {homeStats ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Points" value={homeStats.PTS?.toFixed(1)} icon={Target} color="blue" />
                <StatsCard title="Rebounds" value={homeStats.REB?.toFixed(1)} icon={TrendingUp} color="green" />
                <StatsCard title="Assists" value={homeStats.AST?.toFixed(1)} icon={Activity} color="purple" />
                <StatsCard title="Efficiency" value={homeStats.efficiency?.toFixed(1)} icon={TrendingUp} color="orange" />
                <StatsCard title="FG %" value={homeStats.FG_PCT ? `${(homeStats.FG_PCT * 100).toFixed(1)}%` : 'N/A'} />
                <StatsCard title="3P %" value={homeStats.FG3_PCT ? `${(homeStats.FG3_PCT * 100).toFixed(1)}%` : 'N/A'} />
                <StatsCard title="Games" value={homeStats.GP_X?.toString()} />
                <StatsCard title="Minutes" value={homeStats.MIN_X?.toFixed(1)} />
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No home stats available</p>
            )}
          </TabsContent>

          <TabsContent value="away" className="mt-6">
            {awayStats ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Points" value={awayStats.PTS?.toFixed(1)} icon={Target} color="blue" />
                <StatsCard title="Rebounds" value={awayStats.REB?.toFixed(1)} icon={TrendingUp} color="green" />
                <StatsCard title="Assists" value={awayStats.AST?.toFixed(1)} icon={Activity} color="purple" />
                <StatsCard title="Efficiency" value={awayStats.efficiency?.toFixed(1)} icon={TrendingUp} color="orange" />
                <StatsCard title="FG %" value={awayStats.FG_PCT ? `${(awayStats.FG_PCT * 100).toFixed(1)}%` : 'N/A'} />
                <StatsCard title="3P %" value={awayStats.FG3_PCT ? `${(awayStats.FG3_PCT * 100).toFixed(1)}%` : 'N/A'} />
                <StatsCard title="Games" value={awayStats.GP_X?.toString()} />
                <StatsCard title="Minutes" value={awayStats.MIN_X?.toFixed(1)} />
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No away stats available</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Performance Radar Chart */}
      {(regularStats || homeStats) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Performance Overview
            </CardTitle>
            <CardDescription>Visual representation of player statistics</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full h-[400px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={[
                {
                  stat: 'Points',
                  value: Math.min(100, ((regularStats?.PTS || homeStats?.PTS || 0) / 35) * 100),
                  fullMark: 100,
                },
                {
                  stat: 'Assists',
                  value: Math.min(100, ((regularStats?.AST || homeStats?.AST || 0) / 12) * 100),
                  fullMark: 100,
                },
                {
                  stat: 'Rebounds',
                  value: Math.min(100, ((regularStats?.REB || homeStats?.REB || 0) / 15) * 100),
                  fullMark: 100,
                },
                {
                  stat: 'Efficiency',
                  value: Math.min(100, ((regularStats?.efficiency || homeStats?.efficiency || 0) / 35) * 100),
                  fullMark: 100,
                },
                {
                  stat: 'FG%',
                  value: ((regularStats?.FG_PCT || homeStats?.FG_PCT || 0) * 100),
                  fullMark: 100,
                },
                {
                  stat: '3P%',
                  value: ((regularStats?.FG3_PCT || homeStats?.FG3_PCT || 0) * 100),
                  fullMark: 100,
                },
              ]}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                <Radar name="Player Stats" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Playoff Stats */}
      {playoffStats && (
        <div>
          <h2 className="mb-4 text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-yellow-600" />
            Playoff Statistics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Points" value={playoffStats.PTS?.toFixed(1)} icon={Target} color="blue" />
            <StatsCard title="Rebounds" value={playoffStats.REB?.toFixed(1)} icon={TrendingUp} color="green" />
            <StatsCard title="Assists" value={playoffStats.AST?.toFixed(1)} icon={Activity} color="purple" />
            <StatsCard title="Efficiency" value={playoffStats.efficiency?.toFixed(1)} icon={TrendingUp} color="orange" />
            <StatsCard title="FG %" value={playoffStats.FG_PCT ? `${(playoffStats.FG_PCT * 100).toFixed(1)}%` : 'N/A'} />
            <StatsCard title="3P %" value={playoffStats.FG3_PCT ? `${(playoffStats.FG3_PCT * 100).toFixed(1)}%` : 'N/A'} />
            <StatsCard title="FT %" value={playoffStats.FT_PCT ? `${(playoffStats.FT_PCT * 100).toFixed(1)}%` : 'N/A'} />
            <StatsCard title="Games" value={playoffStats.GP_X?.toString()} />
          </div>
        </div>
      )}
    </div>
  )
}

interface StatsCardProps {
  title: string
  value?: string
  icon?: React.ComponentType<{ className?: string }>
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

function StatsCard({ title, value = 'N/A', icon: Icon, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${color ? colorClasses[color] : 'text-muted-foreground'}`} />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
