# Project-Records
Description:

"Project-Records" is a web-based application designed to help IT companies, and other organizations, efficiently track project progress and manage work hours. This system offers project management functionalities, resource allocation, and an intuitive way to log work hours, ensuring accurate billing and reporting.

The system has three types of users: Administrators, Project Managers, and Workers. Each role comes with specific capabilities, such as adding projects, tracking tasks, logging work hours, and generating various reports.
Key Features:

    Project Management:
        Create and manage projects with start and end dates.
        Assign tasks to workers and form teams.
        Monitor project progress and status updates.
        Generate reports on completed tasks, delays, and other metrics.

    Work Hours Tracking:
        Log work hours for each project and task.
        Generate reports of logged hours by project and user.

    Communication:
        Internal messaging system for workers, project managers, and administrators.
        Notifications via email for project updates and other announcements.

    Attendance and Work Time:
        Track employee attendance and work hours.
        Generate reports on attendance and working hours.

    Additional Features:
        Reports can be sent to supervisors via email.
        Some reports can be exported in PDF format.

Technologies Used:

    Backend: Node.js
    Frontend: EJS (Embedded JavaScript templates)
    Database: PostgreSQL
    Additional Tools:
        PDF generation for reports.
        Email notifications for project updates.

Setup Instructions:
1. Clone the Repository:

bash

  git clone https://github.com/your-username/evidencija-projekata.git
  cd evidencija-projekata

2. Install Dependencies:

Ensure you have Node.js and PostgreSQL installed on your system. After that, run the following command to install the required Node.js packages:

bash

  npm install

3. Setup the .env File:

Create a .env file in the root of the project and add the following configurations:

bash

  # Email service configuration
  EMAIL_SERVICE=<your-email-service>
  EMAIL_USER=<your-email-address>
  EMAIL_PASSWORD=<your-email-password>
  
  # PostgreSQL database configuration
  DB_USER=<your-database-username>
  DB_HOST=<your-database-host>
  DB_NAME=<your-database-name>
  DB_PASSWORD=<your-database-password>
  DB_PORT=<your-database-port>
  
  # Ports for running the application
  EXPRESS_PORT=3000
  STATIC_PORT=4000
  
  # Session secret for securing cookies and sessions
  SESION_SECRET=<your-session-secret>

Note: Ensure that your .env file is included in .gitignore to prevent pushing sensitive data to a public repository.

4. Database Setup:
4.1 Create the PostgreSQL Database

First, ensure that PostgreSQL is installed and running. Then create a new database:

sql

  CREATE DATABASE evidencija_1;

4.2 Create the Tables

Run the following SQL script to create the necessary tables for the project:

sql

  CREATE TABLE radnici (
      id SERIAL PRIMARY KEY,
      ime VARCHAR(255),
      prezime VARCHAR(255),
      korisnicko_ime VARCHAR(255),
      sifra VARCHAR(255),
      uloga VARCHAR(50),
      nadredjeni_id INTEGER
  );
  
  CREATE TABLE projekti (
      id SERIAL PRIMARY KEY,
      naziv VARCHAR(255),
      opis TEXT,
      datum_pocetka DATE,
      datum_zavrsetka DATE
  );
  
  CREATE TABLE zadaci (
      id SERIAL PRIMARY KEY,
      naziv VARCHAR(255),
      opis TEXT,
      projekt_id INTEGER REFERENCES projekti(id),
      zavrsen BOOLEAN
  );
  
  CREATE TABLE radni_sati (
      id SERIAL PRIMARY KEY,
      radnik_id INTEGER REFERENCES radnici(id),
      projekt_id INTEGER REFERENCES projekti(id),
      task VARCHAR(255),
      sati INTEGER,
      datum DATE
  );
  
  CREATE TABLE evidencija_prisustva (
      id SERIAL PRIMARY KEY,
      radnik_id INTEGER REFERENCES radnici(id),
      datum DATE,
      prisutan BOOLEAN
  );
  
  CREATE TABLE poruke (
      id SERIAL PRIMARY KEY,
      posiljalac_id INTEGER REFERENCES radnici(id),
      primalac_id INTEGER REFERENCES radnici(id),
      sadrzaj TEXT,
      datum TIMESTAMP
  );
  
  CREATE TABLE dodeljeni_projekti (
      id SERIAL PRIMARY KEY,
      radnik_id INTEGER REFERENCES radnici(id),
      projekt_id INTEGER REFERENCES projekti(id),
      menadzer_id INTEGER REFERENCES radnici(id)
  );
  
  CREATE TABLE prijave (
      id SERIAL PRIMARY KEY,
      radnik_id INTEGER REFERENCES radnici(id),
      action TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

5. Run the Application:

Start the server using the following command:

bash

  npm start

The application will be accessible at http://localhost:3000.
6. Testing the Application:

After setting up the application:

    Create different types of users (admin, manager, and workers).
    Test functionalities like project creation, task assignment, and work hours logging.

Usage:

    Admin Panel: Admins can add projects, assign workers, and manage users.
    Project Manager Panel: Project managers can create and manage projects and monitor work progress.
    Worker Panel: Workers can log their hours for assigned tasks and communicate with their team members.
    Group Chat: All users can communicate via a group chat that allows for messaging across the different roles.
