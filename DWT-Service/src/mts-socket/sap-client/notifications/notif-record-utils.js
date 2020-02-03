/* eslint-disable no-restricted-syntax */
import NotifConstants from './notif-record-constants';
/**
 *
 *
 * @param {string} notifRecordData : notif record to be parsed and converted into a Javascript object
 * @param {SapClient} sapClient : SapClient object containing the streams list
 */

const parseNotifRecord = (notifRecordData, sapClient) => {
  let notifRecord = {};
  const notifInfo = {};
  notifRecord = notifRecordData.split('|');
  const [
    streamOrJobIdentifier,
    streamOrJobName,
    notificationType,
    eventType,
    enabled
  ] = notifRecord;
  notifInfo.streamOrJobIdentifier = streamOrJobIdentifier
    .substring(
      NotifConstants.BEGINNING_OF_STREAM_OR_JOB_IDENTIFIER,
      NotifConstants.END_OF_STREAM_OR_JOB_IDENTIFIER
    )
    .trim();
  notifInfo.streamOrJobName = streamOrJobName;
  notifInfo.notificationType = notificationType;
  notifInfo.eventType = eventType === 'S' ? 'Success' : 'Failure';
  notifInfo.enabled = enabled;
  notifInfo.emailAddress = notifRecord[NotifConstants.EMAIL_ADDRESS].slice(0, -1);
  // push only the notifications of a stream inside their respective streams
  let flag = false;
  for (const queue of sapClient.allFiles.schedFile.queues) {
    for (const stream of queue.streams) {
      if (notifInfo.streamOrJobIdentifier === NotifConstants.IDENTIFIER_OF_STREAM) {
        if (notifInfo.streamOrJobName.trim() === stream.streamName.trim()) {
          stream.notifications.push(notifInfo);
          flag = true;
          break;
        }
      } else if (notifInfo.streamOrJobIdentifier === NotifConstants.IDENTIFIER_OF_JOB) {
        const job = stream.jobs.get(notifInfo.streamOrJobName.trim());

        if (job !== undefined) {
          job.notifications.push(notifInfo);
          flag = true;
        }
      }
    }
    if (flag) break;
  }
};

const notifUtils = {
  parseNotifRecord
};

export default notifUtils;
