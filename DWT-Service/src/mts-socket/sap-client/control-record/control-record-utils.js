import SAPClientConstants from '../sap-client-constants';
import utilFunctions from '../sap-client-utils';

const monthInNumber = new Map(SAPClientConstants.MONTH);
const dayInWord = new Map(SAPClientConstants.DAY);

/**
 * Function to convert the day of the year in sched current date time to
 * month.
 *
 * @param {string} controlRecordData : The control Record data to be parsed and stored in the javascript object
 * @param {SapClient} sapClientContext : The year of scheduler current date time in number.
 * @returns the month of the sched current date time.
 */

const parseControlRecord = (controlRecordData, sapClientContext) => {
  const sapClient = sapClientContext;
  const controlRecordValues = controlRecordData.split('|');
  const [
    multipleValues,
    schedulerLogFilePath,
    taskFilePath,
    notificationFilePath
  ] = controlRecordValues;
  sapClient.allFiles.schedFile.controlRecord.schedulerLogFilePath = schedulerLogFilePath;
  sapClient.allFiles.schedFile.controlRecord.taskFilePath = taskFilePath;
  sapClient.allFiles.schedFile.controlRecord.notificationFilePath = notificationFilePath;
  sapClient.allFiles.schedFile.controlRecord.sleepInterval = parseInt(
    multipleValues
      .substring(
        SAPClientConstants.BEGINNING_OF_SLEEP_INTERVAL,
        SAPClientConstants.END_OF_SLEEP_INTERVAL
      )
      .replace(/^0+/, ''),
    10
  );
  let lastMaintenanceDateTime = multipleValues.substring(
    SAPClientConstants.BEGINNING_OF_LAST_MAINTENANCE_DATE_TIME,
    SAPClientConstants.END_OF_LAST_MAINTENANCE_DATE_TIME
  );
  //  format the maintenance start time
  monthInNumber.forEach((value, key) => {
    //  converting the month of the last maintenance date time from number to word
    if (lastMaintenanceDateTime.substring(0, 2) === key) {
      lastMaintenanceDateTime = `${value} ${lastMaintenanceDateTime.substring(
        SAPClientConstants.BEGINNING_OF_LAST_MAINTENANCE_DATE,
        SAPClientConstants.END_OF_LAST_MAINTENANCE_DATE
      )}, ${lastMaintenanceDateTime.substring(
        SAPClientConstants.BEGINNING_OF_LAST_MAINTENANCE_YEAR,
        SAPClientConstants.END_OF_LAST_MAINTENANCE_YEAR
      )} ${lastMaintenanceDateTime.substring(
        SAPClientConstants.BEGINNING_OF_LAST_MAINTENANCE_TIME,
        SAPClientConstants.END_OF_LAST_MAINTENANCE_TIME
      )}`;
    }
  });
  sapClient.allFiles.schedFile.controlRecord.lastMaintenanceDateTime = lastMaintenanceDateTime;
  const yearOfCurrentSchedulerDate =
    1900 +
    Number.parseInt(
      multipleValues.substring(
        SAPClientConstants.BEGINNING_OF_YEAR_OF_SCHEDULER_CURRENT_DATE_TIME,
        SAPClientConstants.END_OF_YEAR_OF_SCHEDULER_CURRENT_DATE_TIME
      ),
      10
    );
  const monthOfCurrentSchedulerDate = Number.parseInt(
    multipleValues.substring(
      SAPClientConstants.BEGINNING_OF_MONTH_OF_SCHEDULER_CURRENT_DATE_TIME,
      SAPClientConstants.END_OF_MONTH_OF_SCHEDULER_CURRENT_DATE_TIME
    ),
    10
  );
  let dayOfTheWeekOfCurrentSchedulerDate = multipleValues.substring(
    SAPClientConstants.BEGINNING_OF_DAY_OF_THE_WEEK_OF_SCHEDULER_CURRENT_DATE_TIME,
    SAPClientConstants.END_OF_DAY_OF_THE_WEEK_OF_SCHEDULER_CURRENT_DATE_TIME
  );
  let dayOfTheMonthOfCurrentSchedulerDate = multipleValues
    .substring(
      SAPClientConstants.BEGINNING_OF_DAY_OF_THE_MONTH_OF_SCHEDULER_CURRENT_DATE_TIME,
      SAPClientConstants.END_OF_DAY_OF_THE_MONTH_OF_SCHEDULER_CURRENT_DATE_TIME
    )
    .replace(/^0+/, '');
  if (dayOfTheMonthOfCurrentSchedulerDate.length === 1) {
    dayOfTheMonthOfCurrentSchedulerDate = `0${dayOfTheMonthOfCurrentSchedulerDate}`;
  }
  //  converting the day of the week from number to word
  dayInWord.forEach((value, key) => {
    if (dayOfTheWeekOfCurrentSchedulerDate.includes(key)) {
      dayOfTheWeekOfCurrentSchedulerDate = value;
    }
  });
  //  converting the day of the year to month
  const monthOfCurrentSchedulerDateAfterConversion = utilFunctions.dayOfTheYearToMonth(
    monthOfCurrentSchedulerDate,
    yearOfCurrentSchedulerDate
  );

  //  scheduler current date after conversion
  sapClient.allFiles.schedFile.controlRecord.currentSchedulerDate = `${dayOfTheWeekOfCurrentSchedulerDate}, ${monthOfCurrentSchedulerDateAfterConversion} ${dayOfTheMonthOfCurrentSchedulerDate}, ${yearOfCurrentSchedulerDate}`;
  sapClient.allFiles.schedFile.controlRecord.checkpointDirectoryPath = multipleValues.substring(
    SAPClientConstants.BEGINNING_OF_CHECKPOINT_DIRECTORY_PATH,
    SAPClientConstants.END_OF_CHECKPOINT_DIRECTORY_PATH
  );
};

const controlRecordUtils = {
  parseControlRecord
};

export default controlRecordUtils;
