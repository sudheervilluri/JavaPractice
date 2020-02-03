import scheduleDetails from './schedule-details';
import scheduleOccurrenceUtils from './schedule-occurrence-utils';

describe('stream occurrence utils should successfully parse the currect next occurrence for a daily schedule', () => {
  test('getScheduleNextOccurrence should return the correct next occurrence for a daily schedule', () => {
    const recordData =
      '01!00D01START        4MDaily Start of Streams        0100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010140952005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );

    expect(nextOccurrence.getTime()).toEqual(new Date(schedCurrentDate).getTime());
  });

  test('getScheduleNextOccurrence should throw exception if schedule occurrence is invalid', () => {
    const recordData =
      '01!00D01START        4MDaily Start of Streams        5100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010140952005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';

    const func = () => {
      scheduleOccurrenceUtils.getScheduleNextOccurrence(
        result.scheduleOccurrence[0],
        schedCurrentDate
      );
    };

    // should throw expection for an invalid schedule occurrence
    expect(func).toThrow();
  });
});

describe('stream occurrence utils should successfully parse the currect next occurrence for a weekly schedule', () => {
  test('getScheduleNextOccurrence should return the correct next occurrence for a weekly schedule', () => {
    // here first schedule should run on weekly on a monday
    const recordData =
      '01!00D01START        4MDaily Start of Streams        1110000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010140952005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );

    // expected date for the schedule
    const expectedDate = new Date('07/15/2019');

    // day of week from result should be a monday
    expect(nextOccurrence.getDay() === 1);
    // expected time and result time should be equal
    expect(nextOccurrence.getTime()).toEqual(expectedDate.getTime());
  });

  test('getScheduleNextOccurrence should return undefined if next occurrence is not possible', () => {
    // here first schedule has no weekday selected so result should be undefined
    const recordData =
      '01!00D01START        4MDaily Start of Streams        1100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010140952005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );

    expect(nextOccurrence).not.toBeDefined();
  });

  test('getScheduleNextOccurrence should return correct next occurrence for last day of week', () => {
    // here first schedule has no weekday selected so result should be undefined
    const recordData =
      '01!02D4CLPINT        4MInterface MS4 Clinical Data   1110000000070100:00:0000:00:000                                                    0010240952010021510100000000070100:00:0000:00:000                                                    0010140952010101300100000000070100:00:0000:00:000                                                    001014095201010130';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '08/23/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );

    // expected date for the schedule
    const expectedDate = new Date('08/26/2019');

    expect(nextOccurrence.getTime()).toEqual(expectedDate.getTime());
  });
});

describe('stream occurrence utils should successfully parse the currect next occurrence for a monthly schedule', () => {
  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule when monthlyScheduleType is 0', () => {
    // here first schedule should run on June, July, August and September on the first day of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 1st August 2019
    const expectedResult = new Date('08/01/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule when monthlyScheduleType is 1', () => {
    // here first schedule should run on June, July, August and September on the first day on or after 13th of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001071300:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 13th July 2019

    const expectedResult = new Date('07/13/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule for first monday', () => {
    // here first schedule should run on June, July, August and September on the first monday on or after 13th of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001011300:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be Monday, 15th July 2019

    const expectedResult = new Date('07/15/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule for first weekday', () => {
    // here first schedule should run on June, July, August and September on the first weekday on or after 18th of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001081800:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 18th July 2019

    const expectedResult = new Date('07/18/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule for first weekend day', () => {
    // here first schedule should run on June, July, August and September on the first weekend Day on or after 18th of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001091800:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 20th July 2019

    const expectedResult = new Date('07/20/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule for last weekend day', () => {
    // here first schedule should run on June, July, August and September on the last weekend Day on or after 18th of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001491800:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 28th July 2019

    const expectedResult = new Date('07/28/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule for last weekday', () => {
    // here first schedule should run on June, July, August and September on the last weekday on or after 18th of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001481800:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 31th July 2019

    const expectedResult = new Date('07/31/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule for last day', () => {
    // here first schedule should run on June, July, August and September on the last day on or after 18th of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001471800:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 31th July 2019

    const expectedResult = new Date('07/31/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule for second Specific day', () => {
    // here first schedule should run on June, July, August and September on the 2nd Saturday on or after 23rd of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001162300:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 31th August 2019

    const expectedResult = new Date('08/31/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule for 2nd Day', () => {
    // here first schedule should run on June, July, August and September on the 2nd Day on or after 7th of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001170700:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 31th August 2019

    const expectedResult = new Date('08/08/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule for 3rd Specific day', () => {
    // here first schedule should run on June, July, August and September on the 3rd Wednesday on or after 7th of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001230700:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 24th July 2019
    const expectedResult = new Date('07/24/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return the correct next occurrence for a monthly schedule when 3rd specific day', () => {
    // here first schedule should run on June, July, August and September on the 3rd Wednesday on or after 7th of the month
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2211101101372802:00:0004:00:001                                                    0010233282014102510100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );
    // since scheduler current date is 9th July, 2019, expected result should be 31st December, 2019
    const expectedResult = new Date('12/31/2019');
    expect(nextOccurrence.getTime()).toEqual(expectedResult.getTime());
  });

  test('getScheduleNextOccurrence should return undefined if schedule event is invalid', () => {
    // here first schedule has invalid monthly schedule event '9'
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000001931800:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';

    // should be undefined
    expect(
      scheduleOccurrenceUtils.getScheduleNextOccurrence(
        result.scheduleOccurrence[0],
        schedCurrentDate
      )
    ).not.toBeDefined();
  });

  test('getScheduleNextOccurrence should throw Exception if monthly schedule type is invalid', () => {
    // here first schedule has invalid monthly schedule type '7'
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000007031800:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const func = () => {
      scheduleOccurrenceUtils.getScheduleNextOccurrence(
        result.scheduleOccurrence[0],
        schedCurrentDate
      );
    };

    // should throw expection for an invalid schedule occurrence
    expect(func).toThrow();
  });

  test('getScheduleNextOccurrence should throw Exception if monthly schedule event day is invalid', () => {
    // here first schedule has invalid monthly schedule event day 'A'
    const recordData =
      '01!00D01START        4MDaily Start of Streams        21000000010A1800:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010104802005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const func = () => {
      scheduleOccurrenceUtils.getScheduleNextOccurrence(
        result.scheduleOccurrence[0],
        schedCurrentDate
      );
    };

    // should throw expection for an invalid schedule occurrence
    expect(func).toThrow();
  });

  test('getScheduleNextOccurrence should return undefined if next occurrence is not possible', () => {
    // here first schedule has none of the months selected so result should be undefined
    const recordData =
      '01!00D01START        4MDaily Start of Streams        2100000000070100:00:0000:00:000Tue Jul 19 13:28:05 2016  Tue Jul 19 13:29:35 2016  0010100002005012610100000000070100:00:0000:00:000                          Sun Oct 26 00:00:00 2014  0010140952005012600100000000070100:00:0000:00:000                                                    001014095200501260';
    const result = scheduleDetails.parseScheduleRecord(recordData);
    const schedCurrentDate = '07/09/2019';
    const nextOccurrence = scheduleOccurrenceUtils.getScheduleNextOccurrence(
      result.scheduleOccurrence[0],
      schedCurrentDate
    );

    expect(nextOccurrence).not.toBeDefined();
  });
});
