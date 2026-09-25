import { z } from 'zod';

export const createTopicSchema = z.object({
  sectionId: z.string().uuid('Valid sectionId is required'),
  name: z.string().min(2, 'Topic name is required'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateTopicSchema = createTopicSchema.partial();
