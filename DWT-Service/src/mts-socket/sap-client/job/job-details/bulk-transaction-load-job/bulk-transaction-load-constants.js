/**
 * class defining constants used for parsing task file Records
 *
 * @class BulkTransactionLoadConstants
 */

class BulkTransactionLoadConstants {
  static get BULK_TRANSACTION_LOAD_JOB_TYPE_ID() {
    return '170';
  }

  static get UTF8_PILCROW_SIGN() {
    return '\xb6';
  }

  static get EMBEDDED_HEADER() {
    return '-h E';
  }

  static get GENERATED_HEADER() {
    return '-h G';
  }

  static get TOKEN_USER() {
    return '-U';
  }

  static get CREATED_BY() {
    return 'Created by';
  }

  static get TOKEN_HEADER() {
    return '-h';
  }

  static get TRANSACTION_HEADER() {
    return 'Transaction Header';
  }

  static get TOKEN_FILE() {
    return '-f';
  }

  static get FILE_NAME() {
    return 'File name';
  }

  static get TOKEN_FORMAT() {
    return '-F';
  }

  static get TRANSACTION_FORMAT() {
    return 'Transaction Format';
  }

  static get TOKEN_ROW_TERMINATOR() {
    return '-r';
  }

  static get ROW_TERMINATOR() {
    return 'Row terminator';
  }

  static get TOKEN_TRANTYPE() {
    return '-t';
  }

  static get TRANSACTION_TYPE() {
    return 'Transaction Type';
  }

  static get TOKEN_NULL() {
    return '-N';
  }

  static get NULL_CHARACTER() {
    return 'Null Character';
  }

  static get TOKEN_FIELD_TERMINATOR() {
    return '-T';
  }

  static get FIELD_TERMINATOR() {
    return 'Field Terminator';
  }

  static get TOKEN_COLOUMN_DELIMITOR() {
    return '-c';
  }

  static get COLUMN_DELIMITER() {
    return 'Column Delimiter';
  }

  static get TOKEN_NOT_VALUED() {
    return '-v';
  }

  static get NOT_VALUED() {
    return 'Not Valued';
  }

  static get TOKEN_UPDATE_BEHAVIOUR() {
    return '-b';
  }

  static get UPDATE_BEHAVIOUR() {
    return 'Update Behavior';
  }

  static get TOKEN_ACTION() {
    return '-a';
  }

  static get ACTION() {
    return 'Action';
  }

  static get HEADER_IS_EMBEDDED() {
    return 'E';
  }

  static get HEADER_IS_GENERATED() {
    return 'G';
  }

  static get FORMAT_IS_FIXED() {
    return 'F';
  }

  static get FORMAT_IS_DELIMITED() {
    return 'S';
  }

  static get EMBEDDED() {
    return 'Embedded';
  }

  static get GENERATED() {
    return 'Generated';
  }

  static get FIXED() {
    return 'Fixed';
  }

  static get DELIMITED() {
    return 'Delimited';
  }

  static get ACTION_CODE_FOR_DELETE() {
    return '005';
  }

  static get DELETE() {
    return 'Delete';
  }

  static get ACTION_CODE_FOR_ADD() {
    return '010';
  }

  static get ADD() {
    return 'Add';
  }

  static get ACTION_CODE_FOR_ADD_UPDATE() {
    return '012';
  }

  static get ADD_UPDATE() {
    return 'Add/Update';
  }

  static get ACTION_CODE_FOR_UPDATE() {
    return '020';
  }

  static get UPDATE() {
    return 'Update';
  }

  static get ACTION_CODE_FOR_UPDATE_ADD() {
    return '021';
  }

  static get UPDATE_ADD() {
    return 'Update/Add';
  }
}

export default BulkTransactionLoadConstants;
