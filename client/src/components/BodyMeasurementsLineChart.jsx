"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BODY_METRICS } from "@/lib/bodyMetricColors";

function formatDate(date) {
  return new Date(date).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm shadow-lg">
      <p className="text-slate-400">{formatDate(label)}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="mt-1 flex items-center gap-2">
          <span className="inline-block h-0.5 w-3" style={{ backgroundColor: entry.color }} />
          <span className="font-semibold text-slate-100">{entry.value} cm</span>
          <span className="text-slate-400">{entry.name}</span>
        </p>
      ))}
    </div>
  );
}

export default function BodyMeasurementsLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-slate-400">
        Henüz ölçü kaydı bulunmuyor.
      </p>
    );
  }

  const activeMetrics = BODY_METRICS.filter((metric) =>
    data.some((point) => point[metric.key] !== null && point[metric.key] !== undefined)
  );

  if (activeMetrics.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-slate-400">
        Henüz ölçü kaydı bulunmuyor.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 40, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          stroke="#475569"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
        />
        <YAxis stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} width={40} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#475569" }} />
        <Legend
          formatter={(value) => <span className="text-slate-300">{value}</span>}
          iconType="line"
        />
        {activeMetrics.map((metric) => (
          <Line
            key={metric.key}
            type="monotone"
            dataKey={metric.key}
            name={metric.label}
            stroke={metric.color}
            strokeWidth={2}
            connectNulls
            dot={{ r: 4, fill: metric.color, stroke: "#0f172a", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: metric.color, stroke: "#0f172a", strokeWidth: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
