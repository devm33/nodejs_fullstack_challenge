
const MS_IN_YEAR = 31536000000;

/** Returns a yyyy-mm-dd formatted birth date for the given age as of today. */
export function dateForAge(age: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - age);
  return date.toISOString().split('T')[0];
}

/** Returns the number of years since the supplied date in yyyy-mm-dd format. */
export function yearsSince(date: string): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / MS_IN_YEAR);
}