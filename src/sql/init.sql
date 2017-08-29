CREATE TABLE restaurants (
  id serial PRIMARY KEY,
  name text NOT NULL,
  inserted_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE foods (
  id serial PRIMARY KEY,
  name text NOT NULL,
  restaurant_id integer NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE ON UPDATE CASCADE,
  inserted_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id serial PRIMARY KEY,
  email text NOT NULL,
  password_digest TEXT NOT NULL,
  inserted_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ON users(email);
