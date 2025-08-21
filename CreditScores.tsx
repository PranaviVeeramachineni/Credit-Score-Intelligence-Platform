import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import FilterPanel from './FilterPanel';
import { 
  Search, 
  Download, 
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export default function CreditScores() {
  const { filteredApplications, loading } = useData();
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Under Review':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-blue-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleExportData = () => {
    const csvContent = [
      ['Application ID', 'Applicant Name', 'Credit Score', 'Risk Level', 'Status', 'Loan Amount', 'Application Date'],
      ...filteredApplications.map(app => [
        app.id,
        app.applicantName,
        app.creditScore,
        app.riskLevel,
        app.status,
        app.loanAmount,
        new Date(app.applicationDate).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit_scores.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Score Analysis</h1>
          <p className="text-gray-600">Comprehensive credit assessment and risk evaluation</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel />

      {/* Results Summary */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredApplications.length}</span> applications
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span>Low Risk</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              <span>High Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Applied
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.applicantName}
                      </div>
                      <div className="text-sm text-gray-500">{application.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-lg font-bold ${getScoreColor(application.creditScore)}`}>
                        {application.creditScore}
                      </span>
                      <div className="ml-2">
                        {application.creditScore > 650 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(application.riskLevel)}`}>
                      {application.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(application.status)}
                      <span className="ml-2 text-sm text-gray-900">{application.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${application.loanAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedApplication(selectedApplication === application.id ? null : application.id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedApplication(null)}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const app = filteredApplications.find(a => a.id === selectedApplication);
              if (!app) return null;

              return (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Credit Assessment Details</h3>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Applicant Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{app.applicantName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Application ID:</span>
                          <span className="font-medium">{app.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Credit Score:</span>
                          <span className={`font-bold text-lg ${getScoreColor(app.creditScore)}`}>
                            {app.creditScore}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Risk Level:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(app.riskLevel)}`}>
                            {app.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Financial Profile</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loan Amount:</span>
                          <span className="font-medium">${app.loanAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual Income:</span>
                          <span className="font-medium">${app.income.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Debt-to-Income:</span>
                          <span className="font-medium">{(app.debtToIncomeRatio * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Credit Utilization:</span>
                          <span className="font-medium">{(app.creditUtilization * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Explainability Factors */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Credit Score Factors</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-4">
                        {app.explainabilityFactors.map((factor, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
                                <span className={`text-sm font-semibold ${factor.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(1)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${factor.impact > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.abs(factor.impact)}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{factor.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}