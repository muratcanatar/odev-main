"use client"

import { useAdminDashboard } from "@/lib/api/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, Calendar, MapPin, Database, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { data: dashboardData } = useAdminDashboard()

  const stats = dashboardData?.data

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage NBA teams, players, fixtures, and statistics
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_teams || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active franchises</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_players || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered athletes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Fixtures</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_fixtures || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled games</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Arenas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_arenas || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Venues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Regular Stats</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_regular_stats || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Season records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Playoff Stats</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_playoff_stats || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Playoff records</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/teams">
          <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-600">
                <Shield className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-semibold">Manage Teams</p>
                <p className="text-sm text-muted-foreground">Edit franchises</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/players">
          <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 group-hover:bg-green-600">
                <Users className="h-6 w-6 text-green-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-semibold">Manage Players</p>
                <p className="text-sm text-muted-foreground">Edit athletes</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/fixtures">
          <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-600">
                <Calendar className="h-6 w-6 text-purple-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-semibold">Manage Fixtures</p>
                <p className="text-sm text-muted-foreground">Schedule games</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/arenas">
          <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 group-hover:bg-orange-600">
                <MapPin className="h-6 w-6 text-orange-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-semibold">Manage Arenas</p>
                <p className="text-sm text-muted-foreground">Edit venues</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

    </div>
  )
}
