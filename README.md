## Project Description

![Action](https://img.shields.io/github/workflow/status/vyas0189/COSC-3380-Database/server?style=for-the-badge)

A health provider company has multiple offices in many different states. Many doctors work for the company, and each doctor takes care of multiple patients. Some doctors just work in one office, and others work in different offices on different days. The database keeps information about each doctor, such as name, address, contact phones, area of specialization, and so on. Each patient can be assigned to one or more doctors. Specific patient information is also kept in the database (name, address, phones, health record number, date of birth, history of appointments, prescriptions, blood tests, diagnoses, etc.). Customers can schedule and cancel appointments either over the phone or using the company Web site. Some restrictions apply — for example, to see a specialist, the patient needs an approval from his/her primary physician.

## File Description

For our project, we used PostgreSQL to build our database, NodeJS for our backend, and React for our frontend.

Database in PostgreSQL:

-  Our .sql file can be accessed via `db/hospital.sql`

Backend in NodeJS:

-  Our primary server file is located in our project's root folder and called `server.js`: this is how we hosted our project via a localhost URL.
-  Our login authentication files are located in `./middleware/auth.js`: we authenticated users via jwt_tokens.
-  All of our data validation schemas are located in `./validation/index.js`: this is where we plotted out the formats in which data requests should be made between the backend & DB.
-  All of our backend routes are located in `/routes`: these routes are for defining all of the add, modify, and delete requests made from the frontend, to the backend, and, finally, to the DB.

Frontend in React:

All of our frontend files are located within `./client`.

-  Our function definitions for each role (admin, patient, doctor) are located in `./client/src/store`: this is where we defined the functions that would execute upon a frontend / user action, such as a button press. These functions would be called from our state management system whenever an add, modify, or delete action was initiated by the user on our project's website.
-  All of the pictures & images used on our site are located in `./client/src/assets`.
-  The general user interface (Home, Dashboard, etc.), along with our patient scheduling implementation are located in `./client/src/components`: components contains login authentication requests(components/Auth), our designed user dashboards which act as the home page for each user (components/Dashboard), our loading animation (components/Loading), our navigation bar which sits at the top of each page (components/Navbar), and patient scheduling (components/Schedule).
   /components also contains our main frontend file for linking all of the pages of the website in `./client/src/App.js`.
-  Finally, all of the design & functionality of any buttons, forms, or frontend requests are defined in `./client/src/pages`.

## User Roles

Patient, Doctor, & Admin
[Login Information](login_credentials.txt)

-  Patient Functionalities: Login, Schedule Primary Appointment, Cancel Primary Appointment, Schedule Specialist Appointment (1st trigger), Cancel Specialist Appointment, View Upcoming Appointments, View Appointment History, Edit Patient Profile, Logout
-  Doctor Functionalities: Login, Add Availability for Date, Update / Cancel Availability for Date, Edit Patient Profile, Update Patient Diagnosis (2nd trigger), Order Test, Logout
-  Admin Functionalities: Login, Register Office Information, Register New Doctor, Update Doctor Credentials, View Currently Enrolled Patients (1st Report), View Currently Scheduled Appointments (2nd Report), Logout

## Triggers

1. Alert & deny patient user from scheduling specialist appointment if they have not been referred by a primary care doctor.

2. Alert & deny doctor user from updating a patient's diagnosis field if they don't have a primary care doctor assigned.

## Reports

Both accessed via the admin role:

1. View Patients: Lists patient user information & calculates age from their DOB. Aggregate functions: average patient age calculated; patient location by state counts calculated.

2. View Appointments: Lists doctor user information including their specialty. Aggregate functions: total appointments calculated; total appointments per doctor calculated; total appointments per specialty calculated.

## Endpoints

-  [Endpoints](https://docs.google.com/document/d/1IZt0xx74_QdcJU11Wx9hEhIFpjrjFrUtU-dv9GSCMFs/edit?usp=sharing)

## Installations

-  [NodeJS](https://nodejs.org/en/download/)
-  [PostgreSQL](https://www.postgresql.org/download/)

## Running the App

-  Install yarn: `npm i -g yarn`
-  Create Database:
   -  Open terminal and run `createdb -h localhost -p 5432 -U postgres hospital`
   -  Create Schema (Make sure your in the project root): `psql -U postgres -d hospital -a -f ./db/hospital.sql`
-  Configure .env file:
   -  Rename the file `.env.local` to `.env`
   -  Fill in the required information in the `.env`
      -  `PGUSER=postgres`
      -  `PGPASSWORD=<your postgres password>`
      -  `PGHOST=<loacalhost>`
      -  `PGPORT=5432`
      -  `PGDATABASE=hospital`
      -  `JWT_SECRET=<your secret>`
      -  `SESSION_EXPIRES=1h`
-  Install dependencies(In the project root folder): `yarn && cd client && yarn`
-  To Run the app `yarn dev`

## Authors

-  Vyas Ramnakulangara - [vyas0189](https://github.com/vyas0189) - vyas0189@gmail.com
-  Michael Patrick Austin - [mpaustin1993](https://github.com/mpaustin1993) - mpaustin1993@gmail.com
-  Justin West - [Justin-WR-West](https://github.com/Justin-WR-West) - jswest137@gmail.com
-  Tony Nguyen - [aqnguy30](https://github.com/aqnguy30) - quocanh191997@gmail.com
-  Alexander Tran - [altub](https://github.com/altub) - alex9tran@gmail.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
