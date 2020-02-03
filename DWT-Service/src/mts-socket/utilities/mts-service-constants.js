/**
 * class defining constants for MTS Service Request
 *
 * @class MTSServiceConstants
 */
class MTSServiceConstants {
  static get MTS_SERVICE_VIEW_SCHEDULE_FILE_ONLY() {
    return 135;
  }

  static get MTS_SERVICE_VIEW() {
    return 130;
  }

  static get MTS_NOT_LAST_RECORD() {
    return '0';
  }

  static get MTSRecordSeparator() {
    return '!';
  }

  static get MTS_RECORD_CONTROL() {
    return '0';
  }

  static get MTS_SUCCESS() {
    return '0';
  }

  static get MTS_FAILURE() {
    return '1';
  }
}

export default MTSServiceConstants;
