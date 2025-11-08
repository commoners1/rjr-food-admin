'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">General Settings</h1>
        <p className="text-muted-foreground">Manage restaurant general settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
          <CardDescription>Basic information about your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input id="name" placeholder="Rumah Jajan Rara" defaultValue="Rumah Jajan Rara" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Restaurant description"
              rows={4}
              defaultValue="Experience culinary excellence delivered right to your doorstep."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+62 123 456 7890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="info@rumahjajanrara.dev" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="Restaurant address" rows={2} />
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
          <CardDescription>Set your restaurant operating hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="open-time">Open Time</Label>
              <Input id="open-time" type="time" defaultValue="09:00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="close-time">Close Time</Label>
              <Input id="close-time" type="time" defaultValue="22:00" />
            </div>
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Settings</CardTitle>
          <CardDescription>Configure delivery options and fees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delivery-fee">Default Delivery Fee (Rp)</Label>
            <Input id="delivery-fee" type="number" placeholder="15000" defaultValue="15000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-order">Minimum Order Amount (Rp)</Label>
            <Input id="min-order" type="number" placeholder="50000" defaultValue="50000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
            <Input id="delivery-radius" type="number" placeholder="10" defaultValue="10" />
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

