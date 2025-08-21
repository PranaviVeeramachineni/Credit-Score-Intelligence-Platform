import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CreditApplication {
  id: string;
  applicantName: string;
  creditScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  applicationDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  loanAmount: number;
  income: number;
  employmentHistory: number;
  debtToIncomeRatio: number;
  paymentHistory: number;
  creditUtilization: number;
  accountAge: number;
  recentInquiries: number;
  explainabilityFactors: {
    factor: string;
    impact: number;
    description: string;
  }[];
}

interface DataContextType {
  applications: CreditApplication[];
  filteredApplications: CreditApplication[];
  loading: boolean;
  filters: {
    searchTerm: string;
    riskLevel: string[];
    status: string[];
    scoreRange: [number, number];
    dateRange: [string, string];
  };
  updateFilters: (newFilters: Partial<DataContextType['filters']>) => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data generator
const generateMockData = (): CreditApplication[] => {
  const names = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson', 'Jessica Garcia', 'Robert Miller', 'Ashley Martinez', 'Christopher Lopez', 'Amanda Anderson'];
  const riskLevels: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
  const statuses: ('Pending' | 'Approved' | 'Rejected' | 'Under Review')[] = ['Pending', 'Approved', 'Rejected', 'Under Review'];
  
  return Array.from({ length: 50 }, (_, index) => {
    const creditScore = Math.floor(Math.random() * 400) + 400; // 400-800 range
    const riskLevel = creditScore > 700 ? 'Low' : creditScore > 600 ? 'Medium' : creditScore > 500 ? 'High' : 'Critical';
    
    return {
      id: `app_${index + 1}`,
      applicantName: names[Math.floor(Math.random() * names.length)],
      creditScore,
      riskLevel,
      applicationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      loanAmount: Math.floor(Math.random() * 500000) + 50000,
      income: Math.floor(Math.random() * 150000) + 30000,
      employmentHistory: Math.floor(Math.random() * 15) + 1,
      debtToIncomeRatio: Math.random() * 0.5 + 0.1,
      paymentHistory: Math.random() * 100,
      creditUtilization: Math.random() * 0.9 + 0.1,
      accountAge: Math.floor(Math.random() * 20) + 1,
      recentInquiries: Math.floor(Math.random() * 10),
      explainabilityFactors: [
        { factor: 'Payment History', impact: Math.random() * 40 + 30, description: 'Consistent on-time payments improve credit score' },
        { factor: 'Credit Utilization', impact: Math.random() * 30 + 15, description: 'Lower credit utilization is better for score' },
        { factor: 'Length of Credit History', impact: Math.random() * 20 + 10, description: 'Longer credit history indicates reliability' },
        { factor: 'Credit Mix', impact: Math.random() * 15 + 5, description: 'Diverse credit types show responsible management' },
        { factor: 'Recent Inquiries', impact: -(Math.random() * 10 + 5), description: 'Recent credit inquiries may lower score temporarily' }
      ]
    };
  });
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<CreditApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<CreditApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    riskLevel: [] as string[],
    status: [] as string[],
    scoreRange: [400, 800] as [number, number],
    dateRange: ['', ''] as [string, string]
  });

  useEffect(() => {
    loadData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setApplications(prev => {
        const updated = [...prev];
        // Update a random application's score
        const randomIndex = Math.floor(Math.random() * updated.length);
        if (updated[randomIndex]) {
          updated[randomIndex].creditScore = Math.max(400, Math.min(800, 
            updated[randomIndex].creditScore + (Math.random() - 0.5) * 10
          ));
        }
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, filters]);

  const loadData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockData = generateMockData();
    setApplications(mockData);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...applications];

    // Search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Risk level filter
    if (filters.riskLevel.length > 0) {
      filtered = filtered.filter(app => filters.riskLevel.includes(app.riskLevel));
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(app => filters.status.includes(app.status));
    }

    // Score range filter
    filtered = filtered.filter(app => 
      app.creditScore >= filters.scoreRange[0] && app.creditScore <= filters.scoreRange[1]
    );

    // Date range filter
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      filtered = filtered.filter(app => {
        const appDate = new Date(app.applicationDate);
        return appDate >= startDate && appDate <= endDate;
      });
    }

    setFilteredApplications(filtered);
  };

  const updateFilters = (newFilters: Partial<DataContextType['filters']>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const refreshData = () => {
    loadData();
  };

  return (
    <DataContext.Provider value={{
      applications,
      filteredApplications,
      loading,
      filters,
      updateFilters,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}