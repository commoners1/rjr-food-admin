'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Image as ImageIcon } from 'lucide-react';

export default function BannerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground">Manage promotional banners and media</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Banners</CardTitle>
          <CardDescription>Manage banners displayed on the website and app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <div className="aspect-video bg-muted rounded flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Banner Title</h3>
                <p className="text-sm text-muted-foreground">Status: Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

