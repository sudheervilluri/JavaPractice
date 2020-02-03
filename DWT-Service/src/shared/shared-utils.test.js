import sharedUtils from './shared-utils';
import ParseClient from '../parser/parse-properties';

describe('testing getPropertyClient', () => {
  test('getProprtyClient should return the instance of Property Client', () => {
    const parseClient = new ParseClient().getInstance();
    const parseClientFromMethod = sharedUtils.getPropertyClient();
    expect(parseClientFromMethod).toEqual(parseClient);
  });
});

describe('checkIfPredecessorAlreadyExistsInMap should return correct data', () => {
  test('checkIfPredecessorAlreadyExistsInMap should return a array when the value is undefined', () => {
    const predecessor = {
      streamOrJobName: 'fakeStreamOrJobName'
    };

    const value = undefined;

    const expectedValue = [
      {
        streamOrJobName: 'fakeStreamOrJobName'
      }
    ];

    const receivedValue = sharedUtils.checkIfPredecessorAlreadyExistsInMap(predecessor, value);

    expect(receivedValue).toEqual(expectedValue);
  });

  test('checkIfPredecessorAlreadyExistsInMap should return a array when the value is null', () => {
    const predecessor = {
      streamOrJobName: 'fakeStreamOrJobName'
    };

    const value = null;

    const expectedValue = [
      {
        streamOrJobName: 'fakeStreamOrJobName'
      }
    ];

    const receivedValue = sharedUtils.checkIfPredecessorAlreadyExistsInMap(predecessor, value);

    expect(receivedValue).toEqual(expectedValue);
  });

  test('checkIfPredecessorAlreadyExistsInMap should push the key when the value is an array', () => {
    const predecessor = {
      streamOrJobName: 'fakeStreamOrJobName'
    };

    const value = [];
    const expectedValue = [
      {
        streamOrJobName: 'fakeStreamOrJobName'
      }
    ];

    const receivedValue = sharedUtils.checkIfPredecessorAlreadyExistsInMap(predecessor, value);

    expect(receivedValue).toEqual(expectedValue);
  });
});
