"use client";
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Entry } from '@/types/Entry';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  filters: Record<string, string[]>;
}

export default function BarChart({ filters }: BarChartProps) {
  const [data, setData] = useState<{ labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] } | null>(null);
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, vals]) => vals.forEach(v => params.append(key, v)));
    fetch(`/api/data?${params}`)
      .then(res => res.json())
      .then((entries: Entry[]) => {
        const grouped: Record<string, number> = {};
        entries.forEach((e: Entry) => {
          if (!e.sector) return;
          grouped[e.sector] = (grouped[e.sector] || 0) + (e.intensity || 0);
        });
        setData({
          labels: Object.keys(grouped),
          datasets: [{
            label: 'Intensity',
            data: Object.values(grouped),
            backgroundColor: 'rgba(59,130,246,0.7)',
          }],
        });
      });
  }, [filters]);
  if (!data) return <div>Loading...</div>;
  return <Bar data={data} options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Intensity by Sector' } } }} />;
} 