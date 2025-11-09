'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, TrendingUp, TrendingDown, Wallet, Calendar, FileText, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { salesData, ordersData } from '@/lib/mock-data';
import { ResponsiveTabs, ResponsiveTabsContent } from '@/components/ui/responsive-tabs';
import Pagination from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  amount: number;
  status: 'settled' | 'pending';
}

export default function FinancePage() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const itemsPerPage = 5;

  // Transform sales data for finance chart
  const revenueData = salesData.slice(0, 3).map((item) => ({
    month: item.name,
    revenue: item.total * 10000, // Convert to rupiah scale
    expenses: item.total * 6000, // Estimate expenses at 60% of revenue
  }));

  // Create ledger entries from orders
  const ledgerEntries: LedgerEntry[] = useMemo(() => {
    return ordersData.map((order, index) => ({
      id: `LEDGER-${index + 1}`,
      date: order.createdAt.split(' ')[0],
      description: `Order ${order.orderNumber} Payment`,
      type: 'credit' as const,
      amount: order.total,
      status: order.status === 'delivered' ? 'settled' as const : 'pending' as const,
    }));
  }, []);

  // Filter ledger entries based on search query
  const filteredLedgerEntries = useMemo(() => {
    if (!searchQuery.trim()) {
      return ledgerEntries;
    }
    const query = searchQuery.toLowerCase();
    return ledgerEntries.filter(
      (entry) =>
        entry.description.toLowerCase().includes(query) ||
        entry.date.toLowerCase().includes(query) ||
        entry.id.toLowerCase().includes(query)
    );
  }, [ledgerEntries, searchQuery]);

  // Paginate filtered ledger entries
  const paginatedLedgerEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLedgerEntries.slice(startIndex, endIndex);
  }, [filteredLedgerEntries, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLedgerEntries.length / itemsPerPage);

  const renderLedgerList = () => {
    if (paginatedLedgerEntries.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {searchQuery
              ? 'No ledger entries found matching your search'
              : 'No ledger entries found'}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-3 sm:space-y-4">
          {paginatedLedgerEntries.map((entry) => {
            const isCredit = entry.type === 'credit';
            const isSettled = entry.status === 'settled';
            const borderColor = isSettled 
              ? 'border-l-green-500' 
              : 'border-l-yellow-500';
            
            return (
              <div
                key={entry.id}
                className={`border-l-4 ${borderColor} border rounded-lg bg-card hover:bg-accent transition-colors shadow-sm`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center ${
                        isCredit 
                          ? 'bg-green-100 dark:bg-green-900/20' 
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {isCredit ? (
                          <ArrowUpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header: Description and Type Badge */}
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg mb-1 break-words">
                            {entry.description}
                          </h3>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="font-mono">{entry.id}</span>
                          </div>
                        </div>
                        <Badge
                          variant={isCredit ? 'default' : 'destructive'}
                          className="text-xs flex-shrink-0"
                        >
                          {isCredit ? 'Credit' : 'Debit'}
                        </Badge>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{entry.date}</span>
                      </div>
                      
                      {/* Amount and Status - Prominent display */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="text-lg sm:text-xl font-bold text-primary">
                              Rp {entry.amount.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Transaction amount</p>
                        </div>
                        
                        <Badge
                          variant={isSettled ? 'default' : 'outline'}
                          className={`text-xs w-fit ${
                            isSettled 
                              ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                              : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500'
                          }`}
                        >
                          {isSettled ? '✓ Settled' : '⏳ Pending'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="mt-4 sm:mt-6">
            <Pagination
              meta={{
                total: filteredLedgerEntries.length,
                limit: itemsPerPage,
                page: currentPage,
              }}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Finance & Ledger</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Monitor revenue, expenses, and financial transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
              <span className="text-xl sm:text-2xl font-bold">Rp 145M</span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
              <span className="text-xl sm:text-2xl font-bold">Rp 93M</span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
              <span className="text-xl sm:text-2xl font-bold">Rp 52M</span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">+25% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">Pending Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
              <span className="text-xl sm:text-2xl font-bold">Rp 5.2M</span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">12 transactions</p>
          </CardContent>
        </Card>
      </div>

      <ResponsiveTabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1); // Reset to first page when switching tabs
        }}
        items={[
          { value: 'overview', label: 'Overview' },
          { value: 'ledger', label: 'Ledger' },
          { value: 'reconciliation', label: 'Reconciliation' },
          { value: 'reports', label: 'Reports' },
        ]}
        mobileMode={isMobile ? 'select' : 'scroll'}
        className="space-y-4"
      >
        <ResponsiveTabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Expenses</CardTitle>
              <CardDescription>Financial overview and trends</CardDescription>
            </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300} minHeight={250}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="ledger">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Ledger Entries</CardTitle>
                  <CardDescription>
                    {filteredLedgerEntries.length} entr{filteredLedgerEntries.length !== 1 ? 'ies' : 'y'} found
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ledger entries..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    className="pl-8 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderLedgerList()}</CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="reconciliation">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reconciliation</CardTitle>
              <CardDescription>Reconcile payments with ledger entries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reconciliation interface coming soon...</p>
            </CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and view financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Report generation coming soon...</p>
            </CardContent>
          </Card>
        </ResponsiveTabsContent>
      </ResponsiveTabs>
    </div>
  );
}

