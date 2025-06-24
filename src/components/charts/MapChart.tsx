"use client";
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

// Map data country names to geo country names
const countryNameMap: Record<string, string> = {
  "United States of America": "United States",
  "Russia": "Russian Federation",
  "South Korea": "Korea, Republic of",
  "North Korea": "Korea, Democratic People's Republic of",
  "Iran": "Iran, Islamic Republic of",
  "Vietnam": "Viet Nam",
  "Syria": "Syrian Arab Republic",
  "Venezuela": "Venezuela, Bolivarian Republic of",
  "Tanzania": "Tanzania, United Republic of",
  "Bolivia": "Bolivia, Plurinational State of",
  "Moldova": "Moldova, Republic of",
  "Czech Republic": "Czechia",
  // Add more mappings as needed
};

interface MapChartProps {
  filters: Record<string, string[]>;
}

export default function MapChart({ filters }: MapChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [countryCounts, setCountryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, vals]) => vals.forEach(v => params.append(key, v)));
    fetch(`/api/data?${params}`)
      .then(async res => {
        if (!res.ok) return [];
        const text = await res.text();
        if (!text) return [];
        try {
          return JSON.parse(text);
        } catch {
          return [];
        }
      })
      .then(entries => {
        setData(entries);
        const counts: Record<string, number> = {};
        entries.forEach((e: any) => {
          if (!e.country) return;
          const mapped = countryNameMap[e.country] || e.country;
          counts[mapped] = (counts[mapped] || 0) + 1;
        });
        setCountryCounts(counts);
      });
  }, [filters]);

  // Simple color scale
  function getColor(count: number) {
    if (!count) return "#E5E7EB";
    if (count > 20) return "#4F46E5";
    if (count > 10) return "#6366F1";
    if (count > 5) return "#818CF8";
    return "#A5B4FC";
  }

  if (Object.keys(countryCounts).length === 0) {
    return <div className="w-full h-[350px] flex items-center justify-center text-[var(--text-muted)]">No country data available.</div>;
  }

  return (
    <div className="w-full h-[350px]">
      <ComposableMap projectionConfig={{ scale: 120 }} width={600} height={350}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const countryName = geo.properties.name;
              const count = countryCounts[countryName] || 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(count)}
                  stroke="#fff"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#0EA5E9", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="text-xs text-[var(--text-muted)] mt-2">Darker color = more entries for that country</div>
    </div>
  );
} 