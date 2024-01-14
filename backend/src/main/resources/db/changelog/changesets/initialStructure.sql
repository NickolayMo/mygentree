--liquibase formatted sql
--changeset me:1

CREATE TABLE IF NOT EXISTS users
(
    id         serial       not null primary key,
    name       varchar(50)  not null,
    username   varchar(50)  not null unique,
    email      varchar(50)  not null unique,
    password   varchar(100) not null,
    is_active  bool         not null default false,
    created_at timestamp    not null default current_timestamp,
    updated_at timestamp    not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS app_roles
(
    id   serial      not null primary key,
    name varchar(50) not null unique
);
insert into app_roles (name)
values ('ROLE_USER');

CREATE TABLE IF NOT EXISTS user_app_roles
(
    id      serial not null primary key,
    user_id bigint not null references users (id),
    role_id bigint not null references app_roles (id),
    created_at timestamp not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS genders
(
    id     serial primary key,
    gender varchar(50) not null
);

insert into genders (gender)
values ('MALE'),
       ('FEMALE');

CREATE TABLE IF NOT EXISTS connection_types
(
    id              serial primary key,
    connection_type varchar(50) not null
);

insert into connection_types (connection_type)
values ('BLOOD'),
       ('MARRIED'),
       ('DIVORCED'),
       ('HALF');

CREATE TABLE IF NOT EXISTS relation_types
(
    id            serial primary key,
    relation_type varchar(50) not null,
    created_at    timestamp   not null default current_timestamp,
    updated_at    timestamp   not null default current_timestamp
);

insert into relation_types (relation_type)
values ('PARENT'),
       ('CHILD'),
       ('SIBLING'),
       ('SPOUSE');

CREATE TABLE IF NOT EXISTS trees
(
    id         serial primary key,
    name       text,
    extra_info json,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS access_statuses
(
    id     serial primary key,
    status varchar(50) not null
);

insert into access_statuses (status)
values ('REQUESTED'),
       ('GRANTED'),
       ('DECLINED');

CREATE TABLE IF NOT EXISTS tree_roles
(
    id   serial      not null primary key,
    name varchar(50) not null unique
);
insert into tree_roles (name)
values ('ROLE_USER'),
       ('ROLE_ADMIN'),
       ('ROLE_VIEWER');

CREATE TABLE IF NOT EXISTS user_trees
(
    id         serial primary key,
    user_id    bigint    not null references users (id),
    tree_id    bigint    not null references trees (id),
    created_at timestamp not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS user_tree_roles
(
    id               serial primary key,
    user_trees_id    bigint    not null references user_trees (id),
    role_id          bigint    not null references tree_roles (id),
    access_status_id bigint    not null references access_statuses (id),
    updated_by       bigint    not null references users (id),
    updated_at       timestamp not null default current_timestamp,
    created_at       timestamp not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS persons
(
    id         serial primary key,
    tree_id    bigint references trees (id),
    is_main    bool      not null default false,
    extra_info json,
    gender     bigint references genders (id),
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS relations
(
    id                serial primary key,
    person_id         bigint references persons (id),
    related_person_id bigint references persons (id),
    relation_type     bigint references relation_types (id),
    connection_type   bigint references connection_types (id),
    created_at        timestamp not null default current_timestamp,
    updated_at        timestamp not null default current_timestamp
);



-- rollback DROP table users;
-- rollback DROP table app_roles;
-- rollback DROP table tree_roles;
-- rollback DROP table user_app_roles;
-- rollback DROP table trees;
-- rollback DROP table persons;
-- rollback DROP table relations;
-- rollback DROP table connection_types;
-- rollback DROP table relation_types;
-- rollback DROP table genders;
-- rollback DROP table user_trees;
-- rollback DROP table user_tree_roles;
-- rollback DROP table access_statuses;