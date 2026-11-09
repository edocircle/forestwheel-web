import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { signToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

/**
 * Authenticate user with email and password
 */
export async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is not activated. Please check your email for the activation link.');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  });

  // Log the login activity
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: 'LOGIN',
      entityType: 'user',
      entityId: user.id,
    },
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}

/**
 * Activate user account with token
 */
export async function activateAccount(activationToken) {
  const user = await prisma.user.findFirst({
    where: {
      activationToken,
      activationExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired activation token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isActive: true,
      activationToken: null,
      activationExpires: null,
    },
  });

  return { email: user.email, fullName: user.fullName };
}

/**
 * Set password after activation
 */
export async function setPassword(email, password) {
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });
}

/**
 * Generate password reset token
 */
export async function generateResetToken(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal if user exists
    return null;
  }

  const resetToken = uuidv4();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      activationToken: resetToken,
      activationExpires: new Date(Date.now() + 3600000), // 1 hour
    },
  });

  return { resetToken, fullName: user.fullName };
}

/**
 * Reset password with token
 */
export async function resetPassword(token, newPassword) {
  const user = await prisma.user.findFirst({
    where: {
      activationToken: token,
      activationExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      activationToken: null,
      activationExpires: null,
    },
  });

  return { email: user.email };
}

/**
 * Get current user profile
 */
export async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) throw new Error('User not found');
  return user;
}
