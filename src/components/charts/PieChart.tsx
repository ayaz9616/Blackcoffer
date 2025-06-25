"use client";
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Entry } from '@/types/Entry';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  filters: Record<string, string[]>;
}

export default function PieChart({ filters }: PieChartProps) {
  const [data, setData] = useState<{ labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string[] }[] } | null>(null);
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, vals]) => vals.forEach(v => params.append(key, v)));
    fetch(`/api/data?${params}`)
      .then(res => res.json())
      .then((entries: Entry[]) => {
        const grouped: Record<string, number> = {};
        entries.forEach((e: Entry) => {
          if (!e.topic) return;
          grouped[e.topic] = (grouped[e.topic] || 0) + 1;
        });
        const topics = Object.keys(grouped);
        setData({
          labels: topics,
          datasets: [{
            label: 'Topic Distribution',
            data: Object.values(grouped),
            backgroundColor: topics.map((_, i) => `hsl(${i * 360 / topics.length}, 70%, 60%)`),
          }],
        });
      });
  }, [filters]);
  if (!data) return <div>Loading...</div>;
  return <Pie data={data} options={{ responsive: true, plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Topic Distribution' } } }} />;
} 