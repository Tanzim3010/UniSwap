# UniSwap:A campus marketplace 

> **Course:** Advanced Programming in Web Technology  
> **Institution:** American International University-Bangladesh (AIUB)  
> **Semester:** Fall 2026–2027 · Section E · Group 07  
> **Instructor:** Sultanul Arifeen Hamim, Lecturer, Department of Computer Science  

---

## 📌 Project Overview

**UniSwap** is a backend REST API for a campus marketplace website. It allows university students to buy or sale their academic materials, browse available items and complete transactions. The system also provides authentication, email verification and admin control. 

The project has four main objectives: 

- Provide CRUD operations for users, product listings, categories, offers and transactions. 

- Secure the API using JWT auth, password hashing, validation and role based authorization. 

- Support a reliable marketplace for students to buy and sale materials safely. 

- Maintain data integrity using relational database constraints, migrations and transactions where multiple tables are updated  together. 

- The project mainly focuses on the backend. Swagger Ui and Postman are used to test the API. Online payment processing, delivery   tracking and real time chat are outside the current scope. 

---

## 👥 Team Members & Contribution

- MD Tanzimul Islam (23-53147-3). **Contribution:** Auth, Email verification, Users module
- Tamanna Billah (23-53176-3). **Contribution:** Admin, Reports, Analytics
- Adnan Akib (23-53177-3). **Contribution** Categories, Listings
- Avishek Saha (23-54508-3 ). **Contribution** Transactions, offers
---


## ⚙️ Local Setup & Installation

### Prerequisites
- Node.js 22.x
- pnpm (`npm install -g pnpm`)
- PostgreSQL 13 or later (running on port `5432`)

### Step 1: Clone & Install Dependencies
```powershell
git clone https://github.com/Tanzim3010/UniSwap
cd UniSwap
pnpm install
pnpm add class-validator class-transformer
```

### Step 2: Configure Environment Variables
Copy the example environment configuration:
```powershell
Copy-Item .env.example .env
```
Ensure your `.env` contains valid credentials for your local PostgreSQL:
```env
PORT=5001
NODE_ENV=development
JWT_BEARER_SECRET="your-secure-random-secret"

DB_CLIENT="postgres"
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="your_password"
DB_DATABASE="UniSwap"
```

### Step 3: Run Database Migrations
Create the database `UniSwap` in PostgreSQL, then run:
```powershell
pnpm run migration:run
```

### Step 4: Add Admin user

Make sure you have these filled up in your `.env`

#Admin Configuration
ADMIN_EMAIL=                  
ADMIN_PASSWORD=                  
 
```powershell
pnpm seeder:run:dev
```

### Step 4: Start the Development Server
```powershell
pnpm run start:dev
```

---


## 📜 License & Academic Integrity

This project is submitted in partial fulfillment of the requirements for the **Advanced Programming in Web Technology (CSC4161)** course at **American International University-Bangladesh (AIUB)**.  
Licensed under the [MIT License](LICENSE).