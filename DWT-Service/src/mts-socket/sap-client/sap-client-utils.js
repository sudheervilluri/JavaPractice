import SAPClientConstants from './sap-client-constants';

/**
 * This method determines if a year is a leap year.
 *
 * @param {*} year : The year of scheduler current date time.
 * @returns the number of days in February.
 */

function daysInFeb(year) {
  //  check if the year is a leap year
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    // Leap year
    return SAPClientConstants.LEAP_YEAR;
  }
  // Not a leap year
  return SAPClientConstants.IS_NOT_LEAP_YEAR;
}

/**
 * Function to convert the day of the year in sched current date time to
 * month.
 *
 * @param {*} month : The month of scheduler current date time in number.
 * @param {*} year : The year of scheduler current date time in number.
 * @returns the month of the sched current date time.
 */

function dayOfTheYearToMonth(month, year) {
  const numberOfDaysInFeb = daysInFeb(year);
  const monthsInNumbers = [
    { numberOfDays: 31, month: 'Jan' },
    { numberOfDays: 31 + numberOfDaysInFeb, month: 'Feb' },
    { numberOfDays: 31 + numberOfDaysInFeb + 31, month: 'Mar' },
    { numberOfDays: 31 + numberOfDaysInFeb + 61, month: 'Apr' },
    { numberOfDays: 31 + numberOfDaysInFeb + 92, month: 'May' },
    { numberOfDays: 31 + numberOfDaysInFeb + 122, month: 'Jun' },
    { numberOfDays: 31 + numberOfDaysInFeb + 153, month: 'Jul' },
    { numberOfDays: 31 + numberOfDaysInFeb + 184, month: 'Aug' },
    { numberOfDays: 31 + numberOfDaysInFeb + 214, month: 'Sep' },
    { numberOfDays: 31 + numberOfDaysInFeb + 245, month: 'Oct' },
    { numberOfDays: 31 + numberOfDaysInFeb + 275, month: 'Nov' },
    { numberOfDays: 31 + numberOfDaysInFeb + 306, month: 'Dec' }
  ];
  const monthOfCurrentSchedulerDateConversion = monthsInNumbers.find(
    item => item.numberOfDays > month
  );
  return monthOfCurrentSchedulerDateConversion.month;
}

const sapClientUtilities = {
  daysInFeb,
  dayOfTheYearToMonth
};

export default sapClientUtilities;
