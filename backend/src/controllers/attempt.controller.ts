import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getUserAttempts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { sectionId, topicId, search, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      userId,
      status: 'COMPLETED',
    };

    if (sectionId || topicId || search) {
      where.test = {};
      if (sectionId) where.test.sectionId = sectionId as string;
      if (topicId) where.test.topicId = topicId as string;
      if (search) {
        where.test.title = { contains: search as string, mode: 'insensitive' };
      }
    }

    const [attempts, total] = await Promise.all([
      prisma.testAttempt.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          test: {
            select: {
              id: true,
              title: true,
              totalQuestions: true,
              totalMarks: true,
              duration: true,
              section: { select: { id: true, name: true } },
              topic: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.testAttempt.count({ where }),
    ]);

    return sendSuccess(res, 'Test history fetched successfully', {
      attempts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch test attempts', 500);
  }
};

export const getAttemptDetails = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: attemptId } = req.params;
    const userId = req.user!.userId;

    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        test: {
          include: {
            section: true,
            topic: true,
          },
        },
        answers: {
          include: {
            question: {
              include: {
                options: true,
                section: true,
                topic: true,
              },
            },
            selectedOption: true,
          },
        },
      },
    });

    if (!attempt) {
      return sendError(res, 'Attempt record not found', 404);
    }

    // Only allow owner or admin
    if (attempt.userId !== userId && req.user!.role !== 'ADMIN') {
      return sendError(res, 'Unauthorized to view this attempt result', 403);
    }

    // Group performance by section & topic
    const sectionStats: Record<string, { name: string; total: number; correct: number; incorrect: number }> = {};
    const topicStats: Record<string, { name: string; total: number; correct: number; incorrect: number }> = {};

    attempt.answers.forEach((ans) => {
      const secName = ans.question.section?.name || 'General';
      const topName = ans.question.topic?.name || 'General';

      if (!sectionStats[secName]) {
        sectionStats[secName] = { name: secName, total: 0, correct: 0, incorrect: 0 };
      }
      sectionStats[secName].total++;
      if (ans.isCorrect) sectionStats[secName].correct++;
      else if (ans.selectedOptionId) sectionStats[secName].incorrect++;

      if (!topicStats[topName]) {
        topicStats[topName] = { name: topName, total: 0, correct: 0, incorrect: 0 };
      }
      topicStats[topName].total++;
      if (ans.isCorrect) topicStats[topName].correct++;
      else if (ans.selectedOptionId) topicStats[topName].incorrect++;
    });

    return sendSuccess(res, 'Attempt details and solutions retrieved successfully', {
      attempt: {
        id: attempt.id,
        testId: attempt.testId,
        testTitle: attempt.test.title,
        startTime: attempt.startTime,
        endTime: attempt.endTime,
        timeTaken: attempt.timeTaken,
        score: attempt.score,
        percentage: attempt.percentage,
        correctAnswers: attempt.correctAnswers,
        incorrectAnswers: attempt.incorrectAnswers,
        unattempted: attempt.unattempted,
        accuracy: attempt.accuracy,
        totalQuestions: attempt.test.totalQuestions,
        totalMarks: attempt.test.totalMarks,
        sectionName: attempt.test.section?.name,
        topicName: attempt.test.topic?.name,
      },
      answers: attempt.answers.map((ans) => ({
        id: ans.id,
        questionId: ans.questionId,
        questionText: ans.question.questionText,
        questionType: ans.question.questionType,
        difficulty: ans.question.difficulty,
        explanation: ans.question.explanation,
        marks: ans.question.marks,
        negativeMarks: ans.question.negativeMarks,
        options: ans.question.options,
        selectedOptionId: ans.selectedOptionId,
        isCorrect: ans.isCorrect,
        marksObtained: ans.marksObtained,
        timeSpent: ans.timeSpent,
        sectionName: ans.question.section?.name,
        topicName: ans.question.topic?.name,
      })),
      sectionPerformance: Object.values(sectionStats),
      topicPerformance: Object.values(topicStats),
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch attempt details', 500);
  }
};
