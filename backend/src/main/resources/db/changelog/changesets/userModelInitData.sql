--liquibase formatted sql
--changeset me:4

insert into roles (name) values ('ROLE_USER'), ('ROLE_ADMIN');