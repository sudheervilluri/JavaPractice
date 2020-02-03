/**
 * class defining constants used for parsing Job Predecessor Records
 *
 * @class JobPredecessorsConstants
 */
class JobPredecessorsConstants {
  static get JOB_PREDECESSOR_RECORD_TYPE() {
    return '8';
  }

  static get BEGINNING_OF_PARENT_JOB_NAME() {
    return 13;
  }

  static get END_OF_PARENT_JOB_NAME() {
    return 21;
  }

  static get BEGINNING_OF_JOB_NAME() {
    return 22;
  }

  static get END_OF_JOB_NAME() {
    return 30;
  }
}
export default JobPredecessorsConstants;
