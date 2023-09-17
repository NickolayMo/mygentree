--liquibase formatted sql
--changeset me:1
DO $$ BEGIN
CREATE TYPE gender AS ENUM (
'BLOOD',
'MALE',
'FEMALE'
);
EXCEPTION
WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE TYPE connection_type AS ENUM (
'BLOOD',
'MARRIED',
'DIVORCED',
'ADOPTED',
'HALF'
);
EXCEPTION
WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE TYPE relation_type AS ENUM (
'PARENT',
'CHILD',
'SIBLING',
'SPOUSE'
);
EXCEPTION
WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS tree (
id serial primary key,
name text,
extra_info json,
deleted bool not null default false,
created_at timestamp not null default current_timestamp,
updated_at timestamp not null default current_timestamp,
deleted_at timestamp
);

CREATE TABLE IF NOT EXISTS person (
id serial primary key,
tree_id bigint,
is_main bool not null default false,
extra_info json,
gender gender,
deleted bool not null default false,
created_at timestamp not null default current_timestamp,
updated_at timestamp not null default current_timestamp,
deleted_at timestamp
);

CREATE TABLE IF NOT EXISTS relation (
id serial primary key,
first_person_id bigint,
second_person_id bigint,
relation_type relation_type,
connection_type connection_type,
deleted bool not null default false,
created_at timestamp not null default current_timestamp,
updated_at timestamp not null default current_timestamp,
deleted_at timestamp
);

-- rollback DROP table tree;
-- rollback DROP table person;
-- rollback DROP table relation;
-- rollback DROP type connection_type;
-- rollback DROP type relation_type;
-- rollback DROP type gender;