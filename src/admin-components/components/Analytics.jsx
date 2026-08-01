import React from "react";
import PageHeader from "./PageHeader";
import { Sparkline, BarList } from "./AnalyticsCharts";

/**
 * Analytics Component
 * Props: 
 *  - summary: array of summary metrics (label, value, delta)
 *  - trend: array of numbers representing daily article counts
 *  - categories: array of category breakdown (label, value)
 * Note: All data should be fetched from backend analytics APIs
 */
export default function Analytics({ summary, trend, categories }) {
  return (
    <>
      <PageHeader title="Analytics" subtitle="Editorial throughput and content performance." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        {summary.map((s, i) => (
          <div
            key={s.label}
            className="hover-lift bg-surface-container-lowest border border-outline-variant p-5 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{s.label}</p>
            <div className="flex items-end gap-2">
              <span className="font-headline-lg text-headline-lg text-primary">{s.value}</span>
              <span className="font-data-tabular text-data-tabular text-accent mb-1">{s.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-6">
          <h3 className="font-headline-md text-headline-md text-primary mb-4">Articles Published — Last 12 Days</h3>
          <Sparkline data={trend} />
        </div>

        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-6">
          <h3 className="font-headline-md text-headline-md text-primary mb-4">By Category</h3>
          <BarList items={categories} />
        </div>
      </div>
    </>
  );
}
