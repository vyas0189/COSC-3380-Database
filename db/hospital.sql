CREATE TABLE IF NOT EXISTS patient(
  patient_id SERIAL PRIMARY KEY,
  patient_first_name varchar(200) NOT NULL,
  patient_last_name varchar(200) NOT NULL,
  patient_email TEXT UNIQUE NOT NULL,
  patient_address TEXT NOT NULL,
  patient_phone_number TEXT NOT NULL,
  patient_age INT NOT NULL
  -- primary_doctor SERIAL NOT NULL REFERNCES doctor(doctor_id)
);

CREATE TABLE IF NOT EXISTS appointment(
    appt_id SERIAL PRIMARY KEY,
    appt_date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
    appt_reason TEXT
    -- appt_office SERIAL NOT NULL REFERENCES office(office_id) ,
);

CREATE TABLE IF NOT EXISTS doctor(
  doctor_id SERIAL PRIMARY KEY,
  doctor_address TEXT NOT NULL,
  doctor_first_name varchar(200) NOT NULL,
  doctor_last_name varchar(200) NOT NULL,
  doctor_phone_number TEXT NOT NULL,
--   doctor_office REFERENCES office(office_id),     --Refrence to office regarding place of work/employment
  doctor_spec TEXT NOT NULL,
  doctor_availability TSTZRANGE[] NOT NULL
  -- patients INT[] NOT NULL
  --open to a table or list of patient IDs (health_record_id)      --Refrence to Patient regarding care
  --Refrence to diagnosis regarding decision of treatment?
);

CREATE TABLE IF NOT EXISTS office(
  office_id SERIAL PRIMARY KEY,
  office_capacity INT NOT NULL,
  office_phone_number TEXT NOT NULL,
  office_opening_hour TIMESTAMP NOT NULL,
  office_address TEXT NOT NULL,
  office_specialty TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS test(
  test_id SERIAL PRIMARY KEY,
  test_date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
  test_scan boolean NOT NULL,
  test_physical boolean NOT NULL,
  test_blood boolean NOT NULL,
  test_equipment TEXT NOT NULL
  -- test_office REFERENCES office(office_id),
  -- test_doctor REFERENCES doctor(doctor_id)
);

CREATE TABLE IF NOT EXISTS diagnosis(
  diag_id SERIAL PRIMARY KEY,
  diag_symptoms TEXT NOT NULL,
  diag_condition TEXT NOT NULL
);