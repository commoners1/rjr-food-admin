'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Mail, Phone, ShoppingBag, Calendar, DollarSign } from 'lucide-react';
import { customersData } from '@/lib/mock-data';
import { ResponsiveTabs, ResponsiveTabsContent } from '@/components/ui/responsive-tabs';
import Pagination from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';

export default function CustomersPage() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const itemsPerPage = 5;

  // Filter customers based on search query and tab
  const filteredCustomers = useMemo(() => {
    let filtered = customersData;

    // Apply tab filter first
    if (activeTab === 'active') {
      filtered = filtered.filter((customer) => customer.status === 'active');
    } else if (activeTab === 'vip') {
      // VIP customers: totalSpent > 2000000 (2 million)
      filtered = filtered.filter((customer) => customer.totalSpent >= 2000000);
    }
    // 'all' tab shows all customers

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, activeTab]);

  // Paginate filtered customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-500 text-xs">Active</Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">Inactive</Badge>
    );
  };

  const renderCustomerList = () => {
    if (paginatedCustomers.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {searchQuery
              ? 'No customers found matching your search'
              : activeTab === 'active'
              ? 'No active customers'
              : activeTab === 'vip'
              ? 'No VIP customers'
              : 'No customers found'}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-3 sm:space-y-4">
          {paginatedCustomers.map((customer) => (
            <div
              key={customer.id}
              className="border rounded-lg p-4 sm:p-5 hover:bg-accent transition-colors"
            >
              {/* Mobile: Stacked layout, Desktop: Horizontal layout */}
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Avatar Icon */}
                <div className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Header: Name and Status */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-base sm:text-lg">{customer.name}</h3>
                    {getStatusBadge(customer.status)}
                    {customer.totalSpent >= 2000000 && (
                      <Badge className="bg-yellow-500 text-xs">VIP</Badge>
                    )}
                  </div>
                  
                  {/* Contact Info - Stacked on mobile */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="break-all">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="break-all">{customer.phone}</span>
                    </div>
                  </div>
                  
                  {/* Stats - Grid layout on mobile, inline on desktop */}
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-4 mb-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>{customer.totalOrders} orders</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Joined {customer.joinedDate}</span>
                    </div>
                  </div>
                  
                  {/* Total Spent - Prominent display */}
                  <div className="mb-3 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-lg sm:text-xl font-bold text-primary">
                        Rp {customer.totalSpent.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Total spent</p>
                  </div>
                  
                  {/* View Details Button - Full width on mobile */}
                  <div className="mt-4 sm:mt-3">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full sm:w-auto text-sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-4 sm:mt-6">
            <Pagination
              meta={{
                total: filteredCustomers.length,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Customer Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">View and manage customer accounts</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-8 w-full sm:w-64"
          />
        </div>
      </div>

      <ResponsiveTabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1); // Reset to first page when switching tabs
        }}
        items={[
          { value: 'all', label: 'All Customers' },
          { value: 'active', label: 'Active' },
          { value: 'vip', label: 'VIP Customers' },
        ]}
        mobileMode={isMobile ? 'select' : 'scroll'}
        className="space-y-4"
      >
        <ResponsiveTabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Customers</CardTitle>
              <CardDescription>
                {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>{renderCustomerList()}</CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Customers</CardTitle>
              <CardDescription>
                {filteredCustomers.length} active customer{filteredCustomers.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderCustomerList()}</CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="vip">
          <Card>
            <CardHeader>
              <CardTitle>VIP Customers</CardTitle>
              <CardDescription>
                {filteredCustomers.length} VIP customer{filteredCustomers.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderCustomerList()}</CardContent>
          </Card>
        </ResponsiveTabsContent>
      </ResponsiveTabs>
    </div>
  );
}

