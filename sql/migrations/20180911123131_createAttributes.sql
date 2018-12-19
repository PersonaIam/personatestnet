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
  "associations" TEXT,
  "timestamp" INT NOT NULL,
  "expire_timestamp" INT
);

CREATE TABLE IF NOT EXISTS "attribute_updates"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "attribute_id" INT NOT NULL,
  "timestamp" INT NOT NULL,
  FOREIGN KEY("attribute_id") REFERENCES "attributes"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "attribute_validation_requests"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "attribute_id" INT NOT NULL,
  "validator" VARCHAR(36) NOT NULL,
  "status" VARCHAR(36) NOT NULL,
  "validation_type" VARCHAR(36),
  "reason" VARCHAR(1024),
  "timestamp" INT NOT NULL,
  "expire_timestamp" INT,
  FOREIGN KEY("attribute_id") REFERENCES "attributes"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "attribute_share_requests"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "attribute_id" INT,
  "applicant" VARCHAR(36) NOT NULL,
  "status" SMALLINT NOT NULL,
  "timestamp" INT NOT NULL,
  FOREIGN KEY("attribute_id") REFERENCES "attributes"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "attribute_shares"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "attribute_id" INT,
  "applicant" VARCHAR(36) NOT NULL,
  "value" TEXT,
  "timestamp" INT NOT NULL,
  FOREIGN KEY("attribute_id") REFERENCES "attributes"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "attribute_share_request_approvals"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "attribute_share_request_id" INT,
  "status" SMALLINT NOT NULL,
  "timestamp" INT NOT NULL,
  FOREIGN KEY("attribute_share_request_id") REFERENCES "attribute_share_requests"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "attribute_validation_request_actions"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "attribute_validation_request_id" INT NOT NULL,
  "action" VARCHAR(36) NOT NULL,
  "timestamp" INT NOT NULL,
  FOREIGN KEY("attribute_validation_request_id") REFERENCES "attribute_validation_requests"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "attribute_consumptions"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "attribute_id" INT,
  "timestamp" INT NOT NULL,
  "amount" INT NOT NULL,
  FOREIGN KEY("attribute_id") REFERENCES "attributes"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "rewards"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "recipient" VARCHAR(36) NOT NULL,
  "amount" INT NOT NULL,
  "timestamp" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS "reward_rounds"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "timestamp" INT NOT NULL,
  "status" VARCHAR(36) NOT NULL
);

CREATE TABLE IF NOT EXISTS "ipfs_pin_queue"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "ipfs_hash" TEXT NOT NULL,
  "timestamp" INT NOT NULL
);

/* Unique Indexes */
CREATE UNIQUE INDEX IF NOT EXISTS "attribute_types_unique" ON "attribute_types"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "ipfs_pin_queue_unique" ON "ipfs_pin_queue"("ipfs_hash");


/* Indexes */
CREATE INDEX IF NOT EXISTS "ipfs_pin_queue_id" ON "ipfs_pin_queue"("id");

COMMIT;
