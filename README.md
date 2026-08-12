# TutorConnect 

**A secure online tutoring platform** — connecting students with suitable tutors through smart tutor discovery, personalized recommendation, availability matching, session requests, and role-based portals for students, tutors, and administrators.

TutorConnect is a full-stack MERN application designed to make private tutoring easier to discover, request, manage, and schedule. The platform combines a clean, role-based user experience with algorithmic decision-making for tutor recommendation, scheduling, availability matching, reliability scoring, and analytics.

---

## Stack

**Frontend** — React, Vite, Tailwind CSS, React Router, Axios, React Toastify, Lucide React.

**Backend** — Node.js, Express.js, JWT authentication, bcrypt, REST APIs, Mongoose.

**Database** — MongoDB.

**Tools** — Visual Studio Code, Postman, MongoDB Compass, Git, GitHub.

---

## Quick start

### 1. Backend — http://localhost:5000

```bash
cd Backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 2. Frontend — http://localhost:5173

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Vite will display the frontend URL, normally:

```text
http://localhost:5173
```



## What's inside

* **Public experience** — landing page and tutor discovery.
* **Authentication** — student and tutor registration, login, JWT authentication, protected routes, and role-based authorization.
* **Student portal** — dashboard, tutor search, tutor filtering, tutor profiles, tutoring requests, request tracking, and session management.
* **Tutor portal** — dashboard, tutor profile, subjects, qualifications, experience, hourly rate, availability, incoming requests, request management, and sessions.
* **Admin portal** — administrative dashboard and role-protected administrative functionality.
* **Tutor discovery** — search tutors by name, bio, or subject and filter based on available information.
* **Tutor profiles** — qualifications, experience, subjects, ratings, and hourly rates.
* **Request workflow** — students can send tutoring requests and tutors can accept or reject them.
* **Session workflow** — accepted tutoring requests can result in session creation and tracking.

---

## Smart features

Tutor Connect is designed around practical algorithms rather than simple CRUD workflows.

### Tutor recommendation

Tutors can be ranked using a weighted recommendation score based on:

```text
Recommendation Score =
0.35 × Subject Match
+ 0.25 × Rating
+ 0.20 × Availability Match
+ 0.10 × Experience
+ 0.10 × Price Match
```

The goal is to recommend tutors using multiple factors rather than relying only on subject or rating.

### Availability matching

Student-preferred time slots can be compared against tutor availability to identify suitable tutoring opportunities.

### Scheduling & conflict detection

Interval-overlap logic can be used to detect whether a requested tutoring session conflicts with an existing session.

### Tutor reliability

A composite reliability score can incorporate factors such as ratings, experience, completed sessions, and reviews.

### Analytics

MongoDB aggregation pipelines support statistical analysis such as user statistics, tutor performance, session statistics, revenue-related information, and ratings/reviews.

### Notifications

A FIFO queue concept is used for processing reminders and notifications.

---

## Main workflow

```text
Student
   │
   ▼
Register / Login
   │
   ▼
Find Tutors
   │
   ▼
Search / Filter
   │
   ▼
Tutor Profile
   │
   ▼
Send Tutoring Request
   │
   ▼
Tutor Receives Request
   │
   ├───────────────┐
   │               │
 Reject          Accept
   │               │
   ▼               ▼
Rejected        Session Created
                   │
                   ▼
             Student sees status
```

---

## Role-based portals

### Student

```text
Dashboard
   ↓
Find Tutors
   ↓
Tutor Profile
   ↓
Send Request
   ↓
Track Request
   ↓
Manage Sessions
```

### Tutor

```text
Dashboard
   ↓
Manage Profile
   ↓
Set Subjects & Availability
   ↓
Receive Requests
   ↓
Accept / Reject
   ↓
Manage Sessions
```

### Admin

```text
Admin Dashboard
   ↓
Administrative Access
   ↓
User / Tutor Management
   ↓
Monitoring & Analytics
```

---

## Authentication

TutorConnect uses JWT-based authentication with role-based authorization.

```text
Register
   │
   ▼
Login
   │
   ▼
Credentials validated
   │
   ▼
JWT generated
   │
   ▼
Frontend stores token
   │
   ▼
Axios sends Bearer token
   │
   ▼
Protected API
   │
   ▼
JWT middleware
   │
   ▼
Role authorization
```

Supported roles:

```text
Student
Tutor
Admin
```

---

## API overview

### Authentication

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Register a student or tutor |
| POST   | `/api/auth/login`    | Login and receive JWT       |

### Tutors

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| GET    | `/api/tutors`         | List tutors                 |
| GET    | `/api/tutors/:id`     | Get tutor by ID             |
| POST   | `/api/tutors/create`  | Create tutor profile        |
| GET    | `/api/tutors/profile` | Get logged-in tutor profile |
| PUT    | `/api/tutors/profile` | Update tutor profile        |

### Requests

| Method | Endpoint                          | Description                   |
| ------ | --------------------------------- | ----------------------------- |
| POST   | `/api/requests`                   | Create tutoring request       |
| GET    | `/api/requests/student`           | Get student's requests        |
| GET    | `/api/requests/tutor`             | Get tutor's received requests |
| PUT    | `/api/requests/:requestId/status` | Accept or reject request      |

### Sessions

Session endpoints are provided through the backend session routes and handle the session workflow created from accepted tutoring requests.

---

## Project structure

```text
TutorConnect-AI/
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── request/
│   │   │   └── tutor/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── student/
│   │   │   ├── tutor/
│   │   │   └── admin/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Security

* JWT-based authentication
* Password hashing with bcrypt
* Protected API routes
* Role-based authorization
* Authorization headers
* Server-side validation
* Ownership checks for request operations
* Environment variables for sensitive configuration

---

## Testing & development

The application can be tested using:

**Postman** — API endpoints, authentication, authorization, tutor APIs, request APIs, and session workflows.

**Browser Developer Tools** — frontend errors, API requests, response codes, network requests, and authentication headers.

**MongoDB Compass** — users, tutor profiles, requests, sessions, and other database records.

---

## Documentation

Additional documentation can be added under `docs/` as the project evolves:

* `docs/ARCHITECTURE.md` — system architecture and application flow.
* `docs/ALGORITHMS.md` — recommendation, scheduling, matching, and scoring algorithms.
* `docs/DATABASE.md` — MongoDB collections and relationships.
* `docs/API.md` — detailed REST API documentation.
* `docs/TESTING.md` — testing procedures and test cases.

---

## Current status

The core frontend and backend application has been implemented.

### Completed

* Student authentication
* Tutor authentication
* JWT authentication
* Role-based authorization
* Student dashboard
* Tutor dashboard
* Admin dashboard foundation
* Tutor search
* Tutor filtering
* Tutor profile
* Tutor availability management
* Tutoring request workflow
* Request acceptance/rejection
* Session creation workflow
* REST API integration
* MongoDB database integration
* Frontend-backend integration

### In development / enhancement

* Advanced tutor recommendation
* Advanced availability matching
* Student performance analytics
* Tutor performance analytics
* Reviews and ratings
* Notifications
* Admin analytics
* Payment integration
* Real-time chat
* Session reminders
* Production deployment

---

## Academic purpose

TutorConnect AI is developed as an academic full-stack project to demonstrate the practical application of:

* MERN stack development
* REST API architecture
* Authentication and authorization
* MongoDB database design
* React component architecture
* API integration
* Data structures and algorithms
* Recommendation systems
* Scheduling algorithms
* Data analytics
* Software architecture
* Testing and debugging

---

## Author

**Karishma Thapa**

B.Sc. CSIT Academic Project

---

## License
 
This project is currently intended for academic and educational purposes.

