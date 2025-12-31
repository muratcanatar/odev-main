"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-xl">
              NBA
            </div>
            <span className="font-bold text-xl">Stats Hub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/#players" className="text-muted-foreground hover:text-foreground transition-colors">
              Players
            </Link>
            <Link href="/#teams" className="text-muted-foreground hover:text-foreground transition-colors">
              Teams
            </Link>
            <Link href="/#stats" className="text-muted-foreground hover:text-foreground transition-colors">
              Statistics
            </Link>
            <Button className="bg-primary hover:bg-primary/90">Playoff Stats</Button>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in-up">
            <Link
              href="/#players"
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Players
            </Link>
            <Link
              href="/#teams"
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Teams
            </Link>
            <Link
              href="/#stats"
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Statistics
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
