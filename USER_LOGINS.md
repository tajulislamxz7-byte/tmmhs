# 🔐 User Login Credentials - Quick Reference

## 👨‍💼 Admin Account (1)

| Name | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@tiarkhali-mmhs.edu.bd | admin123 | admin |

---

## 👨‍🎓 Student Accounts (4)

| Name | Email | Password | Class | Roll | GPA |
|------|-------|----------|-------|------|-----|
| Tajul Islam | tajulislam67637@gmail.com | 111111 | 10-A | 101 | 5.00 |
| Nusrat Jahan | nusrat.jahan@student.tiarkhali.edu.bd | student123 | 10-A | 102 | 4.95 |
| Rakib Hasan | rakib.hasan@student.tiarkhali.edu.bd | student123 | 9-B | 201 | 4.75 |
| Sadia Rahman | sadia.rahman@student.tiarkhali.edu.bd | student123 | 8-A | 301 | 4.85 |

---

## 👨‍🏫 Teacher Accounts (3)

| Name | Email | Password | Subject |
|------|-------|----------|---------|
| Dr. Abdullah Khan | abdullah.khan@teacher.tiarkhali.edu.bd | teacher123 | Mathematics |
| Fatima Akter | fatima.akter@teacher.tiarkhali.edu.bd | teacher123 | English Literature |
| Md. Kamal Uddin | kamal.uddin@teacher.tiarkhali.edu.bd | teacher123 | Physics |

---

## 👨‍💼 Staff Accounts (2)

| Name | Email | Password | Position |
|------|-------|----------|----------|
| Habibur Rahman | habibur.rahman@staff.tiarkhali.edu.bd | staff123 | Office Manager |
| Ayesha Khatun | ayesha.khatun@staff.tiarkhali.edu.bd | staff123 | Librarian |

---

## 📊 Total: 11 Users

- **1** Admin
- **4** Students
- **3** Teachers
- **2** Staff

---

## 🎯 Quick Test Scenarios

### Scenario 1: Student Messaging
1. **Browser A**: Login as **Tajul** (tajulislam67637@gmail.com / 111111)
2. **Browser B**: Login as **Nusrat** (nusrat.jahan@student.tiarkhali.edu.bd / student123)
3. Send messages between them

### Scenario 2: Teacher-Student Communication
1. **Browser A**: Login as **Dr. Abdullah** (abdullah.khan@teacher.tiarkhali.edu.bd / teacher123)
2. **Browser B**: Login as **Rakib** (rakib.hasan@student.tiarkhali.edu.bd / student123)
3. Test messaging and profile viewing

### Scenario 3: Admin Management
1. Login as **Admin** (admin@tiarkhali-mmhs.edu.bd / admin123)
2. Go to Admin Panel
3. View all users, notices, and system data

---

## 💡 Pro Tips

- All emails follow pattern: `name@role.tiarkhali.edu.bd`
- Default passwords: admin123, student123, teacher123, staff123
- Tajul's password is special: 111111 (original test account)
- All accounts are **active** and ready to use

---

## 🚀 Start Testing

```bash
# Windows
START_BOTH.bat

# Or manually
npm run server:watch
npm run dev
```

Then login with any account above!

---

*Created: July 30, 2026*
