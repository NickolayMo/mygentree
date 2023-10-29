--liquibase formatted sql
--changeset me:2

insert into roles (name) values ('ROLE_USER'), ('ROLE_ADMIN');