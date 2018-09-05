BEGIN;


insert into attribute_types (name,data_type) VALUES ('name','regular');
insert into attribute_types (name,data_type) VALUES ('alias','regular');
insert into attribute_types (name,data_type) VALUES ('ssn','regular');
insert into attribute_types (name,data_type) VALUES ('date_of_birth','regular');
insert into attribute_types (name,data_type) VALUES ('birthplace','regular');
insert into attribute_types (name,data_type) VALUES ('address','regular');
insert into attribute_types (name,data_type) VALUES ('email','regular');
insert into attribute_types (name,data_type) VALUES ('phone_number','regular');
insert into attribute_types (name,data_type) VALUES ('parent_name','regular');
insert into attribute_types (name,data_type) VALUES ('notary_confirmation','regular');
insert into attribute_types (name,data_type) VALUES ('identity_card','ipfs');


COMMIT;
