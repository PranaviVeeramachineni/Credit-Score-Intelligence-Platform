import React from 'react';
import { useData } from '../contexts/DataContext';
import { Filter, X, RefreshCw } from 'lucide-react';

export default function FilterPanel() {
  const { filters, updateFilters, refreshData } = useData();

  const handleRiskLevelChange = (level: string) => {
    const newRiskLevels = filters.riskLevel.includes(level)
      ? filters.riskLevel.filter(r => r !== level)
      : [...filters.riskLevel, level];
    updateFilters({ riskLevel: newRiskLevels });
  };

  const handleStatusChange = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    updateFilters({ status: newStatuses });
  };

  const clearAllFilters = () => {
    updateFilters({
      searchTerm: '',
      riskLevel: [],
      status: [],
      scoreRange: [400, 800],
      dateRange: ['', '']
    });
  };

  const hasActiveFilters = filters.searchTerm || 
                         filters.riskLevel.length > 0 || 
                         filters.status.length > 0 ||
                         filters.scoreRange[0] !== 400 ||
                         filters.scoreRange[1] !== 800 ||
                         filters.dateRange[0] || 
                         filters.dateRange[1];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshData}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Applications
          </label>
          <input
            type="text"
            placeholder="Name or ID..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Risk Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Level
          </label>
          <div className="space-y-2">
            {['Low', 'Medium', 'High', 'Critical'].map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.riskLevel.includes(level)}
                  onChange={() => handleRiskLevelChange(level)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="space-y-2">
            {['Pending', 'Approved', 'Rejected', 'Under Review'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Score Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Score Range
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="300"
                max="850"
                value={filters.scoreRange[0]}
                onChange={(e) => updateFilters({ 
                  scoreRange: [parseInt(e.target.value) || 400, filters.scoreRange[1]] 
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                placeholder="Min"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                min="300"
                max="850"
                value={filters.scoreRange[1]}
                onChange={(e) => updateFilters({ 
                  scoreRange: [filters.scoreRange[0], parseInt(e.target.value) || 800] 
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{filters.scoreRange[0]}</span>
              <span>{filters.scoreRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}