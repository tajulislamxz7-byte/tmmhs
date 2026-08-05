// ================================================
// CUSTOM TRANSLATION SYSTEM
// ================================================

const translations = {
  // Navigation
  'Home': 'হোম',
  'About': 'সম্পর্কে',
  'Students': 'শিক্ষার্থী',
  'Teachers': 'শিক্ষক',
  'Staff': 'কর্মচারী',
  'Batches': 'ব্যাচ',
  'Results': 'ফলাফল',
  'Academic': 'একাডেমিক',
  'Notices': 'নোটিশ',
  'Events': 'ইভেন্ট',
  'Gallery': 'গ্যালারি',
  'Admission': 'ভর্তি',
  'Contact': 'যোগাযোগ',
  'Login': 'লগইন',
  'Logout': 'লগআউট',
  'Register': 'রেজিস্টার',
  'Dashboard': 'ড্যাশবোর্ড',
  'Profile': 'প্রোফাইল',
  'Messages': 'বার্তা',
  'Notifications': 'বিজ্ঞপ্তি',
  'Settings': 'সেটিংস',
  'Admin': 'অ্যাডমিন',
  
  // Common words
  'Search': 'অনুসন্ধান',
  'View': 'দেখুন',
  'Edit': 'সম্পাদনা',
  'Delete': 'মুছুন',
  'Save': 'সংরক্ষণ',
  'Cancel': 'বাতিল',
  'Submit': 'জমা দিন',
  'Close': 'বন্ধ করুন',
  'Back': 'ফিরে যান',
  'Next': 'পরবর্তী',
  'Previous': 'পূর্ববর্তী',
  'Name': 'নাম',
  'Email': 'ইমেইল',
  'Phone': 'ফোন',
  'Address': 'ঠিকানা',
  'Date': 'তারিখ',
  'Time': 'সময়',
  'Class': 'শ্রেণী',
  'Section': 'শাখা',
  'Roll': 'রোল',
  'Subject': 'বিষয়',
  'Marks': 'নম্বর',
  'Grade': 'গ্রেড',
  'Attendance': 'উপস্থিতি',
  'Year': 'বছর',
  'Month': 'মাস',
  'Day': 'দিন',
  
  // School specific
  'Tiarkhali M.M High School and College': 'টিয়ারখালী মাজিদ মেমোরিয়াল স্কুল এন্ড কলেজ',
  'Tiarkhali': 'টিয়ারখালী',
  'Bangladesh': 'বাংলাদেশ',
  'TMMHS': 'টিএমএমএইচএস',
  'Principal': 'অধ্যক্ষ',
  'Vice Principal': 'উপাধ্যক্ষ',
  'Headmaster': 'প্রধান শিক্ষক',
  'Class Teacher': 'শ্রেণী শিক্ষক',
  'Subject Teacher': 'বিষয় শিক্ষক',
  'Librarian': 'গ্রন্থাগারিক',
  'Accountant': 'হিসাবরক্ষক',
  'Office Assistant': 'অফিস সহায়ক',
  'Lab Assistant': 'ল্যাব সহকারী',
  
  // Academic
  'Class Routine': 'ক্লাস রুটিন',
  'Exam Routine': 'পরীক্ষা রুটিন',
  'Syllabus': 'পাঠ্যসূচি',
  'Academic Calendar': 'একাডেমিক ক্যালেন্ডার',
  'Holiday Calendar': 'ছুটির ক্যালেন্ডার',
  'Homework': 'বাড়ির কাজ',
  'Assignment': 'অ্যাসাইনমেন্ট',
  'Exam': 'পরীক্ষা',
  'Result': 'ফলাফল',
  
  // Subjects
  'Bengali': 'বাংলা',
  'English': 'ইংরেজি',
  'Mathematics': 'গণিত',
  'Science': 'বিজ্ঞান',
  'Physics': 'পদার্থবিজ্ঞান',
  'Chemistry': 'রসায়ন',
  'Biology': 'জীববিজ্ঞান',
  'History': 'ইতিহাস',
  'Geography': 'ভূগোল',
  'ICT': 'আইসিটি',
  'Religion': 'ধর্ম',
  
  // Days
  'Monday': 'সোমবার',
  'Tuesday': 'মঙ্গলবার',
  'Wednesday': 'বুধবার',
  'Thursday': 'বৃহস্পতিবার',
  'Friday': 'শুক্রবার',
  'Saturday': 'শনিবার',
  'Sunday': 'রবিবার',
  
  // Months
  'January': 'জানুয়ারি',
  'February': 'ফেব্রুয়ারি',
  'March': 'মার্চ',
  'April': 'এপ্রিল',
  'May': 'মে',
  'June': 'জুন',
  'July': 'জুলাই',
  'August': 'আগস্ট',
  'September': 'সেপ্টেম্বর',
  'October': 'অক্টোবর',
  'November': 'নভেম্বর',
  'December': 'ডিসেম্বর'
};

let currentLang = 'en';

// Get translation
export function t(key) {
  if (currentLang === 'bn' && translations[key]) {
    return translations[key];
  }
  return key;
}

// Set language
export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  // Update all translatable elements
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.dataset.translate;
    element.textContent = t(key);
  });
  
  // Dispatch event for components to re-render
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// Get current language
export function getCurrentLanguage() {
  return currentLang;
}

// Initialize language from storage
export function initLanguage() {
  const saved = localStorage.getItem('language') || 'en';
  currentLang = saved;
  return saved;
}
