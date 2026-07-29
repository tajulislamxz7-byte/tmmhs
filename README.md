# Greenfield Academy — School Management & Alumni Platform

A fully-featured, production-quality school management platform built with vanilla HTML, CSS, and JavaScript (ES Modules).

## Features

- **7 User Roles**: Guest, Student, Teacher, Support Staff, Alumni, Admin, Super Admin
- **Full Authentication UI**: Login, Register, Forgot Password, Google SSO, RBAC
- **Student Module**: Directory, Profile, Digital ID Card, QR Code, Skills, Achievements
- **Teacher Module**: Directory, Profile, Subject Management
- **Support Staff Module**: Directory with Department Filters
- **Alumni Network**: Global directory with country/year/profession filters
- **Batch Management**: Batch detail pages with student lists and achievements
- **Result Management**: Exam creation, marks entry, auto GPA/grade calculation, PDF marksheet
- **Attendance Tracking**: Calendar view, monthly trends, teacher attendance-taking interface
- **Notice Board**: Categorized notices with urgency flags
- **Events Calendar**: Full event cards with RSVP
- **Photo Gallery**: Album grid with category filters
- **Messaging System**: Private chat between students and teachers
- **Admin Dashboard**: Full analytics, manage all modules, settings
- **Global Search**: Search students, teachers, alumni, notices, events (Ctrl+K)
- **Dark Mode**: Full dark/light toggle with localStorage persistence
- **Online Admission**: Multi-step application form
- **Complaint Box**: Anonymous complaint/suggestion submission
- **About Page**: History, Mission, Vision, FAQ, Contact

## Running the Project

The project uses native ES Modules so it requires a local server (cannot be opened directly from file://).

### Option 1 — VS Code Live Server
Install the "Live Server" extension in VS Code, right-click `index.html` → **Open with Live Server**

### Option 2 — Node.js serve
```bash
npx serve .
```
Then open http://localhost:3000

### Option 3 — Python HTTP Server
```bash
python -m http.server 8080
```
Then open http://localhost:8080

## Project Structure

```
School Website/
├── index.html              # Entry point
├── src/
│   ├── app.js              # Router & main controller
│   ├── components/
│   │   ├── navbar.js
│   │   ├── footer.js
│   │   └── search.js
│   ├── data/
│   │   └── sampleData.js   # All realistic sample data
│   ├── pages/
│   │   ├── home.js
│   │   ├── students.js
│   │   ├── teachers.js
│   │   ├── staff.js
│   │   ├── alumni.js
│   │   ├── batches.js
│   │   ├── results.js
│   │   ├── attendance.js
│   │   ├── notices.js
│   │   ├── events.js
│   │   ├── gallery.js
│   │   ├── messages.js
│   │   ├── about.js
│   │   ├── admin.js
│   │   ├── admission.js
│   │   ├── complaints.js
│   │   └── auth.js
│   └── styles/
│       ├── main.css        # Design system (variables, reset, components)
│       ├── components.css  # Navbar, search, toast, etc.
│       └── pages.css       # Page-specific styles
```
