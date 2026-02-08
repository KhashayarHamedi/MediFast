/**
 * Seed 10-20 urgent/24h pharmacies in Tehran
 * Run: npx tsx scripts/seed-pharmacies.ts
 * Or: DATABASE_URL=... npx tsx scripts/seed-pharmacies.ts
 */

import { db } from "../lib/db";
import { pharmacies } from "../drizzle/schema";

const tehranPharmacies = [
  { name: "Daroukhaneye 24h Valiasr", nameFa: "داروخانه ۲۴ ساعته ولیعصر", address: "ولیعصر، نرسیده به میدان ونک", latitude: 35.7545, longitude: 51.4256, is24h: true, phone: "021-88765432", city: "tehran" },
  { name: "Daroukhaneye 24h Engelab", nameFa: "داروخانه ۲۴ ساعته انقلاب", address: "انقلاب، نزدیک دانشگاه تهران", latitude: 35.7020, longitude: 51.3935, is24h: true, phone: "021-66451234", city: "tehran" },
  { name: "Daroukhaneye Shafa", nameFa: "داروخانه شبانه‌روزی شفا", address: "تجریش، خیابان شهید کریمی", latitude: 35.8045, longitude: 51.4330, is24h: true, phone: "021-22765432", city: "tehran" },
  { name: "Daroukhaneye 24h Azadi", nameFa: "داروخانه ۲۴ ساعته آزادی", address: "آزادی، جنب میدان آزادی", latitude: 35.6997, longitude: 51.3381, is24h: true, phone: "021-66001234", city: "tehran" },
  { name: "Daroukhaneye Dey", nameFa: "داروخانه شبانه‌روزی دی", address: "سعادت‌آباد، بلوار دریا", latitude: 35.7694, longitude: 51.3692, is24h: true, phone: "021-44876543", city: "tehran" },
  { name: "Daroukhaneye 24h Tohid", nameFa: "داروخانه ۲۴ ساعته توحید", address: "توحید، تقاطع ستارخان", latitude: 35.7070, longitude: 51.3765, is24h: true, phone: "021-66543210", city: "tehran" },
  { name: "Daroukhaneye Niyayesh", nameFa: "داروخانه شبانه‌روزی نیایش", address: "نیایش، بلوار کاشانی", latitude: 35.7420, longitude: 51.3180, is24h: true, phone: "021-44123456", city: "tehran" },
  { name: "Daroukhaneye 24h Shariati", nameFa: "داروخانه ۲۴ ساعته شریعتی", address: "شریعتی، بالاتر از تجریش", latitude: 35.7750, longitude: 51.4380, is24h: true, phone: "021-22712345", city: "tehran" },
  { name: "Daroukhaneye Emam Hossein", nameFa: "داروخانه شبانه‌روزی امام حسین", address: "میدان امام حسین", latitude: 35.6880, longitude: 51.4320, is24h: true, phone: "021-77881234", city: "tehran" },
  { name: "Daroukhaneye 24h Ekbatan", nameFa: "داروخانه ۲۴ ساعته اکباتان", address: "شهرک اکباتان، فاز ۱", latitude: 35.7010, longitude: 51.3110, is24h: true, phone: "021-44654321", city: "tehran" },
  { name: "Daroukhaneye Omid", nameFa: "داروخانه امید", address: "پونک، بلوار اشرفی اصفهانی", latitude: 35.7340, longitude: 51.2920, is24h: false, phone: "021-44221100", city: "tehran" },
  { name: "Daroukhaneye Pars", nameFa: "داروخانه پارس", address: "ستارخان، خیابان چهارم", latitude: 35.7150, longitude: 51.3650, is24h: false, phone: "021-66551122", city: "tehran" },
];

async function main() {
  console.log("Seeding Tehran pharmacies...");
  for (const p of tehranPharmacies) {
    await db.insert(pharmacies).values(p);
  }
  console.log(`Seeded ${tehranPharmacies.length} pharmacies.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
