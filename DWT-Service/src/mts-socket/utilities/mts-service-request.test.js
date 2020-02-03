import {
  getDataBufferSize,
  generateMTSServiceRequest,
  getMTSServiceRequestForRead
} from './mts-service-request';
import MTSsock from '../mts-socket';
import SapClient from '../sap-client/sap-client';
import sharedUtils from '../../shared/shared-utils';

jest.mock('../../shared/shared-utils');
jest.mock('../mts-socket');

test('Length of Request should be appended with leading zeroes correctly and handle null checks', () => {
  expect(getDataBufferSize('Test')).toBe('00004');

  expect(() => {
    getDataBufferSize(null);
  }).toThrow('Cannot create buffer size, Data is null');
});

test('generateMTSServiceRequest should write to socket with correct requests for request code 130', async () => {
  const mockMtssock = new MTSsock();
  const mockSapClient = new SapClient();
  const mockPropertyFunction = {
    getProperty: () => {}
  };
  mockSapClient.databaseName = 'abcd';

  const fakeData = new Map();
  fakeData.set('\\\\abcd\\Schedule', '..\\Data\\sch_abcd');
  fakeData.set('\\\\abcd\\Task', '..\\Data\\task_abcd');
  fakeData.set('\\\\abcd\\Notification', '..\\Data\\notif_abcd');

  sharedUtils.getPropertyClient.mockReturnValue(mockPropertyFunction);
  const mockGetProperty = jest.spyOn(mockPropertyFunction, 'getProperty');
  mockGetProperty.mockReturnValueOnce(fakeData);
  await generateMTSServiceRequest(130, mockMtssock, mockSapClient);

  expect(mockMtssock.writeToSocket).toHaveBeenCalledTimes(2);
  expect(mockMtssock.writeToSocket).toHaveBeenNthCalledWith(1, getMTSServiceRequestForRead(130));
  expect(mockMtssock.writeToSocket).toHaveBeenNthCalledWith(
    2,
    '11!..\\\\Data\\\\sch_abcd!..\\\\Data\\\\task_abcd!..\\\\Data\\\\notif_abcd!'
  );
});

test('generateMTSServiceRequest should write to socket with correct requests for request code 135', async () => {
  const mockMtssock = new MTSsock();
  const mockSapClient = new SapClient();
  const mockPropertyFunction = {
    getProperty: () => {}
  };
  mockSapClient.databaseName = 'abcd';
  const fakeData = new Map();
  fakeData.set('\\\\abcd\\Schedule', '..\\Data\\sch_abcd');
  fakeData.set('\\\\abcd\\Task', '..\\Data\\task_abcd');
  fakeData.set('\\\\abcd\\Notification', '..\\Data\\notif_abcd');

  sharedUtils.getPropertyClient.mockReturnValue(mockPropertyFunction);
  const mockGetProperty = jest.spyOn(mockPropertyFunction, 'getProperty');
  mockGetProperty.mockReturnValueOnce(fakeData);
  await generateMTSServiceRequest(135, mockMtssock, mockSapClient);

  expect(mockMtssock.writeToSocket).toHaveBeenCalledTimes(2);
  expect(mockMtssock.writeToSocket).toHaveBeenNthCalledWith(1, getMTSServiceRequestForRead(135));
  expect(mockMtssock.writeToSocket).toHaveBeenNthCalledWith(
    2,
    '11!..\\\\Data\\\\sch_abcd!..\\\\Data\\\\task_abcd!..\\\\Data\\\\notif_abcd!'
  );
});

test('getMTSServiceRequestForRead should prepare correct request', () => {
  expect(getMTSServiceRequestForRead(130)).toBe('00!130!0!1!');
  expect(getMTSServiceRequestForRead(135)).toBe('00!135!0!1!');
});
