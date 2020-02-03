import StreamPredecessorsConstants from './stream-predecessor-constants';
/**
 *
 *
 * @param {List} stream : stream List
 * @param {string} streamOrJobName : streamOrJobName of predecessor
 */
const checkStreamContainsPredecessors = (stream, streamOrJobName) => {
  return stream.predecessors.findIndex(
    predecessor => predecessor.streamOrJobName.trim() === streamOrJobName.trim()
  );
};

/**
 *
 *
 * @param {string} streamPredecessorRecordData : stream predecessor record to be parsed and converted into a Javascript object
 * @param {SapClient} sapClient : SapClient object containing the streams list
 */
const parseStreamPredecessor = (streamPredecessorRecordData, sapClient) => {
  const predecessors = {};

  const parentStreamOrJobName = streamPredecessorRecordData.substring(
    StreamPredecessorsConstants.BEGINNING_OF_PARENT_STREAM_NAME,
    StreamPredecessorsConstants.END_OF_PARENT_STREAM_NAME
  );
  predecessors.streamOrJobName = streamPredecessorRecordData.substring(
    StreamPredecessorsConstants.BEGINNING_OF_STREAM_NAME,
    StreamPredecessorsConstants.END_OF_STREAM_NAME
  );

  let flag = false;
  /* eslint-disable no-restricted-syntax */
  for (const queue of sapClient.allFiles.schedFile.queues) {
    for (const stream of queue.streams) {
      if (stream.streamName.trim() === parentStreamOrJobName.trim()) {
        const isPresent = checkStreamContainsPredecessors(stream, predecessors.streamOrJobName);
        if (isPresent === -1) {
          stream.predecessors.push(predecessors);
          flag = true;
          break;
        }
      }
      if (flag) break;
    }
  }
  /* eslint-enable no-restricted-syntax */
};
const streamPredecessorUtils = {
  parseStreamPredecessor
};

export default streamPredecessorUtils;
