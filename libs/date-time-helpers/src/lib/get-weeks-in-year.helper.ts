import { Maybe } from "@fretve/global-types";

/**
 * Get the number of weeks for a specified year
 * @param year - 
 */
export function _getWeeksInYear(year: Maybe<number>): number{
  if(!year) year = new Date().getFullYear();
  let d = new Date(year, 0, 1);
  let isLeap = new Date(year, 1, 29).getMonth() === 1;

  //check for a Jan 1 that's a Thursday or a leap year that has a 
  //Wednesday jan 1. Otherwise it's 52
  return d.getDay() === 4 || isLeap && d.getDay() === 3 ? 53 : 52
}