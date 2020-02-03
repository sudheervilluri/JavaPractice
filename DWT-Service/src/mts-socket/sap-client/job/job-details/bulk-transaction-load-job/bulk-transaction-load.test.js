import bulkTransactionLoadJobType from './bulk-transaction-load';
import bulkTransactionLoadUtils from './bulk-transaction-load-utils';

jest.mock('./bulk-transaction-load-utils');

describe('bulkTransactionLoadJobType should parse task record for a bulk transaction load correctly', () => {
  test('parseEmbeddedHeaderDetails should parse task record for a embedded header', () => {
    bulkTransactionLoadUtils.getFormatType.mockReturnValue('Delimited');
    bulkTransactionLoadUtils.getHeaderType.mockReturnValue('Embedded');

    const parameterList = [
      '-U DEVDI\\fichba00',
      '-D SMSDHdss2620',
      '-S USMLVV3BI0074',
      '-f f:\\process_2620\\srs0001_mstr.dat',
      '-h E',
      '-F S',
      '-r 1',
      ''
    ];

    const expectedResult = [
      { parameter: { name: 'Created by' }, value: 'DEVDI\\fichba00' },
      { parameter: { name: 'File name' }, value: 'f:\\process_2620\\srs0001_mstr.dat' },
      { parameter: { name: 'Transaction Header' }, value: 'Embedded' },
      { parameter: { name: 'Transaction Format' }, value: 'Delimited' },
      { parameter: { name: 'Row terminator' }, value: '1' }
    ];

    const jobDetailsParamList = bulkTransactionLoadJobType.parseEmbeddedHeaderDetails(
      parameterList
    );

    expect(jobDetailsParamList).toEqual(expectedResult);
  });

  test('parseGeneratedHeaderDetails should parse task record for a generated header', () => {
    bulkTransactionLoadUtils.getFormatType.mockReturnValue('Delimited');
    bulkTransactionLoadUtils.getHeaderType.mockReturnValue('Generated');
    bulkTransactionLoadUtils.getAction.mockReturnValue('Add');

    const parameterList = [
      '-U fichba00',
      '-D SMSDHdss2620',
      '-S USMLVV3BI0074',
      '-t 918',
      '-a 010',
      '-f f:\\process_2620\\mil++++_TRNLOG_STATS.dat',
      '-h G',
      '-F S',
      '-T |',
      '-r 1',
      '-N 143',
      '-c 3',
      '-v 142',
      '-b 0',
      ''
    ];

    const expectedResult = [
      { parameter: { name: 'Created by' }, value: 'fichba00' },
      { parameter: { name: 'Transaction Type' }, value: '918' },
      { parameter: { name: 'Action' }, value: 'Add' },
      { parameter: { name: 'File name' }, value: 'f:\\process_2620\\mil++++_TRNLOG_STATS.dat' },
      { parameter: { name: 'Transaction Header' }, value: 'Generated' },
      { parameter: { name: 'Transaction Format' }, value: 'Delimited' },
      { parameter: { name: 'Field Terminator' }, value: '|' },
      { parameter: { name: 'Row terminator' }, value: '1' },
      { parameter: { name: 'Null Character' }, value: '143' },
      { parameter: { name: 'Column Delimiter' }, value: '3' },
      { parameter: { name: 'Not Valued' }, value: '142' },
      { parameter: { name: 'Update Behavior' }, value: '0' }
    ];

    const jobDetailsParamList = bulkTransactionLoadJobType.parseGeneratedHeaderDetails(
      parameterList
    );

    expect(jobDetailsParamList).toEqual(expectedResult);
  });
});
