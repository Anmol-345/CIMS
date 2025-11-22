# CIMS - College Information Management System

CIMS is a full-stack web application designed to streamline communication and information management within a college or university. It provides distinct portals for students and administrators, each with features tailored to their roles.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)

## Features

### Student Portal
- **Authentication**: Secure registration and login for students.
- **Course Enrollment**: View and manage enrolled courses.
- **Fee Payment**: A dummy portal to simulate fee payment.
- **Notice Board**: View notices published by the admin.

### Admin Portal
- **Authentication**: Secure login for administrators.
- **Student Approval**: Admins can approve or reject new student registrations.
- **Manage Students**: View and manage student information.
- **Manage Courses**: Add, update, and delete courses.
- **Publish Notices**: Create and publish notices for students.

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for components.
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Theming**: `next-themes` for light/dark mode.
- **Linting**: [ESLint](https://eslint.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

### Backend
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM.
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) for secure authentication.
- **Password Hashing**: [bcrypt](https://www.npmjs.com/package/bcrypt) for hashing passwords.
- **Middleware**: [CORS](https://www.npmjs.com/package/cors), [cookie-parser](https://www.npmjs.com/package/cookie-parser).
- **Development**: [Nodemon](https://nodemon.io/) for automatic server restarts.

## Project Structure

The project is organized into two main directories:

```
/
├── backend/         # Contains the Node.js/Express.js API
└── frontend/        # Contains the Next.js client application
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm, yarn, or pnpm
- MongoDB (ensure it's running locally or provide a connection string in a `.env` file in the `backend` directory).

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `backend` directory and add the following environment variables:
    ```
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```
4.  **Run the server:**
    ```bash
    npm start
    ```
    The API will be running at `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:3000`.

## API Endpoints



The backend provides the following API endpoints, all prefixed with `/api`.



### Admin Routes (`/admin`)

- `POST /login`: Login for administrators.

- `GET /students`: Get a list of all students. (Admin only)

- `GET /students/:id`: Get a single student by ID. (Admin only)

- `PATCH /students/:id`: Update a student's information. (Admin only)

- `DELETE /students/:id`: Delete a student. (Admin only)

- `PATCH /students/:id/approve`: Approve a student's registration. (Admin only)

- `DELETE /students/:id/reject`: Reject a student's registration. (Admin only)

- `GET /me`: Get the profile of the currently logged-in admin. (Admin only)

- `GET /logout`: Logout the currently logged-in admin. (Admin only)



### Course Routes (`/courses`)

- `GET /`: Get a list of all courses.

- `GET /:id`: Get a single course by ID. (Admin only)

- `POST /add`: Add a new course. (Admin only)

- `PUT /update/:id`: Update a course by ID. (Admin only)

- `DELETE /delete/:id`: Delete a course by ID. (Admin only)



### Notice Routes (`/notices`)

- `GET /`: Get a list of all notices.

- `POST /add`: Add a new notice. (Admin only)

- `PUT /update/:id`: Update a notice by ID. (Admin only)

- `DELETE /delete/:id`: Delete a notice by ID. (Admin only)



### Student Routes (`/students`)

- `POST /register`: Register a new student.

- `POST /login`: Login for students.

- `GET /me`: Get the profile of the currently logged-in student. (Student or Admin)

- `PATCH /fees`: Update the fee status for the currently logged-in student. (Student only)

- `GET /logout`: Logout the currently logged-in user (student or admin).
