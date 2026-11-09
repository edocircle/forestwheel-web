import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get dashboard summary stats
 */
export async function getStats() {
  const [
    totalInventory,
    availableCars,
    soldCarsMonth,
    activeLeads,
    totalLeads,
    recentVehicles,
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
    prisma.vehicle.count({
      where: {
        status: 'SOLD',
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.lead.count({ where: { status: { in: ['NEW', 'CONTACTED', 'IN_PROGRESS'] } } }),
    prisma.lead.count(),
    prisma.vehicle.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, make: true, model: true, price: true, status: true },
    }),
  ]);

  // Calculate total portfolio value
  const valueResult = await prisma.vehicle.aggregate({
    _sum: { price: true },
    where: { status: 'AVAILABLE' },
  });

  // Calculate monthly revenue (sold vehicles this month)
  const revenueResult = await prisma.vehicle.aggregate({
    _sum: { price: true },
    where: {
      status: 'SOLD',
      updatedAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });

  return {
    totalInventory,
    availableCars,
    soldCarsMonth,
    activeLeads,
    totalLeads,
    portfolioValue: valueResult._sum.price || 0,
    monthlyRevenue: revenueResult._sum.price || 0,
    recentVehicles,
  };
}

/**
 * Get recent activity feed
 */
export async function getActivityFeed(limit = 20) {
  const activities = await prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, fullName: true } },
    },
  });

  return activities;
}

/**
 * Get lead status distribution
 */
export async function getLeadAnalytics() {
  const statusCounts = await prisma.lead.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  // Leads per day (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000);
  const recentLeads = await prisma.lead.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  return {
    statusDistribution: statusCounts,
    recentLeadsTimeline: recentLeads,
  };
}
