import ScheduleDetailsConstants from './schedule-details-constants';
import utils from '../../utilities/util';

const parseWeeklyDays = weeklySchedule => {
  const runWeekDays = [];
  [...weeklySchedule].forEach((weeklyMask, i) => {
    const weekDay = {};
    weekDay.name = ScheduleDetailsConstants.DAYS_OF_WEEK[i];
    weekDay.isSelected = weeklyMask;
    runWeekDays.push(weekDay);
  });

  return runWeekDays;
};

const padStart = (string, length, char) => {
  let len = length;
  let str = string;
  while (len > 0) {
    len -= 1;
    str = char + str;
  }
  return str;
};

const numToString = (num, radix, length) => {
  const numString = num.toString(radix);

  return numString.length === length
    ? numString
    : padStart(numString, length - numString.length, '0');
};

const getMonthMask = monthlySchedule => {
  const monthlyScheduleBinary = numToString(parseInt(monthlySchedule, 10), 2, 12);

  // reverse binary mask
  const monthlyScheduleBinaryReverse = monthlyScheduleBinary
    .split('')
    .reverse()
    .join('');

  const monthlyMask = [];

  [...monthlyScheduleBinaryReverse].forEach((month, i) => {
    const monthSchedule = {};
    monthSchedule.name = ScheduleDetailsConstants.MONTHS_OF_YEAR[i];
    monthSchedule.isSelected = month;
    monthlyMask.push(monthSchedule);
  });
  return monthlyMask;
};

const parseSchedule = scheduleRecord => {
  const scheduleInfo = {};
  const baseInfo = {};
  const dateAndTime = {};
  const dailyInfo = {};
  const weeklyInfo = {};
  const monthlyInfo = {};

  baseInfo.occurrence = scheduleRecord.charAt(ScheduleDetailsConstants.SCHEDULE_OCCURRENCE_INDEX);

  baseInfo.frequency = scheduleRecord.charAt(ScheduleDetailsConstants.SCHEDULE_FREQUENCY_INDEX);

  baseInfo.forceExecution = scheduleRecord.charAt(ScheduleDetailsConstants.FORCE_EXECUTION_INDEX);

  dateAndTime.lastActualStartTime = scheduleRecord
    .substring(
      ScheduleDetailsConstants.LAST_ACTUAL_START_TIME_BEGINNING,
      ScheduleDetailsConstants.LAST_ACTUAL_START_TIME_END
    )
    .trim();

  dateAndTime.lastActualEndTime = utils
    .formatFinishedDateTime(
      scheduleRecord.substring(
        ScheduleDetailsConstants.LAST_ACTUAL_END_TIME_BEGINNING,
        ScheduleDetailsConstants.LAST_ACTUAL_END_TIME_END
      )
    )
    .trim();

  baseInfo.scheduleActive = scheduleRecord.charAt(ScheduleDetailsConstants.SCHEDULE_ACTIVE_INDEX);

  dateAndTime.earliestStartTime = scheduleRecord
    .substring(
      ScheduleDetailsConstants.EARLIEST_START_TIME_BEGINNING,
      ScheduleDetailsConstants.EARLIEST_START_TIME_END
    )
    .trim();

  dateAndTime.latestStartTime = scheduleRecord
    .substring(
      ScheduleDetailsConstants.LATEST_START_TIME_BEGINNING,
      ScheduleDetailsConstants.LATEST_START_TIME_END
    )
    .trim();

  const baseDate = scheduleRecord
    .substring(ScheduleDetailsConstants.BASE_DATE_BEGINNING, ScheduleDetailsConstants.BASE_DATE_END)
    .trim();

  const baseDateYear = baseDate.substring(
    ScheduleDetailsConstants.BASE_DATE_YEAR_BEGINNING,
    ScheduleDetailsConstants.BASE_DATE_YEAR_END
  );
  const baseDateMonth = baseDate.substring(
    ScheduleDetailsConstants.BASE_DATE_MONTH_BEGINNING,
    ScheduleDetailsConstants.BASE_DATE_MONTH_END
  );
  const baseDateDay = baseDate.substring(
    ScheduleDetailsConstants.BASE_DATE_DAY_BEGINNING,
    ScheduleDetailsConstants.BASE_DATE_DAY_END
  );

  dateAndTime.baseDate = `${baseDateMonth}/${baseDateDay}/${baseDateYear}`;

  baseInfo.dateAndTime = dateAndTime;

  dailyInfo.everyNDays = scheduleRecord
    .substring(
      ScheduleDetailsConstants.EVERY_N_DAYS_BEGINNING,
      ScheduleDetailsConstants.EVERY_N_DAYS_END
    )
    .trim();

  weeklyInfo.everyNWeeks = scheduleRecord
    .substring(
      ScheduleDetailsConstants.EVERY_N_WEEKS_BEGINNING,
      ScheduleDetailsConstants.EVERY_N_WEEKS_END
    )
    .trim();

  monthlyInfo.monthlyScheduleType = scheduleRecord.charAt(
    ScheduleDetailsConstants.MONTHLY_SCHEDULE_TYPE_INDEX
  );

  monthlyInfo.monthlyScheduleEvent = scheduleRecord.charAt(
    ScheduleDetailsConstants.MONTHLY_SCHEDULE_EVENT_INDEX
  );

  monthlyInfo.monthlyScheduleEventDay = scheduleRecord.charAt(
    ScheduleDetailsConstants.MONTHLY_SCHEDULE_EVENT_DAY_INDEX
  );

  monthlyInfo.dayOfTheMonth = scheduleRecord
    .substring(
      ScheduleDetailsConstants.DAY_OF_MONTH_BEGINNING,
      ScheduleDetailsConstants.DAY_OF_MONTH_END
    )
    .trim();

  weeklyInfo.runWeekDays = parseWeeklyDays(
    scheduleRecord
      .substring(
        ScheduleDetailsConstants.RUN_WEEKDAYS_BEGINNING,
        ScheduleDetailsConstants.RUN_WEEKDAYS_END
      )
      .trim()
  );

  const monthlyMaskInt = scheduleRecord
    .substring(
      ScheduleDetailsConstants.MONTHLY_MASK_BEGINNING,
      ScheduleDetailsConstants.MONTHLY_MASK_END
    )
    .trim();

  monthlyInfo.monthMask = getMonthMask(monthlyMaskInt);

  scheduleInfo.dailyInfo = dailyInfo;

  scheduleInfo.weeklyInfo = weeklyInfo;

  scheduleInfo.monthlyInfo = monthlyInfo;

  scheduleInfo.baseInfo = baseInfo;

  return scheduleInfo;
};

const parseFirstSchedule = scheduleRecord => {
  return parseSchedule(
    scheduleRecord
      .substring(
        ScheduleDetailsConstants.FIRST_SCHEDULE_BEGINNING,
        ScheduleDetailsConstants.FIRST_SCHEDULE_END
      )
      .trim()
  );
};

const parseSecondSchedule = scheduleRecord => {
  return parseSchedule(
    scheduleRecord
      .substring(
        ScheduleDetailsConstants.SECOND_SCHEDULE_BEGINNING,
        ScheduleDetailsConstants.SECOND_SCHEDULE_END
      )
      .trim()
  );
};

const parseThirdSchedule = scheduleRecord => {
  return parseSchedule(
    scheduleRecord
      .substring(
        ScheduleDetailsConstants.THIRD_SCHEDULE_BEGINNING,
        ScheduleDetailsConstants.THIRD_SCHEDULE_END
      )
      .trim()
  );
};

const parseScheduleRecord = scheduleRecord => {
  const scheduleOccurrence = [];
  const scheduleInfo = {};

  const firstSchedule = parseFirstSchedule(scheduleRecord);

  const secondSchedule = parseSecondSchedule(scheduleRecord);

  const thirdSchedule = parseThirdSchedule(scheduleRecord);

  scheduleOccurrence.push(firstSchedule);

  scheduleOccurrence.push(secondSchedule);

  scheduleOccurrence.push(thirdSchedule);

  scheduleInfo.scheduleOccurrence = scheduleOccurrence;

  return scheduleInfo;
};

const scheduleDetails = {
  parseScheduleRecord
};

export default scheduleDetails;
