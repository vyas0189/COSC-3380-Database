CREATE DATABASE hospital;
CREATE TABLE IF NOT EXISTS patients (
  health_record_id SERIAL PRIMARY KEY,
  first_name varchar(200) NOT NULL,
  last_name varchar(200) NOT NULL,
  email text UNIQUE NOT NULL,
  address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  age INT NOT NULL
);