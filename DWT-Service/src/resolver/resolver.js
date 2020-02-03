import path from 'path';
import dateFormat from 'dateformat';
import scheduleOccurrenceUtils from '../mts-socket/sap-client/schedule/schedule-occurrence-utils';
import ScheduleDetailsConstants from '../mts-socket/sap-client/schedule/schedule-details-constants';
import utils from '../mts-socket/utilities/util';
import ControlRecordConstants from '../mts-socket/sap-client/control-record/control-record-constants';
import sharedUtils from '../shared/shared-utils';
import ResolverConstants from './resolver-constants';
import serverUtils from '../server-utils';
import schedularValidator from '../validator';
import bulkTransactionLoadUtils from '../mts-socket/sap-client/job/job-details/bulk-transaction-load-job/bulk-transaction-load-utils';
import resolverUtils from './resolver-utils';

const dssPropertyLocation = process.env.DSSPropertyLocation;
const dateExpression = 'ddd, mmm dd, yyyy HH:MM:ss';
const timeZone = 'Z';

class Resolver {
  constructor(sapClient, streamPredecessorMap, listOfAllStreams) {
    this.sched = sapClient.allFiles.schedFile;
    this.sapClient = sapClient;
    this.streamPredecessorMap = streamPredecessorMap;
    this.listOfAllStreams = listOfAllStreams;
  }

  /**
   * Resolvers for graphql used to query and mutations.
   *
   * @param {*} sched : sched is the json object containing the records parsed from sched file.
   */
  rootResolver(dataBaseUtils, jobTypeMap, dssServerName, sapPort) {
    const resolvers = {
      Query: {
        refreshScheduler: async () => {
          try {
            this.sched = await serverUtils.loadSchedule(this.sapClient, sapPort, dssServerName);
          } catch (error) {
            throw new Error(
              `Error while trying to establish the connection of the ${dssServerName} with a ${sapPort} due to ${
                error.message
              }`
            );
          }
          const streamObj = serverUtils.getStreamObject(this.sched);
          const { streamPredecessorMap, listOfAllStreams } = streamObj;
          this.streamPredecessorMap = streamPredecessorMap;
          this.listOfAllStreams = listOfAllStreams;
          if (this.sched !== undefined && this.streamPredecessorMap !== undefined) {
            return true;
          }
          return false;
        },

        /* This function acts as resolver for graphql to fetch the control record data using the json object 
       containig the sched file records. */

        controlRecord: () => {
          const clonedData = JSON.parse(JSON.stringify(this.sched));
          const copyOfControlRecord = clonedData.controlRecord;
          copyOfControlRecord.schedulerLogFilePath = path.resolve(
            dssPropertyLocation,
            copyOfControlRecord.schedulerLogFilePath
          );
          copyOfControlRecord.taskFilePath = path.resolve(
            dssPropertyLocation,
            copyOfControlRecord.taskFilePath
          );
          copyOfControlRecord.checkpointDirectoryPath = path.resolve(
            dssPropertyLocation,
            copyOfControlRecord.checkpointDirectoryPath
          );
          copyOfControlRecord.notificationFilePath = path.resolve(
            dssPropertyLocation,
            copyOfControlRecord.notificationFilePath
          );
          return copyOfControlRecord;
        },
        /* This function acts as resolver for graphql to fetch a list of queues using the json object 
       containig the sched file records. */
        queues: (obj, args) => {
          if (args.queueName !== null) {
            let validatedQueueName;
            try {
              validatedQueueName = schedularValidator.numValidator(
                args.queueName.trim(),
                ResolverConstants.MAX_QUEUENAME_LENGTH
              );
            } catch (error) {
              throw new Error(`Error occurred in queues: ${error.message}`);
            }
            const filteredQueue = this.sched.queues.filter(queue => {
              return queue.queueName === validatedQueueName;
            });
            return filteredQueue;
          }
          return this.sched.queues;
        },
        /* This function acts as resolver for graphql to fetch a list of streams using the json object 
       containing the sched file records. */
        streams: () => {
          const copyOfStreams = [];
          this.sched.queues.forEach(queue => {
            queue.streams.forEach(stream => {
              copyOfStreams.push(stream);
            });
          });
          const sortedStreamsList = copyOfStreams.sort((a, b) => {
            const streamNameA = a.streamName.toLowerCase();
            const streamNameB = b.streamName.toLowerCase();
            if (streamNameA < streamNameB) return -1;
            return 1;
          });
          return sortedStreamsList;
        },
        /* This function acts as resolver for graphql to fetch a list of potential streams predecessor using
       the json object containing the sched file records */
        potentialPredecessors: (obj, args) => {
          const potentialPredecessorstreams = [];
          let validatedStreamName = '';
          try {
            validatedStreamName = schedularValidator.asciiValidator(
              args.streamName.trim(),
              ResolverConstants.MAX_STREAMNAME_LENGTH
            );
          } catch (error) {
            throw new Error(`Error occurred in streamName: ${error.message}`);
          }
          const checkedList = sharedUtils.getNonPotentialPredecessorList(
            validatedStreamName,
            this.streamPredecessorMap
          );
          const listOfAllStreamNames = this.listOfAllStreams.map(stream =>
            stream.streamName.trim()
          );
          if (listOfAllStreamNames.indexOf(validatedStreamName) >= 0) {
            this.listOfAllStreams.forEach(stream => {
              if (stream.streamName !== validatedStreamName) {
                if (checkedList.indexOf(stream.streamName.trim()) < 0) {
                  potentialPredecessorstreams.push(stream);
                }
              }
            });
          }
          const potentialPredecessorsortedStreams = potentialPredecessorstreams.sort((a, b) => {
            const streamNameA = a.streamName.toLowerCase();
            const streamNameB = b.streamName.toLowerCase();
            if (streamNameA < streamNameB) return -1;
            return 1;
          });
          return potentialPredecessorsortedStreams;
        },
        /* This function acts as resolver for graphql to fetch a list of potential jobs predecessor using
       the json object containing the sched file records */
        potentialJobPredecessors: (obj, args) => {
          const jobPredecessorMap = new Map();
          let validatedStreamName = '';
          try {
            validatedStreamName = schedularValidator.asciiValidator(
              args.streamName.trim(),
              ResolverConstants.MAX_STREAMNAME_LENGTH
            );
          } catch (error) {
            throw new Error(`Error occurred in streamName: ${error.message}`);
          }
          this.listOfAllStreams.forEach(stream => {
            if (stream.streamName.trim() === validatedStreamName) {
              stream.jobs.forEach(job => {
                job.predecessors.forEach(predecessor => {
                  jobPredecessorMap.set(
                    predecessor.streamOrJobName.trim(),
                    sharedUtils.checkIfPredecessorAlreadyExistsInMap(
                      job.jobName.trim(),
                      jobPredecessorMap.get(predecessor.streamOrJobName.trim())
                    )
                  );
                });
              });
            }
          });

          const potentialPredecessorjobs = [];

          let validatedJobName = '';
          try {
            validatedJobName = schedularValidator.asciiValidator(
              args.jobName.trim(),
              ResolverConstants.MAX_JOBNAME_LENGTH
            );
          } catch (error) {
            throw new Error(`Error occurred in jobName: ${error.message}`);
          }
          const checkedList = sharedUtils.getNonPotentialPredecessorList(
            validatedJobName,
            jobPredecessorMap
          );

          this.listOfAllStreams.forEach(stream => {
            if (stream.streamName.trim() === args.streamName.trim()) {
              if (stream.jobs.has(validatedJobName)) {
                stream.jobs.forEach(job => {
                  if (job.jobName.trim() !== args.jobName) {
                    if (checkedList.indexOf(job.jobName.trim()) < 0) {
                      potentialPredecessorjobs.push(job);
                    }
                  }
                });
              }
            }
          });

          const potentialPredecessorsortedJobs = potentialPredecessorjobs.sort((a, b) => {
            const jobNameA = a.jobName.toLowerCase();
            const jobNameB = b.jobName.toLowerCase();
            if (jobNameA < jobNameB) return -1;
            return 1;
          });

          return potentialPredecessorsortedJobs;
        },
        jobDetails: async (obj, args) => {
          let validatedStreamName = '';
          let validatedJobName = '';
          try {
            validatedStreamName = schedularValidator.asciiValidator(
              args.streamName.trim(),
              ResolverConstants.MAX_STREAMNAME_LENGTH
            );
          } catch (error) {
            throw new Error(`Error occurred in streamName: ${error.message}`);
          }

          try {
            validatedJobName = schedularValidator.asciiValidator(
              args.jobName.trim(),
              ResolverConstants.MAX_JOBNAME_LENGTH
            );
          } catch (error) {
            throw new Error(`Error occurred in jobName: ${error.message}`);
          }

          let job;

          this.listOfAllStreams.forEach(stream => {
            if (stream.streamName.trim() === validatedStreamName) {
              job = stream.jobs.get(validatedJobName);
            }
          });

          let jobTypeQuery = ResolverConstants.JOB_PARAM_QUERY;
          jobTypeQuery = jobTypeQuery.replace('%jobName%', job.jobName);

          if (job.jobDefinition.jobType === ResolverConstants.STORED_PROCEDURE_JOB_TYPE_ID) {
            return resolverUtils.getJobDetailsForStoredProcedureType(dataBaseUtils, args.jobName);
          }
          if (job.jobDefinition.jobType === ResolverConstants.CLUSTER_JOB_TYPE_ID) {
            return resolverUtils.getJobDetailsForClusterType(dataBaseUtils, jobTypeQuery);
          }
          if (job.jobDefinition.jobType === ResolverConstants.OLAP_CUBE_JOB_TYPE_ID) {
            return resolverUtils.getJobDetailsForOlapCubeType(dataBaseUtils, jobTypeQuery);
          }
          if (job.jobDefinition.jobType === ResolverConstants.CRYSTAL_REPORT_JOB_TYPE_ID) {
            return resolverUtils.getJobTypeDetailsForCrystalReportWithoutOMSType(
              dataBaseUtils,
              jobTypeQuery
            );
          }

          return job.jobDefinition.jobDetails;
        },
        /* This function acts as resolver for graphql to fetch a list of job types from the DSS_Properties.xml file */
        jobTypes(obj, args) {
          if (args.id !== null) {
            let validatedJobType;
            try {
              validatedJobType = schedularValidator.numValidator(
                args.id.trim(),
                ResolverConstants.MAX_JOBTYPE_ID_LENGTH
              );
            } catch (error) {
              throw new Error(`Error occurred in id: ${error.message}`);
            }
            const filteredJobType = jobTypeMap.get(validatedJobType);
            return [filteredJobType];
          }
          return jobTypeMap;
        },
        /* This function acts as resolver for graphql to fetch a list of clusters from the database. */
        async clusters() {
          let clusterTypeList = [];

          const ClusterTypeQuery = ResolverConstants.CLUSTER_QUERY;
          try {
            clusterTypeList = await dataBaseUtils.getExecuteQuery(ClusterTypeQuery);
          } catch (err) {
            throw new Error(`Error occured while executing the query ${err.message}`);
          }
          return clusterTypeList;
        },
        /* This function acts as resolver for graphql to fetch a list of OLAP cubes from the database. */
        async olapCube() {
          let olapCubeFromDatabase = [];
          const olapCubeList = [];
          const OlapCubeQuery = ResolverConstants.OLAP_CUBE_QUERY;
          try {
            olapCubeFromDatabase = await dataBaseUtils.getExecuteQuery(OlapCubeQuery);
          } catch (err) {
            throw new Error(`Error occured while executing the query ${err.message}`);
          }
          olapCubeFromDatabase.forEach(olapCubeJob => {
            const olapCube = {};
            olapCube.databaseName = olapCubeJob.DatabaseName;
            olapCube.cubeName = olapCubeJob.CubeName;
            olapCubeList.push(olapCube);
          });
          return olapCubeList;
        },
        /* This function acts as resolver for graphql to fetch a list of transaction types from the database. */
        async transactionType(obj, args) {
          let transactionTypeFromDatabase = [];
          const transactionTypeList = [];
          let transactionTypeQuery = ResolverConstants.TRANSACTION_TYPE_QUERY;
          if (args.format === ResolverConstants.FORMAT_IS_DELIMITED) {
            transactionTypeQuery = transactionTypeQuery.replace('%format%', 0);
            try {
              transactionTypeFromDatabase = await dataBaseUtils.getExecuteQuery(
                transactionTypeQuery
              );
            } catch (err) {
              throw new Error(`Error occured while executing the query ${err.message}`);
            }

            transactionTypeFromDatabase.forEach(transactionType => {
              const transactionTypeObj = {};
              transactionTypeObj.id = transactionType.trans_id;
              transactionTypeObj.caption = transactionType.caption;
              transactionTypeList.push(transactionTypeObj);
            });
          } else if (args.format === ResolverConstants.FORMAT_IS_FIXED) {
            transactionTypeQuery = transactionTypeQuery.replace('%format%', 1);
            try {
              transactionTypeFromDatabase = await dataBaseUtils.getExecuteQuery(
                transactionTypeQuery
              );
            } catch (err) {
              throw new Error(`Error occured while executing the query ${err.message}`);
            }

            transactionTypeFromDatabase.forEach(transactionType => {
              const transactionTypeObj = {};
              transactionTypeObj.id = transactionType.trans_id;
              transactionTypeObj.caption = transactionType.caption;
              transactionTypeList.push(transactionTypeObj);
            });
          }

          return transactionTypeList;
        },
        /* This function acts as resolver for graphql to fetch a list of null character or not valued. */
        nullCharacterOrNotValued: () => {
          return bulkTransactionLoadUtils.getNullCharacterOrNotValued();
        },
        /* This function acts as resolver for graphql to fetch a list of stored procedure object Names */
        async storedProcedureObjectName() {
          const listOfObjectsFromStoredProcedure = [];
          const listOfObjectsFromDbExecDefTable = [];
          let dbListOfObjectsFromStoredProcedure = [];
          let dbListOfObjectsFromDbExecDefTable = [];

          let listOfObjectsFromStoredProcedureQuery =
            ResolverConstants.LIST_OF_OBJECTS_FROM_STORED_PROCEDURE;
          listOfObjectsFromStoredProcedureQuery = listOfObjectsFromStoredProcedureQuery.replace(
            '%databaseName%',
            dataBaseUtils.DatabaseName
          );

          let listOfObjectsFromDbExecDefTableQuery =
            ResolverConstants.LIST_OF_OBJECTS_FROM_EXEC_DEF_TABLE;
          listOfObjectsFromDbExecDefTableQuery = listOfObjectsFromDbExecDefTableQuery.replace(
            '%databaseName%',
            dataBaseUtils.DatabaseName
          );
          listOfObjectsFromDbExecDefTableQuery = listOfObjectsFromDbExecDefTableQuery.replace(
            '%jobTypeId%',
            ResolverConstants.STORED_PROCEDURE_JOB_TYPE_ID
          );

          try {
            dbListOfObjectsFromStoredProcedure = await dataBaseUtils.getExecuteQuery(
              listOfObjectsFromStoredProcedureQuery
            );
          } catch (err) {
            throw new Error(`Error occured while executing the query listOfObjectsFromStoredProcedureQuery ${err.message}`);
          }

          try {
            dbListOfObjectsFromDbExecDefTable = await dataBaseUtils.getExecuteQuery(
              listOfObjectsFromDbExecDefTableQuery
            );
          } catch (err) {
            throw new Error(`Error occured while executing the query listOfObjectsFromDbExecDefTableQuery ${err.message}`);
          }

          dbListOfObjectsFromStoredProcedure.forEach(objectName => {
            listOfObjectsFromStoredProcedure.push(objectName.proc_name);
          });

          dbListOfObjectsFromDbExecDefTable.forEach(listOfObjects => {
            listOfObjectsFromDbExecDefTable.push({
              objectName: `${listOfObjects.owner_userid}.${listOfObjects.obj_name}`,
              objectId: `${listOfObjects.obj_id}`
            });
          });

          const storedProcedureObjectNames = [];
          listOfObjectsFromStoredProcedure.forEach(objectName => {
            listOfObjectsFromDbExecDefTable.forEach(listOfObjects => {
              if (objectName === listOfObjects.objectName) {
                storedProcedureObjectNames.push(listOfObjects);
              }
            });
          });

          return storedProcedureObjectNames;
        },
        /* This function acts as resolver for graphql to fetch the parameters of the stored procedures from database */
        async storedProcedureParameters(obj, args) {
          const listOfColumnsOfObjectName = [];
          const storedProcedureParamaetersList = [];
          let dbListOfParametersOfObjectName = [];
          let dbListOfColumnsOfObjectName = [];
          let validatedObjectId;

          try {
            validatedObjectId = schedularValidator.intValidator(args.objectId);
          } catch (error) {
            throw new Error(`Error occurred in objectId: ${error.message}`);
          }

          let listOfColumnsOfObjectNameQuery = ResolverConstants.COLUMNS_OF_OBJECTS;
          listOfColumnsOfObjectNameQuery = listOfColumnsOfObjectNameQuery.replace(
            '%objectName%',
            args.objectName.trim()
          );

          try {
            dbListOfColumnsOfObjectName = await dataBaseUtils.getExecuteQuery(
              listOfColumnsOfObjectNameQuery
            );
          } catch (err) {
            throw new Error(`Error occured while executing the query listOfColumnsOfObjectNameQuery ${err.message}`);
          }

          dbListOfColumnsOfObjectName.forEach(listOfColumns => {
            listOfColumnsOfObjectName.push(listOfColumns.column_name);
          });

          let listOfParametersOfObjectNameQuery = ResolverConstants.PARAMETERS_OF_OBJECTS;
          listOfParametersOfObjectNameQuery = listOfParametersOfObjectNameQuery.replace(
            '%objectId%',
            validatedObjectId
          );

          try {
            dbListOfParametersOfObjectName = await dataBaseUtils.getExecuteQuery(
              listOfParametersOfObjectNameQuery
            );
          } catch (err) {
            throw new Error(`Error occured while executing the query listOfParametersOfObjectNameQuery ${err.message}`);
          }

          listOfColumnsOfObjectName.forEach(columnName => {
            dbListOfParametersOfObjectName.forEach(parameter => {
              if (columnName === parameter.parm_name) {
                const parameterDetails = {};
                parameterDetails.parameterName = columnName;
                if (Array.isArray(parameter.prompt_text)) {
                  [, parameterDetails.prompt] = parameter.prompt_text;
                } else {
                  parameterDetails.prompt = parameter.prompt_text;
                }
                parameterDetails.defaultValue = parameter.dflt_val;

                storedProcedureParamaetersList.push(parameterDetails);
              }
            });
          });
          return storedProcedureParamaetersList;
        },
        /* This function acts as resolver for graphql to fetch a list of crystal report articles from the database. */
        async crystalReport() {
          let crystalReportFromDatabase = [];
          const crystalReportList = [];
          const crystalReportQuery = ResolverConstants.CRYSTAL_REPORT_QUERY;
          try {
            crystalReportFromDatabase = await dataBaseUtils.getExecuteQuery(crystalReportQuery);
          } catch (err) {
            throw new Error(`Error occured while executing the query ${err.message}`);
          }
          crystalReportFromDatabase.forEach(crystalReport => {
            const crystalReportJob = {};
            crystalReportJob.name = crystalReport.Name;
            crystalReportJob.crystalReportArticleId = crystalReport.CrArticleID;
            crystalReportList.push(crystalReportJob);
          });
          return crystalReportList;
        }
      },
      /* This function acts as resolver for graphql to fetch a list of streams using the obj returned  
       from the parent queues. */
      Queue: {
        streams(obj, args) {
          if (args.streamName !== null) {
            let validatedStreamName = '';
            try {
              validatedStreamName = schedularValidator.asciiValidator(
                args.streamName.trim(),
                ResolverConstants.MAX_STREAMNAME_LENGTH
              );
            } catch (error) {
              throw new Error(`Error occured in streamName: ${error.message}`);
            }
            const filteredStream = obj.streams.filter(stream => {
              return stream.streamName.trim() === validatedStreamName;
            });
            return filteredStream;
          }
          const sortedStreamsList = obj.streams.sort((a, b) => {
            const streamNameA = a.streamName.toLowerCase();
            const streamNameB = b.streamName.toLowerCase();
            if (streamNameA < streamNameB) return -1;
            return 1;
          });
          return sortedStreamsList;
        }
      },
      Stream: {
        jobs(obj, args) {
          if (args.jobName !== null) {
            let validatedJobName = '';
            try {
              validatedJobName = schedularValidator.asciiValidator(
                args.jobName.trim(),
                ResolverConstants.MAX_JOBNAME_LENGTH
              );
            } catch (error) {
              throw new Error(`Error occured in jobName: ${error.message}`);
            }
            const filteredJob = obj.jobs.get(validatedJobName);
            return [filteredJob];
          }

          const jobsArray = Array.from(obj.jobs.values());
          const sortedJobsList = jobsArray.sort((a, b) => {
            const jobNameA = a.jobName.toLowerCase();
            const jobNameB = b.jobName.toLowerCase();
            if (jobNameA < jobNameB) return -1;
            return 1;
          });

          return sortedJobsList;
        },
        notifications(obj) {
          // cloning obj in order to retain the modal data as is
          const clonedData = JSON.parse(JSON.stringify(obj));
          const sortedNotificationsList = clonedData.notifications.sort((a, b) => {
            const emailAddressA = a.emailAddress.toLowerCase();
            const emailAddressB = b.emailAddress.toLowerCase();
            if (emailAddressA < emailAddressB) return -1;
            return 1;
          });
          return sortedNotificationsList;
        }
      },
      Job: {
        notifications(obj) {
          // cloning obj in order to retain the modal data as is
          const clonedData = JSON.parse(JSON.stringify(obj));
          const sortedNotificationsList = clonedData.notifications.sort((a, b) => {
            const emailAddressA = a.emailAddress.toLowerCase();
            const emailAddressB = b.emailAddress.toLowerCase();
            if (emailAddressA < emailAddressB) return -1;
            return 1;
          });
          return sortedNotificationsList;
        },
        async executionHistory(obj) {
          const executionHistoryList = [];
          let executionHistoryDBList = [];
          let executionHistoryquery = ResolverConstants.EXECUTION_HISTORY_QUERY;
          executionHistoryquery = executionHistoryquery.replace('%jobName%', obj.jobName);
          try {
            executionHistoryDBList = await dataBaseUtils.getExecuteQuery(executionHistoryquery);
          } catch (err) {
            throw new Error(`Error occured while executing the query ${err.message}`);
          }

          executionHistoryDBList.forEach(executionHistoryDBObj => {
            const executionHistory = {};
            const startDate = executionHistoryDBObj.start_dtime.replace(timeZone, '');
            executionHistory.executionStart = dateFormat(startDate, dateExpression);

            const endDate = executionHistoryDBObj.end_dtime.replace(timeZone, '');
            executionHistory.executionEnd = dateFormat(endDate, dateExpression);

            executionHistory.status = executionHistoryDBObj.sts_cd;

            executionHistoryList.push(executionHistory);
          });
          return executionHistoryList;
        }
      },
      ScheduleInfo: {
        nextOccurrence: obj => {
          const { currentSchedulerDate } = this.sched.controlRecord;
          const currentSchedulerMonth = ScheduleDetailsConstants.MONTHS_OF_YEAR.findIndex(
            month =>
              currentSchedulerDate.substring(
                ControlRecordConstants.SCHEDULER_CURRENT_MONTH_START_INDEX,
                ControlRecordConstants.SCHEDULER_CURRENT_MONTH_END_INDEX
              ) === month
          );
          const currentSchedulerDayOfMonth = currentSchedulerDate.substring(
            ControlRecordConstants.SCHEDULER_CURRENT_DAY_OF_MONTH_START_INDEX,
            ControlRecordConstants.SCHEDULER_CURRENT_DAY_OF_MONTH_END_INDEX
          );
          const currentSchedulerYear = currentSchedulerDate.substring(
            ControlRecordConstants.SCHEDULER_CURRENT_YEAR_START_INDEX,
            ControlRecordConstants.SCHEDULER_CURRENT_YEAR_END_INDEX
          );
          const currentSchedDate = `${parseInt(currentSchedulerMonth, 10) +
            1}/${currentSchedulerDayOfMonth}/${currentSchedulerYear}`;
          const nextOccurrenceList = [];
          obj.scheduleOccurrence.forEach(schedule => {
            // calculate next Occurrence for only active schedules
            if (schedule.baseInfo.scheduleActive === '1') {
              const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
                schedule,
                currentSchedDate
              );

              nextOccurrenceList.push(nextOccurrence);
            }
          });

          const nextOccurrence = utils.getNextOccurrenceFromList(nextOccurrenceList);
          return nextOccurrence;
        }
      },
      SchedWeekly: {
        runWeekDays(obj, args) {
          if (args.isSelected !== null) {
            const filteredWeekDays = obj.runWeekDays.filter(
              weekDay => weekDay.isSelected === args.isSelected
            );
            return filteredWeekDays;
          }
          return obj.runWeekDays;
        }
      },
      SchedMonthly: {
        monthMask(obj, args) {
          if (args.isSelected !== null) {
            const filteredMonths = obj.monthMask.filter(
              month => month.isSelected === args.isSelected
            );
            return filteredMonths;
          }
          return obj.monthMask;
        }
      }
    };

    return resolvers;
  }
}

export default Resolver;
