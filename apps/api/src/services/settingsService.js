import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all settings
 */
export async function getAllSettings() {
  const settings = await prisma.webSetting.findMany({
    orderBy: { key: 'asc' },
  });

  // Convert to key-value object for easy frontend consumption
  const result = {};
  settings.forEach((s) => {
    result[s.key] = { value: s.value, type: s.type };
  });

  return result;
}

/**
 * Get a single setting by key
 */
export async function getSettingByKey(key) {
  const setting = await prisma.webSetting.findUnique({ where: { key } });
  if (!setting) return null;
  return setting;
}

/**
 * Update a setting value
 */
export async function updateSetting(key, value, type, userId) {
  const setting = await prisma.webSetting.upsert({
    where: { key },
    update: {
      value,
      type: type || undefined,
      updatedById: userId,
    },
    create: {
      key,
      value,
      type: type || 'TEXT',
      updatedById: userId,
    },
  });

  // Log activity
  if (userId) {
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'UPDATE_SETTING',
        entityType: 'web_setting',
        entityId: setting.id,
        metadata: { key, value: value.substring(0, 100) },
      },
    });
  }

  return setting;
}

/**
 * Batch update multiple settings
 */
export async function updateSettingsBatch(settingsMap, userId) {
  const results = [];
  for (const [key, val] of Object.entries(settingsMap)) {
    const setting = await updateSetting(
      key,
      val.value,
      val.type || 'TEXT',
      userId
    );
    results.push(setting);
  }
  return results;
}
