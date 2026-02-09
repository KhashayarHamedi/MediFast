import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  real,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["patient", "delivery", "admin"]);
export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "accepted",
  "picked_up",
  "delivering",
  "delivered",
  "cancelled",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  supabaseAuthId: text("supabase_auth_id").notNull().unique(),
  role: userRoleEnum("role").notNull().default("patient"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  plz: text("plz"),
  street: text("street"),
  houseNumber: text("house_number"),
  healthSummary: text("health_summary"),
  age: text("age"),
  allergies: text("allergies"),
  chronicDiseases: text("chronic_diseases"),
  currentMeds: text("current_meds"),
  dateOfBirth: text("date_of_birth"),
  idDocumentUrl: text("id_document_url"),
  vehicleType: text("vehicle_type"),
  isOnline: boolean("is_online").default(false),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pharmacies = pgTable("pharmacies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  nameFa: text("name_fa"),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  is24h: boolean("is_24h").default(false),
  phone: text("phone"),
  city: text("city").default("vienna"),
  acceptsRx: boolean("accepts_rx").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const requests = pgTable("requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  deliveryId: uuid("delivery_id").references(() => users.id, { onDelete: "set null" }),
  pharmacyId: uuid("pharmacy_id").references(() => pharmacies.id, { onDelete: "set null" }),
  medicines: text("medicines").notNull(),
  prescriptionPhotoUrl: text("prescription_photo_url"),
  address: text("address").notNull(),
  status: requestStatusEnum("status").notNull().default("pending"),
  paymentMethod: text("payment_method").default("cash"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Pharmacy = typeof pharmacies.$inferSelect;
export type NewPharmacy = typeof pharmacies.$inferInsert;
export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;
