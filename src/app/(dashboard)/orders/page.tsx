'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveTabs, ResponsiveTabsContent, type TabItem } from '@/components/ui/responsive-tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Filter, Package, Eye, X, Printer } from 'lucide-react';
import { ordersData } from '@/lib/mock-data';
import Pagination from '@/components/ui/pagination';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedOrder, setSelectedOrder] = useState<typeof ordersData[0] | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Use mock orders data
  const allOrders = ordersData;

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      // Date filter logic (simplified - you can enhance this)
      const matchesDate = dateFilter === 'all' || true; // Add date filtering logic if needed
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [allOrders, searchQuery, statusFilter, dateFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter]);

  // Get orders by tab
  const getOrdersByTab = (tabValue: string) => {
    if (tabValue === 'all') {
      return filteredOrders;
    }
    return filteredOrders.filter(order => order.status === tabValue);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'Pending' },
      confirmed: { variant: 'default' as const, label: 'Confirmed' },
      preparing: { variant: 'default' as const, label: 'Preparing' },
      ready: { variant: 'default' as const, label: 'Ready', className: 'bg-green-500' },
      'out-for-delivery': { variant: 'default' as const, label: 'Out for Delivery' },
      delivered: { variant: 'default' as const, label: 'Delivered', className: 'bg-green-600' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
      refunded: { variant: 'secondary' as const, label: 'Refunded' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: 'secondary' as const,
      label: status,
    };

    return (
      <Badge variant={config.variant} className={config.className || undefined}>
        {config.label}
      </Badge>
    );
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setDateFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleViewOrder = (order: typeof ordersData[0]) => {
    setSelectedOrder(order);
    setIsReceiptModalOpen(true);
  };

  const handlePrintReceipt = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${selectedOrder?.orderNumber}</title>
          <style>
            @media print {
              @page { margin: 0; size: 80mm auto; }
              body { margin: 0; padding: 10mm; }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.4;
              max-width: 80mm;
              margin: 0 auto;
              padding: 20px;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 18px; margin: 0; font-weight: bold; }
            .header p { font-size: 11px; margin: 5px 0; }
            .divider { border-top: 1px dashed #000; margin: 15px 0; }
            .item-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .item-name { flex: 1; }
            .item-price { text-align: right; }
            .total-row { border-top: 1px solid #000; padding-top: 10px; margin-top: 10px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const hasActiveFilters = statusFilter !== 'all' || dateFilter !== 'all' || searchQuery !== '';

  // Define tabs configuration
  const tabItems: TabItem[] = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'delivered', label: 'Delivered' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Order Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">View and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleClearFilters} className="flex-1 sm:flex-initial">
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)} className="flex-1 sm:flex-initial">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <ResponsiveTabs 
        defaultValue="all" 
        items={tabItems}
        mobileMode="select" // Use dropdown on mobile, tabs on desktop
      >

        <ResponsiveTabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-8 w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {paginatedOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No orders found. {hasActiveFilters ? 'Try adjusting your filters.' : 'No orders available.'}
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col gap-4 border rounded-lg p-4 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold text-base truncate">{order.orderNumber}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground break-words leading-relaxed">
                              {order.customer}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {order.items} items • {order.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">
                          <div className="text-left w-full sm:w-auto">
                            <p className="text-xs text-muted-foreground sm:hidden">Total</p>
                            <p className="font-semibold text-base sm:text-sm">Rp {order.total.toLocaleString('id-ID')}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="whitespace-nowrap w-full sm:w-auto"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">View</span>
                            <span className="sm:hidden">View Details</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination
                      meta={{
                        total: filteredOrders.length,
                        limit: itemsPerPage,
                        page: currentPage,
                      }}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>Orders awaiting confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderList 
                orders={getOrdersByTab('pending')} 
                getStatusBadge={getStatusBadge}
                onViewOrder={handleViewOrder}
              />
            </CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="preparing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preparing Orders</CardTitle>
              <CardDescription>Orders currently being prepared</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderList 
                orders={getOrdersByTab('preparing')} 
                getStatusBadge={getStatusBadge}
                onViewOrder={handleViewOrder}
              />
            </CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="ready" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ready Orders</CardTitle>
              <CardDescription>Orders ready for pickup or delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderList 
                orders={getOrdersByTab('ready')} 
                getStatusBadge={getStatusBadge}
                onViewOrder={handleViewOrder}
              />
            </CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="delivered" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivered Orders</CardTitle>
              <CardDescription>Completed orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderList 
                orders={getOrdersByTab('delivered')} 
                getStatusBadge={getStatusBadge}
                onViewOrder={handleViewOrder}
              />
            </CardContent>
          </Card>
        </ResponsiveTabsContent>
      </ResponsiveTabs>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filter Orders</DialogTitle>
            <DialogDescription>
              Filter orders by status, date, and other criteria.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date-filter">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger id="date-filter">
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Receipt</DialogTitle>
            <DialogDescription>
              Order {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div id="receipt-content" className="bg-white text-black p-6 rounded-lg border-2 border-dashed border-gray-300 max-w-md mx-auto">
              {/* Receipt Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Rumah Jajan Rara</h1>
                <p className="text-sm text-gray-600">Jl. Example Street No. 123</p>
                <p className="text-sm text-gray-600">Jakarta, Indonesia</p>
                <p className="text-sm text-gray-600 mt-1">Tel: +62 123 456 789</p>
              </div>

              <div className="border-t-2 border-dashed border-gray-400 my-4"></div>

              {/* Order Info */}
              <div className="mb-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Order #:</span>
                  <span>{selectedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Date:</span>
                  <span>{selectedOrder.createdAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Customer:</span>
                  <span>{selectedOrder.customer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Status:</span>
                  <span className="uppercase">{selectedOrder.status}</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-400 my-4"></div>

              {/* Order Items */}
              <div className="mb-4">
                <h2 className="font-bold mb-2 text-sm">ITEMS:</h2>
                {/* Generate mock items based on order */}
                {Array.from({ length: selectedOrder.items }).map((_, index) => {
                  const itemNames = ['Spicy Ramen', 'Gourmet Burger', 'Margherita Pizza', 'Caesar Salad', 'Fresh Lemonade'];
                  const itemPrices = [45000, 75000, 80000, 45000, 15000];
                  const name = itemNames[index % itemNames.length];
                  const price = itemPrices[index % itemPrices.length];
                  const quantity = Math.floor(Math.random() * 3) + 1;
                  
                  return (
                    <div key={index} className="mb-2 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{name}</span>
                        <span>Rp {price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 ml-2">
                        <span>{quantity}x</span>
                        <span>Rp {(price * quantity).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t-2 border-dashed border-gray-400 my-4"></div>

              {/* Totals */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>Rp {(selectedOrder.total * 0.9).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (10%):</span>
                  <span>Rp {(selectedOrder.total * 0.1).toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-gray-400 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>TOTAL:</span>
                    <span>Rp {selectedOrder.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-400 my-4"></div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-600 mt-6">
                <p className="mb-2">Thank you for your order!</p>
                <p>Please come again</p>
                <p className="mt-4 text-[10px]">
                  {new Date().toLocaleString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsReceiptModalOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button onClick={handlePrintReceipt} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reusable Order List Component
function OrderList({ 
  orders, 
  getStatusBadge,
  onViewOrder 
}: { 
  orders: typeof ordersData; 
  getStatusBadge: (status: string) => JSX.Element;
  onViewOrder: (order: typeof ordersData[0]) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No orders found in this category.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-col gap-4 border rounded-lg p-4 hover:bg-accent transition-colors"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-base truncate">{order.orderNumber}</h3>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-sm text-muted-foreground break-words leading-relaxed">
                {order.customer}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {order.items} items • {order.createdAt}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">
            <div className="text-left w-full sm:w-auto">
              <p className="text-xs text-muted-foreground sm:hidden">Total</p>
              <p className="font-semibold text-base sm:text-sm">Rp {order.total.toLocaleString('id-ID')}</p>
            </div>
            <Button 
              variant="default" 
              size="sm" 
              className="whitespace-nowrap w-full sm:w-auto"
              onClick={() => onViewOrder(order)}
            >
              <Eye className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">View</span>
              <span className="sm:hidden">View Details</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

