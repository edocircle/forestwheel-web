import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Counter for inquiry numbers
let inquiryCounter = null;

async function getNextInquiryNumber() {
  if (inquiryCounter === null) {
    const lastLead = await prisma.lead.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { inquiryNumber: true },
    });
    if (lastLead) {
      const num = parseInt(lastLead.inquiryNumber.replace('SELL-', ''), 10);
      inquiryCounter = isNaN(num) ? 1000 : num;
    } else {
      inquiryCounter = 1000;
    }
  }
  inquiryCounter++;
  return `SELL-${inquiryCounter}`;
}

/**
 * List leads with pagination and filters
 */
export async function listLeads({
  page = 1,
  limit = 10,
  status = null,
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) {
  const skip = (page - 1) * limit;
  const where = {};

  if (status) where.status = status;

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { vehicleMake: { contains: search, mode: 'insensitive' } },
      { vehicleModel: { contains: search, mode: 'insensitive' } },
      { inquiryNumber: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        assignedTo: { select: { id: true, fullName: true } },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total, page, limit };
}

/**
 * Get lead by ID
 */
export async function getLeadById(id) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, fullName: true } },
    },
  });

  if (!lead) throw new Error('Lead not found');
  return lead;
}

/**
 * Create a new lead (from public "Sell Your Car" form)
 */
export async function createLead(data) {
  const inquiryNumber = await getNextInquiryNumber();

  const lead = await prisma.lead.create({
    data: {
      inquiryNumber,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || null,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      vehicleYear: data.vehicleYear ? parseInt(data.vehicleYear, 10) : null,
      vehicleMileage: data.vehicleMileage ? parseInt(data.vehicleMileage, 10) : null,
      registrationDate: data.registrationDate || null,
      carPlate: data.carPlate || null,
      accessCode: data.accessCode || null,
      status: 'NEW',
    },
  });

  return lead;
}

/**
 * Update lead (status, notes, assignment)
 */
export async function updateLead(id, data, userId) {
  const updateData = {};

  if (data.status !== undefined) updateData.status = data.status;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId;

  const lead = await prisma.lead.update({
    where: { id },
    data: updateData,
    include: {
      assignedTo: { select: { id: true, fullName: true } },
    },
  });

  // Log activity
  if (userId) {
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'UPDATE_LEAD',
        entityType: 'lead',
        entityId: id,
        metadata: updateData,
      },
    });
  }

  return lead;
}

/**
 * Delete/archive lead
 */
export async function deleteLead(id) {
  await prisma.lead.delete({ where: { id } });
}

/**
 * Get lead status counts for filter badges
 */
export async function getLeadStatusCounts() {
  const counts = await prisma.lead.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  const total = await prisma.lead.count();

  const result = { total, NEW: 0, CONTACTED: 0, IN_PROGRESS: 0, SOLD: 0, ARCHIVED: 0 };
  counts.forEach((c) => {
    result[c.status] = c._count.status;
  });

  return result;
}
