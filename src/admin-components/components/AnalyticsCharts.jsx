import React from "react";

/** Minimal SVG sparkline — no charting library required. */
export function Sparkline({ data, width = 560, height = 140, stroke = "#0E7C61" }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 20) - 10}`)
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
      <polyline points={areaPoints} fill="#DCF3EA" opacity="0.5" stroke="none" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={height - ((v - min) / range) * (height - 20) - 10}
          r="3"
          fill={stroke}
        />
      ))}
    </svg>
  );
}

/** Horizontal bar list — value out of the group's max. */
export function BarList({ items }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between mb-1">
            <span className="font-body-md text-body-md text-on-surface">{item.label}</span>
            <span className="font-data-tabular text-data-tabular text-on-surface-variant">{item.value}</span>
          </div>
          <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
