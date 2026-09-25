import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getLeaderboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { timeframe = 'all' } = req.query;

    let dateFilter: Date | undefined;
    const now = new Date();

    if (timeframe === 'daily') {
      dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (timeframe === 'weekly') {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === 'monthly') {
      dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const where: any = {
      status: 'COMPLETED',
    };
    if (dateFilter) {
      where.createdAt = { gte: dateFilter };
    }

    const attempts = await prisma.testAttempt.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    const userStatsMap: Record<string, { userId: string; name: string; profileImage: string | null; testsCompleted: number; totalScore: number; sumPercentage: number; sumAccuracy: number }> = {};

    attempts.forEach((att) => {
      const uId = att.userId;
      if (!userStatsMap[uId]) {
        userStatsMap[uId] = {
          userId: uId,
          name: att.user.name,
          profileImage: att.user.profileImage,
          testsCompleted: 0,
          totalScore: 0,
          sumPercentage: 0,
          sumAccuracy: 0,
        };
      }

      userStatsMap[uId].testsCompleted++;
      userStatsMap[uId].totalScore += att.score || 0;
      userStatsMap[uId].sumPercentage += att.percentage || 0;
      userStatsMap[uId].sumAccuracy += att.accuracy || 0;
    });

    const leaderboard = Object.values(userStatsMap)
      .map((u) => ({
        userId: u.userId,
        name: u.name,
        profileImage: u.profileImage,
        testsCompleted: u.testsCompleted,
        totalScore: parseFloat(u.totalScore.toFixed(2)),
        averageScore: parseFloat((u.sumPercentage / u.testsCompleted).toFixed(2)),
        averageAccuracy: parseFloat((u.sumAccuracy / u.testsCompleted).toFixed(2)),
      }))
      .sort((a, b) => b.totalScore - a.totalScore || b.averageScore - a.averageScore)
      .map((user, index) => ({
        rank: index + 1,
        ...user,
      }));

    return sendSuccess(res, 'Leaderboard fetched successfully', leaderboard);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch leaderboard', 500);
  }
};
