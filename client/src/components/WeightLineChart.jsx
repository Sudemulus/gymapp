"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { WEIGHT_LINE_COLOR } from "@/lib/bodyMetricColors";

function formatDate(date) {
  return new Date(date).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-slate-100">{point.weight} kg</p>
      <p className="text-slate-400">{formatDate(point.date)}</p>
    </div>
  );
}

export default function WeightLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-slate-400">
        Henüz kilo kaydı bulunmuyor.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          stroke="#475569"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          stroke="#475569"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
          width={40}
          domain={["dataMin - 2", "dataMax + 2"]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#475569" }} />
        <Line
          type="monotone"
          dataKey="weight"
          stroke={WEIGHT_LINE_COLOR}
          strokeWidth={2}
          dot={{ r: 4, fill: WEIGHT_LINE_COLOR, stroke: "#0f172a", strokeWidth: 2 }}
          activeDot={{ r: 5, fill: WEIGHT_LINE_COLOR, stroke: "#0f172a", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
