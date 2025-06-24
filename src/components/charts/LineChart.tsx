"use client";
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface LineChartProps {
  filters: Record<string, string[]>;
}

export default function LineChart({ filters }: LineChartProps) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, vals]) => vals.forEach(v => params.append(key, v)));
    fetch(`/api/data?${params}`)
      .then(res => res.json())
      .then(entries => {
        const grouped: Record<string, number> = {};
        entries.forEach((e: any) => {
          if (!e.end_year) return;
          grouped[e.end_year] = (grouped[e.end_year] || 0) + (e.likelihood || 0);
        });
        const years = Object.keys(grouped).sort();
        setData({
          labels: years,
          datasets: [{
            label: 'Likelihood',
            data: years.map(y => grouped[y]),
            borderColor: 'rgba(16,185,129,1)',
            backgroundColor: 'rgba(16,185,129,0.2)',
            fill: true,
          }],
        });
      });
  }, [filters]);
  if (!data) return <div>Loading...</div>;
  return <Line data={data} options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Likelihood over End Years' } } }} />;
} 