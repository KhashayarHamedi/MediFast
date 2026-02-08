CREATE TYPE "public"."request_status" AS ENUM('pending', 'accepted', 'picked_up', 'delivering', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('patient', 'delivery', 'admin');--> statement-breakpoint
CREATE TABLE "pharmacies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"name_fa" text,
	"address" text NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"is_24h" boolean DEFAULT false,
	"phone" text,
	"city" text DEFAULT 'tehran',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"delivery_id" uuid,
	"pharmacy_id" uuid,
	"medicines" text NOT NULL,
	"prescription_photo_url" text,
	"address" text NOT NULL,
	"status" "request_status" DEFAULT 'pending' NOT NULL,
	"payment_method" text DEFAULT 'cash',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supabase_auth_id" text NOT NULL,
	"role" "user_role" DEFAULT 'patient' NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"address" text,
	"health_summary" text,
	"age" text,
	"allergies" text,
	"chronic_diseases" text,
	"current_meds" text,
	"is_online" boolean DEFAULT false,
	"latitude" real,
	"longitude" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_supabase_auth_id_unique" UNIQUE("supabase_auth_id")
);
--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_patient_id_users_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_delivery_id_users_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_pharmacy_id_pharmacies_id_fk" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id") ON DELETE set null ON UPDATE no action;