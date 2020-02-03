import SapClient from '../../sap-client';
import taskRecordUtils from './task-record-utils';
import jobDetailsUtils from './job-details-utils';
import bulkTransactionLoadJobType from './bulk-transaction-load-job/bulk-transaction-load';

jest.mock('./bulk-transaction-load-job/bulk-transaction-load');

describe('taskRecordUtils should parse task record correctly', () => {
  test('parseTaskRecord should parse task record and job details parameters correctly when job type id is 170 and header is Generated', () => {
    const mockGetJobDetails = jest.spyOn(jobDetailsUtils, 'getJobDefinition');
    const mockJobDefinition = {
      id: '170',
      name: 'Bulk Transaction Load',
      details: null,
      parameters: []
    };

    mockGetJobDetails.mockReturnValue(mockJobDefinition);
    const sapClient = new SapClient();

    sapClient.databaseName = 'abcd';
    sapClient.dbServerName = 'xyz';

    const fakeData = {
      queueName: '01',
      jobLimit: '8',
      queueDescription: 'Scheduled Queue1     ',
      streams: [
        {
          jobs: new Map([
            [
              'HMLTRLSU',
              {
                jobName: 'HMLTRLSU',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    const expectedResult = [
      {
        queueName: '01',
        jobLimit: '8',
        queueDescription: 'Scheduled Queue1     ',
        streams: [
          {
            jobs: new Map([
              [
                'HMLTRLSU',
                {
                  jobName: 'HMLTRLSU',
                  predecessors: [],
                  jobDefinition: {
                    databaseName: 'abcd',
                    dbServerName: 'xyz',
                    jobDetails: [
                      { parameter: { name: 'Created by' }, value: 'fichba00' },
                      { parameter: { name: 'Transaction Type' }, value: '918' },
                      { parameter: { name: 'Action' }, value: 'Add' },
                      {
                        parameter: { name: 'File name' },
                        value: 'f:\\process_2620\\mil++++_TRNLOG_STATS.dat'
                      },
                      { parameter: { name: 'Transaction Header' }, value: 'Generated' },
                      { parameter: { name: 'Transaction Format' }, value: 'Delimited' },
                      { parameter: { name: 'Field Terminator' }, value: '|' }
                    ],
                    jobType: '170'
                  }
                }
              ]
            ])
          }
        ]
      }
    ];

    const jobParamterList = [
      { parameter: { name: 'Created by' }, value: 'fichba00' },
      { parameter: { name: 'Transaction Type' }, value: '918' },
      { parameter: { name: 'Action' }, value: 'Add' },
      { parameter: { name: 'File name' }, value: 'f:\\process_2620\\mil++++_TRNLOG_STATS.dat' },
      { parameter: { name: 'Transaction Header' }, value: 'Generated' },
      { parameter: { name: 'Transaction Format' }, value: 'Delimited' },
      { parameter: { name: 'Field Terminator' }, value: '|' }
    ];

    bulkTransactionLoadJobType.parseGeneratedHeaderDetails.mockReturnValue(jobParamterList);

    const dataRecord =
      '01!HMLTRLSU  170|"-U fichba00¶-D SMSDHdss2620¶-S USMLVV3BI0074¶-t 918¶-a 010¶-f f:\\process_2620\\mil++++_TRNLOG_STATS.dat¶-h G¶-F S¶-T |¶"|!';
    taskRecordUtils.parseTaskRecord(dataRecord, sapClient);

    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });

  test('parseTaskRecord should parse task record and job details parameters correctly when job type id is 170 and header is Embedded', () => {
    const mockGetJobDetails = jest.spyOn(jobDetailsUtils, 'getJobDefinition');
    const mockJobDefinition = {
      id: '170',
      name: 'Bulk Transaction Load',
      details: null,
      parameters: []
    };

    mockGetJobDetails.mockReturnValue(mockJobDefinition);
    const sapClient = new SapClient();

    sapClient.databaseName = 'abcd';
    sapClient.dbServerName = 'xyz';

    const fakeData = {
      queueName: '01',
      jobLimit: '8',
      queueDescription: 'Scheduled Queue1     ',
      streams: [
        {
          jobs: new Map([
            [
              'HMLTRLSU',
              {
                jobName: 'HMLTRLSU',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    const expectedResult = [
      {
        queueName: '01',
        jobLimit: '8',
        queueDescription: 'Scheduled Queue1     ',
        streams: [
          {
            jobs: new Map([
              [
                'HMLTRLSU',
                {
                  jobName: 'HMLTRLSU',
                  predecessors: [],
                  jobDefinition: {
                    databaseName: 'abcd',
                    dbServerName: 'xyz',
                    jobDetails: [
                      { parameter: { name: 'Created by' }, value: 'fichba00' },
                      {
                        parameter: { name: 'File name' },
                        value: 'f:\\process_2620\\pms2620_crmf.dat'
                      },
                      { parameter: { name: 'Transaction Header' }, value: 'Embedded' },
                      { parameter: { name: 'Transaction Format' }, value: 'Delimited' }
                    ],
                    jobType: '170'
                  }
                }
              ]
            ])
          }
        ]
      }
    ];

    const jobParamterList = [
      { parameter: { name: 'Created by' }, value: 'fichba00' },
      { parameter: { name: 'File name' }, value: 'f:\\process_2620\\pms2620_crmf.dat' },
      { parameter: { name: 'Transaction Header' }, value: 'Embedded' },
      { parameter: { name: 'Transaction Format' }, value: 'Delimited' }
    ];

    bulkTransactionLoadJobType.parseEmbeddedHeaderDetails.mockReturnValue(jobParamterList);

    const dataRecord =
      '01!HMLTRLSU  170|"-U fichba00¶-D SMSDHdss2620¶-S USMLVV3BI0074¶-f f:\\process_2620\\pms2620_crmf.dat¶-h E¶-F S¶"|';
    taskRecordUtils.parseTaskRecord(dataRecord, sapClient);

    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });

  test('parseTaskRecord should parse task record and job details parameters correctly when job type id is 170 and header is Embedded', () => {
    const mockGetJobDetails = jest.spyOn(jobDetailsUtils, 'getJobDefinition');
    const mockJobDefinition = {
      id: '170',
      name: 'Bulk Transaction Load',
      details: null,
      parameters: []
    };

    mockGetJobDetails.mockReturnValue(mockJobDefinition);
    const sapClient = new SapClient();

    sapClient.databaseName = 'abcd';
    sapClient.dbServerName = 'xyz';

    const fakeData = {
      queueName: '01',
      jobLimit: '8',
      queueDescription: 'Scheduled Queue1     ',
      streams: [
        {
          jobs: new Map([
            [
              'HMLTRLSU',
              {
                jobName: 'HMLTRLSU',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    const expectedResult = [
      {
        queueName: '01',
        jobLimit: '8',
        queueDescription: 'Scheduled Queue1     ',
        streams: [
          {
            jobs: new Map([
              [
                'HMLTRLSU',
                {
                  jobName: 'HMLTRLSU',
                  predecessors: [],
                  jobDefinition: {
                    databaseName: 'abcd',
                    dbServerName: 'xyz',
                    jobDetails: [],
                    jobType: '170'
                  }
                }
              ]
            ])
          }
        ]
      }
    ];

    const dataRecord =
      '01!HMLTRLSU  170|"-U fichba00¶-D SMSDHdss2620¶-S USMLVV3BI0074¶-f f:\\process_2620\\pms2620_crmf.dat¶-h F¶-F S¶"|';
    taskRecordUtils.parseTaskRecord(dataRecord, sapClient);

    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });

  test('parseTaskRecord should parse task record and job details parameters correctly when job identifier is positional', () => {
    const mockGetJobDetails = jest.spyOn(jobDetailsUtils, 'getJobDefinition');
    const mockJobDefinition = {
      id: '370',
      name: 'Delete File',
      details: {
        caption: 'Delete File Job',
        parameterIdentifier: '0',
        parameterSeparator: ';',
        parameterQuoteCharacter: '^',
        translateParameterSeparatorToSpace: 'True',
        translateQuoteCharacter: 'True',
        prefixIdentifier: '-',
        helpContextID: '19016',
        parameterHelpID: '19506'
      },
      parameters: [
        {
          name: 'Delete File Script',
          details: {
            visible: 'False',
            default: 'drupdpst.vbs',
            required: 'True',
            cellType: '1',
            prefix: 'S',
            encloseInQuotes: 'False',
            overviewOrder: '0',
            maxLength: '35',
            password: 'False',
            case: '1',
            allowSpaces: 'False'
          }
        },
        {
          name: 'Full Path File Name',
          details: {
            visible: 'True',
            default: '',
            required: 'True',
            cellType: '1',
            prefix: 'F',
            encloseInQuotes: 'False',
            overviewOrder: '1',
            maxLength: '200',
            password: 'False',
            case: '1',
            allowSpaces: 'False'
          }
        }
      ]
    };

    mockGetJobDetails.mockReturnValue(mockJobDefinition);
    const sapClient = new SapClient();

    sapClient.databaseName = 'abcd';
    sapClient.dbServerName = 'xyz';

    const fakeData = {
      queueName: '00',
      jobLimit: '4',
      queueDescription: 'Scheduled Queue     ',
      streams: [
        {
          jobs: new Map([
            [
              'RMLDGLAD',
              {
                jobName: 'RMLDGLAD',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    const expectedResult = [
      {
        queueName: '00',
        jobLimit: '4',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            jobs: new Map([
              [
                'RMLDGLAD',
                {
                  jobName: 'RMLDGLAD',
                  predecessors: [],
                  jobDefinition: {
                    databaseName: 'abcd',
                    dbServerName: 'xyz',
                    jobType: '370',
                    jobDetails: [
                      {
                        parameter: {
                          name: 'Delete File Script',
                          details: {
                            visible: 'False',
                            default: 'drupdpst.vbs',
                            required: 'True',
                            cellType: '1',
                            prefix: 'S',
                            encloseInQuotes: 'False',
                            overviewOrder: '0',
                            maxLength: '35',
                            password: 'False',
                            case: '1',
                            allowSpaces: 'False'
                          }
                        },
                        value: 'drupdpst.vbs'
                      },
                      {
                        parameter: {
                          name: 'Full Path File Name',
                          details: {
                            visible: 'True',
                            default: '',
                            required: 'True',
                            cellType: '1',
                            prefix: 'F',
                            encloseInQuotes: 'False',
                            overviewOrder: '1',
                            maxLength: '200',
                            password: 'False',
                            case: '1',
                            allowSpaces: 'False'
                          }
                        },
                        value: 'f:\\process_2620\\mil++++_RC_DGLA.dat'
                      }
                    ]
                  }
                }
              ]
            ])
          }
        ]
      }
    ];

    const dataRecord =
      '01!RMLDGLAD  370|"SMSDHdss2620;USMLVV3BI0074;drupdpst.vbs;f:\\process_2620\\mil++++_RC_DGLA.dat" "0;1^1"|!';
    taskRecordUtils.parseTaskRecord(dataRecord, sapClient);

    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });

  test('parseTaskRecord should parse task record and job details parameters correctly when job identifier is prefix', () => {
    const mockGetJobDetails = jest.spyOn(jobDetailsUtils, 'getJobDefinition');
    const mockJobDefinition = {
      id: '330',
      name: 'Delete File',
      details: {
        caption: 'Delete File Job',
        parameterIdentifier: '1',
        parameterSeparator: ';',
        parameterQuoteCharacter: '^',
        translateParameterSeparatorToSpace: 'True',
        translateQuoteCharacter: 'True',
        prefixIdentifier: '-',
        helpContextID: '19016',
        parameterHelpID: '19506'
      },
      parameters: [
        {
          name: 'Retention Days',
          details: {
            visible: 'True',
            default: '45',
            required: 'True',
            cellType: '3',
            prefix: 'r',
            encloseInQuotes: 'False',
            overviewOrder: '1',
            maxLength: '365',
            password: 'False',
            case: '1',
            allowSpaces: 'False'
          }
        },
        {
          name: 'Stream Name',
          details: {
            visible: 'True',
            default: 'DEMAND01',
            required: 'True',
            cellType: '1',
            prefix: 's',
            encloseInQuotes: 'False',
            overviewOrder: '1',
            maxLength: '8',
            password: 'False',
            case: '1',
            allowSpaces: 'False'
          }
        }
      ]
    };

    mockGetJobDetails.mockReturnValue(mockJobDefinition);
    const sapClient = new SapClient();

    sapClient.databaseName = 'abcd';
    sapClient.dbServerName = 'xyz';

    const fakeData = {
      queueName: '00',
      jobLimit: '4',
      queueDescription: 'Scheduled Queue     ',
      streams: [
        {
          jobs: new Map([
            [
              'RMLDGLAD',
              {
                jobName: 'RMLDGLAD',
                predecessors: []
              }
            ]
          ])
        },
        {
          jobs: new Map([
            [
              'test29',
              {
                jobName: 'test29',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    const expectedResult = [
      {
        queueName: '00',
        jobLimit: '4',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            jobs: new Map([
              [
                'RMLDGLAD',
                {
                  jobName: 'RMLDGLAD',
                  predecessors: []
                }
              ]
            ])
          },
          {
            jobs: new Map([
              [
                'test29',
                {
                  jobName: 'test29',
                  predecessors: [],
                  jobDefinition: {
                    databaseName: 'abcd',
                    dbServerName: 'xyz',
                    jobDetails: [
                      {
                        parameter: {
                          name: 'Retention Days',
                          details: {
                            visible: 'True',
                            default: '45',
                            required: 'True',
                            cellType: '3',
                            prefix: 'r',
                            encloseInQuotes: 'False',
                            overviewOrder: '1',
                            maxLength: '365',
                            password: 'False',
                            case: '1',
                            allowSpaces: 'False'
                          }
                        },
                        value: '45'
                      },
                      {
                        parameter: {
                          name: 'Stream Name',
                          details: {
                            visible: 'True',
                            default: 'DEMAND01',
                            required: 'True',
                            cellType: '1',
                            prefix: 's',
                            encloseInQuotes: 'False',
                            overviewOrder: '1',
                            maxLength: '8',
                            password: 'False',
                            case: '1',
                            allowSpaces: 'False'
                          }
                        },
                        value: 'DEMAND01'
                      }
                    ],
                    jobType: '330'
                  }
                }
              ]
            ])
          }
        ]
      }
    ];

    const dataRecord =
      '01!test29    330|"-D SMSDHdss2620 -S USMLVV3BI0074 -r 45 -s DEMAND01" "1;1^1"|!';
    taskRecordUtils.parseTaskRecord(dataRecord, sapClient);

    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });

  test('parseTaskRecord should parse task record and job details parameters correctly for jobs in different queues', () => {
    const mockGetJobDetails = jest.spyOn(jobDetailsUtils, 'getJobDefinition');
    const mockJobDefinition = {
      id: '330',
      name: 'Delete File',
      details: {
        caption: 'Delete File Job',
        parameterIdentifier: '1',
        parameterSeparator: ';',
        parameterQuoteCharacter: '^',
        translateParameterSeparatorToSpace: 'True',
        translateQuoteCharacter: 'True',
        prefixIdentifier: '-',
        helpContextID: '19016',
        parameterHelpID: '19506'
      },
      parameters: [
        {
          name: 'Retention Days',
          details: {
            visible: 'True',
            default: '45',
            required: 'True',
            cellType: '3',
            prefix: 'r',
            encloseInQuotes: 'False',
            overviewOrder: '1',
            maxLength: '365',
            password: 'False',
            case: '1',
            allowSpaces: 'False'
          }
        },
        {
          name: 'Stream Name',
          details: {
            visible: 'True',
            default: 'DEMAND01',
            required: 'True',
            cellType: '1',
            prefix: 's',
            encloseInQuotes: 'False',
            overviewOrder: '1',
            maxLength: '8',
            password: 'False',
            case: '1',
            allowSpaces: 'False'
          }
        }
      ]
    };

    mockGetJobDetails.mockReturnValue(mockJobDefinition);
    const sapClient = new SapClient();

    sapClient.databaseName = 'abcd';
    sapClient.dbServerName = 'xyz';

    let fakeData = {
      queueName: '00',
      jobLimit: '4',
      queueDescription: 'Scheduled Queue     ',
      streams: [
        {
          jobs: new Map([
            [
              'RMLDGLAD',
              {
                jobName: 'RMLDGLAD',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    fakeData = {
      queueName: '01',
      jobLimit: '8',
      queueDescription: 'Scheduled Queue1     ',
      streams: [
        {
          jobs: new Map([
            [
              'test29',
              {
                jobName: 'test29',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    const expectedResult = [
      {
        queueName: '00',
        jobLimit: '4',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            jobs: new Map([
              [
                'RMLDGLAD',
                {
                  jobName: 'RMLDGLAD',
                  predecessors: []
                }
              ]
            ])
          }
        ]
      },
      {
        queueName: '01',
        jobLimit: '8',
        queueDescription: 'Scheduled Queue1     ',
        streams: [
          {
            jobs: new Map([
              [
                'test29',
                {
                  jobName: 'test29',
                  predecessors: [],
                  jobDefinition: {
                    databaseName: 'abcd',
                    dbServerName: 'xyz',
                    jobDetails: [
                      {
                        parameter: {
                          name: 'Retention Days',
                          details: {
                            visible: 'True',
                            default: '45',
                            required: 'True',
                            cellType: '3',
                            prefix: 'r',
                            encloseInQuotes: 'False',
                            overviewOrder: '1',
                            maxLength: '365',
                            password: 'False',
                            case: '1',
                            allowSpaces: 'False'
                          }
                        },
                        value: '45'
                      },
                      {
                        parameter: {
                          name: 'Stream Name',
                          details: {
                            visible: 'True',
                            default: 'DEMAND01',
                            required: 'True',
                            cellType: '1',
                            prefix: 's',
                            encloseInQuotes: 'False',
                            overviewOrder: '1',
                            maxLength: '8',
                            password: 'False',
                            case: '1',
                            allowSpaces: 'False'
                          }
                        },
                        value: 'DEMAND01'
                      }
                    ],
                    jobType: '330'
                  }
                }
              ]
            ])
          }
        ]
      }
    ];

    const dataRecord =
      '01!test29    330|"-D SMSDHdss2620 -S USMLVV3BI0074 -r 45 -s DEMAND01" "1;1^1"|!';
    taskRecordUtils.parseTaskRecord(dataRecord, sapClient);

    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });

  test('parseTaskRecord should parse task record and job details parameters correctly when parameter details are null', () => {
    const mockGetJobDetails = jest.spyOn(jobDetailsUtils, 'getJobDefinition');
    const mockJobDefinition = {
      id: '410',
      name: 'Bulk Transaction Load',
      details: null,
      parameters: []
    };

    mockGetJobDetails.mockReturnValue(mockJobDefinition);
    const sapClient = new SapClient();

    sapClient.databaseName = 'abcd';
    sapClient.dbServerName = 'xyz';

    let fakeData = {
      queueName: '00',
      jobLimit: '4',
      queueDescription: 'Scheduled Queue     ',
      streams: [
        {
          jobs: new Map([
            [
              'RMLDGLAD',
              {
                jobName: 'RMLDGLAD',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    fakeData = {
      queueName: '01',
      jobLimit: '8',
      queueDescription: 'Scheduled Queue1     ',
      streams: [
        {
          jobs: new Map([
            [
              'HMLTRLSU',
              {
                jobName: 'HMLTRLSU',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    const expectedResult = [
      {
        queueName: '00',
        jobLimit: '4',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            jobs: new Map([
              [
                'RMLDGLAD',
                {
                  jobName: 'RMLDGLAD',
                  predecessors: []
                }
              ]
            ])
          }
        ]
      },
      {
        queueName: '01',
        jobLimit: '8',
        queueDescription: 'Scheduled Queue1     ',
        streams: [
          {
            jobs: new Map([
              [
                'HMLTRLSU',
                {
                  jobName: 'HMLTRLSU',
                  predecessors: [],
                  jobDefinition: {
                    databaseName: 'abcd',
                    dbServerName: 'xyz',
                    jobDetails: [],
                    jobType: '410'
                  }
                }
              ]
            ])
          }
        ]
      }
    ];

    const dataRecord =
      '01!HMLTRLSU  410|"-U fichba00¶-D SMSDHdss2620¶-S USMLVV3BI0074¶-t 918¶-a 010¶-f f:\\process_2620\\mil++++_TRNLOG_STATS.dat¶-h G¶-F S¶-T |¶"|!';
    taskRecordUtils.parseTaskRecord(dataRecord, sapClient);

    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });

  test('parseTaskRecord should parse task record and job details parameters correctly when quote character is present', () => {
    const mockGetJobDetails = jest.spyOn(jobDetailsUtils, 'getJobDefinition');
    const mockJobDefinition = {
      id: '490',
      name: 'SSIS Package Execution',
      details: {
        caption: 'SSIS Package Execution',
        parameterIdentifier: '0',
        parameterSeparator: ';',
        parameterQuoteCharacter: '^',
        translateParameterSeparatorToSpace: 'True',
        translateQuoteCharacter: 'True',
        prefixIdentifier: '-',
        helpContextID: '',
        parameterHelpID: ''
      },
      parameters: [
        {
          name: 'SSIS Script',
          details: {
            visible: 'False',
            default: 'schSSISexec.vbs',
            required: 'True',
            cellType: '1',
            prefix: '',
            encloseInQuotes: 'False',
            overviewOrder: '0',
            maxLength: '50',
            password: 'False',
            case: '1',
            allowSpaces: 'False'
          }
        },
        {
          name: 'SSIS Package Name',
          details: {
            visible: 'True',
            default: '',
            required: 'True',
            cellType: '1',
            prefix: '',
            encloseInQuotes: 'True',
            overviewOrder: '1',
            maxLength: '128',
            password: 'False',
            case: '1',
            allowSpaces: 'True'
          }
        },
        {
          name: 'SSIS Folder Name',
          details: {
            visible: 'True',
            default: '',
            required: 'True',
            cellType: '1',
            prefix: '',
            encloseInQuotes: 'True',
            overviewOrder: '1',
            maxLength: '128',
            password: 'False',
            case: '1',
            allowSpaces: 'True'
          }
        },
        {
          name: 'SSIS Config File Name',
          details: {
            visible: 'True',
            default: '',
            required: 'False',
            cellType: '1',
            prefix: '',
            encloseInQuotes: 'True',
            overviewOrder: '1',
            maxLength: '128',
            password: 'False',
            case: '1',
            allowSpaces: 'True'
          }
        }
      ]
    };

    mockGetJobDetails.mockReturnValue(mockJobDefinition);
    const sapClient = new SapClient();

    sapClient.databaseName = 'abcd';
    sapClient.dbServerName = 'xyz';

    const fakeData = {
      queueName: '00',
      jobLimit: '4',
      queueDescription: 'Scheduled Queue     ',
      streams: [
        {
          jobs: new Map([
            [
              '01BISDMS',
              {
                jobName: '01BISDMS',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    const expectedResult = [
      {
        queueName: '00',
        jobLimit: '4',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            jobs: new Map([
              [
                '01BISDMS',
                {
                  jobName: '01BISDMS',
                  predecessors: [],
                  jobDefinition: {
                    databaseName: 'abcd',
                    dbServerName: 'xyz',
                    jobDetails: [
                      {
                        parameter: {
                          name: 'SSIS Script',
                          details: {
                            visible: 'False',
                            default: 'schSSISexec.vbs',
                            required: 'True',
                            cellType: '1',
                            prefix: '',
                            encloseInQuotes: 'False',
                            overviewOrder: '0',
                            maxLength: '50',
                            password: 'False',
                            case: '1',
                            allowSpaces: 'False'
                          }
                        },
                        value: 'schSSISexec.vbs'
                      },
                      {
                        parameter: {
                          name: 'SSIS Package Name',
                          details: {
                            visible: 'True',
                            default: '',
                            required: 'True',
                            cellType: '1',
                            prefix: '',
                            encloseInQuotes: 'True',
                            overviewOrder: '1',
                            maxLength: '128',
                            password: 'False',
                            case: '1',
                            allowSpaces: 'True'
                          }
                        },
                        value: 'DataMigrationServices.dtsx'
                      },
                      {
                        parameter: {
                          name: 'SSIS Folder Name',
                          details: {
                            visible: 'True',
                            default: '',
                            required: 'True',
                            cellType: '1',
                            prefix: '',
                            encloseInQuotes: 'True',
                            overviewOrder: '1',
                            maxLength: '128',
                            password: 'False',
                            case: '1',
                            allowSpaces: 'True'
                          }
                        },
                        value: 'DataMigrationServices'
                      },
                      {
                        parameter: {
                          name: 'SSIS Config File Name',
                          details: {
                            visible: 'True',
                            default: '',
                            required: 'False',
                            cellType: '1',
                            prefix: '',
                            encloseInQuotes: 'True',
                            overviewOrder: '1',
                            maxLength: '128',
                            password: 'False',
                            case: '1',
                            allowSpaces: 'True'
                          }
                        },
                        value: 'DataMigrationServices.dtsConfig'
                      }
                    ],
                    jobType: '490'
                  }
                }
              ]
            ])
          }
        ]
      }
    ];

    const dataRecord =
      '01!01BISDMS  490|"SMSDHdss2620;USMLVV3BI0074;schSSISexec.vbs;^DataMigrationServices.dtsx^;^DataMigrationServices^;^DataMigrationServices.dtsConfig^" "0;1^1"|!';
    taskRecordUtils.parseTaskRecord(dataRecord, sapClient);

    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });
});
