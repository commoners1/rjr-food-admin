'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneralSettings {
  restaurantName: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  openTime: string;
  closeTime: string;
  deliveryFee: number;
  minOrderAmount: number;
  deliveryRadius: number;
  isDeliveryEnabled: boolean;
  isPickupEnabled: boolean;
}

export default function GeneralSettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<GeneralSettings>({
    restaurantName: 'Rumah Jajan Rara',
    description: 'Experience culinary excellence delivered right to your doorstep.',
    phone: '+62 123 456 7890',
    email: 'info@rumahjajanrara.dev',
    address: 'Jl. Example Street No. 123, Jakarta, Indonesia',
    openTime: '09:00',
    closeTime: '22:00',
    deliveryFee: 15000,
    minOrderAmount: 50000,
    deliveryRadius: 10,
    isDeliveryEnabled: true,
    isPickupEnabled: true,
  });

  const handleSave = async (section: string) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: 'Success',
      description: `${section} settings saved successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">General Settings</h2>
        <p className="text-sm text-muted-foreground">Manage restaurant general settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
          <CardDescription>Basic information about your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input
              id="name"
              placeholder="Rumah Jajan Rara"
              value={settings.restaurantName}
              onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Restaurant description"
              rows={4}
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+62 123 456 7890"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="info@rumahjajanrara.dev"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Restaurant address"
              rows={2}
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </div>
          <Button onClick={() => handleSave('Restaurant information')} disabled={isSaving} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
          <CardDescription>Set your restaurant operating hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="open-time">Open Time</Label>
              <Input
                id="open-time"
                type="time"
                value={settings.openTime}
                onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="close-time">Close Time</Label>
              <Input
                id="close-time"
                type="time"
                value={settings.closeTime}
                onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={() => handleSave('Operating hours')} disabled={isSaving} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Settings</CardTitle>
          <CardDescription>Configure delivery options and fees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="delivery-enabled">Enable Delivery</Label>
              <p className="text-sm text-muted-foreground">Allow customers to order for delivery</p>
            </div>
            <Switch
              id="delivery-enabled"
              checked={settings.isDeliveryEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, isDeliveryEnabled: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pickup-enabled">Enable Pickup</Label>
              <p className="text-sm text-muted-foreground">Allow customers to order for pickup</p>
            </div>
            <Switch
              id="pickup-enabled"
              checked={settings.isPickupEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, isPickupEnabled: checked })}
            />
          </div>
          {settings.isDeliveryEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="delivery-fee">Default Delivery Fee (Rp)</Label>
                <Input
                  id="delivery-fee"
                  type="number"
                  placeholder="15000"
                  value={settings.deliveryFee}
                  onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-order">Minimum Order Amount (Rp)</Label>
                <Input
                  id="min-order"
                  type="number"
                  placeholder="50000"
                  value={settings.minOrderAmount}
                  onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
                <Input
                  id="delivery-radius"
                  type="number"
                  placeholder="10"
                  value={settings.deliveryRadius}
                  onChange={(e) => setSettings({ ...settings, deliveryRadius: Number(e.target.value) })}
                />
              </div>
            </>
          )}
          <Button onClick={() => handleSave('Delivery settings')} disabled={isSaving} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

