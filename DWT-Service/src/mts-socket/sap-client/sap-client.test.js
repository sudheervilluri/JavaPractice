import SapClient from './sap-client';
import MTSSock from '../mts-socket';
import MTSServiceConstants from '../utilities/mts-service-constants';
import sapClientUtilities from './sap-client-utils';
import streamRecordUtils from './streams/stream-record-utils';
import controlRecordUtils from './control-record/control-record-utils';
import jobRecordUtils from './job/job-record-utils';
import notifRecordUtils from './notifications/notif-record-utils';
import scheduleDetails from './schedule/schedule-details';
import taskRecordUtils from './job/job-details/task-record-utils';

jest.mock('../mts-socket');

describe('SapClient should work with all functionality', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should call MTSSock connect method when connect method is invoked', () => {
    const sapClient = new SapClient();

    const mockConnect = jest.spyOn(MTSSock.prototype, 'connect');

    sapClient.connect(5050, 'localhost');

    expect(mockConnect).toBeCalledWith(5050, 'localhost');
  });

  test('SapClient Read method should call mtssock Read method to fetch details', async () => {
    const sapClient = new SapClient();

    const mockRead = jest.spyOn(MTSSock.prototype, 'read');

    await sapClient.read(MTSServiceConstants.MTS_SERVICE_VIEW);

    expect(mockRead).toBeCalled();
  });

  test('SapClient readSchedFile function should call SapClient read function with correct MTS service request code', async () => {
    const sapClient = new SapClient();

    const mockRead = jest.spyOn(SapClient.prototype, 'read');

    await sapClient.readSchedFile();

    expect(mockRead).toBeCalledWith(MTSServiceConstants.MTS_SERVICE_VIEW_SCHEDULE_FILE_ONLY);
  });

  test('SapClient readAllFiles function should call SapClient read function with correct MTS service request code', async () => {
    const sapClient = new SapClient();

    const mockRead = jest.spyOn(SapClient.prototype, 'read');

    await sapClient.readAllFiles();

    expect(mockRead).toBeCalledWith(MTSServiceConstants.MTS_SERVICE_VIEW);
  });
});

describe('parseData function of SapClient class should function as expected ', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('When record data is null', () => {
    const sapClient = new SapClient();
    const recordData = null;
    const mockUtils = jest.spyOn(sapClientUtilities, 'dayOfTheYearToMonth');
    sapClient.parseData(recordData);
    expect(mockUtils).not.toHaveBeenCalled();
  });

  test('When record type is not control record', () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 0;
    const recordData =
      '01!  0000210C        1 0404201903:11:3300000030119093004004..\\chkpoint\\SMSDHdss2520|..\\log\\sch_SMSDHdss2520.log|..\\data\task_SMSDHdss2520|..\\data\\notif_SMSDHdss2520|';
    const mockUtils = jest.spyOn(sapClientUtilities, 'dayOfTheYearToMonth');
    sapClient.parseData(recordData, numberOfFilesRead);
    expect(mockUtils).not.toHaveBeenCalled();
  });

  test('parseData function returns an object with the required control record values (single digit date in sched current date time)', async () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 0;
    const mockUtils = jest.spyOn(sapClientUtilities, 'dayOfTheYearToMonth');
    const recordData =
      '01!  0000210C        2 0404201903:11:3300000030119093004004..\\chkpoint\\SMSDHdss2520|..\\log\\sch_SMSDHdss2520.log|..\\data\\task_SMSDHdss2520|..\\data\\notif_SMSDHdss2520|';
    const result = sapClient.parseData(recordData, numberOfFilesRead);
    expect(mockUtils).toHaveBeenCalled();
    expect(result.schedFile.controlRecord).toMatchObject({
      schedulerLogFilePath: '..\\log\\sch_SMSDHdss2520.log',
      taskFilePath: '..\\data\\task_SMSDHdss2520',
      notificationFilePath: '..\\data\\notif_SMSDHdss2520',
      sleepInterval: 30,
      lastMaintenanceDateTime: 'Apr 04, 2019 03:11:33',
      currentSchedulerDate: 'Thu, Apr 04, 2019',
      checkpointDirectoryPath: '..\\chkpoint\\SMSDHdss2520'
    });
  });

  test('parseData function returns an object with the required control record values (double digit date in sched current date time)', async () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 0;
    const mockUtils = jest.spyOn(sapClientUtilities, 'dayOfTheYearToMonth');
    const recordData =
      '01!  0000210C        2 0404201903:11:3300000030119093004014..\\chkpoint\\SMSDHdss2520|..\\log\\sch_SMSDHdss2520.log|..\\data\\task_SMSDHdss2520|..\\data\\notif_SMSDHdss2520|';
    const result = sapClient.parseData(recordData, numberOfFilesRead);
    expect(mockUtils).toHaveBeenCalled();
    expect(result.schedFile.controlRecord).toMatchObject({
      schedulerLogFilePath: '..\\log\\sch_SMSDHdss2520.log',
      taskFilePath: '..\\data\\task_SMSDHdss2520',
      notificationFilePath: '..\\data\\notif_SMSDHdss2520',
      sleepInterval: 30,
      lastMaintenanceDateTime: 'Apr 04, 2019 03:11:33',
      currentSchedulerDate: 'Thu, Apr 14, 2019',
      checkpointDirectoryPath: '..\\chkpoint\\SMSDHdss2520'
    });
  });

  test('ParseData should parse all stream fields correctly', async () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 0;
    const fakeQueueData = [
      {
        queueName: '10',
        queueDescription: 'Reports             ',
        streams: []
      },
      {
        queueName: '00',
        queueDescription: 'Scheduled Queue     ',
        streams: []
      }
    ];
    sapClient.allFiles.schedFile.queues = fakeQueueData;
    const mockParseStreamRecord = jest.spyOn(streamRecordUtils, 'parseStreamRecord');
    const mockParseSchedule = jest.spyOn(scheduleDetails, 'parseScheduleRecord');

    let recordData =
      '01!10DSRSDRPT        4MRefresh SRS Daily Reports     0100000000070100:00:0000:00:000                                                    0010140952014102510100000000070100:00:0000:00:000                                                    0010140952016071800100000000070100:00:0000:00:000                                                    001014095201607180';

    sapClient.parseData(recordData, numberOfFilesRead);

    recordData =
      '01!00D01START        4MDaily Start of Streams        0100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010140952005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';

    sapClient.parseData(recordData, numberOfFilesRead);

    recordData = '01!10DSRSDRPT        5DSHRDDIM!';

    sapClient.parseData(recordData, numberOfFilesRead);

    recordData = '01!10DSRSDRPT        5DSRSDFCT!';

    sapClient.parseData(recordData, numberOfFilesRead);

    const expectedResult = [
      {
        queueName: '10',
        queueDescription: 'Reports             ',
        streams: [
          {
            queueName: '10',
            streamName: 'DSRSDRPT ',
            streamDescription: 'Refresh SRS Daily Reports     ',
            streamStatus: 'Marked Complete',
            streamFinishedDateTime: '',
            notifications: [],
            jobs: new Map(),
            predecessors: [
              {
                streamOrJobName: 'DSHRDDIM'
              },
              {
                streamOrJobName: 'DSRSDFCT'
              }
            ],
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
      },
      {
        queueName: '00',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            queueName: '00',
            streamName: 'D01START ',
            streamDescription: 'Daily Start of Streams        ',
            streamStatus: 'Marked Complete',
            streamFinishedDateTime: 'Tue, Jul 19, 2016 13:29:35',
            notifications: [],
            jobs: new Map(),
            predecessors: [],
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
                      lastActualStartTime: 'Tue Jul 19 13:28:05 2016',
                      lastActualEndTime: 'Tue, Jul 19, 2016 13:29:35',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '01/26/2005'
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
                      lastActualEndTime: 'Sun, Oct 26, 2014 00:00:00',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '01/26/2005'
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
                      baseDate: '01/26/2005'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ];

    expect(mockParseSchedule).toHaveBeenCalledTimes(2);
    expect(mockParseStreamRecord).toHaveBeenCalledTimes(2);
    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });

  test('ParseData should parse all stream and control record fields correctly', async () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 0;
    const fakeData = [
      {
        queueName: '10',
        queueDescription: 'Reports             ',
        streams: []
      },
      {
        queueName: '00',
        queueDescription: 'Scheduled Queue     ',
        streams: []
      }
    ];
    const mockParseStreamRecord = jest.spyOn(streamRecordUtils, 'parseStreamRecord');

    const mockParseControlRecord = jest.spyOn(controlRecordUtils, 'parseControlRecord');

    let recordData =
      '01!  0000210C        2 0404201903:11:3300000030119093004014..\\chkpoint\\SMSDHdss2520|..\\log\\sch_SMSDHdss2520.log|..\\data\\task_SMSDHdss2520|..\\data\\notif_SMSDHdss2520|';
    sapClient.parseData(recordData, numberOfFilesRead);
    sapClient.allFiles.schedFile.queues = fakeData;
    recordData =
      '01!10DSRSDRPT        4MRefresh SRS Daily Reports     0100000000070100:00:0000:00:000                                                    0010140952014102510100000000070100:00:0000:00:000                                                    0010140952016071800100000000070100:00:0000:00:000                                                    001014095201607180';

    sapClient.parseData(recordData, numberOfFilesRead);

    recordData =
      '01!00D01START        4MDaily Start of Streams        0100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010140952005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';

    sapClient.parseData(recordData, numberOfFilesRead);

    recordData =
      '01!00D01START02CLNTSK6SClean ALL Jobs from TskCtl    0200000000070100:00:0000:00:000Tue Apr 25 09:15:17 2006                            0010140952005121910100000000070100:00:0000:00:000                                                    0010140952006042500100000000070100:00:0000:00:000                                                    001014095200604250';

    sapClient.parseData(recordData, numberOfFilesRead);

    recordData = '01!00D01START02CLNTSK8001START!';

    sapClient.parseData(recordData, numberOfFilesRead);

    const expectedResult = [
      {
        queueName: '10',
        queueDescription: 'Reports             ',
        streams: [
          {
            queueName: '10',
            streamName: 'DSRSDRPT ',
            streamDescription: 'Refresh SRS Daily Reports     ',
            streamStatus: 'Marked Complete',
            streamFinishedDateTime: '',
            notifications: [],
            jobs: new Map(),
            predecessors: [],
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
      },
      {
        queueName: '00',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            queueName: '00',
            streamName: 'D01START ',
            streamDescription: 'Daily Start of Streams        ',
            streamStatus: 'Marked Complete',
            streamFinishedDateTime: 'Tue, Jul 19, 2016 13:29:35',
            notifications: [],
            jobs: new Map([
              [
                '02CLNTSK',
                {
                  jobName: '02CLNTSK',
                  description: 'Clean ALL Jobs from TskCtl    ',
                  finishedDateTime: '',
                  jobStatus: 'Scheduled',
                  notifications: [],
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
                          frequency: '2',
                          forceExecution: '0',
                          scheduleActive: '1',
                          dateAndTime: {
                            lastActualStartTime: 'Tue Apr 25 09:15:17 2006',
                            lastActualEndTime: '',
                            earliestStartTime: '00:00',
                            latestStartTime: '00:00',
                            baseDate: '12/19/2005'
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
                            baseDate: '04/25/2006'
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
                            baseDate: '04/25/2006'
                          }
                        }
                      }
                    ]
                  },
                  predecessors: [
                    {
                      streamOrJobName: '001START'
                    }
                  ]
                }
              ]
            ]),
            predecessors: [],
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
                      lastActualStartTime: 'Tue Jul 19 13:28:05 2016',
                      lastActualEndTime: 'Tue, Jul 19, 2016 13:29:35',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '01/26/2005'
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
                      lastActualEndTime: 'Sun, Oct 26, 2014 00:00:00',
                      earliestStartTime: '00:00',
                      latestStartTime: '00:00',
                      baseDate: '01/26/2005'
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
                      baseDate: '01/26/2005'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ];

    expect(mockParseStreamRecord).toHaveBeenCalledTimes(2);
    expect(mockParseControlRecord).toBeCalled();
    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
    expect(sapClient.allFiles.schedFile.controlRecord).toMatchObject({
      schedulerLogFilePath: '..\\log\\sch_SMSDHdss2520.log',
      taskFilePath: '..\\data\\task_SMSDHdss2520',
      notificationFilePath: '..\\data\\notif_SMSDHdss2520',
      sleepInterval: 30,
      lastMaintenanceDateTime: 'Apr 04, 2019 03:11:33',
      currentSchedulerDate: 'Thu, Apr 14, 2019',
      checkpointDirectoryPath: '..\\chkpoint\\SMSDHdss2520'
    });
  });
});

describe('parseJobsRecord function should parse the required fields from the jobs record and store it in the jobs list', () => {
  test('Should successfully format jobs finished Date time and other fields store it in jobs list', () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 0;
    const mockJobRecordUtils = jest.spyOn(jobRecordUtils, 'parseJobRecord');
    const fakeQueueData = [
      {
        queueName: '10',
        queueDescription: 'Reports             ',
        streams: [
          {
            streamName: 'DSRSDRPT ',
            streamDescription: 'Refresh SRS Daily Reports     ',
            streamStatus: 'Marked Complete',
            streamFinishedDateTime: '',
            notifications: [],
            predecessors: [],
            jobs: new Map()
          }
        ]
      },
      {
        queueName: '00',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            streamName: 'D01START ',
            streamDescription: 'Daily Start of Streams        ',
            streamStatus: 'Marked Complete',
            streamFinishedDateTime: 'Tue, Jul 19, 2016 13:29:35',
            notifications: [],
            predecessors: [],
            jobs: new Map()
          }
        ]
      }
    ];
    sapClient.allFiles.schedFile.queues = fakeQueueData;
    let recordData =
      '01!10DSRSDRPT1SRSDCUB6SRefresh S1 Daily Cubes        0200000000070100:00:0000:00:000Mon Jul 18 10:36:18 2016                            0010140952009050510100000000070100:00:0000:00:000                                                    0010140952009061100100000000070100:00:0000:00:000                                                    001014095200906110!0035701';

    sapClient.parseData(recordData, numberOfFilesRead);

    recordData =
      '01!00D01START1SRSDCUB6SRefresh S2 Daily Cubes        0200000000070100:00:0000:00:000Mon Jul 18 10:36:18 2016                            0010140952009050510100000000070100:00:0000:00:000                                                    0010140952009061100100000000070100:00:0000:00:000                                                    001014095200906110!0035701';
    const recordData1 =
      '01!00D01START1ARSDCUB6SRefresh S3 Daily Cubes        0200000000070100:00:0000:00:000Mon Jul 18 10:36:18 2016                            0010140952009050510100000000070100:00:0000:00:000                                                    0010140952009061100100000000070100:00:0000:00:000                                                    001014095200906110!0035701';

    sapClient.parseData(recordData, numberOfFilesRead);
    sapClient.parseData(recordData1, numberOfFilesRead);
    const expectedResult = [
      {
        queueName: '10',
        queueDescription: 'Reports             ',
        streams: [
          {
            streamName: 'DSRSDRPT ',
            streamDescription: 'Refresh SRS Daily Reports     ',
            streamStatus: 'Marked Complete',
            streamFinishedDateTime: '',
            notifications: [],
            predecessors: [],
            jobs: new Map([
              [
                '1SRSDCUB',
                {
                  jobName: '1SRSDCUB',
                  description: 'Refresh S1 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
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
                          frequency: '2',
                          forceExecution: '0',
                          scheduleActive: '1',
                          dateAndTime: {
                            lastActualStartTime: 'Mon Jul 18 10:36:18 2016',
                            lastActualEndTime: '',
                            earliestStartTime: '00:00',
                            latestStartTime: '00:00',
                            baseDate: '05/05/2009'
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
                            baseDate: '06/11/2009'
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
                            baseDate: '06/11/2009'
                          }
                        }
                      }
                    ]
                  },
                  predecessors: []
                }
              ]
            ])
          }
        ]
      },
      {
        queueName: '00',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            streamName: 'D01START ',
            streamDescription: 'Daily Start of Streams        ',
            streamStatus: 'Marked Complete',
            streamFinishedDateTime: 'Tue, Jul 19, 2016 13:29:35',
            notifications: [],
            predecessors: [],
            jobs: new Map([
              [
                '1SRSDCUB',
                {
                  jobName: '1SRSDCUB',
                  description: 'Refresh S2 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
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
                          frequency: '2',
                          forceExecution: '0',
                          scheduleActive: '1',
                          dateAndTime: {
                            lastActualStartTime: 'Mon Jul 18 10:36:18 2016',
                            lastActualEndTime: '',
                            earliestStartTime: '00:00',
                            latestStartTime: '00:00',
                            baseDate: '05/05/2009'
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
                            baseDate: '06/11/2009'
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
                            baseDate: '06/11/2009'
                          }
                        }
                      }
                    ]
                  },
                  predecessors: []
                }
              ],
              [
                '1ARSDCUB',
                {
                  jobName: '1ARSDCUB',
                  description: 'Refresh S3 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
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
                          frequency: '2',
                          forceExecution: '0',
                          scheduleActive: '1',
                          dateAndTime: {
                            lastActualStartTime: 'Mon Jul 18 10:36:18 2016',
                            lastActualEndTime: '',
                            earliestStartTime: '00:00',
                            latestStartTime: '00:00',
                            baseDate: '05/05/2009'
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
                            baseDate: '06/11/2009'
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
                            baseDate: '06/11/2009'
                          }
                        }
                      }
                    ]
                  },
                  predecessors: []
                }
              ]
            ])
          }
        ]
      }
    ];
    expect(mockJobRecordUtils).toHaveBeenCalledTimes(3);
    expect(sapClient.allFiles.schedFile.queues).toStrictEqual(expectedResult);
  });
  test('parseNotifRecord is called when the number of files read is 2', () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 2;
    const mockNotifRecordUtils = jest.spyOn(notifRecordUtils, 'parseNotifRecord');
    const fakeNotifRecordData = '01!S|DLPRDINT|E|S|1|0||johndoea@cerner.com!';
    sapClient.parseData(fakeNotifRecordData, numberOfFilesRead);
    expect(mockNotifRecordUtils).toHaveBeenCalledTimes(1);
  });
});

describe('parseData function should parse task record correctly', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('parseTaskRecord is called when the number of files read is 1', () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 1;
    const mockTaskRecordUtils = jest.spyOn(taskRecordUtils, 'parseTaskRecord');
    const fakeTaskRecordData =
      '01!01BISDMS  490|"SMSDHdss2620;USMLVV3BI0074;schSSISexec.vbs;^DataMigrationServices.dtsx^;^DataMigrationServices^;^DataMigrationServices.dtsConfig^" "0;1^1"|!';
    mockTaskRecordUtils.mockReturnValue('mock return value');
    sapClient.parseData(fakeTaskRecordData, numberOfFilesRead);
    expect(mockTaskRecordUtils).toHaveBeenCalledTimes(1);
  });

  test('nothing should happen when parseData is called when the number of files read is not equal to 1, 2 and 3', () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 5;
    const mockStreamRecordUtils = jest.spyOn(streamRecordUtils, 'parseStreamRecord');
    const mockJobRecordUtils = jest.spyOn(jobRecordUtils, 'parseJobRecord');
    const mockTaskRecordUtils = jest.spyOn(taskRecordUtils, 'parseTaskRecord');
    const mockNotifRecordUtils = jest.spyOn(notifRecordUtils, 'parseNotifRecord');
    const fakeRecordData = 'some fake data';
    sapClient.parseData(fakeRecordData, numberOfFilesRead);

    expect(mockStreamRecordUtils).toHaveBeenCalledTimes(0);
    expect(mockJobRecordUtils).toHaveBeenCalledTimes(0);
    expect(mockTaskRecordUtils).toHaveBeenCalledTimes(0);
    expect(mockNotifRecordUtils).toHaveBeenCalledTimes(0);
  });
});
