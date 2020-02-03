/**
 * class defining constants used for parsing Schedule Details
 *
 * @class ScheduleDetailsConstants
 */
class ScheduleDetailsConstants {
  static get FIRST_SCHEDULE_BEGINNING() {
    return 53;
  }

  static get FIRST_SCHEDULE_END() {
    return 154;
  }

  static get SECOND_SCHEDULE_BEGINNING() {
    return 154;
  }

  static get SECOND_SCHEDULE_END() {
    return 255;
  }

  static get THIRD_SCHEDULE_BEGINNING() {
    return 255;
  }

  static get THIRD_SCHEDULE_END() {
    return 356;
  }

  static get SCHEDULE_OCCURRENCE_INDEX() {
    return 0;
  }

  static get SCHEDULE_FREQUENCY_INDEX() {
    return 1;
  }

  static get FORCE_EXECUTION_INDEX() {
    return 30;
  }

  static get LAST_ACTUAL_START_TIME_BEGINNING() {
    return 31;
  }

  static get LAST_ACTUAL_START_TIME_END() {
    return 57;
  }

  static get LAST_ACTUAL_END_TIME_BEGINNING() {
    return 57;
  }

  static get LAST_ACTUAL_END_TIME_END() {
    return 83;
  }

  static get SCHEDULE_ACTIVE_INDEX() {
    return 100;
  }

  static get EARLIEST_START_TIME_BEGINNING() {
    return 14;
  }

  static get EARLIEST_START_TIME_END() {
    return 19;
  }

  static get LATEST_START_TIME_BEGINNING() {
    return 22;
  }

  static get LATEST_START_TIME_END() {
    return 27;
  }

  static get BASE_DATE_BEGINNING() {
    return 92;
  }

  static get BASE_DATE_END() {
    return 100;
  }

  static get BASE_DATE_YEAR_BEGINNING() {
    return 0;
  }

  static get BASE_DATE_YEAR_END() {
    return 4;
  }

  static get BASE_DATE_MONTH_BEGINNING() {
    return 4;
  }

  static get BASE_DATE_MONTH_END() {
    return 6;
  }

  static get BASE_DATE_DAY_BEGINNING() {
    return 6;
  }

  static get BASE_DATE_DAY_END() {
    return 8;
  }

  static get EVERY_N_DAYS_BEGINNING() {
    return 83;
  }

  static get EVERY_N_DAYS_END() {
    return 86;
  }

  static get EVERY_N_WEEKS_BEGINNING() {
    return 86;
  }

  static get EVERY_N_WEEKS_END() {
    return 88;
  }

  static get MONTHLY_SCHEDULE_TYPE_INDEX() {
    return 9;
  }

  static get MONTHLY_SCHEDULE_EVENT_INDEX() {
    return 10;
  }

  static get MONTHLY_SCHEDULE_EVENT_DAY_INDEX() {
    return 11;
  }

  static get DAY_OF_MONTH_BEGINNING() {
    return 12;
  }

  static get DAY_OF_MONTH_END() {
    return 14;
  }

  static get RUN_WEEKDAYS_BEGINNING() {
    return 2;
  }

  static get RUN_WEEKDAYS_END() {
    return 9;
  }

  static get MONTHLY_MASK_BEGINNING() {
    return 88;
  }

  static get MONTHLY_MASK_END() {
    return 92;
  }

  static get FINISHED_DAY_BEGINNING() {
    return 0;
  }

  static get FINISHED_DAY_END() {
    return 3;
  }

  static get FINISHED_MONTH_BEGINNING() {
    return 4;
  }

  static get FINISHED_MONTH_END() {
    return 7;
  }

  static get FINISHED_DAY_OF_MONTH_BEGINNING() {
    return 8;
  }

  static get FINISHED_DAY_OF_MONTH_END() {
    return 10;
  }

  static get FINISHED_TIME_BEGINNING() {
    return 11;
  }

  static get FINISHED_TIME_END() {
    return 19;
  }

  static get FINISHED_YEAR_BEGINNING() {
    return 20;
  }

  static get FINISHED_YEAR_END() {
    return 24;
  }

  static get MONTHS_OF_YEAR() {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  static get DAYS_OF_WEEK() {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }
}
export default ScheduleDetailsConstants;
