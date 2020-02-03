/**
 * class defining constants used for parsing notif record
 *
 * @class NotifConstants
 */
class NotifConstants {
  static get BEGINNING_OF_STREAM_OR_JOB_IDENTIFIER() {
    return 3;
  }

  static get END_OF_STREAM_OR_JOB_IDENTIFIER() {
    return 4;
  }

  static get EMAIL_ADDRESS() {
    return 7;
  }

  static get IDENTIFIER_OF_STREAM() {
    return 'S';
  }

  static get IDENTIFIER_OF_JOB() {
    return 'J';
  }
}
export default NotifConstants;
