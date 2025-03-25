import { dayjs } from '@/lib/dayjs';

type TimeDifferenceType = 'hour' | 'hour-decimal' | 'minute' | 'second';

/**
 * Calculate the time difference between two time strings.
 *
 * @param {string} time1 - The first time string in the format 'HH:mm:ss'.
 * @param {string} time2 - The second time string in the format 'HH:mm:ss'.
 * @param {TimeDifferenceType} [type='minute'] - The type of time difference to calculate ('hour', 'hour-decimal', 'minute', or 'second').
 * @returns {number} The absolute time difference in the specified type.
 */
export function timeDiff(
  time1: string,
  time2: string,
  type: TimeDifferenceType = 'minute'
): number {
  // Extract hours, minutes, and seconds from the time strings and convert them to numbers
  const [hours1, minutes1, seconds1] = time1.split(':').map(Number);
  const [hours2, minutes2, seconds2] = time2.split(':').map(Number);

  // Calculate total minutes for each time (ignoring the seconds part)
  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;

  // Calculate total seconds for each time (including the minutes and seconds parts)
  const totalSeconds1 = totalMinutes1 * 60 + seconds1;
  const totalSeconds2 = totalMinutes2 * 60 + seconds2;

  const decimalHours1 = hours1 + (minutes1 < 30 ? 0 : 30) / 60 + seconds1 / 3600;
  const decimalHours2 = hours2 + (minutes2 < 30 ? 0 : 30) / 60 + seconds2 / 3600;

  // Calculate the difference based on the provided type parameter
  switch (type) {
    case 'hour':
      // Return the absolute difference in hours
      return Math.abs(hours1 - hours2);
    case 'hour-decimal':
      // Return the absolute difference in hours as decimal
      return Math.abs(decimalHours1 - decimalHours2);
    case 'minute':
      // Return the absolute difference in minutes
      return Math.abs(totalMinutes1 - totalMinutes2);
    case 'second':
      // Return the absolute difference in seconds
      return Math.abs(totalSeconds1 - totalSeconds2);
    default:
      // If an invalid type is provided, return 0
      return 0;
  }
}

/**
 * Convert a 24-hour time string to a number representation, with an option to treat half an hour as 0.5.
 *
 * @param {string} time - The 24-hour time string in the format 'HH:mm:ss'.
 * @param {boolean} [decimal=false] - If true, treat half an hour as 0.5; otherwise, count it as a whole number.
 * @returns {number} The time represented as a number with half an hour optionally counted as 0.5.
 */
export function hourNumber(time: string, decimal: boolean = false): number {
  const parsedTime = dayjs(time, 'HH:mm:ss');
  const hour = parsedTime.hour();
  const minute = parsedTime.minute();

  // Calculate the total hour
  let totalHour = hour;

  if (decimal) {
    // If half-hour should be counted as 0.5, adjust the totalHour accordingly
    totalHour += minute === 30 ? 0.5 : 0;
  } else {
    // If half-hour should be treated as a whole number, adjust the totalHour accordingly
    totalHour += minute >= 30 ? 1 : 0;
  }

  return totalHour;
}
