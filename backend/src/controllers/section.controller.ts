import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getSections = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sections = await prisma.section.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            topics: true,
            questions: true,
            tests: true,
          },
        },
      },
    });

    return sendSuccess(res, 'Sections fetched successfully', sections);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch sections', 500);
  }
};

export const getSectionById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        topics: {
          include: {
            _count: {
              select: { questions: true, tests: true },
            },
          },
        },
        _count: {
          select: { questions: true, tests: true },
        },
      },
    });

    if (!section) {
      return sendError(res, 'Section not found', 404);
    }

    return sendSuccess(res, 'Section details fetched successfully', section);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch section', 500);
  }
};

export const createSection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, icon, image } = req.body;

    const existing = await prisma.section.findUnique({ where: { name } });
    if (existing) {
      return sendError(res, 'Section with this name already exists', 400);
    }

    const section = await prisma.section.create({
      data: { name, description, icon, image },
    });

    return sendSuccess(res, 'Section created successfully', section, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create section', 500);
  }
};

export const updateSection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, icon, image, isActive } = req.body;

    const section = await prisma.section.update({
      where: { id },
      data: { name, description, icon, image, isActive },
    });

    return sendSuccess(res, 'Section updated successfully', section);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update section', 500);
  }
};

export const deleteSection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.section.delete({ where: { id } });
    return sendSuccess(res, 'Section deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete section', 500);
  }
};
