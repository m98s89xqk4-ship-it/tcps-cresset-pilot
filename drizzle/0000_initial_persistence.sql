CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "public"."movement_type" AS ENUM('SQUAT', 'SPLIT_LUNGE', 'HIP_HINGE', 'CALF_RAISE', 'SNAP_DOWN', 'JUMP_LANDING');
CREATE TYPE "public"."readiness_status" AS ENUM('GREEN', 'YELLOW', 'RED');

CREATE TABLE "athletes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "code" varchar(32) NOT NULL,
  "school" varchar(120) DEFAULT 'Cresset Christian Academy' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "readiness_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "athlete_id" uuid NOT NULL,
  "soreness" integer NOT NULL,
  "energy" integer NOT NULL,
  "sleep" integer NOT NULL,
  "hydration" integer NOT NULL,
  "stress" integer NOT NULL,
  "self_readiness" integer NOT NULL,
  "pain_flag" boolean DEFAULT false NOT NULL,
  "note" text,
  "score" integer NOT NULL,
  "status" "public"."readiness_status" NOT NULL,
  "recorded_for" date NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "readiness_entries_soreness_check" CHECK ("readiness_entries"."soreness" between 1 and 5),
  CONSTRAINT "readiness_entries_energy_check" CHECK ("readiness_entries"."energy" between 1 and 5),
  CONSTRAINT "readiness_entries_sleep_check" CHECK ("readiness_entries"."sleep" between 1 and 5),
  CONSTRAINT "readiness_entries_hydration_check" CHECK ("readiness_entries"."hydration" between 1 and 5),
  CONSTRAINT "readiness_entries_stress_check" CHECK ("readiness_entries"."stress" between 1 and 5),
  CONSTRAINT "readiness_entries_self_readiness_check" CHECK ("readiness_entries"."self_readiness" between 1 and 5),
  CONSTRAINT "readiness_entries_score_check" CHECK ("readiness_entries"."score" between 0 and 100)
);

CREATE TABLE "movement_observations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "athlete_id" uuid NOT NULL,
  "readiness_entry_id" uuid,
  "movement_type" "public"."movement_type" NOT NULL,
  "media_ref" text,
  "structured_observations" jsonb,
  "coach_reviewed" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "curriculum_progress" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "athlete_id" uuid NOT NULL,
  "session_number" integer NOT NULL,
  "completed_at" timestamp with time zone NOT NULL,
  "knowledge_check_result" text,
  "reflection_note" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "curriculum_progress_session_number_check" CHECK ("curriculum_progress"."session_number" between 1 and 15)
);

ALTER TABLE "readiness_entries"
  ADD CONSTRAINT "readiness_entries_athlete_id_athletes_id_fk"
  FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "movement_observations"
  ADD CONSTRAINT "movement_observations_athlete_id_athletes_id_fk"
  FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "movement_observations"
  ADD CONSTRAINT "movement_observations_readiness_entry_id_readiness_entries_id_fk"
  FOREIGN KEY ("readiness_entry_id") REFERENCES "public"."readiness_entries"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "curriculum_progress"
  ADD CONSTRAINT "curriculum_progress_athlete_id_athletes_id_fk"
  FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;

CREATE UNIQUE INDEX "athletes_code_unique" ON "athletes" USING btree ("code");
CREATE UNIQUE INDEX "readiness_entries_athlete_date_unique" ON "readiness_entries" USING btree ("athlete_id", "recorded_for");
CREATE INDEX "readiness_entries_athlete_date_desc_idx" ON "readiness_entries" USING btree ("athlete_id", "recorded_for" DESC);
CREATE INDEX "movement_observations_athlete_created_at_idx" ON "movement_observations" USING btree ("athlete_id", "created_at" DESC);
CREATE UNIQUE INDEX "curriculum_progress_athlete_session_unique" ON "curriculum_progress" USING btree ("athlete_id", "session_number");
