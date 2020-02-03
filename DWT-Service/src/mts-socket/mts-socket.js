import net from 'net';
import { getDataBufferSize, generateMTSServiceRequest } from './utilities/mts-service-request';
import MTSServiceConstants from './utilities/mts-service-constants';

/**
 * Class to connect to Remote SAP process and read/write to remote socket
 *
 * @export
 * @class MTSsock
 */
export default class MTSsock {
  constructor() {
    this.socket = null;
  }

  /**
   * function to connect to remote SAPD service using port and hostName
   * SAPD in turn creates a new SAP process for further communication
   *
   * @param {Number} port : PORT of SAPD service
   * @param {string} hostName : hostName of SAPD service
   * @returns a Socket used to communicate with the newly created SAP service
   * @memberof MTSsock
   */
  connect(port, hostName) {
    if (port === null || port === '' || port === undefined) {
      throw new Error('Invalid port number used while connecting to SAPD');
    }

    if (hostName === null || hostName === '' || hostName === undefined) {
      throw new Error('Invalid hostName used while connecting to SAPD');
    }

    this.socket = new net.Socket();
    const socket = this.socket.connect(port, hostName);
    return socket;
  }

  /**
   * function to write data to the remote SAP socket,
   * we first write length of the data and then the actual data is written to the Socket
   *
   * @param {*} data : data to be written to the Socket
   * @memberof MTSsock
   */
  writeToSocket(data) {
    const bufferSize = getDataBufferSize(data);
    this.socket.write(bufferSize);
    this.socket.write(data);
  }

  /**
   * function to read from the SAP socket using a MTS service request
   *
   * @param {Number} mtsServiceRequestCode : MTSService request to tell SAP what action is being performed
   * @param {SapClient} sapClient : sapClient object to parseData and store it in a javascript object
   * @returns a promise which is rejected if there is an error while reading and resolves the promise once reading is complete
   * @memberof MTSsock
   */
  read(mtsServiceRequestCode, sapClient) {
    return new Promise((resolve, reject) => {
      this.socket.on('error', err => {
        this.socket.end();
        reject(new Error(err));
      });
      generateMTSServiceRequest(mtsServiceRequestCode, this, sapClient);
      this.readFromSocket(resolve, mtsServiceRequestCode, sapClient);
    });
  }

  /**
   * Read file from socket one record at a time, the size of the incoming record is read first to make a bufferSize large
   * enough to read the entire incoming record.
   *
   * @param {function} resolve : to resolve the promise for completing read action
   * @param {Number} mtsServiceRequestCode : MTS service request code specifying type of action
   * @param {SapClient} sapClient : SapClient object used to call parseData method to parse data from the files
   * @memberof MTSsock
   */
  readFromSocket(resolve, mtsServiceRequestCode, sapClient) {
    let bufferSize = 0;
    let isLength = true;
    let numberofFilesRead = 0;
    this.socket.on('readable', () => {
      let data = '';
      while (data !== null) {
        if (isLength === true) {
          // read incoming records size
          data = this.socket.read(5);
          if (data !== null) {
            const size = data.toString().replace(/^0+/, '');
            bufferSize = parseInt(size, 10);
            // set the flag to false since next record is Data
            isLength = false;
          }
        } else {
          // use bufferSize created earlier to read the incoming data
          data = this.socket.read(bufferSize);
          if (data !== null) {
            // next incoming record
            isLength = true;
            const quoteRegexExpression = new RegExp('\uFFFD', 'g');
            const record = data.toString().replace(quoteRegexExpression, '\xb6');
            if (record.includes('!END!')) {
              // check for end of file
              numberofFilesRead += 1;
            }

            if (
              mtsServiceRequestCode === MTSServiceConstants.MTS_SERVICE_VIEW &&
              numberofFilesRead === 3
            ) {
              // end connection since we have completed Reading Sched, Task and Notification Files
              this.endConnection(resolve, 'Completed Reading Sched, Task and Notification Files');
            } else if (
              mtsServiceRequestCode === MTSServiceConstants.MTS_SERVICE_VIEW_SCHEDULE_FILE_ONLY &&
              numberofFilesRead === 1
            ) {
              // end connection since we have completed Reading the Sched file
              this.endConnection(resolve, 'Completed Reading the Sched file');
            }
            // parse the record
            if (!(record.includes('!BEGIN!') || record.includes('!END!'))) {
              sapClient.parseData(record, numberofFilesRead);
            }
          }
        }
      }
    });
  }

  /**
   * function to end the socket connection after completing all socket communication
   *
   * @param {function} resolve : callback to be executed after ending the connection to resolve the promise for read
   * @param {string} msg : call back msg
   * @memberof MTSsock
   */
  endConnection(resolve, msg) {
    this.socket.end(() => {
      resolve(msg);
    });
  }
}
