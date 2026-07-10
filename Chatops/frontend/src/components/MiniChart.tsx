import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  values: Array<{ ts: number; value: number }>;
  meta?: { unit?: string; seriesLabel?: string };
}

export default function MiniChart({ values, meta }: MiniChartProps) {
  const data = values.map((v) => ({ x: new Date(v.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), y: v.value }));
  return (
    <div style={{ width: '100%', height: 140 }} className="mini-chart-root">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
          <XAxis dataKey="x" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value: any) => `${value} ${meta?.unit || ''}`} />
          <Line type="monotone" dataKey="y" stroke="#d90429" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
