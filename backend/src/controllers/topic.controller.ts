import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getTopics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sectionId } = req.query;
    const where: any = {};
    if (sectionId) {
      where.sectionId = sectionId as string;
    }

    const topics = await prisma.topic.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        section: { select: { id: true, name: true } },
        _count: {
          select: { questions: true, tests: true, subTopics: true },
        },
      },
    });

    return sendSuccess(res, 'Topics fetched successfully', topics);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch topics', 500);
  }
};

export const getTopicById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        section: true,
        subTopics: true,
        _count: {
          select: { questions: true, tests: true },
        },
      },
    });

    if (!topic) {
      return sendError(res, 'Topic not found', 404);
    }

    return sendSuccess(res, 'Topic details fetched successfully', topic);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch topic', 500);
  }
};

export const createTopic = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sectionId, name, description } = req.body;

    const topic = await prisma.topic.create({
      data: { sectionId, name, description },
      include: { section: true },
    });

    return sendSuccess(res, 'Topic created successfully', topic, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create topic', 500);
  }
};

export const updateTopic = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, sectionId, isActive } = req.body;

    const topic = await prisma.topic.update({
      where: { id },
      data: { name, description, sectionId, isActive },
      include: { section: true },
    });

    return sendSuccess(res, 'Topic updated successfully', topic);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update topic', 500);
  }
};

export const deleteTopic = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.topic.delete({ where: { id } });
    return sendSuccess(res, 'Topic deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete topic', 500);
  }
};
