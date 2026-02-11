📘 Smart City Auth Service API

Authentication and Authorization microservice for the Smart City Platform with role-based access, JWT authentication, and refresh token support.

🚀 Base URL
http://coin2.glbrain.com:5000

📦 Features

User Registration (Citizen / Authority)

JWT Authentication

Access & Refresh Tokens

Role-Based Authorization

Logout (Token Invalidation)

User Profile

Admin/Authority User Management

Secure Password Hashing (bcrypt)

MySQL Database (Sequelize ORM)

🧑 Roles
Role	Description
citizen	Normal user
authority	City/Authority officer
🔐 Authentication Flow

Register User

Login → Get Access + Refresh Token

Access Protected APIs

Refresh Token when expired

Logout → Token invalidated

📑 API Endpoints
1️⃣ Register User

POST /auth/register

Request
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "citizen"
}


For authority role, city is required.

{
  "firstName": "City",
  "lastName": "Officer",
  "email": "authority@example.com",
  "password": "Password@123",
  "role": "authority",
  "city": "Mumbai"
}

Response
{
  "id": 1,
  "email": "john@example.com",
  "role": "citizen"
}

2️⃣ Login

POST /auth/login

Request
{
  "email": "john@example.com",
  "password": "Password@123"
}

Response
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}

3️⃣ Refresh Token

POST /auth/refresh

Request
{
  "refreshToken": "your-refresh-token"
}

Response
{
  "accessToken": "new-access-token"
}

4️⃣ Get Current User

GET /auth/me

Header

Authorization: Bearer <accessToken>

Response
{
  "id": 1,
  "email": "john@example.com",
  "role": "citizen"
}

5️⃣ Get Profile

GET /auth/profile

Header

Authorization: Bearer <accessToken>

6️⃣ Logout

POST /auth/logout

Header

Authorization: Bearer <accessToken>

Response
{
  "message": "Logged out successfully"
}

7️⃣ Get All Users (Authority Only)

GET /auth/users

🔒 Requires authority role.

Header

Authorization: Bearer <accessToken>

Response
[
  {
    "id": 1,
    "email": "john@example.com",
    "role": "citizen"
  },
  {
    "id": 2,
    "email": "authority@example.com",
    "role": "authority"
  }
]

🗄️ Database Schema (User)
Field	Type	Required
id	INT	Yes
firstName	STRING	Yes
lastName	STRING	Yes
email	STRING	Yes
password	STRING	Yes
role	ENUM	Yes
city	STRING	Authority Only
createdAt	TIMESTAMP	Auto
updatedAt	TIMESTAMP	Auto
