import React from 'react';
import { useData } from '../contexts/DataContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export default function Dashboard() {
  const { applications, loading } = useData();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalApplications = applications.length;
  const approvedApplications = applications.filter(app => app.status === 'Approved').length;
  const pendingApplications = applications.filter(app => app.status === 'Pending').length;
  const highRiskApplications = applications.filter(app => app.riskLevel === 'High' || app.riskLevel === 'Critical').length;
  const averageCreditScore = applications.reduce((sum, app) => sum + app.creditScore, 0) / totalApplications;
  const totalLoanAmount = applications.reduce((sum, app) => sum + app.loanAmount, 0);

  const approvalRate = (approvedApplications / totalApplications) * 100;

  const stats = [
    {
      name: 'Total Applications',
      value: totalApplications.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      name: 'Average Credit Score',
      value: Math.round(averageCreditScore).toString(),
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'green'
    },
    {
      name: 'High Risk Applications',
      value: highRiskApplications.toString(),
      change: '-8%',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      name: 'Total Loan Value',
      value: `$${(totalLoanAmount / 1000000).toFixed(1)}M`,
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'teal'
    }
  ];

  const recentApplications = applications
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Under Review':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Score Dashboard</h1>
        <p className="text-gray-600">Real-time insights into credit applications and risk assessment</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mb-2">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{approvedApplications}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(approvedApplications / totalApplications) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-700">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{pendingApplications}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(pendingApplications / totalApplications) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700">Under Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {applications.filter(app => app.status === 'Under Review').length}
                </span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(applications.filter(app => app.status === 'Under Review').length / totalApplications) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-gray-700">Rejected</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {applications.filter(app => app.status === 'Rejected').length}
                </span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(applications.filter(app => app.status === 'Rejected').length / totalApplications) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approval Rate</span>
              <span className="text-lg font-semibold text-green-600">
                {approvalRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">{app.applicantName}</p>
                      <p className="text-sm text-gray-500">Score: {app.creditScore}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(app.riskLevel)}`}>
                    {app.riskLevel}
                  </span>
                  {getStatusIcon(app.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}