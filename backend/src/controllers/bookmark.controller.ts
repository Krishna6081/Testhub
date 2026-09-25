import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getBookmarks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        question: {
          include: {
            section: { select: { id: true, name: true } },
            topic: { select: { id: true, name: true } },
            options: true,
          },
        },
      },
    });

    return sendSuccess(res, 'Bookmarks retrieved successfully', bookmarks);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch bookmarks', 500);
  }
};

export const addBookmark = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { questionId } = req.body;

    if (!questionId) {
      return sendError(res, 'questionId is required', 400);
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
      create: { userId, questionId },
      update: {},
      include: { question: true },
    });

    return sendSuccess(res, 'Question bookmarked successfully', bookmark, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to add bookmark', 500);
  }
};

export const removeBookmark = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if id is bookmark id or question id
    const existing = await prisma.bookmark.findFirst({
      where: {
        userId,
        OR: [{ id }, { questionId: id }],
      },
    });

    if (!existing) {
      return sendError(res, 'Bookmark not found', 404);
    }

    await prisma.bookmark.delete({ where: { id: existing.id } });
    return sendSuccess(res, 'Bookmark removed successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to remove bookmark', 500);
  }
};
