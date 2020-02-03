import fs from 'fs';
import util from 'util';
import path from 'path';
import parseUtil from './parse-util';

const defaultLocation = './../data/DSS_Properties.xml';

/**
 * Class contains methods used for parsing the DSSProperties xml and also stores the parsed properties in a HashMap in memory.
 *
 * Calling example:
 * const PropertyClient= require('parse-properties');
 * let parseClient= new PropertyClient().getInstance();
 * parseClient.getProperty('propertySetName','propertyName');
 *
 * For testing scenario or a scenario where we want to specify the location of the property location.
 * let parseClient= new PropertyClient('propertyFileLocation').getInstance();
 *
 */
class PropertyClient {
  constructor(propertyLocation) {
    this.fileModifiedTime = new Date();
    this.propertyStoredMap = null;
    this.propertyLocation = propertyLocation != null ? propertyLocation : defaultLocation;
  }

  /**
   * This method parses the DSS_Properties, location of which is available in this.defaultLocation and creates a HashMap.
   */
  parseProperties() {
    const propClient = this;
    return new Promise((resolve, reject) => {
      const dssPropertiesLocation = path.join(__dirname, propClient.propertyLocation);
      fs.stat(dssPropertiesLocation, (fsStatErr, stats) => {
        if (fsStatErr) {
          reject(new Error(util.format('The file %s does not exist', dssPropertiesLocation)));
        } else {
          propClient.fileModifiedTime = new Date(stats.mtime).getTime();
          fs.readFile(dssPropertiesLocation, (readErr, data) => {
            if (readErr) {
              reject(
                new Error(
                  util.format(
                    'Error while reading the %s.Please verify if the file is being open by another process',
                    dssPropertiesLocation
                  )
                )
              );
            }
            parseUtil.getParsedJSON(data, (parseErr, result) => {
              if (parseErr) {
                reject(
                  new Error(util.format('Error while parsing the %s.', dssPropertiesLocation))
                );
              }
              if (result.properties != null && result.properties.propertyset != null) {
                const propertyMap = new Map();
                let i;
                const propertySetArry = result.properties.propertyset;

                for (i = 0; i < propertySetArry.length; i += 1) {
                  const currentPropertySet = propertySetArry[i];
                  const propertyName = currentPropertySet.$.name;
                  const propertyValue = currentPropertySet.property;
                  if (propertyValue != null && propertyValue.length > 0) {
                    const propertySetMap = new Map();
                    let j;
                    for (j = 0; j < propertyValue.length; j += 1) {
                      propertySetMap.set(propertyValue[j].$.name, propertyValue[j].$.value);
                    }
                    propertyMap.set(propertyName, propertySetMap);
                  }
                }
                propClient.propertyStoredMap = propertyMap;
              }
              resolve();
            });
          });
        }
      });
    });
  }

  /**
   * Returns the value associated with a propertySetName and propertyName if propertyStoredMap is already loaded. If propertyStoredMap is not loaded
   * or if the DSS_Properties is modified, it loads the propertyStoredMap by calling parseProperties().
   *
   * @param {string} propertySetName
   * @param {string} propertyName
   */
  getProperty(propertySetName, propertyName) {
    const propClient = this;
    return new Promise((resolve, reject) => {
      fs.stat(path.join(__dirname, propClient.propertyLocation), (err, stats) => {
        if (err) {
          reject(err);
        } else {
          const newDateTime = new Date(stats.mtime).getTime();
          if (newDateTime > propClient.fileModifiedTime || propClient.propertyStoredMap == null) {
            propClient.parseProperties().then(
              () => {
                if (propertySetName != null && propertyName != null) {
                  resolve(propClient.getValueFromMap(propertySetName, propertyName));
                } else if (propertySetName != null && propertyName == null) {
                  resolve(propClient.getPropertySetMap(propertySetName));
                }
              },
              parsePropErr => {
                reject(parsePropErr);
              }
            );
          } else if (propertySetName != null && propertyName != null) {
            resolve(propClient.getValueFromMap(propertySetName, propertyName));
          } else if (propertySetName != null && propertyName == null) {
            resolve(propClient.getPropertySetMap(propertySetName));
          }
        }
      });
    });
  }

  /**
   * Returns the value associated with the propertySetName and propertyName from the propertyStoredMap.
   * @param {String} propertySetName
   * @param {String} propertyName
   */
  getValueFromMap(propertySetName, propertyName) {
    const propClient = this;
    const propertyValue = propClient.propertyStoredMap.get(propertySetName);
    if (propertyValue != null) {
      return propertyValue.get(propertyName);
    }
    return null;
  }

  getPropertySetMap(propertySetName) {
    const propClient = this;
    return propClient.propertyStoredMap.get(propertySetName);
  }
}

/**
 * Singleton class that is used to return a single instance of PropertyClient class.
 */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getInstance"] }] */
class Singleton {
  constructor(propertyLocation) {
    if (!Singleton.instance) {
      Singleton.instance = new PropertyClient(propertyLocation);
    }
  }

  /**
   * Returns the instance of the PropertyClient class.
   */
  getInstance() {
    return Singleton.instance;
  }
}

export default Singleton;
