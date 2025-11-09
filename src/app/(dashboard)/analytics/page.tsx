'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, ShoppingCart, Users, Package, Star, Search, TrendingDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { salesData as mockSalesData, topProductsData, ordersData } from '@/lib/mock-data';
import { ResponsiveTabs, ResponsiveTabsContent } from '@/components/ui/responsive-tabs';
import Pagination from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AnalyticsPage() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('sales');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Transform mock sales data for analytics
  const salesData = useMemo(() => {
    return mockSalesData.slice(0, 4).map((item, index) => ({
      month: item.name,
      revenue: item.total * 10000, // Convert to rupiah scale
      orders: Math.floor(item.total / 100) + 200, // Generate order count
    }));
  }, []);

  // Use top products data with search and pagination
  const productPerformance = useMemo(() => {
    return topProductsData.map((product) => ({
      id: product.id,
      name: product.name,
      sales: product.sales,
      revenue: product.revenue * 1000, // Convert to rupiah scale
    }));
  }, []);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return productPerformance;
    }
    const query = searchQuery.toLowerCase();
    return productPerformance.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)
    );
  }, [productPerformance, searchQuery]);

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const categoryDistribution = [
    { name: 'Main Course', value: 65, color: '#673AB7' },
    { name: 'Appetizer', value: 15, color: '#009688' },
    { name: 'Dessert', value: 12, color: '#FF9800' },
    { name: 'Drinks', value: 8, color: '#2196F3' },
  ];

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = ordersData.length * 100; // Estimate based on orders
  const averageOrderValue = ordersData.length > 0 
    ? ordersData.reduce((sum, order) => sum + order.total, 0) / ordersData.length 
    : 0;
  
  const stats = {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    customerGrowth: 15.5,
    topProduct: topProductsData[0]?.name || 'N/A',
    rating: 4.5,
  };

  const renderProductList = () => {
    if (paginatedProducts.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {searchQuery
              ? 'No products found matching your search'
              : 'No products found'}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-3 sm:space-y-4">
          {paginatedProducts.map((product, index) => {
            const rank = (currentPage - 1) * itemsPerPage + index + 1;
            const isTopThree = rank <= 3;
            
            return (
              <div
                key={product.id}
                className={`border-l-4 ${
                  isTopThree 
                    ? rank === 1 
                      ? 'border-l-yellow-500' 
                      : rank === 2 
                        ? 'border-l-gray-400' 
                        : 'border-l-amber-600'
                    : 'border-l-primary'
                } border rounded-lg bg-card hover:bg-accent transition-colors shadow-sm`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
                        isTopThree
                          ? rank === 1
                            ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                            : rank === 2
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                              : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        #{rank}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header: Product Name */}
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg mb-1 break-words">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Package className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="font-mono">{product.id}</span>
                          </div>
                        </div>
                        {isTopThree && (
                          <Badge className="text-xs flex-shrink-0 bg-yellow-500">
                            Top {rank}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 pt-3 border-t">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <ShoppingCart className="h-4 w-4 text-primary" />
                            <span className="text-base sm:text-lg font-bold text-primary">
                              {product.sales.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Total Sales</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                              Rp {product.revenue.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Revenue</p>
                        </div>
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
                total: filteredProducts.length,
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
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Business insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Rp {stats.totalRevenue.toLocaleString('id-ID')}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              <span className="text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12.5%
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              <span className="text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8.2%
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Rp {stats.averageOrderValue.toLocaleString('id-ID')}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Per order</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">Customer Growth</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">+{stats.customerGrowth}%</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">New customers</p>
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
          { value: 'sales', label: 'Sales Analytics' },
          { value: 'products', label: 'Product Performance' },
          { value: 'customers', label: 'Customer Analytics' },
        ]}
        mobileMode={isMobile ? 'select' : 'scroll'}
        className="space-y-4"
      >
        <ResponsiveTabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Revenue Trend</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300} minHeight={250}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#673AB7" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Orders Trend</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Monthly order count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300} minHeight={250}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#009688" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="products">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Top Products Chart</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Best performing products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300} minHeight={250}>
                    <BarChart data={productPerformance.slice(0, 5)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={isMobile ? 60 : 100} />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#673AB7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Category Distribution</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Sales by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300} minHeight={250}>
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={isMobile ? 60 : 80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Performance List with Search and Pagination */}
          <Card className="mt-4 sm:mt-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-base sm:text-lg">Product Performance List</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
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
            <CardContent>{renderProductList()}</CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Customer Analytics</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Customer behavior and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Customer analytics coming soon...</p>
            </CardContent>
          </Card>
        </ResponsiveTabsContent>
      </ResponsiveTabs>
    </div>
  );
}

