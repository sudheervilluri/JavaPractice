/**
 * class defining constants used for parsing Stream Records
 *
 * @class StreamRecordConstants
 */
class QueueConstants {
  static get QUEUE_RECORD_TYPE() {
    return '3';
  }

  static get BEGINNING_OF_QUEUE_ID() {
    return 3;
  }

  static get END_OF_QUEUE_ID() {
    return 5;
  }

  static get BEGINNING_OF_JOB_LIMIT() {
    return 39;
  }

  static get END_OF_JOB_LIMIT() {
    return 47;
  }

  static get BEGINNING_OF_QUEUE_DESCRIPTION() {
    return 55;
  }

  static get END_OF_QUEUE_DESCRIPTION() {
    return 75;
  }
}
export default QueueConstants;
