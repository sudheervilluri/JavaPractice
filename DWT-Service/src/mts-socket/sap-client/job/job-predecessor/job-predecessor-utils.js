import JobPredecessorsConstants from './job-predecessor-constants';
/**
 *
 *
 * @param {List} job : Job List
 * @param {string} streamOrJobName : streamOrJobName of predecessor
 */
const checkJobContainsPredecessors = (job, streamOrJobName) => {
  return job.predecessors.findIndex(
    predecessor => predecessor.streamOrJobName.trim() === streamOrJobName.trim()
  );
};

/**
 *
 *
 * @param {string} jobPredecessorRecordData : job predecessor record to be parsed and converted into a Javascript object
 * @param {SapClient} sapClient : SapClient object containing the streams list
 */
const parseJobPredecessor = (jobPredecessorRecordData, sapClient) => {
  const predecessors = {};

  const parentStreamOrJobName = jobPredecessorRecordData.substring(
    JobPredecessorsConstants.BEGINNING_OF_PARENT_JOB_NAME,
    JobPredecessorsConstants.END_OF_PARENT_JOB_NAME
  );
  predecessors.streamOrJobName = jobPredecessorRecordData.substring(
    JobPredecessorsConstants.BEGINNING_OF_JOB_NAME,
    JobPredecessorsConstants.END_OF_JOB_NAME
  );

  let flag = false;
  /* eslint-disable no-restricted-syntax */
  for (const queue of sapClient.allFiles.schedFile.queues) {
    for (const stream of queue.streams) {
      const job = stream.jobs.get(parentStreamOrJobName.trim());

      if (job !== undefined) {
        const isPresent = checkJobContainsPredecessors(job, predecessors.streamOrJobName);
        if (isPresent === -1) {
          job.predecessors.push(predecessors);
          flag = true;
        }
      }
      if (flag) break;
    }
  }
  /* eslint-enable no-restricted-syntax */
};
const jobPredecessorUtils = {
  parseJobPredecessor
};

export default jobPredecessorUtils;
