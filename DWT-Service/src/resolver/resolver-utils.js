import ResolverConstants from './resolver-constants';
import sharedUtils from '../shared/shared-utils';

/**
 * function to get the parameters of the stored procedure job type
 * @param dataBaseUtils database object
 * @param jobName name of the job
 * @returns a list of parameters for stored procedure job type
 */
const getJobDetailsForStoredProcedureType = async (dataBaseUtils, jobName) => {
  const jobDetailsList = [];
  let storedProcedureJobTypeDBList = [];

  let storedProcJobTypeQuery = ResolverConstants.JOB_DETAILS_QUERY_FOR_STORED_PROCEDURE_JOB_TYPE;
  storedProcJobTypeQuery = storedProcJobTypeQuery.replace('%jobName%', jobName.trim());

  // get the user id, objectName and object id
  try {
    storedProcedureJobTypeDBList = await dataBaseUtils.getExecuteQuery(storedProcJobTypeQuery);
  } catch (err) {
    throw new Error(`Error occured while executing the query storedProcJobTypeQuery ${err.message}`);
  }

  storedProcedureJobTypeDBList.forEach(storedProcedureJobType => {
    if (storedProcedureJobType.userid) {
      const jobDetails = {};
      const parameter = {};
      parameter.name = ResolverConstants.CREATED_BY;
      jobDetails.parameter = parameter;
      jobDetails.value = storedProcedureJobType.userid;
      jobDetailsList.push(jobDetails);
    }

    // append the owner user id and object name to get the complete object name
    if (storedProcedureJobType.owner_userid && storedProcedureJobType.obj_name) {
      const jobDetails = {};
      const parameter = {};
      parameter.name = ResolverConstants.OBJECT_NAME;
      jobDetails.parameter = parameter;
      jobDetails.value = `${storedProcedureJobType.owner_userid}.${
        storedProcedureJobType.obj_name
      }`;
      jobDetailsList.push(jobDetails);
    }

    if (storedProcedureJobType.obj_id) {
      const jobDetails = {};
      const parameter = {};
      parameter.name = ResolverConstants.OBJECT_ID;
      jobDetails.parameter = parameter;
      jobDetails.value = storedProcedureJobType.obj_id;
      jobDetailsList.push(jobDetails);
    }
  });

  let storedProcedureJobTypeParametersDBList = [];

  let jobTypeQueryForStoredProcedure =
    ResolverConstants.JOB_PARAM_QUERY_FOR_STORED_PROCEDURE_JOB_TYPE;
  jobTypeQueryForStoredProcedure = jobTypeQueryForStoredProcedure.replace(
    '%jobName%',
    jobName.trim()
  );

  try {
    storedProcedureJobTypeParametersDBList = await dataBaseUtils.getExecuteQuery(
      jobTypeQueryForStoredProcedure
    );
  } catch (err) {
    throw new Error(`Error occured while executing the query jobTypeQueryForStoredProcedure ${err.message}`);
  }

  storedProcedureJobTypeParametersDBList.forEach(storedProcedureJobTypeParameter => {
    const jobDetails = {};
    const parameter = {};
    parameter.name = storedProcedureJobTypeParameter.parm_name;
    jobDetails.parameter = parameter;
    jobDetails.value = storedProcedureJobTypeParameter.actl_val;
    jobDetailsList.push(jobDetails);
  });

  return jobDetailsList;
};

/**
 * function to get the parameters of the cluster job type
 * @param dataBaseUtils database object
 * @param jobTypeQuery query to get the parameters of the job from database
 * @returns a list of parameters for cluster job type
 */
const getJobDetailsForClusterType = async (dataBaseUtils, jobTypeQuery) => {
  let clusterJobTypeDBList = [];
  const jobDetailsList = [];

  try {
    clusterJobTypeDBList = await dataBaseUtils.getExecuteQuery(jobTypeQuery);
  } catch (err) {
    throw new Error(`Error occured while executing the query jobTypeQuery ${err.message}`);
  }

  clusterJobTypeDBList.forEach(clusterJobType => {
    const jobDetails = {};
    const parameter = {};
    parameter.name = clusterJobType.parm_name;
    jobDetails.parameter = parameter;
    jobDetails.value = clusterJobType.actl_val;
    jobDetailsList.push(jobDetails);
  });

  return jobDetailsList;
};

/**
 * function to get the parameters of the OLAP Cube job type
 * @param dataBaseUtils database object
 * @param jobTypeQuery query to get the parameters of the job from database
 * @returns a list of parameters for OLAP cube job type
 */
const getJobDetailsForOlapCubeType = async (dataBaseUtils, jobTypeQuery) => {
  let olapCubeJobTypeDBList = [];
  const jobDetailsList = [];
  const parseClient = sharedUtils.getPropertyClient();
  const getOlapServerName = await parseClient.getProperty('OLAP', 'Server');
  try {
    olapCubeJobTypeDBList = await dataBaseUtils.getExecuteQuery(jobTypeQuery);
  } catch (err) {
    throw new Error(`Error occured while executing the query jobTypeQuery ${err.message}`);
  }

  olapCubeJobTypeDBList.forEach(job => {
    const jobDetails = {};
    const parameter = {};

    parameter.name = job.parm_name;
    jobDetails.parameter = parameter;
    jobDetails.value = job.actl_val;

    jobDetailsList.push(jobDetails);
  });
  const jobDetails = {};
  const parameter = {};
  parameter.name = ResolverConstants.OLAP_CUBE_SERVER_NAME;
  jobDetails.parameter = parameter;
  jobDetails.value = getOlapServerName;

  jobDetailsList.push(jobDetails);

  return jobDetailsList;
};

/**
 * function to get the parameters of the Crystal report job type when OMS in not installed
 * @param dataBaseUtils database object
 * @param jobTypeQuery query to get the parameters of the job from database
 * @returns a list of parameters for crystal report job type without OMS
 */
const getJobTypeDetailsForCrystalReportWithoutOMSType = async (dataBaseUtils, jobTypeQuery) => {
  let crystalReportJobTypeDBList = [];
  const jobDetailsList = [];
  try {
    crystalReportJobTypeDBList = await dataBaseUtils.getExecuteQuery(jobTypeQuery);
  } catch (err) {
    throw new Error(`Error occured while executing the query for jobTypeQuery ${err.message}`);
  }

  crystalReportJobTypeDBList.forEach(job => {
    const jobDetails = {};
    const parameter = {};

    parameter.name = job.parm_name;
    jobDetails.parameter = parameter;
    jobDetails.value = job.actl_val;

    jobDetailsList.push(jobDetails);
  });

  return jobDetailsList;
};

const resolverUtils = {
  getJobDetailsForStoredProcedureType,
  getJobDetailsForClusterType,
  getJobDetailsForOlapCubeType,
  getJobTypeDetailsForCrystalReportWithoutOMSType
};

export default resolverUtils;
