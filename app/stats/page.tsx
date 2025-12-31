"use client"

import { useState } from "react"
import { useLeaders } from "@/lib/api/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function StatsPage() {
  const [category, setCategory] = useState('PTS')
  const [season, setSeason] = useState('REGULAR')

  const { data: leadersData, isLoading } = useLeaders({ category, season, limit: 20 })

  const leaders = leadersData?.data || []

  const categories = [
    { value: 'PTS', label: 'Points' },
    { value: 'AST', label: 'Assists' },
    { value: 'REB', label: 'Rebounds' },
    { value: 'steal', label: 'Steals' },
    { value: 'efficiency', label: 'Efficiency' },
    { value: 'FG_PCT', label: 'FG%' },
    { value: 'FG3_PCT', label: '3P%' },
    { value: 'FT_PCT', label: 'FT%' },
  ]

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold tracking-tight">
          <TrendingUp className="h-10 w-10 text-blue-600" />
          League Leaders
        </h1>
        <p className="text-muted-foreground">
          Top performers across all categories
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-full sm:w-64">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={season} onValueChange={setSeason}>
          <TabsList>
            <TabsTrigger value="REGULAR">Regular Season</TabsTrigger>
            <TabsTrigger value="PLAYOFF">Playoffs</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {categories.find(c => c.value === category)?.label} Leaders
          </CardTitle>
          <CardDescription>
            Top 20 players for {leadersData?.season} season
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {leaders.map((leader, index) => (
                <Link key={leader.playerID} href={`/player/${leader.playerID}`}>
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold bg-muted">
                        {index + 1}
                      </div>
                      {leader.headshotUrl && (
                        <div className="relative h-12 w-12">
                          <Image
                            src={leader.headshotUrl}
                            alt={leader.playerName}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{leader.playerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {leader.teamAbbreviation} • {leader.position}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{leader.value?.toFixed(1)}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{leader.avg_pts?.toFixed(1)} PPG</span>
                        <span>{leader.avg_reb?.toFixed(1)} RPG</span>
                        <span>{leader.avg_ast?.toFixed(1)} APG</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
