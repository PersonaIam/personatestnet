/* Create Schema
 *
 */

BEGIN;

/* Tables */
CREATE TABLE IF NOT EXISTS "attribute_types"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" VARCHAR(36) NOT NULL,
  "data_type" VARCHAR(36) NOT NULL,
  "validation" TEXT,
  "options" TEXT
);

CREATE TABLE IF NOT EXISTS "attributes"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "type" VARCHAR(36) NOT NULL,
  "value" TEXT,
  "owner" VARCHAR(36) NOT NULL,
  "timestamp" INT NOT NULL,
  "active" SMALLINT
);

CREATE TABLE IF NOT EXISTS "attribute_validations"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "attribute_id" SERIAL NOT NULL,
  "validator" VARCHAR(36) NOT NULL,
  "chunk" SMALLINT NOT NULL,
  "timestamp" INT NOT NULL,
  FOREIGN KEY("attribute_id") REFERENCES "attributes"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "ipfs_pin_queue"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "ipfs_hash" TEXT NOT NULL,
  "timestamp" INT NOT NULL
);

/* Unique Indexes */
CREATE UNIQUE INDEX IF NOT EXISTS "attributes_unique" ON "attributes"("type", "owner");
CREATE UNIQUE INDEX IF NOT EXISTS "attribute_types_unique" ON "attribute_types"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "ipfs_pin_queue_unique" ON "ipfs_pin_queue"("ipfs_hash");


/* Indexes */
CREATE INDEX IF NOT EXISTS "attribute_validation_id" ON "attribute_validations"("id");
CREATE INDEX IF NOT EXISTS "ipfs_pin_queue_id" ON "ipfs_pin_queue"("id");

COMMIT;
