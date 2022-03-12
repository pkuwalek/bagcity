CREATE DATABASE bagcity;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_name varchar(128) NOT NULL,
    email varchar(128) UNIQUE NOT NULL,
    password_hash char(128) NOT NULL
);

CREATE TABLE brands (
    brand_id SERIAL PRIMARY KEY,
    brand_name varchar(128)
);

CREATE TABLE types (
    type_id SERIAL PRIMARY KEY,
    type_name varchar(128)
);

CREATE TABLE colors (
    color_id SERIAL PRIMARY KEY,
    color_name varchar(128)
);

CREATE TABLE bags (
    bag_id SERIAL PRIMARY KEY,
    bag_name varchar(256) NOT NULL,
    price money,
    brand_id int REFERENCES brands (brand_id) NOT NULL,
    type_id int REFERENCES types (type_id),
    color_id int REFERENCES colors (color_id)
);

CREATE TABLE user_bag_relations (
    user_id int 
        REFERENCES users (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    bag_id int 
        REFERENCES bags (bag_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (user_id, bag_id)
)