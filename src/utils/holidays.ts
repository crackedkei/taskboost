import { format, getYear, getMonth, getDay } from 'date-fns';

// 春分・秋分の日付を計算（1949年以降の計算式）
const calculateEquinox = (year: number, isSpring: boolean): number => {
  if (isSpring) {
    if (year <= 2099) return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
    if (year <= 2150) return Math.floor(21.851 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  } else {
    if (year <= 2099) return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
    if (year <= 2150) return Math.floor(24.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  }
  return isSpring ? 21 : 23; // デフォルト値
};

// ハッピーマンデー（成人の日、海の日、敬老の日、スポーツの日）の日付を計算
const calculateHappyMonday = (year: number, month: number, weekNumber: number): number => {
  let date = 1;
  let count = 0;
  while (count < weekNumber) {
    const day = new Date(year, month - 1, date).getDay();
    if (day === 1) count++;
    if (count < weekNumber) date++;
  }
  return date;
};

// 指定された日付が祝日かどうかを判定（再帰を避けるため、振替休日と国民の休日は別関数で処理）
const isBasicHoliday = (date: Date): boolean => {
  const year = getYear(date);
  const month = getMonth(date) + 1;
  const day = date.getDate();

  // 固定祝日
  const fixedHolidays: Record<string, string> = {
    '1-1': '元日',
    '2-11': '建国記念の日',
    '2-23': '天皇誕生日',
    '4-29': '昭和の日',
    '5-3': '憲法記念日',
    '5-4': 'みどりの日',
    '5-5': 'こどもの日',
    '8-11': '山の日',
    '11-3': '文化の日',
    '11-23': '勤労感謝の日'
  };

  // 固定祝日のチェック
  const dateKey = `${month}-${day}`;
  if (dateKey in fixedHolidays) return true;

  // ハッピーマンデーのチェック
  if (
    (month === 1 && day === calculateHappyMonday(year, 1, 2)) || // 成人の日
    (month === 7 && day === calculateHappyMonday(year, 7, 3)) || // 海の日
    (month === 9 && day === calculateHappyMonday(year, 9, 3)) || // 敬老の日
    (month === 10 && day === calculateHappyMonday(year, 10, 2))  // スポーツの日
  ) return true;

  // 春分・秋分の日のチェック
  if ((month === 3 && day === calculateEquinox(year, true)) ||
      (month === 9 && day === calculateEquinox(year, false))) {
    return true;
  }

  return false;
};

// 振替休日と国民の休日を含めて祝日判定
export const isHoliday = (date: Date): boolean => {
  const weekDay = getDay(date);

  // まず基本の祝日をチェック
  if (isBasicHoliday(date)) return true;

  // 振替休日のチェック
  if (weekDay === 1) {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    if (isBasicHoliday(prevDate)) return true;
  }

  // 国民の休日のチェック（祝日と祝日に挟まれた平日）
  if (weekDay !== 0) {
    const prevDate = new Date(date);
    const nextDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    nextDate.setDate(nextDate.getDate() + 1);
    if (isBasicHoliday(prevDate) && isBasicHoliday(nextDate)) return true;
  }

  return false;
};

// 祝日名を取得
export const getHolidayName = (date: Date): string | undefined => {
  const year = getYear(date);
  const month = getMonth(date) + 1;
  const day = date.getDate();
  const weekDay = getDay(date);

  const fixedHolidays: Record<string, string> = {
    '1-1': '元日',
    '2-11': '建国記念の日',
    '2-23': '天皇誕生日',
    '4-29': '昭和の日',
    '5-3': '憲法記念日',
    '5-4': 'みどりの日',
    '5-5': 'こどもの日',
    '8-11': '山の日',
    '11-3': '文化の日',
    '11-23': '勤労感謝の日'
  };

  const dateKey = `${month}-${day}`;
  if (dateKey in fixedHolidays) return fixedHolidays[dateKey];

  // ハッピーマンデー
  if (month === 1 && day === calculateHappyMonday(year, 1, 2)) return '成人の日';
  if (month === 7 && day === calculateHappyMonday(year, 7, 3)) return '海の日';
  if (month === 9 && day === calculateHappyMonday(year, 9, 3)) return '敬老の日';
  if (month === 10 && day === calculateHappyMonday(year, 10, 2)) return 'スポーツの日';

  // 春分・秋分の日
  if (month === 3 && day === calculateEquinox(year, true)) return '春分の日';
  if (month === 9 && day === calculateEquinox(year, false)) return '秋分の日';

  // 振替休日
  if (weekDay === 1) {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    if (isBasicHoliday(prevDate)) return '振替休日';
  }

  // 国民の休日
  if (weekDay !== 0) {
    const prevDate = new Date(date);
    const nextDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    nextDate.setDate(nextDate.getDate() + 1);
    if (isBasicHoliday(prevDate) && isBasicHoliday(nextDate)) return '国民の休日';
  }

  return undefined;
};