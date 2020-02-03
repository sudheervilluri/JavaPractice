import fs from 'fs';
import decryptXml from './decrypt-xml';
import DataBaseUtils from './database-utils';

const barry = require('hi-barry-run-this').datasources;

jest.mock('fs');

describe('Decrypt the Xml and fetch the password', () => {
  test('test for fetching password', async () => {
    const dataBaseUtils = new DataBaseUtils({
      ServerName: 'dbServerName',
      DatabaseName: 'databaseName'
    });
    fs.readFileSync = jest.fn();
    barry.toJson = jest.fn();
    barry.decrypt = jest.fn();
    const testContent = 'testContent';
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => testContent);
    const encryptedJsonObject = {};
    const encryptedList = [];
    const encryptedObj = {};
    encryptedObj.key = 'fakeKey';
    encryptedObj.data = 'fakeData';

    const encryptedObj1 = {};
    encryptedObj1.key = 'fakeKey1';
    encryptedObj1.data = 'fakeData1';

    encryptedList.push(encryptedObj);
    encryptedList.push(encryptedObj1);

    encryptedJsonObject.DBSERVERNAME = encryptedList;

    barry.toJson.mockReturnValue(encryptedJsonObject);

    const decryptedJsonObject = {};
    const decryptedList = [];
    const decryptedObj = {};

    decryptedObj.id = 'fakeId';
    decryptedObj.principal = 'smsdbr';
    decryptedObj.password = 'fakePassword';

    const decryptedObj1 = {};

    decryptedObj1.id = 'fakeId';
    decryptedObj1.principal = 'fakePrincipal';
    decryptedObj1.password = 'fakePassword';

    decryptedList.push(decryptedObj);
    decryptedList.push(decryptedObj1);

    decryptedJsonObject.DBSERVERNAME = decryptedList;

    barry.decrypt.mockReturnValue(decryptedJsonObject);

    const password = await decryptXml.getPassword(dataBaseUtils);
    expect(password).toEqual(decryptedObj.password);
  });
});
