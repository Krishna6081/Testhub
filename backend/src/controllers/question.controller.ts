import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getQuestions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sectionId, topicId, difficulty, search, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (sectionId && typeof sectionId === 'string' && sectionId.trim() !== '') {
      where.sectionId = sectionId.trim();
    }
    if (topicId && typeof topicId === 'string' && topicId.trim() !== '') {
      where.topicId = topicId.trim();
    }
    if (difficulty && typeof difficulty === 'string' && difficulty.trim() !== '') {
      where.difficulty = difficulty.trim() as any;
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
      where.OR = [
        { questionText: { contains: search.trim(), mode: 'insensitive' } },
        { explanation: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          section: { select: { id: true, name: true } },
          topic: { select: { id: true, name: true } },
          options: { orderBy: { optionOrder: 'asc' } },
        },
      }),
      prisma.question.count({ where }),
    ]);

    return sendSuccess(res, 'Questions retrieved successfully', {
      questions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch questions', 500);
  }
};

export const getQuestionById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || id === 'import') {
      return sendError(res, 'Invalid question ID', 400);
    }

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        section: true,
        topic: true,
        subTopic: true,
        options: { orderBy: { optionOrder: 'asc' } },
      },
    });

    if (!question) {
      return sendError(res, 'Question not found', 404);
    }

    return sendSuccess(res, 'Question retrieved successfully', question);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch question', 500);
  }
};

export const createQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      sectionId,
      topicId,
      subTopicId,
      questionText,
      questionType,
      difficulty,
      explanation,
      marks,
      negativeMarks,
      imageUrl,
      options,
    } = req.body;

    const cleanSubTopicId = subTopicId && typeof subTopicId === 'string' && subTopicId.trim() !== '' ? subTopicId.trim() : null;
    const cleanImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '' ? imageUrl.trim() : null;

    const question = await prisma.question.create({
      data: {
        sectionId,
        topicId,
        subTopicId: cleanSubTopicId,
        questionText,
        questionType: questionType || 'SINGLE_CHOICE',
        difficulty: difficulty || 'MEDIUM',
        explanation: explanation || null,
        marks: marks !== undefined ? Number(marks) : 1.0,
        negativeMarks: negativeMarks !== undefined ? Number(negativeMarks) : 0.25,
        imageUrl: cleanImageUrl,
        options: {
          create: options.map((opt: any, index: number) => ({
            optionText: opt.optionText,
            imageUrl: opt.imageUrl && typeof opt.imageUrl === 'string' && opt.imageUrl.trim() !== '' ? opt.imageUrl.trim() : null,
            isCorrect: Boolean(opt.isCorrect),
            optionOrder: opt.optionOrder ?? index + 1,
          })),
        },
      },
      include: {
        options: { orderBy: { optionOrder: 'asc' } },
      },
    });

    return sendSuccess(res, 'Question created successfully', question, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create question', 500);
  }
};

export const updateQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      sectionId,
      topicId,
      subTopicId,
      questionText,
      questionType,
      difficulty,
      explanation,
      marks,
      negativeMarks,
      imageUrl,
      isActive,
      options,
    } = req.body;

    const cleanSubTopicId = subTopicId && typeof subTopicId === 'string' && subTopicId.trim() !== '' ? subTopicId.trim() : null;
    const cleanImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '' ? imageUrl.trim() : null;

    // Use transaction to update question and options safely
    const updated = await prisma.$transaction(async (tx) => {
      if (options && Array.isArray(options) && options.length > 0) {
        await tx.questionOption.deleteMany({ where: { questionId: id } });
      }

      return await tx.question.update({
        where: { id },
        data: {
          ...(sectionId ? { sectionId } : {}),
          ...(topicId ? { topicId } : {}),
          subTopicId: cleanSubTopicId,
          ...(questionText ? { questionText } : {}),
          ...(questionType ? { questionType } : {}),
          ...(difficulty ? { difficulty } : {}),
          explanation: explanation !== undefined ? explanation : undefined,
          ...(marks !== undefined ? { marks: Number(marks) } : {}),
          ...(negativeMarks !== undefined ? { negativeMarks: Number(negativeMarks) } : {}),
          imageUrl: cleanImageUrl,
          ...(isActive !== undefined ? { isActive } : {}),
          ...(options && Array.isArray(options) && options.length > 0
            ? {
                options: {
                  create: options.map((opt: any, index: number) => ({
                    optionText: opt.optionText,
                    imageUrl: opt.imageUrl && typeof opt.imageUrl === 'string' && opt.imageUrl.trim() !== '' ? opt.imageUrl.trim() : null,
                    isCorrect: Boolean(opt.isCorrect),
                    optionOrder: opt.optionOrder ?? index + 1,
                  })),
                },
              }
            : {}),
        },
        include: {
          options: { orderBy: { optionOrder: 'asc' } },
        },
      });
    });

    return sendSuccess(res, 'Question updated successfully', updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update question', 500);
  }
};

export const deleteQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.question.delete({ where: { id } });
    return sendSuccess(res, 'Question deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete question', 500);
  }
};

export const duplicateQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.question.findUnique({
      where: { id },
      include: { options: { orderBy: { optionOrder: 'asc' } } },
    });

    if (!existing) {
      return sendError(res, 'Question not found', 404);
    }

    const duplicated = await prisma.question.create({
      data: {
        sectionId: existing.sectionId,
        topicId: existing.topicId,
        subTopicId: existing.subTopicId,
        questionText: `${existing.questionText} (Copy)`,
        questionType: existing.questionType,
        difficulty: existing.difficulty,
        explanation: existing.explanation,
        marks: existing.marks,
        negativeMarks: existing.negativeMarks,
        imageUrl: existing.imageUrl,
        options: {
          create: existing.options.map((opt, idx) => ({
            optionText: opt.optionText,
            imageUrl: opt.imageUrl,
            isCorrect: opt.isCorrect,
            optionOrder: opt.optionOrder ?? idx + 1,
          })),
        },
      },
      include: { options: { orderBy: { optionOrder: 'asc' } } },
    });

    return sendSuccess(res, 'Question duplicated successfully', duplicated, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to duplicate question', 500);
  }
};

export const importQuestions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return sendError(res, 'Please provide an array of valid questions to import', 400);
    }

    const importedResults = [];
    const errorsList = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      try {
        if (!q.questionText || !q.sectionId || !q.topicId || !Array.isArray(q.options) || q.options.length < 2) {
          errorsList.push({ index: i, error: 'Missing required fields or invalid options (at least 2 options required)' });
          continue;
        }

        const cleanSubTopicId = q.subTopicId && typeof q.subTopicId === 'string' && q.subTopicId.trim() !== '' ? q.subTopicId.trim() : null;

        const created = await prisma.question.create({
          data: {
            sectionId: q.sectionId,
            topicId: q.topicId,
            subTopicId: cleanSubTopicId,
            questionText: q.questionText,
            questionType: q.questionType || 'SINGLE_CHOICE',
            difficulty: q.difficulty || 'MEDIUM',
            explanation: q.explanation || null,
            marks: Number(q.marks || 1.0),
            negativeMarks: Number(q.negativeMarks || 0.25),
            options: {
              create: q.options.map((opt: any, idx: number) => ({
                optionText: opt.optionText,
                isCorrect: Boolean(opt.isCorrect),
                optionOrder: opt.optionOrder ?? idx + 1,
              })),
            },
          },
          include: { options: { orderBy: { optionOrder: 'asc' } } },
        });
        importedResults.push(created);
      } catch (err: any) {
        errorsList.push({ index: i, error: err.message });
      }
    }

    return sendSuccess(res, `Successfully imported ${importedResults.length} questions`, {
      importedCount: importedResults.length,
      errorsCount: errorsList.length,
      errors: errorsList,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to import questions', 500);
  }
};
