# Custom Employee Portal

A role-based employee portal built with React, Node.js, Express, and PostgreSQL that provides centralized access to authorized Zoho applications.

The application implements custom authentication, Role-Based Access Control (RBAC), audit logging, user management, and secure server-side Zoho OAuth token handling.

---

## Features

### Authentication
- Custom employee login
- JWT-based authentication
- Password hashing using bcrypt
- 30-minute JWT session expiration
- Active/inactive user validation
- Logout functionality

### Role-Based Access Control

The portal supports the following roles:

- Admin
- HR
- Sales
- Support
- Finance

Each role receives only the permissions assigned to it.

### Zoho Application Access

| Role | Application |
|------|-------------|
| HR | Zoho People |
| Sales | Zoho CRM |
| Support | Zoho Desk |
| Finance | Zoho Books |
| Admin | All applications |

The frontend displays applications according to the logged-in user's role.

The backend independently validates permissions before protected API requests are processed.

### Admin Features

Administrators can:

- View all users
- Create new users
- Assign roles
- Change user roles
- Activate users
- Deactivate users
- View audit logs

### Audit Logging

The system records important activities such as:

- Successful login
- User creation
- User role changes
- User activation
- User deactivation

Audit logs contain:

- User
- Action
- Resource
- IP address
- Metadata
- Timestamp

---

# Technology Stack

## Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

## Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- Axios
- CORS
- dotenv

## Database

- PostgreSQL

## External Integration

- Zoho OAuth
- Zoho People
- Zoho CRM
- Zoho Desk
- Zoho Books

---

# Project Structure

```text
custom-employee-portal/
│
├── backend/
│   ├── database/
│   │   └── schema.sql
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   └── auditController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── permissionMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   └── userModel.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── auditRoutes.js
│   │   │   └── testRoutes.js
│   │   │
│   │   └── services/
│   │       ├── auditService.js
│   │       └── zohoService.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
└── README.md
Database Design

The application uses six main tables.

Users
Roles
Permissions
UserRoles
RolePermissions
AuditLogs
Users

Stores employee account information.

Important fields:

id
name
email
password_hash
is_active
created_at
Roles

Stores application roles.

Examples:

Admin
HR
Sales
Support
Finance
Permissions

Stores individual permissions.

Examples:

VIEW_DASHBOARD
ACCESS_PEOPLE
ACCESS_CRM
ACCESS_DESK
ACCESS_BOOKS
MANAGE_USERS
MANAGE_ROLES
MANAGE_PERMISSIONS
VIEW_AUDIT_LOGS
UserRoles

Maps users to roles.

User → Role
RolePermissions

Maps roles to permissions.

Role → Permission
AuditLogs

Stores important system activities.

RBAC Flow

The authorization flow is:

Employee
   ↓
Login
   ↓
JWT Token
   ↓
Authentication Middleware
   ↓
Permission Middleware
   ↓
Database Permission Check
   ↓
Protected API

For example, the Zoho People endpoint requires:

ACCESS_PEOPLE

The backend checks whether the authenticated user has that permission before allowing the request.

Authentication Flow
Frontend Login
      ↓
POST /api/auth/login
      ↓
Backend finds user
      ↓
Check active status
      ↓
bcrypt password verification
      ↓
Create audit log
      ↓
Generate JWT
      ↓
Return JWT + user information
      ↓
Frontend stores authentication state

JWT tokens expire after 30 minutes.

Zoho OAuth Architecture

The application uses a backend-controlled Zoho OAuth flow.

Employees do not provide individual Zoho API credentials.

The backend stores the Zoho OAuth refresh token in environment variables and uses it to obtain access tokens.

Employee
    ↓
Custom Employee Portal
    ↓
Backend API
    ↓
Zoho OAuth Token Service
    ↓
Zoho Access Token
    ↓
Zoho API

The Zoho refresh token and client credentials are never exposed to the frontend.

Environment Variables

Create:

backend/.env

Example:

PORT=5000

JWT_SECRET=your_jwt_secret

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/custom_employee_portal

ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_API_DOMAIN=https://www.zohoapis.com

Never commit the real .env file to GitHub.

Use:

backend/.env.example

as the configuration template.

Database Setup
1. Create PostgreSQL database

Create a database named:

custom_employee_portal

For example:

CREATE DATABASE custom_employee_portal;
2. Run database schema

From the PostgreSQL command line:

psql -U postgres -d custom_employee_portal -f backend/database/schema.sql

This creates the required tables, roles, permissions, relationships, and indexes.

Backend Installation

Open a terminal:

cd backend

Install dependencies:

npm install

Create your .env file:

backend/.env

Add the required environment variables.

Start development server:

npm run dev

Backend runs on:

http://localhost:5000
Frontend Installation

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend runs on:

http://localhost:5173
API Endpoints
Authentication
Login
POST /api/auth/login

Request:

{
  "email": "admin@example.com",
  "password": "your_password"
}
Current User
GET /api/auth/me

Requires:

Authorization: Bearer <JWT>
User Management APIs

All user management endpoints require authentication and the MANAGE_USERS permission.

Get Users
GET /api/users
Create User
POST /api/users

Example:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "HR"
}
Update User Role
PUT /api/users/:id/role

Example:

{
  "role": "Finance"
}
Activate / Deactivate User
PUT /api/users/:id/status

Example:

{
  "is_active": false
}
Audit Log API
Get Audit Logs
GET /api/audit-logs

Requires:

Authentication
+
VIEW_AUDIT_LOGS permission
Zoho API Routes

The Zoho test routes are protected by authentication and permissions.

Zoho People
GET /api/test/people

Required permission:

ACCESS_PEOPLE
Zoho Books
GET /api/test/books

Required permission:

ACCESS_BOOKS
Security

The application implements the following security measures:

JWT authentication
bcrypt password hashing
Role-Based Access Control
Permission validation on protected API routes
Environment-based secret management
Server-side Zoho OAuth handling
Audit logging
Active/inactive account control
JWT expiration
Employees do not need individual Zoho API credentials

Production deployment should additionally use HTTPS and a restricted CORS policy.

Admin Workflow

An administrator can manage employees through:

Employee Portal
      ↓
Administration
      ↓
Manage Users

Available operations:

Create User
    ↓
Assign Role
    ↓
Change Role
    ↓
Activate / Deactivate

All important administrative actions are recorded in the audit log.

Example RBAC Demonstration
Admin

Admin can access:

Zoho People
Zoho CRM
Zoho Desk
Zoho Books
Manage Users
Manage Roles
Manage Permissions
Audit Logs
HR

HR can access:

Zoho People
Sales

Sales can access:

Zoho CRM
Support

Support can access:

Zoho Desk
Finance

Finance can access:

Zoho Books
Zoho Integration Note

The application is designed so that Zoho API credentials are managed by the backend rather than individual employees.

The backend obtains Zoho access tokens using the configured OAuth refresh token and uses those tokens for API requests.

Opening a Zoho web application from the portal is separate from API authentication. A backend OAuth refresh token does not automatically create a browser SSO session in the Zoho web UI.

Testing

The following functionality should be tested before submission:

Authentication
Valid login
Invalid password
Unknown user
Inactive user
JWT expiration
RBAC
HR cannot access Sales resources
Sales cannot access Finance resources
Finance cannot access HR resources
Admin can access all authorized resources
User Management
Create user
Duplicate email validation
Invalid role validation
Change role
Activate user
Deactivate user
Audit Logs

Verify that important actions generate audit records:

LOGIN_SUCCESS
USER_CREATED
USER_ROLE_UPDATED
USER_ACTIVATED
USER_DEACTIVATED
Demo Flow

For the project demonstration:

1. Login as Admin

Show:

Admin dashboard
All Zoho applications
Administration panel
2. Demonstrate RBAC

Login as HR.

Show:

Zoho People

and demonstrate that other department applications are not displayed.

3. Demonstrate User Management

Return to Admin.

Open:

Manage Users

Create a user and assign a role.

Change the user's role.

Deactivate the user.

4. Demonstrate Audit Logs

Open:

View Audit Logs

Show the recorded administrative activities.

5. Explain Zoho Integration

Explain:

Backend manages OAuth
Refresh token is stored securely
Employees don't receive Zoho credentials
Protected backend routes validate permissions before API access
Project Status

Implemented:

Custom authentication
JWT authorization
PostgreSQL database
RBAC
Permission-based API protection
User management
Role management foundation
Audit logging
Zoho OAuth service
Zoho People integration endpoint
Zoho Books integration endpoint
React employee dashboard
Admin user management UI
Admin audit log UI
Future Improvements

Possible production improvements include:

Complete role management UI
Complete permission management UI
Refresh-token/session management
Automatic frontend session expiration handling
HTTPS configuration
Restricted CORS configuration
Production PostgreSQL deployment
Full Zoho CRM and Zoho Desk organization integration
Production monitoring and error tracking
License

This project was created as a technical assignment demonstrating authentication, authorization, RBAC, database design, API integration, and secure application architecture.


### Your root folder should now be

```text
custom-employee-portal/
│
├── README.md                 ← NEW
│
├── backend/
│   ├── database/
│   │   └── schema.sql
│   ├── src/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   └── App.jsx
    ├── package.json
    └── ...

One correction before GitHub: don't claim Zoho CRM and Zoho Desk are actually working live if your current Zoho account doesn't have those services/orgs configured. The README above correctly describes them as supported application routes/design, while your currently verified API integration is People/Books.

After creating README.md, don't push yet. The next thing we should do is create the database seed/demo-user SQL so the evaluator can recreate the Admin/HR/etc. accounts.

# Custom Employee Portal

A role-based employee portal built with React, Node.js, Express, and PostgreSQL that provides centralized access to authorized Zoho applications.

The application implements custom authentication, Role-Based Access Control (RBAC), audit logging, user management, and secure server-side Zoho OAuth token handling.

---

## Features

### Authentication

- Custom employee login

- JWT-based authentication

- Password hashing using bcrypt

- 30-minute JWT session expiration

- Active/inactive user validation

- Logout functionality

### Role-Based Access Control

The portal supports the following roles:

- Admin

- HR

- Sales

- Support

- Finance

Each role receives only the permissions assigned to it.

### Zoho Application Access

| Role | Application |

|------|-------------|

| HR | Zoho People |

| Sales | Zoho CRM |

| Support | Zoho Desk |

| Finance | Zoho Books |

| Admin | All applications |

The frontend displays applications according to the logged-in user's role.

The backend independently validates permissions before protected API requests are processed.

### Admin Features

Administrators can:

- View all users

- Create new users

- Assign roles

- Change user roles

- Activate users

- Deactivate users

- View audit logs

### Audit Logging

The system records important activities such as:

- Successful login

- User creation

- User role changes

- User activation

- User deactivation

Audit logs contain:

- User

- Action

- Resource

- IP address

- Metadata

- Timestamp

---

# Technology Stack

## Frontend

- React

- Vite

- JavaScript

- HTML

- CSS

## Backend

- Node.js

- Express.js

- JWT

- bcryptjs

- Axios

- CORS

- dotenv

## Database

- PostgreSQL

## External Integration

- Zoho OAuth

- Zoho People

- Zoho CRM

- Zoho Desk

- Zoho Books

---

# Project Structure

```text

custom-employee-portal/

│

├── backend/

│   ├── database/

│   │   └── schema.sql

│   │

│   ├── src/

│   │   ├── config/

│   │   │   └── db.js

│   │   │

│   │   ├── controllers/

│   │   │   ├── authController.js

│   │   │   ├── userController.js

│   │   │   └── auditController.js

│   │   │

│   │   ├── middleware/

│   │   │   ├── authMiddleware.js

│   │   │   └── permissionMiddleware.js

│   │   │

│   │   ├── models/

│   │   │   └── userModel.js

│   │   │

│   │   ├── routes/

│   │   │   ├── authRoutes.js

│   │   │   ├── userRoutes.js

│   │   │   ├── auditRoutes.js

│   │   │   └── testRoutes.js

│   │   │

│   │   └── services/

│   │       ├── auditService.js

│   │       └── zohoService.js

│   │

│   ├── .env.example

│   ├── .gitignore

│   ├── package.json

│   └── server.js

│

├── frontend/

│   ├── public/

│   ├── src/

│   │   ├── App.jsx

│   │   └── ...

│   ├── package.json

│   └── vite.config.js

│

└── README.md i have to keep full or this is enough

That is not enough for the assignment README. What you have is a good Features + Tech Stack + Project Structure section, but the evaluator specifically needs setup and usage instructions.

Keep what you have and add these sections after Project Structure:

Prerequisites
Database Setup
Environment Variables
Backend Installation & Run
Frontend Installation & Run
API Endpoints
RBAC / Permissions
Zoho OAuth Architecture
Admin Features
Testing / Demo Flow
Security
Project Status

You don't need a huge README. Around 3–5 pages when rendered on GitHub is enough.

Most important

Your README should allow an evaluator to understand:

"I cloned this repository. What do I install, what database do I create, what environment variables do I configure, and how do I run it?"

So definitely include something like:

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm
- Zoho Developer account for API integration

## Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE custom_employee_portal;

Run the schema:

psql -U postgres -d custom_employee_portal -f backend/database/schema.sql
Backend Setup
cd backend
npm install

Create:

backend/.env

Configure:

PORT=5000
JWT_SECRET=your_jwt_secret

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/custom_employee_portal

ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_API_DOMAIN=https://www.zohoapis.com

Start the backend:

npm run dev

Backend:

http://localhost:5000
Frontend Setup
cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173

Then add the API endpoints and RBAC explanation from the README I gave you earlier.

**So: don't delete what you have. Keep it and continue the README with the setup/usage sections.** That's the better submission-ready version.
give readme file in one full file 

Absolutely. Replace your entire root README.md with this single complete file:

# Custom Employee Portal

A role-based employee portal built with **React, Node.js, Express, and PostgreSQL** that provides centralized access to authorized Zoho applications.

The application implements custom authentication, Role-Based Access Control (RBAC), audit logging, user management, and secure server-side Zoho OAuth token handling.

---

## Features

### Authentication

- Custom employee login
- JWT-based authentication
- Password hashing using bcrypt
- 30-minute JWT session expiration
- Active/inactive user validation
- Logout functionality

### Role-Based Access Control

The portal supports the following roles:

- Admin
- HR
- Sales
- Support
- Finance

Each role receives only the permissions assigned to it.

### Zoho Application Access

| Role | Application |
|------|-------------|
| HR | Zoho People |
| Sales | Zoho CRM |
| Support | Zoho Desk |
| Finance | Zoho Books |
| Admin | All applications |

The frontend displays applications according to the logged-in user's role.

The backend independently validates permissions before protected API requests are processed.

### Admin Features

Administrators can:

- View all users
- Create new users
- Assign roles
- Change user roles
- Activate users
- Deactivate users
- View audit logs

### Audit Logging

The system records important activities such as:

- Successful login
- User creation
- User role changes
- User activation
- User deactivation

Audit logs contain:

- User
- Action
- Resource
- IP address
- Metadata
- Timestamp

---

# Technology Stack

## Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

## Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- Axios
- CORS
- dotenv

## Database

- PostgreSQL

## External Integration

- Zoho OAuth
- Zoho People
- Zoho CRM
- Zoho Desk
- Zoho Books

---

# Project Structure

```text
custom-employee-portal/
│
├── backend/
│   │
│   ├── database/
│   │   └── schema.sql
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   └── auditController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── permissionMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   └── userModel.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── auditRoutes.js
│   │   │   └── testRoutes.js
│   │   │
│   │   └── services/
│   │       ├── auditService.js
│   │       └── zohoService.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
Architecture

The application follows a frontend-backend-database architecture.

                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      Vite           │
                    └──────────┬──────────┘
                               │
                               │ HTTP / JWT
                               ▼
                    ┌─────────────────────┐
                    │  Node.js / Express  │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
          ┌────────────┐ ┌───────────┐ ┌────────────┐
          │ PostgreSQL │ │  Zoho API │ │ Audit Logs │
          │  Database  │ │   OAuth   │ │            │
          └────────────┘ └───────────┘ └────────────┘
Database Design

The application uses six main tables:

Users
Roles
Permissions
UserRoles
RolePermissions
AuditLogs
Users

Stores employee account information.

Fields include:

id
name
email
password_hash
is_active
created_at
Roles

Stores application roles:

Admin
HR
Sales
Support
Finance
Permissions

Stores individual permissions.

The current permissions are:

VIEW_DASHBOARD
ACCESS_PEOPLE
ACCESS_CRM
ACCESS_DESK
ACCESS_BOOKS
MANAGE_USERS
MANAGE_ROLES
MANAGE_PERMISSIONS
VIEW_AUDIT_LOGS
UserRoles

Maps users to their assigned roles.

User → Role
RolePermissions

Maps roles to their permissions.

Role → Permission
AuditLogs

Stores important security and administrative events.

RBAC

The application uses Role-Based Access Control.

Authorization is performed using database permissions rather than trusting the frontend.

The authorization flow is:

User
  ↓
Login
  ↓
JWT Authentication
  ↓
Authentication Middleware
  ↓
Permission Middleware
  ↓
Database Permission Check
  ↓
Protected API

For example, a request to the Zoho People endpoint requires:

ACCESS_PEOPLE

The backend checks whether the authenticated user has this permission before processing the request.

Role Permissions
Role	Dashboard	People	CRM	Desk	Books	User Management	Audit Logs
Admin	Yes	Yes	Yes	Yes	Yes	Yes	Yes
HR	Yes	Yes	No	No	No	No	No
Sales	Yes	No	Yes	No	No	No	No
Support	Yes	No	No	Yes	No	No	No
Finance	Yes	No	No	No	Yes	No	No
Authentication Flow

The login flow works as follows:

React Login Form
       ↓
POST /api/auth/login
       ↓
Find User By Email
       ↓
Check Active Status
       ↓
Verify Password With bcrypt
       ↓
Create Audit Log
       ↓
Generate JWT
       ↓
Return Token
       ↓
Frontend Stores Authentication State

JWT tokens expire after 30 minutes.

Zoho OAuth Architecture

Zoho API authentication is handled by the backend.

Employees do not need to provide individual Zoho API credentials.

The backend uses the configured OAuth refresh token to obtain access tokens when required.

Employee
   ↓
React Portal
   ↓
Express Backend
   ↓
Zoho OAuth Token Service
   ↓
Zoho Access Token
   ↓
Zoho API

Zoho credentials are stored in environment variables and are not exposed to the frontend.

Important

The backend OAuth refresh token is used for API authentication.

Opening a Zoho web application in a browser is separate from API authentication. A backend refresh token does not automatically create a browser SSO session in the Zoho web interface unless appropriate Zoho SSO configuration is also implemented.

Prerequisites

Install the following before running the project:

Node.js 18 or later
npm
PostgreSQL
Git
A Zoho developer/account setup if testing Zoho APIs
Database Setup
1. Create PostgreSQL Database

Open PostgreSQL or psql and create:

CREATE DATABASE custom_employee_portal;
2. Run Database Schema

From the project root:

psql -U postgres -d custom_employee_portal -f backend/database/schema.sql

The schema creates:

Users
Roles
Permissions
UserRoles
RolePermissions
AuditLogs

It also inserts the default roles and permissions.

Backend Setup

Open a terminal in the project root.

cd backend

Install dependencies:

npm install
Backend Environment Variables

Create:

backend/.env

Use the following structure:

PORT=5000

JWT_SECRET=your_jwt_secret

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/custom_employee_portal

ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_API_DOMAIN=https://www.zohoapis.com

Do not commit the real .env file to GitHub.

Use .env.example as a configuration template.

Start Backend

For development:

npm run dev

The backend will run on:

http://localhost:5000

For production-style execution:

npm start
Frontend Setup

Open another terminal.

From the project root:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend will normally run on:

http://localhost:5173
API Endpoints
Authentication
Login
POST /api/auth/login

Example request:

{
  "email": "admin@example.com",
  "password": "your_password"
}
Current User
GET /api/auth/me

Requires:

Authorization: Bearer <JWT>
User Management APIs

User management endpoints require authentication and the MANAGE_USERS permission.

Get Users
GET /api/users
Create User
POST /api/users

Example:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "HR"
}
Change User Role
PUT /api/users/:id/role

Example:

{
  "role": "Finance"
}
Activate / Deactivate User
PUT /api/users/:id/status

Example:

{
  "is_active": false
}
Audit Logs API
Get Audit Logs
GET /api/audit-logs

This endpoint requires:

Authentication
+
VIEW_AUDIT_LOGS permission
Zoho API Endpoints
Zoho People
GET /api/test/people

Required permission:

ACCESS_PEOPLE
Zoho Books
GET /api/test/books

Required permission:

ACCESS_BOOKS

Additional Zoho services can be integrated using the same backend OAuth service and permission-based routing architecture.

Admin Features

An Admin can open:

Administration

and use:

Manage Users
Manage Roles
Manage Permissions
View Audit Logs
Manage Users

The Admin can:

View employees
Create employees
Assign roles
Change roles
Activate accounts
Deactivate accounts
Audit Logs

The Admin can view:

Login events
User creation
Role changes
User activation
User deactivation
Associated user information
Event timestamps
Metadata
Security

The application implements:

JWT authentication
bcrypt password hashing
Role-Based Access Control
Database-backed permission validation
Protected API routes
Server-side Zoho OAuth handling
Environment-based secret configuration
Audit logging
Active/inactive account management
JWT expiration
No individual Zoho API credentials for employees

For production deployment, the application should additionally use:

HTTPS
Restricted CORS origins
Secure production database credentials
Production secret management
Appropriate logging and monitoring
Testing

The following scenarios should be tested.

Authentication
Valid login
Invalid email
Invalid password
Inactive user
Expired JWT
Logout
RBAC
HR

Should access:

Zoho People

Should not access:

Zoho CRM
Zoho Desk
Zoho Books
Sales

Should access:

Zoho CRM
Support

Should access:

Zoho Desk
Finance

Should access:

Zoho Books
Admin

Should have access to all authorized applications and administration features.

Admin Testing

The Admin workflow can be demonstrated as:

Login as Admin
       ↓
Manage Users
       ↓
Create User
       ↓
Assign Role
       ↓
Change Role
       ↓
Deactivate User
       ↓
View Audit Logs

Each important administrative action should appear in the audit log.

Demo Credentials

For security reasons, real passwords and secrets should not be stored in this README.

Configure your own local demo users in the database.

Example account format:

Admin:
Email: admin@example.com
Password: <configured locally>

HR:
Email: <configured locally>
Password: <configured locally>

Never commit production passwords, JWT secrets, Zoho client secrets, or refresh tokens to GitHub.

Project Demonstration

A 3–5 minute demonstration can follow this flow:

1. Project Overview

Explain:

React frontend
Node/Express backend
PostgreSQL database
RBAC architecture
Zoho API integration
2. Admin Login

Show:

Admin login
Dashboard
All authorized Zoho applications
Administration panel
3. RBAC Demonstration

Login as an HR user.

Show that the HR user can access:

Zoho People

but does not receive access to the other department applications.

4. User Management

Return to Admin.

Open:

Manage Users

Demonstrate:

Create user
Assign role
Change role
Deactivate user
5. Audit Logs

Open:

View Audit Logs

Show the recorded activities.

6. Zoho Integration

Explain:

Zoho OAuth credentials remain on the backend
Employees do not receive individual Zoho credentials
Backend obtains access tokens
Protected routes validate permissions before API access
Current Zoho Integration Status

The backend contains a reusable Zoho OAuth service for obtaining access tokens using the configured refresh token.

The current environment can be used to test the configured Zoho services and permissions.

Actual Zoho API data depends on the Zoho account having the required organization/service configuration and appropriate OAuth scopes.

The application does not fake Zoho API responses when an external Zoho organization or service is unavailable.

Future Improvements

Possible future enhancements include:

Complete role management UI
Complete permission management UI
Automatic frontend session expiration handling
Refresh-token/session management
HTTPS configuration
Production CORS configuration
Hosted PostgreSQL deployment
Full Zoho CRM integration
Full Zoho Desk integration
Production monitoring
Error tracking
Automated tests
Conclusion

The Custom Employee Portal demonstrates a secure employee access architecture using:

React
+
Node.js / Express
+
PostgreSQL
+
JWT Authentication
+
RBAC
+
Audit Logging
+
Zoho OAuth

The system provides centralized employee authentication and permission-based access to authorized business applications while keeping external API credentials under backend control.


### Save it here

```text
C:\Users\vagesh\OneDrive\Desktop\custom-employee-portal\README.md

Then your repo has the important submission pieces:

custom-employee-portal/
├── README.md              ✅
├── backend/
│   ├── database/
│   │   └── schema.sql     ✅
│   ├── src/               ✅
│   ├── .env.example       ✅
│   ├── .gitignore         ✅
│   └── package.json       ✅
└── frontend/
    ├── src/
    │   └── App.jsx        ✅
    └── package.json       ✅