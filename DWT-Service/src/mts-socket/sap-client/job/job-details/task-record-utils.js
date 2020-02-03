import TaskRecordUtilsConstants from './task-record-utils-constants';
import jobDetailsUtils from './job-details-utils';
import bulkTransactionLoadJobType from './bulk-transaction-load-job/bulk-transaction-load';
import bulkTransactionLoadJobConstants from './bulk-transaction-load-job/bulk-transaction-load-constants';

const parseTaskRecordPositionType = (taskRecordParamString, jobParamConfig, jobDefinition) => {
  const jobDetailsParamList = [];
  const jobDetailsList = taskRecordParamString.split(jobParamConfig.parameterSeparator);

  const parameterList = jobDefinition.parameters;

  parameterList.forEach((param, i) => {
    const parameterObj = {};
    parameterObj.parameter = param;
    parameterObj.value = jobDetailsList[i + 2];
    jobDetailsParamList.push(parameterObj);
  });

  return jobDetailsParamList;
};

const parseTaskRecordPrefixType = (taskRecordParamString, prefixIdentifier, jobDefinition) => {
  const jobDetailsParamList = [];
  const paramList = taskRecordParamString.split(' ');

  const parametersList = jobDefinition.parameters;

  parametersList.forEach(parameter => {
    const parameterResult =
      paramList[
        paramList.findIndex(param => param === `${prefixIdentifier}${parameter.details.prefix}`) + 1
      ];
    const parameterObj = {};
    parameterObj.parameter = parameter;
    parameterObj.value = parameterResult;
    jobDetailsParamList.push(parameterObj);
  });

  return jobDetailsParamList;
};

const parseTaskRecord = (taskRecord, sapClient) => {
  const taskRecordObject = {};
  const jobName = taskRecord
    .substring(
      TaskRecordUtilsConstants.JOB_NAME_START_INDEX,
      TaskRecordUtilsConstants.JOB_NAME_END_INDEX
    )
    .trim();
  const jobType = taskRecord
    .substring(
      TaskRecordUtilsConstants.JOB_TYPE_START_INDEX,
      TaskRecordUtilsConstants.JOB_TYPE_END_INDEX
    )
    .trim();

  const jobDefinition = jobDetailsUtils.getJobDefinition(jobType, sapClient.jobTypeMap);

  const { details } = jobDefinition;

  let jobDetailsParamList = [];

  let taskRecordParamString = jobDetailsUtils.getParamString(taskRecord);

  const jobParams = jobDetailsUtils.getJobParams(taskRecordParamString);

  const jobParamConfig = jobDetailsUtils.getJobParamConfig(taskRecordParamString);

  taskRecordParamString = jobDetailsUtils.removeQuoteCharacter(
    jobParams,
    jobParamConfig.parameterQuoteCharacter
  );

  if (
    jobParamConfig.parameterIdentifier ===
    TaskRecordUtilsConstants.PARAMETER_IDENTIFIER_CHARACTER_POSITIONAL
  ) {
    jobDetailsParamList = parseTaskRecordPositionType(
      taskRecordParamString,
      jobParamConfig,
      jobDefinition
    );
  } else if (
    jobParamConfig.parameterIdentifier ===
      TaskRecordUtilsConstants.PARAMETER_IDENTIFIER_CHARACTER_PREFIX &&
    details !== undefined
  ) {
    jobDetailsParamList = parseTaskRecordPrefixType(
      taskRecordParamString,
      details.prefixIdentifier,
      jobDefinition
    );
  } else if (jobType === bulkTransactionLoadJobConstants.BULK_TRANSACTION_LOAD_JOB_TYPE_ID) {
    const parameterList = taskRecordParamString.split(
      bulkTransactionLoadJobConstants.UTF8_PILCROW_SIGN
    );

    if (parameterList.indexOf(bulkTransactionLoadJobConstants.EMBEDDED_HEADER) > -1) {
      jobDetailsParamList = bulkTransactionLoadJobType.parseEmbeddedHeaderDetails(parameterList);
    } else if (parameterList.indexOf(bulkTransactionLoadJobConstants.GENERATED_HEADER) > -1) {
      jobDetailsParamList = bulkTransactionLoadJobType.parseGeneratedHeaderDetails(parameterList);
    }
  }

  taskRecordObject.databaseName = sapClient.databaseName;
  taskRecordObject.dbServerName = sapClient.dbServerName;

  taskRecordObject.jobType = jobType;
  taskRecordObject.jobDetails = jobDetailsParamList;

  let breakFlag = false;

  /* eslint-disable no-restricted-syntax */
  for (const queue of sapClient.allFiles.schedFile.queues) {
    for (const stream of queue.streams) {
      const job = stream.jobs.get(jobName);

      if (job !== undefined) {
        job.jobDefinition = taskRecordObject;
        breakFlag = true;
      }

      if (breakFlag === true) break;
    }
    if (breakFlag === true) break;
  }
  /* eslint-enable no-restricted-syntax */
};

const taskRecordUtils = {
  parseTaskRecord
};

export default taskRecordUtils;
