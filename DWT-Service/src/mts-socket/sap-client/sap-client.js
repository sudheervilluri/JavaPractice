import MTSSock from '../mts-socket';
import MTSServiceConstants from '../utilities/mts-service-constants';
import SAPClientConstants from './sap-client-constants';
import StreamRecordConstants from './streams/stream-record-constants';
import streamRecordUtils from './streams/stream-record-utils';
import controlRecordUtils from './control-record/control-record-utils';
import JobRecordConstants from './job/job-record-constants';
import jobRecordUtils from './job/job-record-utils';
import queueRecordUtils from './queues/queue-record-utils';
import QueueConstants from './queues/queue-record-constants';
import StreamPredecessorsConstants from './streams/stream-predecessor/stream-predecessor-constants';
import taskRecordUtils from './job/job-details/task-record-utils';
import streamPredecessorsUtils from './streams/stream-predecessor/stream-predecessor-utils';
import JobPredecessorsConstants from './job/job-predecessor/job-predecessor-constants';
import jobPredecessorUtils from './job/job-predecessor/job-predecessor-utils';
import notifRecordUtils from './notifications/notif-record-utils';

//
/**
 * class containing functions to connect to a remote SAP process and read/write
 * to the Sched, Notification and Task Files.
 *
 * @class SapClient
 */
class SapClient {
  constructor(jobTypeMap, dbServerName, databaseName) {
    this.allFiles = { schedFile: { controlRecord: {}, queues: [] } };
    this.jobTypeMap = jobTypeMap;
    this.dbServerName = dbServerName;
    this.databaseName = databaseName;
    this.mtssock = new MTSSock();
  }

  /**
   * This method connects to the SAPD service specified by the port and hostName,
   * SAPD in turn creates a new SAP process for further communication with the SapClient
   * The socket returned from this method is used to communicate with the newly created
   * SAP process.
   *
   * @param {string} hostName : hostName used to connect to SAPD service
   * @param {Number} port : PORT on which remote SAPD service is running
   * @returns a Socket object connected to the remote SAP process.
   * @memberof SapClient
   */
  connect(port, hostName) {
    return this.mtssock.connect(port, hostName);
  }

  init() {
    this.allFiles = { schedFile: { controlRecord: {}, queues: [] } };
  }

  /**
   * function to read the file from the SAP process using mtssock read method based on the service request
   *
   * @param {Number} serviceRequest : request to send to SAP service specifying what action we need to perform
   * @returns a javascript object containing all 3 files
   * @memberof SapClient
   */
  async read(serviceRequest) {
    await this.mtssock.read(serviceRequest, this);
    return this.allFiles;
  }

  /**
   * wrapper function to return SCHED file from SAP process
   *
   * @returns a javascript object containing the schedFile
   * @memberof SapClient
   */
  async readSchedFile() {
    const res = await this.read(MTSServiceConstants.MTS_SERVICE_VIEW_SCHEDULE_FILE_ONLY);
    return res.schedFile;
  }

  /**
   * function to parse the data read from SAP socket and store into Javascript object
   *
   * @param {*} recordData : data from the SAP socket that must be parsed
   * @param {*} numberofFilesRead : the count of files read from the SAP socket
   * @returns a javascript object containing the required values of control record.
   * @memberof SapClient
   */
  parseData(recordData, numberofFilesRead) {
    if (recordData !== null) {
      if (numberofFilesRead === 0) {
        const recordType = recordData[SAPClientConstants.RECORD_TYPE_INDEX];
        if (recordType === SAPClientConstants.CONTROL_RECORD_TYPE) {
          controlRecordUtils.parseControlRecord(recordData, this);
        } else if (recordType === StreamRecordConstants.STREAM_RECORD_TYPE) {
          streamRecordUtils.parseStreamRecord(recordData, this);
        } else if (recordType === JobRecordConstants.JOB_RECORD_TYPE) {
          jobRecordUtils.parseJobRecord(recordData, this);
        } else if (recordType === QueueConstants.QUEUE_RECORD_TYPE) {
          queueRecordUtils.parseQueueRecord(recordData, this);
        } else if (recordType === StreamPredecessorsConstants.STREAM_PREDECESSOR_RECORD_TYPE) {
          streamPredecessorsUtils.parseStreamPredecessor(recordData, this);
        } else if (recordType === JobPredecessorsConstants.JOB_PREDECESSOR_RECORD_TYPE) {
          jobPredecessorUtils.parseJobPredecessor(recordData, this);
        }
      } else if (numberofFilesRead === 1) {
        taskRecordUtils.parseTaskRecord(recordData, this);
      } else if (numberofFilesRead === 2) {
        notifRecordUtils.parseNotifRecord(recordData, this);
      }
    }
    return this.allFiles;
  }

  /**
   * wrapper function to read SCHED, NOTIFICATION and TASK files from SAP process
   *
   * @returns a javascript object containing all Sched, notification and Task Files
   * @memberof SapClient
   */
  async readAllFiles() {
    const res = await this.read(MTSServiceConstants.MTS_SERVICE_VIEW);
    return res;
  }
}

export default SapClient;
