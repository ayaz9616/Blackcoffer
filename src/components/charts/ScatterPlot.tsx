"use client";
import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

interface ScatterPlotProps {
  filters: Record<string, string[]>;
}

export default function ScatterPlot({ filters }: ScatterPlotProps) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, vals]) => vals.forEach(v => params.append(key, v)));
    fetch(`/api/data?${params}`)
      .then(async res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const text = await res.text();
        if (!text) return [];
        try {
          return JSON.parse(text);
        } catch {
          return [];
        }
      })
      .then(entries => {
        const points = entries.filter((e: any) => e.impact && e.likelihood).map((e: any) => ({
          x: Number(e.impact) || 0,
          y: e.likelihood,
        }));
        setData({
          datasets: [
            {
              label: 'Impact vs Likelihood',
              data: points,
              backgroundColor: 'rgba(251,191,36,0.7)',
            },
          ],
        });
      })
      .catch(() => setData({ datasets: [{ label: 'Impact vs Likelihood', data: [], backgroundColor: 'rgba(251,191,36,0.7)' }] }));
  }, [filters]);
  if (!data) return <div>Loading...</div>;
  if (!data.datasets[0].data.length) return <div className="w-full h-[350px] flex items-center justify-center text-[var(--text-muted)]">No impact/likelihood data available.</div>;
  return <Scatter data={data} options={{ responsive: true, plugins: { title: { display: true, text: 'Impact vs Likelihood' } } }} />;
} 