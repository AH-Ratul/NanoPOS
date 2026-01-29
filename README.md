# NanoPOS

A modern, lightweight POS-style application built with NestJS, React, and PostgreSQL.

## 🚀 Overview

NanoPOS is a small-scale Point of Sale system designed to demonstrate production-level code quality using a modern tech stack. The system includes user authentication, product management, and sales processing with automated stock deduction.

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS
- **Database:** PostgreSQL (with Neon)
- **ORM:** Prisma
- **Auth:** JWT (JSON Web Token) with bcrypt for password hashing
- **Validation:** class-validator & class-transformer

### Frontend
- **Framework:** Vite + React + TypeScript
- **State Management:** TanStack Query (React Query)
- **UI Framework:** Ant Design
- **Icons:** Lucide React & Ant Design Icons
- **Routing:** React Router DOM

## ✨ Core Features

1.  **Authentication**
    - Email & password based login.
    - JWT-protected routes and APIs.
    - Cookie-based session management for the web frontend.
2.  **Product Management**
    - Create, List, Update, and Delete (CRUD) products.
    - Fields: Name, SKU, Price, Stock Quantity.
3.  **Sales & Inventory**
    - Create sales transactions.
    - Real-time stock deduction upon sale completion.
    - Validation to prevent sales when stock is insufficient.

## 📂 Project Structure

```text
NanoPOS/
├── server/       # NestJS Backend
├── frontend/     # React Frontend (Vite)
└── ...
```

## ⚙️ Project Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (or use the provided Neon URL in `.env`)
- pnpm (recommended) or npm

### 1. Environment Configuration

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5200
JWT_SECRET=your-secret-key
DATABASE_URL="your-postgresql-url"
FRONTEND_URL=http://localhost:5173
```

### 2. Installation

```bash
# Install backend dependencies
cd server
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 3. Database Migration

```bash
cd server
npx prisma migrate dev
```

### 4. Running the Application

#### Start Backend
```bash
cd server
pnpm run start:dev
```

#### Start Frontend
```bash
cd frontend
pnpm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to access the application.

## 🧪 Testing

```bash
# Backend tests
cd server
pnpm run test
```

## 📖 API Documentation

The project includes a Postman collection for testing the API endpoints:
- [NanoPOS.postman_collection.json](./NanoPOS.postman_collection.json)


