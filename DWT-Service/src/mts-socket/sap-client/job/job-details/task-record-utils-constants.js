/**
 * class defining constants used for parsing task file Records
 *
 * @class TaskRecordUtilsConstants
 */

class TaskRecordUtilsConstants {
  static get TASK_RECORD_DELIMITER() {
    return '|';
  }

  static get TASK_RECORD_QUOTE() {
    return '"';
  }

  static get PARAMETER_INDENTIFIER_INDEX() {
    return 0;
  }

  static get PARAMETER_SEPARATOR_INDEX() {
    return 1;
  }

  static get PARAMETER_QUOTE_CHARACTER_INDEX() {
    return 3;
  }

  static get PARAMETER_IDENTIFIER_CHARACTER_POSITIONAL() {
    return '0';
  }

  static get PARAMETER_IDENTIFIER_CHARACTER_PREFIX() {
    return '1';
  }

  static get JOB_NAME_START_INDEX() {
    return 3;
  }

  static get JOB_NAME_END_INDEX() {
    return 11;
  }

  static get JOB_TYPE_START_INDEX() {
    return 13;
  }

  static get JOB_TYPE_END_INDEX() {
    return 16;
  }
}

export default TaskRecordUtilsConstants;
