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


CREATE TABLE IF NOT EXISTS user_trees (
    user_id bigint not null references users(id),
    tree_id bigint not null references tree(id)
);


-- rollback DROP table users;
-- rollback DROP table roles;
-- rollback DROP table user_roles;
-- rollback DROP type user_trees;