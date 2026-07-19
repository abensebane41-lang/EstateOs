"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslations } from "next-intl";

const STATUS_KEYS = ["NEW", "CONTACTED", "INTERESTED", "NEGOTIATION", "CONVERTED", "LOST"] as const;

const COLORS: Record<string, string> = {
  NEW: "#0F2747",
  CONTACTED: "#D97706",
  INTERESTED: "#059669",
  NEGOTIATION: "#C9A227",
  CONVERTED: "#10B981",
  LOST: "#94A3B8",
};

export function LeadStatusChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const t = useTranslations("leadStatus");

  const translatedData = data.map((item) => ({
    ...item,
    name: STATUS_KEYS.includes(item.name as typeof STATUS_KEYS[number]) ? t(item.name) : item.name,
  }));

  const colorMap: Record<string, string> = {};
  STATUS_KEYS.forEach((key) => {
    colorMap[t(key)] = COLORS[key];
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={translatedData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
          {translatedData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={colorMap[entry.name] || "#94A3B8"} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
