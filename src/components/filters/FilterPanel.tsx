"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false });

const filterFields = [
  { key: 'end_year', label: 'End Year', icon: '📅' },
  { key: 'topic', label: 'Topic', icon: '🏷️' },
  { key: 'sector', label: 'Sector', icon: '🏢' },
  { key: 'region', label: 'Region', icon: '🌍' },
  { key: 'country', label: 'Country', icon: '🏳️' },
  { key: 'city', label: 'City', icon: '🏙️' },
  { key: 'pestle', label: 'PEST', icon: '📊' },
  { key: 'source', label: 'Source', icon: '📰' },
  { key: 'swot', label: 'SWOT', icon: '🎯' },
];

export type FilterState = Record<string, string[]>;

type OptionType = { value: string; label: string };

const FilterPanel = forwardRef(function FilterPanel({ filters, setFilters }: {
  filters: FilterState,
  setFilters: (f: FilterState) => void
}, ref) {
  const [options, setOptions] = useState<Record<string, OptionType[]>>({});
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

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

  useEffect(() => {
    const count = Object.values(filters).reduce((acc, vals) => acc + vals.length, 0);
    setActiveFilters(count);
  }, [filters]);

  const selectAllField = (key: string) => {
    setFilters({ ...filters, [key]: (options[key] || []).map(opt => opt.value) });
  };

  const clearField = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  const resetAllFilters = () => {
    setFilters({});
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Filters</h3>
            <p className="text-sm text-gray-500">
              {activeFilters > 0 
                ? `${activeFilters} filter${activeFilters !== 1 ? 's' : ''} active`
                : 'No filters applied'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterFields.map(field => {
          const selectedCount = filters[field.key]?.length || 0;
          const totalOptions = options[field.key]?.length || 0;
          
          return (
            <div key={field.key} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{field.icon}</span>
                  <label className="text-sm font-semibold text-gray-900" htmlFor={`filter-${field.key}`}>
                    {field.label}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {selectedCount}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => selectAllField(field.key)}
                      className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                      title={`Select all ${field.label}`}
                    >
                      Select All
                    </button>
                    {selectedCount > 0 && (
                      <button
                        type="button"
                        onClick={() => clearField(field.key)}
                        className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                        title={`Remove all ${field.label}`}
                      >
                        Remove All
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Select
                  inputId={`filter-${field.key}`}
                  isMulti
                  isLoading={loading}
                  options={options[field.key] || []}
                  value={(filters[field.key] || []).map((v: string) => ({ value: v, label: v }))}
                  key={`${field.key}-${filters[field.key]?.join(',') || 'empty'}`}
                  onChange={(newValue: unknown) => {
                    const newFilters = { ...filters };
                    if (Array.isArray(newValue) && newValue.length > 0) {
                      newFilters[field.key] = (newValue as OptionType[]).map(v => v.value);
                    } else {
                      delete newFilters[field.key];
                    }
                    setFilters(newFilters);
                  }}
                  classNamePrefix="react-select"
                  placeholder={`Select ${field.label.toLowerCase()}...`}
                  noOptionsMessage={() => `No ${field.label.toLowerCase()} available`}
                  loadingMessage={() => `Loading ${field.label.toLowerCase()}...`}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: 40,
                      maxHeight: 120,
                      borderRadius: 8,
                      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                      '&:hover': {
                        borderColor: '#3b82f6'
                      }
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      maxHeight: 80,
                      overflow: 'auto'
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#eff6ff',
                      borderRadius: 6,
                      '.react-select__multi-value__label': {
                        color: '#1e40af',
                        fontWeight: 500
                      }
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: '#1e40af',
                      '&:hover': {
                        backgroundColor: '#dbeafe',
                        color: '#dc2626'
                      }
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected 
                        ? '#3b82f6' 
                        : state.isFocused 
                          ? '#eff6ff' 
                          : undefined,
                      color: state.isSelected ? '#ffffff' : '#374151',
                      '&:hover': {
                        backgroundColor: state.isSelected ? '#3b82f6' : '#eff6ff'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      maxHeight: 150,
                      zIndex: 9999,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: 4,
                      overflow: 'hidden'
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: 150,
                      overflow: 'auto'
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#9ca3af',
                      fontSize: '14px'
                    })
                  }}
                  aria-label={`Select ${field.label}`}
                  menuPlacement="bottom"
                  menuPosition="absolute"
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                />
              </div>
              
              {totalOptions > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {selectedCount} of {totalOptions} selected
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {activeFilters > 0 
            ? `Showing results for ${activeFilters} applied filter${activeFilters !== 1 ? 's' : ''}`
            : 'All data will be shown when filters are applied'
          }
        </div>
        
        <div className="flex items-center gap-3">
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default FilterPanel; 