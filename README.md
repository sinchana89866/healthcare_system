# 🏥 Digital Healthcare Appointment & Patient Management System

> An inclusive, multilingual, full-stack healthcare platform engineered to streamline doctor consultations, eliminate hospital wait times, and bridge the digital healthcare divide for rural and regional communities.

---

## 👥 Project Team

| Name | Role |
| :--- | :--- |
| **Sinchana K A** | Core Full-Stack Developer |
| **Jenifer Christina** | Full-Stack Developer |
| **Neha** | Full-Stack Developer |
| **GaganaShree** | Full-Stack Developer |

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Problem Statement & Impact](#-problem-statement--impact)
3. [Rural Healthcare & Multilingual Inclusion](#-rural-healthcare--multilingual-inclusion)
4. [System Architecture & Layers](#-system-architecture--layers)
5. [Database Design & ER Model](#-database-design--er-model)
6. [Technology Stack](#-technology-stack)
7. [User Roles & Key Features](#-user-roles--key-features)
8. [End-to-End User Workflows](#-end-to-end-user-workflows)
9. [REST API Documentation](#-rest-api-documentation)
10. [Security & Authentication](#-security--authentication)
11. [Project Directory Structure](#-project-directory-structure)
12. [Developer Setup & Installation](#-developer-setup--installation)
13. [Default Credentials & Testing](#-default-credentials--testing)
14. [Future Roadmap](#-future-roadmap)

---

## 🌟 Project Overview

The **Digital Healthcare Appointment & Patient Management System** is a responsive web application that digitizes the entire patient-doctor consultation lifecycle. In traditional healthcare settings—particularly in rural clinics and community healthcare centers—appointment scheduling is handled manually through paper logs, phone calls, or long in-person queues.

This platform provides a centralized, secure digital solution where patients can register, discover doctors by medical specialization, check real-time availability of slots, book consultations online, and receive automated appointment reminders.

---

## 🎯 Problem Statement & Impact

### Current Challenges
- **Long Waiting Lines:** Patients often travel significant distances to rural health centers only to discover doctors are unavailable or slots are full.
- **Language & Literacy Barriers:** Most software solutions are available solely in English, alienating rural populations with regional language proficiency.
- **Manual Record Tracking:** Hospital staff track patient visits manually, increasing the likelihood of double-booking, missing medical history, or lost data.
- **Forgotten Consultations:** Lack of automated reminders leads to high appointment no-show rates.

### The Solution & Real-World Impact
- **Decentralized Access:** Enables appointment booking from any mobile device or desktop prior to visiting the hospital.
- **Regional Accessibility:** Native language support in **Kannada (ಕನ್ನಡ)**, **Hindi (हिन्दी)**, and **English** empowers all demographics to navigate healthcare services independently.
- **Optimized Doctor Schedules:** Doctors define specific availability slots, preventing clinic overcrowding and ensuring focused consultation times.
- **Real-Time Reminders:** An integrated alert and notification bell keeps patients informed of upcoming consultations.

---

## 🌐 Rural Healthcare & Multilingual Inclusion

A core pillar of this system is **inclusive access for rural citizens**. To address low English literacy in rural Karnataka and across India, the user interface provides dynamic, client-side language switching powered by a custom React Context engine (`LanguageContext`):

```
┌────────────────────────────────────────────────────────┐
│                   Language Selector                    │
│     [ English (en-IN) | ಕನ್ನಡ (kn-IN) | हिन्दी (hi-IN) ]    │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    Translated UI Elements      Localized Formatting
    - Form labels & buttons     - Dates (e.g. ಬುಧ, 15 ಅಕ್ಟೋ)
    - Medical specialties       - Time & reminder alerts
    - Error & status toasts     - Locale persistence
```

### Supported Languages
1. **English (`en` / `en-IN`):** Default standard interface.
2. **Kannada (`kn` / `kn-IN`):** Native localized terminology for Karnataka rural health centers (e.g., ಹೃದ್ರೋಗ ಶಾಸ್ತ್ರ, ನರರೋಗ ಶಾಸ್ತ್ರ, ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ).
3. **Hindi (`hi` / `hi-IN`):** Broad regional language support across national healthcare contexts (e.g., हृदय रोग, त्वचा रोग, सामान्य चिकित्सा).

---

## 🏗️ System Architecture & Layers

The system follows an enterprise **N-Tier Client-Server Architecture** adhering to separation of concerns:

```
               [ CLIENT TIER ]
   React 19 + Vite SPA (Desktop & Mobile)
   - i18n Localization Engine (LanguageContext)
   - Axios Interceptor (Auto-attaches Bearer JWT)
   - Notification & Toast Reminder Engine
                    │
                    │ HTTP / REST APIs (JSON) + CORS
                    ▼
               [ API GATEWAY & SECURITY TIER ]
   Spring Security 6 + JwtFilter
   - Stateless Session Management
   - Role-Based Access Control (PATIENT, DOCTOR, ADMIN)
   - BCrypt Password Hashing
                    │
                    ▼
               [ APPLICATION / CONTROLLER TIER ]
   Spring Boot REST Controllers
   - AuthController        - DoctorController
   - AppointmentController - AdminController
                    │
                    ▼
               [ PERSISTENCE / DATA ACCESS TIER ]
   Spring Data JPA + Hibernate ORM
   - UserRepository        - DoctorRepository
   - SlotRepository        - AppointmentRepository
                    │
                    ▼
               [ DATABASE TIER ]
   MySQL 8.0 Relational Database (healthcare_db)
```

### Architectural Layers
1. **Presentation Layer (`frontend/src/`):** React functional components, hooks (`useState`, `useEffect`, `useContext`), and responsive CSS.
2. **Security Layer (`backend/.../security/`):** Custom `OncePerRequestFilter` (`JwtFilter`) extracting and validating JWT tokens from the `Authorization: Bearer <token>` header.
3. **Controller Layer (`backend/.../controller/`):** REST API endpoints consuming JSON payloads and returning standardized HTTP responses.
4. **Domain Model Layer (`backend/.../model/`):** JPA Entities representing business entities with mapped relational constraints.
5. **Data Access Layer (`backend/.../repository/`):** Spring Data JPA repositories abstracting SQL operations.
6. **Data Storage Layer:** MySQL 8.0 with InnoDB engine enforcing relational integrity and transactions.

---

## 🗄️ Database Design & ER Model

```
 ┌──────────────────────┐         1:1         ┌─────────────────────────┐
 │        users         │ ─────────────────── │         doctor          │
 ├──────────────────────┤                     ├─────────────────────────┤
 │ PK id: BIGINT        │                     │ PK id: BIGINT           │
 │    name: VARCHAR     │                     │    name: VARCHAR        │
 │    email: VARCHAR    │                     │    specialization: TEXT │
 │    password: VARCHAR │                     │ FK user_id: BIGINT      │
 │    role: ENUM        │                     └────────────┬────────────┘
 └──────────┬───────────┘                                  │
            │                                              │ 1:N
            │ 1:N (as Patient)                             ▼
            │                                 ┌─────────────────────────┐
            │                                 │          slot           │
            │                                 ├─────────────────────────┤
            │                                 │ PK id: BIGINT           │
            │                                 │ FK doctor_id: BIGINT    │
            │                                 │    date: DATE           │
            │                                 │    start_time: TIME     │
            │                                 │    booked: BOOLEAN      │
            │                                 └────────────┬────────────┘
            ▼                                              │ 1:1
 ┌─────────────────────────────────────────────────────────┴────────────┐
 │                             appointment                              │
 ├──────────────────────────────────────────────────────────────────────┤
 │ PK id: BIGINT                                                        │
 │ FK patient_id: BIGINT  (Refers to users.id)                          │
 │ FK slot_id: BIGINT     (Refers to slot.id)                           │
 │    status: ENUM ('BOOKED', 'COMPLETED', 'CANCELLED')                 │
 │    created_at: DATETIME                                              │
 └──────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 (Functional Components, Hooks)
- **Build Tool:** Vite 8 (Ultra-fast HMR and optimized bundler)
- **Routing:** React Router DOM 7
- **HTTP Client:** Axios (with request/response interceptors)
- **Styling:** Modular Pure CSS3 (Custom design system, CSS variables, mobile-responsive grid)
- **Internationalization (i18n):** Custom React Context-based translation engine supporting `en-IN`, `kn-IN`, and `hi-IN`

### Backend
- **Language:** Java 17 / 25
- **Framework:** Spring Boot 4.1.x
- **Security:** Spring Security 6, Stateless JWT Authentication (`jjwt-api` 0.12.6)
- **ORM / Persistence:** Spring Data JPA, Hibernate 7
- **Database Driver:** MySQL Connector/J (`com.mysql:mysql-connector-j`)
- **Code Generation:** Project Lombok (Getters, Setters, Constructors)
- **Build & Dependency Tool:** Maven Wrapper (`mvnw` / `mvnw.cmd`)

### Database & Infrastructure
- **RDBMS:** MySQL Server 8.0 (`healthcare_db`)
- **Host Environment:** Windows / Linux / macOS compatible

---

## 👤 User Roles & Key Features

### 1. Patient (`ROLE_PATIENT`)
- **Registration & Login:** Secure authentication with password encryption.
- **Language Switcher:** Toggle UI on-the-fly between English, Kannada, and Hindi.
- **Find Doctors:** Browse doctors and filter by medical specializations (Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, General Medicine, Gynecology).
- **Slot Discovery & Booking:** View doctor-specific available calendar dates and time slots; book with single-click confirmation.
- **Appointment Management:** Review upcoming and past appointments.
- **Appointment Cancellation:** Cancel booked slots with automatic slot status release for other patients.
- **Live Reminder Bell:** Notification bell in navbar providing real-time alerts for impending consultations (today, tomorrow, or within minutes).

### 2. Doctor (`ROLE_DOCTOR`)
- **Portal Login:** Dedicated credential access.
- **Slot Creation:** Add consultation availability slots specifying date and start time.
- **Appointment Roster:** View all patients booked for scheduled slots.
- **Consultation Lifecycle:** Update appointment status (`BOOKED` $\rightarrow$ `COMPLETED` or `CANCELLED`).

### 3. Administrator (`ROLE_ADMIN`)
- **System Monitoring:** Comprehensive visibility across all hospital departments.
- **Doctor Onboarding:** Create new doctor accounts and assign department specializations.
- **Patient Directory:** View all registered patients across the system.
- **System Audit:** View the global log of all appointments across all doctors and departments.

---

## 🔄 End-to-End User Workflows

```
  [ Patient Workflow ]
  Register/Login ──► Select Language ──► Browse Doctors ──► Pick Time Slot ──► Book Appointment ──► Receive Reminders

  [ Doctor Workflow ]
  Login ──► Add Available Slots ──► View Booked Appointments ──► Mark Consultations as Completed

  [ Admin Workflow ]
  Login ──► Onboard New Doctors & Specializations ──► Monitor Clinic Schedules ──► Inspect Patient Records
```

---

## 📡 REST API Documentation

### Base URL: `http://localhost:8080/api`

### 1. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new patient (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Public | Authenticate user & receive JWT (`email`, `password`) |

### 2. Doctor & Public Consultation Endpoints (`/api/doctors`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/doctors` | Authenticated | List all registered doctors and specializations |
| `GET` | `/doctors/{id}/slots` | Authenticated | List all unbooked available slots for doctor |

### 3. Patient Appointment Endpoints (`/api/appointments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/appointments` | Patient (`ROLE_PATIENT`) | Book an appointment by `slotId` |
| `GET` | `/appointments/my` | Patient (`ROLE_PATIENT`) | View caller's booked appointment history |
| `PUT` | `/appointments/{id}/cancel` | Patient (`ROLE_PATIENT`) | Cancel an appointment and free the slot |

### 4. Doctor Management Endpoints (`/api/doctor`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/doctor/slots` | Doctor (`ROLE_DOCTOR`) | Create new available consultation slot (`date`, `startTime`) |
| `GET` | `/doctor/appointments` | Doctor (`ROLE_DOCTOR`) | View all appointments scheduled with the doctor |
| `PUT` | `/doctor/appointments/{id}/status` | Doctor (`ROLE_DOCTOR`) | Update status (`BOOKED`, `COMPLETED`, `CANCELLED`) |

### 5. Admin Endpoints (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/admin/doctors` | Admin (`ROLE_ADMIN`) | Create doctor user account and profile |
| `GET` | `/admin/patients` | Admin (`ROLE_ADMIN`) | Fetch list of all registered patients |
| `GET` | `/admin/appointments` | Admin (`ROLE_ADMIN`) | Fetch complete appointment history of the clinic |

---

## 🔒 Security & Authentication

- **Stateless JWT Tokens:** Authentication tokens are issued with a 24-hour expiration window using HMAC SHA-256 signing.
- **Client Request Flow:** The frontend Axios client automatically retrieves the token from browser storage and attaches an `Authorization: Bearer <token>` header to all outgoing requests.
- **Password Protection:** User passwords are encrypted using BCrypt one-way hashing before persisting into the database.
- **CORS Protection:** Configured in `SecurityConfig.java` to whitelist requests originating from the React frontend (`http://localhost:5173`).
- **Role-Based Authorization:** Endpoints are strictly partitioned via Spring Security path matchers (`hasRole('PATIENT')`, `hasRole('DOCTOR')`, `hasRole('ADMIN')`).

---

## 📂 Project Directory Structure

```text
healthcare_system/
├── .env.example                               # Root environment configuration template
├── .gitignore                                 # Root Git ignore rules
├── README.md                                  # Comprehensive documentation
│
├── backend/                                   # Spring Boot Java Application
│   ├── .env.example                           # Backend environment template
│   ├── mvnw / mvnw.cmd                        # Maven build wrappers
│   ├── pom.xml                                # Project dependencies & build plugins
│   └── src/
│       ├── main/
│       │   ├── java/com/example/appointment/
│       │   │   ├── AppointmentApplication.java # Spring Boot main entry point
│       │   │   ├── config/                    # SecurityConfig, DataSeeder
│       │   │   ├── controller/                # Auth, Doctor, Appointment, Admin APIs
│       │   │   ├── model/                     # User, Doctor, Slot, Appointment entities
│       │   │   ├── repository/                # Spring Data JPA interfaces
│       │   │   └── security/                  # JwtFilter, JwtUtil
│       │   └── resources/
│       │       └── application.properties     # Spring datasource & JWT configuration
│       └── test/                              # Unit & integration tests
│
└── frontend/                                  # React 19 + Vite Application
    ├── .env.example                           # Frontend environment template
    ├── package.json                           # NPM dependencies and scripts
    ├── vite.config.js                         # Vite build configuration
    ├── index.html                             # Single Page Application HTML root
    └── src/
        ├── App.jsx                            # Main layout, navbar, routes, language switcher
        ├── main.jsx                           # Application bootstrap & LanguageProvider
        ├── index.css                          # Complete design system & responsive styling
        ├── api.js                             # Axios instance with JWT interceptor
        ├── components/
        │   └── NotificationBell.jsx           # Real-time reminder drawer & toast alerts
        ├── i18n/
        │   ├── LanguageContext.jsx            # Multi-language Context Provider & hooks
        │   └── translations.js                # Translations for English, Kannada, Hindi
        └── pages/
            ├── Login.jsx                      # Patient & Doctor login
            ├── Register.jsx                   # Patient self-registration
            ├── Doctors.jsx                    # Doctor catalog & slot booking modal
            └── MyAppointments.jsx             # Appointment history & cancellation
```

---

## 🚀 Developer Setup & Installation

### Prerequisites
- **Java Development Kit (JDK):** Version 17 or higher
- **Node.js:** Version 18.x or higher & **npm**
- **MySQL Server:** Version 8.0+ running on port `3306`

---

### Step 1: Configure Environment Variables
Copy `.env.example` to set up your local environment parameters:

```powershell
# In project root or backend/
cp .env.example .env
```

Ensure your MySQL password matches `application.properties`:
```properties
DB_URL=jdbc:mysql://localhost:3306/healthcare_db?createDatabaseIfNotExist=true
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
PORT=8080
JWT_SECRET=this-is-a-demo-secret-key-change-it-later-123456
```

---

### Step 2: Run the Backend
Navigate to the `backend` directory and start the Spring Boot application using the Maven wrapper:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
*(On Linux/macOS, run `./mvnw spring-boot:run`)*

The backend server will start on **`http://localhost:8080`**. It will automatically:
1. Create the `healthcare_db` database in MySQL if it doesn't already exist.
2. Generate all entity tables (`users`, `doctor`, `slot`, `appointment`).
3. Seed the default Administrator account.

---

### Step 3: Run the Frontend
Open a new terminal, navigate to the `frontend` directory, install packages, and start the Vite dev server:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will start on **`http://localhost:5173`**.

---

## 🔑 Default Credentials & Testing

On the initial backend launch, `DataSeeder.java` seeds an administrator account automatically:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@clinic.com` | `admin123` | Add doctors, manage patients, view all clinic appointments |
| **Patient** | *(Self-register via UI)* | *(Custom)* | Switch languages, book slots, view & cancel appointments |
| **Doctor** | *(Created by Admin)* | *(Set by Admin)* | Add availability slots, view patient roster, update status |

---

## 🔮 Future Roadmap

- [ ] **Telemedicine & Video Consultation:** WebRTC integration for direct remote video calls between rural clinics and specialized doctors.
- [ ] **SMS / WhatsApp Notifications:** Twilio / Gupshup integration to send SMS confirmations to patients without smartphones.
- [ ] **Online Payments:** Integration with UPI / Razorpay for consultation fee settlement.
- [ ] **Offline-First PWA:** Progressive Web App capability allowing appointments to be browsed and synced even with spotty rural connectivity.
- [ ] **Prescription & Lab Reports:** PDF generation for digital prescriptions and patient medical histories.

---

## 📄 License
This project is developed for academic and community healthcare management purposes.
