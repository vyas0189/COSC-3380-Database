CREATE TABLE IF NOT EXISTS patient
(
    patient_id           SERIAL PRIMARY KEY NOT NULL,
    patient_first_name   VARCHAR(100)       NOT NULL,
    patient_last_name    VARCHAR(100)       NOT NULL,
    patient_email        TEXT UNIQUE        NOT NULL,
    patient_address      TEXT               NOT NULL,
    patient_phone_number TEXT               NOT NULL,
    patient_age          INT                NOT NULL,
    patient_gender       VARCHAR(7)         NOT NULL,
    patient_dob          DATE               NOT NULL,
    patient_username     VARCHAR(100)       NOT NULL,
    patient_password     VARCHAR(100)       NOT NULL
);

CREATE TABLE IF NOT EXISTS appointment
(
    appt_id     SERIAL PRIMARY KEY,
    appt_date   TIMESTAMP NOT NULL DEFAULT NOW(),
    appt_reason TEXT      NOT NULL
);

CREATE TABLE IF NOT EXISTS doctor
(
    doctor_id           SERIAL PRIMARY KEY,
    doctor_address      TEXT         NOT NULL,
    doctor_first_name   varchar(100) NOT NULL,
    doctor_last_name    varchar(100) NOT NULL,
    doctor_phone_number TEXT         NOT NULL,
--   doctor_office REFERENCES office(office_id),     --Refrence to office regarding place of work/employment
    doctor_spec         TEXT         NOT NULL,
    doctor_availability TSTZRANGE[]  NOT NULL,
    doctor_username     VARCHAR(100) NOT NULL,
    doctor_password     VARCHAR(100) NOT NULL
    -- patients INT[] NOT NULL
    --open to a table or list of patient IDs (health_record_id)      --Refrence to Patient regarding care
    --Refrence to diagnosis regarding decision of treatment?
);

CREATE TABLE IF NOT EXISTS office
(
    office_id           SERIAL PRIMARY KEY,
    office_capacity     INT  NOT NULL,
    office_phone_number TEXT NOT NULL,
    office_opening_hour TIME NOT NULL,
    office_address      TEXT NOT NULL,
    office_specialty    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS test
(
    test_id        SERIAL PRIMARY KEY,
    test_date      TIMESTAMP NOT NULL DEFAULT NOW(),
    test_scan      BOOLEAN   NOT NULL,
    test_physical  BOOLEAN   NOT NULL,
    test_blood     BOOLEAN   NOT NULL,
    test_equipment TEXT      NOT NULL
    -- test_office REFERENCES office(office_id),
    -- test_doctor REFERENCES doctor(doctor_id)
);

CREATE TABLE IF NOT EXISTS diagnosis
(
    diag_id        SERIAL PRIMARY KEY,
    diag_symptoms  TEXT NOT NULL,
    diag_condition TEXT NOT NULL
);

CREATE TABLE "session"
(
    "sid"    VARCHAR      NOT NULL COLLATE "default",
    "sess"   JSON         NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
)
    WITH (OIDS= FALSE);
ALTER TABLE "session"
    ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

ALTER TABLE patient
    ADD COLUMN patient_primary_doctor SERIAL NOT NULL;
ALTER TABLE patient
    ADD CONSTRAINT pp_doctor FOREIGN KEY (patient_primary_doctor) REFERENCES doctor (doctor_id) ON UPDATE CASCADE;

ALTER TABLE appointment
    ADD COLUMN appt_office SERIAL NOT NULL,
    ADD CONSTRAINT appt_office_constraint FOREIGN KEY (appt_office) REFERENCES office (office_id);

ALTER TABLE appointment
    ADD COLUMN appt_patient SERIAL NOT NULL,
    ADD CONSTRAINT appt_patient_constraint FOREIGN KEY (appt_patient) REFERENCES patient (patient_id);