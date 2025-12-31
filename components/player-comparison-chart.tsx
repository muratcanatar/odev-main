"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface ComparisonData {
  category: string
  regular: number
  playoffs: number
}

interface PlayerComparisonChartProps {
  data: ComparisonData[]
}

export function PlayerComparisonChart({ data }: PlayerComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.3} />
        <XAxis dataKey="category" stroke="#f97316" tick={{ fill: "#ffffff", fontSize: 14, fontWeight: 600 }} />
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
        <Bar dataKey="regular" fill="#f97316" name="Regular Season" radius={[8, 8, 0, 0]} />
        <Bar dataKey="playoffs" fill="#a855f7" name="Playoffs" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
