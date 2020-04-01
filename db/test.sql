SELECT state
FROM address
GROUP BY state
ORDER BY state;
SELECT state
FROM address
         JOIN office ON office_address = address_id
GROUP BY state
ORDER BY state;
SELECT *
from db_user
WHERE role = 'patient';
-- DELETE FROM address WHERE state = 'Portland';
SELECT *
FROM patient;
SELECT *
FROM address
WHERE address_id = 'dc058263-9c53-49fc-ab79-fd78cada0b17';
SELECT *
FROM doctor;

-- DELETE FROM doctor WHERE doctor_id ='1128eec8-2dba-41a7-949b-07e9436702b7';
SELECT *
FROM patient;
SELECT patient_address
FROM patient
         JOIN db_user du on patient.patient_user = du.user_id
WHERE user_id = '6af5c861-5add-4e85-907a-6271e87a46c3';
SELECT *
FROM address
WHERE address_id = 'dc058263-9c53-49fc-ab79-fd78cada0b17';

DELETE
FROM doctor
WHERE doctor_id = '56e0153a-939c-4200-97de-95f69209ab8e';
UPDATE doctor
SET doctor_primary = true
WHERE doctor_id = 'c7a4bf42-e2a9-4c11-a6bb-1ba02453c930';

SELECT *
from availability;

INSERT INTO availability(doctor_id, office_id, availability_date, availability_from_time, availability_to_time)
VALUES ('c7a4bf42-e2a9-4c11-a6bb-1ba02453c930', '433444cb-c789-4c51-8e29-47b18b632b18', '3-31-2020', '9:00:00 AM',
        '10:00:00 AM');

SELECT *
FROM appointment;

ALTER TABLE appointment ALTER COLUMN appointment_start TYPE TIME;
ALTER TABLE appointment ALTER COLUMN appointment_end TYPE TIME;

ALTER TABLE availability
ADD COLUMN availability_taken BOOLEAN DEFAULT FALSE;

ALTER TABLE appointment
ADD COLUMN appointment_primary BOOLEAN;

SELECT * FROM availability;

DELETE FROM appointment WHERE appointment_id = 'ffdfd512-be92-4ddd-ab8e-9f203aee4e35';

-- ALTER TABLE test ALTER COLUMN test_date TYPE DATE;