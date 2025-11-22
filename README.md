# CIMS - Course Information Management System

CIMS is a full-stack web application designed to manage and display course information for students. It features a student portal where users can log in to view their enrolled courses, along with details like course level and marks obtained.

The project is built with a modern JavaScript stack, featuring a Next.js frontend and a Node.js backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)

## Features

- **Student Authentication**: Secure login for students to access their information.
- **Course Dashboard**: Displays a list of all courses the student is enrolled in.
- **Course Details**: Shows course name, code, level (Undergraduate/Postgraduate), and marks.
- **Dynamic Data Fetching**: Courses and user data are fetched from a dedicated backend API.

## Tech Stack

- **Frontend**:
  - **Next.js**: React framework for server-side rendering and static site generation.
  - **React**: JavaScript library for building user interfaces.
  - **`shadcn/ui`**: The project uses table components (`<Table>`, `<TableBody>`, etc.) which are characteristic of this UI library.
  - **Tailwind CSS**: (Likely used with `shadcn/ui`) for styling.

- **Backend**:
  - **Node.js**: JavaScript runtime for the server.
  - **Express.js**: (Inferred) A common framework for building APIs in Node.js.
  - **MongoDB**: (Inferred) The `_id` object format in the frontend code strongly suggests a MongoDB database.

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
- MongoDB (ensure it's running locally or provide a connection string)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the server:** (The frontend expects the API at `http://localhost:5000`)
    ```bash
    npm start
    ```

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
4.  Open your browser and navigate to `http://localhost:3000/student-portal/courses`.
