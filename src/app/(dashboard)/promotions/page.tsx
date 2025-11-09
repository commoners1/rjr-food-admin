'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Tag, Calendar, Users } from 'lucide-react';
import { promotionsData } from '@/lib/mock-data';
import { ResponsiveTabs, ResponsiveTabsContent } from '@/components/ui/responsive-tabs';
import Pagination from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface Promotion {
  id: string;
  code: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discountPercentage?: number;
  fixedAmount?: number;
  minPurchaseAmount?: number;
  validFrom: string;
  validUntil: string;
  currentUses: number;
  maxUses?: number;
  isActive: boolean;
}

export default function PromotionsPage() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const [promotions, setPromotions] = useState<Promotion[]>(promotionsData as Promotion[]);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING',
    discountPercentage: '',
    fixedAmount: '',
    minPurchaseAmount: '',
    validFrom: '',
    validUntil: '',
    maxUses: '',
    isActive: true,
  });

  // Filter promotions based on search query and tab
  const filteredPromotions = useMemo(() => {
    const now = new Date();
    let filtered = promotions;

    // Apply tab filter first (before search)
    if (activeTab === 'active') {
      // Active: isActive === true AND currently within valid date range
      filtered = filtered.filter((promo) => {
        const validFrom = new Date(promo.validFrom);
        const validUntil = new Date(promo.validUntil);
        return promo.isActive && validFrom <= now && validUntil >= now;
      });
    } else if (activeTab === 'expired') {
      // Expired: validUntil date has passed (regardless of isActive flag)
      filtered = filtered.filter((promo) => {
        const validUntil = new Date(promo.validUntil);
        return validUntil < now;
      });
    }
    // 'all' tab shows all promotions (filtered by search only)

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (promo) =>
          promo.code.toLowerCase().includes(query) ||
          promo.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [promotions, searchQuery, activeTab]);

  // Paginate filtered promotions
  const paginatedPromotions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPromotions.slice(startIndex, endIndex);
  }, [filteredPromotions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

  const handleOpenDialog = (promoId?: string) => {
    if (promoId) {
      const promo = promotions.find((p) => p.id === promoId);
      if (promo) {
        setEditingPromoId(promoId);
        setFormData({
          code: promo.code,
          name: promo.name,
          type: promo.type,
          discountPercentage: promo.discountPercentage?.toString() || '',
          fixedAmount: promo.fixedAmount?.toString() || '',
          minPurchaseAmount: promo.minPurchaseAmount?.toString() || '',
          validFrom: promo.validFrom,
          validUntil: promo.validUntil,
          maxUses: promo.maxUses?.toString() || '',
          isActive: promo.isActive,
        });
      }
    } else {
      setEditingPromoId(null);
      setFormData({
        code: '',
        name: '',
        type: 'PERCENTAGE',
        discountPercentage: '',
        fixedAmount: '',
        minPurchaseAmount: '',
        validFrom: '',
        validUntil: '',
        maxUses: '',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPromoId(null);
    setFormData({
      code: '',
      name: '',
      type: 'PERCENTAGE',
      discountPercentage: '',
      fixedAmount: '',
      minPurchaseAmount: '',
      validFrom: '',
      validUntil: '',
      maxUses: '',
      isActive: true,
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.code.trim() || !formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Code and name are required.',
      });
      return;
    }

    if (!formData.validFrom || !formData.validUntil) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Valid from and valid until dates are required.',
      });
      return;
    }

    if (formData.type === 'PERCENTAGE' && !formData.discountPercentage) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Discount percentage is required for percentage type.',
      });
      return;
    }

    if (formData.type === 'FIXED_AMOUNT' && !formData.fixedAmount) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Fixed amount is required for fixed amount type.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      if (editingPromoId) {
        // Update existing promotion
        setPromotions((prev) =>
          prev.map((promo) =>
            promo.id === editingPromoId
              ? {
                  ...promo,
                  code: formData.code.trim().toUpperCase(),
                  name: formData.name.trim(),
                  type: formData.type,
                  discountPercentage: formData.discountPercentage
                    ? Number(formData.discountPercentage)
                    : undefined,
                  fixedAmount: formData.fixedAmount ? Number(formData.fixedAmount) : undefined,
                  minPurchaseAmount: formData.minPurchaseAmount
                    ? Number(formData.minPurchaseAmount)
                    : undefined,
                  validFrom: formData.validFrom,
                  validUntil: formData.validUntil,
                  maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
                  isActive: formData.isActive,
                }
              : promo
          )
        );
        toast({
          title: 'Success',
          description: 'Promotion updated successfully.',
        });
      } else {
        // Create new promotion
        const newPromo: Promotion = {
          id: `PROMO-${Date.now()}`,
          code: formData.code.trim().toUpperCase(),
          name: formData.name.trim(),
          type: formData.type,
          discountPercentage: formData.discountPercentage
            ? Number(formData.discountPercentage)
            : undefined,
          fixedAmount: formData.fixedAmount ? Number(formData.fixedAmount) : undefined,
          minPurchaseAmount: formData.minPurchaseAmount
            ? Number(formData.minPurchaseAmount)
            : undefined,
          validFrom: formData.validFrom,
          validUntil: formData.validUntil,
          currentUses: 0,
          maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
          isActive: formData.isActive,
        };
        setPromotions((prev) => [newPromo, ...prev]);
        toast({
          title: 'Success',
          description: 'Promotion created successfully.',
        });
      }

      handleCloseDialog();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save promotion. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    const promo = promotions.find((p) => p.id === id);
    if (promo) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: 'Success',
        description: `"${promo.name}" has been deleted.`,
      });
    }
  };

  const getTypeBadge = (type: string) => {
    const config = {
      PERCENTAGE: { label: 'Percentage', variant: 'default' as const },
      FIXED_AMOUNT: { label: 'Fixed Amount', variant: 'secondary' as const },
      FREE_SHIPPING: { label: 'Free Shipping', variant: 'outline' as const },
    };
    const typeConfig = config[type as keyof typeof config] || { label: type, variant: 'secondary' as const };
    return <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>;
  };

  const renderPromotionList = () => {
    if (paginatedPromotions.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {searchQuery
              ? 'No promotions found matching your search'
              : activeTab === 'active'
              ? 'No active promotions'
              : activeTab === 'expired'
              ? 'No expired promotions'
              : 'No promotions found'}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-3 sm:space-y-4">
          {paginatedPromotions.map((promo) => (
            <div
              key={promo.id}
              className="border rounded-lg p-4 sm:p-4 hover:bg-accent transition-colors"
            >
              {/* Mobile: Stacked layout, Desktop: Horizontal layout */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Header: Code and Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-base sm:text-lg">{promo.code}</h3>
                    {getTypeBadge(promo.type)}
                    {promo.isActive ? (
                      <Badge className="bg-green-500 text-xs">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Inactive</Badge>
                    )}
                  </div>
                  
                  {/* Promotion Name */}
                  <p className="text-sm text-muted-foreground mb-3 break-words">{promo.name}</p>
                  
                  {/* Discount Value - Mobile: Full width, Desktop: Inline */}
                  <div className="mb-3 sm:mb-0">
                    {promo.type === 'PERCENTAGE' && (
                      <div className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-0 sm:inline-block sm:mr-4">
                        {promo.discountPercentage}% off
                      </div>
                    )}
                    {promo.type === 'FIXED_AMOUNT' && promo.fixedAmount && (
                      <div className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-0 sm:inline-block sm:mr-4">
                        Rp {promo.fixedAmount.toLocaleString('id-ID')} off
                      </div>
                    )}
                    {promo.type === 'FREE_SHIPPING' && (
                      <div className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-0 sm:inline-block sm:mr-4">
                        Free Shipping
                      </div>
                    )}
                  </div>
                  
                  {/* Validity and Usage - Stacked on mobile, inline on desktop */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground mb-3 sm:mb-0">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="break-words">{promo.validFrom} - {promo.validUntil}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {promo.currentUses} / {promo.maxUses || '∞'} uses
                    </span>
                  </div>
                  
                  {/* Edit Button - Full width on mobile, inline on desktop */}
                  <div className="mt-4 sm:mt-0 sm:flex sm:justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenDialog(promo.id)}
                      className="w-full sm:w-auto text-sm"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-4 sm:mt-6">
            <Pagination
              meta={{
                total: filteredPromotions.length,
                limit: itemsPerPage,
                page: currentPage,
              }}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Promotions & Discounts</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage promo codes, discounts, and special offers</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      <ResponsiveTabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1); // Reset to first page when switching tabs
        }}
        items={[
          { value: 'all', label: 'All Promotions' },
          { value: 'active', label: 'Active' },
          { value: 'expired', label: 'Expired' },
        ]}
        mobileMode={isMobile ? 'select' : 'scroll'}
        className="space-y-4"
      >
        <ResponsiveTabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>All Promotions</CardTitle>
                  <CardDescription>
                    {filteredPromotions.length} promotion{filteredPromotions.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search promotions..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    className="pl-8 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderPromotionList()}</CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Promotions</CardTitle>
              <CardDescription>
                {filteredPromotions.length} active promotion{filteredPromotions.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderPromotionList()}</CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="expired">
          <Card>
            <CardHeader>
              <CardTitle>Expired Promotions</CardTitle>
              <CardDescription>
                {filteredPromotions.length} expired promotion{filteredPromotions.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderPromotionList()}</CardContent>
          </Card>
        </ResponsiveTabsContent>
      </ResponsiveTabs>

      {/* Create/Edit Promotion Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPromoId ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
            <DialogDescription>
              {editingPromoId
                ? 'Update promotion details below.'
                : 'Fill in the details to create a new promotion.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Promo Code *</Label>
                <Input
                  id="code"
                  placeholder="WELCOME10"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Promotion Name *</Label>
                <Input
                  id="name"
                  placeholder="Welcome Discount"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Discount Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING') =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                  <SelectItem value="FREE_SHIPPING">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'PERCENTAGE' && (
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Discount Percentage *</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="10"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPercentage: e.target.value })
                  }
                />
              </div>
            )}

            {formData.type === 'FIXED_AMOUNT' && (
              <div className="space-y-2">
                <Label htmlFor="fixedAmount">Fixed Amount (Rp) *</Label>
                <Input
                  id="fixedAmount"
                  type="number"
                  min="1"
                  placeholder="50000"
                  value={formData.fixedAmount}
                  onChange={(e) => setFormData({ ...formData, fixedAmount: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="minPurchaseAmount">Minimum Purchase Amount (Rp)</Label>
              <Input
                id="minPurchaseAmount"
                type="number"
                min="0"
                placeholder="100000"
                value={formData.minPurchaseAmount}
                onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUses">Maximum Uses (leave empty for unlimited)</Label>
              <Input
                id="maxUses"
                type="number"
                min="1"
                placeholder="1000"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting
                ? 'Saving...'
                : editingPromoId
                ? 'Update Promotion'
                : 'Create Promotion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

