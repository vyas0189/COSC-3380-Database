CREATE TABLE db_user
(
    user_id  SERIAL       NOT NULL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(200) NOT NULL,
    role     VARCHAR(50)  NOT NULL CHECK ( role IN ('admin', 'doctor', 'patient') ) DEFAULT 'patient'
);

INSERT INTO db_user
VALUES ('admin', 'admin1234', 'admin');

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
    patient_user         SERIAL             NOT NULL REFERENCES db_user (user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointment
(
    appt_id     SERIAL PRIMARY KEY,
    appt_date   TIMESTAMP NOT NULL DEFAULT NOW(),
    appt_reason TEXT      NOT NULL
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

CREATE TABLE IF NOT EXISTS doctor
(
    doctor_id           SERIAL PRIMARY KEY,
    doctor_address      TEXT         NOT NULL,
    doctor_first_name   varchar(100) NOT NULL,
    doctor_last_name    varchar(100) NOT NULL,
    doctor_phone_number TEXT         NOT NULL,
    doctor_office       INT          NOT NULL REFERENCES office (office_id),
    doctor_spec         TEXT         NOT NULL,
    doctor_availability TSTZRANGE[]  NOT NULL,
    doctor_user        SERIAL       NOT NULL REFERENCES db_user (user_id) ON UPDATE CASCADE ON DELETE CASCADE
    -- patients INT[] NOT NULL
    --open to a table or list of patient IDs (health_record_id)      --Refrence to Patient regarding care
    --Refrence to diagnosis regarding decision of treatment?
);

CREATE TABLE IF NOT EXISTS test
(
    test_id        SERIAL PRIMARY KEY,
    test_date      TIMESTAMP NOT NULL DEFAULT NOW(),
    test_scan      BOOLEAN   NOT NULL,
    test_physical  BOOLEAN   NOT NULL,
    test_blood     BOOLEAN   NOT NULL,
    test_equipment TEXT      NOT NULL,
    test_office    INT       NOT NULL REFERENCES office (office_id),
    test_doctor    INT       NOT NULL REFERENCES doctor (doctor_id)
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
    ADD CONSTRAINT fk_doctor FOREIGN KEY (patient_primary_doctor) REFERENCES doctor (doctor_id);

ALTER TABLE appointment
    ADD COLUMN appt_office SERIAL NOT NULL,
    ADD CONSTRAINT fk_appt_office FOREIGN KEY (appt_office) REFERENCES office (office_id);

ALTER TABLE appointment
    ADD COLUMN appt_patient SERIAL NOT NULL,
    ADD CONSTRAINT fk_appt_patient FOREIGN KEY (appt_patient) REFERENCES patient (patient_id);

ALTER TABLE appointment
    ADD COLUMN appt_doctor SERIAL NOT NULL,
    ADD CONSTRAINT fk_appt_doctor FOREIGN KEY (appt_doctor) REFERENCES doctor (doctor_id);

-- INSERT INTO patient(patient_first_name, patient_last_name, patient_email, patient_address, patient_phone_number,
--                     patient_age, patient_gender, patient_dob, patient_user)
-- VALUES ('Test', 'Test','test@test.com', '1234 test', 'XXXXXXXXXX', 21, 'Male', NOW()::DATE,1);
--
-- SELECT * FROM patient INNER JOIN db_user ON patient.patient_user = db_user.user_id;
