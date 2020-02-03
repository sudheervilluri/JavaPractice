import ParseClient from './parse-properties';
import util from './parse-util';

describe('Testing Parse Client', () => {
  test('Should set the deafult dss property location as propertyLocation of PropertyClient object if no dss property location is passed', () => {
    const returnedObj = new ParseClient().getInstance();
    expect(returnedObj.propertyLocation).toEqual('./../data/DSS_Properties.xml');
  });
});

describe('Testing Util', () => {
  test('Should get parser obj', () => {
    util.getParsedJSON('some', (err, res) => {
      expect(err).not.toEqual(null);
      expect(res).toBeUndefined();
    });
  });
});
