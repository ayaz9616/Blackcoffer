"use client";
import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FilterPanel, { FilterState } from '@/components/filters/FilterPanel';
import KPICards from '@/components/cards/KPICards';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import BubbleChart from '@/components/charts/BubbleChart';
import ScatterPlot from '@/components/charts/ScatterPlot';
import MapChart from '@/components/charts/MapChart';
import Modal from '@/components/Modal';
import { Entry } from '@/types/Entry';

const chartTypes = [
  { key: 'bar', label: 'Intensity by Sector', component: BarChart },
  { key: 'line', label: 'Likelihood over End Years', component: LineChart },
  { key: 'pie', label: 'Topic Distribution', component: PieChart },
  { key: 'bubble', label: 'Intensity vs Relevance vs Likelihood', component: BubbleChart },
  { key: 'scatter', label: 'Impact vs Likelihood', component: ScatterPlot },
  { key: 'map', label: 'Entries by Country', component: MapChart },
];

export default function Home() {
  const [pendingFilters, setPendingFilters] = useState<FilterState>({});
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({});
  const [analytics, setAnalytics] = useState({
    total: 0,
    avgIntensity: 0,
    avgRelevance: 0,
    avgLikelihood: 0,
    activeTopics: 0,
  });
  const [modalChart, setModalChart] = useState<string | null>(null);
  const [modalData, setModalData] = useState<Entry[]>([]);
  const [uploading, setUploading] = useState(false);
  const filterPanelRef = useRef<{ selectAll: () => void } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(appliedFilters).forEach(([key, vals]) => vals.forEach(v => params.append(key, v)));
    fetch(`/api/analytics?${params}`)
      .then(res => res.json())
      .then(setAnalytics);
  }, [appliedFilters]);

  // Fetch filtered data for modal
  useEffect(() => {
    if (!modalChart) return;
    const params = new URLSearchParams();
    Object.entries(appliedFilters).forEach(([key, vals]) => vals.forEach(v => params.append(key, v)));
    fetch(`/api/data?${params}`)
      .then(res => res.json())
      .then(setModalData);
  }, [modalChart, appliedFilters]);

  // Download sample file
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/jsondata.json';
    link.download = 'jsondata.json';
    link.click();
  };

  // Upload custom file
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const text = await file.text();
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: text,
      });
      if (res.ok) {
        alert('Custom data uploaded and seeded!');
        window.location.reload();
      } else {
        alert('Failed to upload data.');
      }
    } catch {
      alert('Failed to upload data.');
    }
    setUploading(false);
  };

  return (
    <DashboardLayout>
      <section id="filters" className="mb-8">
        <div className="mb-4 font-semibold text-lg card-title flex flex-wrap gap-4 items-center justify-between">
          <span>Filters</span>
          <div className="flex gap-2 flex-wrap">
            <button className="btn-primary px-4 py-1 text-sm" onClick={handleDownload} type="button">Download Sample</button>
            <label className="btn-primary px-4 py-1 text-sm cursor-pointer">
              {uploading ? 'Uploading...' : 'Upload Custom File'}
              <input type="file" accept="application/json" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <button className="btn-primary px-4 py-1 text-sm" type="button" onClick={() => filterPanelRef.current?.selectAll()}>Select All Filters</button>
          </div>
        </div>
        <div className="card p-4 backdrop-blur-md">
          <FilterPanel ref={filterPanelRef} filters={pendingFilters} setFilters={setPendingFilters} />
          <div className="mt-4 flex justify-end">
            <button
              className="btn-primary px-6 py-2 shadow"
              onClick={() => setAppliedFilters(pendingFilters)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </section>
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICards {...analytics} />
        </div>
      </section>
      <section id="charts" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {chartTypes.map(({ key, label, component: ChartComp }) => (
          <div
            key={key}
            className="card p-4 cursor-pointer hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 animate-fadeIn"
            onClick={() => setModalChart(key)}
            title={`Expand ${label}`}
          >
            <div className="font-semibold text-lg card-title mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
              {label}
            </div>
            <ChartComp filters={appliedFilters} />
          </div>
        ))}
      </section>
      <Modal open={!!modalChart} onClose={() => setModalChart(null)}>
        {modalChart && (
          <div className="modal-card">
            <div className="text-2xl font-bold mb-4 card-title flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[var(--primary)] animate-pulse"></span>
              {chartTypes.find(c => c.key === modalChart)?.label}
            </div>
            <div className="mb-6">
              {React.createElement(chartTypes.find(c => c.key === modalChart)!.component, { filters: appliedFilters })}
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="font-semibold mb-2 card-muted">Related Entries</div>
              <ul className="divide-y divide-[var(--border)]">
                {modalData.length === 0 && <li className="text-[var(--text-muted)]">No entries found.</li>}
                {modalData.map((entry, i) => (
                  <li key={i} className="py-3">
                    <div className="font-bold text-[var(--primary)] text-base mb-1">{entry.title}</div>
                    <div className="text-sm text-[var(--text-primary)] mb-1">{entry.insight}</div>
                    <div className="text-xs text-[var(--text-muted)]">Source: {entry.source} | Topic: {entry.topic} | Sector: {entry.sector}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
