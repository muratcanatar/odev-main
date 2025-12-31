"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Users, Shield, Trophy, Calendar, BarChart3, Settings } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Teams", href: "/teams", icon: Shield },
    { name: "Players", href: "/players", icon: Users },
    { name: "Standings", href: "/standings", icon: Trophy },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Stats", href: "/stats", icon: BarChart3 },
  ]

  const isAdmin = pathname?.startsWith("/admin")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="hidden font-bold sm:inline-block text-xl text-slate-800">
              NBA Stats Hub
            </span>
          </Link>

          {!isAdmin && (
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-2",
                        isActive && "bg-slate-800 hover:bg-slate-700"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Link href="/">
              <Button variant="outline" size="sm">
                Exit Admin
              </Button>
            </Link>
          ) : (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
