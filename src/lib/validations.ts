import { z } from 'zod';

export const productSchema = z.object({
  product_id: z.string().min(1, "Product ID is required").max(50),
  name: z.string().min(1, "English name is required").max(200),
  french_name: z.string().min(1, "French name is required").max(200),
  price: z.number().positive("Price must be positive").max(9999.999),
  category: z.enum(['mlawi', 'chapati', 'tacos', 'drinks'], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  image_url: z.string().url().optional().or(z.literal(''))
});

export const orderSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().regex(/^\d{2}\s\d{3}\s\d{3}$/, "Phone must be in format: XX XXX XXX"),
  address: z.string().min(10, "Address must be at least 10 characters").max(500),
  allergies: z.string().max(500).optional()
});

export type ProductFormData = z.infer<typeof productSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
