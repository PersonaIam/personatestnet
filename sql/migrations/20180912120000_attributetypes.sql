BEGIN;

insert into attribute_types (name,data_type,validation,options) VALUES ('first_name','text', '{"required": true, "minLength": 2, "maxLength": 80}','{"documentRequired":true}');
insert into attribute_types (name,data_type,validation) VALUES ('last_name','text', '{"required": true, "minLength": 2, "maxLength": 80}');
insert into attribute_types (name,data_type,validation) VALUES ('ssn','text', '{"required": true, "minLength": 2, "maxLength": 80}');
insert into attribute_types (name,data_type,validation) VALUES ('alias','text', '{"required": true, "minLength": 2, "maxLength": 80}');
insert into attribute_types (name,data_type,validation) VALUES ('date_of_birth','date', '{"required": true}');
insert into attribute_types (name,data_type,validation,options) VALUES ('address','text', '{"required": true, "minLength": 2, "maxLength": 80}', '{"type": "textarea","documentRequired":true}');
insert into attribute_types (name,data_type,validation) VALUES ('birthplace','text', '{"required": true, "minLength": 2, "maxLength": 80}');
insert into attribute_types (name,data_type,validation,options) VALUES ('email','text','{"required": true, "minLength": 2, "maxLength": 80, "pattern": "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}" }', '{"type":"email"}');
insert into attribute_types (name,data_type,validation) VALUES ('phone_number','text','{"required": true, "minLength": 2, "maxLength": 80}');
insert into attribute_types (name,data_type,validation) VALUES ('mothers_name','text','{"required": true, "minLength": 2, "maxLength": 80}');
insert into attribute_types (name,data_type,validation) VALUES ('fathers_name','text','{"required": true, "minLength": 2, "maxLength": 80}');
insert into attribute_types (name,data_type,validation, options) VALUES ('identity_card','file', '{"required":true}','{"accept": ["image/*",".pdf"], "maxSize": 10485760, "expirable": true}');


COMMIT;
