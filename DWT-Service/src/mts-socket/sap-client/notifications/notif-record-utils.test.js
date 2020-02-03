import notifUtils from './notif-record-utils';
import SapClient from '../sap-client';
import mockData from '../../../data/schedule.mock';

describe('parseNotifRecord function should parse the required fields from the notif record and store it in the notifications list of streams and jobs', () => {
  test('Should successfully store the required notification details of a stream in a list of that stream', () => {
    const sapClient = new SapClient();
    const fakeQueues = mockData.getSched();
    sapClient.allFiles.schedFile.queues = fakeQueues.queues;

    let recordData = '01!S|DLPRDINT|E|S|1|0||johndoea@cerner.com!';

    notifUtils.parseNotifRecord(recordData, sapClient);

    recordData = '01!S|DMILCLIN|E|F|1|0||johndoeb@cerner.com!';

    notifUtils.parseNotifRecord(recordData, sapClient);

    recordData = '01!J|DMILCLIN|E|F|1|0||johndoeb@cerner.com!';
    notifUtils.parseNotifRecord(recordData, sapClient);
    const expectedResult = [
      {
        queueName: '01',
        queueDescription: 'fake queue01',
        streams: [
          {
            streamName: 'fakestr1',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map([
              [
                'fakejob2',
                {
                  jobName: 'fakejob2',
                  description: 'Refresh S3 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  jobDefinition: {
                    jobType: '410',
                    jobDetails: []
                  }
                }
              ]
            ]),
            notifications: [
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '0',
                eventType: 'F'
              },
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '1',
                eventType: 'S'
              }
            ],
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
          },
          {
            streamName: 'fakestr2',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map([
              [
                'fakejob2',
                {
                  jobName: 'fakejob2',
                  description: 'Refresh S4 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  jobDefinition: {
                    jobType: '360',
                    jobDetails: []
                  }
                }
              ],
              [
                'fakejob3',
                {
                  jobName: 'fakejob3',
                  description: 'Refresh S5 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  jobDefinition: {
                    jobType: '390',
                    jobDetails: []
                  }
                }
              ]
            ]),
            notifications: [
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac01n@hotmail.com',
                enabled: '1',
                eventType: 'S'
              },
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '1',
                eventType: 'F'
              }
            ],
            predecessors: []
          },
          {
            streamName: 'fakestr3',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map([
              [
                'fakejob3',
                {
                  jobName: 'fakejob3',
                  description: 'Refresh S6 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: []
                }
              ],
              [
                'fakejob2',
                {
                  jobName: 'fakejob2',
                  description: 'Refresh S7 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  jobDefinition: {
                    jobType: '390',
                    jobDetails: []
                  }
                }
              ]
            ]),
            notifications: [
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac01n@hotmail.com',
                enabled: '1',
                eventType: 'S'
              },
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac00n@hotmail.com',
                enabled: '0',
                eventType: 'S'
              }
            ],
            predecessors: []
          }
        ]
      },
      {
        queueName: '00',
        queueDescription: 'fake 00queue00',
        streams: [
          {
            streamName: 'fakestr1',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map(),
            notifications: [],
            predecessors: []
          },
          {
            streamName: 'fakestr1',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map(),
            notifications: [],
            predecessors: []
          },
          {
            streamName: 'DLPRDINT',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            notifications: [
              {
                streamOrJobIdentifier: 'S',
                streamOrJobName: 'DLPRDINT',
                notificationType: 'E',
                eventType: 'Success',
                enabled: '1',
                emailAddress: 'johndoea@cerner.com'
              }
            ],
            jobs: new Map([
              [
                '4LPRFPV',
                {
                  jobName: '4LPRFPV',
                  description: 'Refresh S8 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  jobDefinition: {
                    jobType: '360',
                    jobDetails: []
                  }
                }
              ],
              [
                '3LPRFPD',
                {
                  jobName: '3LPRFPD ',
                  description: 'Refresh S9 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  jobDefinition: {
                    jobType: '200',
                    jobDetails: []
                  }
                }
              ],
              [
                '1LPRFPW',
                {
                  jobName: '1LPRFPW',
                  description: 'Refresh S10 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  jobDefinition: {
                    jobType: '390',
                    jobDetails: []
                  }
                }
              ],
              [
                '0104PAX',
                {
                  jobName: '0104PAX',
                  description: 'Refresh S11 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [
                    {
                      streamOrJobName: '0104PAX',
                      notificationType: 'E',
                      eventType: 'Success',
                      enabled: '1',
                      emailAddress: 'johndoea@cerner.com'
                    }
                  ],
                  jobDefinition: {
                    jobType: '410',
                    jobDetails: []
                  }
                }
              ]
            ]),
            predecessors: [
              {
                streamOrJobName: 'DMILCLIN'
              },
              {
                streamOrJobName: 'fakestr2'
              }
            ]
          },
          {
            streamName: 'DMILCLIN',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            notifications: [
              {
                streamOrJobIdentifier: 'S',
                streamOrJobName: 'DMILCLIN',
                notificationType: 'E',
                eventType: 'Failure',
                enabled: '1',
                emailAddress: 'johndoeb@cerner.com'
              }
            ],
            jobs: new Map([
              [
                '01BISDMS',
                {
                  jobName: '01BISDMS',
                  description: 'Refresh S12 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [
                    {
                      streamOrJobName: '01BISDMS',
                      notificationType: 'E',
                      eventType: 'Success',
                      enabled: '0',
                      emailAddress: '0aUocs@cerner.com'
                    },
                    {
                      streamOrJobName: '01BISDMS',
                      notificationType: 'E',
                      eventType: 'Failure',
                      enabled: '1',
                      emailAddress: 'johndoea@cerner.com'
                    },
                    {
                      streamOrJobName: '01BISDMS',
                      notificationType: 'E',
                      eventType: 'Success',
                      enabled: '1',
                      emailAddress: '0a1Uocs@cerner.com'
                    },
                    {
                      streamOrJobName: '01BISDMS',
                      notificationType: 'E',
                      eventType: 'Failure',
                      enabled: '1',
                      emailAddress: '0a1Uocs@cerner.com'
                    }
                  ],
                  jobDefinition: {
                    jobType: '400',
                    jobDetails: []
                  }
                }
              ]
            ]),
            predecessors: [
              {
                streamOrJobName: 'fakestr1'
              }
            ]
          }
        ]
      },
      {
        queueName: '02',
        queueDescription: 'fake queue02',
        streams: [
          {
            streamName: 'fakestr1',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map(),
            predecessors: []
          },
          {
            streamName: 'fakestr2',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map(),
            predecessors: [
              {
                streamOrJobName: 'fakestr1'
              }
            ]
          }
        ]
      }
    ];
    const expectedResultAsString = JSON.stringify(expectedResult);
    const receivedResult = JSON.stringify(sapClient.allFiles.schedFile.queues);
    expect(receivedResult).toEqual(expectedResultAsString);
  });
  test('Should successfully store the required notification details of a job in a list of notifications in its respective job', () => {
    const sapClient = new SapClient();
    const fakeQueues = mockData.getSched();
    sapClient.allFiles.schedFile.queues = fakeQueues.queues;

    let recordData = '01!J|3LPRFPD|E|S|1|0||johndoea@cerner.com!';
    notifUtils.parseNotifRecord(recordData, sapClient);
    recordData = '01!J|4LPRFPV|E|F|1|0||johndoeb@cerner.com!';
    notifUtils.parseNotifRecord(recordData, sapClient);
    recordData = '01!J|1LPRFPW|E|F|1|0||johndoeb@cerner.com!';
    notifUtils.parseNotifRecord(recordData, sapClient);
    recordData = '01!J|1LPRFPW|E|S|1|0||johndoeb@cerner.com!';
    notifUtils.parseNotifRecord(recordData, sapClient);
    recordData = '01!J|1LPRFPW|E|S|0|0||johndoec@cerner.com!';
    notifUtils.parseNotifRecord(recordData, sapClient);
    recordData = '01!Y|1LPRFPW|E|S|0|0||johndoec@cerner.com!';
    notifUtils.parseNotifRecord(recordData, sapClient);
    const expectedResult = [
      {
        queueName: '01',
        queueDescription: 'fake queue01',
        streams: [
          {
            streamName: 'fakestr1',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map([
              [
                'fakejob2',
                {
                  jobName: 'fakejob2',
                  description: 'Refresh S2 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  jobDefinition: {
                    jobType: '410',
                    jobDetails: []
                  }
                }
              ]
            ]),
            notifications: [
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '0',
                eventType: 'F'
              },
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '1',
                eventType: 'S'
              }
            ],
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
          },
          {
            streamName: 'fakestr2',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map([
              [
                'fakejob1',
                {
                  jobName: 'fakejob1',
                  description: '0 fakejob1 description',
                  notifications: [],
                  predecessors: [],
                  jobDefinition: {
                    jobType: '360',
                    jobDetails: []
                  }
                }
              ],
              [
                'fakejob2',
                {
                  jobName: 'fakejob2',
                  description: 'Refresh S4 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  predecessors: [{ streamOrJobName: 'fakejob1' }]
                }
              ],
              [
                'fakejob9',
                {
                  jobName: 'fakejob9',
                  description: '0 fakejob9 description',
                  notifications: [],
                  predecessors: [],
                  jobDefinition: {
                    jobType: '360',
                    jobDetails: []
                  }
                }
              ],
              [
                'fakejob3',
                {
                  jobName: 'fakejob3',
                  description: 'Refresh S5 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  predecessors: []
                }
              ],
              [
                'fakejob4',
                {
                  jobName: 'fakejob4',
                  description: '2 fakejob1 description',
                  notifications: [],
                  predecessors: [
                    {
                      streamOrJobName: 'fakejob2'
                    }
                  ]
                }
              ],
              [
                'fakejob5',
                {
                  jobName: 'fakejob5',
                  description: 'job1 description',
                  notifications: [],
                  predecessors: []
                }
              ]
            ]),
            notifications: [
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac01n@hotmail.com',
                enabled: '1',
                eventType: 'S'
              },
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac0rn@hotmail.com',
                enabled: '1',
                eventType: 'F'
              }
            ],
            predecessors: []
          },
          {
            streamName: 'fakestr3',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map([
              [
                'fakejob2',
                {
                  jobName: 'fakejob2',
                  description: 'Refresh S7 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [],
                  jobDefinition: {
                    jobType: '390',
                    jobDetails: []
                  }
                }
              ],
              [
                'fakejob3',
                {
                  jobName: 'fakejob3',
                  description: 'Refresh S6 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: []
                }
              ]
            ]),
            notifications: [
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac01n@hotmail.com',
                enabled: '1',
                eventType: 'S'
              },
              {
                streamOrJobName: 'fake_notification',
                emailAddress: 'ac00n@hotmail.com',
                enabled: '0',
                eventType: 'S'
              }
            ],
            predecessors: []
          }
        ]
      },
      {
        queueName: '00',
        queueDescription: 'fake 00queue00',
        streams: [
          {
            streamName: 'fakestr1',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map(),
            notifications: [],
            predecessors: []
          },
          {
            streamName: 'fakestr1',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map(),
            notifications: [],
            predecessors: []
          },
          {
            streamName: 'DLPRDINT',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            notifications: [],
            jobs: new Map([
              [
                '4LPRFPV',
                {
                  jobName: '4LPRFPV',
                  description: 'Refresh S8 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [
                    {
                      streamOrJobIdentifier: 'J',
                      streamOrJobName: '4LPRFPV',
                      notificationType: 'E',
                      eventType: 'Failure',
                      enabled: '1',
                      emailAddress: 'johndoeb@cerner.com'
                    }
                  ],
                  jobDefinition: {
                    jobType: '360',
                    jobDetails: []
                  }
                }
              ],
              [
                '3LPRFPD',
                {
                  jobName: '3LPRFPD ',
                  description: 'Refresh S9 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [
                    {
                      streamOrJobIdentifier: 'J',
                      streamOrJobName: '3LPRFPD',
                      notificationType: 'E',
                      eventType: 'Success',
                      enabled: '1',
                      emailAddress: 'johndoea@cerner.com'
                    }
                  ],
                  jobDefinition: {
                    jobType: '200',
                    jobDetails: []
                  }
                }
              ],
              [
                '1LPRFPW',
                {
                  jobName: '1LPRFPW',
                  description: 'Refresh S10 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [
                    {
                      streamOrJobIdentifier: 'J',
                      streamOrJobName: '1LPRFPW',
                      notificationType: 'E',
                      eventType: 'Failure',
                      enabled: '1',
                      emailAddress: 'johndoeb@cerner.com'
                    },
                    {
                      streamOrJobIdentifier: 'J',
                      streamOrJobName: '1LPRFPW',
                      notificationType: 'E',
                      eventType: 'Success',
                      enabled: '1',
                      emailAddress: 'johndoeb@cerner.com'
                    },
                    {
                      streamOrJobIdentifier: 'J',
                      streamOrJobName: '1LPRFPW',
                      notificationType: 'E',
                      eventType: 'Success',
                      enabled: '0',
                      emailAddress: 'johndoec@cerner.com'
                    }
                  ],
                  jobDefinition: {
                    jobType: '390',
                    jobDetails: []
                  }
                }
              ],
              [
                '0104PAX',
                {
                  jobName: '0104PAX',
                  description: 'Refresh S11 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [
                    {
                      streamOrJobName: '0104PAX',
                      notificationType: 'E',
                      eventType: 'Success',
                      enabled: '1',
                      emailAddress: 'johndoea@cerner.com'
                    }
                  ],
                  jobDefinition: {
                    jobType: '410',
                    jobDetails: []
                  }
                }
              ]
            ]),
            predecessors: [
              {
                streamOrJobName: 'DMILCLIN'
              },
              {
                streamOrJobName: 'fakestr2'
              }
            ]
          },
          {
            streamName: 'DMILCLIN',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            notifications: [],
            jobs: new Map([
              [
                '01BISDMS',
                {
                  jobName: '01BISDMS',
                  description: 'Refresh S12 Daily Cubes        ',
                  jobStatus: 'Scheduled',
                  finishedDateTime: '',
                  notifications: [
                    {
                      streamOrJobName: '01BISDMS',
                      notificationType: 'E',
                      eventType: 'Success',
                      enabled: '0',
                      emailAddress: '0aUocs@cerner.com'
                    },
                    {
                      streamOrJobName: '01BISDMS',
                      notificationType: 'E',
                      eventType: 'Failure',
                      enabled: '1',
                      emailAddress: 'johndoea@cerner.com'
                    },
                    {
                      streamOrJobName: '01BISDMS',
                      notificationType: 'E',
                      eventType: 'Success',
                      enabled: '1',
                      emailAddress: '0a1Uocs@cerner.com'
                    },
                    {
                      streamOrJobName: '01BISDMS',
                      notificationType: 'E',
                      eventType: 'Failure',
                      enabled: '1',
                      emailAddress: '0a1Uocs@cerner.com'
                    }
                  ],
                  jobDefinition: {
                    jobType: '400',
                    jobDetails: []
                  }
                }
              ]
            ]),
            predecessors: [
              {
                streamOrJobName: 'fakestr1'
              }
            ]
          }
        ]
      },
      {
        queueName: '02',
        queueDescription: 'fake queue02',
        streams: [
          {
            streamName: 'fakestr1',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map(),
            predecessors: []
          },
          {
            streamName: 'fakestr2',
            streamStatus: 'M',
            streamDescription: 'Daily Start of Streams',
            streamFinishedDateTime: 'Fri Jul 01 09:44:10 2016',
            jobs: new Map(),
            predecessors: [
              {
                streamOrJobName: 'fakestr1'
              }
            ]
          }
        ]
      }
    ];

    const receivedResult = sapClient.allFiles.schedFile.queues;
    expect(receivedResult).toEqual(expectedResult);
  });
});
