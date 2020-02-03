class ScheduleOccurrenceUtilsConstants {
  static get DAYS_OF_WEEK() {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  static get DAYS_IN_WEEK() {
    return 7;
  }

  static get MONTHLY_SCHEDULE_SUNDAY() {
    return '0';
  }

  static get MONTHLY_SCHEDULE_SATURDAY() {
    return '6';
  }

  static get MONTHLY_SCHEDULE_WEEKDAY() {
    return '8';
  }

  static get MONTHLY_SCHEDULE_WEEKEND() {
    return '9';
  }

  static get MONTHLY_SCHEDULE_TYPE_DAY() {
    return '0';
  }

  static get MONTHLY_SCHEDULE_TYPE_EVENT() {
    return '1';
  }

  static get MONTHLY_SCHEDULE_EVENT_LAST() {
    return '4';
  }

  static get MONTHLY_SCHEDULE_EVENT_DAY() {
    return '7';
  }

  static get MONTHLY_SCHEDULE_EVENT_FIRST() {
    return '0';
  }

  static get MONTHLY_SCHEDULE_EVENT_FOURTH() {
    return '3';
  }

  static get SCHEDULE_OCCURRENCE_DAILY() {
    return '0';
  }

  static get SCHEDULE_OCCURRENCE_WEEKLY() {
    return '1';
  }

  static get SCHEDULE_OCCURRENCE_MONTHLY() {
    return '2';
  }
}

export default ScheduleOccurrenceUtilsConstants;
