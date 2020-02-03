import scheduleDetails from './schedule-details';

describe('parseStreamSchedule function should parse stream schedule correctly', () => {
  test('parseStreamSchedule should parse all stream schedule fields correctly', () => {
    const recordData =
      '01!00D01START        4MDaily Start of Streams        0100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010140952005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);

    const expectedResult = {
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
    };
    expect(result).toEqual(expectedResult);
  });

  test('parseStreamSchedule should parse all stream schedule fields correctly when month mask has some months enabled', () => {
    const recordData =
      '01!00D01START        4MDaily Start of Streams        0100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010140952005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010104802005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);

    const expectedResult = {
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
                isSelected: '0'
              },
              {
                name: 'Feb',
                isSelected: '0'
              },
              {
                name: 'Mar',
                isSelected: '0'
              },
              {
                name: 'Apr',
                isSelected: '0'
              },
              {
                name: 'May',
                isSelected: '0'
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
                isSelected: '0'
              },
              {
                name: 'Nov',
                isSelected: '0'
              },
              {
                name: 'Dec',
                isSelected: '0'
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
    };
    expect(result).toEqual(expectedResult);
  });
});

describe('parseScheduleRecord function should parse job schedule correctly', () => {
  test('parseScheduleRecord function should parse job schedule correctly', () => {
    const recordData =
      '01!00D01START1ARSDCUB6SRefresh S3 Daily Cubes        0200000000070100:00:0000:00:000Mon Jul 18 10:36:18 2016                            0010140952009050510100000000070100:00:0000:00:000                                                    0010140952009061100100000000070100:00:0000:00:000                                                    001014095200906110!0035701';
    const expectedResult = {
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
    };

    const result = scheduleDetails.parseScheduleRecord(recordData);

    expect(result).toEqual(expectedResult);
  });
});
