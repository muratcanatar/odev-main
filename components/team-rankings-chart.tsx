"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface RankingDatum {
  category: string
  value: number
}

interface TeamRankingsChartProps {
  data: RankingDatum[]
}

export function TeamRankingsChart({ data }: TeamRankingsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.3} />
        <XAxis dataKey="category" stroke="#f97316" tick={{ fill: "#ffffff", fontSize: 12 }} />
        <YAxis stroke="#f97316" tick={{ fill: "#ffffff", fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #f97316",
            borderRadius: "8px",
            color: "#ffffff",
          }}
        />
        <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
