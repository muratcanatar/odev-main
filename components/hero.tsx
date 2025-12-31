"use client"

import { TrendingUp, Users, Trophy } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-6 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-balance">
            NBA 2023-24
            <span className="block text-primary mt-2">Statistics Hub</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Player performance, team standings, and detailed playoff statistics
          </p>

          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="flex items-center gap-3 animate-slide-in-left">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">450+</div>
                <div className="text-sm text-muted-foreground">Players</div>
              </div>
            </div>

            <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">30</div>
                <div className="text-sm text-muted-foreground">Teams</div>
              </div>
            </div>

            <div className="flex items-center gap-3 animate-slide-in-right">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">1,230</div>
                <div className="text-sm text-muted-foreground">Games</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
    </section>
  )
}
