# 🎓 Tiarkhali M.M High School & College - Management System

A modern, full-featured school management system with real-time messaging, student profiles, exam management, and admin panel.

---

## ⚡ Quick Start

### 1. Start the System
```bash
# Double-click this file (Windows)
START_BOTH.bat

# Or run manually
npm run server:watch   # Terminal 1 - API Server
npm run dev            # Terminal 2 - Frontend
```

### 2. Access the Application
- **URL**: http://localhost:5173
- **API**: http://localhost:3001

### 3. Login
See **USER_LOGINS.md** for all account credentials.

**Quick Test Accounts:**
- **Admin**: admin@tiarkhali-mmhs.edu.bd / admin123
- **Student**: tajulislam67637@gmail.com / 111111

---

## 📋 Features

### ✅ Core Features
- **User Management** - Students, Teachers, Staff, Alumni, Admin
- **Real-Time Messaging** - Cross-browser sync (2-second polling)
- **Student Profiles** - Complete with GPA, achievements
- **Exam & Results** - Create exams, enter marks, publish results
- **Admin Panel** - Full CRUD operations for all entities
- **Notice Board** - Post announcements and events
- **Responsive Design** - Works on all devices

### 🎨 UI Features
- Clean, modern design with SVG icons
- Dark-themed interface
- Glassmorphism effects
- Smooth animations
- Mobile-responsive layout

---

## 🗂️ Project Structure

```
School Website - Copy/
├── data/                    # JSON data storage
│   ├── users.json          # User accounts
│   ├── messages.json       # Chat messages
│   ├── conversations.json  # Message metadata
│   ├── notices.json        # Announcements
│   ├── events.json         # School events
│   ├── exams.json          # Exam definitions
│   └── results.json        # Student results
│
├── src/
│   ├── pages/              # Page components
│   │   ├── home.js
│   │   ├── students.js     # Student profiles
│   │   ├── messages.js     # Real-time messaging
│   │   ├── admin.js        # Admin panel
│   │   └── ...
│   ├── components/         # Reusable components
│   ├── styles/            # CSS files
│   └── utils/             # Utilities (API, auth)
│
├── server.js              # Express API server
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies
├── START_BOTH.bat         # Easy startup script
├── QUICK_START.md         # Detailed getting started guide
└── USER_LOGINS.md         # All login credentials
```

---

## 🔐 User Roles

### Admin (1)
- Full system access
- User management
- Exam and result management
- Notice/event posting

### Students (4)
- View profile
- Edit own profile
- View results
- Send/receive messages

### Teachers (3)
- View profile
- Message students
- View class information

### Staff (2)
- View profile
- Office management functions
- Message users

**Total: 11 Users** - See USER_LOGINS.md for credentials

---

## 🛠️ Tech Stack

### Frontend
- **Vanilla JavaScript** (ES6+)
- **Vite** 5.4.2 (Build tool)
- **Custom CSS** with CSS Variables
- **SVG Icons** (Feather style)

### Backend
- **Node.js** v24.18.0
- **Express.js** 5.2.1
- **JSON File Storage**
- **CORS** enabled

### Features
- SPA routing
- Real-time polling (2s interval)
- localStorage fallback
- Auto-restart server (--watch flag)

---

## 📊 Data Architecture

### Storage
- **Primary**: JSON files in `/data` folder
- **Fallback**: Browser localStorage
- **Sync**: Automatic server-to-client sync

### Message Flow
1. User sends message → Save to localStorage
2. POST to server → Save to messages.json
3. Other users poll every 2s → Receive new messages
4. Messages appear within 2-4 seconds

### Conversation IDs
- **Format**: `C_USER1-ID_USER2-ID` (alphabetically sorted)
- **Example**: `C_ADM-0001_STU-2026-0002`
- Deterministic - same ID for both participants

---

## 🧪 Testing

### Test Messaging (Cross-Browser)
1. **Browser A** (Chrome): Login as Admin
2. **Browser B** (Firefox): Login as Tajul
3. Send message from Admin → Appears in Tajul's browser within 2s
4. Reply from Tajul → Appears in Admin's browser within 2s

### Test Profile Editing
1. Login as student
2. View own profile
3. Click "Edit Profile"
4. Update information
5. Changes persist after refresh

### Test Admin Panel
1. Login as Admin
2. View pending users
3. Approve/reject registrations
4. Create notices and events
5. Manage exam results

---

## 🚀 Deployment

### Development
```bash
npm run dev          # Frontend only (localhost:5173)
npm run server:watch # API server with auto-restart
npm start            # Both servers
```

### Production Build
```bash
npm run build        # Creates /dist folder
npm run preview      # Preview production build
```

---

## 📝 Configuration

### Port Configuration
- **Frontend**: 5173 (Vite default, auto-increments if in use)
- **API Server**: 3001 (hardcoded in server.js)
- **Proxy**: `/api` → `http://localhost:3001` (vite.config.js)

### API Fallback
- If server is offline, app uses localStorage
- Data syncs back to server when it comes online
- No data loss during server downtime

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port is in use
netstat -ano | findstr :3001

# Restart with auto-reload
npm run server:watch
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Messages not syncing
1. Verify API server is running (Terminal shows "API Server running")
2. Check browser console for errors (F12)
3. Hard refresh: Ctrl+Shift+R

### Duplicate conversations
- Already fixed in code with automatic cleanup
- Refresh page to trigger cleanup

---

## 📚 Documentation

- **QUICK_START.md** - Detailed setup guide with screenshots
- **USER_LOGINS.md** - All user credentials and test scenarios
- **This README** - System overview and architecture

---

## ✨ Recent Updates

### Latest Changes (July 30, 2026)
✅ Cross-browser messaging fixed (deterministic IDs)
✅ Console logs removed (clean output)
✅ Duplicate conversations fixed (automatic cleanup)
✅ iOS emojis replaced with SVG icons
✅ 11 real users added (students, teachers, staff)
✅ Server auto-restart enabled
✅ Profile editing working
✅ Data persistence via JSON files

---

## 🔒 Security Notes

**This is a development/demo system.**

### Current Implementation
- ⚠️ Plain text passwords (should be hashed)
- ⚠️ No HTTPS (using HTTP)
- ⚠️ No rate limiting
- ⚠️ Basic authentication

### For Production
- Add password hashing (bcrypt)
- Enable HTTPS
- Implement rate limiting
- Add input sanitization
- Add CSRF protection
- Security audit required

---

## 🤝 Contributing

This is a school management system built for Tiarkhali M.M High School & College.

### Development Guidelines
- Follow existing code style
- Test before committing
- Update documentation
- No breaking changes without discussion

---

## 📞 Support

### Quick Links
- **Quick Start**: See QUICK_START.md
- **Login Info**: See USER_LOGINS.md
- **Issues**: Check console (F12) and server terminal

---

## 📄 License

Educational project for Tiarkhali M.M High School & College.

---

**Built with ❤️ for Tiarkhali M.M High School & College**

*Last Updated: July 30, 2026*
*Version: 1.0.0*
