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
    patient_id               UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    patient_first_name       VARCHAR(100)     NOT NULL,
    patient_last_name        VARCHAR(100)     NOT NULL,
    patient_email            TEXT UNIQUE      NOT NULL,
    patient_phone_number     TEXT             NOT NULL,
    patient_gender           VARCHAR(7)       NOT NULL,
    patient_address          UUID             NOT NULL REFERENCES address (address_id) ON DELETE CASCADE ON UPDATE CASCADE,
    patient_dob              DATE             NOT NULL,
    patient_user             UUID             NOT NULL REFERENCES db_user (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    patient_diagnosis        UUID,
    patient_primary_doctor   UUID,
    patient_doctor_specialty TEXT
);
CREATE TABLE IF NOT EXISTS appointment
(
    appointment_id           UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    appointment_patient      UUID             NOT NULL,
    appointment_primary      BOOLEAN          NOT NULL DEFAULT FALSE,
    appointment_reason       TEXT             NOT NULL,
    appointment_availability UUID             NOT NULL
);
CREATE TABLE IF NOT EXISTS office
(
    office_id           UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    office_capacity     INT              NOT NULL,
    office_address      UUID             NOT NULL REFERENCES address (address_id) ON DELETE CASCADE ON UPDATE CASCADE,
    office_phone_number TEXT             NOT NULL
);
CREATE TABLE IF NOT EXISTS doctor
(
    doctor_id           UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    doctor_address      UUID             NOT NULL REFERENCES address (address_id) ON DELETE CASCADE ON UPDATE CASCADE,
    doctor_first_name   varchar(100)     NOT NULL,
    doctor_last_name    varchar(100)     NOT NULL,
    doctor_email        TEXT UNIQUE      NOT NULL,
    doctor_phone_number TEXT             NOT NULL,
    doctor_office       UUID             NOT NULL REFERENCES office (office_id) ON DELETE CASCADE ON UPDATE CASCADE,
    doctor_primary      BOOLEAN                   DEFAULT FALSE,
    doctor_specialty    TEXT             NOT NULL,
    doctor_user         UUID             NOT NULL REFERENCES db_user (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    doctor_diagnosis    UUID,
    doctor_test         UUID
);
CREATE TABLE IF NOT EXISTS availability
(
    availability_id        UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    doctor_id              UUID             NOT NULL REFERENCES doctor (doctor_id) ON DELETE CASCADE ON UPDATE CASCADE,
    office_id              UUID             NOT NULL REFERENCES office (office_id) ON DELETE CASCADE ON UPDATE CASCADE,
    availability_taken     BOOLEAN          NOT NULL DEFAULT FALSE,
    availability_date      DATE             NOT NULL,
    availability_from_time TIME             NOT NULL,
    availability_to_time   TIME             NOT NULL
);
CREATE TABLE IF NOT EXISTS test
(
    test_id        UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    test_scan      BOOLEAN          NOT NULL DEFAULT FALSE,
    test_physical  BOOLEAN          NOT NULL DEFAULT FALSE,
    test_blood     BOOLEAN          NOT NULL DEFAULT FALSE,
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
ALTER TABLE patient
    ADD
        CONSTRAINT fk_doctor FOREIGN KEY (patient_primary_doctor) REFERENCES doctor (doctor_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE patient
    ADD
        CONSTRAINT fk_patient_diagnosis FOREIGN KEY (patient_diagnosis) REFERENCES diagnosis (diagnosis_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE doctor
    ADD
        CONSTRAINT fk_doctor_diagnosis FOREIGN KEY (doctor_diagnosis) REFERENCES diagnosis (diagnosis_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE doctor
    ADD
        CONSTRAINT fk_doctor_test FOREIGN KEY (doctor_test) REFERENCES test (test_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE test
    ADD
        CONSTRAINT fk_test_diagnosis FOREIGN KEY (test_diagnosis) REFERENCES diagnosis (diagnosis_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE appointment
    ADD
        CONSTRAINT fk_appointment_patient FOREIGN KEY (appointment_patient) REFERENCES patient (patient_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE appointment
    ADD
        CONSTRAINT fk_appointment_availability FOREIGN KEY (appointment_availability) REFERENCES availability (availability_id) ON DELETE CASCADE ON UPDATE CASCADE;
-- 1) Alert & deny patient user from scheduling appointment with specialist if they don't have a primary care doctor assigned
CREATE FUNCTION deny_specialist_scheduling() RETURNS trigger AS
$$
BEGIN
    IF (
            NEW.appointment_primary = FALSE
            AND (
                SELECT patient_primary_doctor
                FROM patient
                WHERE patient_id = NEW.appointment_patient
            ) IS NULL
            AND (
                SELECT patient_doctor_specialty
                FROM patient
                WHERE patient_id = NEW.appointment_patient
            ) IS NULL
        ) THEN
        RETURN NULL;
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;
CREATE TRIGGER SPECIALIST_APPOINTMENT_NO_PRIMARY_CARE_DOCTOR
    BEFORE
        INSERT
        OR
        UPDATE
    ON appointment
    FOR EACH ROW
EXECUTE PROCEDURE deny_specialist_scheduling();
-- 2) Deny doctor from updating diagnosis if patient doesn't have a primary care doctor
CREATE FUNCTION deny_update_diagnosis() RETURNS trigger AS
$$
BEGIN
    IF (NEW.patient_primary_doctor IS NULL) THEN
        RETURN NULL;
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;
CREATE TRIGGER UPDATE_DIAGNOSIS_NO_PRIMARY_DOCTOR
    BEFORE
        UPDATE OF patient_diagnosis
    ON patient
    FOR EACH ROW
EXECUTE PROCEDURE deny_update_diagnosis();
