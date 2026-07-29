// ===================================================
// TIARKHALI M.M HIGH SCHOOL AND COLLEGE — DATA
// ===================================================

export const schoolInfo = {
  name: "Tiarkhali M.M High School and College",
  tagline: "Nurturing Excellence, Inspiring Futures",
  founded: 1985,
  address: "Tiarkhali, Bangladesh",
  phone: "+880 1711-234567",
  email: "info@tiarkhali-mmhs.edu.bd",
  website: "www.tiarkhali-mmhs.edu.bd",
  totalStudents: 0,
  totalTeachers: 0,
  totalAlumni: 0,
  totalBatches: 0,
  principalName: "Principal Name",
  principalMessage: "At Tiarkhali M.M High School and College, we believe every student carries within them an extraordinary potential. Our mission is to unlock that potential through quality education, compassionate mentorship, and a vibrant community.",
  achievements: [],
  facilities: ["Science Lab", "Library", "Computer Lab", "Sports Ground"],
};

export const stats = [
  { label: "Students", value: 0, svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', color: "#2563eb" },
  { label: "Teachers", value: 0, svg: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>', color: "#7c3aed" },
  { label: "Alumni", value: 0, svg: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', color: "#059669" },
  { label: "Years of Excellence", value: 39, svg: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>', color: "#d97706" },
  { label: "Batches", value: 0, svg: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>', color: "#dc2626" },
  { label: "Pass Rate", value: "—", svg: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', color: "#0891b2" },
];

export const batches = [];

export const classes = [
  { id: "C6",  name: "Class 6",  sections: ["A", "B", "C"],      subjects: ["Bangla", "English", "Mathematics", "Science", "Social Studies", "Religion"] },
  { id: "C7",  name: "Class 7",  sections: ["A", "B", "C"],      subjects: ["Bangla", "English", "Mathematics", "Science", "Social Studies", "Religion", "ICT"] },
  { id: "C8",  name: "Class 8",  sections: ["A", "B", "C"],      subjects: ["Bangla", "English", "Mathematics", "Science", "Social Studies", "Religion", "ICT"] },
  { id: "C9",  name: "Class 9",  sections: ["A", "B", "C", "D"], subjects: ["Bangla", "English", "Physics", "Chemistry", "Biology", "Mathematics", "ICT", "Religion"] },
  { id: "C10", name: "Class 10", sections: ["A", "B", "C", "D"], subjects: ["Bangla", "English", "Physics", "Chemistry", "Biology", "Mathematics", "ICT", "Religion"] },
];

export const students = [];

export const teachers = [];

export const supportStaff = [];

export const alumni = [];

export const notices = [];

export const events = [];

export const gallery = [];

export const results = [];

export const testimonials = [];

export const roles = {
  guest:       { label: "Guest",         permissions: ["view_home", "view_notices", "view_events", "view_gallery"] },
  student:     { label: "Student",       permissions: ["view_home", "view_notices", "view_events", "view_gallery", "view_profile", "edit_profile", "view_results", "download_marksheet", "view_attendance", "view_assignments", "send_messages"] },
  teacher:     { label: "Teacher",       permissions: ["view_home", "view_notices", "view_events", "view_gallery", "view_teacher_profile", "edit_teacher_profile", "upload_notes", "upload_assignments", "take_attendance", "publish_results", "publish_notices", "reply_messages"] },
  admin:       { label: "Admin",         permissions: ["all"] },
  superAdmin:  { label: "Super Admin",   permissions: ["all", "manage_settings", "manage_roles"] },
  alumni:      { label: "Alumni",        permissions: ["view_home", "view_notices", "view_events", "view_gallery", "view_alumni_profile", "edit_alumni_profile"] },
  supportStaff:{ label: "Support Staff", permissions: ["view_home", "view_notices"] },
};
