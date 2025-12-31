"use client"

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"

interface RadarChartData {
  stat: string
  value: number
}

interface PlayerRadarChartProps {
  data: RadarChartData[]
}

export function PlayerRadarChart({ data }: PlayerRadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid stroke="#f97316" strokeOpacity={0.5} strokeWidth={1.5} />
        <PolarAngleAxis dataKey="stat" stroke="#f97316" tick={{ fill: "#ffffff", fontSize: 16, fontWeight: 600 }} />
        <PolarRadiusAxis stroke="#f97316" tick={{ fill: "#ffffff", fontSize: 14 }} angle={90} />
        <Radar name="Performance" dataKey="value" stroke="#f97316" strokeWidth={3} fill="#f97316" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
