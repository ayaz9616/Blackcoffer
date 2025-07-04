"use client";
import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Entry } from '@/types/Entry';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

interface BubbleChartProps {
  filters: Record<string, string[]>;
}

export default function BubbleChart({ filters }: BubbleChartProps) {
  const [data, setData] = useState<{ datasets: { label: string; data: { x: number; y: number; r: number }[]; backgroundColor: string }[] } | null>(null);
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, vals]) => vals.forEach(v => params.append(key, v)));
    fetch(`/api/data?${params}`)
      .then(res => res.json())
      .then((entries: Entry[]) => {
        setData({
          datasets: [
            {
              label: 'Intensity vs Relevance vs Likelihood',
              data: entries.filter((e: Entry) => e.intensity && e.relevance && e.likelihood).map((e: Entry) => ({
                x: e.intensity,
                y: e.relevance,
                r: Math.max(5, e.likelihood * 3),
              })),
              backgroundColor: 'rgba(139,92,246,0.5)',
            },
          ],
        });
      });
  }, [filters]);
  if (!data) return <div>Loading...</div>;
  return <Bubble data={data} options={{ responsive: true, plugins: { title: { display: true, text: 'Intensity vs Relevance vs Likelihood' } } }} />;
} 