import ScheduleOccurrenceUtilsConstants from './schedule-occurrence-utils-constants';

const getScheduleNextOccurrenceForDaily = (schedule, schedCurrentDate) => {
  const { baseDate } = schedule.baseInfo.dateAndTime;
  const startDate = new Date(baseDate);
  const currentDate = new Date(schedCurrentDate);

  let boolFound = false;
  let nextOccurrence;
  let dtmDayCheck;

  while (boolFound !== true) {
    // keep on adding everyNdays to the startDate untill we find the correct date
    startDate.setDate(startDate.getDate() + parseInt(schedule.dailyInfo.everyNDays, 10));
    dtmDayCheck = startDate;
    if (currentDate <= dtmDayCheck) {
      boolFound = true;
      nextOccurrence = dtmDayCheck;
      break;
    }
  }
  return nextOccurrence;
};

const checkWeeklySchedule = (dtmDayCheck, weeklyFlags) => {
  return weeklyFlags.find(
    weekday =>
      weekday.name === ScheduleOccurrenceUtilsConstants.DAYS_OF_WEEK[dtmDayCheck.getDay()] &&
      weekday.isSelected === '1'
  );
};

const getScheduleNextOccurrenceForWeekly = (schedule, schedCurrentDate) => {
  const { baseDate } = schedule.baseInfo.dateAndTime;
  const startDate = new Date(baseDate);
  const currentDate = new Date(schedCurrentDate);

  let nextOccurrence = startDate;

  let dtmDayCheck = nextOccurrence;

  // we check for until the next 2 years
  const dtmLastCheck = new Date(schedCurrentDate.setFullYear(currentDate.getFullYear() + 2));

  const dtmStartDate = dtmDayCheck;

  let boolQuit = false;
  let boolFound = false;

  while (boolFound !== true && boolQuit !== true) {
    for (let i = 0; i < 7; i += 1) {
      const flag = checkWeeklySchedule(dtmDayCheck, schedule.weeklyInfo.runWeekDays);
      if (flag !== undefined && currentDate <= dtmDayCheck) {
        // we have found our nextOccurrence if the date is on or after scheduler current date
        // and day of week matches schedule settings
        boolFound = true;
        nextOccurrence = dtmDayCheck;
        break;
      }
      dtmStartDate.setDate(dtmStartDate.getDate() + 1);
      dtmDayCheck = dtmStartDate;
    }

    // check in case nextOccurrence is on last day of week
    const flag = checkWeeklySchedule(dtmDayCheck, schedule.weeklyInfo.runWeekDays);
    if (flag !== undefined && currentDate <= dtmDayCheck) {
      // we have found our nextOccurrence if the date is on or after scheduler current date
      // and day of week matches schedule settings
      boolFound = true;
      nextOccurrence = dtmDayCheck;
      break;
    }

    if (currentDate > dtmDayCheck) {
      // date not found in this week so we proceed to check in next possible week based
      // on value of everyNWeeks.
      dtmStartDate.setDate(
        dtmStartDate.getDate() +
          (parseInt(schedule.weeklyInfo.everyNWeeks, 10) - 1) *
            ScheduleOccurrenceUtilsConstants.DAYS_IN_WEEK
      );
      dtmDayCheck = dtmStartDate;
      boolFound = false;
    } else if (dtmLastCheck < dtmDayCheck) {
      // we have reached our limit date and still not found a date so we quit.
      boolQuit = true;
    } else {
      dtmStartDate.setDate(
        dtmStartDate.getDate() +
          (parseInt(schedule.weeklyInfo.everyNWeeks, 10) - 1) *
            ScheduleOccurrenceUtilsConstants.DAYS_IN_WEEK
      );
      dtmDayCheck = dtmStartDate;
    }
  }

  // we could not find a date so return undefined
  if (boolQuit === true) return undefined;

  return nextOccurrence;
};

const checkMonthlySchedule = (dtmDayCheck, monthlyMask) => {
  return monthlyMask.find((month, i) => i === dtmDayCheck.getMonth() && month.isSelected === '1');
};

const checkScheduleEvent = (date, schedMonthly) => {
  let flag = false;
  if (
    schedMonthly.monthlyScheduleEventDay >=
      ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_SUNDAY &&
    schedMonthly.monthlyScheduleEventDay <=
      ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_SATURDAY
  ) {
    flag = date.getDay() === parseInt(schedMonthly.monthlyScheduleEventDay, 10);
  } else if (
    schedMonthly.monthlyScheduleEventDay ===
    ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_WEEKDAY
  ) {
    flag = date.getDay() >= 1 && date.getDay() <= 5;
  } else if (
    schedMonthly.monthlyScheduleEventDay ===
    ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_WEEKEND
  ) {
    flag = date.getDay() === 0 || date.getDay() === 6;
  } else {
    throw new Error('Schedule has Invalid monthly Schedule Event Day');
  }
  return flag;
};

const getScheduleNextOccurrenceForMonthly = (schedule, schedCurrentDate) => {
  const currentDate = new Date(schedCurrentDate);
  const { monthlyInfo } = schedule;

  let nextOccurrence;
  let boolFound = false;

  const currentDateCopy = new Date(currentDate.getTime());

  // we need to start from the dayOfTheMonth Specified in Schedule settings
  currentDateCopy.setDate(parseInt(monthlyInfo.dayOfTheMonth, 10));

  if (
    monthlyInfo.monthlyScheduleType === ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_TYPE_DAY
  ) {
    // start from currentDate and look for the specified day of month
    const dtmStartDate = currentDateCopy;

    for (let i = 0; i < 12; i += 1) {
      const flag = checkMonthlySchedule(dtmStartDate, monthlyInfo.monthMask);
      if (flag !== undefined && currentDate <= dtmStartDate) {
        // we stop at first day which is greater or equal to scheduler current date
        boolFound = true;
        nextOccurrence = dtmStartDate;
        break;
      }
      // move onto next month if nextOccurrence was not found in current month
      dtmStartDate.setMonth(dtmStartDate.getMonth() + 1);
    }
  } else if (
    monthlyInfo.monthlyScheduleType === ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_TYPE_EVENT
  ) {
    for (let i = 0; i < 12; i += 1) {
      const flag = checkMonthlySchedule(currentDateCopy, monthlyInfo.monthMask);

      if (
        flag !== undefined &&
        monthlyInfo.monthlyScheduleEvent ===
          ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_EVENT_LAST
      ) {
        // get the last day of current month
        const lastDayOfMonth = new Date(
          currentDateCopy.getFullYear(),
          currentDateCopy.getMonth() + 1,
          0
        );
        if (
          monthlyInfo.monthlyScheduleEventDay ===
          ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_EVENT_DAY
        ) {
          // if event type is day, we have found our date
          nextOccurrence = lastDayOfMonth;
          boolFound = true;
          break;
        } else {
          // else search for the last day type
          while (lastDayOfMonth >= currentDateCopy) {
            if (checkScheduleEvent(lastDayOfMonth, monthlyInfo)) {
              nextOccurrence = lastDayOfMonth;
              boolFound = true;
              break;
            }
            // decrease the date to continue looking for a date in the current month
            lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);
          }
        }
      } else if (
        flag !== undefined &&
        monthlyInfo.monthlyScheduleEvent >=
          ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_EVENT_FIRST &&
        monthlyInfo.monthlyScheduleEvent <=
          ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_EVENT_FOURTH
      ) {
        if (
          monthlyInfo.monthlyScheduleEventDay ===
          ScheduleOccurrenceUtilsConstants.MONTHLY_SCHEDULE_EVENT_DAY
        ) {
          // get last day of current month
          const lastDayOfCurrentMonth = new Date(
            currentDateCopy.getFullYear(),
            currentDateCopy.getMonth() + 1,
            0
          );
          const dayDiff = lastDayOfCurrentMonth.getDate() - currentDateCopy.getDate();

          if (
            currentDateCopy >= currentDate &&
            dayDiff >= parseInt(monthlyInfo.monthlyScheduleEvent, 10)
          ) {
            // if we can add monthly schedule event date and not overlap to another month we can get the next occurrence
            currentDateCopy.setDate(
              currentDateCopy.getDate() + parseInt(monthlyInfo.monthlyScheduleEvent, 10)
            );
            nextOccurrence = currentDateCopy;
            boolFound = true;
            break;
          }
        } else {
          let count = 0;
          const dtmDayCheck = new Date(currentDateCopy.getTime());
          while (dtmDayCheck.getMonth() === currentDateCopy.getMonth()) {
            // we look for a date as long as we are in the current month
            if (checkScheduleEvent(dtmDayCheck, monthlyInfo)) {
              count += 1;
              if (
                dtmDayCheck >= currentDate &&
                count === parseInt(monthlyInfo.monthlyScheduleEvent, 10) + 1
              ) {
                // if we have reached monthly event we stop as we have found our next occurrence
                boolFound = true;
                nextOccurrence = dtmDayCheck;
                break;
              }
            }
            // move onto the next day of current month
            dtmDayCheck.setDate(dtmDayCheck.getDate() + 1);
          }
        }
      }

      // next occurrence is found so break
      if (boolFound === true) break;

      // next occurrence is not found yet, we need to look further so we move on to next month
      currentDateCopy.setMonth(currentDateCopy.getMonth() + 1);
    }
  } else {
    throw new Error('Invalid Schedule Type, Cannot generate next occurrence');
  }

  // next occurrence is not possible
  if (boolFound === false) return undefined;

  return nextOccurrence;
};

const getScheduleNextOccurrence = (schedule, schedulerCurrentDate) => {
  const { occurrence } = schedule.baseInfo;
  const schedCurrentDate = new Date(schedulerCurrentDate);
  let nextOccurrence;
  if (occurrence === ScheduleOccurrenceUtilsConstants.SCHEDULE_OCCURRENCE_DAILY) {
    nextOccurrence = getScheduleNextOccurrenceForDaily(schedule, schedCurrentDate);
  } else if (occurrence === ScheduleOccurrenceUtilsConstants.SCHEDULE_OCCURRENCE_WEEKLY) {
    nextOccurrence = getScheduleNextOccurrenceForWeekly(schedule, schedCurrentDate);
  } else if (occurrence === ScheduleOccurrenceUtilsConstants.SCHEDULE_OCCURRENCE_MONTHLY) {
    nextOccurrence = getScheduleNextOccurrenceForMonthly(schedule, schedCurrentDate);
  } else {
    throw new Error('Schedule Occurrence is Invalid');
  }

  return nextOccurrence;
};

const scheduleOccurrenceUtils = {
  getScheduleNextOccurrence
};

export default scheduleOccurrenceUtils;
