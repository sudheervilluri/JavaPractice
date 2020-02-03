import bulkTransactionLoadUtils from './bulk-transaction-load-utils';

describe('getAction should return a correct action when a valid action code is passed', () => {
  test('should return Delete when action code is 005', () => {
    const expectedResult = 'Delete';
    const action = bulkTransactionLoadUtils.getAction('005');
    expect(action).toEqual(expectedResult);
  });
  test('should return Add when action code is 010', () => {
    const expectedResult = 'Add';
    const action = bulkTransactionLoadUtils.getAction('010');
    expect(action).toEqual(expectedResult);
  });
  test('should return Add/Update when action code is 012', () => {
    const expectedResult = 'Add/Update';
    const action = bulkTransactionLoadUtils.getAction('012');
    expect(action).toEqual(expectedResult);
  });
  test('should return Update when action code is 020', () => {
    const expectedResult = 'Update';
    const action = bulkTransactionLoadUtils.getAction('020');
    expect(action).toEqual(expectedResult);
  });
  test('should return Update/Add when action code is 021', () => {
    const expectedResult = 'Update/Add';
    const action = bulkTransactionLoadUtils.getAction('021');
    expect(action).toEqual(expectedResult);
  });
  test('should return null when action code is other than the codes mentioned in BulkTransactionLoadConstants', () => {
    const expectedResult = null;
    const action = bulkTransactionLoadUtils.getAction('000');
    expect(action).toEqual(expectedResult);
  });
});

describe('getFormatType should return a correct format type when a valid format type is passed', () => {
  test('should return Fixed when format type is F', () => {
    const expectedResult = 'Fixed';
    const formatType = bulkTransactionLoadUtils.getFormatType('F');
    expect(formatType).toEqual(expectedResult);
  });
  test('should return Delimited when format type is S', () => {
    const expectedResult = 'Delimited';
    const formatType = bulkTransactionLoadUtils.getFormatType('S');
    expect(formatType).toEqual(expectedResult);
  });
  test('should return null when format type is other than the formats mentioned in BulkTransactionLoadConstants', () => {
    const expectedResult = null;
    const formatType = bulkTransactionLoadUtils.getFormatType('Q');
    expect(formatType).toEqual(expectedResult);
  });
});

describe('getHeaderType should return a correct header type when a valid header type is passed', () => {
  test('should return Embedded when header type is E', () => {
    const expectedResult = 'Embedded';
    const headerType = bulkTransactionLoadUtils.getHeaderType('E');
    expect(headerType).toEqual(expectedResult);
  });
  test('should return Generated when header type is G', () => {
    const expectedResult = 'Generated';
    const headerType = bulkTransactionLoadUtils.getHeaderType('G');
    expect(headerType).toEqual(expectedResult);
  });
  test('should return null when header type is other than the headers mentioned in BulkTransactionLoadConstants', () => {
    const expectedResult = null;
    const headerType = bulkTransactionLoadUtils.getHeaderType('Q');
    expect(headerType).toEqual(expectedResult);
  });
});
