'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Tag, Calendar, Users } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock promotions data
  const promotions = [
    {
      id: '1',
      code: 'WELCOME10',
      name: 'Welcome Discount',
      type: 'PERCENTAGE',
      discountPercentage: 10,
      minPurchaseAmount: 100000,
      validFrom: '2024-01-01',
      validUntil: '2024-12-31',
      currentUses: 45,
      maxUses: 1000,
      isActive: true,
    },
    {
      id: '2',
      code: 'FREESHIP',
      name: 'Free Shipping',
      type: 'FREE_SHIPPING',
      minPurchaseAmount: 50000,
      validFrom: '2024-01-15',
      validUntil: '2024-02-15',
      currentUses: 120,
      maxUses: 500,
      isActive: true,
    },
  ];

  const getTypeBadge = (type: string) => {
    const config = {
      PERCENTAGE: { label: 'Percentage', variant: 'default' as const },
      FIXED_AMOUNT: { label: 'Fixed Amount', variant: 'secondary' as const },
      FREE_SHIPPING: { label: 'Free Shipping', variant: 'outline' as const },
    };
    const typeConfig = config[type as keyof typeof config] || { label: type, variant: 'secondary' as const };
    return <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promotions & Discounts</h1>
          <p className="text-muted-foreground">Manage promo codes, discounts, and special offers</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Promotions</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Promotions</CardTitle>
                  <CardDescription>Manage all promotional codes and discounts</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search promotions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="flex items-center justify-between border rounded-lg p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{promo.code}</h3>
                          {getTypeBadge(promo.type)}
                          {promo.isActive ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{promo.name}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {promo.validFrom} - {promo.validUntil}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {promo.currentUses} / {promo.maxUses || '∞'} uses
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {promo.type === 'PERCENTAGE' && (
                        <span className="font-semibold">{promo.discountPercentage}% off</span>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
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
              <CardTitle>Active Promotions</CardTitle>
              <CardDescription>Currently active promotional codes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Active promotions will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired">
          <Card>
            <CardHeader>
              <CardTitle>Expired Promotions</CardTitle>
              <CardDescription>Expired promotional codes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Expired promotions will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

