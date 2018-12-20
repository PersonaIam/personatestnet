/* Create Schema
 *
 */

BEGIN;

/* Tables */
CREATE TABLE IF NOT EXISTS "services"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" VARCHAR(36) NOT NULL,
  "provider" VARCHAR(36) NOT NULL,
  "description" VARCHAR(2048) NOT NULL,
  "status" VARCHAR(36) NOT NULL,
  "timestamp" INT NOT NULL,
  "attribute_types" TEXT NOT NULL,
  "validations_required" INT NOT NULL
);

/* Unique Indexes */
CREATE UNIQUE INDEX IF NOT EXISTS "services" ON "services"("name", "provider");

COMMIT;
