import { ad2bs } from "ad-bs-converter";

const NEPALI_MONTHS_EN = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashoj",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

const NEPALI_MONTHS_NE = [
  "बैशाख",
  "जेठ",
  "असार",
  "श्रावण",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पौष",
  "माघ",
  "फाल्गुण",
  "चैत",
];

function toADString(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export function toBS(date, { locale = "en", format = "short" } = {}) {
  const adString = toADString(date);
  if (!adString) return null;

  try {
    const result = ad2bs(adString);
    const bsYear = result.en.year;
    const bsMonth = result.en.month;
    const bsDay = result.en.day;
    const monthName = locale === "ne" ? result.ne.strMonth : result.en.strMonth;

    if (format === "short") {
      return locale === "ne"
        ? `${result.ne.strShortMonth} ${bsDay}, ${bsYear}`
        : `${monthName} ${bsDay}, ${bsYear}`;
    }

    if (format === "full") {
      return locale === "ne"
        ? `${result.ne.strMonth} ${bsDay}, ${bsYear} बि.सं.`
        : `${monthName} ${bsDay}, ${bsYear} BS`;
    }

    if (format === "number") {
      return `${bsYear}/${String(bsMonth).padStart(2, "0")}/${String(bsDay).padStart(2, "0")}`;
    }

    return `${monthName} ${bsDay}, ${bsYear}`;
  } catch (error) {
    console.error("Failed to convert to BS:", error, date);
    return null;
  }
}

export function getBSMonthName(date) {
  const adString = toADString(date);
  if (!adString) return null;

  try {
    const result = ad2bs(adString);
    return result.en.strMonth;
  } catch (error) {
    return null;
  }
}

export function getBSDayOfWeek(date) {
  const adString = toADString(date);
  if (!adString) return null;

  try {
    const result = ad2bs(adString);
    return result.en.strShortDayOfWeek || result.en.strDayOfWeek;
  } catch (error) {
    return null;
  }
}

export function formatNepaliDate(date, options = {}) {
  const { locale = "en", format = "short" } = options;
  const bsDate = toBS(date, { locale, format });
  if (!bsDate) {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString();
  }
  return bsDate;
}

export { NEPALI_MONTHS_EN, NEPALI_MONTHS_NE };
