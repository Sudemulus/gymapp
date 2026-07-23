"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { muscleGroupLabel } from "@/lib/muscleGroups";
import { MUSCLE_GROUP_COLORS, OTHER_COLOR } from "@/lib/muscleGroupColors";

const MAX_SEGMENTS = 5;
const LABEL_THRESHOLD = 0.08;

function formatVolume(value) {
  return new Intl.NumberFormat("tr-TR").format(Math.round(value));
}

// Cap at MAX_SEGMENTS named slices + one "Diğer" bucket so the donut stays
// readable (segment cap per part-to-whole guidance) instead of growing per muscle group.
function buildSegments(muscleGroupVolume) {
  const sorted = [...muscleGroupVolume].sort((a, b) => b.totalVolume - a.totalVolume);
  const head = sorted.slice(0, MAX_SEGMENTS);
  const tail = sorted.slice(MAX_SEGMENTS);

  const segments = head.map((item) => ({
    key: item.muscleGroup,
    name: muscleGroupLabel(item.muscleGroup),
    value: item.totalVolume,
    color: MUSCLE_GROUP_COLORS[item.muscleGroup] ?? OTHER_COLOR,
  }));

  const tailTotal = tail.reduce((sum, item) => sum + item.totalVolume, 0);
  if (tailTotal > 0) {
    segments.push({ key: "OTHER", name: "Diğer", value: tailTotal, color: OTHER_COLOR });
  }

  return segments;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, percent } = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-slate-100">{formatVolume(value)} kg</p>
      <p className="text-slate-400">
        {name} · %{Math.round(percent * 100)}
      </p>
    </div>
  );
}

export default function MuscleGroupDonutChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-slate-400">
        Son 30 günde tamamlanmış set bulunmuyor.
      </p>
    );
  }

  const segments = buildSegments(data);
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const withPercent = segments.map((s) => ({ ...s, percent: total > 0 ? s.value / total : 0 }));

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <ResponsiveContainer width="100%" height={220} className="sm:w-1/2">
        <PieChart>
          <Pie
            data={withPercent}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={2}
            stroke="#0f172a"
            strokeWidth={2}
            label={({ percent }) =>
              percent >= LABEL_THRESHOLD ? `%${Math.round(percent * 100)}` : null
            }
            labelLine={false}
          >
            {withPercent.map((segment) => (
              <Cell key={segment.key} fill={segment.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <ul className="flex w-full flex-col gap-2 text-sm sm:w-1/2">
        {withPercent.map((segment) => (
          <li key={segment.key} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-slate-300">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              {segment.name}
            </span>
            <span className="tabular-nums text-slate-400">
              {formatVolume(segment.value)} kg · %{Math.round(segment.percent * 100)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
