import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Activity } from "lucide-react"
import Link from "next/link"
import { PlayerWithStats } from "@/lib/types"

interface TopPlayersProps {
  players: PlayerWithStats[]
}

export function TopPlayers({ players }: TopPlayersProps) {
  return (
    <section id="players" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12 animate-fade-in-up">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-2">Top Performance</h2>
            <p className="text-muted-foreground text-lg">2023-24 Season Leaders</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2 bg-primary/10 border-primary">
            Regular Season
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {players.map((player, index) => {
            const regularSeason = player.regularSeason

            return (
              <Link key={player.playerid} href={`/player/${player.playerid}`}>
                <Card
                  className="group relative overflow-hidden bg-card hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-primary/20 text-primary border-primary/30">#{index + 1}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {player.position}
                    </Badge>
                  </div>

                  <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={player.headshoturl || "/placeholder.svg"}
                      alt={player.playername}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{player.playername}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{player.team?.teamname ?? "Unknown Team"}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Points</span>
                      <span className="font-bold text-primary">
                        {regularSeason ? regularSeason.pts.toFixed(1) : "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Assists</span>
                      <span className="font-bold text-secondary">
                        {regularSeason ? regularSeason.ast.toFixed(1) : "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rebounds</span>
                      <span className="font-bold text-accent">
                        {regularSeason ? regularSeason.reb.toFixed(1) : "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Efficiency
                      </span>
                      <span className="font-bold flex items-center gap-1">
                        {regularSeason ? (regularSeason.pts + regularSeason.ast + regularSeason.reb).toFixed(1) : "-"}
                        <TrendingUp className="w-3 h-3 text-accent" />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
