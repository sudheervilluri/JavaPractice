import serverUtils from './server-utils';
import mockData from './data/schedule.mock';
import sharedUtils from './shared/shared-utils';
import Sapclient from './mts-socket/sap-client/sap-client';

jest.mock('./shared/shared-utils');
const sapclient = new Sapclient();

describe('getStreamPredecessorMap should return a map', () => {
  test('should return a map with predecessors name as key and predecessors parent name as value', () => {
    const schedFile = mockData.getSched();

    sharedUtils.checkIfPredecessorAlreadyExistsInMap.mockReturnValueOnce(['DLPRDINT']);
    sharedUtils.checkIfPredecessorAlreadyExistsInMap.mockReturnValueOnce(['DLPRDINT']);
    sharedUtils.checkIfPredecessorAlreadyExistsInMap.mockReturnValueOnce(['DMILCLIN']);
    sharedUtils.checkIfPredecessorAlreadyExistsInMap.mockReturnValueOnce(['DMILCLIN', 'fakestr2']);

    const streamObj = serverUtils.getStreamObject(schedFile);

    const { listOfAllStreams } = streamObj;
    const { streamPredecessorMap } = streamObj;

    const expectedResult = mockData.getMap();
    const expectedResult1 = [];
    schedFile.queues.forEach(queue => {
      queue.streams.forEach(stream => {
        expectedResult1.push(stream);
      });
    });

    expect(streamPredecessorMap).toEqual(expectedResult);
    expect(listOfAllStreams).toEqual(expectedResult1);
  });
});

describe('getJobTypeMap should return a list', () => {
  test('should return a list of values parsed from DSS Properties xml file', async () => {
    const mockPropertyFunction = {
      getProperty: () => {}
    };

    const fakeJobType = new Map();
    fakeJobType.set('FakeId1', 'FakeName1');
    fakeJobType.set('FakeId2', 'FakeName2');

    const fakeJobDetail = new Map();
    fakeJobDetail.set('Caption', 'fakeCaption');
    fakeJobDetail.set('ParameterIdentifier', 'fakeParameterIdentifier');

    const fakeJobParameters = new Map();
    fakeJobParameters.set('Param1', 'fakeParameterName1');
    fakeJobParameters.set('Param2', 'fakeParameterName2');

    const fakeParameterDetail = new Map();
    fakeParameterDetail.set('Visible', 'true');
    fakeParameterDetail.set('Required', 'true');
    fakeParameterDetail.set('Default', 'true');
    fakeParameterDetail.set('Case', 'true');

    const fakeParameterDetailObj1 = {};
    fakeParameterDetailObj1.name = 'fakeParameterName1';
    fakeParameterDetailObj1.details = serverUtils.convertMapToObject(fakeParameterDetail);

    const fakeParameterDetailObj2 = {};
    fakeParameterDetailObj2.name = 'fakeParameterName2';
    fakeParameterDetailObj2.details = serverUtils.convertMapToObject(fakeParameterDetail);

    const fakeParameterDetailList = [];
    fakeParameterDetailList.push(fakeParameterDetailObj1);
    fakeParameterDetailList.push(fakeParameterDetailObj2);

    const fakeJobTypeObj1 = {};
    fakeJobTypeObj1.id = 'FakeId1';
    fakeJobTypeObj1.name = 'FakeName1';
    fakeJobTypeObj1.details = serverUtils.convertMapToObject(fakeJobDetail);
    fakeJobTypeObj1.parameters = fakeParameterDetailList;

    const fakeJobTypeObj2 = {};
    fakeJobTypeObj2.id = 'FakeId2';
    fakeJobTypeObj2.name = 'FakeName2';
    fakeJobTypeObj2.details = [];
    fakeJobTypeObj2.parameters = [];

    const expectedResult = new Map();

    expectedResult.set('FakeId1', fakeJobTypeObj1);
    expectedResult.set('FakeId2', fakeJobTypeObj2);

    sharedUtils.getPropertyClient.mockReturnValue(mockPropertyFunction);

    const mockGetProperty = jest.spyOn(mockPropertyFunction, 'getProperty');
    mockGetProperty.mockReturnValueOnce(fakeJobType);
    mockGetProperty.mockReturnValueOnce(fakeJobDetail);
    mockGetProperty.mockReturnValueOnce(fakeJobParameters);
    mockGetProperty.mockReturnValueOnce(fakeParameterDetail);
    mockGetProperty.mockReturnValueOnce(fakeParameterDetail);

    const JobTypeMap = await serverUtils.getJobTypeMap();

    expect(JobTypeMap).toEqual(expectedResult);
  });
});
// Refresh

describe('Load Schedule', () => {
  test('Load Schedule', async () => {
    const mockConnect = jest.spyOn(sapclient, 'connect');
    mockConnect.mockImplementation(() => {});

    const mockReadFiles = jest.spyOn(sapclient, 'readAllFiles');
    mockReadFiles.mockImplementation(() => {
      return mockData.getSched();
    });
    await serverUtils.loadSchedule(sapclient, 'bgs', 'kj');
    expect(sapclient.connect).toHaveBeenCalledTimes(1);
  });

  test('Load Schedule fail while connnecting to Sapclient', async () => {
    try {
      const mockConnect = jest.spyOn(sapclient, 'connect');
      mockConnect.mockImplementation(() => {
        throw new Error('mock error');
      });
      await serverUtils.loadSchedule(sapclient, 'bgs', 'kj');
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
  test('Load Schedule fail while connnecting to Sapclient', async () => {
    try {
      const mockConnect = jest.spyOn(sapclient, 'connect');
      mockConnect.mockImplementation(() => {});

      const mockReadFiles = jest.spyOn(sapclient, 'readAllFiles');
      mockReadFiles.mockImplementation(() => {
        throw new Error('mock error');
      });
      await serverUtils.loadSchedule(sapclient, 'bgs', 'kj');
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});
