import fs from 'fs';
import path from 'path';
import dbConstants from './db-constants';

const barry = require('hi-barry-run-this').datasources;

const getPassword = async dbConnect => {
  const defaultLocation = './../data/DSS_DataSources.xml';

  const dssDataSourcesLocation = path.join(__dirname, defaultLocation);

  const xmlFile = fs.readFileSync(dssDataSourcesLocation);
  const shortServerName = dbConnect.ServerName.toUpperCase().split('.')[0];
  const dataSourcesJson = barry.toJson(xmlFile);
  const decryptedXmlFile = await barry.decrypt(dataSourcesJson);

  const password = Object.keys(decryptedXmlFile)
    .filter(key => {
      // Get the datasource server entry for our tenant database server
      // Ignore case
      return key === shortServerName;
    })
    .reduce((memo, key) => {
      // Transform the object into an array.
      return decryptedXmlFile[key];
    }, [])
    .filter(d => {
      // Filter the array for just the DSS service account
      return d.principal.toLowerCase().indexOf(dbConstants.USER_ID) !== -1;
    })
    .reduce((accumalator, d) => {
      return d.password;
    }, []);
  return password;
};

const decryptXml = {
  getPassword
};

export default decryptXml;
