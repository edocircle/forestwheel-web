import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * List users with pagination and optional role filter
 */
export async function listUsers({ page = 1, limit = 10, role = null, search = '' }) {
  const skip = (page - 1) * limit;
  const where = {};

  if (role) {
    where.role = role;
  }

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit };
}

/**
 * Create a new user and return activation token
 */
export async function createUser({ email, fullName, role = 'USER' }) {
  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const activationToken = uuidv4();
  const activationExpires = new Date(Date.now() + 48 * 3600000); // 48 hours
  // Create with a temp password hash (user will set real password on activation)
  const tempHash = await bcrypt.hash(uuidv4(), 12);

  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      role,
      passwordHash: tempHash,
      activationToken,
      activationExpires,
      isActive: false,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return { user, activationToken };
}

/**
 * Get user by ID
 */
export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new Error('User not found');
  return user;
}

/**
 * Update user
 */
export async function updateUser(id, data) {
  const updateData = {};

  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

  return user;
}

/**
 * Delete (deactivate) user
 */
export async function deleteUser(id) {
  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
}

/**
 * Resend activation email by regenerating token
 */
export async function regenerateActivationToken(id) {
  const activationToken = uuidv4();
  const activationExpires = new Date(Date.now() + 48 * 3600000);

  const user = await prisma.user.update({
    where: { id },
    data: {
      activationToken,
      activationExpires,
      isActive: false,
    },
    select: {
      email: true,
      fullName: true,
    },
  });

  return { ...user, activationToken };
}
