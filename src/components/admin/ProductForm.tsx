import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';
import { productSchema, ProductFormData } from '@/lib/validations';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: ProductFormData;
  onCancel?: () => void;
}

export const ProductForm = ({ onSubmit, initialData, onCancel }: ProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    product_id: '',
    name: '',
    french_name: '',
    price: 0,
    category: 'mlawi',
    image_url: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate
      const validated = productSchema.parse(formData);
      
      setIsSubmitting(true);
      await onSubmit(validated);
      
      // Reset form if not editing
      if (!initialData) {
        setFormData({
          product_id: '',
          name: '',
          french_name: '',
          price: 0,
          category: 'mlawi',
          image_url: ''
        });
      }
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        error.errors.forEach((err: any) => {
          toast({
            title: "Validation Error",
            description: err.message,
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product_id">Product ID</Label>
            <Input
              id="product_id"
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              placeholder="e.g., mlawi1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name (English) *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Mlawi with Tuna"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="french_name">Name (French) *</Label>
            <Input
              id="french_name"
              value={formData.french_name}
              onChange={(e) => setFormData({ ...formData, french_name: e.target.value })}
              placeholder="Mlawi au thon"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (TND) *</Label>
            <Input
              id="price"
              type="number"
              step="0.001"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              placeholder="3.500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mlawi">Mlawi</SelectItem>
                <SelectItem value="chapati">Chapati</SelectItem>
                <SelectItem value="tacos">Tacos</SelectItem>
                <SelectItem value="drinks">Drinks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <ImageUpload
              currentImage={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              onImageRemoved={() => setFormData({ ...formData, image_url: '' })}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                initialData ? 'Update Product' : 'Add Product'
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
