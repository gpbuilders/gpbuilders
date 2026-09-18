import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hero_media_home_slides_kind" AS ENUM('image', 'video');
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "hero_media_home_slides" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "videos_id" integer;
  ALTER TABLE "hero_media_home_slides" ADD COLUMN "kind" "enum_hero_media_home_slides_kind" DEFAULT 'image' NOT NULL;
  ALTER TABLE "hero_media_home_slides" ADD COLUMN "video_id" integer;
  ALTER TABLE "hero_media_home_slides" ADD COLUMN "poster_id" integer;
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "videos_filename_idx" ON "videos" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_media_home_slides" ADD CONSTRAINT "hero_media_home_slides_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_media_home_slides" ADD CONSTRAINT "hero_media_home_slides_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "hero_media_home_slides_video_idx" ON "hero_media_home_slides" USING btree ("video_id");
  CREATE INDEX "hero_media_home_slides_poster_idx" ON "hero_media_home_slides" USING btree ("poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "videos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "videos" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_videos_fk";
  
  ALTER TABLE "hero_media_home_slides" DROP CONSTRAINT "hero_media_home_slides_video_id_videos_id_fk";
  
  ALTER TABLE "hero_media_home_slides" DROP CONSTRAINT "hero_media_home_slides_poster_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_videos_id_idx";
  DROP INDEX "hero_media_home_slides_video_idx";
  DROP INDEX "hero_media_home_slides_poster_idx";
  ALTER TABLE "hero_media_home_slides" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "videos_id";
  ALTER TABLE "hero_media_home_slides" DROP COLUMN "kind";
  ALTER TABLE "hero_media_home_slides" DROP COLUMN "video_id";
  ALTER TABLE "hero_media_home_slides" DROP COLUMN "poster_id";
  DROP TYPE "public"."enum_hero_media_home_slides_kind";`)
}
