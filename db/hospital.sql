DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO cqymabuhycrune;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public IS 'standard public schema';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SELECT *
-- FROM db_user;
--
-- SELECT *
-- FROM address;
--
-- SELECT *
-- FROM patient;
--
-- SELECT * FROM db_user u JOIN patient p ON u.user_id = p.patient_user WHERE u.user_id = 'dc5dc0f2-fe58-4b7e-9f77-b2865c1037e7';
--
-- SELECT *
-- FROM db_user u
--          JOIN patient p ON u.user_id = p.patient_user
-- WHERE u.username = 'testing123'
--    OR p.patient_email = 'testing@gmail.com';
--
-- DELETE
-- FROM db_user;
--
-- DELETE
-- FROM address;
--
-- DELETE
-- FROM patient;

CREATE TABLE db_user
(
    user_id    UUID PRIMARY KEY NOT NULL                                                DEFAULT uuid_generate_v4(),
    username   VARCHAR(100)     NOT NULL,
    password   VARCHAR(200)     NOT NULL,
    role       VARCHAR(50)      NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')) DEFAULT 'patient',
    created_at TIMESTAMP        NOT NULL                                                DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP        NOT NULL                                                DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS address
(
    address_id    UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    address_name  TEXT             NOT NULL,
    address2_name TEXT,
    city          VARCHAR(100)     NOT NULL,
    state         VARCHAR(50)      NOT NULL,
    zip           INTEGER          NOT NULL
);
CREATE TABLE IF NOT EXISTS patient
(
    patient_id             UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    patient_first_name     VARCHAR(100)     NOT NULL,
    patient_last_name      VARCHAR(100)     NOT NULL,
    patient_email          TEXT UNIQUE      NOT NULL,
    patient_phone_number   TEXT             NOT NULL,
    patient_gender         VARCHAR(7)       NOT NULL,
    patient_address        UUID             NOT NULL REFERENCES address (address_id) ON DELETE CASCADE ON UPDATE CASCADE,
    patient_dob            DATE             NOT NULL,
    patient_user           UUID             NOT NULL REFERENCES db_user (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    patient_diagnosis      UUID,
    patient_primary_doctor UUID
);
CREATE TABLE IF NOT EXISTS appointment
(
    appointment_id      UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    appointment_patient UUID             NOT NULL,
    appointment_doctor  UUID             NOT NULL,
    appointment_start   TIMESTAMP        NOT NULL,
    appointment_end     TIMESTAMP        NOT NULL,
    appointment_reason  TEXT             NOT NULL,
    appointment_office  UUID             NOT NULL
);
CREATE TABLE IF NOT EXISTS office
(
    office_id           UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    office_capacity     INT              NOT NULL,
    office_address      UUID             NOT NULL REFERENCES address (address_id) ON DELETE CASCADE ON UPDATE CASCADE,
    office_phone_number TEXT             NOT NULL,
    office_opening_hour TIME             NOT NULL
);
CREATE TABLE IF NOT EXISTS doctor
(
    doctor_id           UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    doctor_primary      BOOLEAN                   DEFAULT FALSE,
    doctor_address      UUID             NOT NULL REFERENCES address (address_id),
    doctor_first_name   varchar(100)     NOT NULL,
    doctor_last_name    varchar(100)     NOT NULL,
    doctor_email        TEXT UNIQUE      NOT NULL,
    doctor_phone_number TEXT             NOT NULL,
    doctor_office       UUID             NOT NULL REFERENCES office (office_id),
    doctor_specialty    TEXT             NOT NULL,
    doctor_user         UUID             NOT NULL REFERENCES db_user (user_id),
    doctor_diagnosis    UUID,
    doctor_test         UUID
);
CREATE TABLE IF NOT EXISTS availability
(
    availability_id        UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    doctor_id              UUID             NOT NULL REFERENCES doctor (doctor_id),
    office_id              UUID             NOT NULL REFERENCES office (office_id),
    availability_date      DATE             NOT NULL,
    availability_from_time TIME             NOT NULL,
    availability_to_time   TIME             NOT NULL
);
CREATE TABLE IF NOT EXISTS test
(
    test_id        UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    test_date      TIMESTAMP        NOT NULL DEFAULT NOW(),
    test_scan      BOOLEAN          NOT NULL DEFAULT FALSE,
    test_physical  BOOLEAN          NOT NULL DEFAULT FALSE,
    test_blood     BOOLEAN          NOT NULL DEFAULT FALSE,
    test_equipment TEXT             NOT NULL,
    test_office    UUID             NOT NULL REFERENCES office (office_id),
    test_doctor    UUID             NOT NULL REFERENCES doctor (doctor_id),
    test_patient   UUID             NOT NULL REFERENCES patient (patient_id),
    test_diagnosis UUID
);
CREATE TABLE IF NOT EXISTS diagnosis
(
    diagnosis_id        UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    diagnosis_symptoms  TEXT             NOT NULL,
    diagnosis_condition TEXT             NOT NULL
);
-- CREATE TABLE "session"
-- (
--     "sid"    VARCHAR      NOT NULL COLLATE "default",
--     "sess"   JSON         NOT NULL,
--     "expire" TIMESTAMP(6) NOT NULL
-- ) WITH (OIDS = FALSE);
--
-- ALTER TABLE "session"
--     ADD
--         CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
-- CREATE INDEX "IDX_session_expire" ON "session" ("expire");
ALTER TABLE patient
    ADD
        CONSTRAINT fk_doctor FOREIGN KEY (patient_primary_doctor) REFERENCES doctor (doctor_id);
ALTER TABLE patient
    ADD
        CONSTRAINT fk_patient_diagnosis FOREIGN KEY (patient_diagnosis) REFERENCES diagnosis (diagnosis_id);
ALTER TABLE doctor
    ADD
        CONSTRAINT fk_doctor_diagnosis FOREIGN KEY (doctor_diagnosis) REFERENCES diagnosis (diagnosis_id);
ALTER TABLE doctor
    ADD
        CONSTRAINT fk_doctor_test FOREIGN KEY (doctor_test) REFERENCES test (test_id);
ALTER TABLE test
    ADD
        CONSTRAINT fk_test_diagnosis FOREIGN KEY (test_diagnosis) REFERENCES diagnosis (diagnosis_id);
ALTER TABLE appointment
    ADD
        CONSTRAINT fk_appointment_office FOREIGN KEY (appointment_office) REFERENCES office (office_id);
ALTER TABLE appointment
    ADD
        CONSTRAINT fk_appointment_patient FOREIGN KEY (appointment_patient) REFERENCES patient (patient_id);
ALTER TABLE appointment
    ADD
        CONSTRAINT fk_appointment_doctor FOREIGN KEY (appointment_doctor) REFERENCES doctor (doctor_id);
-- CREATE FUNCTION insert_availability() RETURNS trigger AS
-- $$
-- BEGIN
--     NEW.doctor_availability :=
--             array(select json_build_object('time', tstzrange(a, a + '1 hour'::interval, '[]'), 'taken', FALSE)
--                   from generate_series
--                            (
--                                timestamp '2020-03-10 09:00:00' at time zone 'utc',
--                                CURRENT_TIMESTAMP at time zone 'utc' + '1 YEAR',
--                                interval '1 HOUR'
--                            ) AS a (dt)
--                   WHERE MOD(EXTRACT(DOW FROM dt)::INTEGER, 6) != 0
--                     AND dt::TIME >= '09:00:00'
--                     AND dt::TIME < '17:00:00'::TIME);
--     RETURN NEW;
-- END
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER insert_doctor_availability
--     BEFORE INSERT
--     ON doctor
--     FOR EACH ROW
--     WHEN (NEW.doctor_availability IS NULL)
-- EXECUTE PROCEDURE insert_availability();
-- INSERT INTO db_user(username, password, role)
-- VALUES ('doc1', '12345', 'doctor');
-- SELECT * FROM db_user;
--
-- INSERT INTO office(office_capacity, office_phone_number, office_opening_hour, office_address, office_specialty)
-- VALUES ('100', '7130000000',
--         CURRENT_TIME, '3333 Cullen St. Houston, TX 77777', 'ENT, Primary Care');
--
-- INSERT INTO doctor(doctor_address, doctor_first_name, doctor_last_name, doctor_phone_number, doctor_office, doctor_spec,
--                    doctor_user)
-- VALUES ('4444 Cullen St. Houston, TX 70000', 'Carlos', 'Rincon', '832000000', 1, 'ENT', 1);
--
--
-- SELECT (doctor_availability)
-- FROM doctor;
--
-- INSERT INTO doctor(doctor_address, doctor_first_name, doctor_last_name, doctor_phone_number, doctor_office, doctor_spec,
--                    doctor_user)
-- VALUES ('4444 Cullen St. Houston, TX 70000', 'Carlos2', 'Rincon2', '832000000', 1, 'ENT', 1);
--
-- INSERT INTO db_user(username, password)
-- VALUES ('patient1', '12345');
--
-- INSERT INTO patient(patient_first_name, patient_last_name, patient_email, patient_address, patient_phone_number,
--                     patient_gender, patient_dob, patient_user)
-- VALUES ('Michael', 'Austin', 'mpaustin@gmail.com', '4444 Cool St. Houston, TX 77005', '7136666666', 'Male',
--         '2020-03-10', (SELECT user_id FROM db_user WHERE username = 'patient1'));
--
-- INSERT INTO appointment(appt_patient, appt_doctor, appt_start, appt_end, appt_reason, appt_office)
-- VALUES ((SELECT patient_id from patient WHERE patient_first_name = 'Michael'),
--         (SELECT doctor_id from doctor WHERE doctor_first_name = 'Carlos'), CURRENT_TIMESTAMP,
--         CURRENT_TIMESTAMP + '1 HOUR', 'Sick', (SELECT doctor_office from doctor where doctor_first_name = 'Carlos'));
--
-- INSERT INTO test(test_date, test_scan, test_equipment, test_office, test_doctor, test_patient)
-- VALUES ('2020-03-10', TRUE, 'X-ray Machine', 1, 1, 1);
--
-- SELECT *
-- from doctor;
--
-- SELECT * FROM session;
-- SELECT * FROM json_each((SELECT doctor_availability[1] FROM doctor));
--
-- create index idx_availability on doctor using GIN(doctor_availability);
--
-- SELECT * FROM doctor WHERE doctor_availability @> '{[2020-03-10 09:00:00+00]}';
--
-- SELECT timezone('US/Central', CURRENT_TIMESTAMP);
-- "{\"time\" : \"[\\\"2020-03-10 09:00:00+00\\\",\\\"2020-03-10 10:00:00+00\\\"]\", \"taken\" : false}"
-- UPDATE doctor
-- set doctor_availability[1] = json_build_object('time', '["2020-03-10 09:00:00+00","2020-03-10 10:00:00+00"]'::tstzrange,
--                                                'taken', false);
--