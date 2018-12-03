/* Create Schema
 *
 */

BEGIN;

/* Tables */
CREATE TABLE IF NOT EXISTS "identity_use_requests"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "service_id" INT NOT NULL,
  "attribute_id" INT NOT NULL,
  "status" VARCHAR(36) NOT NULL,
  "timestamp" INT NOT NULL,
  FOREIGN KEY("attribute_id") REFERENCES "attributes"("id") ON DELETE CASCADE,
  FOREIGN KEY("service_id") REFERENCES "services"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "identity_use_request_actions"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "identity_use_request_id" INT NOT NULL,
  "action" VARCHAR(36) NOT NULL,
  "timestamp" INT NOT NULL,
  FOREIGN KEY("identity_use_request_id") REFERENCES "identity_use_requests"("id") ON DELETE CASCADE
);

COMMIT;
