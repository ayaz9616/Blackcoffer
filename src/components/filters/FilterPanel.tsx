"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false });

const filterFields = [
  { key: 'end_year', label: 'End Year' },
  { key: 'topic', label: 'Topic' },
  { key: 'sector', label: 'Sector' },
  { key: 'region', label: 'Region' },
  { key: 'country', label: 'Country' },
  { key: 'city', label: 'City' },
  { key: 'pestle', label: 'PEST' },
  { key: 'source', label: 'Source' },
  { key: 'swot', label: 'SWOT' },
];

export type FilterState = Record<string, string[]>;

type OptionType = { value: string; label: string };

const FilterPanel = forwardRef(function FilterPanel({ filters, setFilters }: {
  filters: FilterState,
  setFilters: (f: FilterState) => void
}, ref) {
  const [options, setOptions] = useState<Record<string, OptionType[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/filters')
      .then(res => res.json())
      .then(data => {
        const opts: Record<string, OptionType[]> = {};
        filterFields.forEach(f => {
          opts[f.key] = (data[f.key] || []).filter(Boolean).map((v: string) => ({ value: v, label: v }));
        });
        setOptions(opts);
        setLoading(false);
      });
  }, []);

  const selectAllField = (key: string) => {
    setFilters({ ...filters, [key]: (options[key] || []).map(opt => opt.value) });
  };

  useImperativeHandle(ref, () => ({
    selectAll: () => {
      const all: FilterState = {};
      filterFields.forEach(f => {
        all[f.key] = (options[f.key] || []).map(opt => opt.value);
      });
      setFilters(all);
    }
  }));

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filterFields.map(f => {
          return (
            <div key={f.key} className="max-h-40 overflow-y-auto pr-1">
              <label className="block mb-1 text-sm font-medium flex items-center justify-between">
                {f.label}
                <span className="flex gap-1">
                  <button
                    type="button"
                    className="text-xs text-[var(--secondary)] hover:underline ml-2"
                    onClick={() => selectAllField(f.key)}
                    tabIndex={-1}
                  >Select All</button>
                </span>
              </label>
              <Select
                inputId={`filter-${f.key}`}
                isMulti
                isLoading={loading}
                options={options[f.key] || []}
                value={(filters[f.key] || []).map((v: string) => ({ value: v, label: v }))}
                key={filters[f.key]?.join(',') || 'empty'}
                onChange={(newValue: unknown) => setFilters({ ...filters, [f.key]: (Array.isArray(newValue) ? (newValue as OptionType[]).map(v => v.value) : []) })}
                classNamePrefix="react-select"
                placeholder={`Select ${f.label}`}
                styles={{
                  control: (base) => ({ ...base, minHeight: 36, borderRadius: 8, boxShadow: 'none', borderColor: '#d1d5db' }),
                  multiValue: (base) => ({ ...base, backgroundColor: '#f3f4f6', borderRadius: 6 }),
                  option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#e0e7ff' : undefined, color: state.isSelected ? '#fff' : '#111827' }),
                  menu: (base) => ({ ...base, maxHeight: 120, zIndex: 9999, minWidth: '100%', width: '100%', left: 0 }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999, minWidth: '100%', width: '100%' }),
                }}
                aria-label={f.label}
                menuPlacement="bottom"
                menuPosition="absolute"
              />
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors duration-150"
          onClick={() => {
            const reset: FilterState = {};
            filterFields.forEach(f => { reset[f.key] = []; });
            setFilters(reset);
          }}
          title="Clear all selected filters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reset Filters
        </button>
      </div>
    </div>
  );
});

export default FilterPanel; 