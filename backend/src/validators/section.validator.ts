import { z } from 'zod';

export const createSectionSchema = z.object({
  name: z.string().min(2, 'Section name is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateSectionSchema = createSectionSchema.partial();
