import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return sendError(res, 'Email address is already registered', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return sendSuccess(res, 'Registration successful', { user, token }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Registration failed', 500);
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Your account has been deactivated. Please contact support.', 403);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, 'Login successful', { user: userResponse, token });
  } catch (error: any) {
    return sendError(res, error.message || 'Login failed', 500);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, 'Logged out successfully');
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, 'Current user profile retrieved', user);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch profile', 500);
  }
};
