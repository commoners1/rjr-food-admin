'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Image as ImageIcon, Edit, X, Trash2, Upload } from 'lucide-react';
import { bannersData as initialBannersData } from '@/lib/mock-data';
import Pagination from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
}

export default function BannerPage() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 2 rows of 3 items on desktop
  const [banners, setBanners] = useState<Banner[]>(initialBannersData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    image: 'https://placehold.co/800x300?text=Banner',
    link: '/',
    isActive: true,
    order: banners.length + 1,
  });

  // Pagination logic
  const totalPages = Math.ceil(banners.length / itemsPerPage);
  const paginatedBanners = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return banners.slice(startIndex, endIndex);
  }, [banners, currentPage, itemsPerPage]);

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      // Edit mode
      setEditingBannerId(banner.id);
      setFormData({
        title: banner.title,
        image: banner.image,
        link: banner.link,
        isActive: banner.isActive,
        order: banner.order,
      });
      // Show preview for both base64 and URL images
      setImagePreview(banner.image);
    } else {
      // Add mode
      setEditingBannerId(null);
      setFormData({
        title: '',
        image: 'https://placehold.co/800x300?text=Banner',
        link: '/',
        isActive: true,
        order: banners.length + 1,
      });
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBannerId(null);
    setFormData({
      title: '',
      image: 'https://placehold.co/800x300?text=Banner',
      link: '/',
      isActive: true,
      order: banners.length + 1,
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a banner title.',
      });
      return;
    }

    if (!formData.image || (!formData.image.startsWith('data:') && !formData.image.startsWith('http'))) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please upload an image or provide a valid image URL.',
      });
      return;
    }

    if (!formData.link || !formData.link.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a link.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingBannerId) {
        // Update existing banner
        const updatedBanner: Banner = {
          id: editingBannerId,
          title: formData.title!,
          image: formData.image!,
          link: formData.link!,
          isActive: formData.isActive ?? true,
          order: formData.order ?? 1,
        };

        setBanners(banners.map(banner => 
          banner.id === editingBannerId ? updatedBanner : banner
        ));

        toast({
          title: 'Success',
          description: `Banner "${updatedBanner.title}" has been updated successfully.`,
        });
      } else {
        // Create new banner
        const newId = `BANNER-${Date.now()}`;
        const newBanner: Banner = {
          id: newId,
          title: formData.title!,
          image: formData.image!,
          link: formData.link!,
          isActive: formData.isActive ?? true,
          order: formData.order ?? banners.length + 1,
        };

        setBanners([...banners, newBanner]);

        toast({
          title: 'Success',
          description: `Banner "${newBanner.title}" has been added successfully.`,
        });
      }

      handleCloseDialog();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: editingBannerId 
          ? 'Failed to update banner. Please try again.'
          : 'Failed to add banner. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (banner) {
      setBanners(banners.filter(b => b.id !== id));
      toast({
        title: 'Success',
        description: `Banner "${banner.title}" has been deleted.`,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File',
        description: 'Please upload an image file.',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: 'Please upload an image smaller than 5MB.',
      });
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setFormData({ ...formData, image: result });
    };
    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to read image file.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: 'https://placehold.co/800x300?text=Banner' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Banner Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage promotional banners and media</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Banners</CardTitle>
              <CardDescription>
                {banners.length} banner{banners.length !== 1 ? 's' : ''} total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedBanners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No banners found. Add your first banner to get started.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedBanners.map((banner) => (
                  <div key={banner.id} className="border rounded-lg p-4 space-y-2 relative group">
                    <div className="aspect-video bg-muted rounded overflow-hidden">
                      <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{banner.title}</h3>
                        {banner.isActive ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Order: {banner.order}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">Link: {banner.link}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                        onClick={() => handleOpenDialog(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  meta={{
                    total: banners.length,
                    limit: itemsPerPage,
                    page: currentPage,
                  }}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Banner Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBannerId ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
            <DialogDescription>
              {editingBannerId 
                ? 'Update the banner information. Fill in all the required fields.'
                : 'Add a new promotional banner. Fill in all the required information.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Banner Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Special"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Banner Image *</Label>
              <div className="space-y-2">
                {imagePreview || formData.image ? (
                  <div className="relative inline-block">
                    <div className="aspect-video bg-muted rounded overflow-hidden border w-full">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/800x300?text=Invalid+Image';
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 16:9 aspect ratio, max 5MB (JPG, PNG, WebP)
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link">Link *</Label>
              <Input
                id="link"
                placeholder="/promotions"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  placeholder="1"
                  value={formData.order || ''}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  min="1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onValueChange={(value) => setFormData({ ...formData, isActive: value === 'active' })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting 
                ? (editingBannerId ? 'Updating...' : 'Saving...') 
                : (editingBannerId ? 'Update Banner' : 'Save Banner')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

