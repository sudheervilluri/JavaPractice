import schedularValidator from './validator';

describe('validator should function as expected and handle errors', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('alphaNumValidation for returning name', () => {
    expect(schedularValidator.alphaNumValidator('ABC123', 9)).toBe('ABC123');
  });

  test('alphaNumValidation for max Length error', () => {
    try {
      schedularValidator.alphaNumValidator('ABC123', 5);
    } catch (error) {
      expect(error.message).toBe('string exceeds maxLength.');
    }
  });

  test('alphaNumValidation for not valid string', () => {
    try {
      schedularValidator.alphaNumValidator('ABC%$2', 10);
    } catch (error) {
      expect(error.message).toBe('string not valid.');
    }
  });

  test('intValidator return number when the given value is integer', () => {
    const expectedResult = 99;
    const result = schedularValidator.intValidator(99);

    expect(result).toEqual(expectedResult);
  });

  test('intValidator returns an error when it is not a valid integer', () => {
    try {
      schedularValidator.intValidator('uu');
    } catch (error) {
      expect(error.message).toBe('not a valid integer');
    }
  });
});
