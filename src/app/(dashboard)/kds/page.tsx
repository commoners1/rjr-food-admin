'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package } from 'lucide-react';
import { ordersData, productsData } from '@/lib/mock-data';
import { ResponsiveTabs, ResponsiveTabsContent } from '@/components/ui/responsive-tabs';
import Pagination from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

interface KDSOrder {
  id: string;
  orderNumber: string;
  customer: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  totalItems: number;
  estimatedTime: string;
}

export default function KDSPage() {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const itemsPerPage = isMobile ? 3 : 6;

  // Transform orders data for KDS display with detailed items and quantities
  const kdsOrders: KDSOrder[] = useMemo(() => {
    return ordersData.map((order) => {
      // Generate order items with quantities (simulate real order items)
      const itemCount = order.items || Math.floor(Math.random() * 5) + 1;
      const orderItems: OrderItem[] = [];
      const usedProductIndices = new Set<number>();
      
      for (let i = 0; i < itemCount; i++) {
        let productIndex;
        do {
          productIndex = Math.floor(Math.random() * productsData.length);
        } while (usedProductIndices.has(productIndex));
        usedProductIndices.add(productIndex);
        
        const product = productsData[productIndex];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items per product
        orderItems.push({
          id: `${order.id}-ITEM-${i + 1}`,
          name: product.name,
          quantity,
        });
      }

      const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
      
      const timeMap: Record<string, string> = {
        pending: '2 min',
        preparing: '5 min',
        ready: 'Ready',
        delivered: 'Completed',
      };

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        status: order.status,
        createdAt: order.createdAt,
        items: orderItems,
        totalItems,
        estimatedTime: timeMap[order.status] || 'N/A',
      };
    });
  }, []);

  // Filter orders by status
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') {
      return kdsOrders.filter(order => order.status !== 'delivered');
    }
    return kdsOrders.filter(order => order.status === activeTab);
  }, [kdsOrders, activeTab]);

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-xs sm:text-sm">Pending</Badge>;
      case 'preparing':
        return <Badge variant="default" className="text-xs sm:text-sm">Preparing</Badge>;
      case 'ready':
        return <Badge className="bg-green-500 hover:bg-green-600 text-xs sm:text-sm">Ready</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs sm:text-sm">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-l-yellow-500';
      case 'preparing':
        return 'border-l-blue-500';
      case 'ready':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const tabs = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
  ];

  const emptyMessages: Record<string, string> = {
    all: 'No orders found',
    pending: 'No pending orders',
    preparing: 'No orders being prepared',
    ready: 'No ready orders',
  };

  const renderOrderList = () => {
    if (paginatedOrders.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{emptyMessages[activeTab] || 'No orders found'}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {paginatedOrders.map((order) => (
            <Card
              key={order.id}
              className={`border-l-4 ${getStatusColor(order.status)} transition-shadow hover:shadow-md`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">{order.orderNumber}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm truncate mt-1">
                      {order.customer}
                    </CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center justify-between mt-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{order.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{order.totalItems} item{order.totalItems !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Order Items
                  </div>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-2 text-sm sm:text-base bg-muted/50 rounded-md p-2"
                      >
                        <span className="flex-1 min-w-0 break-words">{item.name}</span>
                        <Badge variant="secondary" className="ml-2 shrink-0 text-xs sm:text-sm font-semibold">
                          x{item.quantity}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-4 sm:mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Kitchen Display System</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Monitor and manage kitchen orders in real-time</p>
      </div>

      <ResponsiveTabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1); // Reset to first page when switching tabs
        }}
        items={tabs}
        mobileMode={isMobile ? 'select' : 'scroll'}
        className="space-y-4"
      >
        <ResponsiveTabsContent value="all" className="space-y-4">
          {renderOrderList()}
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="pending" className="space-y-4">
          {renderOrderList()}
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="preparing" className="space-y-4">
          {renderOrderList()}
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="ready" className="space-y-4">
          {renderOrderList()}
        </ResponsiveTabsContent>
      </ResponsiveTabs>
    </div>
  );
}

