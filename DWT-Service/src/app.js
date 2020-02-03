/* istanbul ignore file */
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import fs from 'fs';
import dns from 'dns';
import https from 'https';
import http from 'http';
import os from 'os';
import dotenv from 'dotenv';
import SapClient from './mts-socket/sap-client/sap-client';
import Resolver from './resolver/resolver';
import PropertyClient from './parser/parse-properties';
import DataBaseUtils from './database/database-utils';
import serverUtils from './server-utils';

dotenv.config({
  path: '../.env'
});

const DWT_SERVICE_HTTP_PORT = process.env.DWT_SERVICE_HTTP_PORT || process.env.HTTP_PORT;
const DWT_SERVICE_HTTPS_PORT = process.env.DWT_SERVICE_HTTPS_PORT || process.env.HTTPS_PORT;
const DWT_SSL_ENABLED = process.env.DWT_SSL_ENABLED || process.env.SSL_ENABLED;

const configurations = {
  production: {
    ssl: DWT_SSL_ENABLED,
    port: `${DWT_SSL_ENABLED === 'true' ? DWT_SERVICE_HTTPS_PORT : DWT_SERVICE_HTTP_PORT}`
  },
  development: {
    ssl: DWT_SSL_ENABLED,
    port: `${DWT_SSL_ENABLED === 'true' ? DWT_SERVICE_HTTPS_PORT : DWT_SERVICE_HTTP_PORT}`
  },
  testing: {
    ssl: DWT_SSL_ENABLED,
    port: `${DWT_SSL_ENABLED === 'true' ? DWT_SERVICE_HTTPS_PORT : DWT_SERVICE_HTTP_PORT}`
  },
  staging: {
    ssl: DWT_SSL_ENABLED,
    port: `${DWT_SSL_ENABLED === 'true' ? DWT_SERVICE_HTTPS_PORT : DWT_SERVICE_HTTP_PORT}`
  }
};
const DWT_ENV_TYPE = process.env.DWT_ENV_TYPE || process.env.ENV_TYPE;
const config = configurations[DWT_ENV_TYPE];

/**
 * This function will give the fully qualified hostname and domain name.
 */
const fqdn = () => {
  return new Promise((resolve, reject) => {
    dns.lookup(
      os.hostname(),
      {
        hints: dns.ADDRCONFIG
      },
      (error, ip) => {
        dns.lookupService(ip, 0, (err, hostname) => {
          if (err) {
            reject(new Error(err));
          }
          resolve(hostname);
        });
      }
    );
  });
};
const parseClient = new PropertyClient().getInstance();
const serverStartUp = async () => {
  // Initialize the express server.
  const app = express();
  // Getting the DWT host name
  let DWT_HOST_NAME;
  try {
    DWT_HOST_NAME = process.env.DWT_HOST_NAME || (await fqdn());
  } catch (error) {
    throw new Error(`Error while getting the host name due to ${error.message}`);
  }
  // Reading the schema.graphql file using the data.
  let typeDefs;
  try {
    typeDefs = fs.readFileSync('../schema/schema.graphql', {
      encoding: 'utf-8'
    });
  } catch (error) {
    throw new Error(`Error while reading the file schema.graphql due to ${error.message}`);
  }

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', DWT_HOST_NAME);
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
    next();
  });

  const jobTypeMap = await serverUtils.getJobTypeMap();

  let sapPort;
  let dssServerName;
  let dbServerName;
  let databaseName;

  try {
    // getting the Dss server name
    dssServerName = 'usmlvv3bi0265.usmlvv1d0a.smshsc.net';
    // getting the sapclient port
    sapPort = await parseClient.getProperty('Database Information', 'SAP Port');
    // getting the database server name
    dbServerName = 'usmlvv3bi0265.usmlvv1d0a.smshsc.net';
    // getting database name
    databaseName = await parseClient.getProperty('Database Information', 'Database');
  } catch (error) {
    throw new Error(
      `Error while reading the properties from the DSSProperties file due to ${error.message}`
    );
  }

  const sapClient = new SapClient(jobTypeMap, dbServerName, databaseName);

  // create connection to sql database
  const dataBaseUtils = new DataBaseUtils({
    ServerName: dbServerName,
    DatabaseName: databaseName
  });
  try {
    await dataBaseUtils.createConnection();
  } catch (e) {
    throw new Error(`could not connect to the database due to:  ${e.message}`);
  }
  // create connection to SAP process.
  let sched;
  try {
    sched = await serverUtils.loadSchedule(sapClient, sapPort, dssServerName);
  } catch (error) {
    throw new Error(
      `Error while trying to establish the connection of the ${dssServerName} with a ${sapPort} due to ${
        error.message
      }`
    );
  }
  const streamObj = serverUtils.getStreamObject(sched);
  const { streamPredecessorMap, listOfAllStreams } = streamObj;
  // prepare the resolver to fetch data using the above JSON object.
  let resolvers;
  try {
    const resolver = new Resolver(sapClient, streamPredecessorMap, listOfAllStreams);
    resolvers = resolver.rootResolver(dataBaseUtils, jobTypeMap, dssServerName, sapPort);
  } catch (error) {
    throw new Error(`Error while fetching the required data due to ${error.message}`);
  }

  // Pass the typeDefs and resolvers to Create the apolloserver and setup the Graphql playground.
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
      endpoint: `http${config.ssl === 'true' ? 's' : ''}://${DWT_HOST_NAME}:${config.port}/graphql`
    }
  });
  // The above apolloserver is applied as middleware for the express server.
  apollo.applyMiddleware({
    app
  });
  // Create the HTTPS or HTTP server, per configuration
  let server;
  const certFolder = './../certs';
  if (config.ssl === 'true') {
    if (fs.existsSync(certFolder) === false) {
      throw new Error(
        'Certificate folder configured under DWT_CERT_FOLDER_PATH environment variable is not present or Certificate folder is not mapped to certs folder in dwt-service'
      );
    }
    const keyFile = `${certFolder}/${DWT_HOST_NAME}.key`;
    const certFile = `${certFolder}/${DWT_HOST_NAME}.cer`;
    if (fs.existsSync(keyFile) === false) {
      throw new Error(`${DWT_HOST_NAME}.key file is missing under certificate folder`);
    }
    if (fs.existsSync(certFile) === false) {
      throw new Error(`${DWT_HOST_NAME}.cer file is missing under certificate folder`);
    }
    let key;
    let cert;
    try {
      key = fs.readFileSync(keyFile);
    } catch (error) {
      throw new Error(
        `Error while reading the ${keyFile} under certificate folder due to ${error.message}`
      );
    }
    try {
      cert = fs.readFileSync(certFile);
    } catch (error) {
      throw new Error(
        `Error while reading the ${certFile} under certificate folder due to ${error.message}`
      );
    }
    try {
      server = https.createServer(
        {
          key,
          cert
        },
        app
      );
    } catch (error) {
      throw new Error(`Error while creating HTTPS server due to ${error.message}`);
    }
  } else {
    server = http.createServer(app);
  }
  apollo.installSubscriptionHandlers(server);

  server.listen(
    {
      port: config.port
    },
    () =>
      console.log(
        'Server ready at',
        `http${config.ssl === 'true' ? 's' : ''}://${DWT_HOST_NAME}:${config.port}${
          apollo.graphqlPath
        }`
      )
  );
};

parseClient
  .parseProperties()
  .then(() => {
    serverStartUp();
  })
  .catch(error => {
    console.log(error);
  });
