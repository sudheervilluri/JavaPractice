import ScheduleDetailsConstants from '../sap-client/schedule/schedule-details-constants';
/**
 *
 *
 * @param {string} finishedDateTimeSchedFileFormat : finished Date Time in Scheduler File format for jobs or streams
 * @returns job finished Date Time in format required by UI
 */
const formatFinishedDateTime = finishedDateTimeSchedFileFormat => {
  let finishedDateTime = '';
  const finishedDateTimeValues = finishedDateTimeSchedFileFormat.trim().split(' ');
  const finishedDateTimeValue = finishedDateTimeSchedFileFormat.trim();
  if (finishedDateTimeValues.length > 1) {
    const finishedDay = finishedDateTimeValue.substring(
      ScheduleDetailsConstants.FINISHED_DAY_BEGINNING,
      ScheduleDetailsConstants.FINISHED_DAY_END
    );
    const finishedMonth = finishedDateTimeValue.substring(
      ScheduleDetailsConstants.FINISHED_MONTH_BEGINNING,
      ScheduleDetailsConstants.FINISHED_MONTH_END
    );
    const finishedDayOfMonth = finishedDateTimeValue.substring(
      ScheduleDetailsConstants.FINISHED_DAY_OF_MONTH_BEGINNING,
      ScheduleDetailsConstants.FINISHED_DAY_OF_MONTH_END
    );
    const finishedTime = finishedDateTimeValue.substring(
      ScheduleDetailsConstants.FINISHED_TIME_BEGINNING,
      ScheduleDetailsConstants.FINISHED_TIME_END
    );
    const finishedYear = finishedDateTimeValue.substring(
      ScheduleDetailsConstants.FINISHED_YEAR_BEGINNING,
      ScheduleDetailsConstants.FINISHED_YEAR_END
    );
    finishedDateTime = `${finishedDay}, ${finishedMonth} ${finishedDayOfMonth}, ${finishedYear} ${finishedTime}`;
  }
  return finishedDateTime;
};
/**
 *
 * @param {list} toBeSortedList :sort the jobs and streams
 * @param {string} onMember :property of the object to be sorted on
 */
const sortList = (toBeSortedList, onMember) => {
  const sortedList = toBeSortedList;
  sortedList.sort((a, b) => {
    if (
      !Object.prototype.hasOwnProperty.call(a, onMember) ||
      !Object.prototype.hasOwnProperty.call(b, onMember)
    ) {
      return 0;
    }
    const valueA = a[onMember].toLowerCase();
    const valueB = b[onMember].toLowerCase();
    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }
    return 0;
  });
  return sortedList;
};

const isValidDate = date => {
  let flag = false;
  if (Object.prototype.toString.call(date) === '[object Date]') {
    if (Number.isNaN(date.getTime()) === true) {
      flag = false;
    } else {
      flag = true;
    }
  } else {
    flag = false;
  }
  return flag;
};

const getFinishedDateTime = scheduleOccurrenceList => {
  let finishedDateTime = new Date('01/01/1900');
  let finishedDateTimeString = '';
  scheduleOccurrenceList.forEach(schedule => {
    const { dateAndTime, scheduleActive } = schedule.baseInfo;
    let lastActualEndTime = new Date(dateAndTime.lastActualEndTime);
    if (isValidDate(lastActualEndTime) === false) {
      lastActualEndTime = new Date('01/01/1900');
    }

    if (lastActualEndTime > finishedDateTime && scheduleActive === '1') {
      finishedDateTime = lastActualEndTime;
      finishedDateTimeString = dateAndTime.lastActualEndTime;
    }
  });

  return finishedDateTimeString;
};

const getNextOccurrenceFromList = occerrenceList => {
  let nextOccurrence = new Date(8640000000000000);
  occerrenceList.forEach(occurrenceOfSchedule => {
    let occurrence;
    if (isValidDate(occurrenceOfSchedule) === true) {
      occurrence = new Date(occurrenceOfSchedule.getTime());
    } else {
      occurrence = new Date(8640000000000000);
    }

    if (occurrence < nextOccurrence) {
      nextOccurrence = occurrence;
    }
  });
  return nextOccurrence.toDateString();
};

const utilFunctions = {
  formatFinishedDateTime,
  sortList,
  isValidDate,
  getFinishedDateTime,
  getNextOccurrenceFromList
};
export default utilFunctions;
