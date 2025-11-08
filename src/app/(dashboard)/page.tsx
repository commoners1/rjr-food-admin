'use client';

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, TrendingUp, Utensils, MessageSquare, Monitor } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { salesData } from '@/lib/mock-data';

export default function DashboardPage() {
  // Mock dashboard data
  const todayStats = {
    revenue: 12500000,
    orders: 45,
    customers: 38,
    growth: 12.5,
  };

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: 250000, status: 'completed' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 180000, status: 'preparing' },
    { id: 'ORD-003', customer: 'Bob Johnson', amount: 320000, status: 'pending' },
  ];

  // Transform salesData for weekly chart (use first 7 months as days)
  const weeklySalesData = salesData.slice(0, 7).map((item, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    sales: item.total * 1000, // Convert to rupiah scale
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {todayStats.revenue.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{todayStats.growth}%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.orders}</div>
            <p className="text-xs text-muted-foreground">Active orders today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.customers}</div>
            <p className="text-xs text-muted-foreground">New customers today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{todayStats.growth}%</div>
            <p className="text-xs text-muted-foreground">Compared to last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription>Sales performance over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#673AB7" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <h3 className="font-semibold">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rp {order.amount.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/menu"
                className="p-4 border rounded-lg hover:bg-accent transition-colors text-center"
              >
                <Utensils className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Manage Menu</p>
              </a>
              <a
                href="/kds"
                className="p-4 border rounded-lg hover:bg-accent transition-colors text-center"
              >
                <Monitor className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Kitchen Display</p>
              </a>
              <a
                href="/reviews"
                className="p-4 border rounded-lg hover:bg-accent transition-colors text-center"
              >
                <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">View Reviews</p>
              </a>
              <a
                href="/finance"
                className="p-4 border rounded-lg hover:bg-accent transition-colors text-center"
              >
                <DollarSign className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Finance</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
