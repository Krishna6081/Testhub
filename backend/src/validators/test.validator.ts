import { z } from 'zod';

export const createTestSchema = z.object({
  title: z.string().min(3, 'Test title is required'),
  description: z.string().optional(),
  examId: z.string().uuid().optional().nullable(),
  sectionId: z.string().uuid().optional().nullable(),
  topicId: z.string().uuid().optional().nullable(),
  duration: z.number().min(1, 'Duration in minutes must be at least 1'),
  totalQuestions: z.number().min(1, 'Total questions must be at least 1'),
  totalMarks: z.number().min(0.5, 'Total marks must be at least 0.5'),
  negativeMarking: z.number().min(0).default(0.25),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  testType: z.enum(['TOPIC', 'SECTION', 'MIXED', 'FULL_LENGTH', 'DAILY', 'PRACTICE']).default('TOPIC'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  questionIds: z.array(z.string().uuid()).optional(),
  autoSelectCount: z.number().optional(),
});

export const submitTestSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    selectedOptionId: z.string().uuid().nullable().optional(),
    timeSpent: z.number().optional().default(0),
  })),
});

export const updateTestSchema = createTestSchema.partial();
