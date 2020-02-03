/* eslint-disable no-restricted-syntax */
import JobRecordConstants from './job-record-constants';
import scheduleDetails from '../schedule/schedule-details';
import utilFunctions from '../../utilities/util';
/**
 *
 *
 * @param {string} jobRecordData : job record to be parsed and converted into a Javascript object
 * @param {SapClient} sapClient : SapClient object containing the job list
 */

const parseJobRecord = (jobRecordData, sapClient) => {
  const jobRecord = {};
  const predecessors = [];
  const notifications = [];
  const streamNameOfAJob = jobRecordData.substring(
    JobRecordConstants.BEGINNING_OF_STREAM_NAME,
    JobRecordConstants.END_OF_STREAM_NAME
  );
  jobRecord.jobName = jobRecordData.substring(
    JobRecordConstants.BEGINNING_OF_JOB_NAME,
    JobRecordConstants.END_OF_JOB_NAME
  );
  jobRecord.description = jobRecordData.substring(
    JobRecordConstants.BEGINNING_OF_JOB_DESCRIPTION,
    JobRecordConstants.END_OF_JOB_DESCRIPTION
  );
  jobRecord.jobStatus =
    JobRecordConstants.STATUS_MAP[jobRecordData[JobRecordConstants.INDEX_OF_JOB_STATUS]];

  jobRecord.notifications = notifications;

  jobRecord.scheduleInfo = scheduleDetails.parseScheduleRecord(jobRecordData);

  jobRecord.finishedDateTime = utilFunctions.getFinishedDateTime(
    jobRecord.scheduleInfo.scheduleOccurrence
  );

  jobRecord.predecessors = predecessors;

  let flag = false;

  for (const queue of sapClient.allFiles.schedFile.queues) {
    for (const stream of queue.streams) {
      if (streamNameOfAJob.trim() === stream.streamName.trim()) {
        stream.jobs.set(jobRecord.jobName.trim(), jobRecord);
        flag = true;
        break;
      }
      if (flag) break;
    }
  }
};

const jobRecordUtils = {
  parseJobRecord
};

export default jobRecordUtils;
