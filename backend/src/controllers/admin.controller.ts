import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, role, page = '1', limit = '15' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (role) where.role = role as any;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profileImage: true,
          isActive: true,
          createdAt: true,
          _count: { select: { attempts: true, bookmarks: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return sendSuccess(res, 'Users fetched successfully', {
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch users', 500);
  }
};

export const toggleUserStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    return sendSuccess(res, `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update user status', 500);
  }
};

export const getAdminStatistics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalTests,
      totalQuestions,
      totalAttempts,
      todaysAttempts,
      activeUsers,
      sectionsCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.test.count(),
      prisma.question.count(),
      prisma.testAttempt.count({ where: { status: 'COMPLETED' } }),
      prisma.testAttempt.count({ where: { status: 'COMPLETED', createdAt: { gte: todayStart } } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.section.findMany({
        include: { _count: { select: { questions: true, tests: true } } },
      }),
    ]);

    // Section popularity by test attempts
    const attempts = await prisma.testAttempt.findMany({
      where: { status: 'COMPLETED' },
      select: {
        test: {
          select: { section: { select: { name: true } } },
        },
      },
    });

    const sectionAttemptsMap: Record<string, number> = {};
    attempts.forEach((att) => {
      const secName = att.test.section?.name || 'General / Mixed';
      sectionAttemptsMap[secName] = (sectionAttemptsMap[secName] || 0) + 1;
    });

    const sectionPopularity = Object.entries(sectionAttemptsMap).map(([name, attemptsCount]) => ({
      name,
      attempts: attemptsCount,
    }));

    return sendSuccess(res, 'Admin statistics retrieved successfully', {
      totalUsers,
      totalTests,
      totalQuestions,
      totalAttempts,
      todaysAttempts,
      activeUsers,
      sectionsCount: sectionsCount.length,
      sectionPopularity,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch admin statistics', 500);
  }
};

export const getAdminAttempts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = '1', limit = '15' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [attempts, total] = await Promise.all([
      prisma.testAttempt.findMany({
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          test: { select: { id: true, title: true, section: { select: { name: true } } } },
        },
      }),
      prisma.testAttempt.count(),
    ]);

    return sendSuccess(res, 'Admin attempts log retrieved successfully', {
      attempts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch admin attempts', 500);
  }
};
