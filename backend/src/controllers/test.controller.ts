import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getTests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sectionId, topicId, difficulty, testType, search, page = '1', limit = '12' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (sectionId) where.sectionId = sectionId as string;
    if (topicId) where.topicId = topicId as string;
    if (difficulty) where.difficulty = difficulty as any;
    if (testType) where.testType = testType as any;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [tests, total] = await Promise.all([
      prisma.test.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          section: { select: { id: true, name: true, icon: true } },
          topic: { select: { id: true, name: true } },
          exam: { select: { id: true, name: true } },
          _count: { select: { attempts: true, testQuestions: true } },
        },
      }),
      prisma.test.count({ where }),
    ]);

    return sendSuccess(res, 'Tests retrieved successfully', {
      tests,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch tests', 500);
  }
};

export const getTestById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        section: true,
        topic: true,
        exam: true,
        _count: { select: { attempts: true } },
      },
    });

    if (!test) {
      return sendError(res, 'Test not found', 404);
    }

    return sendSuccess(res, 'Test details retrieved successfully', test);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch test details', 500);
  }
};

export const startTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: testId } = req.params;
    const userId = req.user!.userId;

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        testQuestions: {
          orderBy: { questionOrder: 'asc' },
          include: {
            question: {
              include: {
                options: {
                  select: {
                    id: true,
                    optionText: true,
                    imageUrl: true,
                    optionOrder: true,
                    // EXPLICITLY OMIT isCorrect FOR SECURITY
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!test || test.status !== 'PUBLISHED') {
      return sendError(res, 'Test not available or unpublished', 404);
    }

    // Check if user has an existing active IN_PROGRESS attempt for this test
    const existingActiveAttempt = await prisma.testAttempt.findFirst({
      where: {
        userId,
        testId,
        status: 'IN_PROGRESS',
      },
      include: {
        answers: true,
      },
    });

    if (existingActiveAttempt) {
      // Clean options in response
      const sanitizedQuestions = test.testQuestions.map((tq) => ({
        id: tq.question.id,
        questionText: tq.question.questionText,
        questionType: tq.question.questionType,
        difficulty: tq.question.difficulty,
        marks: tq.question.marks,
        negativeMarks: tq.question.negativeMarks,
        imageUrl: tq.question.imageUrl,
        options: tq.question.options,
        questionOrder: tq.questionOrder,
      }));

      return sendSuccess(res, 'Resuming active test attempt', {
        attempt: existingActiveAttempt,
        test: {
          id: test.id,
          title: test.title,
          description: test.description,
          duration: test.duration,
          totalQuestions: test.totalQuestions,
          totalMarks: test.totalMarks,
          negativeMarking: test.negativeMarking,
        },
        questions: sanitizedQuestions,
      });
    }

    // Create a new TestAttempt
    const attempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId,
        startTime: new Date(),
        status: 'IN_PROGRESS',
      },
    });

    // Sanitize question data so correct answer and explanations are NEVER exposed to client
    const sanitizedQuestions = test.testQuestions.map((tq) => ({
      id: tq.question.id,
      questionText: tq.question.questionText,
      questionType: tq.question.questionType,
      difficulty: tq.question.difficulty,
      marks: tq.question.marks,
      negativeMarks: tq.question.negativeMarks,
      imageUrl: tq.question.imageUrl,
      options: tq.question.options,
      questionOrder: tq.questionOrder,
    }));

    return sendSuccess(res, 'Test attempt started successfully', {
      attempt,
      test: {
        id: test.id,
        title: test.title,
        description: test.description,
        duration: test.duration,
        totalQuestions: test.totalQuestions,
        totalMarks: test.totalMarks,
        negativeMarking: test.negativeMarking,
      },
      questions: sanitizedQuestions,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to start test', 500);
  }
};

export const submitTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: testId } = req.params;
    const { attemptId, answers } = req.body;
    const userId = req.user!.userId;

    // Validate attempt
    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: { test: true },
    });

    if (!attempt || attempt.userId !== userId || attempt.testId !== testId) {
      return sendError(res, 'Invalid test attempt or unauthorized submission', 400);
    }

    if (attempt.status === 'COMPLETED') {
      return sendError(res, 'Test has already been submitted', 400);
    }

    // Fetch answer key from DB for questions in this test
    const testQuestions = await prisma.testQuestion.findMany({
      where: { testId },
      include: {
        question: {
          include: {
            options: true,
          },
        },
      },
    });

    const questionMap = new Map();
    testQuestions.forEach((tq) => {
      questionMap.set(tq.question.id, tq.question);
    });

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;

    const answerRecords: any[] = [];

    // Process user submitted answers
    testQuestions.forEach((tq) => {
      const q = tq.question;
      const userAns = answers?.find((a: any) => a.questionId === q.id);

      if (!userAns || !userAns.selectedOptionId) {
        unattemptedCount++;
        answerRecords.push({
          attemptId: attempt.id,
          questionId: q.id,
          selectedOptionId: null,
          isCorrect: false,
          marksObtained: 0,
          timeSpent: userAns?.timeSpent || 0,
        });
      } else {
        const correctOpt = q.options.find((o) => o.isCorrect);
        const isCorrect = correctOpt && correctOpt.id === userAns.selectedOptionId;

        let marks = 0;
        if (isCorrect) {
          correctCount++;
          marks = q.marks;
          totalScore += marks;
        } else {
          incorrectCount++;
          marks = -q.negativeMarks;
          totalScore += marks;
        }

        answerRecords.push({
          attemptId: attempt.id,
          questionId: q.id,
          selectedOptionId: userAns.selectedOptionId,
          isCorrect,
          marksObtained: marks,
          timeSpent: userAns.timeSpent || 0,
        });
      }
    });

    const endTime = new Date();
    const timeTaken = Math.max(0, Math.floor((endTime.getTime() - new Date(attempt.startTime).getTime()) / 1000));
    const maxMarks = attempt.test.totalMarks || 1;
    const finalScore = Math.max(0, parseFloat(totalScore.toFixed(2)));
    const percentage = Math.min(100, Math.max(0, parseFloat(((finalScore / maxMarks) * 100).toFixed(2))));
    const attemptedTotal = correctCount + incorrectCount;
    const accuracy = attemptedTotal > 0 ? parseFloat(((correctCount / attemptedTotal) * 100).toFixed(2)) : 0;

    // Save transaction
    const completedAttempt = await prisma.$transaction(async (tx) => {
      // Save answers
      for (const rec of answerRecords) {
        await tx.attemptAnswer.upsert({
          where: {
            attemptId_questionId: {
              attemptId: rec.attemptId,
              questionId: rec.questionId,
            },
          },
          create: rec,
          update: rec,
        });
      }

      // Update attempt
      return await tx.testAttempt.update({
        where: { id: attempt.id },
        data: {
          endTime,
          timeTaken,
          score: finalScore,
          percentage,
          correctAnswers: correctCount,
          incorrectAnswers: incorrectCount,
          unattempted: unattemptedCount,
          accuracy,
          status: 'COMPLETED',
        },
      });
    });

    return sendSuccess(res, 'Test submitted successfully', {
      attemptId: completedAttempt.id,
      score: completedAttempt.score,
      percentage: completedAttempt.percentage,
      accuracy: completedAttempt.accuracy,
      correctAnswers: completedAttempt.correctAnswers,
      incorrectAnswers: completedAttempt.incorrectAnswers,
      unattempted: completedAttempt.unattempted,
      timeTaken: completedAttempt.timeTaken,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit test', 500);
  }
};

export const createTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      description,
      examId,
      sectionId,
      topicId,
      duration,
      totalQuestions,
      totalMarks,
      negativeMarking,
      difficulty,
      testType,
      status,
      questionIds,
      autoSelectCount,
    } = req.body;

    let selectedQIds: string[] = questionIds || [];

    // If auto select requested or missing questionIds
    if ((!selectedQIds || selectedQIds.length === 0) && autoSelectCount) {
      const filterWhere: any = { isActive: true };
      if (sectionId) filterWhere.sectionId = sectionId;
      if (topicId) filterWhere.topicId = topicId;
      if (difficulty) filterWhere.difficulty = difficulty;

      const availableQs = await prisma.question.findMany({
        where: filterWhere,
        take: autoSelectCount,
        select: { id: true },
      });

      selectedQIds = availableQs.map((q) => q.id);
    }

    const test = await prisma.test.create({
      data: {
        title,
        description,
        examId,
        sectionId,
        topicId,
        duration,
        totalQuestions: selectedQIds.length || totalQuestions,
        totalMarks,
        negativeMarking,
        difficulty,
        testType,
        status: status || 'PUBLISHED',
        testQuestions: {
          create: selectedQIds.map((qId: string, idx: number) => ({
            questionId: qId,
            questionOrder: idx + 1,
          })),
        },
      },
      include: {
        section: true,
        topic: true,
        testQuestions: true,
      },
    });

    return sendSuccess(res, 'Test created successfully', test, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create test', 500);
  }
};

export const updateTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      examId,
      sectionId,
      topicId,
      duration,
      totalQuestions,
      totalMarks,
      negativeMarking,
      difficulty,
      testType,
      status,
      questionIds,
    } = req.body;

    const updated = await prisma.$transaction(async (tx) => {
      if (questionIds && Array.isArray(questionIds)) {
        await tx.testQuestion.deleteMany({ where: { testId: id } });
      }

      return await tx.test.update({
        where: { id },
        data: {
          title,
          description,
          examId,
          sectionId,
          topicId,
          duration,
          totalQuestions: questionIds ? questionIds.length : totalQuestions,
          totalMarks,
          negativeMarking,
          difficulty,
          testType,
          status,
          ...(questionIds && Array.isArray(questionIds)
            ? {
                testQuestions: {
                  create: questionIds.map((qId: string, idx: number) => ({
                    questionId: qId,
                    questionOrder: idx + 1,
                  })),
                },
              }
            : {}),
        },
        include: {
          section: true,
          topic: true,
          testQuestions: true,
        },
      });
    });

    return sendSuccess(res, 'Test updated successfully', updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update test', 500);
  }
};

export const deleteTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.test.delete({ where: { id } });
    return sendSuccess(res, 'Test deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete test', 500);
  }
};
