'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Search, Filter, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Pagination from '@/components/ui/pagination';
import { productsData } from '@/lib/mock-data';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
  image: string;
  description?: string;
}

// Get unique categories from productsData
const categories = ['All', 'Main Course', 'Appetizer', 'Drinks', 'Dessert'];

export default function MenuPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: 'Main Course',
    status: 'active',
    image: 'https://placehold.co/200x200?text=Product',
    description: '',
  });

  // Import productsData and manage it as state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    // Initialize with mock data
    return productsData.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      status: p.status as 'active' | 'inactive',
      image: p.image,
      description: '',
    }));
  });

  // Filter and search logic
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [menuItems, searchQuery, categoryFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      // Edit mode
      setEditingItemId(item.id);
      setFormData({
        name: item.name,
        price: item.price,
        category: item.category,
        status: item.status,
        image: item.image,
        description: item.description || '',
      });
      // Show preview for both base64 and URL images
      setImagePreview(item.image || null);
    } else {
      // Add mode
      setEditingItemId(null);
      setFormData({
        name: '',
        price: 0,
        category: 'Main Course',
        status: 'active',
        image: 'https://placehold.co/200x200?text=Product',
        description: '',
      });
      setImagePreview(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItemId(null);
    setFormData({
      name: '',
      price: 0,
      category: 'Main Course',
      status: 'active',
      image: 'https://placehold.co/200x200?text=Product',
      description: '',
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    setFormData({ ...formData, image: 'https://placehold.co/200x200?text=Product' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a menu item name.',
      });
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a valid price greater than 0.',
      });
      return;
    }

    if (!formData.category) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select a category.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingItemId) {
        // Update existing item
        const updatedItem: MenuItem = {
          id: editingItemId,
          name: formData.name!,
          price: formData.price!,
          category: formData.category!,
          status: formData.status || 'active',
          image: formData.image || 'https://placehold.co/200x200?text=Product',
          description: formData.description || '',
        };

        setMenuItems(menuItems.map(item => 
          item.id === editingItemId ? updatedItem : item
        ));

        toast({
          title: 'Success',
          description: `Menu item "${updatedItem.name}" has been updated successfully.`,
        });
      } else {
        // Create new item
        const newId = `PROD-${Date.now()}`;
        const newItem: MenuItem = {
          id: newId,
          name: formData.name!,
          price: formData.price!,
          category: formData.category!,
          status: formData.status || 'active',
          image: formData.image || 'https://placehold.co/200x200?text=Product',
          description: formData.description || '',
        };

        setMenuItems([...menuItems, newItem]);

        toast({
          title: 'Success',
          description: `Menu item "${newItem.name}" has been added successfully.`,
        });
      }

      handleCloseDialog();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: editingItemId 
          ? 'Failed to update menu item. Please try again.'
          : 'Failed to add menu item. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (item) {
      setMenuItems(menuItems.filter(i => i.id !== id));
      toast({
        title: 'Success',
        description: `Menu item "${item.name}" has been deleted.`,
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Menu Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your restaurant menu items, categories, and pricing</p>
        </div>
        <Button onClick={handleOpenDialog} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add Menu Item</span>
          <span className="sm:hidden">Add Item</span>
        </Button>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TabsList className="inline-flex w-max min-w-full sm:min-w-0 sm:w-auto">
            <TabsTrigger value="items" className="flex-shrink-0 whitespace-nowrap px-4 sm:px-3">Menu Items</TabsTrigger>
            <TabsTrigger value="categories" className="flex-shrink-0 whitespace-nowrap px-4 sm:px-3">Categories</TabsTrigger>
            <TabsTrigger value="variants" className="flex-shrink-0 whitespace-nowrap px-4 sm:px-3">Variants & Add-ons</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div>
                  <CardTitle>Menu Items</CardTitle>
                  <CardDescription>
                    {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-8 w-full sm:w-64"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={(value) => {
                    setCategoryFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {paginatedItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No menu items found. {searchQuery || categoryFilter !== 'All' || statusFilter !== 'All' 
                    ? 'Try adjusting your filters.' 
                    : 'Add your first menu item to get started.'}
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedItems.map((product) => (
                      <div
                        key={product.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border rounded-lg p-4 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="text-sm font-semibold mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
                            {product.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {product.status === 'active' ? (
                            <Badge className="bg-green-500 whitespace-nowrap">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="whitespace-nowrap">Inactive</Badge>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenDialog(product)}
                            className="hidden sm:inline-flex"
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination
                      meta={{
                        total: filteredItems.length,
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

      {/* Add Menu Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItemId ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            <DialogDescription>
              {editingItemId 
                ? 'Update the menu item information. Fill in all the required fields.'
                : 'Add a new menu item to your restaurant. Fill in all the required information.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Spicy Ramen"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (Rp) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="45000"
                value={formData.price !== undefined && formData.price !== null ? formData.price : ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="1000"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(cat => cat !== 'All').map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
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
            <div className="grid gap-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="space-y-2">
                {imagePreview || formData.image ? (
                  <div className="relative inline-block">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
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
                  <div className="flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
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
                  Recommended: Square image, max 5MB (JPG, PNG, WebP)
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter item description..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting 
                ? (editingItemId ? 'Updating...' : 'Saving...') 
                : (editingItemId ? 'Update Menu Item' : 'Save Menu Item')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
