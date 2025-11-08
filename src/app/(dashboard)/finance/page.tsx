'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinancePage() {
  // Mock financial data
  const revenueData = [
    { month: 'Jan', revenue: 45000000, expenses: 30000000 },
    { month: 'Feb', revenue: 52000000, expenses: 32000000 },
    { month: 'Mar', revenue: 48000000, expenses: 31000000 },
  ];

  const ledgerEntries = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Order #ORD-001 Payment',
      type: 'credit',
      amount: 250000,
      status: 'settled',
    },
    {
      id: '2',
      date: '2024-01-15',
      description: 'Supplier Payment',
      type: 'debit',
      amount: 1500000,
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finance & Ledger</h1>
        <p className="text-muted-foreground">Monitor revenue, expenses, and financial transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">Rp 145M</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">Rp 93M</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">Rp 52M</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+25% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">Rp 5.2M</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">12 transactions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Expenses</CardTitle>
              <CardDescription>Financial overview and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ledger Entries</CardTitle>
                  <CardDescription>All financial transactions</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-8 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ledgerEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between border rounded-lg p-4"
                  >
                    <div>
                      <h3 className="font-semibold">{entry.description}</h3>
                      <p className="text-sm text-muted-foreground">{entry.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={entry.type === 'credit' ? 'default' : 'destructive'}
                      >
                        {entry.type === 'credit' ? 'Credit' : 'Debit'}
                      </Badge>
                      <span className="font-semibold">
                        Rp {entry.amount.toLocaleString('id-ID')}
                      </span>
                      <Badge
                        variant={entry.status === 'settled' ? 'default' : 'outline'}
                      >
                        {entry.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reconciliation</CardTitle>
              <CardDescription>Reconcile payments with ledger entries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reconciliation interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and view financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Report generation coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

