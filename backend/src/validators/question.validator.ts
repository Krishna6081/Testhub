import { z } from 'zod';

export const optionSchema = z.object({
  id: z.string().optional(),
  optionText: z.string().min(1, 'Option text is required'),
  imageUrl: z.string().optional(),
  isCorrect: z.boolean().default(false),
  optionOrder: z.number().default(0),
});

export const createQuestionSchema = z.object({
  sectionId: z.string().uuid('Valid sectionId is required'),
  topicId: z.string().uuid('Valid topicId is required'),
  subTopicId: z.string().uuid().optional().nullable(),
  questionText: z.string().min(3, 'Question text is required'),
  questionType: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'NUMERICAL']).default('SINGLE_CHOICE'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  explanation: z.string().optional(),
  marks: z.number().min(0.1).default(1.0),
  negativeMarks: z.number().min(0).default(0.25),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  options: z.array(optionSchema).min(2, 'At least 2 options are required'),
});

export const updateQuestionSchema = createQuestionSchema.partial();
