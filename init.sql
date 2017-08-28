CREATE TABLE restaurants (
  id serial PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE foods (
  id serial PRIMARY KEY,
  name text NOT NULL,
  restaurant_id integer NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE users (
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  sur_name text NOT NULL
);
