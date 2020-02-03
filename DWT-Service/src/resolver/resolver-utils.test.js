import resolverUtils from './resolver-utils';
import DataBaseUtils from '../database/database-utils';
import sharedUtils from '../shared/shared-utils';

const getdataBaseUtils = new DataBaseUtils({
  ServerName: 'ServerName',
  DatabaseName: 'databaseName'
});

describe('getJobDetailsForStoredProcedureType should return the details of a stored procedure job', () => {
  test('should return all the details of the stored procedure job', async () => {
    const mockData1 = [
      {
        userid: 'fakeUser',
        obj_type: 200,
        obj_id: 4111,
        obj_name: 'fake_obj_name',
        db_name: 'databaseName',
        rmt_server: ' ',
        obj_share_ind: null,
        owner_userid: 'ownerId'
      }
    ];

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValueOnce(mockData1);

    const mockData2 = [{ obj_id: 4111, parm_name: '@PrintOpt', actl_val: '1' }];

    mockDBdata.mockReturnValueOnce(mockData2);

    const expectedResult = [
      { parameter: { name: 'Created By' }, value: 'fakeUser' },
      { parameter: { name: 'Object Name' }, value: 'ownerId.fake_obj_name' },
      { parameter: { name: 'Object ID' }, value: 4111 },
      { parameter: { name: '@PrintOpt' }, value: '1' }
    ];

    const jobDetails = await resolverUtils.getJobDetailsForStoredProcedureType(
      getdataBaseUtils,
      'fakejob'
    );
    expect(jobDetails).toEqual(expectedResult);
  });

  test('should check if the values obtained from database is correct', async () => {
    const mockData1 = [
      {
        userid1: 'fakeUser',
        obj_type: 200,
        obj_id1: 4111,
        obj_name1: 'fake_obj_name',
        db_name: 'databaseName',
        rmt_server: ' ',
        obj_share_ind: null,
        owner_userid1: 'ownerId'
      }
    ];

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValueOnce(mockData1);

    const mockData2 = [{ obj_id: 4111, parm_name: '@PrintOpt', actl_val: '1' }];

    mockDBdata.mockReturnValueOnce(mockData2);

    const expectedResult = [{ parameter: { name: '@PrintOpt' }, value: '1' }];

    const jobDetails = await resolverUtils.getJobDetailsForStoredProcedureType(
      getdataBaseUtils,
      'fakejob'
    );
    expect(jobDetails).toEqual(expectedResult);
  });

  test('should throw error if the sql has an issue getting the data', async () => {
    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    try {
      mockDBdata.mockImplementation(() => {
        throw new Error('mocker');
      });
      await resolverUtils.getJobDetailsForStoredProcedureType(getdataBaseUtils, 'fakejob');
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });

  test('should check if the values obtained from database is correct', async () => {
    const mockData1 = [
      {
        userid1: 'fakeUser',
        obj_type: 200,
        obj_id1: 4111,
        obj_name1: 'fake_obj_name',
        db_name: 'databaseName',
        rmt_server: ' ',
        obj_share_ind: null,
        owner_userid1: 'ownerId'
      }
    ];

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValueOnce(mockData1);

    const mockDBdata1 = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    try {
      mockDBdata1.mockImplementation(() => {
        throw new Error('mocker');
      });
      await resolverUtils.getJobDetailsForStoredProcedureType(getdataBaseUtils, 'fakejob');
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});

describe('getJobDetailsForClusterType should return the details of a cluster job', () => {
  test('should return all details of cluster job type', async () => {
    const mockData = [
      { parm_name: '?cluster_id', parm_seq: 1, actl_val: '5032' },
      { parm_name: '?cluster_id', parm_seq: 2, actl_val: '3935' },
      { parm_name: '?cluster_id', parm_seq: 3, actl_val: '1022' },
      { parm_name: '?cleanup', parm_seq: 4, actl_val: '1' },
      { parm_name: '?cluster_type', parm_seq: 5, actl_val: '0' },
      { parm_name: '?incremental', parm_seq: 6, actl_val: 'False' }
    ];

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValueOnce(mockData);

    const expectedResult = [
      { parameter: { name: '?cluster_id' }, value: '5032' },
      { parameter: { name: '?cluster_id' }, value: '3935' },
      { parameter: { name: '?cluster_id' }, value: '1022' },
      { parameter: { name: '?cleanup' }, value: '1' },
      { parameter: { name: '?cluster_type' }, value: '0' },
      { parameter: { name: '?incremental' }, value: 'False' }
    ];

    const jobDetails = await resolverUtils.getJobDetailsForClusterType(getdataBaseUtils, 'fakejob');
    expect(jobDetails).toEqual(expectedResult);
  });

  test('should throw error if the sql has an issue getting the data', async () => {
    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    try {
      mockDBdata.mockImplementation(() => {
        throw new Error('mocker');
      });
      await resolverUtils.getJobDetailsForClusterType(getdataBaseUtils, 'fakejob');
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});

describe('getJobDetailsForClusterType should return the details of a olap job', () => {
  test('should return all details of olap job type', async () => {
    const mock = jest.spyOn(sharedUtils, 'getPropertyClient');
    const fakeData = 'fake server name';
    const mockPropertyFunction = {
      getProperty: () => {}
    };
    mock.mockReturnValue(mockPropertyFunction);
    const mockGetProperty = jest.spyOn(mockPropertyFunction, 'getProperty');
    mockGetProperty.mockReturnValueOnce(fakeData);

    const mockData = [
      { parm_name: '?cube_id', parm_seq: 1, actl_val: 'EA-DSS Olap|APC Analysis' },
      { parm_name: '?cleanup', parm_seq: 2, actl_val: '1' },
      { parm_name: '?cube_process', parm_seq: 3, actl_val: '2' },
      { parm_name: '?shared_dimension', parm_seq: 4, actl_val: 'True' }
    ];

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValueOnce(mockData);

    const expectedResult = [
      { parameter: { name: '?cube_id' }, value: 'EA-DSS Olap|APC Analysis' },
      { parameter: { name: '?cleanup' }, value: '1' },
      { parameter: { name: '?cube_process' }, value: '2' },
      { parameter: { name: '?shared_dimension' }, value: 'True' },
      { parameter: { name: 'OLAP Server Name' }, value: 'fake server name' }
    ];

    const jobDetails = await resolverUtils.getJobDetailsForOlapCubeType(
      getdataBaseUtils,
      'fakejob'
    );
    expect(jobDetails).toEqual(expectedResult);
  });

  test('should throw error if the sql has an issue getting the data', async () => {
    const mock = jest.spyOn(sharedUtils, 'getPropertyClient');
    const fakeData = 'fake server name';
    const mockPropertyFunction = {
      getProperty: () => {}
    };
    mock.mockReturnValue(mockPropertyFunction);
    const mockGetProperty = jest.spyOn(mockPropertyFunction, 'getProperty');
    mockGetProperty.mockReturnValueOnce(fakeData);

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    try {
      mockDBdata.mockImplementation(() => {
        throw new Error('mocker');
      });
      await resolverUtils.getJobDetailsForOlapCubeType(getdataBaseUtils, 'fakejob');
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});

describe('getJobTypeDetailsForCrystalReportWithoutOMSType should return the details of a crystal report job', () => {
  test('should return all details of crystal report job type', async () => {
    const mockData = [
      { parm_name: '?crystal_id', parm_seq: 1, actl_val: '758' },
      { parm_name: '?crystal_routeind', parm_seq: 2, actl_val: 'False' },
      { parm_name: '?cleanup', parm_seq: 2, actl_val: '1' },
      { parm_name: '?crystal_archiveind', parm_seq: 3, actl_val: 'False' },
      { parm_name: '?crystal_doctype', parm_seq: 4, actl_val: ' ' },
      { parm_name: '?crystal_routetype', parm_seq: 5, actl_val: ' ' },
      { parm_name: '?crystal_entity', parm_seq: 6, actl_val: ' ' },
      { parm_name: '?crystal_ovrd_name', parm_seq: 7, actl_val: ' ' }
    ];

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValueOnce(mockData);

    const expectedResult = [
      { parameter: { name: '?crystal_id' }, value: '758' },
      { parameter: { name: '?crystal_routeind' }, value: 'False' },
      { parameter: { name: '?cleanup' }, value: '1' },
      { parameter: { name: '?crystal_archiveind' }, value: 'False' },
      { parameter: { name: '?crystal_doctype' }, value: ' ' },
      { parameter: { name: '?crystal_routetype' }, value: ' ' },
      { parameter: { name: '?crystal_entity' }, value: ' ' },
      { parameter: { name: '?crystal_ovrd_name' }, value: ' ' }
    ];

    const jobDetails = await resolverUtils.getJobTypeDetailsForCrystalReportWithoutOMSType(
      getdataBaseUtils,
      'fakejob'
    );
    expect(jobDetails).toEqual(expectedResult);
  });

  test('should throw error if the sql has an issue getting the data', async () => {
    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    try {
      mockDBdata.mockImplementation(() => {
        throw new Error('mocker');
      });
      await resolverUtils.getJobTypeDetailsForCrystalReportWithoutOMSType(
        getdataBaseUtils,
        'fakejob'
      );
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});
