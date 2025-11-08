'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Package, Eye } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      orderNumber: 'RJR-2024-001234',
      customer: 'John Doe',
      total: 250000,
      status: 'preparing',
      createdAt: '2024-01-15 10:30',
      items: 3,
    },
    {
      id: 'ORD-002',
      orderNumber: 'RJR-2024-001235',
      customer: 'Jane Smith',
      total: 180000,
      status: 'delivered',
      createdAt: '2024-01-15 09:15',
      items: 2,
    },
    {
      id: 'ORD-003',
      orderNumber: 'RJR-2024-001236',
      customer: 'Bob Johnson',
      total: 320000,
      status: 'pending',
      createdAt: '2024-01-15 11:00',
      items: 4,
    },
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">View and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>Complete order history and management</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border rounded-lg p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{order.orderNumber}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.customer} • {order.items} items • {order.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">Rp {order.total.toLocaleString('id-ID')}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>Orders awaiting confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Pending orders will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preparing">
          <Card>
            <CardHeader>
              <CardTitle>Preparing Orders</CardTitle>
              <CardDescription>Orders currently being prepared</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Orders in preparation will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ready">
          <Card>
            <CardHeader>
              <CardTitle>Ready Orders</CardTitle>
              <CardDescription>Orders ready for pickup or delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Ready orders will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivered">
          <Card>
            <CardHeader>
              <CardTitle>Delivered Orders</CardTitle>
              <CardDescription>Completed orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Delivered orders will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

