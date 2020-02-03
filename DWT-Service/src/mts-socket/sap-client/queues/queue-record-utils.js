import QueueRecordConstants from './queue-record-constants';
/**
 *
 *
 * @param {string} queueRecordData : queue record to be parsed and converted into a Javascript object
 * @param {SapClient} sapClient : SapClient object containing the streams list
 */
const parseQueueRecord = (queueRecordData, sapClient) => {
  const queueRecord = {};
  const streams = [];

  queueRecord.queueName = queueRecordData.substring(
    QueueRecordConstants.BEGINNING_OF_QUEUE_ID,
    QueueRecordConstants.END_OF_QUEUE_ID
  );
  queueRecord.queueDescription = queueRecordData.substring(
    QueueRecordConstants.BEGINNING_OF_QUEUE_DESCRIPTION,
    QueueRecordConstants.END_OF_QUEUE_DESCRIPTION
  );

  queueRecord.jobLimit = queueRecordData
    .substring(QueueRecordConstants.BEGINNING_OF_JOB_LIMIT, QueueRecordConstants.END_OF_JOB_LIMIT)
    .replace(/^0+/, '');

  queueRecord.streams = streams;
  sapClient.allFiles.schedFile.queues.push(queueRecord);
};

const QueueRecordUtils = {
  parseQueueRecord
};

export default QueueRecordUtils;
