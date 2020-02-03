import BulkTransactionLoadConstants from './bulk-transaction-load-constants';
import bulkTransactionLoadUtils from './bulk-transaction-load-utils';

const parseEmbeddedHeaderDetails = parameterList => {
  const jobDetailsParamList = [];

  parameterList.forEach(param => {
    const paramObj = {};
    const paramter = {};
    const parameterResult = param.split(' ');
    switch (parameterResult[0]) {
      case BulkTransactionLoadConstants.TOKEN_USER:
        paramter.name = BulkTransactionLoadConstants.CREATED_BY;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_FILE:
        paramter.name = BulkTransactionLoadConstants.FILE_NAME;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_HEADER:
        paramter.name = BulkTransactionLoadConstants.TRANSACTION_HEADER;
        paramObj.parameter = paramter;
        paramObj.value = bulkTransactionLoadUtils.getHeaderType(parameterResult[1]);
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_FORMAT:
        paramter.name = BulkTransactionLoadConstants.TRANSACTION_FORMAT;
        paramObj.parameter = paramter;
        paramObj.value = bulkTransactionLoadUtils.getFormatType(parameterResult[1]);
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_ROW_TERMINATOR:
        paramter.name = BulkTransactionLoadConstants.ROW_TERMINATOR;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      default:
        break;
    }
  });
  return jobDetailsParamList;
};

const parseGeneratedHeaderDetails = parameterList => {
  const jobDetailsParamList = [];
  parameterList.forEach(param => {
    const paramObj = {};
    const paramter = {};
    const parameterResult = param.split(' ');

    switch (parameterResult[0]) {
      case BulkTransactionLoadConstants.TOKEN_USER:
        paramter.name = BulkTransactionLoadConstants.CREATED_BY;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_FILE:
        paramter.name = BulkTransactionLoadConstants.FILE_NAME;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_HEADER:
        paramter.name = BulkTransactionLoadConstants.TRANSACTION_HEADER;
        paramObj.parameter = paramter;
        paramObj.value = bulkTransactionLoadUtils.getHeaderType(parameterResult[1]);
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_FORMAT:
        paramter.name = BulkTransactionLoadConstants.TRANSACTION_FORMAT;
        paramObj.parameter = paramter;
        paramObj.value = bulkTransactionLoadUtils.getFormatType(parameterResult[1]);
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_ROW_TERMINATOR:
        paramter.name = BulkTransactionLoadConstants.ROW_TERMINATOR;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_TRANTYPE:
        paramter.name = BulkTransactionLoadConstants.TRANSACTION_TYPE;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_NULL:
        paramter.name = BulkTransactionLoadConstants.NULL_CHARACTER;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_FIELD_TERMINATOR:
        paramter.name = BulkTransactionLoadConstants.FIELD_TERMINATOR;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_COLOUMN_DELIMITOR:
        paramter.name = BulkTransactionLoadConstants.COLUMN_DELIMITER;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_NOT_VALUED:
        paramter.name = BulkTransactionLoadConstants.NOT_VALUED;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_UPDATE_BEHAVIOUR:
        paramter.name = BulkTransactionLoadConstants.UPDATE_BEHAVIOUR;
        paramObj.parameter = paramter;
        [, paramObj.value] = parameterResult;
        jobDetailsParamList.push(paramObj);
        break;
      case BulkTransactionLoadConstants.TOKEN_ACTION:
        paramter.name = BulkTransactionLoadConstants.ACTION;
        paramObj.parameter = paramter;
        paramObj.value = bulkTransactionLoadUtils.getAction(parameterResult[1]);
        jobDetailsParamList.push(paramObj);
        break;
      default:
        break;
    }
  });
  return jobDetailsParamList;
};

const bulkTransactionLoadJobType = {
  parseEmbeddedHeaderDetails,
  parseGeneratedHeaderDetails
};

export default bulkTransactionLoadJobType;
