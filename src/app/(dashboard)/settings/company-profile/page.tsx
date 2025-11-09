'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompanyProfile {
  companyName: string;
  companyId: string;
  taxId: string;
  registrationNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

export default function CompanyProfilePage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: 'PT. Derajat Utama Kreasi (NOTCH)',
    companyId: 'COMP-001',
    taxId: '01.234.567.8-901.000',
    registrationNumber: 'AHU-001234.AH.01.01.2024',
    address: 'Jl. Example Street No. 123',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    postalCode: '12345',
    country: 'Indonesia',
    phone: '+62 123 456 7890',
    email: 'info@notch.dev',
    website: 'https://notch.dev',
    description: 'Technology company specializing in software development.',
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: 'Success',
      description: 'Company profile updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Company Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your company information and registration details</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <CardTitle>Company Information</CardTitle>
          </div>
          <CardDescription>Basic company details and registration information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-id">Company ID</Label>
              <Input
                id="company-id"
                value={profile.companyId}
                onChange={(e) => setProfile({ ...profile, companyId: e.target.value })}
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax-id">Tax ID (NPWP)</Label>
              <Input
                id="tax-id"
                value={profile.taxId}
                onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration-number">Registration Number</Label>
              <Input
                id="registration-number"
                value={profile.registrationNumber}
                onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Company physical address and location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Textarea
              id="address"
              rows={2}
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                value={profile.province}
                onChange={(e) => setProfile({ ...profile, province: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal-code">Postal Code</Label>
              <Input
                id="postal-code"
                value={profile.postalCode}
                onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Company contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
