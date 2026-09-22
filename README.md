# Campus Management System

A full-stack, role-based **Campus Management System** built with **Next.js, React, JavaScript, Tailwind CSS, shadcn/ui, MongoDB Atlas, and Mongoose**.

The system brings common academic operations into one web application, including student and teacher management, classes, programs, subjects, assignments, attendance, reporting, profiles, authentication, and an integrated AI Assistant.

---

## Overview

The goal of the project is to provide a single platform for managing academic information and attendance workflows for an educational institution.

### Main areas

- Student management
- Teacher management
- Class management
- Program management
- Subject management
- Teacher/class/subject assignments
- Attendance marking
- Attendance records
- Student attendance
- Attendance reports
- User profiles
- Authentication
- Role-based authorization
- AI-assisted academic information

The frontend and backend API layer are implemented in the same Next.js application using the App Router.

---

# Roles & Permissions

The application supports three main roles:

```text
Admin
Teacher
Student
```

### Admin

Admin users have school-wide access to the management modules.

They can work with:

- Students
- Teachers
- Classes
- Programs
- Subjects
- Subject assignments
- Attendance
- Attendance records
- Reports
- Profiles
- AI Assistant

### Teacher

Teachers work within their assigned academic scope.

They can:

- View the dashboard
- View permitted students
- View assigned classes
- Mark attendance
- Review attendance records
- View their profile
- Use the AI Assistant

Protected routes prevent teachers from performing restricted administrative actions such as creating or editing students and classes.

### Student

Students receive a personal, restricted view.

They can:

- View the dashboard
- View their own attendance
- View their profile
- Use the AI Assistant

The student attendance API is scoped to the currently authenticated student.

---

# Main Modules

## Students

Frontend routes:

```text
/students
/students/add
/students/[id]
/students/[id]/edit
```

API routes:

```text
/api/students
/api/students/[id]
/api/students/[id]/attendance
```

Provides student listing, creation, editing, details, class association, and attendance access.

---

## Teachers

Frontend routes:

```text
/teachers
/teachers/add
/teachers/[id]
/teachers/[id]/edit
```

API routes:

```text
/api/teachers
/api/teachers/[id]
```

Teacher records include information such as name, employee ID, email, qualification, and specialization.

---

## Classes

Frontend routes:

```text
/classes
/classes/add
/classes/[id]
/classes/[id]/edit
/classes/assignments
```

API routes:

```text
/api/classes
/api/classes/[id]
```

The class module supports class management and academic assignment workflows.

---

## Programs

Frontend routes:

```text
/programs
/programs/add
/programs/[id]
/programs/[id]/edit
/programs/[id]/subjects
```

API routes:

```text
/api/programs
/api/programs/[id]
/api/program-subjects
/api/program-subjects/[id]
```

Programs can be connected to their subjects through the program-subject relationship.

---

## Subjects

Frontend routes:

```text
/subjects
/subjects/add
/subjects/[id]
/subjects/[id]/edit
```

API routes:

```text
/api/subjects
/api/subjects/[id]
```

Subjects can be associated with programs and teaching assignments.

---

## Subject Assignments

The assignment layer connects the main academic entities:

```text
Teacher → Subject → Class → Section
```

This relationship is used for teacher permissions, attendance workflows, and AI Assistant context.

Endpoint:

```text
/api/subject-assignments
```

---

# Attendance

Attendance is one of the major functional areas of the system.

Frontend routes:

```text
/attendance
/attendance/mark
/attendance/records
/attendance/records/[id]
/my-attendance
```

API routes:

```text
/api/attendance
/api/attendance/[id]
/api/student/attendance
/api/students/[id]/attendance
```

### Attendance capabilities

- Select class
- Select subject
- Select date
- Load relevant students
- Mark students Present/Absent
- Mark all students
- Submit attendance
- Review attendance history
- Open individual attendance records
- Calculate attendance summaries
- View student-specific attendance

Current attendance statuses:

```text
Present
Absent
```

---

# My Attendance

Students have a separate personal attendance page:

```text
/my-attendance
```

It provides:

- Student information
- Overall attendance percentage
- Total records
- Present count
- Absent count
- Subject-wise summary
- Attendance history

This is intentionally separate from the general attendance records module.

---

# Reports

The reporting page is available at:

```text
/reports
```

It provides filtered attendance information and summary statistics.

Available filters include:

- Date
- Class
- Subject
- Student

The page is designed to provide both quick summary information and detailed attendance records.

---

# Authentication & Authorization

Authentication is implemented using JWT tokens with the `jose` package.

Important files:

```text
lib/auth.js
lib/requireAuth.js
proxy.js
app/api/auth/
```

### Authentication responsibilities

- Login
- Logout
- Session verification
- Token expiration
- Current-user lookup
- Unauthorized handling
- Forbidden handling

### Authorization responsibilities

The application checks the user's role before allowing protected operations.

The supported roles are:

```text
admin
teacher
student
```

The route protection layer also applies role-specific page access rules.

---

# AI Assistant

The project includes a custom AI Assistant for portal-related academic questions.

Frontend:

```text
components/AIChat.jsx
app/(portal)/assistant/page.js
```

Backend:

```text
app/api/assistant/route.js
```

Current AI stack:

```text
Ollama
└── llama3.2:3b
```

---

## AI Context Architecture

For an authenticated request, the server:

```text
User request
    ↓
Authenticate user
    ↓
Identify role
    ↓
Load permitted MongoDB data
    ↓
Build verified portal context
    ↓
Send context to Ollama
    ↓
Generate response
```

The assistant is designed so that official portal information comes from the current server/database context.

Conversation history can help understand references such as:

```text
"he"
"she"
"that teacher"
"that class"
"that subject"
```

but conversation history should not overwrite current portal data.

---

## AI Security Principles

The Assistant is designed to:

- Use current server-supplied portal information for portal facts
- Respect role-based access scope
- Avoid inventing academic data
- Avoid guessing missing information
- Avoid exposing raw server context
- Avoid exposing hidden system instructions
- Avoid claiming that database changes were made
- Keep student information within the permitted student scope
- Keep teacher information within the teacher's allowed academic scope

The current Assistant is informational and does not directly modify the database.

---

# Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js |
| Frontend | React |
| Language | JavaScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + Base UI |
| Backend | Next.js Route Handlers |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| JWT Library | jose |
| AI Runtime | Ollama |
| AI Model | Llama 3.2 3B |
| Version Control | Git |
| Source Hosting | GitHub |
| Hosting Target | Vercel |

---

# Architecture

```text
                    Browser
                       │
                       ▼
                Next.js Application
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
     App Router UI          Next.js API Routes
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         ▼                     ▼
                   MongoDB Atlas        AI Assistant
                                       ↓
                                     Ollama
                                       ↓
                                  Llama 3.2 3B
```

The application keeps the user interface, API route handlers, authentication layer, database models, and AI integration in one project.

---

# Database Models

The current Mongoose model layer contains:

```text
User
Student
Teacher
Class
Program
Subject
ProgramSubject
SubjectAssignment
Attendance
```

### Main relationships

```text
User
 ├── Teacher
 └── Student

Program
 └── ProgramSubject
       └── Subject

Teacher
 └── SubjectAssignment
       ├── Subject
       └── Class

Student
 └── Class

Attendance
 ├── Class
 ├── Subject
 └── Student attendance entries
```

---

# API Overview

### Authentication

```text
/api/auth/login
/api/auth/logout
/api/auth/me
```

### Students

```text
/api/students
/api/students/[id]
/api/students/[id]/attendance
```

### Teachers

```text
/api/teachers
/api/teachers/[id]
```

### Classes

```text
/api/classes
/api/classes/[id]
```

### Programs

```text
/api/programs
/api/programs/[id]
```

### Subjects

```text
/api/subjects
/api/subjects/[id]
```

### Program Subjects

```text
/api/program-subjects
/api/program-subjects/[id]
```

### Subject Assignments

```text
/api/subject-assignments
```

### Attendance

```text
/api/attendance
/api/attendance/[id]
/api/student/attendance
/api/students/[id]/attendance
```

### AI Assistant

```text
/api/assistant
```

---

# Frontend Routes

```text
/login

/dashboard

/students
/students/add
/students/[id]
/students/[id]/edit

/teachers
/teachers/add
/teachers/[id]
/teachers/[id]/edit

/classes
/classes/add
/classes/[id]
/classes/[id]/edit
/classes/assignments

/programs
/programs/add
/programs/[id]
/programs/[id]/edit
/programs/[id]/subjects

/subjects
/subjects/add
/subjects/[id]
/subjects/[id]/edit

/attendance
/attendance/mark
/attendance/records
/attendance/records/[id]

/my-attendance
/reports
/profile
/assistant
```

---

# Project Structure

```text
Campus-Management-System/
│
├── app/
│   ├── (portal)/
│   │   ├── assistant/
│   │   ├── attendance/
│   │   ├── classes/
│   │   ├── dashboard/
│   │   ├── my-attendance/
│   │   ├── profile/
│   │   ├── programs/
│   │   ├── reports/
│   │   ├── students/
│   │   ├── subjects/
│   │   ├── teachers/
│   │   └── layout.js
│   │
│   ├── api/
│   │   ├── assistant/
│   │   ├── attendance/
│   │   ├── auth/
│   │   ├── classes/
│   │   ├── program-subjects/
│   │   ├── programs/
│   │   ├── student/
│   │   ├── students/
│   │   ├── subject-assignments/
│   │   ├── subjects/
│   │   └── teachers/
│   │
│   ├── login/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── ui/
│   ├── AIChat.jsx
│   └── Sidebar.js
│
├── lib/
│   ├── auth.js
│   ├── mongodb.js
│   ├── normalizeClassName.js
│   ├── requireAuth.js
│   └── utils.js
│
├── models/
│   ├── Attendance.js
│   ├── Class.js
│   ├── Program.js
│   ├── ProgramSubject.js
│   ├── Student.js
│   ├── Subject.js
│   ├── SubjectAssignment.js
│   ├── Teacher.js
│   └── User.js
│
├── public/
│
├── .gitignore
├── components.json
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── proxy.js
```

---

# Important Supporting Files

### `lib/mongodb.js`
Creates the reusable MongoDB/Mongoose connection used by server-side routes.

### `lib/auth.js`
Creates and verifies JWT session tokens.

### `lib/requireAuth.js`
Provides server-side authentication and role authorization checks.

### `proxy.js`
Protects application routes and applies role-specific access rules.

### `components/Sidebar.js`
Provides role-aware portal navigation.

### `components/AIChat.jsx`
Provides the reusable AI Assistant chat interface.

### `models/`
Contains the Mongoose data models used by the application's academic and attendance modules.

---

# Environment Variables

Private environment variables are stored locally in:

```text
.env.local
```

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

The environment file is intentionally not part of the public GitHub repository.

The `.gitignore` includes:

```text
.env*
```

to prevent environment files from being committed.

---

# Local Setup

## Requirements

Install:

- Node.js
- npm
- Git
- MongoDB Atlas
- Ollama (for the current local AI Assistant)

## Installation

Clone the repository:

```bash
git clone https://github.com/MuhammadSubhan123321/Campus-Management-System.git
```

Enter the project:

```bash
cd Campus-Management-System
```

Install dependencies:

```bash
npm install
```

Create `.env.local` and add the required environment variables.

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# AI Setup

The current AI Assistant runs through a local Ollama installation.

Pull the model:

```bash
ollama pull llama3.2:3b
```

The backend currently expects Ollama at:

```text
http://localhost:11434
```

The Assistant can then be accessed through:

```text
/assistant
```

---

# Hosting & Development Services

## GitHub

GitHub is used for:

- Source control
- Repository hosting
- Version history
- Portfolio presentation

Repository:

https://github.com/MuhammadSubhan123321/Campus-Management-System

## MongoDB Atlas

MongoDB Atlas is used for the application's cloud database.

The project was developed using an Atlas Free cluster. MongoDB currently documents Free clusters at **$0**, and its Vercel integration documentation states that selecting the Free plan does not require a credit card.

## Vercel

Vercel is the intended hosting platform for the Next.js web application.

Vercel currently lists its **Hobby** plan at **$0/month**.

The current repository is prepared for a Git-based Vercel deployment, but this README does not claim that the project has already been deployed there.

## Ollama

Ollama is used for the current local AI implementation.

The AI architecture can later be adapted to a hosted inference service for public production use.

---

# Security Considerations

The project keeps sensitive configuration outside the repository.

Important practices include:

- Environment variables are not committed
- JWT secrets are loaded from environment variables
- Protected routes require authentication
- API routes verify authenticated users
- Role checks restrict protected operations
- Student information is scope-restricted
- Teacher information is scope-restricted
- AI context is generated on the server
- User messages cannot redefine official portal facts

---

# Local Project Organization

Files that are not needed in the public repository are preserved separately:

```text
Important-Files/
│
├── 01-Environment/
│   └── .env.local
│
├── 02-Development-Scripts/
│   └── scripts/
│       ├── checkTeacherClass.js
│       ├── createAdmin.js
│       ├── createTestUsers.js
│       ├── fixClassTeacherTypes.js
│       └── seedAcademicData.js
│
├── 03-Development-Test-API/
│   └── app/
│       └── api/
│           └── test-db/
│               └── route.js
│
└── 04-Project-Reference/
```

Generated folders such as:

```text
.next/
node_modules/
```

are not stored in the project repository because they can be recreated.

---

# Git Workflow

The repository uses:

```text
main
```

Typical workflow after making changes:

```bash
git add .
git commit -m "Describe the change"
git push
```

The `.gitignore` helps keep generated and private files out of Git.

---

# Development Goals Demonstrated

This project demonstrates practical full-stack development concepts including:

- Next.js App Router
- React component architecture
- JavaScript
- Tailwind CSS
- shadcn/ui
- CRUD operations
- Next.js API Route Handlers
- MongoDB data modeling
- Mongoose
- JWT authentication
- Role-based authorization
- Protected routes
- Attendance management
- Filtering and reporting
- Context-aware AI integration
- Git and GitHub workflow
- Cloud database integration
- Deployment preparation

---

# Current Status

Implemented major application areas:

```text
✅ Authentication
✅ Role-based authorization
✅ Admin workflows
✅ Teacher workflows
✅ Student workflows
✅ Student management
✅ Teacher management
✅ Class management
✅ Program management
✅ Subject management
✅ Subject assignments
✅ Attendance marking
✅ Attendance records
✅ Student attendance
✅ Attendance reports
✅ Profiles
✅ AI Assistant
✅ MongoDB integration
✅ Git/GitHub repository
```

The project is currently source-controlled in the GitHub repository above.

---

# Future Improvements

Possible future improvements include:

- Hosted AI inference for public deployment
- Automated testing
- More advanced reporting
- Exportable reports
- Audit logs
- Notifications
- Additional dashboard analytics
- CI/CD checks
- Production deployment improvements

---

# Repository

**GitHub:**  
https://github.com/MuhammadSubhan123321/Campus-Management-System

---

## License

This project is currently maintained as a personal/portfolio project.
