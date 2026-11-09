import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Create Super Admin ─────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@forestwheel.com' },
    update: {},
    create: {
      email: 'admin@forestwheel.com',
      passwordHash: adminPassword,
      fullName: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log(`✅ Super Admin created: ${superAdmin.email} (password: admin123)`);

  // ── Create Default Web Settings ────────────────────────
  const defaultSettings = [
    { key: 'logo_url', value: '', type: 'IMAGE' },
    { key: 'site_name', value: 'Forest Wheel', type: 'TEXT' },
    { key: 'site_tagline', value: 'High-Velocity Gallery', type: 'TEXT' },
    {
      key: 'about_hero_title',
      value: 'Our Story',
      type: 'TEXT',
    },
    {
      key: 'about_hero_text',
      value: "At Forest Wheel, we don't just sell vehicles; we curate automotive experiences that ignite the soul of driving.",
      type: 'TEXT',
    },
    {
      key: 'about_mission',
      value: 'To redefine the premium automotive journey by providing unparalleled transparency, curated selection, and bespoke financing solutions that put the driver first.',
      type: 'TEXT',
    },
    {
      key: 'about_vision',
      value: 'To become the global gold standard for luxury vehicle acquisitions, where every transaction is a seamless fusion of engineering excellence and human trust.',
      type: 'TEXT',
    },
    {
      key: 'about_founder_name',
      value: 'Edward Suryajaya',
      type: 'TEXT',
    },
    {
      key: 'about_founder_title',
      value: 'Founder & CEO',
      type: 'TEXT',
    },
    {
      key: 'about_founder_bio',
      value: "Founded in the heart of Singapore's premium automotive district, Edward Suryajaya envisioned a showroom that felt more like an art gallery than a dealership. With over two decades of experience in the luxury sector, Edward brought the \"Kinetic Gallery\" concept to life.\n\nHis philosophy, known as the \"Forest Wheel\" approach, emphasizes sustainable growth and the organic relationship between a driver and their machine.",
      type: 'TEXT',
    },
    {
      key: 'about_founder_quote',
      value: "The drive isn't about the destination, it's about the ignition of the spirit.",
      type: 'TEXT',
    },
    { key: 'about_stat_years', value: '25+', type: 'TEXT' },
    { key: 'about_stat_cars_sold', value: '12k', type: 'TEXT' },
    { key: 'about_stat_rating', value: '4.9', type: 'TEXT' },
    { key: 'about_stat_showrooms', value: '3', type: 'TEXT' },
    {
      key: 'contact_address',
      value: '1200 Atelier Dr.\nBeverly Hills, CA 90210',
      type: 'TEXT',
    },
    { key: 'contact_phone', value: '+1 (555) 012-3456', type: 'TEXT' },
    {
      key: 'contact_hours',
      value: 'Mon - Sat: 09:00 - 20:00\nSun: By Appointment',
      type: 'TEXT',
    },
    { key: 'footer_copyright', value: '© 2024 Forest Wheel. All rights reserved.', type: 'TEXT' },
  ];

  for (const setting of defaultSettings) {
    await prisma.webSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`✅ ${defaultSettings.length} default web settings created`);

  // ── Create Sample Vehicles ─────────────────────────────
  const sampleVehicles = [
    {
      make: 'Porsche',
      model: '911 GT3 RS',
      variant: '992 Generation · Weissach Package',
      year: 2023,
      mileage: 1240,
      mileageUnit: 'MI',
      price: 312000,
      currency: 'SGD',
      status: 'AVAILABLE',
      engine: '4.0L Flat-Six',
      transmission: 'PDK Auto',
      horsepower: '502 HP',
      color: 'Shark Blue',
      description:
        'Finished in stunning Shark Blue, this 911 GT3 represents the pinnacle of contemporary automotive engineering.',
      featured: true,
      inquiriesEnabled: true,
      createdById: superAdmin.id,
    },
    {
      make: 'Ferrari',
      model: 'SF90 Stradale',
      variant: 'Assetto Fiorano',
      year: 2022,
      mileage: 450,
      mileageUnit: 'MI',
      price: 645000,
      currency: 'SGD',
      status: 'SOLD',
      engine: '4.0L V8 Hybrid',
      transmission: '8-Speed DCT',
      horsepower: '986 HP',
      color: 'Rosso Corsa',
      description:
        'The most powerful Ferrari road car ever, combining V8 turbo power with three electric motors.',
      featured: false,
      inquiriesEnabled: false,
      createdById: superAdmin.id,
    },
    {
      make: 'Aston Martin',
      model: 'Vantage',
      variant: 'F1 Edition',
      year: 2021,
      mileage: 3100,
      mileageUnit: 'MI',
      price: 168500,
      currency: 'SGD',
      status: 'AVAILABLE',
      engine: '4.0L Twin-Turbo V8',
      transmission: '8-Speed ZF Auto',
      horsepower: '527 HP',
      color: 'Racing Green',
      description:
        'The F1 Edition Vantage delivers intense performance and unmistakable Aston Martin elegance.',
      featured: true,
      inquiriesEnabled: true,
      createdById: superAdmin.id,
    },
    {
      make: 'Lamborghini',
      model: 'Huracán STO',
      variant: 'Arancio Xanto',
      year: 2024,
      mileage: 120,
      mileageUnit: 'MI',
      price: 489000,
      currency: 'SGD',
      status: 'AVAILABLE',
      engine: '5.2L V10',
      transmission: 'LDF Dual-Clutch',
      horsepower: '640 HP',
      color: 'Arancio Xanto',
      description:
        'A race car for the road. The STO delivers uncompromised track performance in a stunning road-legal package.',
      featured: true,
      inquiriesEnabled: true,
      createdById: superAdmin.id,
    },
  ];

  for (const vehicle of sampleVehicles) {
    const existing = await prisma.vehicle.findFirst({
      where: { make: vehicle.make, model: vehicle.model, year: vehicle.year },
    });
    if (!existing) {
      await prisma.vehicle.create({ data: vehicle });
    }
  }
  console.log(`✅ ${sampleVehicles.length} sample vehicles created`);

  // ── Create Sample Leads ────────────────────────────────
  const sampleLeads = [
    {
      inquiryNumber: 'SELL-4922',
      fullName: 'Julian H. Sterling',
      email: 'j.sterling@estate.com',
      phone: '+1 (555) 0192-332',
      vehicleMake: 'Porsche',
      vehicleModel: '911 GT3 RS',
      vehicleYear: 2023,
      vehicleMileage: 4200,
      status: 'NEW',
    },
    {
      inquiryNumber: 'SELL-4918',
      fullName: 'Marcus Vane',
      email: 'mv@vaneindustries.co',
      phone: '+1 (415) 880-9921',
      vehicleMake: 'Aston Martin',
      vehicleModel: 'DB11',
      vehicleYear: 2021,
      vehicleMileage: 8900,
      status: 'CONTACTED',
    },
    {
      inquiryNumber: 'SELL-4905',
      fullName: 'Clara Rossi',
      email: 'rossi.c@arch.it',
      phone: '+39 02 892 210',
      vehicleMake: 'Ferrari',
      vehicleModel: 'Roma',
      vehicleYear: 2022,
      vehicleMileage: 1100,
      status: 'SOLD',
    },
  ];

  for (const lead of sampleLeads) {
    const existing = await prisma.lead.findUnique({
      where: { inquiryNumber: lead.inquiryNumber },
    });
    if (!existing) {
      await prisma.lead.create({ data: lead });
    }
  }
  console.log(`✅ ${sampleLeads.length} sample leads created`);

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
