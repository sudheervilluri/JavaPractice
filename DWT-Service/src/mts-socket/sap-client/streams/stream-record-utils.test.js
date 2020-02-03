import streamRecordUtils from './stream-record-utils';
import utils from '../../utilities/util';
import SapClient from '../sap-client';

describe('formatStreamFinishedDateTime should format the Stream Finished Date Time from Sched file correctly', () => {
  test('Should return empty string when stream record does not contain Finished Date Time', () => {
    // create an empty finishedDateTime of 26 characters
    const mockFinishedDateTime = new Array(26 + 1).join(' ');
    expect(utils.formatFinishedDateTime(mockFinishedDateTime)).toBe('');
  });

  test('Should return date in the format required by UI when stream record contains a Stream Finished Date Time', () => {
    // pass a mock finishedDateTime
    const mockFinishedDateTime = 'Tue Jul 19 13:29:35 2016  ';
    expect(utils.formatFinishedDateTime(mockFinishedDateTime)).toBe('Tue, Jul 19, 2016 13:29:35');
  });
});

describe('parseStreamRecord function should parse the required fields from the stream record and store it in the streams list', () => {
  test('Should successfully format stream finished Date time and other fields store it in streams list', () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 0;
    const mockStreamRecordUtils = jest.spyOn(streamRecordUtils, 'parseStreamRecord');
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
      },
      {
        queueName: '99',
        queueDescription: 'Scheduled Queue     ',
        streams: []
      }
    ];
    sapClient.allFiles.schedFile.queues = fakeData;

    let recordData =
      '01!10DSRSDRPT        4MRefresh SRS Daily Reports     0100000000070100:00:0000:00:000                                                    0010140952014102510100000000070100:00:0000:00:000                                                    0010140952016071800100000000070100:00:0000:00:000                                                    001014095201607180';

    sapClient.parseData(recordData, numberOfFilesRead);

    recordData =
      '01!00D01START        4MDaily Start of Streams        0100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010140952005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';

    sapClient.parseData(recordData, numberOfFilesRead);

    recordData =
      '01!99D01STARR        4MDaily Start of Streams        0100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010140952005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';

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
      },
      {
        queueName: '99',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            queueName: '99',
            streamName: 'D01STARR ',
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

    expect(mockStreamRecordUtils).toHaveBeenCalledTimes(3);
    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });
});
