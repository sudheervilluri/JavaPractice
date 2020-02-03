import net from 'net';
import MTSSock from './mts-socket';
import SapClient from './sap-client/sap-client';
import MTSSServiceConstants from './utilities/mts-service-constants';
import taskRecordUtils from './sap-client/job/job-details/task-record-utils';

jest.mock('net');

describe('MTSSock module should handle errors and function as expected', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('MTSSock should end connection on calling endConnection', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mockSocket.end.mockImplementation(cb => cb());

    mtsSock.socket = mockSocket;

    const mockFunction = jest.fn(msg => msg);

    mtsSock.endConnection(mockFunction, 'Test Message');

    expect(mockSocket.end).toBeCalled();
    expect(mockFunction).toBeCalledWith('Test Message');
  });

  test('MTSSock should write to socket correctly', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mtsSock.socket = mockSocket;

    mtsSock.writeToSocket('Test');

    expect(mockSocket.write).toBeCalled();

    expect(mockSocket.write).toBeCalledWith('00004');
    expect(mockSocket.write).toBeCalledWith('Test');
    expect(mockSocket.write.mock.calls.length).toBe(2);
  });

  test('Should throw error if error event is triggered by the socket', async () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mockSocket.on.mockImplementation((arg, cb) => cb());

    mtsSock.socket = mockSocket;

    try {
      await mtsSock.read();
    } catch (e) {
      expect(mockSocket.end).toBeCalled();
    }
  });

  test('Should close connection if Request is for Sched file', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mockSocket.on.mockImplementation((arg, cb) => cb());

    const mockFunction = jest.fn(msg => msg);

    const mockEndConnection = jest.spyOn(MTSSock.prototype, 'endConnection');

    const mockParseDataFunction = jest.spyOn(SapClient.prototype, 'parseData');

    mockSocket.read
      .mockReturnValueOnce('00005')
      .mockReturnValueOnce('!END!')
      .mockReturnValueOnce(null);

    mtsSock.socket = mockSocket;

    mtsSock.readFromSocket(
      mockFunction,
      MTSSServiceConstants.MTS_SERVICE_VIEW_SCHEDULE_FILE_ONLY,
      new SapClient()
    );

    expect(mockEndConnection).toBeCalledWith(mockFunction, 'Completed Reading the Sched file');
    expect(mockParseDataFunction).not.toBeCalled();
  });

  test('Should close connection if Request all 3 files are read', async () => {
    const mockSocket = new net.Socket();
    const mockTaskRecordUtils = jest.spyOn(taskRecordUtils, 'parseTaskRecord');

    mockTaskRecordUtils.mockReturnValue('mock value');

    const mtsSock = new MTSSock();

    mockSocket.on.mockImplementation((arg, cb) => cb());

    const mockFunction = jest.fn(msg => msg);

    const mockEndConnection = jest.spyOn(MTSSock.prototype, 'endConnection');

    const mockMTSsockInterface = new SapClient();

    const mockParseDataFunction = jest.spyOn(SapClient.prototype, 'parseData');

    mockSocket.read
      .mockReturnValueOnce('00005')
      .mockReturnValueOnce('!END!')
      .mockReturnValueOnce('00004')
      .mockReturnValueOnce('Test')
      .mockReturnValueOnce('00005')
      .mockReturnValueOnce('!END!')
      .mockReturnValueOnce('00005')
      .mockReturnValueOnce('!END!')
      .mockReturnValueOnce(null);
    mtsSock.socket = mockSocket;

    mtsSock.readFromSocket(
      mockFunction,
      MTSSServiceConstants.MTS_SERVICE_VIEW,
      mockMTSsockInterface
    );

    expect(mockEndConnection).toBeCalledWith(
      mockFunction,
      'Completed Reading Sched, Task and Notification Files'
    );
    expect(mockParseDataFunction).toBeCalled();
  });

  test('If data from SAP is null, should not call parseData function', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mockSocket.on.mockImplementation((arg, cb) => cb());

    const mockFunction = jest.fn(msg => msg);

    const mockMTSsockInterface = new SapClient();

    const mockParseDataFunction = jest.spyOn(SapClient.prototype, 'parseData');

    mockSocket.read.mockReturnValueOnce('00005').mockReturnValueOnce(null);
    mtsSock.socket = mockSocket;

    mtsSock.readFromSocket(
      mockFunction,
      MTSSServiceConstants.MTS_SERVICE_VIEW,
      mockMTSsockInterface
    );

    expect(mockParseDataFunction).not.toBeCalled();
  });

  test('If port is null should throw exception', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mtsSock.socket = mockSocket;

    try {
      mtsSock.connect(null, 'localhost');
    } catch (e) {
      expect(e.message).toBe('Invalid port number used while connecting to SAPD');
      expect(mockSocket.connect).not.toBeCalled();
    }
  });

  test('If hostName is null should throw exception', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mtsSock.socket = mockSocket;

    try {
      mtsSock.connect(5050, null);
    } catch (e) {
      expect(e.message).toBe('Invalid hostName used while connecting to SAPD');
      expect(mockSocket.connect).not.toBeCalled();
    }
  });

  test('If port is blank should throw exception', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mtsSock.socket = mockSocket;

    try {
      mtsSock.connect('', 'localhost');
    } catch (e) {
      expect(e.message).toBe('Invalid port number used while connecting to SAPD');
      expect(mockSocket.connect).not.toBeCalled();
    }
  });

  test('If hostName is blank should throw exception', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mtsSock.socket = mockSocket;

    try {
      mtsSock.connect(5050, '');
    } catch (e) {
      expect(e.message).toBe('Invalid hostName used while connecting to SAPD');
      expect(mockSocket.connect).not.toBeCalled();
    }
  });

  test('Should throw exception when both port and hostName are null ', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mtsSock.socket = mockSocket;

    const mockConnect = jest.spyOn(net.Socket.prototype, 'connect');

    expect(() => {
      mtsSock.connect(null, null);
    }).toThrow();

    expect(mockConnect).not.toBeCalled();
  });

  test('Should throw exception when both port and hostName are blank ', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mtsSock.socket = mockSocket;

    const mockConnect = jest.spyOn(net.Socket.prototype, 'connect');

    expect(() => {
      mtsSock.connect('', '');
    }).toThrow();

    expect(mockConnect).not.toBeCalled();
  });

  test('Should not throw exception when both port and hostName are not null and calls connect', () => {
    const mockSocket = new net.Socket();

    const mtsSock = new MTSSock();

    mtsSock.socket = mockSocket;

    const mockConnect = jest.spyOn(net.Socket.prototype, 'connect');

    mtsSock.connect(5050, 'localhost');

    expect(mockConnect).toBeCalledWith(5050, 'localhost');
  });
});
