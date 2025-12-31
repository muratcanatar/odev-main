"use client"

import { useFixtures } from "@/lib/api/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"

export default function SchedulePage() {
  const { data: fixturesData, isLoading } = useFixtures({ per_page: 50 })

  const fixtures = fixturesData?.data?.fixtures || []

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold tracking-tight">
          <Calendar className="h-10 w-10 text-blue-600" />
          NBA Schedule
        </h1>
        <p className="text-muted-foreground">
          Upcoming and recent games
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {fixtures.map((fixture) => (
            <Card key={fixture.matchID}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge>Round {fixture.roundNumber}</Badge>
                      <Badge variant="outline">Game #{fixture.matchNumber}</Badge>
                    </div>
                    <div className="text-lg font-semibold">
                      {fixture.homeTeam} vs {fixture.awayTeam}
                    </div>
                    {fixture.result && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        Final: {fixture.result}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 text-sm md:text-right">
                    <div className="flex items-center gap-2 text-muted-foreground md:justify-end">
                      <Calendar className="h-4 w-4" />
                      {fixture.matchDate ? format(new Date(fixture.matchDate), 'PPp') : 'TBD'}
                    </div>
                    {fixture.arena && fixture.city && (
                      <div className="flex items-center gap-2 text-muted-foreground md:justify-end">
                        <MapPin className="h-4 w-4" />
                        {fixture.arena}, {fixture.city}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
