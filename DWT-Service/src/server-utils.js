import sharedUtils from './shared/shared-utils';

/**
 * function to change the case of first letter of a string
 * @param string
 * @returns a string with the first letter being lowercase
 */
const firstLetterToLowerCase = string => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

/**
 * function to convert a map into object
 * @param map
 * @returns an object
 */
const convertMapToObject = map => {
  const obj = Object.create(null);
  /* eslint-disable no-restricted-syntax */
  for (const [k, v] of map) {
    if (k === 'Default') {
      obj.defaultValue = v;
    } else if (k === 'Case') {
      obj.caseValue = v;
    } else {
      obj[firstLetterToLowerCase(k)] = v;
    }
  }
  /* eslint-enable no-restricted-syntax */
  return obj;
};

/**
 * function to get the job type map from XML file
 * @returns a map of job types
 */

const getJobTypeMap = async () => {
  const jobType = new Map();
  const parseClient = sharedUtils.getPropertyClient();
  const jobTypeMap = await parseClient.getProperty('Job Types');

  const iterator = jobTypeMap.keys();
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < jobTypeMap.size; i += 1) {
    const jobTypeId = iterator.next().value;
    const jobTypeName = jobTypeMap.get(jobTypeId);

    const jobTypeDetail = await parseClient.getProperty(`${jobTypeId} Job Detail`);
    let parameters = [];
    let jobRules = [];

    if (jobTypeDetail !== undefined) {
      jobRules = convertMapToObject(jobTypeDetail);
    }

    const jobParameters = await parseClient.getProperty(`${jobTypeId} Parameters`);
    const jobParameteList = [];

    if (jobParameters !== undefined) {
      const paramIterator = jobParameters.keys();

      for (let j = 0; j < jobParameters.size; j += 1) {
        const paramNumber = paramIterator.next().value;
        const name = jobParameters.get(paramNumber);

        const paramRuleMap = await parseClient.getProperty(`${name}`);
        const parameterRules = convertMapToObject(paramRuleMap);
        const paramObj = {};
        paramObj.name = name;
        paramObj.details = parameterRules;

        jobParameteList.push(paramObj);
      }
      parameters = jobParameteList;
    }

    const jobTypeobj = {};
    jobTypeobj.id = jobTypeId;
    jobTypeobj.name = jobTypeName;
    jobTypeobj.details = jobRules;
    jobTypeobj.parameters = parameters;

    jobType.set(jobTypeId, jobTypeobj);
  }
  /* eslint-enable no-await-in-loop */
  return jobType;
};

/**
 * function to get the map of predecessor streams with the parent stream names as value and predecessor stream name as key
 * @param allFiles : JSON object returned after reading the sched file
 * @returns a map of predecessor streams
 */
const getStreamObject = schedFile => {
  // Reading the sched file
  const listOfAllStreams = [];
  schedFile.queues.forEach(queue => {
    queue.streams.forEach(stream => {
      listOfAllStreams.push(stream);
    });
  });

  // Create a Map of predecessor streams with the parent stream names as value and predecessor stream name as key
  const streamPredecessorMap = new Map();
  listOfAllStreams.forEach(stream => {
    stream.predecessors.forEach(predecessor => {
      streamPredecessorMap.set(
        predecessor.streamOrJobName.trim(),
        sharedUtils.checkIfPredecessorAlreadyExistsInMap(
          stream.streamName,
          streamPredecessorMap.get(predecessor.streamOrJobName.trim())
        )
      );
    });
  });
  const streamObject = {};
  streamObject.listOfAllStreams = listOfAllStreams;
  streamObject.streamPredecessorMap = streamPredecessorMap;
  return streamObject;
};

const loadSchedule = async (sapClient, sapPort, dssServerName) => {
  try {
    await sapClient.connect(sapPort, dssServerName);
  } catch (error) {
    throw new Error(
      `Error while trying to establish the connection of the ${dssServerName} with a ${sapPort} due to ${
        error.message
      }`
    );
  }
  // JSON object returned after reading the sched file.
  let allFiles;
  try {
    sapClient.init();
    allFiles = await sapClient.readAllFiles();
  } catch (error) {
    throw new Error(`Error while reading the scheduler files due to ${error.message}`);
  }
  return allFiles.schedFile;
};

const serverStartupUtils = {
  getStreamObject,
  getJobTypeMap,
  firstLetterToLowerCase,
  convertMapToObject,
  loadSchedule
};

export default serverStartupUtils;
