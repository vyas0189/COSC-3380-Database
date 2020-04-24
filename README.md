# Medical Clinic Database

![Action](https://img.shields.io/github/workflow/status/vyas0189/COSC-3380-Database/server?style=for-the-badge)

A health provider company has multiple offices in many different states. Many doctors work for the company, and each doctor takes care of multiple patients. Some doctors just work in one office, and others work in different offices on different days. The database keeps information about each doctor, such as name, address, contact phones, area of specialization, and so on. Each patient can be assigned to one or more doctors. Specific patient information is also kept in the database (name, address, phones, health record number, date of birth, history of appointments, prescriptions, blood tests, diagnoses, etc.). Customers can schedule and cancel appointments either over the phone or using the company Web site. Some restrictions apply — for example, to see a specialist, the patient needs an approval from his/her primary physician.

## Triggers

1) Alert & deny patient user from scheduling appointment outside of doctor's availability dates & times

2) Alert & deny patient user from scheduling appointment with specialist if they don't have a primary care doctor assigned

## Team

* Database Development: Vyas, Michael, Justin, Tony, & Alex
* Frontend Development: Justin, Tony, & Vyas
* Backend Development: Alex, Michael, & Vyas

## Getting Started

* [Help Guide](https://docs.google.com/document/d/1eZ2r1eRtG109pFLE8rKsNM4CFUtbYfSStVRLpPnTkdY/edit)

## Endpoints

* [Endpoints](https://docs.google.com/document/d/1IZt0xx74_QdcJU11Wx9hEhIFpjrjFrUtU-dv9GSCMFs/edit?usp=sharing)

## Installations
  * [NodeJS](https://nodejs.org/en/download/)
  * [PostgreSQL](https://www.postgresql.org/download/)

## Running the App
* Install yarn: `npm i -g yarn`
* Create Database:
  - Open terminal and run `createdb -h localhost -p 5432 -U postgres hospital`
  - Create Schema (Make sure your in the project root): `psql -U postgres -d hospital -a -f ./db/hospital.sql`
* Configure .env file:
  - Rename the file `.env.local` to `.env`
  - Fill in the required information in the `.env`
    * `PGUSER=postgres`
    * `PGPASSWORD=<your postgres password>`
    * `PGHOST=<loacalhost>`
    * `PGPORT=5432`
    * `PGDATABASE=hospital`
    * `JWT_SECRET=<your secret>`
    * `SESSION_EXPIRES=1h`
* Install dependencies(In the project root folder): `yarn && cd client && yarn`
* To run the server: `yarn server`
* To Run the app `yarn dev`

## Authors

* Vyas Ramnakulangara - [vyas0189](https://github.com/vyas0189) - vyas0189@gmail.com
* Michael Patrick Austin - [mpaustin1993](https://github.com/mpaustin1993) - mpaustin1993@gmail.com
* Justin West - [Justin-WR-West](https://github.com/Justin-WR-West) - jswest137@gmail.com
* Tony Nguyen - [aqnguy30](https://github.com/aqnguy30) - quocanh191997@gmail.com
* Alexander Tran - [altub](https://github.com/altub) - alex9tran@gmail.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
