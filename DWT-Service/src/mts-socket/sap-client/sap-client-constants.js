/**
 * class defining constants for SAP Client
 *
 * @class SAPClientConstants
 */
class SAPClientConstants {
  static get RECORD_TYPE_INDEX() {
    return '21';
  }

  static get CONTROL_RECORD_TYPE() {
    return '2';
  }

  static get MONTH() {
    return [
      ['01', 'Jan'],
      ['02', 'Feb'],
      ['03', 'Mar'],
      ['04', 'Apr'],
      ['05', 'May'],
      ['06', 'Jun'],
      ['07', 'Jul'],
      ['08', 'Aug'],
      ['09', 'Sep'],
      ['10', 'Oct'],
      ['11', 'Nov'],
      ['12', 'Dec']
    ];
  }

  static get BEGINNING_OF_LAST_MAINTENANCE_DATE_TIME() {
    return '23';
  }

  static get END_OF_LAST_MAINTENANCE_DATE_TIME() {
    return '39';
  }

  static get BEGINNING_OF_SLEEP_INTERVAL() {
    return '39';
  }

  static get END_OF_SLEEP_INTERVAL() {
    return '47';
  }

  static get BEGINNING_OF_YEAR_OF_SCHEDULER_CURRENT_DATE_TIME() {
    return '47';
  }

  static get END_OF_YEAR_OF_SCHEDULER_CURRENT_DATE_TIME() {
    return '50';
  }

  static get BEGINNING_OF_MONTH_OF_SCHEDULER_CURRENT_DATE_TIME() {
    return '50';
  }

  static get END_OF_MONTH_OF_SCHEDULER_CURRENT_DATE_TIME() {
    return '53';
  }

  static get BEGINNING_OF_DAY_OF_THE_WEEK_OF_SCHEDULER_CURRENT_DATE_TIME() {
    return '54';
  }

  static get END_OF_DAY_OF_THE_WEEK_OF_SCHEDULER_CURRENT_DATE_TIME() {
    return '56';
  }

  static get BEGINNING_OF_DAY_OF_THE_MONTH_OF_SCHEDULER_CURRENT_DATE_TIME() {
    return '57';
  }

  static get END_OF_DAY_OF_THE_MONTH_OF_SCHEDULER_CURRENT_DATE_TIME() {
    return '59';
  }

  static get BEGINNING_OF_CHECKPOINT_DIRECTORY_PATH() {
    return '59';
  }

  static get END_OF_CHECKPOINT_DIRECTORY_PATH() {
    return '83';
  }

  static get BEGINNING_OF_LAST_MAINTENANCE_DATE() {
    return '2';
  }

  static get END_OF_LAST_MAINTENANCE_DATE() {
    return '4';
  }

  static get BEGINNING_OF_LAST_MAINTENANCE_TIME() {
    return '8';
  }

  static get END_OF_LAST_MAINTENANCE_TIME() {
    return '16';
  }

  static get BEGINNING_OF_LAST_MAINTENANCE_YEAR() {
    return '4';
  }

  static get END_OF_LAST_MAINTENANCE_YEAR() {
    return '8';
  }

  static get DAY() {
    return [[1, 'Mon'], [2, 'Tue'], [3, 'Wed'], [4, 'Thu'], [5, 'Fri'], [6, 'Sat'], [7, 'Sun']];
  }

  static get LEAP_YEAR() {
    return 29;
  }

  static get IS_NOT_LEAP_YEAR() {
    return 28;
  }
}
export default SAPClientConstants;
