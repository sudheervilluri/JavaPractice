import jobDetailsUtils from './job-details-utils';

describe('job details utils should function correctly', () => {
  const fakeData = {
    data: {
      jobTypes: new Map([
        [
          '170',
          {
            id: '170',
            name: 'Bulk Transaction Load',
            details: null,
            parameters: []
          }
        ],
        [
          '330',
          {
            id: '330',
            name: 'Scheduler Control Cleanup',
            details: {
              caption: 'Scheduler Cleanup Job',
              parameterIdentifier: '1',
              parameterSeparator: ';',
              parameterQuoteCharacter: '^',
              translateParameterSeparatorToSpace: 'True',
              translateQuoteCharacter: 'True',
              prefixIdentifier: '-',
              helpContextID: '19023',
              parameterHelpID: '19503'
            },
            parameters: [
              {
                name: 'Retention Days',
                details: {
                  visible: 'True',
                  default: '45',
                  required: 'True',
                  cellType: '3',
                  prefix: 'r',
                  encloseInQuotes: 'False',
                  overviewOrder: '1',
                  maxLength: null,
                  password: null,
                  case: null,
                  allowSpaces: null
                }
              },
              {
                name: 'Stream Name',
                details: {
                  visible: 'True',
                  default: 'DEMAND01',
                  required: 'False',
                  cellType: '1',
                  prefix: 's',
                  encloseInQuotes: 'False',
                  overviewOrder: '2',
                  maxLength: '8',
                  password: 'False',
                  case: '1',
                  allowSpaces: 'False'
                }
              }
            ]
          }
        ]
      ])
    }
  };

  test('getJobDefinition function should return the correct job definition when details are null', () => {
    const expectedResult = {
      id: '170',
      name: 'Bulk Transaction Load',
      details: null,
      parameters: []
    };
    const recievedResult = jobDetailsUtils.getJobDefinition('170', fakeData.data.jobTypes);

    expect(recievedResult).toEqual(expectedResult);
  });

  test('getJobDefinition function should return the correct job definition for when details are not null', () => {
    const expectedResult = {
      id: '330',
      name: 'Scheduler Control Cleanup',
      details: {
        caption: 'Scheduler Cleanup Job',
        parameterIdentifier: '1',
        parameterSeparator: ';',
        parameterQuoteCharacter: '^',
        translateParameterSeparatorToSpace: 'True',
        translateQuoteCharacter: 'True',
        prefixIdentifier: '-',
        helpContextID: '19023',
        parameterHelpID: '19503'
      },
      parameters: [
        {
          name: 'Retention Days',
          details: {
            visible: 'True',
            default: '45',
            required: 'True',
            cellType: '3',
            prefix: 'r',
            encloseInQuotes: 'False',
            overviewOrder: '1',
            maxLength: null,
            password: null,
            case: null,
            allowSpaces: null
          }
        },
        {
          name: 'Stream Name',
          details: {
            visible: 'True',
            default: 'DEMAND01',
            required: 'False',
            cellType: '1',
            prefix: 's',
            encloseInQuotes: 'False',
            overviewOrder: '2',
            maxLength: '8',
            password: 'False',
            case: '1',
            allowSpaces: 'False'
          }
        }
      ]
    };
    const recievedResult = jobDetailsUtils.getJobDefinition('330', fakeData.data.jobTypes);

    expect(recievedResult).toEqual(expectedResult);
  });

  test('removeQuoteCharacter function should remove all occurrences of quote character from a string successfully', () => {
    const fakeTaskRecordWithQuotes =
      '^DataMigrationServices.dtsx^;^DataMigrationServices^;^DataMigrationServices.dtsConfig^';
    const fakeTaskRecordWithoutQuotes =
      'DataMigrationServices.dtsx;DataMigrationServices;DataMigrationServices.dtsConfig';
    const recievedResult = jobDetailsUtils.removeQuoteCharacter(fakeTaskRecordWithQuotes, '^');

    expect(recievedResult).toEqual(fakeTaskRecordWithoutQuotes);
  });

  test('removeQuoteCharacter function should not modify the record if quote character is absent', () => {
    const mockData = 'some fake data';

    const recievedResult = jobDetailsUtils.removeQuoteCharacter(mockData, '^');

    expect(recievedResult).toEqual(mockData);
  });

  test('getParamString function should return a string containing job params and job param config successfully', () => {
    const mockTaskRecord =
      '01!01BISDMS  490|"SMSDHdss2620;USMLVV3BI0074;schSSISexec.vbs;^DataMigrationServices.dtsx^;^DataMigrationServices^;^DataMigrationServices.dtsConfig^" "0;1^1"|!';

    const recievedResult = jobDetailsUtils.getParamString(mockTaskRecord);
    const expectedResult =
      '"SMSDHdss2620;USMLVV3BI0074;schSSISexec.vbs;^DataMigrationServices.dtsx^;^DataMigrationServices^;^DataMigrationServices.dtsConfig^" "0;1^1"';

    expect(recievedResult).toEqual(expectedResult);
  });

  test('getParamString function should return a string containing job params and job param config successfully', () => {
    const mockTaskRecord =
      '01!01BISDMS  490|"SMSDHdss2620;USMLVV3BI0074;schSSISexec.vbs;^DataMigrationServices.dtsx^;^DataMigrationServices^;^DataMigrationServices.dtsConfig^" "0;1^1"|!';

    const recievedResult = jobDetailsUtils.getParamString(mockTaskRecord);
    const expectedResult =
      '"SMSDHdss2620;USMLVV3BI0074;schSSISexec.vbs;^DataMigrationServices.dtsx^;^DataMigrationServices^;^DataMigrationServices.dtsConfig^" "0;1^1"';

    expect(recievedResult).toEqual(expectedResult);
  });

  test('getJobParams function should return a string containing job params', () => {
    const mockParamString =
      '"SMSDHdss2620;USMLVV3BI0074;schSSISexec.vbs;^DataMigrationServices.dtsx^;^DataMigrationServices^;^DataMigrationServices.dtsConfig^" "0;1^1"';

    const recievedResult = jobDetailsUtils.getJobParams(mockParamString);
    const expectedResult =
      'SMSDHdss2620;USMLVV3BI0074;schSSISexec.vbs;^DataMigrationServices.dtsx^;^DataMigrationServices^;^DataMigrationServices.dtsConfig^';

    expect(recievedResult).toEqual(expectedResult);
  });

  test('getJobParamConfig function should return an object containing job param config', () => {
    const mockParamString =
      '"SMSDHdss2620;USMLVV3BI0074;schSSISexec.vbs;^DataMigrationServices.dtsx^;^DataMigrationServices^;^DataMigrationServices.dtsConfig^" "0;1^1"';

    const recievedResult = jobDetailsUtils.getJobParamConfig(mockParamString);

    const expectedResult = {
      parameterIdentifier: '0',
      parameterSeparator: ';',
      parameterQuoteCharacter: '^'
    };

    expect(recievedResult).toEqual(expectedResult);
  });
});
