'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock customers data
  const customers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+62 123 456 7890',
      totalOrders: 12,
      totalSpent: 2500000,
      status: 'active',
      joinedDate: '2024-01-01',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+62 987 654 3210',
      totalOrders: 8,
      totalSpent: 1800000,
      status: 'active',
      joinedDate: '2024-01-15',
    },
  ];

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-500">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">View and manage customer accounts</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="vip">VIP Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Customers</CardTitle>
              <CardDescription>Complete customer database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between border rounded-lg p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{customer.name}</h3>
                          {getStatusBadge(customer.status)}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3" />
                            {customer.totalOrders} orders
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {customer.joinedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Rp {customer.totalSpent.toLocaleString('id-ID')}</p>
                      <p className="text-xs text-muted-foreground">Total spent</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Customers</CardTitle>
              <CardDescription>Customers with recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Active customers will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip">
          <Card>
            <CardHeader>
              <CardTitle>VIP Customers</CardTitle>
              <CardDescription>Top spending customers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">VIP customers will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

