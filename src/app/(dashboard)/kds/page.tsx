'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function KDSPage() {
  // Mock order data
  const orders = [
    { id: 'ORD-001', status: 'preparing', items: ['Spicy Ramen', 'Fresh Lemonade'], time: '5 min' },
    { id: 'ORD-002', status: 'ready', items: ['Gourmet Burger'], time: 'Ready' },
    { id: 'ORD-003', status: 'pending', items: ['Margherita Pizza'], time: '2 min' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'preparing':
        return <Badge variant="default">Preparing</Badge>;
      case 'ready':
        return <Badge className="bg-green-500">Ready</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kitchen Display System</h1>
        <p className="text-muted-foreground">Monitor and manage kitchen orders in real-time</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {order.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <p className="text-muted-foreground">Pending orders will appear here</p>
        </TabsContent>

        <TabsContent value="preparing">
          <p className="text-muted-foreground">Orders being prepared will appear here</p>
        </TabsContent>

        <TabsContent value="ready">
          <p className="text-muted-foreground">Ready orders will appear here</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

