import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const attempts = await prisma.testAttempt.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      include: {
        test: {
          select: {
            id: true,
            title: true,
            totalQuestions: true,
            section: { select: { id: true, name: true } },
            topic: { select: { id: true, name: true } },
          },
        },
      },
    });

    const totalTestsAttempted = attempts.length;
    let questionsSolved = 0;
    let sumScore = 0;
    let sumAccuracy = 0;

    attempts.forEach((att) => {
      questionsSolved += (att.correctAnswers || 0) + (att.incorrectAnswers || 0);
      sumScore += att.percentage || 0;
      sumAccuracy += att.accuracy || 0;
    });

    const averageScore = totalTestsAttempted > 0 ? parseFloat((sumScore / totalTestsAttempted).toFixed(2)) : 0;
    const averageAccuracy = totalTestsAttempted > 0 ? parseFloat((sumAccuracy / totalTestsAttempted).toFixed(2)) : 0;

    const recentAttempts = attempts.slice(0, 5);

    // Fetch recommended tests
    const recommendedTests = await prisma.test.findMany({
      where: { status: 'PUBLISHED' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        section: { select: { id: true, name: true, icon: true } },
        topic: { select: { id: true, name: true } },
      },
    });

    // Calculate weak topics for user
    const answers = await prisma.attemptAnswer.findMany({
      where: { attempt: { userId, status: 'COMPLETED' } },
      include: { question: { include: { topic: true, section: true } } },
    });

    const topicScores: Record<string, { topicId: string; topicName: string; sectionName: string; total: number; correct: number }> = {};

    answers.forEach((ans) => {
      const tId = ans.question.topicId;
      const tName = ans.question.topic.name;
      const sName = ans.question.section.name;

      if (!topicScores[tId]) {
        topicScores[tId] = { topicId: tId, topicName: tName, sectionName: sName, total: 0, correct: 0 };
      }
      topicScores[tId].total++;
      if (ans.isCorrect) topicScores[tId].correct++;
    });

    const weakTopics = Object.values(topicScores)
      .map((t) => ({
        ...t,
        accuracy: parseFloat(((t.correct / t.total) * 100).toFixed(2)),
      }))
      .filter((t) => t.total >= 2 && t.accuracy < 65)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    return sendSuccess(res, 'Dashboard statistics fetched successfully', {
      stats: {
        testsAttempted: totalTestsAttempted,
        questionsSolved,
        averageScore,
        accuracy: averageAccuracy,
      },
      recentAttempts,
      recommendedTests,
      weakTopics,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch dashboard stats', 500);
  }
};

export const getPerformanceAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const attempts = await prisma.testAttempt.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { createdAt: 'asc' },
      include: {
        test: {
          include: { section: true, topic: true },
        },
        answers: {
          include: {
            question: { include: { section: true, topic: true } },
          },
        },
      },
    });

    // Performance over time
    const performanceOverTime = attempts.map((att, idx) => ({
      attemptNumber: idx + 1,
      testTitle: att.test.title,
      score: att.score,
      percentage: att.percentage,
      accuracy: att.accuracy,
      date: new Date(att.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

    // Performance by Section
    const sectionMap: Record<string, { sectionName: string; attempted: number; correct: number; totalMarks: number; obtainedMarks: number }> = {};

    // Performance by Topic
    const topicMap: Record<string, { topicName: string; sectionName: string; attempted: number; correct: number; accuracy: number }> = {};

    let totalCorrectAll = 0;
    let totalIncorrectAll = 0;

    attempts.forEach((att) => {
      totalCorrectAll += att.correctAnswers || 0;
      totalIncorrectAll += att.incorrectAnswers || 0;

      att.answers.forEach((ans) => {
        const secName = ans.question.section.name;
        const topName = ans.question.topic.name;

        if (!sectionMap[secName]) {
          sectionMap[secName] = { sectionName: secName, attempted: 0, correct: 0, totalMarks: 0, obtainedMarks: 0 };
        }
        sectionMap[secName].attempted++;
        if (ans.isCorrect) sectionMap[secName].correct++;
        sectionMap[secName].obtainedMarks += ans.marksObtained || 0;

        if (!topicMap[topName]) {
          topicMap[topName] = { topicName: topName, sectionName: secName, attempted: 0, correct: 0, accuracy: 0 };
        }
        topicMap[topName].attempted++;
        if (ans.isCorrect) topicMap[topName].correct++;
      });
    });

    const sectionPerformance = Object.values(sectionMap).map((sec) => ({
      ...sec,
      accuracy: sec.attempted > 0 ? parseFloat(((sec.correct / sec.attempted) * 100).toFixed(2)) : 0,
    }));

    const topicPerformance = Object.values(topicMap).map((top) => ({
      ...top,
      accuracy: top.attempted > 0 ? parseFloat(((top.correct / top.attempted) * 100).toFixed(2)) : 0,
    }));

    return sendSuccess(res, 'Performance analytics fetched successfully', {
      performanceOverTime,
      sectionPerformance,
      topicPerformance,
      overallSummary: {
        totalAttempts: attempts.length,
        totalCorrect: totalCorrectAll,
        totalIncorrect: totalIncorrectAll,
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch performance analytics', 500);
  }
};

export const getWeakTopics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const answers = await prisma.attemptAnswer.findMany({
      where: { attempt: { userId, status: 'COMPLETED' } },
      include: { question: { include: { topic: true, section: true } } },
    });

    const topicScores: Record<string, { topicId: string; topicName: string; sectionName: string; total: number; correct: number; incorrect: number }> = {};

    answers.forEach((ans) => {
      const tId = ans.question.topicId;
      const tName = ans.question.topic.name;
      const sName = ans.question.section.name;

      if (!topicScores[tId]) {
        topicScores[tId] = { topicId: tId, topicName: tName, sectionName: sName, total: 0, correct: 0, incorrect: 0 };
      }
      topicScores[tId].total++;
      if (ans.isCorrect) topicScores[tId].correct++;
      else if (ans.selectedOptionId) topicScores[tId].incorrect++;
    });

    const weakTopics = Object.values(topicScores)
      .map((t) => ({
        ...t,
        accuracy: parseFloat(((t.correct / t.total) * 100).toFixed(2)),
      }))
      .filter((t) => t.accuracy < 65)
      .sort((a, b) => a.accuracy - b.accuracy);

    return sendSuccess(res, 'Weak topics retrieved successfully', weakTopics);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch weak topics', 500);
  }
};
