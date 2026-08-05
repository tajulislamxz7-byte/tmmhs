// ================================================
// DATE UTILITIES - Bangla & English Date
// ================================================

// Bangla month names (correct spelling)
const banglaMonths = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
  'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

// Bangla day names (correct spelling)
const banglaDays = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

// English to Bangla month mapping (approximate conversion)
const monthToBangla = [
  { start: { month: 3, day: 14 }, banglaMonth: 0 },  // Apr 14 = Boishakh 1
  { start: { month: 4, day: 15 }, banglaMonth: 1 },  // May 15 = Jyoishtho 1
  { start: { month: 5, day: 15 }, banglaMonth: 2 },  // Jun 15 = Asharh 1
  { start: { month: 6, day: 16 }, banglaMonth: 3 },  // Jul 16 = Srabon 1
  { start: { month: 7, day: 16 }, banglaMonth: 4 },  // Aug 16 = Bhadro 1
  { start: { month: 8, day: 16 }, banglaMonth: 5 },  // Sep 16 = Ashwin 1
  { start: { month: 9, day: 16 }, banglaMonth: 6 },  // Oct 16 = Kartik 1
  { start: { month: 10, day: 15 }, banglaMonth: 7 }, // Nov 15 = Ogrohayon 1
  { start: { month: 11, day: 15 }, banglaMonth: 8 }, // Dec 15 = Poush 1
  { start: { month: 0, day: 14 }, banglaMonth: 9 },  // Jan 14 = Magh 1
  { start: { month: 1, day: 13 }, banglaMonth: 10 }, // Feb 13 = Falgun 1
  { start: { month: 2, day: 14 }, banglaMonth: 11 }  // Mar 14 = Choitro 1
];

// Convert English digits to Bangla digits
function toBanglaDigits(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).split('').map(d => banglaDigits[parseInt(d)] || d).join('');
}

// Calculate accurate Bangla date
export function getBanglaDate() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  
  // Calculate Bangla year (starts from 593/594 AD)
  let banglaYear = year - 593;
  
  // Find which Bangla month we're in
  let banglaMonth = 0;
  let banglaDate = 1;
  
  // Check each month transition
  for (let i = 0; i < monthToBangla.length; i++) {
    const transition = monthToBangla[i];
    const nextTransition = monthToBangla[(i + 1) % 12];
    
    if (month === transition.start.month && date >= transition.start.day) {
      banglaMonth = transition.banglaMonth;
      banglaDate = date - transition.start.day + 1;
      break;
    } else if (month === transition.start.month && date < transition.start.day) {
      // We're in the previous Bangla month
      const prevIdx = (i - 1 + 12) % 12;
      banglaMonth = monthToBangla[prevIdx].banglaMonth;
      // Calculate days from previous month start
      const prevTransition = monthToBangla[prevIdx];
      const daysInPrevEnglishMonth = new Date(year, month, 0).getDate();
      banglaDate = date + (daysInPrevEnglishMonth - prevTransition.start.day + 1);
      break;
    }
  }
  
  // Adjust year if we're before Boishakh
  if (month < 3 || (month === 3 && date < 14)) {
    banglaYear--;
  }
  
  const banglaDay = banglaDays[dayOfWeek];
  const banglaMonthName = banglaMonths[banglaMonth];
  
  return `${toBanglaDigits(banglaDate)} ${banglaMonthName} ${toBanglaDigits(banglaYear)}, ${banglaDay}`;
}

// Get English date formatted
export function getEnglishDate() {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const year = now.getFullYear();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  
  return `${day} ${month} ${year}, ${weekday}`;
}

// Update date displays
export function updateDateDisplays() {
  const banglaDateEl = document.getElementById('banglaDate');
  const englishDateEl = document.getElementById('englishDate');
  
  if (banglaDateEl) {
    banglaDateEl.textContent = getBanglaDate();
  }
  
  if (englishDateEl) {
    englishDateEl.textContent = getEnglishDate();
  }
}
