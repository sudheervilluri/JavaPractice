import fs from 'fs';
import ParseClient from './parse-properties';
import Util from './parse-util';

jest.mock('fs');
jest.mock('./parse-util');

let parseClient;

const mockStatus = {};
const result = {
  properties: {
    propertyset: [
      {
        $: {
          name: 'MySetname'
        },
        property: [
          {
            $: {
              name: 'MyPropName',
              value: 'MyPropValue'
            }
          }
        ]
      }
    ]
  }
};

describe('Testing Parse Client', () => {
  beforeAll(() => {
    mockStatus.mtime = '2019-05-24T06:38:47.575Z';
    parseClient = new ParseClient('someValue').getInstance();
  });

  test('Property Map Should Be Populated', async () => {
    let actualMap = null;
    fs.stat.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    await parseClient.parseProperties();
    actualMap = parseClient.propertyStoredMap;
    expect(actualMap.size).toEqual(1);
  });

  test('Property Map should not be populated', async () => {
    const result1 = {};
    let actualMap = null;
    fs.stat.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result1));
    await parseClient.parseProperties();
    actualMap = parseClient.propertyStoredMap;
    expect(actualMap).not.toBeUndefined();
  });

  test('Property Map size should be zero', async () => {
    const result1 = {
      properties: {
        propertyset: [
          {
            $: {
              name: 'MySetname'
            }
          }
        ]
      }
    };
    let actualMap = null;
    fs.stat.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result1));
    await parseClient.parseProperties();
    actualMap = parseClient.propertyStoredMap;
    expect(actualMap.size).toEqual(0);
  });

  test('Should handle error if file does not exist', async () => {
    fs.stat.mockImplementation((dssLocation, cb) => cb(new Error('test'), null));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    parseClient.parseProperties().then(
      () => {},
      err => {
        expect(err).not.toEqual(null);
      }
    );
  });

  test('Should handle error if could not read file', async () => {
    fs.readFile.mockImplementation((dssLocation, cb) => cb(new Error('test'), null));
    fs.stat.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    parseClient.parseProperties().then(
      () => {},
      err => {
        expect(err).not.toEqual(null);
      }
    );
  });

  test('Should handle error if could not parse xml', async () => {
    fs.stat.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    fs.stat.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(new Error('test'), null));
    parseClient.parseProperties().then(
      () => {},
      err => {
        expect(err).not.toEqual(null);
      }
    );
  });

  test('should get the property successfully', async () => {
    let value = null;
    fs.stat.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    value = await parseClient.getProperty('MySetname', 'MyPropName');
    expect(value).toBe('MyPropValue');
  });

  test('should get the property set map successfully', async () => {
    let value = null;
    fs.stat.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    value = await parseClient.getProperty('MySetname');
    const result2 = new Map();
    result2.set('MyPropName', 'MyPropValue');
    expect(value.get('MySetname')).toBe(result2.get('MySetname'));
  });

  test('should get the property set map successfully', async () => {
    fs.stat.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    parseClient.getProperty();
  });

  test('should return null if wrong prop name is given', async () => {
    let value = null;
    fs.stat.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    value = await parseClient.getProperty('MySet', 'MyPropName');
    expect(value).toBe(null);
  });

  test('should handle error if could parse xml', async () => {
    fs.stat.mockImplementation((dssLocation, cb) => cb(new Error('test'), null));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    parseClient.getProperty('MySetname', 'MyPropName').then(
      () => {},
      err => {
        expect(err).not.toEqual(null);
      }
    );
  });

  test('should parse and get properties if map is not valued', async () => {
    const mockStatus2 = {};
    let value = null;
    mockStatus2.mtime = '2019-05-24T07:38:47.575Z';
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus));
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus2));
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus2));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus2));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    parseClient.parseProperties().then(async () => {
      value = await parseClient.getProperty('MySetname', 'MyPropName');
      expect(value).toBe('MyPropValue');
    });
  });

  test('should parse and get properties if map is not valued', async () => {
    const mockStatus3 = {};
    let value = null;
    mockStatus3.mtime = '2019-05-24T07:38:47.575Z';
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus));
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus3));
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus3));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus3));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    parseClient.parseProperties().then(async () => {
      value = await parseClient.getProperty('MySetname');
      const result3 = new Map();
      result3.set('MyPropName', 'MyPropValue');
      expect(value.get('MySetname')).toBe(result3.get('MySetname'));
    });
  });

  test('should parse and get properties if map is not valued', async () => {
    const mockStatus3 = {};
    mockStatus3.mtime = '2019-05-24T07:38:47.575Z';
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus));
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus3));
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus3));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus3));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    parseClient.parseProperties().then(async () => {
      parseClient.getProperty();
    });
  });

  test('should handle error if could not parse xml during get properties', async () => {
    const mockStatus2 = {};
    mockStatus2.mtime = '2019-05-24T07:38:47.575Z';
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus));
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(null, mockStatus2));
    fs.stat.mockImplementationOnce((dssLocation, cb) => cb(new Error('test'), null));
    fs.readFile.mockImplementation((dssLocation, cb) => cb(null, mockStatus));
    Util.getParsedJSON.mockImplementation((data, cb) => cb(null, result));
    parseClient.parseProperties().then(async () => {
      parseClient.getProperty('MySetname', 'MyPropName').then(
        () => {},
        err => {
          expect(err).not.toEqual(null);
        }
      );
    });
  });

  test('should not create a new instance of parseClient', async () => {
    const returnedObj = new ParseClient('somevalue').getInstance();
    expect(returnedObj).not.toEqual(null);
  });
});
