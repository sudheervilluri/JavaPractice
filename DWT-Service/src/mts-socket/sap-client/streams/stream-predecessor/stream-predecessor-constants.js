/**
 * class defining constants used for parsing Stream Predecessor Records
 *
 * @class StreamPredecessorsConstants
 */
class StreamPredecessorsConstants {
  static get STREAM_PREDECESSOR_RECORD_TYPE() {
    return '5';
  }

  static get BEGINNING_OF_PARENT_STREAM_NAME() {
    return 5;
  }

  static get END_OF_PARENT_STREAM_NAME() {
    return 15;
  }

  static get BEGINNING_OF_STREAM_NAME() {
    return 22;
  }

  static get END_OF_STREAM_NAME() {
    return 30;
  }
}
export default StreamPredecessorsConstants;
