'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Upload, Image as ImageIcon, X, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Pagination from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
}

export default function MediaPage() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Image-specific pagination: 6 items on mobile, 12 items on desktop
  const itemsPerPage = isMobile ? 6 : 12;

  // Initial mock data
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    // Generate some initial mock images
    const items: MediaItem[] = [];
    for (let i = 1; i <= 50; i++) {
      items.push({
        id: `MEDIA-${i}`,
        name: `image-${i}.jpg`,
        url: `https://placehold.co/400x400?text=Image+${i}`,
        type: 'image' as const,
        size: Math.floor(Math.random() * 2000000) + 100000, // 100KB - 2MB
        uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    return items;
  });

  // Filter by search
  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mediaItems, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenUploadDialog = () => {
    setSelectedFiles([]);
    setIsUploadDialogOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File',
          description: `${file.name} is not an image or video file.`,
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: `${file.name} is larger than 10MB.`,
        });
        return false;
      }
      return true;
    });

    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Files',
        description: 'Please select at least one file to upload.',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload for each file
      for (const file of selectedFiles) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const reader = new FileReader();
        await new Promise<void>((resolve, reject) => {
          reader.onload = (event) => {
            const result = event.target?.result as string;
            const newItem: MediaItem = {
              id: `MEDIA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              url: result,
              type: file.type.startsWith('image/') ? 'image' : 'video',
              size: file.size,
              uploadedAt: new Date().toISOString(),
            };
            setMediaItems(prev => [newItem, ...prev]);
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      toast({
        title: 'Success',
        description: `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} uploaded successfully.`,
      });

      setIsUploadDialogOpen(false);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setCurrentPage(1); // Reset to first page to see new uploads
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: 'Failed to upload files. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    const item = mediaItems.find(m => m.id === id);
    if (item) {
      setMediaItems(mediaItems.filter(m => m.id !== id));
      toast({
        title: 'Success',
        description: `"${item.name}" has been deleted.`,
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Media Library</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage all media files, images, and assets</p>
        </div>
        <Button variant="outline" onClick={handleOpenUploadDialog} className="w-full sm:w-auto">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Media Files</CardTitle>
              <CardDescription>
                {filteredItems.length} file{filteredItems.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? (
                <>
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No media files found matching "{searchQuery}"</p>
                  <p className="text-sm mt-2">Try a different search term</p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No media files yet</p>
                  <p className="text-sm mt-2">Upload your first file to get started</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {paginatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-square border rounded-lg overflow-hidden bg-muted hover:border-primary transition-colors cursor-pointer"
                    onClick={() => item.type === 'image' && setPreviewImage(item)}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Error';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {item.type === 'image' && (
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(item);
                          }}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Download functionality
                          const link = document.createElement('a');
                          link.href = item.url;
                          link.download = item.name;
                          link.click();
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* File info overlay (always visible on mobile, visible on hover on desktop) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white truncate font-medium">{item.name}</p>
                      <p className="text-[10px] text-white/80 mt-0.5">
                        {formatFileSize(item.size)} • {formatDate(item.uploadedAt)}
                      </p>
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

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Media Files</DialogTitle>
            <DialogDescription>
              Select one or more image or video files to upload. Maximum 10MB per file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*"
                multiple
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Files ({selectedFiles.length}):</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || selectedFiles.length === 0}>
              {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[90vw] max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          {previewImage && (
            <>
              <DialogHeader className="px-6 pt-6 pb-4">
                <DialogTitle className="truncate">{previewImage.name}</DialogTitle>
                <DialogDescription>
                  {formatFileSize(previewImage.size)} • Uploaded {formatDate(previewImage.uploadedAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="relative bg-black/50 flex items-center justify-center min-h-[300px] max-h-[calc(90vh-120px)] overflow-auto p-4 sm:p-6">
                <img
                  src={previewImage.url}
                  alt={previewImage.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Error+Loading+Image';
                  }}
                />
              </div>
              <DialogFooter className="px-6 pb-6 pt-4 flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = previewImage.url;
                    link.download = previewImage.name;
                    link.click();
                  }}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(previewImage.id);
                    setPreviewImage(null);
                  }}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreviewImage(null)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
