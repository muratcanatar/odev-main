"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { PlayerWithStats } from "@/lib/types"

interface StatsComparisonProps {
  players: PlayerWithStats[]
}

export function StatsComparison({ players }: StatsComparisonProps) {
  const playersWithRegularStats = players.filter((player) => player.regularSeason)

  const comparisonData = playersWithRegularStats.map((player) => ({
    name: player.playername.split(" ")[0],
    points: player.regularSeason?.pts ?? 0,
    assists: player.regularSeason?.ast ?? 0,
    rebounds: player.regularSeason?.reb ?? 0,
  }))

  const getLeader = (key: "pts" | "ast" | "reb") => {
    return playersWithRegularStats
      .slice()
      .sort((a, b) => (b.regularSeason?.[key] ?? 0) - (a.regularSeason?.[key] ?? 0))[0]
  }

  const pointsLeader = getLeader("pts")
  const assistsLeader = getLeader("ast")
  const reboundsLeader = getLeader("reb")

  return (
    <section id="stats" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">Stats Comparison</h2>
          <p className="text-muted-foreground text-lg">Top Players Performance Analysis</p>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur animate-scale-in">
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-4 py-2">Points Average</Badge>
            <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-sm px-4 py-2">
              Assists Average
            </Badge>
            <Badge className="bg-accent/20 text-accent border-accent/30 text-sm px-4 py-2">Rebounds Average</Badge>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.3} />
              <XAxis dataKey="name" stroke="#f97316" tick={{ fill: "#ffffff", fontSize: 14, fontWeight: 600 }} />
              <YAxis stroke="#f97316" tick={{ fill: "#ffffff", fontSize: 14, fontWeight: 600 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #f97316",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
                labelStyle={{ color: "#ffffff", fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ color: "#ffffff" }} iconType="circle" />
              <Bar dataKey="points" fill="#f97316" name="Points" radius={[8, 8, 0, 0]} />
              <Bar dataKey="assists" fill="#a855f7" name="Assists" radius={[8, 8, 0, 0]} />
              <Bar dataKey="rebounds" fill="#10b981" name="Rebounds" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up bg-primary/10 border-primary/30">
            <div className="text-4xl font-bold text-primary mb-2">
              {pointsLeader?.regularSeason ? pointsLeader.regularSeason.pts.toFixed(1) : "-"}
            </div>
            <div className="text-sm text-muted-foreground mb-1">Highest Points Average</div>
            <div className="text-xs text-primary">{pointsLeader?.playername ?? "TBD"}</div>
          </Card>

          <Card
            className="p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up bg-secondary/10 border-secondary/30"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="text-4xl font-bold text-secondary mb-2">
              {assistsLeader?.regularSeason ? assistsLeader.regularSeason.ast.toFixed(1) : "-"}
            </div>
            <div className="text-sm text-muted-foreground mb-1">Highest Assists Average</div>
            <div className="text-xs text-secondary">{assistsLeader?.playername ?? "TBD"}</div>
          </Card>

          <Card
            className="p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up bg-accent/10 border-accent/30"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="text-4xl font-bold text-accent mb-2">
              {reboundsLeader?.regularSeason ? reboundsLeader.regularSeason.reb.toFixed(1) : "-"}
            </div>
            <div className="text-sm text-muted-foreground mb-1">Highest Rebounds Average</div>
            <div className="text-xs text-accent">{reboundsLeader?.playername ?? "TBD"}</div>
          </Card>
        </div>
      </div>
    </section>
  )
}
