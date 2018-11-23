/* Create Schema
 *
 */

BEGIN;

/* Tables */
CREATE TABLE IF NOT EXISTS "services"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" VARCHAR(36) NOT NULL,
  "provider" VARCHAR(36) NOT NULL,
  "description" VARCHAR(36) NOT NULL,
  "status" VARCHAR(36) NOT NULL,
  "timestamp" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS "service_attributes"(
  "service_name" VARCHAR(36) NOT NULL,
  "service_provider"  VARCHAR(36) NOT NULL,
  "attribute_type" VARCHAR(36) NOT NULL,
  FOREIGN KEY("attribute_type") REFERENCES "attribute_types"("name")
);

/* Unique Indexes */
CREATE UNIQUE INDEX IF NOT EXISTS "services" ON "services"("name", "provider");
CREATE UNIQUE INDEX IF NOT EXISTS "service_attributes" ON "service_attributes"("service_name","service_provider","attribute_type");

COMMIT;
