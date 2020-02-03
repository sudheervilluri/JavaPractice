import sapClientUtilities from './sap-client-utils';

describe('The functions daysInFeb and dayOfTheYearToMonth should give the expected output', () => {
  test('daysInFeb returns 28 when the year is not a leap year', () => {
    const year = 2019;
    expect(sapClientUtilities.daysInFeb(year)).toBe(28);
  });
  test('daysInFeb returns 28 when the year is not a leap year', () => {
    const year = 1700;
    expect(sapClientUtilities.daysInFeb(year)).toBe(28);
  });
  test('daysInFeb returns 29 when the year is a leap year', () => {
    const year = 2020;
    expect(sapClientUtilities.daysInFeb(year)).toBe(29);
  });
  test('Value of month is returned when day of the year is passed', () => {
    const dayOfYear = 30;
    const schedYear = 2019;
    expect(sapClientUtilities.dayOfTheYearToMonth(dayOfYear, schedYear)).toBe('Jan');
  });
});
