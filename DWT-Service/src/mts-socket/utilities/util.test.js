import util from './util';

describe('formatjobsFinishedDateTime should format the Jobs Finished Date Time from Sched file correctly', () => {
  test('Should return empty string when jobs record does not contain Finished Date Time', () => {
    // create an empty finishedDateTime of 26 characters
    const mockFinishedDateTime = new Array(26 + 1).join(' ');
    expect(util.formatFinishedDateTime(mockFinishedDateTime)).toBe('');
  });

  test('Should return date in the format required by UI when jobs record contains a jobs Finished Date Time', () => {
    // pass a mock finishedDateTime
    const mockFinishedDateTime = 'Tue Jul 19 13:29:35 2016  ';
    expect(util.formatFinishedDateTime(mockFinishedDateTime)).toBe('Tue, Jul 19, 2016 13:29:35');
  });
});

describe('should sort the jobs in alphanumeric', () => {
  test('job should get sorted alphanumerically by jobName', () => {
    const passedObject = [
      {
        streamName: 'CSRSDRPT',
        jobName: '1SRSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      },
      {
        streamName: 'BSRSDRPT',
        jobName: '1ARSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      },
      {
        streamName: 'DSRSDRPT',
        jobName: '1DRSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      },
      {
        streamName: 'DSRSDRPT',
        jobName: '1BRSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      }
    ];

    const expectedJobName = [
      {
        streamName: 'BSRSDRPT',
        jobName: '1ARSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      },
      {
        streamName: 'DSRSDRPT',
        jobName: '1BRSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      },
      {
        streamName: 'DSRSDRPT',
        jobName: '1DRSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      },
      {
        streamName: 'CSRSDRPT',
        jobName: '1SRSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      }
    ];

    const expectedStreamName = [
      {
        streamName: 'BSRSDRPT',
        jobName: '1ARSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      },
      {
        streamName: 'CSRSDRPT',
        jobName: '1SRSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      },
      {
        streamName: 'DSRSDRPT',
        jobName: '1BRSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      },
      {
        streamName: 'DSRSDRPT',
        jobName: '1DRSDCUB',
        description: 'Refresh S2 Daily Cubes        ',
        jobStatus: 'Scheduled',
        finishedDateTime: ''
      }
    ];

    let actualList = util.sortList(passedObject, 'jobName');

    expect(expectedJobName).toMatchObject(actualList);

    actualList = util.sortList(passedObject, 'streamName');

    expect(actualList).toMatchObject(expectedStreamName);

    actualList = util.sortList(passedObject, 'sourabh');

    expect(actualList).toMatchObject(passedObject);
  });
});

describe('isValidDate should check work correctly', () => {
  test('isValidDate should return false if date is invalid', () => {
    expect(util.isValidDate(new Date('fake date'))).toBeFalsy();
  });

  test('isValidDate should return true if date is valid', () => {
    expect(util.isValidDate(new Date('02/27/2019'))).toBeTruthy();
  });

  test('isValidDate should return false if argument passed to it is not a date object', () => {
    expect(util.isValidDate('Fake data')).toBeFalsy();
  });
});

describe('getNextOccurrenceFromList should return the earliest occurrence from a list of next occurences', () => {
  test('getNextOccurrenceFromList should return the earliest occurrence from a list of next occurences when all dates are', () => {
    // prepare nextOccurrenceList in mm/dd/yyyy format
    const date1 = new Date('07/09/2019');
    const date2 = new Date('08/09/2019');
    const date3 = new Date('05/09/2019');
    const nextOccurrenceList = [];
    nextOccurrenceList.push(date1);
    nextOccurrenceList.push(date2);
    nextOccurrenceList.push(date3);

    expect(util.getNextOccurrenceFromList(nextOccurrenceList)).toEqual(date3.toDateString());
  });

  test('getNextOccurrenceFromList should return the earliest occurrence from a list of next occurences when some dates are invalid', () => {
    // prepare nextOccurrenceList in mm/dd/yyyy format
    const date1 = new Date('13/09/2019');
    const date2 = new Date('08/09/2019');
    const date3 = new Date('05/09/2019');
    const nextOccurrenceList = [];
    nextOccurrenceList.push(date1);
    nextOccurrenceList.push(date2);
    nextOccurrenceList.push(date3);

    expect(util.getNextOccurrenceFromList(nextOccurrenceList)).toEqual(date3.toDateString());
  });

  test('getNextOccurrenceFromList should return the earliest occurrence from a list of next occurences when some dates are invalid', () => {
    // prepare nextOccurrenceList in mm/dd/yyyy format
    const date1 = undefined;
    const date2 = new Date('08/09/2019');
    const date3 = new Date('05/09/2019');
    const nextOccurrenceList = [];
    nextOccurrenceList.push(date1);
    nextOccurrenceList.push(date2);
    nextOccurrenceList.push(date3);

    expect(util.getNextOccurrenceFromList(nextOccurrenceList)).toEqual(date3.toDateString());
  });

  test('getNextOccurrenceFromList should return the earliest occurrence from a list of next occurences when some dates are invalid', () => {
    // prepare nextOccurrenceList in mm/dd/yyyy format
    const date1 = undefined;
    const date2 = undefined;
    const date3 = undefined;
    const nextOccurrenceList = [];
    nextOccurrenceList.push(date1);
    nextOccurrenceList.push(date2);
    nextOccurrenceList.push(date3);

    expect(util.getNextOccurrenceFromList(nextOccurrenceList)).toEqual(
      new Date(8640000000000000).toDateString()
    );
  });
});
