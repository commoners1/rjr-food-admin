'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant menu items, categories, and pricing</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="variants">Variants & Add-ons</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Menu Items</CardTitle>
                  <CardDescription>Manage all menu items and their details</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[]}
                data={[]}
                filterColumn="name"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Organize menu items into categories</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Category management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants">
          <Card>
            <CardHeader>
              <CardTitle>Variants & Add-ons</CardTitle>
              <CardDescription>Manage product variants, sizes, and add-ons</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Variant management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

