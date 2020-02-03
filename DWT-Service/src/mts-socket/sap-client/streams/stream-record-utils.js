/* eslint-disable no-restricted-syntax */
import StreamRecordConstants from './stream-record-constants';
import utilFunctions from '../../utilities/util';
import scheduleDetails from '../schedule/schedule-details';

/**
 *
 *
 * @param {string} streamRecordData : stream record to be parsed and converted into a Javascript object
 * @param {SapClient} sapClient : SapClient object containing the streams list
 */

const parseStreamRecord = (streamRecordData, sapClient) => {
  const notifications = [];
  const predecessors = [];
  const jobs = new Map();
  const streamRecord = {};
  streamRecord.queueName = streamRecordData.substring(
    StreamRecordConstants.BEGINNING_OF_QUEUE_ID,
    StreamRecordConstants.END_OF_QUEUE_ID
  );

  streamRecord.streamName = streamRecordData.substring(
    StreamRecordConstants.BEGINNING_OF_STREAM_NAME,
    StreamRecordConstants.END_OF_STREAM_NAME
  );
  streamRecord.streamDescription = streamRecordData.substring(
    StreamRecordConstants.BEGINNING_OF_STREAM_DESCRIPTION,
    StreamRecordConstants.END_OF_STREAM_DESCRIPTION
  );
  streamRecord.streamStatus =
    StreamRecordConstants.STATUS_MAP[
      streamRecordData[StreamRecordConstants.INDEX_OF_STREAM_STATUS]
    ];

  streamRecord.scheduleInfo = scheduleDetails.parseScheduleRecord(streamRecordData);

  streamRecord.streamFinishedDateTime = utilFunctions.getFinishedDateTime(
    streamRecord.scheduleInfo.scheduleOccurrence
  );

  streamRecord.notifications = notifications;
  streamRecord.predecessors = predecessors;
  streamRecord.jobs = jobs;

  for (const queue of sapClient.allFiles.schedFile.queues) {
    if (streamRecord.queueName.trim() === queue.queueName.trim()) {
      queue.streams.push(streamRecord);
      break;
    }
  }
};
const streamRecordUtils = {
  parseStreamRecord
};

export default streamRecordUtils;
