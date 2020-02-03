import TaskRecordUtilsConstants from './task-record-utils-constants';

const getJobDefinition = (jobType, jobTypeMap) => {
  const result = jobTypeMap.get(jobType);
  return result;
};

const removeQuoteCharacter = (taskRecord, parameterQuoteCharacter) => {
  // eslint-disable-next-line no-useless-escape
  const quoteRegexPattern = parameterQuoteCharacter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const quoteRegexExpression = new RegExp(quoteRegexPattern, 'g');
  return taskRecord.replace(quoteRegexExpression, '');
};

const getNthOccurrence = (string, subString, index) => {
  return string.split(subString, index).join(subString).length;
};

const getParamString = taskRecord => {
  return taskRecord.substring(
    taskRecord.indexOf(TaskRecordUtilsConstants.TASK_RECORD_DELIMITER) + 1,
    taskRecord.lastIndexOf(TaskRecordUtilsConstants.TASK_RECORD_DELIMITER)
  );
};

const getJobParams = paramString => {
  return paramString.substring(
    getNthOccurrence(paramString, TaskRecordUtilsConstants.TASK_RECORD_QUOTE, 1) + 1,
    getNthOccurrence(paramString, TaskRecordUtilsConstants.TASK_RECORD_QUOTE, 2)
  );
};

const getJobParamConfig = paramString => {
  const jobDetailsParameterConfigString = paramString.substring(
    getNthOccurrence(paramString, TaskRecordUtilsConstants.TASK_RECORD_QUOTE, 3) + 1,
    getNthOccurrence(paramString, TaskRecordUtilsConstants.TASK_RECORD_QUOTE, 4)
  );

  const jobDetailsParameterConfig = {};

  jobDetailsParameterConfig.parameterIdentifier = jobDetailsParameterConfigString.charAt(
    TaskRecordUtilsConstants.PARAMETER_INDENTIFIER_INDEX
  );
  jobDetailsParameterConfig.parameterSeparator = jobDetailsParameterConfigString.charAt(
    TaskRecordUtilsConstants.PARAMETER_SEPARATOR_INDEX
  );
  jobDetailsParameterConfig.parameterQuoteCharacter = jobDetailsParameterConfigString.charAt(
    TaskRecordUtilsConstants.PARAMETER_QUOTE_CHARACTER_INDEX
  );

  return jobDetailsParameterConfig;
};

const jobDetailsUtils = {
  getJobDefinition,
  removeQuoteCharacter,
  getJobParams,
  getJobParamConfig,
  getParamString,
  getNthOccurrence
};

export default jobDetailsUtils;
