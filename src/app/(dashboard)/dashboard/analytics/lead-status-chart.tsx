"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  "جديد": "#0F2747",
  "تم التواصل": "#D97706",
  "مهتم": "#059669",
  "تفاوض": "#C9A227",
  "تم التحويل": "#10B981",
  "مفقود": "#94A3B8",
};

export function LeadStatusChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || "#94A3B8"} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
