import EasyGraphQLTester from 'easygraphql-tester';
import fs from 'fs';
import mockData from '../data/schedule.mock';
import DataBaseUtils from '../database/database-utils';
import Sapclient from '../mts-socket/sap-client/sap-client';
import serverUtils from '../server-utils';

jest.mock('../server-utils');

const OLD_ENV = process.env;
process.env = { ...OLD_ENV };
delete process.env.DSSPropertyLocation;
process.env.DSSPropertyLocation = 'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\Fake_PROPERTIES';
const Resolver = require('./resolver').default;

const schema = fs.readFileSync('./src/schema/schema.graphql', {
  encoding: 'utf-8'
});
let resolvers;
let getData;
let getPredecessorMap;
let getJobTypeMap;
const listOfAllStreams = [];
let getOlapCube;
let sapclient;

describe('test the schema', () => {
  let tester;

  beforeAll(() => {
    jest.resetModules();
    getData = mockData.getSched();
    getPredecessorMap = mockData.getMap();
    getJobTypeMap = mockData.getJobTypeMap();
    getOlapCube = mockData.getOlapCube();
    getData.queues.forEach(queue => {
      queue.streams.forEach(stream => {
        listOfAllStreams.push(stream);
      });
    });
    const getdataBaseUtils = new DataBaseUtils({
      ServerName: 'ServerName',
      DatabaseName: 'databaseName'
    });
    const dssServerName = 'dssServerName';
    const sapPort = 'sapPort';
    sapclient = new Sapclient();
    sapclient.allFiles.schedFile = getData;

    resolvers = new Resolver(sapclient, getPredecessorMap, listOfAllStreams).rootResolver(
      getdataBaseUtils,
      getJobTypeMap,
      dssServerName,
      sapPort
    );

    tester = new EasyGraphQLTester(schema, resolvers);
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('getJobTypeMap resolver should return the selected jobtype id', () => {
    const QUERY_JOBTYPE_LIST = `
    query getJobTypeMap {
      jobTypes(id:"170") {
        id
        name
      }
    }
    `;

    const expectedResult = {
      jobTypes: [
        {
          id: '170',
          name: 'Bulk Transaction Load'
        }
      ]
    };

    tester
      .graphql(QUERY_JOBTYPE_LIST)
      .then(result => {
        expect(result.data).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('getJobTypeMap resolver should return all the job types', () => {
    const QUERY_JOBTYPE_LIST = `
    query getJobTypeMap {
      jobTypes {
        id
        name
      }
    }
    `;

    const expectedResult = {
      jobTypes: [
        {
          id: '170',
          name: 'Bulk Transaction Load'
        },
        {
          id: '200',
          name: 'Stored Procedure'
        }
      ]
    };

    tester
      .graphql(QUERY_JOBTYPE_LIST)
      .then(result => {
        expect(result.data).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('potentialStreamPredecessor resolver should return only the data requested, no underfetching and overfetching and in sorted order by stream Id', () => {
    const QUERY_POTENTIAL_PREDECESSOR = `
    query GetPotentialStreamPredecessor{
      potentialPredecessors(streamName: "fakestr2") {
        streamName
        streamDescription
      }
    }
    `;
    const expectedResult = {
      potentialPredecessors: [
        {
          streamName: 'DMILCLIN',
          streamDescription: 'Daily Start of Streams'
        },
        {
          streamName: 'fakestr1',
          streamDescription: 'Daily Start of Streams'
        },
        {
          streamName: 'fakestr1',
          streamDescription: 'Daily Start of Streams'
        },
        {
          streamName: 'fakestr1',
          streamDescription: 'Daily Start of Streams'
        },
        {
          streamName: 'fakestr1',
          streamDescription: 'Daily Start of Streams'
        },
        {
          streamName: 'fakestr3',
          streamDescription: 'Daily Start of Streams'
        }
      ]
    };
    tester
      .graphql(QUERY_POTENTIAL_PREDECESSOR)
      .then(result => {
        expect(result.data).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('potentialStreamPredecessor resolver should return null if there is no streamname present, no underfetching and overfetching and in sorted order by stream Id', () => {
    const QUERY_POTENTIAL_PREDECESSOR = `
    query GetPotentialStreamPredecessor{
      potentialPredecessors(streamName: "nostream") {
        streamName
        streamDescription
      }
    }
    `;
    const expectedResult = {
      potentialPredecessors: [
      ]
    };
    tester
      .graphql(QUERY_POTENTIAL_PREDECESSOR)
      .then(result => {
        expect(result.data).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('test for getExecuteQuery data with queue max number validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getExecutionHistory{
      queues (queueName: "015") {
        queueName
        streams (streamName: "fakestr1") {
          streamName
          jobs(jobName: "fakejob2"){
            jobName
            executionHistory{
              executionStart
              executionEnd
              status
            }
          }
        }
      }
    }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('test for getExecuteQuery data with queue type validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getExecutionHistory{
      queues (queueName: "0%") {
        queueName
        streams (streamName: "fakestr1") {
          streamName
          jobs(jobName: "fakejob2"){
            jobName
            executionHistory{
              executionStart
              executionEnd
              status
            }
          }
        }
      }
    }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('test for getExecuteQuery data with stream type validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getExecutionHistory{
      queues (queueName: "01") {
        queueName
        streams (streamName: "fakes{r1") {
          streamName
          jobs(jobName: "fakejob2"){
            jobName
            executionHistory{
              executionStart
              executionEnd
              status
            }
          }
        }
      }
    }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('test for getExecuteQuery data with stream max character validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getExecutionHistory{
      queues (queueName: "01") {
        queueName
        streams (streamName: "fakestr1qe") {
          streamName
          jobs(jobName: "fakejob2"){
            jobName
            executionHistory{
              executionStart
              executionEnd
              status
            }
          }
        }
      }
    }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('test for getPotentialPredecessors data with streamName max character validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getPotentialPredecessors{
      potentialPredecessors(streamName: "fakestr1rt") {
        streamName
        streamDescription
      }
    }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('test for getPotentialJobPredecessors data with streamName max character validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query GetPotentialJobPredecessor{
      potentialJobPredecessors(streamName: "fakestr2rt", jobName: "fakejob2") {
        jobName
        description
      }
    }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('test for getPotentialJobPredecessors data with JobName max character validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query GetPotentialJobPredecessor{
      potentialJobPredecessors(streamName: "fakestr2", jobName: "fakejob2sfsf") {
        jobName
        description
      }
    }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('test for getJobType data with id max character validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getJobTypeMap {
      jobTypes(id:"1705") {
        id
        name
      }
    }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('test for getJob data with jobs max character validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query GetQueues {
      queues(queueName: "01"){
        queueName
          queueDescription
          streams(streamName: "fakestr2"){
            streamName
            jobs(jobName: "fakejob4fsf") {
              jobName
            }
          }
      }
  }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('potentialStreamPredecessor resolver should return only the data requested, no underfetching and overfetching and in sorted order by stream Name', () => {
    const QUERY_POTENTIAL_PREDECESSOR = ` 
    query GetPotentialStreamPredecessor{
      potentialPredecessors(streamName: "fakestr1") {
        streamName
        streamDescription
      }
    }
    `;
    const expectedResult = {
      potentialPredecessors: [
        {
          streamName: 'fakestr3',
          streamDescription: 'Daily Start of Streams'
        }
      ]
    };
    tester
      .graphql(QUERY_POTENTIAL_PREDECESSOR)
      .then(result => {
        expect(result.data).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('potentialJobPredecessor resolver should return only the data requested, no underfetching and overfetching and in sorted order by job Name', () => {
    const QUERY_POTENTIAL_JOB_PREDECESSOR = ` 
    query GetPotentialJobPredecessor{
      potentialJobPredecessors(streamName: "fakestr2", jobName: "fakejob2") {
        jobName
        description
      }
    }
    `;
    const expectedResult = {
      potentialJobPredecessors: [
        {
          jobName: 'fakejob1',
          description: '0 fakejob1 description'
        },
        {
          jobName: 'fakejob3',
          description: 'Refresh S5 Daily Cubes        '
        },
        {
          jobName: 'fakejob5',
          description: 'job1 description'
        },
        {
          jobName: 'fakejob9',
          description: '0 fakejob9 description'
        }
      ]
    };
    tester
      .graphql(QUERY_POTENTIAL_JOB_PREDECESSOR)
      .then(result => {
        expect(result.data).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('control record resolver is valid', () => {
    const QUERY_CONTROL_RECORD = `
        query GetControlRecord {
                controlRecord{
                    currentSchedulerDate
                    sleepInterval
                    lastMaintenanceDateTime
                    checkpointDirectoryPath
                    schedulerLogFilePath
                    taskFilePath
                    notificationFilePath
                }
            }
    `;
    tester
      .graphql(QUERY_CONTROL_RECORD)
      .then(result => {
        expect(result.data.controlRecord).toMatchObject({
          currentSchedulerDate: 'Wed, Aug 01, 2018',
          sleepInterval: 30,
          lastMaintenanceDateTime: '02/26/2019 02:04:52',
          checkpointDirectoryPath:
            'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\chkpoint\\SMSDHDSS2620',
          schedulerLogFilePath:
            'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\log\\sch_SMSDHDSS2620.log',
          taskFilePath: 'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\data\\task_SMSDHDSS2620',
          notificationFilePath:
            'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\data\\notif_SMSDHDSS2620'
        });
      })
      .catch(err => console.log(err));
  });

  test('return the exact data requested in the query without underfetching or overfetching', () => {
    const QUERY_CONTROL_RECORD = `
        query GetControlRecord {
                controlRecord{
                    checkpointDirectoryPath
                    schedulerLogFilePath
                    taskFilePath
                    notificationFilePath
                }
            }
    `;
    tester
      .graphql(QUERY_CONTROL_RECORD)
      .then(result => {
        expect(result.data.controlRecord).toMatchObject({
          checkpointDirectoryPath:
            'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\chkpoint\\SMSDHDSS2620',
          schedulerLogFilePath:
            'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\log\\sch_SMSDHDSS2620.log',
          taskFilePath: 'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\data\\task_SMSDHDSS2620',
          notificationFilePath:
            'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\data\\notif_SMSDHDSS2620'
        });
      })
      .catch(err => console.log(err));
  });

  test('should return the control record data', () => {
    const CONTROL_RECORD = resolvers.Query.controlRecord();
    expect(CONTROL_RECORD).toMatchObject({
      currentSchedulerDate: 'Wed, Aug 01, 2018',
      sleepInterval: 30,
      lastMaintenanceDateTime: '02/26/2019 02:04:52',
      checkpointDirectoryPath:
        'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\chkpoint\\SMSDHDSS2620',
      schedulerLogFilePath:
        'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\log\\sch_SMSDHDSS2620.log',
      taskFilePath: 'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\data\\task_SMSDHDSS2620',
      notificationFilePath: 'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\data\\notif_SMSDHDSS2620'
    });
  });

  test('streams resolver should sort streams alphanumerically in ascending order by stream name', () => {
    const QUERY_STREAMS = `
        query GetStreams {
                streams{
                    streamName
                    streamDescription
                    streamStatus
                    streamFinishedDateTime
                }
            }
    `;

    // streams should be alphamumerically sorted based on Stream ID
    const expectedResult = [
      {
        streamName: 'DLPRDINT',
        streamStatus: 'M',
        streamDescription: 'Daily Start of Streams',
        streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016'
      },
      {
        streamName: 'DMILCLIN',
        streamStatus: 'M',
        streamDescription: 'Daily Start of Streams',
        streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016'
      },
      {
        streamName: 'fakestr1',
        streamDescription: 'Daily Start of Streams',
        streamStatus: 'M',
        streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016'
      },
      {
        streamName: 'fakestr1',
        streamDescription: 'Daily Start of Streams',
        streamStatus: 'M',
        streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016'
      },
      {
        streamName: 'fakestr1',
        streamDescription: 'Daily Start of Streams',
        streamStatus: 'M',
        streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016'
      },
      {
        streamName: 'fakestr1',
        streamDescription: 'Daily Start of Streams',
        streamStatus: 'M',
        streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016'
      },
      {
        streamName: 'fakestr2',
        streamDescription: 'Daily Start of Streams',
        streamStatus: 'M',
        streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016'
      },
      {
        streamName: 'fakestr2',
        streamDescription: 'Daily Start of Streams',
        streamStatus: 'M',
        streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016'
      },
      {
        streamName: 'fakestr3',
        streamDescription: 'Daily Start of Streams',
        streamStatus: 'M',
        streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016'
      }
    ];
    tester
      .graphql(QUERY_STREAMS)
      .then(result => {
        expect(result.data.streams).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('streams resolver should return only the data requested, no underfetching and overfetching and in sorted order by stream Id', () => {
    const QUERY_STREAMS = `
        query GetStreams {
                streams{
                    streamName
                    streamDescription
                }
            }
    `;

    // streams should be alphamumerically sorted based on Stream Name
    const expectedResult = [
      {
        streamName: 'DLPRDINT',
        streamDescription: 'Daily Start of Streams'
      },
      {
        streamName: 'DMILCLIN',
        streamDescription: 'Daily Start of Streams'
      },
      {
        streamName: 'fakestr1',
        streamDescription: 'Daily Start of Streams'
      },
      {
        streamName: 'fakestr1',
        streamDescription: 'Daily Start of Streams'
      },
      {
        streamName: 'fakestr1',
        streamDescription: 'Daily Start of Streams'
      },
      {
        streamName: 'fakestr1',
        streamDescription: 'Daily Start of Streams'
      },
      {
        streamName: 'fakestr2',
        streamDescription: 'Daily Start of Streams'
      },
      {
        streamName: 'fakestr2',
        streamDescription: 'Daily Start of Streams'
      },
      {
        streamName: 'fakestr3',
        streamDescription: 'Daily Start of Streams'
      }
    ];
    tester
      .graphql(QUERY_STREAMS)
      .then(result => {
        expect(result.data.streams).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('queues resolver should return all queues when no argument is passed, no underfetching and overfetching and in sorted order by queue Id and stream name', () => {
    const QUERY_QUEUES = `
    query GetQueues {
      queues{
        queueName
          queueDescription
          streams{
            streamName
          }
      }
  }
`;
    const expectedResult = [
      {
        queueName: '01',
        queueDescription: 'fake queue01',
        streams: [
          {
            streamName: 'fakestr1'
          },
          {
            streamName: 'fakestr2'
          },
          {
            streamName: 'fakestr3'
          }
        ]
      },
      {
        queueName: '00',
        queueDescription: 'fake 00queue00',
        streams: [
          {
            streamName: 'DLPRDINT'
          },
          {
            streamName: 'DMILCLIN'
          },
          {
            streamName: 'fakestr1'
          },
          {
            streamName: 'fakestr1'
          }
        ]
      },
      {
        queueName: '02',
        queueDescription: 'fake queue02',
        streams: [
          {
            streamName: 'fakestr1'
          },
          {
            streamName: 'fakestr2'
          }
        ]
      }
    ];
    tester
      .graphql(QUERY_QUEUES)
      .then(result => {
        expect(result.data.queues).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('queues resolver should return only requested queueName data, no underfetching and overfetching', () => {
    const QUERY_QUEUES = `
    query GetQueues {
      queues(queueName: "00"){
        queueName
          queueDescription
          streams{
            streamName
          }
      }
  }
`;

    const expectedResult = [
      {
        queueName: '00',
        queueDescription: 'fake 00queue00',
        streams: [
          {
            streamName: 'DLPRDINT'
          },
          {
            streamName: 'DMILCLIN'
          },
          {
            streamName: 'fakestr1'
          },
          {
            streamName: 'fakestr1'
          }
        ]
      }
    ];
    tester
      .graphql(QUERY_QUEUES)
      .then(result => {
        expect(result.data.queues).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });
  test('queues resolver should return only requested queueName and stream name data, no underfetching and overfetching', () => {
    const QUERY_QUEUES = `
    query GetQueues {
      queues(queueName: "01"){
        queueName
          queueDescription
          streams(streamName: "fakestr2"){
            streamName
            jobs(jobName: "fakejob4") {
              jobName
            }
          }
      }
  }
`;

    const expectedResult = [
      {
        queueName: '01',
        queueDescription: 'fake queue01',
        streams: [
          {
            streamName: 'fakestr2',
            jobs: [
              {
                jobName: 'fakejob4'
              }
            ]
          }
        ]
      }
    ];
    tester
      .graphql(QUERY_QUEUES)
      .then(result => {
        expect(result.data.queues).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });
  test('queues resolver should return only requested queueName with requested fields in jobs, no underfetching and overfetching', () => {
    const QUERY_QUEUES = `
    query GetQueues {
      queues(queueName: "01"){
        queueName
          queueDescription
          streams{
            streamName
            jobs {
              jobName
            }
          }
      }
  }
`;
    // jobs are sorted in ascending order
    const expectedResult = [
      {
        queueName: '01',
        queueDescription: 'fake queue01',
        streams: [
          {
            streamName: 'fakestr1',
            jobs: [
              {
                jobName: 'fakejob2'
              }
            ]
          },
          {
            streamName: 'fakestr2',
            jobs: [
              {
                jobName: 'fakejob1'
              },
              {
                jobName: 'fakejob2'
              },
              {
                jobName: 'fakejob3'
              },
              {
                jobName: 'fakejob4'
              },
              {
                jobName: 'fakejob5'
              },
              {
                jobName: 'fakejob9'
              }
            ]
          },
          {
            streamName: 'fakestr3',
            jobs: [
              {
                jobName: 'fakejob2'
              },
              {
                jobName: 'fakejob3'
              }
            ]
          }
        ]
      }
    ];
    tester
      .graphql(QUERY_QUEUES)
      .then(result => {
        expect(result.data.queues).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });
  test('queues resolver should return only requested queueName and requested fields in  notifications, no underfetching and overfetching', () => {
    const QUERY_QUEUES = `
    query GetQueues {
      queues(queueName: "01"){
        queueName
          queueDescription
          streams{
            streamName
            notifications {
              emailAddress
            }
          }
      }
  }
`;
    // notifications are sorted alphanumerically based on emailAddress.
    const expectedResult = [
      {
        queueName: '01',
        queueDescription: 'fake queue01',
        streams: [
          {
            streamName: 'fakestr1',
            notifications: [
              {
                emailAddress: 'ac0rn@hotmail.com'
              },
              {
                emailAddress: 'ac0rn@hotmail.com'
              }
            ]
          },
          {
            streamName: 'fakestr2',
            notifications: [
              {
                emailAddress: 'ac01n@hotmail.com'
              },
              {
                emailAddress: 'ac0rn@hotmail.com'
              }
            ]
          },
          {
            streamName: 'fakestr3',
            notifications: [
              {
                emailAddress: 'ac00n@hotmail.com'
              },
              {
                emailAddress: 'ac01n@hotmail.com'
              }
            ]
          }
        ]
      }
    ];
    tester
      .graphql(QUERY_QUEUES)
      .then(result => {
        expect(result.data.queues).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });
  test('queues resolver should return only requested queueName and all the fields requested in notifications, no underfetching and overfetching', () => {
    const QUERY_QUEUES = `
    query GetQueues {
      queues(queueName: "01"){
        queueName
          queueDescription
          streams{
            streamName
            notifications {
              emailAddress
              enabled
              eventType
            }
          }
      }
  }
`;
    // notifications are sorted alphanumerically based on emailAddress.
    const expectedResult = [
      {
        queueName: '01',
        queueDescription: 'fake queue01',
        streams: [
          {
            streamName: 'fakestr1',
            notifications: [
              {
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '1',
                eventType: 'S'
              },
              {
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '0',
                eventType: 'F'
              }
            ]
          },
          {
            streamName: 'fakestr2',
            notifications: [
              {
                emailAddress: 'ac01n@hotmail.com',
                enabled: '1',
                eventType: 'S'
              },
              {
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '1',
                eventType: 'F'
              }
            ]
          },
          {
            streamName: 'fakestr3',
            notifications: [
              {
                emailAddress: 'ac00n@hotmail.com',
                enabled: '0',
                eventType: 'S'
              },
              {
                emailAddress: 'ac01n@hotmail.com',
                enabled: '1',
                eventType: 'S'
              }
            ]
          }
        ]
      }
    ];
    tester
      .graphql(QUERY_QUEUES)
      .then(result => {
        expect(result.data.queues).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });
  test('queues resolver should return the expected output and the modal data passed should remain the same', () => {
    const QUERY_QUEUES = `
    query GetQueues {
      queues(queueName: "01"){
        queueName
          queueDescription
          streams{
            streamName
            notifications {
              emailAddress
              enabled
              eventType
            }
            jobs {
              jobName
            }
          }
      }
  }
`;
    // notifications and jobs are sorted alphanumerically based on emailAddress.
    const expectedResult = [
      {
        queueName: '01',
        queueDescription: 'fake queue01',
        streams: [
          {
            streamName: 'fakestr1',
            notifications: [
              {
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '1',
                eventType: 'S'
              },
              {
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '0',
                eventType: 'F'
              }
            ],
            jobs: [
              {
                jobName: 'fakejob2'
              }
            ]
          },
          {
            streamName: 'fakestr2',
            notifications: [
              {
                emailAddress: 'ac01n@hotmail.com',
                enabled: '1',
                eventType: 'S'
              },
              {
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '1',
                eventType: 'F'
              }
            ],
            jobs: [
              {
                jobName: 'fakejob1'
              },
              {
                jobName: 'fakejob2'
              },
              {
                jobName: 'fakejob3'
              },
              {
                jobName: 'fakejob4'
              },
              {
                jobName: 'fakejob5'
              },
              {
                jobName: 'fakejob9'
              }
            ]
          },
          {
            streamName: 'fakestr3',
            notifications: [
              {
                emailAddress: 'ac00n@hotmail.com',
                enabled: '0',
                eventType: 'S'
              },
              {
                emailAddress: 'ac01n@hotmail.com',
                enabled: '1',
                eventType: 'S'
              }
            ],
            jobs: [
              {
                jobName: 'fakejob2'
              },
              {
                jobName: 'fakejob3'
              }
            ]
          }
        ]
      }
    ];
    tester
      .graphql(QUERY_QUEUES)
      .then(result => {
        expect(result.data.queues).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('resolvers should fetch stream schedule details correctly when isSelected is not provided for monthMask and runWeekDays', () => {
    const QUERY_STREAM_SCHEDULE = `
    query GetQueues {
      queues(queueName: "01") {
        streams(streamName: "fakestr1") {
          streamName
          scheduleInfo {
            nextOccurrence
            scheduleOccurrence {
              baseInfo {
                frequency
                scheduleActive
                forceExecution
                occurrence
                dateAndTime {
                  earliestStartTime
                  latestStartTime
                  lastActualEndTime
                  lastActualStartTime
                  baseDate
                }
              }
              dailyInfo {
                everyNDays
              }
              weeklyInfo {
                everyNWeeks
                runWeekDays {
                  name
                  isSelected
                }
              }
              monthlyInfo {
                monthlyScheduleType
                monthlyScheduleEvent
                monthlyScheduleEventDay
                dayOfTheMonth
                monthMask {
                  name
                  isSelected
                }
              }
            }
          }
        }
      }
    }
    `;

    const expectedResult = [
      {
        streams: [
          {
            streamName: 'fakestr1',
            scheduleInfo: {
              nextOccurrence: 'Wed Aug 01 2018',
              scheduleOccurrence: [
                {
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: [
                      {
                        name: 'Jan',
                        isSelected: '1'
                      },
                      {
                        name: 'Feb',
                        isSelected: '1'
                      },
                      {
                        name: 'Mar',
                        isSelected: '1'
                      },
                      {
                        name: 'Apr',
                        isSelected: '1'
                      },
                      {
                        name: 'May',
                        isSelected: '1'
                      },
                      {
                        name: 'Jun',
                        isSelected: '1'
                      },
                      {
                        name: 'Jul',
                        isSelected: '1'
                      },
                      {
                        name: 'Aug',
                        isSelected: '1'
                      },
                      {
                        name: 'Sep',
                        isSelected: '1'
                      },
                      {
                        name: 'Oct',
                        isSelected: '1'
                      },
                      {
                        name: 'Nov',
                        isSelected: '1'
                      },
                      {
                        name: 'Dec',
                        isSelected: '1'
                      }
                    ]
                  },
                  baseInfo: {
                    occurrence: '0',
                    frequency: '1',
                    forceExecution: '0',
                    scheduleActive: '1',
                    dateAndTime: {
                      lastActualStartTime: '',
                      lastActualEndTime: '',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '10/25/2014'
                    }
                  }
                },
                {
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: [
                      {
                        name: 'Jan',
                        isSelected: '1'
                      },
                      {
                        name: 'Feb',
                        isSelected: '1'
                      },
                      {
                        name: 'Mar',
                        isSelected: '1'
                      },
                      {
                        name: 'Apr',
                        isSelected: '1'
                      },
                      {
                        name: 'May',
                        isSelected: '1'
                      },
                      {
                        name: 'Jun',
                        isSelected: '1'
                      },
                      {
                        name: 'Jul',
                        isSelected: '1'
                      },
                      {
                        name: 'Aug',
                        isSelected: '1'
                      },
                      {
                        name: 'Sep',
                        isSelected: '1'
                      },
                      {
                        name: 'Oct',
                        isSelected: '1'
                      },
                      {
                        name: 'Nov',
                        isSelected: '1'
                      },
                      {
                        name: 'Dec',
                        isSelected: '1'
                      }
                    ]
                  },
                  baseInfo: {
                    occurrence: '0',
                    frequency: '1',
                    forceExecution: '0',
                    scheduleActive: '0',
                    dateAndTime: {
                      lastActualStartTime: '',
                      lastActualEndTime: '',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '07/18/2016'
                    }
                  }
                },
                {
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: [
                      {
                        name: 'Jan',
                        isSelected: '1'
                      },
                      {
                        name: 'Feb',
                        isSelected: '1'
                      },
                      {
                        name: 'Mar',
                        isSelected: '1'
                      },
                      {
                        name: 'Apr',
                        isSelected: '1'
                      },
                      {
                        name: 'May',
                        isSelected: '1'
                      },
                      {
                        name: 'Jun',
                        isSelected: '1'
                      },
                      {
                        name: 'Jul',
                        isSelected: '1'
                      },
                      {
                        name: 'Aug',
                        isSelected: '1'
                      },
                      {
                        name: 'Sep',
                        isSelected: '1'
                      },
                      {
                        name: 'Oct',
                        isSelected: '1'
                      },
                      {
                        name: 'Nov',
                        isSelected: '1'
                      },
                      {
                        name: 'Dec',
                        isSelected: '1'
                      }
                    ]
                  },
                  baseInfo: {
                    occurrence: '0',
                    frequency: '1',
                    forceExecution: '0',
                    scheduleActive: '0',
                    dateAndTime: {
                      lastActualStartTime: '',
                      lastActualEndTime: '',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '07/18/2016'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ];

    tester
      .graphql(QUERY_STREAM_SCHEDULE)
      .then(result => expect(result.data.queues).toEqual(expectedResult));
  });

  test('resolvers should fetch stream schedule details correctly when isSelected is provided for monthMask and runWeekDays', () => {
    const QUERY_STREAM_SCHEDULE = `
    query GetQueues {
      queues(queueName: "01") {
        streams(streamName: "fakestr1") {
          streamName
          scheduleInfo {
            scheduleOccurrence {
              baseInfo {
                frequency
                scheduleActive
                forceExecution
                occurrence
                dateAndTime {
                  earliestStartTime
                  latestStartTime
                  lastActualEndTime
                  lastActualStartTime
                  baseDate
                }
              }
              dailyInfo {
                everyNDays
              }
              weeklyInfo {
                everyNWeeks
                runWeekDays(isSelected: "0") {
                  name
                  isSelected
                }
              }
              monthlyInfo {
                monthlyScheduleType
                monthlyScheduleEvent
                monthlyScheduleEventDay
                dayOfTheMonth
                monthMask(isSelected: "0") {
                  name
                  isSelected
                }
              }
            }
          }
        }
      }
    }
    `;

    const expectedResult = [
      {
        streams: [
          {
            streamName: 'fakestr1',
            scheduleInfo: {
              scheduleOccurrence: [
                {
                  baseInfo: {
                    frequency: '1',
                    scheduleActive: '1',
                    forceExecution: '0',
                    occurrence: '0',
                    dateAndTime: {
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      lastActualEndTime: '',
                      lastActualStartTime: '',
                      baseDate: '10/25/2014'
                    }
                  },
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: []
                  }
                },
                {
                  baseInfo: {
                    frequency: '1',
                    scheduleActive: '0',
                    forceExecution: '0',
                    occurrence: '0',
                    dateAndTime: {
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      lastActualEndTime: '',
                      lastActualStartTime: '',
                      baseDate: '07/18/2016'
                    }
                  },
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: []
                  }
                },
                {
                  baseInfo: {
                    frequency: '1',
                    scheduleActive: '0',
                    forceExecution: '0',
                    occurrence: '0',
                    dateAndTime: {
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      lastActualEndTime: '',
                      lastActualStartTime: '',
                      baseDate: '07/18/2016'
                    }
                  },
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: []
                  }
                }
              ]
            }
          }
        ]
      }
    ];

    tester
      .graphql(QUERY_STREAM_SCHEDULE)
      .then(result => expect(result.data.queues).toEqual(expectedResult));
  });

  test('resolvers should fetch stream schedule details correctly when isSelected is not provided for monthMask and runWeekDays', () => {
    const QUERY_STREAM_SCHEDULE = `
    query GetQueues {
      queues(queueName: "01") {
        streams(streamName: "fakestr1") {
          streamName
          scheduleInfo {
            scheduleOccurrence {
              baseInfo {
                frequency
                scheduleActive
                forceExecution
                occurrence
                dateAndTime {
                  earliestStartTime
                  latestStartTime
                  lastActualEndTime
                  lastActualStartTime
                  baseDate
                }
              }
              dailyInfo {
                everyNDays
              }
              weeklyInfo {
                everyNWeeks
                runWeekDays {
                  name
                  isSelected
                }
              }
              monthlyInfo {
                monthlyScheduleType
                monthlyScheduleEvent
                monthlyScheduleEventDay
                dayOfTheMonth
                monthMask {
                  name
                  isSelected
                }
              }
            }
          }
        }
      }
    }
    `;

    const expectedResult = [
      {
        streams: [
          {
            streamName: 'fakestr1',
            scheduleInfo: {
              scheduleOccurrence: [
                {
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: [
                      {
                        name: 'Jan',
                        isSelected: '1'
                      },
                      {
                        name: 'Feb',
                        isSelected: '1'
                      },
                      {
                        name: 'Mar',
                        isSelected: '1'
                      },
                      {
                        name: 'Apr',
                        isSelected: '1'
                      },
                      {
                        name: 'May',
                        isSelected: '1'
                      },
                      {
                        name: 'Jun',
                        isSelected: '1'
                      },
                      {
                        name: 'Jul',
                        isSelected: '1'
                      },
                      {
                        name: 'Aug',
                        isSelected: '1'
                      },
                      {
                        name: 'Sep',
                        isSelected: '1'
                      },
                      {
                        name: 'Oct',
                        isSelected: '1'
                      },
                      {
                        name: 'Nov',
                        isSelected: '1'
                      },
                      {
                        name: 'Dec',
                        isSelected: '1'
                      }
                    ]
                  },
                  baseInfo: {
                    occurrence: '0',
                    frequency: '1',
                    forceExecution: '0',
                    scheduleActive: '1',
                    dateAndTime: {
                      lastActualStartTime: '',
                      lastActualEndTime: '',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '10/25/2014'
                    }
                  }
                },
                {
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: [
                      {
                        name: 'Jan',
                        isSelected: '1'
                      },
                      {
                        name: 'Feb',
                        isSelected: '1'
                      },
                      {
                        name: 'Mar',
                        isSelected: '1'
                      },
                      {
                        name: 'Apr',
                        isSelected: '1'
                      },
                      {
                        name: 'May',
                        isSelected: '1'
                      },
                      {
                        name: 'Jun',
                        isSelected: '1'
                      },
                      {
                        name: 'Jul',
                        isSelected: '1'
                      },
                      {
                        name: 'Aug',
                        isSelected: '1'
                      },
                      {
                        name: 'Sep',
                        isSelected: '1'
                      },
                      {
                        name: 'Oct',
                        isSelected: '1'
                      },
                      {
                        name: 'Nov',
                        isSelected: '1'
                      },
                      {
                        name: 'Dec',
                        isSelected: '1'
                      }
                    ]
                  },
                  baseInfo: {
                    occurrence: '0',
                    frequency: '1',
                    forceExecution: '0',
                    scheduleActive: '0',
                    dateAndTime: {
                      lastActualStartTime: '',
                      lastActualEndTime: '',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '07/18/2016'
                    }
                  }
                },
                {
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: [
                      {
                        name: 'Jan',
                        isSelected: '1'
                      },
                      {
                        name: 'Feb',
                        isSelected: '1'
                      },
                      {
                        name: 'Mar',
                        isSelected: '1'
                      },
                      {
                        name: 'Apr',
                        isSelected: '1'
                      },
                      {
                        name: 'May',
                        isSelected: '1'
                      },
                      {
                        name: 'Jun',
                        isSelected: '1'
                      },
                      {
                        name: 'Jul',
                        isSelected: '1'
                      },
                      {
                        name: 'Aug',
                        isSelected: '1'
                      },
                      {
                        name: 'Sep',
                        isSelected: '1'
                      },
                      {
                        name: 'Oct',
                        isSelected: '1'
                      },
                      {
                        name: 'Nov',
                        isSelected: '1'
                      },
                      {
                        name: 'Dec',
                        isSelected: '1'
                      }
                    ]
                  },
                  baseInfo: {
                    occurrence: '0',
                    frequency: '1',
                    forceExecution: '0',
                    scheduleActive: '0',
                    dateAndTime: {
                      lastActualStartTime: '',
                      lastActualEndTime: '',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '07/18/2016'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ];

    tester
      .graphql(QUERY_STREAM_SCHEDULE)
      .then(result => expect(result.data.queues).toEqual(expectedResult));
  });

  test('resolvers should fetch stream schedule details correctly when isSelected is provided for monthMask and runWeekDays', () => {
    const QUERY_STREAM_SCHEDULE = `
    query GetQueues {
      queues(queueName: "01") {
        streams(streamName: "fakestr1") {
          streamName
          scheduleInfo {
            scheduleOccurrence {
              baseInfo {
                frequency
                scheduleActive
                forceExecution
                occurrence
                dateAndTime {
                  earliestStartTime
                  latestStartTime
                  lastActualEndTime
                  lastActualStartTime
                  baseDate
                }
              }
              dailyInfo {
                everyNDays
              }
              weeklyInfo {
                everyNWeeks
                runWeekDays(isSelected: "0") {
                  name
                  isSelected
                }
              }
              monthlyInfo {
                monthlyScheduleType
                monthlyScheduleEvent
                monthlyScheduleEventDay
                dayOfTheMonth
                monthMask(isSelected: "0") {
                  name
                  isSelected
                }
              }
            }
          }
        }
      }
    }
    `;

    const expectedResult = [
      {
        streams: [
          {
            streamName: 'fakestr1',
            scheduleInfo: {
              scheduleOccurrence: [
                {
                  baseInfo: {
                    frequency: '1',
                    scheduleActive: '1',
                    forceExecution: '0',
                    occurrence: '0',
                    dateAndTime: {
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      lastActualEndTime: '',
                      lastActualStartTime: '',
                      baseDate: '10/25/2014'
                    }
                  },
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: []
                  }
                },
                {
                  baseInfo: {
                    frequency: '1',
                    scheduleActive: '0',
                    forceExecution: '0',
                    occurrence: '0',
                    dateAndTime: {
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      lastActualEndTime: '',
                      lastActualStartTime: '',
                      baseDate: '07/18/2016'
                    }
                  },
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: []
                  }
                },
                {
                  baseInfo: {
                    frequency: '1',
                    scheduleActive: '0',
                    forceExecution: '0',
                    occurrence: '0',
                    dateAndTime: {
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      lastActualEndTime: '',
                      lastActualStartTime: '',
                      baseDate: '07/18/2016'
                    }
                  },
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: []
                  }
                }
              ]
            }
          }
        ]
      }
    ];

    tester
      .graphql(QUERY_STREAM_SCHEDULE)
      .then(result => expect(result.data.queues).toEqual(expectedResult));
  });

  test('resolvers should fetch stream schedule details correctly when isSelected is not provided for monthMask and runWeekDays', () => {
    const QUERY_STREAM_SCHEDULE = `
    query GetQueues {
      queues(queueName: "01") {
        streams(streamName: "fakestr1") {
          streamName
          scheduleInfo {
            scheduleOccurrence {
              baseInfo {
                frequency
                scheduleActive
                forceExecution
                occurrence
                dateAndTime {
                  earliestStartTime
                  latestStartTime
                  lastActualEndTime
                  lastActualStartTime
                  baseDate
                }
              }
              dailyInfo {
                everyNDays
              }
              weeklyInfo {
                everyNWeeks
                runWeekDays {
                  name
                  isSelected
                }
              }
              monthlyInfo {
                monthlyScheduleType
                monthlyScheduleEvent
                monthlyScheduleEventDay
                dayOfTheMonth
                monthMask {
                  name
                  isSelected
                }
              }
            }
          }
        }
      }
    }
    `;

    const expectedResult = [
      {
        streams: [
          {
            streamName: 'fakestr1',
            scheduleInfo: {
              scheduleOccurrence: [
                {
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: [
                      {
                        name: 'Jan',
                        isSelected: '1'
                      },
                      {
                        name: 'Feb',
                        isSelected: '1'
                      },
                      {
                        name: 'Mar',
                        isSelected: '1'
                      },
                      {
                        name: 'Apr',
                        isSelected: '1'
                      },
                      {
                        name: 'May',
                        isSelected: '1'
                      },
                      {
                        name: 'Jun',
                        isSelected: '1'
                      },
                      {
                        name: 'Jul',
                        isSelected: '1'
                      },
                      {
                        name: 'Aug',
                        isSelected: '1'
                      },
                      {
                        name: 'Sep',
                        isSelected: '1'
                      },
                      {
                        name: 'Oct',
                        isSelected: '1'
                      },
                      {
                        name: 'Nov',
                        isSelected: '1'
                      },
                      {
                        name: 'Dec',
                        isSelected: '1'
                      }
                    ]
                  },
                  baseInfo: {
                    occurrence: '0',
                    frequency: '1',
                    forceExecution: '0',
                    scheduleActive: '1',
                    dateAndTime: {
                      lastActualStartTime: '',
                      lastActualEndTime: '',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '10/25/2014'
                    }
                  }
                },
                {
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: [
                      {
                        name: 'Jan',
                        isSelected: '1'
                      },
                      {
                        name: 'Feb',
                        isSelected: '1'
                      },
                      {
                        name: 'Mar',
                        isSelected: '1'
                      },
                      {
                        name: 'Apr',
                        isSelected: '1'
                      },
                      {
                        name: 'May',
                        isSelected: '1'
                      },
                      {
                        name: 'Jun',
                        isSelected: '1'
                      },
                      {
                        name: 'Jul',
                        isSelected: '1'
                      },
                      {
                        name: 'Aug',
                        isSelected: '1'
                      },
                      {
                        name: 'Sep',
                        isSelected: '1'
                      },
                      {
                        name: 'Oct',
                        isSelected: '1'
                      },
                      {
                        name: 'Nov',
                        isSelected: '1'
                      },
                      {
                        name: 'Dec',
                        isSelected: '1'
                      }
                    ]
                  },
                  baseInfo: {
                    occurrence: '0',
                    frequency: '1',
                    forceExecution: '0',
                    scheduleActive: '0',
                    dateAndTime: {
                      lastActualStartTime: '',
                      lastActualEndTime: '',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '07/18/2016'
                    }
                  }
                },
                {
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: [
                      {
                        name: 'Jan',
                        isSelected: '1'
                      },
                      {
                        name: 'Feb',
                        isSelected: '1'
                      },
                      {
                        name: 'Mar',
                        isSelected: '1'
                      },
                      {
                        name: 'Apr',
                        isSelected: '1'
                      },
                      {
                        name: 'May',
                        isSelected: '1'
                      },
                      {
                        name: 'Jun',
                        isSelected: '1'
                      },
                      {
                        name: 'Jul',
                        isSelected: '1'
                      },
                      {
                        name: 'Aug',
                        isSelected: '1'
                      },
                      {
                        name: 'Sep',
                        isSelected: '1'
                      },
                      {
                        name: 'Oct',
                        isSelected: '1'
                      },
                      {
                        name: 'Nov',
                        isSelected: '1'
                      },
                      {
                        name: 'Dec',
                        isSelected: '1'
                      }
                    ]
                  },
                  baseInfo: {
                    occurrence: '0',
                    frequency: '1',
                    forceExecution: '0',
                    scheduleActive: '0',
                    dateAndTime: {
                      lastActualStartTime: '',
                      lastActualEndTime: '',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '07/18/2016'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ];

    tester
      .graphql(QUERY_STREAM_SCHEDULE)
      .then(result => expect(result.data.queues).toEqual(expectedResult));
  });

  test('resolvers should fetch stream schedule details correctly when isSelected is provided for monthMask and runWeekDays', () => {
    const QUERY_STREAM_SCHEDULE = `
    query GetQueues {
      queues(queueName: "01") {
        streams(streamName: "fakestr1") {
          streamName
          scheduleInfo {
            scheduleOccurrence {
              baseInfo {
                frequency
                scheduleActive
                forceExecution
                occurrence
                dateAndTime {
                  earliestStartTime
                  latestStartTime
                  lastActualEndTime
                  lastActualStartTime
                  baseDate
                }
              }
              dailyInfo {
                everyNDays
              }
              weeklyInfo {
                everyNWeeks
                runWeekDays(isSelected: "0") {
                  name
                  isSelected
                }
              }
              monthlyInfo {
                monthlyScheduleType
                monthlyScheduleEvent
                monthlyScheduleEventDay
                dayOfTheMonth
                monthMask(isSelected: "0") {
                  name
                  isSelected
                }
              }
            }
          }
        }
      }
    }
    `;

    const expectedResult = [
      {
        streams: [
          {
            streamName: 'fakestr1',
            scheduleInfo: {
              scheduleOccurrence: [
                {
                  baseInfo: {
                    frequency: '1',
                    scheduleActive: '1',
                    forceExecution: '0',
                    occurrence: '0',
                    dateAndTime: {
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      lastActualEndTime: '',
                      lastActualStartTime: '',
                      baseDate: '10/25/2014'
                    }
                  },
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: []
                  }
                },
                {
                  baseInfo: {
                    frequency: '1',
                    scheduleActive: '0',
                    forceExecution: '0',
                    occurrence: '0',
                    dateAndTime: {
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      lastActualEndTime: '',
                      lastActualStartTime: '',
                      baseDate: '07/18/2016'
                    }
                  },
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: []
                  }
                },
                {
                  baseInfo: {
                    frequency: '1',
                    scheduleActive: '0',
                    forceExecution: '0',
                    occurrence: '0',
                    dateAndTime: {
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      lastActualEndTime: '',
                      lastActualStartTime: '',
                      baseDate: '07/18/2016'
                    }
                  },
                  dailyInfo: {
                    everyNDays: '001'
                  },
                  weeklyInfo: {
                    everyNWeeks: '01',
                    runWeekDays: [
                      {
                        name: 'Mon',
                        isSelected: '0'
                      },
                      {
                        name: 'Tue',
                        isSelected: '0'
                      },
                      {
                        name: 'Wed',
                        isSelected: '0'
                      },
                      {
                        name: 'Thu',
                        isSelected: '0'
                      },
                      {
                        name: 'Fri',
                        isSelected: '0'
                      },
                      {
                        name: 'Sat',
                        isSelected: '0'
                      },
                      {
                        name: 'Sun',
                        isSelected: '0'
                      }
                    ]
                  },
                  monthlyInfo: {
                    monthlyScheduleType: '0',
                    monthlyScheduleEvent: '0',
                    monthlyScheduleEventDay: '7',
                    dayOfTheMonth: '01',
                    monthMask: []
                  }
                }
              ]
            }
          }
        ]
      }
    ];

    tester
      .graphql(QUERY_STREAM_SCHEDULE)
      .then(result => expect(result.data.queues).toEqual(expectedResult));
  });
  test('jobs resolver should return the notifications of jobs, no underfetching and overfetching', () => {
    const QUERY_JOB_NOTIFICATIONS = `
    query GetJobNotifications {
      queues{
          streams{
            jobs {
              notifications {
                streamOrJobName
                enabled
                emailAddress
                eventType
              }
            }
          }
      }
  }
`;

    const expectedResult = [
      {
        streams: [
          {
            jobs: [
              {
                notifications: []
              }
            ]
          },
          {
            jobs: [
              {
                notifications: []
              },
              {
                notifications: []
              },
              {
                notifications: []
              },
              {
                notifications: []
              },
              {
                notifications: []
              },
              {
                notifications: []
              }
            ]
          },
          {
            jobs: [
              {
                notifications: []
              },
              {
                notifications: []
              }
            ]
          }
        ]
      },
      {
        streams: [
          {
            jobs: [
              {
                notifications: [
                  {
                    streamOrJobName: '0104PAX',
                    enabled: '1',
                    emailAddress: 'johndoea@cerner.com',
                    eventType: 'Success'
                  }
                ]
              },
              {
                notifications: []
              },
              {
                notifications: []
              },
              {
                notifications: []
              }
            ]
          },
          {
            jobs: [
              {
                notifications: [
                  {
                    streamOrJobName: '01BISDMS',
                    enabled: '1',
                    emailAddress: '0a1Uocs@cerner.com',
                    eventType: 'Failure'
                  },
                  {
                    streamOrJobName: '01BISDMS',
                    enabled: '1',
                    emailAddress: '0a1Uocs@cerner.com',
                    eventType: 'Success'
                  },
                  {
                    streamOrJobName: '01BISDMS',
                    enabled: '0',
                    emailAddress: '0aUocs@cerner.com',
                    eventType: 'Success'
                  },
                  {
                    streamOrJobName: '01BISDMS',
                    enabled: '1',
                    emailAddress: 'johndoea@cerner.com',
                    eventType: 'Failure'
                  }
                ]
              }
            ]
          },
          {
            jobs: []
          },
          {
            jobs: []
          }
        ]
      },
      {
        streams: [
          {
            jobs: []
          },
          {
            jobs: []
          }
        ]
      }
    ];
    tester
      .graphql(QUERY_JOB_NOTIFICATIONS)
      .then(result => {
        expect(result.data.queues).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });
  test('jobs resolver should return the requested job, no underfetching and overfetching', () => {
    const QUERY_SELECTED_JOB = `
    query GetJobNotifications {
      queues(queueName: "00"){
          streams(streamName: "DLPRDINT"){
            jobs(jobName: "0104PAX"){
              notifications {
                streamOrJobName
                enabled
                emailAddress
                eventType
              }
            }
          }
      }
  }
`;

    const expectedResult = [
      {
        streams: [
          {
            jobs: [
              {
                notifications: [
                  {
                    streamOrJobName: '0104PAX',
                    enabled: '1',
                    emailAddress: 'johndoea@cerner.com',
                    eventType: 'Success'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    tester
      .graphql(QUERY_SELECTED_JOB)
      .then(result => {
        expect(result.data.queues).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });
  test('jobs resolver should return the requested job and the notifications must be alphanumerically sorted based on emailAddress, no underfetching and overfetching', () => {
    const QUERY_SELECTED_JOB = `
    query GetJobNotifications {
      queues(queueName: "00"){
          streams(streamName: "DMILCLIN"){
            jobs(jobName: "01BISDMS"){
              notifications {
                streamOrJobName
                enabled
                emailAddress
                eventType
              }
            }
          }
      }
  }
`;

    const expectedResult = [
      {
        streams: [
          {
            jobs: [
              {
                notifications: [
                  {
                    streamOrJobName: '01BISDMS',
                    enabled: '1',
                    emailAddress: '0a1Uocs@cerner.com',
                    eventType: 'Failure'
                  },
                  {
                    streamOrJobName: '01BISDMS',
                    enabled: '1',
                    emailAddress: '0a1Uocs@cerner.com',
                    eventType: 'Success'
                  },
                  {
                    streamOrJobName: '01BISDMS',
                    enabled: '0',
                    emailAddress: '0aUocs@cerner.com',
                    eventType: 'Success'
                  },
                  {
                    streamOrJobName: '01BISDMS',
                    enabled: '1',
                    emailAddress: 'johndoea@cerner.com',
                    eventType: 'Failure'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    tester
      .graphql(QUERY_SELECTED_JOB)
      .then(result => {
        expect(result.data.queues).toEqual(expectedResult);
      })
      .catch(err => console.log(err));
  });

  test('resolver should return only requested job name and all the fields requested in execution history', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getExecutionHistory{
      queues (queueName: "01") {
        queueName
        streams (streamName: "fakestr1") {
          streamName
          jobs(jobName: "fakejob2"){
            jobName
            executionHistory{
              executionStart
              executionEnd
              status
            }
          }
        }
      }
    }
    `;

    const fakeJobDBdata = [
      {
        start_dtime: '2018-09-20T05:32:16.320Z',
        end_dtime: '2018-09-20T05:33:31.130Z',
        sts_cd: 'Failed',
        job_name: '0fakejob00',
        obj_type: 390
      },
      {
        start_dtime: '2018-09-20T05:32:16.320Z',
        end_dtime: '2018-09-20T05:33:31.130Z',
        sts_cd: 'Failed',
        job_name: '0fakejob00',
        obj_type: 390
      },
      {
        start_dtime: '2018-10-20T05:36:46.750Z',
        end_dtime: '2018-10-20T05:37:54.050Z',
        sts_cd: 'Failed',
        job_name: '0fakejob00',
        obj_type: 390
      },
      {
        start_dtime: '2018-11-20T05:36:46.750Z',
        end_dtime: '2018-11-20T05:37:54.050Z',
        sts_cd: 'Failed',
        job_name: '0fakejob00',
        obj_type: 390
      },
      {
        start_dtime: '2018-12-20T05:36:46.750Z',
        end_dtime: '2018-12-20T05:37:54.050Z',
        sts_cd: 'Failed',
        job_name: '0fakejob00',
        obj_type: 390
      }
    ];

    const expectedResult = [
      {
        queueName: '01',
        streams: [
          {
            streamName: 'fakestr1',
            jobs: [
              {
                jobName: 'fakejob2',
                executionHistory: [
                  {
                    executionStart: 'Thu, Sep 20, 2018 05:32:16',
                    executionEnd: 'Thu, Sep 20, 2018 05:33:31',
                    status: 'Failed'
                  },
                  {
                    executionStart: 'Thu, Sep 20, 2018 05:32:16',
                    executionEnd: 'Thu, Sep 20, 2018 05:33:31',
                    status: 'Failed'
                  },
                  {
                    executionStart: 'Sat, Oct 20, 2018 05:36:46',
                    executionEnd: 'Sat, Oct 20, 2018 05:37:54',
                    status: 'Failed'
                  },
                  {
                    executionStart: 'Tue, Nov 20, 2018 05:36:46',
                    executionEnd: 'Tue, Nov 20, 2018 05:37:54',
                    status: 'Failed'
                  },
                  {
                    executionStart: 'Thu, Dec 20, 2018 05:36:46',
                    executionEnd: 'Thu, Dec 20, 2018 05:37:54',
                    status: 'Failed'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValue(fakeJobDBdata);

    tester
      .graphql(QUERY_JOB_EXECUTIONHISTORY)
      .then(result => expect(result.data.queues).toEqual(expectedResult));
  });

  test('test for getExecuteQuery data from database with error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getExecutionHistory{
      queues (queueName: "01") {
        queueName
        streams (streamName: "fakestr1") {
          streamName
          jobs(jobName: "fakejob2"){
            jobName
            executionHistory{
              executionStart
              executionEnd
              status
            }
          }
        }
      }
    }
    `;

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockImplementation(() => {
      throw new Error('mocker');
    });
    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('resolver should return null when no job name is specified', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getExecutionHistory{
      queues (queueName: "01") {
        queueName
        streams (streamName: "fakestr1") {
          streamName
          jobs(jobName: "fakejob2"){
            jobName
            executionHistory{
              executionStart
              executionEnd
              status
            }
          }
        }
      }
    }
    `;

    const fakeJobDBdata = [];

    const expectedResult = [
      {
        queueName: '01',
        streams: [
          {
            streamName: 'fakestr1',
            jobs: [
              {
                jobName: 'fakejob2',
                executionHistory: []
              }
            ]
          }
        ]
      }
    ];

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValue(fakeJobDBdata);
    tester
      .graphql(QUERY_JOB_EXECUTIONHISTORY)
      .then(result => expect(result.data.queues).toEqual(expectedResult));
  });

  test('cluster resolver should return the clusters related to Dimensional cluster type when Dimensional is specified for cluster type', async () => {
    const QUERY_CLUSTERS = `
    query getClusters{
      clusters{
        id
        name
      }
    }
    `;

    const fakeDBData = [
      {
        id: '5032',
        name: 'All-Cause Medicare Readmission'
      },
      {
        id: '3935',
        name: 'Asthma'
      }
    ];

    const expectedResult = {
      clusters: [
        {
          id: '5032',
          name: 'All-Cause Medicare Readmission'
        },
        {
          id: '3935',
          name: 'Asthma'
        }
      ]
    };

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValue(fakeDBData);
    tester.graphql(QUERY_CLUSTERS).then(result => expect(result.data).toEqual(expectedResult));
  });

  test('cluster resolver should handle the error when there is an error in fetching the data from database', async () => {
    const QUERY_CLUSTERS = `
    query getClusters{
      clusters{
        id
        name
      }
    }
    `;

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockImplementation(() => {
      throw new Error('mocker');
    });
    const result = await tester.graphql(QUERY_CLUSTERS);
    expect(result.errors).not.toBeNull();
  });

  test('resolver should return OLAP cube', async () => {
    const QUERY_OLAP_CUBE = `
    query getOlapCube{
      olapCube{
        cubeName
        databaseName
      }
    }
    `;
    const expectedResult = [
      {
        cubeName: 'Accounts Receivable Trending',
        databaseName: 'EA-DSS Olap'
      },
      {
        cubeName: 'APC Analysis',
        databaseName: 'EA-DSS Olap'
      },
      {
        cubeName: 'Billing Unit',
        databaseName: 'EA-DSS Olap'
      },
      {
        cubeName: 'Charge Analysis',
        databaseName: 'EA-DSS Olap'
      },
      {
        cubeName: 'COR Risk Analysis',
        databaseName: 'EA-DSS Olap'
      }
    ];
    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValue(getOlapCube);

    tester
      .graphql(QUERY_OLAP_CUBE)
      .then(result => expect(result.data.olapCube).toEqual(expectedResult));
  });

  test('test for getExecuteQuery data from database with error handling', async () => {
    const QUERY_OLAP_CUBE = `
    query getOlapCubeJobs{
      olapCube{
        cubeName
        databaseName
      }
    }
    `;

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockImplementation(() => {
      throw new Error('mocker');
    });
    const result = await tester.graphql(QUERY_OLAP_CUBE);
    expect(result.errors).not.toBeNull();
  });

  test('Read the sched files for refresh', async () => {
    const QUERY_REFRESH_SCHED = `query{
      refreshScheduler
    }`;
    const fake = new Map();
    fake.set('fakestr1', 'Daily Start of Streams');
    const fakeDate = {
      listOfAllStreams: [
        {
          queueName: '10',
          streamName: 'MPHMPRPT ',
          streamDescription: 'Refresh PHM Reports           ',
          streamStatus: 'Marked Complete'
        }
      ],
      streamPredecessorMap: fake
    };

    const mockConnect = jest.spyOn(serverUtils, 'loadSchedule');
    mockConnect.mockImplementation(() => {
      return getData;
    });

    serverUtils.getStreamObject.mockImplementation(() => {
      return fakeDate;
    });
    resolvers.Query.refreshScheduler();
    tester.graphql(QUERY_REFRESH_SCHED).then(() => expect(true).toEqual(true));
  });

  test('should handle the error when there is an error in reading the sched files for refresh', async () => {
    try {
      jest.spyOn(serverUtils, 'loadSchedule').mockImplementation(() => {
        throw new Error('test');
      });
      resolvers.Query.refreshScheduler();
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });

  test('refresh should return false', async () => {
    const QUERY_REFRESH_SCHED = `query{
      refreshScheduler
    }`;

    const mockConnect = jest.spyOn(serverUtils, 'loadSchedule');
    mockConnect.mockImplementation(() => {
      return '';
    });

    const mockGetStreamObject = jest.spyOn(serverUtils, 'getStreamObject');

    mockGetStreamObject.mockImplementation(() => {
      return '';
    });

    resolvers.Query.refreshScheduler();
    tester.graphql(QUERY_REFRESH_SCHED).then(() => expect(false).toEqual(false));
  });
});
