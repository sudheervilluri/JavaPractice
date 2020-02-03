import sql from 'mssql';
import DbConstants from './db-constants';
import decryptXml from './decrypt-xml';

class DataBaseUtils {
  constructor(configDB) {
    if (
      configDB !== null &&
      configDB !== undefined &&
      configDB.ServerName !== null &&
      configDB.ServerName !== undefined &&
      configDB.DatabaseName !== null &&
      configDB.DatabaseName !== undefined
    ) {
      this.ServerName = configDB.ServerName;
      this.DatabaseName = configDB.DatabaseName;
    } else {
      throw new Error('invalid database ServerName');
    }
  }

  async getConfig() {
    const dbConnect = this;

    const pwd = await decryptXml.getPassword(dbConnect);

    const configDB = {
      server: dbConnect.ServerName,
      user: DbConstants.USER_ID,
      password: pwd,
      database: dbConnect.DatabaseName,
      port: DbConstants.SQL_PORT
    };
    return configDB;
  }

  /**
   * This method connects to the SQL DataBase server,
   *
   */

  createConnection() {
    const dbConnect = this;
    return new Promise(async (resolve, reject) => {
      try {
        dbConnect.conn = await sql.connect(await dbConnect.getConfig());
        resolve(dbConnect.conn);
      } catch (error) {
        dbConnect.closeConnection();
        reject(error);
      }
    });
  }

  isConnected() {
    const dbConnect = this;
    return dbConnect.conn._connected;
  }

  /**
   * This method is going to close SQL DataBase server,
   *
   */

  closeConnection() {
    const dbConnect = this;
    return new Promise(async resolve => {
      try {
        /* eslint no-underscore-dangle: 0 */
        if (dbConnect.isConnected() === true) {
          await dbConnect.conn.close();
        }
        resolve();
      } catch (error) {
        resolve();
      }
    });
  }

  /**
   * This method is going to fetch detials from execution history table,
   *
   * @param {string} query : SQL query
   *
   */
  getExecuteQuery(query) {
    const dbConnect = this;
    return new Promise(async (resolve, reject) => {
      try {
        const result = await sql.query(query);
        resolve(JSON.parse(JSON.stringify(result.recordset)));
      } catch (err) {
        dbConnect.closeConnection();
        reject(err);
      }
    });
  }
}

export default DataBaseUtils;
