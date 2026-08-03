// ===================================================
// TIARKHALI M.M HIGH SCHOOL AND COLLEGE — CONFIG
// Static fallback data. Live data comes from /data/*.json via API.
// Batches and classes are editable from Admin -> Settings.
// ===================================================

// School info — fallback only (overridden by settings.json via API)
export const schoolInfo = {
  name: "Tiarkhali M.M High School and College",
  tagline: "Nurturing Excellence, Inspiring Futures",
  founded: 1999,
  address: "Tiarkhali, Bangladesh",
  phone: "+880 1711-234567",
  email: "info@tiarkhali-mmhs.edu.bd",
  website: "www.tiarkhali-mmhs.edu.bd",
  totalStudents: 0,
  totalTeachers: 0,
  principalName: "",
  principalMessage: "",
  achievements: [],
  facilities: ["Science Lab", "Library", "Computer Lab", "Sports Ground"],
};

// Hero stats — values updated at runtime from live API data
export const stats = [
  { label: "Students",            value: 0,                                  svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', color: "#2563eb" },
  { label: "Teachers",            value: 0,                                  svg: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>', color: "#7c3aed" },
  { label: "Years of Excellence", value: new Date().getFullYear() - 1999,   svg: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>', color: "#d97706" },
  { label: "Batches",             value: 0,                                  svg: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>', color: "#dc2626" },
  { label: "Pass Rate",           value: "-",                                svg: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', color: "#0891b2" },
];

// ── Dynamic helpers — read from settings if available, fall back to defaults ──
function _getSettings() {
  try { return JSON.parse(localStorage.getItem('gfa_settings') || '{}'); } catch { return {}; }
}

// Batch list — editable from Admin -> Settings -> Batches Config
// Returns live data from settings, falls back to defaults
function _defaultBatches() {
  return [
    { id: "B2026", name: "Batch 2026", year: "2026", class: "Class 10" },
    { id: "B2027", name: "Batch 2027", year: "2027", class: "Class 9" },
    { id: "B2028", name: "Batch 2028", year: "2028", class: "Class 8" },
    { id: "B2029", name: "Batch 2029", year: "2029", class: "Class 7" },
    { id: "B2030", name: "Batch 2030", year: "2030", class: "Class 6" },
  ];
}

function _defaultClasses() {
  return [
    { id: "C6",  name: "Class 6",  sections: ["A", "B", "C"],      subjects: ["Bangla", "English", "Mathematics", "Science", "Social Studies", "Religion"] },
    { id: "C7",  name: "Class 7",  sections: ["A", "B", "C"],      subjects: ["Bangla", "English", "Mathematics", "Science", "Social Studies", "Religion", "ICT"] },
    { id: "C8",  name: "Class 8",  sections: ["A", "B", "C"],      subjects: ["Bangla", "English", "Mathematics", "Science", "Social Studies", "Religion", "ICT"] },
    { id: "C9",  name: "Class 9",  sections: ["A", "B", "C", "D"], subjects: ["Bangla", "English", "Physics", "Chemistry", "Biology", "Mathematics", "ICT", "Religion"] },
    { id: "C10", name: "Class 10", sections: ["A", "B", "C", "D"], subjects: ["Bangla", "English", "Physics", "Chemistry", "Biology", "Mathematics", "ICT", "Religion"] },
  ];
}

// batches — used in dropdowns. Reads from settings if admin has configured them.
export const batches = (() => {
  const s = _getSettings();
  if (s.batchConfig && s.batchConfig.length > 0) {
    return s.batchConfig.map(b => ({ id: b.id || ('B' + b.year), name: b.name, year: b.year, class: b.class }));
  }
  return _defaultBatches();
})();

// classes — used in dropdowns. Reads from settings if admin has configured them.
export const classes = (() => {
  const s = _getSettings();
  if (s.classConfig && s.classConfig.length > 0) {
    return s.classConfig.map((c, i) => ({
      id: 'C' + (i + 6),
      name: c.name,
      sections: (c.sections || '').split(',').map(x => x.trim()).filter(Boolean),
      subjects: (c.subjects || '').split(',').map(x => x.trim()).filter(Boolean),
    }));
  }
  return _defaultClasses();
})();

// Empty exports kept for backward compatibility
export const students    = [];
export const teachers    = [];
export const supportStaff = [];
export const notices     = [];
export const events      = [];
export const gallery     = [];
export const results     = [];
