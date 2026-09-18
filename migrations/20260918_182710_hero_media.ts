import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "hero_media_home_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "hero_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_hero_art_id" integer,
  	"about_sketch_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "hero_media_home_slides" ADD CONSTRAINT "hero_media_home_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_media_home_slides" ADD CONSTRAINT "hero_media_home_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_media" ADD CONSTRAINT "hero_media_page_hero_art_id_media_id_fk" FOREIGN KEY ("page_hero_art_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_media" ADD CONSTRAINT "hero_media_about_sketch_id_media_id_fk" FOREIGN KEY ("about_sketch_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "hero_media_home_slides_order_idx" ON "hero_media_home_slides" USING btree ("_order");
  CREATE INDEX "hero_media_home_slides_parent_id_idx" ON "hero_media_home_slides" USING btree ("_parent_id");
  CREATE INDEX "hero_media_home_slides_image_idx" ON "hero_media_home_slides" USING btree ("image_id");
  CREATE INDEX "hero_media_page_hero_art_idx" ON "hero_media" USING btree ("page_hero_art_id");
  CREATE INDEX "hero_media_about_sketch_idx" ON "hero_media" USING btree ("about_sketch_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "hero_media_home_slides" CASCADE;
  DROP TABLE "hero_media" CASCADE;`)
}
