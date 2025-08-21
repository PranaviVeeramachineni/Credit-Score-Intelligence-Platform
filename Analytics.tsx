import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { TrendingUp, Users, DollarSign, Percent } from 'lucide-react';

export default function Analytics() {
  const { applications, loading } = useData();

  const analytics = useMemo(() => {
    if (!applications.length) return null;

    // Risk distribution
    const riskDistribution = applications.reduce((acc, app) => {
      acc[app.riskLevel] = (acc[app.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Score distribution
    const scoreRanges = {
      'Excellent (750+)': 0,
      'Good (700-749)': 0,
      'Fair (650-699)': 0,
      'Poor (600-649)': 0,
      'Very Poor (<600)': 0
    };

    applications.forEach(app => {
      if (app.creditScore >= 750) scoreRanges['Excellent (750+)']++;
      else if (app.creditScore >= 700) scoreRanges['Good (700-749)']++;
      else if (app.creditScore >= 650) scoreRanges['Fair (650-699)']++;
      else if (app.creditScore >= 600) scoreRanges['Poor (600-649)']++;
      else scoreRanges['Very Poor (<600)']++;
    });

    // Monthly trends (simulated)
    const monthlyData = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
      applications: Math.floor(Math.random() * 50) + 30,
      avgScore: Math.floor(Math.random() * 100) + 600,
      approvalRate: Math.floor(Math.random() * 30) + 60
    }));

    // Income vs Score correlation
    const incomeScoreData = applications.map(app => ({
      income: app.income,
      score: app.creditScore,
      riskLevel: app.riskLevel
    }));

    return {
      riskDistribution,
      scoreRanges,
      monthlyData,
      incomeScoreData,
      totalApplications: applications.length,
      avgScore: Math.round(applications.reduce((sum, app) => sum + app.creditScore, 0) / applications.length),
      totalLoanValue: applications.reduce((sum, app) => sum + app.loanAmount, 0),
      approvalRate: Math.round((applications.filter(app => app.status === 'Approved').length / applications.length) * 100)
    };
  }, [applications]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">No data available for analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics</h1>
        <p className="text-gray-600">Deep insights into credit risk patterns and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{analytics.totalApplications}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Applications</p>
          <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{analytics.avgScore}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Average Credit Score</p>
          <p className="text-xs text-green-600 mt-1">↑ 2.3% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-teal-100">
              <DollarSign className="h-6 w-6 text-teal-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              ${(analytics.totalLoanValue / 1000000).toFixed(1)}M
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Loan Value</p>
          <p className="text-xs text-green-600 mt-1">↑ 15% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-purple-100">
              <Percent className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{analytics.approvalRate}%</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Approval Rate</p>
          <p className="text-xs text-red-600 mt-1">↓ 3% from last month</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Level Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analytics.riskDistribution).map(([level, count]) => {
              const percentage = (count / analytics.totalApplications) * 100;
              const colors = {
                Low: 'bg-green-500',
                Medium: 'bg-yellow-500',
                High: 'bg-orange-500',
                Critical: 'bg-red-500'
              };
              return (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-sm font-medium text-gray-700 w-16">{level}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${colors[level as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credit Score Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Credit Score Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analytics.scoreRanges).map(([range, count]) => {
              const percentage = (count / analytics.totalApplications) * 100;
              const colors = [
                'bg-green-500',
                'bg-blue-500',
                'bg-yellow-500',
                'bg-orange-500',
                'bg-red-500'
              ];
              const colorIndex = Object.keys(analytics.scoreRanges).indexOf(range);
              return (
                <div key={range} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-sm font-medium text-gray-700 w-24">{range}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${colors[colorIndex]}`}
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
          <div className="space-y-6">
            {/* Applications Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Applications per Month</h4>
              <div className="flex items-end space-x-2 h-32">
                {analytics.monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(data.applications / 80) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Average Score Trend */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Average Credit Score</h4>
              <div className="flex items-end space-x-2 h-20">
                {analytics.monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${((data.avgScore - 600) / 200) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-900 font-medium mt-1">{data.avgScore}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Income vs Credit Score */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Income vs Credit Score Correlation</h3>
          <div className="relative h-64 bg-gray-50 rounded-lg p-4">
            <svg width="100%" height="100%" viewBox="0 0 400 200">
              {analytics.incomeScoreData.slice(0, 20).map((data, index) => {
                const x = (data.income / 200000) * 360 + 20;
                const y = 180 - ((data.score - 400) / 400) * 160;
                const colors = {
                  Low: '#10B981',
                  Medium: '#F59E0B',
                  High: '#F97316',
                  Critical: '#EF4444'
                };
                return (
                  <circle
                    key={index}
                    cx={Math.min(Math.max(x, 10), 390)}
                    cy={Math.min(Math.max(y, 10), 190)}
                    r="4"
                    fill={colors[data.riskLevel as keyof typeof colors]}
                    opacity="0.7"
                  />
                );
              })}
              
              {/* Trend line */}
              <line
                x1="20"
                y1="160"
                x2="380"
                y2="40"
                stroke="#6B7280"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.5"
              />
              
              {/* Axes */}
              <line x1="20" y1="180" x2="380" y2="180" stroke="#E5E7EB" strokeWidth="1"/>
              <line x1="20" y1="20" x2="20" y2="180" stroke="#E5E7EB" strokeWidth="1"/>
              
              {/* Labels */}
              <text x="200" y="195" textAnchor="middle" className="text-xs fill-gray-500">Income ($)</text>
              <text x="10" y="100" textAnchor="middle" className="text-xs fill-gray-500" transform="rotate(-90, 10, 100)">Credit Score</text>
            </svg>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full opacity-70"></div>
              <span className="text-xs text-gray-600">Low Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-yellow-500 rounded-full opacity-70"></div>
              <span className="text-xs text-gray-600">Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-orange-500 rounded-full opacity-70"></div>
              <span className="text-xs text-gray-600">High Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-red-500 rounded-full opacity-70"></div>
              <span className="text-xs text-gray-600">Critical Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}