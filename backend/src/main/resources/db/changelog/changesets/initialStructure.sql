--liquibase formatted sql
--changeset me:1

CREATE TABLE IF NOT EXISTS users (
    id serial not null primary key,
    name varchar(50) not null,
    username varchar(50) not null unique,
    email varchar(50) not null unique,
    password varchar(100) not null,
    deleted bool not null default false,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,
    deleted_at timestamp
);

CREATE TABLE IF NOT EXISTS roles (
    id serial not null primary key,
    name varchar(50) not null unique
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id bigint not null references users(id),
    role_id bigint not null references roles(id)
);

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
    user_id bigint not null references users(id),
    extra_info json,
    deleted bool not null default false,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,
    deleted_at timestamp
    );

CREATE TABLE IF NOT EXISTS person (
    id serial primary key,
    tree_id bigint references tree(id),
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
    first_person_id bigint references person(id),
    second_person_id bigint references person(id),
    relation_type relation_type,
    connection_type connection_type,
    deleted bool not null default false,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,
    deleted_at timestamp
);




-- rollback DROP table users;
-- rollback DROP table roles;
-- rollback DROP table user_roles;
-- rollback DROP table tree;
-- rollback DROP table person;
-- rollback DROP table relation;
-- rollback DROP type connection_type;
-- rollback DROP type relation_type;
-- rollback DROP type gender;