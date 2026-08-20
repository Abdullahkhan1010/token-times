import React, { useState } from "react";

/**
 * Fully Mobile-Responsive SVG Line & Area Chart
 * Clamps tooltips inside boundaries to prevent any overflow or clipping.
 */
export function TrendAreaChart({ data = [], labels = [], title = "Articles Published", color = "#D4AF37", height = 240 }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-[#F2E7E1]/30 border border-dashed border-[#E2D4CB] rounded-xl text-xs text-[#5C525A]">
        No activity recorded in this period.
      </div>
    );
  }

  const width = 800;
  const paddingX = 48;
  const paddingY = 36;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const maxVal = Math.max(...data, 4);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const step = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

  const points = data.map((v, i) => {
    const x = paddingX + i * step;
    const y = paddingY + chartHeight - ((v - minVal) / range) * chartHeight;
    return {
      x,
      y,
      value: v,
      label: labels[i]?.label || labels[i] || `Day ${i + 1}`,
      fullDate: labels[i]?.key || "",
    };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="w-full space-y-2 select-none">
      {/* Dynamic Active Point Header Summary */}
      <div className="flex items-center justify-between min-h-[28px] px-1 text-xs">
        {activePoint ? (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="font-bold text-[#0C133D]">{activePoint.label}</span>
            <span className="text-[#5C525A]">•</span>
            <span className="font-mono font-bold text-[#0C133D] bg-[#F2E7E1] px-2 py-0.5 rounded border border-[#E2D4CB]">
              {activePoint.value} {activePoint.value === 1 ? "article" : "articles"}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-[#7F707A] italic">Hover or tap points to inspect daily activity</span>
        )}
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible touch-none"
          onMouseLeave={() => setHoverIndex(null)}
          onTouchEnd={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="responsiveAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.30" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.33, 0.66, 1].map((pct, i) => {
            const y = paddingY + chartHeight * (1 - pct);
            const val = Math.round(minVal + pct * range);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E2D4CB"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="11"
                  fill="#7F707A"
                  fontFamily="IBM Plex Sans"
                  fontWeight="500"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#responsiveAreaGradient)" />

          {/* Line stroke */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive vertical guide line */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={paddingY}
              x2={activePoint.x}
              y2={height - paddingY}
              stroke="#0C133D"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
          )}

          {/* Interactive points */}
          {points.map((p, i) => {
            const isHovered = hoverIndex === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoverIndex(i)}
                onTouchStart={() => setHoverIndex(i)}
                className="cursor-pointer"
              >
                {/* Larger transparent hit area for easy touch on mobile */}
                <circle cx={p.x} cy={p.y} r="16" fill="transparent" />

                {/* Visible dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? "#0C133D" : color}
                  stroke="#FFFFFF"
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="transition-all duration-150"
                />

                {/* Bounded in-chart tooltip pill (safely clamped within chart margins) */}
                {isHovered && (
                  <g>
                    {(() => {
                      const pillWidth = 76;
                      const pillHeight = 24;
                      const pillX = Math.max(
                        paddingX,
                        Math.min(width - paddingX - pillWidth, p.x - pillWidth / 2)
                      );
                      const pillY = Math.max(10, p.y - 32);

                      return (
                        <>
                          <rect
                            x={pillX}
                            y={pillY}
                            width={pillWidth}
                            height={pillHeight}
                            rx="5"
                            fill="#0C133D"
                            stroke="#D4AF37"
                            strokeWidth="1"
                          />
                          <text
                            x={pillX + pillWidth / 2}
                            y={pillY + 15}
                            textAnchor="middle"
                            fontSize="11"
                            fill="#FFFFFF"
                            fontWeight="bold"
                            fontFamily="Inter"
                          >
                            {p.value} {p.value === 1 ? "article" : "articles"}
                          </text>
                        </>
                      );
                    })()}
                  </g>
                )}

                {/* X-axis date labels */}
                {i % Math.max(1, Math.floor(points.length / 6)) === 0 && (
                  <text
                    x={p.x}
                    y={height - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#5C525A"
                    fontFamily="Inter"
                    fontWeight="500"
                  >
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/**
 * Mobile-Responsive Scrollable Category / Ranking List
 * Includes scrollable viewport so long category lists never stretch out sibling charts.
 */
export function CategoryBarList({ items = [], maxItemsBeforeScroll = 6, maxHeight = "280px" }) {
  if (!items || items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-[#5C525A]">
        No categories available in the database.
      </div>
    );
  }

  const maxVal = Math.max(...items.map((i) => i.value), 1);
  const totalVal = items.reduce((acc, i) => acc + i.value, 0) || 1;

  return (
    <div
      className="flex flex-col gap-3 overflow-y-auto pr-1.5"
      style={{ maxHeight }}
    >
      {items.map((item, idx) => {
        const percentage = Math.round((item.value / totalVal) * 100);
        return (
          <div key={item.label || idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="w-4 h-4 rounded-full bg-[#0C133D] text-[#D4AF37] text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-bold text-[#0C133D] truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold text-[#5C525A]">{item.value}</span>
                <span className="text-[10px] font-mono font-bold text-[#D4AF37] bg-[#0C133D] px-1.5 py-0.5 rounded">
                  {percentage}%
                </span>
              </div>
            </div>

            <div className="h-2 w-full bg-[#F2E7E1] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0C133D] to-[#D4AF37] rounded-full transition-all duration-500"
                style={{ width: `${Math.max(4, (item.value / maxVal) * 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Legacy Sparkline export for backward compatibility */
export function Sparkline({ data = [], width = 560, height = 140, stroke = "#D4AF37" }) {
  return <TrendAreaChart data={data} color={stroke} height={height} />;
}

/** Legacy BarList export */
export function BarList({ items = [] }) {
  return <CategoryBarList items={items} />;
}
