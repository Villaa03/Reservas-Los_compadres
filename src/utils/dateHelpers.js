/**
 * Helper utilities for managing dates in the reservation system.
 */

// Array containing Spanish names of the days of the week
const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Array containing Spanish names of the months
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

/**
 * Returns whether a given Date object corresponds to a Tuesday.
 * Tuesdays are closed (no service).
 * @param {Date} date 
 * @returns {boolean}
 */
export const isTuesday = (date) => {
  return date.getDay() === 2; // 0 = Sunday, 1 = Monday, 2 = Tuesday...
};

/**
 * Formats a Date object to a human-readable Spanish string.
 * Example: "Viernes, 5 de Junio"
 * @param {Date} date 
 * @returns {string}
 */
export const formatDateSpanish = (date) => {
  const dayName = DAYS_OF_WEEK[date.getDay()];
  const dayNum = date.getDate();
  const monthName = MONTHS[date.getMonth()];
  return `${dayName}, ${dayNum} de ${monthName}`;
};

/**
 * Formats a Date object to YYYY-MM-DD for storage / state.
 * @param {Date} date 
 * @returns {string}
 */
export const formatDateISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Generates an array of available dates for the next N days.
 * Excludes Tuesdays (since the restaurant is closed on Tuesdays).
 * Handles the timezone correctly for local date generation.
 * @param {number} daysCount Number of days to generate from today
 * @returns {Array<{date: Date, isoString: string, formatted: string, label: string, isToday: boolean, isTomorrow: boolean}>}
 */
export const getAvailableDates = (daysCount = 30) => {
  const dates = [];
  const today = new Date();
  
  // Normalize today to start of day to avoid time discrepancies
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < daysCount; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);

    // Skip Tuesdays
    if (isTuesday(nextDate)) {
      continue;
    }

    const isoString = formatDateISO(nextDate);
    const formatted = formatDateSpanish(nextDate);
    
    let label = "";
    if (i === 0) {
      label = "Hoy";
    } else if (i === 1) {
      label = "Mañana";
    } else {
      label = DAYS_OF_WEEK[nextDate.getDay()];
    }

    dates.push({
      date: nextDate,
      isoString,
      formatted,
      label,
      dayNum: nextDate.getDate(),
      monthName: MONTHS[nextDate.getMonth()].substring(0, 3), // e.g. "Jun"
      isToday: i === 0,
      isTomorrow: i === 1
    });
  }

  return dates;
};

/**
 * Formats a date string back to Spanish label.
 * @param {string} isoString YYYY-MM-DD
 * @returns {string}
 */
export const formatIsoToSpanish = (isoString) => {
  if (!isoString) return "";
  const [year, month, day] = isoString.split('-').map(Number);
  // Create date in local timezone to avoid off-by-one errors
  const date = new Date(year, month - 1, day);
  return formatDateSpanish(date);
};
