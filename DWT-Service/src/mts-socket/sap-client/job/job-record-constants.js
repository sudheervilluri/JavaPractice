class JobRecordConstants {
  static get JOB_RECORD_TYPE() {
    return '6';
  }

  static get BEGINNING_OF_STREAM_NAME() {
    return 5;
  }

  static get END_OF_STREAM_NAME() {
    return 13;
  }

  static get BEGINNING_OF_JOB_NAME() {
    return 13;
  }

  static get END_OF_JOB_NAME() {
    return 21;
  }

  static get BEGINNING_OF_JOB_DESCRIPTION() {
    return 23;
  }

  static get END_OF_JOB_DESCRIPTION() {
    return 53;
  }

  static get INDEX_OF_JOB_STATUS() {
    return 22;
  }

  static get STATUS_MAP() {
    const statusMap = {
      M: 'Marked Complete',
      S: 'Scheduled',
      U: 'Unscheduled',
      I: 'In Progress',
      A: 'Abended',
      F: 'Finished',
      H: 'Suspend Hold',
      C: 'Suspend Continue (with next step in schedule)',
      R: 'Released',
      X: 'Canceled by user',
      B: 'Bypassed by Scheduler',
      T: 'Restarted',
      D: 'Discontinued'
    };
    return statusMap;
  }
}
export default JobRecordConstants;
