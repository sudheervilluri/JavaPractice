import MTSServiceConstants from './mts-service-constants';
import sharedUtils from '../../shared/shared-utils';

export /**
 * Function to generate MTSServiceRequestCode for Read
 *
 * @param {Number} MTSServiceRequestCode : mts service request code for sending to SAP
 * @returns the MTSServiceRequestCode for reading the file/files
 */
const getMTSServiceRequestForRead = MTSServiceRequestCode => {
  const strData =
    MTSServiceConstants.MTS_NOT_LAST_RECORD +
    MTSServiceConstants.MTS_RECORD_CONTROL +
    MTSServiceConstants.MTSRecordSeparator +
    MTSServiceRequestCode +
    MTSServiceConstants.MTSRecordSeparator +
    MTSServiceConstants.MTS_SUCCESS +
    MTSServiceConstants.MTSRecordSeparator +
    MTSServiceConstants.MTS_FAILURE +
    MTSServiceConstants.MTSRecordSeparator;

  return strData;
};

export /**
 * function to send MTSServiceRequest to SAP process to tell SAP what action we are about to perform
 *
 * @param {Number} MTSServiceRequestCode : code which tells SAP what action is about to be performed
 * @param {MTSSock} client : MTSSock object to write the MTSServiceRequest to the SAP Socket
 */
const generateMTSServiceRequest = async (MTSServiceRequestCode, client, sapClient) => {
  const request = getMTSServiceRequestForRead(MTSServiceRequestCode);

  client.writeToSocket(request);

  const databasename = sapClient.databaseName;

  const parseClient = sharedUtils.getPropertyClient();
  const scheduleFilesMap = await parseClient.getProperty('Schedule Files');

  let schedFilePath = scheduleFilesMap.get(`\\\\${databasename}\\Schedule`);
  schedFilePath = schedFilePath.replace(/\\/g, '\\\\');

  let taskFilePath = scheduleFilesMap.get(`\\\\${databasename}\\Task`);
  taskFilePath = taskFilePath.replace(/\\/g, '\\\\');

  let notifFilePath = scheduleFilesMap.get(`\\\\${databasename}\\Notification`);
  notifFilePath = notifFilePath.replace(/\\/g, '\\\\');

  const files = `11!${schedFilePath}!${taskFilePath}!${notifFilePath}!`;

  client.writeToSocket(files);
};

export /**
 * function to get buffer size of length 5 characters of the data with leading zeroes for writing to SAP socket.
 *
 * @param {*} msg : data whose size is to be appended with leading zeroes to get buffer size for writing to SAP socket.
 * @returns : bufferSize of msg with leading zeroes.
 */
const getDataBufferSize = msg => {
  if (msg === null) {
    throw new Error('Cannot create buffer size, Data is null');
  }
  const { length } = msg;
  return `00000${length}`.substr(-5);
};
