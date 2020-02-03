import sql from 'mssql';
import DataBaseUtils from './database-utils';
import decryptXml from './decrypt-xml';

jest.mock('mssql');
jest.mock('./decrypt-xml');

describe('Test SQL db connection to fetch data', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test for SQL DB connection', async () => {
    const dataBaseUtils = new DataBaseUtils({
      ServerName: 'dbServerName',
      DatabaseName: 'databaseName'
    });
    decryptXml.getPassword.mockReturnValue('password');
    sql.connect.mockImplementation(args => args);
    await dataBaseUtils.createConnection();

    expect(sql.connect).toHaveBeenCalledTimes(1);
  });

  test('Test for SQL DB connection with Error handling', async () => {
    const dataBaseUtils = new DataBaseUtils({
      ServerName: 'dbServerName',
      DatabaseName: 'databaseName'
    });
    try {
      sql.connect.mockImplementation(() => {
        throw new Error('test');
      });
      await dataBaseUtils.createConnection();
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });

  test('Test for fetching data from database', async () => {
    const dataBaseUtils = new DataBaseUtils({
      ServerName: 'dbServerName',
      DatabaseName: 'databaseName'
    });
    const fakeQuery = 'select * from DBdata';
    const fakeDBdata = {
      recordset: [
        {
          start_dtime: '2018-09-20T05:50:19.013Z',
          end_dtime: '2018-09-20T05:51:21.987Z',
          sts_cd: 'Failed',
          job_name: 'abcd',
          obj_type: 777
        },
        {
          start_dtime: '2018-12-03T05:40:27.370Z',
          end_dtime: '2018-12-03T05:41:54.243Z',
          sts_cd: 'Failed',
          job_name: 'abcd',
          obj_type: 777
        }
      ],
      output: {},
      rowsAffected: []
    };

    const expectDBdata = [
      {
        start_dtime: '2018-09-20T05:50:19.013Z',
        end_dtime: '2018-09-20T05:51:21.987Z',
        sts_cd: 'Failed',
        job_name: 'abcd',
        obj_type: 777
      },
      {
        start_dtime: '2018-12-03T05:40:27.370Z',
        end_dtime: '2018-12-03T05:41:54.243Z',
        sts_cd: 'Failed',
        job_name: 'abcd',
        obj_type: 777
      }
    ];

    sql.query.mockImplementation(() => fakeDBdata);
    const Result = await dataBaseUtils.getExecuteQuery(fakeQuery);
    expect(Result).toEqual(expectDBdata);
    expect(sql.query).toHaveBeenCalledTimes(1);
  });

  test('test for fetching data from database with error handling', async () => {
    const dataBaseUtils = new DataBaseUtils({
      ServerName: 'dbServerName',
      DatabaseName: 'databaseName'
    });
    try {
      const mockquery = 'select * from abc';
      sql.query.mockImplementation(() => {
        throw new Error('mock error');
      });
      await dataBaseUtils.getExecuteQuery(mockquery);
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });

  test('test for config driver', async () => {
    expect(() => {
      return new DataBaseUtils();
    }).toThrow();
  });

  test('test for SQL DB close', async () => {
    const dataBaseUtils = new DataBaseUtils({
      ServerName: 'dbServerName',
      DatabaseName: 'databaseName'
    });
    try {
      const mockConnection = jest.spyOn(DataBaseUtils.prototype, 'isConnected');
      mockConnection.mockReturnValue(true);
      dataBaseUtils.conn = {
        close: () => 'connection closed'
      };
      await dataBaseUtils.closeConnection();
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });

  test('test for SQL DB close if database connection does not exist', async () => {
    const dataBaseUtils = new DataBaseUtils({
      ServerName: 'dbServerName',
      DatabaseName: 'databaseName'
    });
    try {
      const mockConnection = jest.spyOn(DataBaseUtils.prototype, 'isConnected');
      mockConnection.mockReturnValue(false);
      dataBaseUtils.conn = {
        close: () => 'connection closed'
      };
      await dataBaseUtils.closeConnection();
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});
