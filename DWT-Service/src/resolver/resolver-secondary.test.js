import EasyGraphQLTester from 'easygraphql-tester';
import fs from 'fs';
import mockData from '../data/schedule.mock';
import DataBaseUtils from '../database/database-utils';
import Sapclient from '../mts-socket/sap-client/sap-client';
import ResolverUtils from './resolver-utils';

const OLD_ENV = process.env;
process.env = { ...OLD_ENV };
delete process.env.DSSPropertyLocation;
process.env.DSSPropertyLocation = 'Z:\\program files\\cerner\\DSS\\Fake_RUNTIME\\Fake_PROPERTIES';
const Resolver = require('./resolver').default;

const schema = fs.readFileSync('./src/schema/schema.graphql', {
  encoding: 'utf-8'
});
let resolvers;
let getData;
let getPredecessorMap;
let getJobTypeMap;
const listOfAllStreams = [];
let getCrystalReports;
let sapclient;

describe('test the schema', () => {
  let tester;

  beforeAll(() => {
    jest.resetModules();
    getData = mockData.getSched();
    getPredecessorMap = mockData.getMap();
    getJobTypeMap = mockData.getJobTypeMap();
    getCrystalReports = mockData.getCrystalReports();
    getData.queues.forEach(queue => {
      queue.streams.forEach(stream => {
        listOfAllStreams.push(stream);
      });
    });
    const getdataBaseUtils = new DataBaseUtils({
      ServerName: 'ServerName',
      DatabaseName: 'databaseName'
    });
    const dssServerName = 'dssServerName';
    const sapPort = 'sapPort';
    sapclient = new Sapclient();
    sapclient.allFiles.schedFile = getData;

    resolvers = new Resolver(sapclient, getPredecessorMap, listOfAllStreams).rootResolver(
      getdataBaseUtils,
      getJobTypeMap,
      dssServerName,
      sapPort
    );

    tester = new EasyGraphQLTester(schema, resolvers);
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('nullCharacterOrNotValued resolver should return all the values', () => {
    const QUERY_NULL_CHAR_NOT_VALUED = `
    query getNullCharacterOrNotValued {
      nullCharacterOrNotValued{
        nullCharOrNotValued
      }
    }
    `;

    const fakeData = mockData.getNullCharacterOrNotValued();

    tester
      .graphql(QUERY_NULL_CHAR_NOT_VALUED)
      .then(result => expect(result.data).toEqual(fakeData));
  });

  test('transactionType resolver should return all the Ids and caption from database', () => {
    const QUERY_TRANSACTION_TYPE = `
    query getTransactionType {
      transactionType(format:"Fixed") {
        id
        caption
      }
    }`;

    const fakeDBData = [
      {
        trans_id: '050',
        caption: '050 - transaction for mil_RC_FPARB_DLY',
        sms_trans_act: null
      },
      {
        trans_id: '051',
        caption: '051 - transaction for mil_RC_DACC_DLY',
        sms_trans_act: null
      }
    ];

    const expectedResult = {
      transactionType: [
        {
          id: '050',
          caption: '050 - transaction for mil_RC_FPARB_DLY'
        },
        {
          id: '051',
          caption: '051 - transaction for mil_RC_DACC_DLY'
        }
      ]
    };

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValue(fakeDBData);
    tester
      .graphql(QUERY_TRANSACTION_TYPE)
      .then(result => expect(result.data).toEqual(expectedResult));
  });

  test('transactionType resolver should return all the Ids and caption from database', () => {
    const QUERY_TRANSACTION_TYPE = `
    query getTransactionType {
      transactionType(format:"Delimited") {
        id
        caption
      }
    }`;

    const fakeDBData = [
      {
        trans_id: '211',
        caption: '211 - transaction for mil_RC_FPARB_DLY',
        sms_trans_act: null
      },
      {
        trans_id: '212',
        caption: '212 - transaction for mil_RC_DACC_DLY',
        sms_trans_act: null
      }
    ];

    const expectedResult = {
      transactionType: [
        {
          id: '211',
          caption: '211 - transaction for mil_RC_FPARB_DLY'
        },
        {
          id: '212',
          caption: '212 - transaction for mil_RC_DACC_DLY'
        }
      ]
    };

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValue(fakeDBData);
    tester
      .graphql(QUERY_TRANSACTION_TYPE)
      .then(result => expect(result.data).toEqual(expectedResult));
  });

  test('transactionType resolver should return all the Ids and caption from database', () => {
    const QUERY_TRANSACTION_TYPE = `
    query getTransactionType {
      transactionType(format:"something") {
        id
        caption
      }
    }`;

    const fakeDBData = [];

    const expectedResult = {
      transactionType: []
    };

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValue(fakeDBData);
    tester
      .graphql(QUERY_TRANSACTION_TYPE)
      .then(result => expect(result.data).toEqual(expectedResult));
  });

  test('transactionType resolver should handle the error when there is an error in fetching the data from database', async () => {
    const QUERY_TRANSACTION_TYPE = `
    query getTransactionType {
      transactionType(format:"Fixed") {
        id
        caption
      }
    }`;

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockImplementation(() => {
      throw new Error('mocker');
    });
    const result = await tester.graphql(QUERY_TRANSACTION_TYPE);
    expect(result.errors).not.toBeNull();
  });

  test('transactionType resolver should handle the error when there is an error in fetching the data from database', async () => {
    const QUERY_TRANSACTION_TYPE = `
    query getTransactionType {
      transactionType(format:"Delimited") {
        id
        caption
      }
    }`;

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockImplementation(() => {
      throw new Error('mocker');
    });
    const result = await tester.graphql(QUERY_TRANSACTION_TYPE);
    expect(result.errors).not.toBeNull();
  });

  test('resolver should return crystal report articles', async () => {
    const QUERY_CRYSTAL_REPORTS = `
    query getCrystalReports{
      crystalReport{
        name
        crystalReportArticleId
      }
    }
    `;
    const expectedResult = [
      {
        name: 'Census Detail Listing',
        crystalReportArticleId: '954'
      },
      {
        name: 'Pharmacy Clinical Interventions Report',
        crystalReportArticleId: '955'
      },
      {
        name: 'Pharmacy Charted Early or Late Report',
        crystalReportArticleId: '956'
      },
      {
        name: 'Pharmacy Orders for Drugs over n Report',
        crystalReportArticleId: '957'
      },
      {
        name: 'Variation 2: Flexible Budget Variance',
        crystalReportArticleId: '958'
      }
    ];
    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValue(getCrystalReports);

    tester
      .graphql(QUERY_CRYSTAL_REPORTS)
      .then(result => expect(result.data.crystalReport).toEqual(expectedResult));
  });
  test('test for getExecuteQuery data from database with error handling for crystal reports resolver', async () => {
    const QUERY_CRYSTAL_REPORTS = `
    query getCrystalReports{
      crystalReport{
        name
        crystalReportArticleId
      }
    }
    `;

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockImplementation(() => {
      throw new Error('mocker');
    });
    const result = await tester.graphql(QUERY_CRYSTAL_REPORTS);
    expect(result.errors).not.toBeNull();
  });

  test('test for getjobDetails data with streamName max character validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getJobDetails{
      jobDetails(streamName:"streamNameEx", jobName:"jobName"){
        parameter{
          name
        }
        value
      }
    }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('test for getjobDetails data with JobName max character validation error handling', async () => {
    const QUERY_JOB_EXECUTIONHISTORY = `
    query getJobDetails{
      jobDetails(streamName:"fakestr1", jobName:"jobNameEx"){
        parameter{
          name
        }
        value
      }
    }
    `;

    const result = await tester.graphql(QUERY_JOB_EXECUTIONHISTORY);
    expect(result.errors).not.toBeNull();
  });

  test('test for job details to get the details of a generic job type', async () => {
    const QUERY_JOB_TYPE_DETAILS = `
    query getJobDetails{
      jobDetails(streamName:"DLPRDINT", jobName:"4LPRFPV"){
        parameter{
          name
        }
        value
      }
    }
    `;

    const expectedResult = {
      jobDetails: []
    };

    tester
      .graphql(QUERY_JOB_TYPE_DETAILS)
      .then(result => expect(result.data).toEqual(expectedResult));
  });

  test('test for job details to get the details of a Stored procedure job type', async () => {
    const QUERY_JOB_TYPE_DETAILS = `
    query getJobDetails{
      jobDetails(streamName:"DLPRDINT", jobName:"3LPRFPD"){
        parameter{
          name
        }
        value
      }
    }
    `;

    const mockDBdata = jest.spyOn(ResolverUtils, 'getJobDetailsForStoredProcedureType');

    const fakeData = [
      { parameter: { name: 'Created By' }, value: 'fakeUser' },
      { parameter: { name: 'Object Name' }, value: 'ownerId.fake_obj_name' },
      { parameter: { name: 'Object ID' }, value: 4111 },
      { parameter: { name: '@PrintOpt' }, value: '1' }
    ];

    mockDBdata.mockReturnValue(fakeData);

    const expectedResult = {
      jobDetails: [
        { parameter: { name: 'Created By' }, value: 'fakeUser' },
        { parameter: { name: 'Object Name' }, value: 'ownerId.fake_obj_name' },
        { parameter: { name: 'Object ID' }, value: '4111' },
        { parameter: { name: '@PrintOpt' }, value: '1' }
      ]
    };

    tester
      .graphql(QUERY_JOB_TYPE_DETAILS)
      .then(result => expect(result.data).toEqual(expectedResult));
  });

  test('test for job details to get the details of a OLAP Cube job type', async () => {
    const QUERY_JOB_TYPE_DETAILS = `
    query getJobDetails{
      jobDetails(streamName:"DLPRDINT", jobName:"1LPRFPW"){
        parameter{
          name
        }
        value
      }
    }
    `;

    const mockDBdata = jest.spyOn(ResolverUtils, 'getJobDetailsForOlapCubeType');

    const fakeData = [
      { parameter: { name: '?cube_id' }, value: 'EA-DSS Olap|APC Analysis' },
      { parameter: { name: '?cleanup' }, value: '1' },
      { parameter: { name: '?cube_process' }, value: '2' },
      { parameter: { name: '?shared_dimension' }, value: 'True' },
      { parameter: { name: 'OLAP Server Name' }, value: 'fake server name' }
    ];

    mockDBdata.mockReturnValue(fakeData);

    const expectedResult = {
      jobDetails: [
        { parameter: { name: '?cube_id' }, value: 'EA-DSS Olap|APC Analysis' },
        { parameter: { name: '?cleanup' }, value: '1' },
        { parameter: { name: '?cube_process' }, value: '2' },
        { parameter: { name: '?shared_dimension' }, value: 'True' },
        { parameter: { name: 'OLAP Server Name' }, value: 'fake server name' }
      ]
    };

    tester
      .graphql(QUERY_JOB_TYPE_DETAILS)
      .then(result => expect(result.data).toEqual(expectedResult));
  });

  test('test for job details to get the details of a Cluster job type', async () => {
    const QUERY_JOB_TYPE_DETAILS = `
    query getJobDetails{
      jobDetails(streamName:"DLPRDINT", jobName:"0104PAX"){
        parameter{
          name
        }
        value
      }
    }
    `;

    const mockDBdata = jest.spyOn(ResolverUtils, 'getJobDetailsForClusterType');

    const fakeData = [
      { parameter: { name: '?cluster_id' }, value: '5032' },
      { parameter: { name: '?cluster_id' }, value: '3935' },
      { parameter: { name: '?cluster_id' }, value: '1022' },
      { parameter: { name: '?cleanup' }, value: '1' },
      { parameter: { name: '?cluster_type' }, value: '0' },
      { parameter: { name: '?incremental' }, value: 'False' }
    ];

    mockDBdata.mockReturnValue(fakeData);

    const expectedResult = {
      jobDetails: [
        { parameter: { name: '?cluster_id' }, value: '5032' },
        { parameter: { name: '?cluster_id' }, value: '3935' },
        { parameter: { name: '?cluster_id' }, value: '1022' },
        { parameter: { name: '?cleanup' }, value: '1' },
        { parameter: { name: '?cluster_type' }, value: '0' },
        { parameter: { name: '?incremental' }, value: 'False' }
      ]
    };

    tester
      .graphql(QUERY_JOB_TYPE_DETAILS)
      .then(result => expect(result.data).toEqual(expectedResult));
  });

  test('test for job details to get the details of a Cluster job type', async () => {
    const QUERY_JOB_TYPE_DETAILS = `
    query getJobDetails{
      jobDetails(streamName:"DMILCLIN", jobName:"01BISDMS"){
        parameter{
          name
        }
        value
      }
    }
    `;

    const mockDBdata = jest.spyOn(ResolverUtils, 'getJobTypeDetailsForCrystalReportWithoutOMSType');

    const fakeData = [
      { parameter: { name: '?crystal_id' }, value: '758' },
      { parameter: { name: '?crystal_routeind' }, value: 'False' },
      { parameter: { name: '?cleanup' }, value: '1' },
      { parameter: { name: '?crystal_archiveind' }, value: 'False' },
      { parameter: { name: '?crystal_doctype' }, value: ' ' },
      { parameter: { name: '?crystal_routetype' }, value: ' ' },
      { parameter: { name: '?crystal_entity' }, value: ' ' },
      { parameter: { name: '?crystal_ovrd_name' }, value: ' ' }
    ];

    mockDBdata.mockReturnValue(fakeData);

    const expectedResult = {
      jobDetails: [
        { parameter: { name: '?crystal_id' }, value: '758' },
        { parameter: { name: '?crystal_routeind' }, value: 'False' },
        { parameter: { name: '?cleanup' }, value: '1' },
        { parameter: { name: '?crystal_archiveind' }, value: 'False' },
        { parameter: { name: '?crystal_doctype' }, value: ' ' },
        { parameter: { name: '?crystal_routetype' }, value: ' ' },
        { parameter: { name: '?crystal_entity' }, value: ' ' },
        { parameter: { name: '?crystal_ovrd_name' }, value: ' ' }
      ]
    };

    tester
      .graphql(QUERY_JOB_TYPE_DETAILS)
      .then(result => expect(result.data).toEqual(expectedResult));
  });

  test('test for storedProcedureObjectName to get the objects', async () => {
    const QUERY_STORED_PROCEDURE_OBJECT_NAMES = `
    query getStoredProcedureObjectNames{
      storedProcedureObjectName{
        objectName
        objectId
      }
    }
    `;

    const fakeDBData = [
      { proc_name: 'dbo.AssertEMT' },
      { proc_name: 'dbo.AssertQDM' },
      { proc_name: 'dbo.backup_sched_db_job_def_model_sp' },
      { proc_name: 'dbo.BIHL7Latency' },
      { proc_name: 'dbo.CallSQLAgentPartMaintSp' }
    ];

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValueOnce(fakeDBData);

    const fakeDBData1 = [
      {
        owner_userid: 'dbo',
        obj_name: 'AssertQDM',
        obj_id: 3604
      }
    ];

    mockDBdata.mockReturnValueOnce(fakeDBData1);

    const expectedResult = {
      storedProcedureObjectName: [{ objectName: 'dbo.AssertQDM', objectId: 3604 }]
    };

    tester
      .graphql(QUERY_STORED_PROCEDURE_OBJECT_NAMES)
      .then(result => expect(result.data).toEqual(expectedResult));
  });

  test('should throw error if the sql has an issue getting the data', async () => {
    const QUERY_STORED_PROCEDURE_OBJECT_NAMES = `
    query getStoredProcedureObjectNames{
      storedProcedureObjectName{
        objectName
        objectId
      }
    }
    `;

    const fakeDBData = [
      { proc_name: 'dbo.AssertEMT' },
      { proc_name: 'dbo.AssertQDM' },
      { proc_name: 'dbo.backup_sched_db_job_def_model_sp' },
      { proc_name: 'dbo.BIHL7Latency' },
      { proc_name: 'dbo.CallSQLAgentPartMaintSp' }
    ];

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockReturnValueOnce(fakeDBData);

    mockDBdata.mockImplementation(() => {
      throw new Error('mocker');
    });
    const result = await tester.graphql(QUERY_STORED_PROCEDURE_OBJECT_NAMES);
    expect(result.errors).not.toBeNull();
  });

  test('should throw error if the sql has an issue getting the data', async () => {
    const QUERY_STORED_PROCEDURE_OBJECT_NAMES = `
    query getStoredProcedureObjectNames{
      storedProcedureObjectName{
        objectName
        objectId
      }
    }
    `;

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockImplementation(() => {
      throw new Error('mocker');
    });

    const result = await tester.graphql(QUERY_STORED_PROCEDURE_OBJECT_NAMES);
    expect(result.errors).not.toBeNull();
  });

  test('test for storedProcedureParameters to get the parameters of that pirticular object passsed', async () => {
    const QUERY_STORED_PROCEDURE_PARAMETER_NAMES = `
    query getStoredProcedureParameters{
      storedProcedureParameters(objectId:15106,objectName:"dbo.ConvertCCISp"){
        parameterName
        prompt
        defaultValue
      }
    }
    `;

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    const fakeDBData = [
      {
        column_name: '@pMsgGrp',
        type_name: 'int',
        localize_type_name: 'int',
        type: 38,
        length: 4,
        prec: 10,
        scale: 0,
        allow_nulls: 1,
        col_id: 1,
        status: 8,
        defaulttext: null
      },
      {
        column_name: '@ResvLimit',
        type_name: 'int',
        localize_type_name: 'int',
        type: 38,
        length: 4,
        prec: 10,
        scale: 0,
        allow_nulls: 1,
        col_id: 2,
        status: 8,
        defaulttext: null
      },
      {
        column_name: '@Mode',
        type_name: 'char',
        localize_type_name: 'char',
        type: 39,
        length: 1,
        prec: 1,
        scale: null,
        allow_nulls: 1,
        col_id: 3,
        status: 40,
        defaulttext: null
      },
      {
        column_name: '@ModeNum',
        type_name: 'smallint',
        localize_type_name: 'smallint',
        type: 38,
        length: 2,
        prec: 5,
        scale: 0,
        allow_nulls: 1,
        col_id: 4,
        status: 8,
        defaulttext: null
      },
      {
        column_name: '@PrintOpt',
        type_name: 'tinyint',
        localize_type_name: 'tinyint',
        type: 38,
        length: 1,
        prec: 3,
        scale: 0,
        allow_nulls: 1,
        col_id: 5,
        status: 8,
        defaulttext: null
      }
    ];

    mockDBdata.mockReturnValueOnce(fakeDBData);

    const fakeDBData1 = [
      {
        parm_name: '@pMsgGrp',
        prompt_text: [' Message Group ID', 'Message Group ID'],
        def_val: '??sms_msg_grp_id',
        dflt_val: '??sms_msg_grp_id'
      },
      {
        parm_name: '@PrintOpt',
        prompt_text: 'Option to print (1) or execute (0)',
        def_val: null,
        dflt_val: '0'
      },
      {
        parm_name: '@Mode',
        prompt_text: 'Processing object IO) or time (T) based',
        def_val: null,
        dflt_val: 'O'
      },
      {
        parm_name: '@ResvLimit',
        prompt_text: 'Table reserved space threshold limit',
        def_val: null,
        dflt_val: '0'
      },
      {
        parm_name: '@ModeNum',
        prompt_text: 'Total number of objects or time',
        def_val: null,
        dflt_val: '2'
      }
    ];

    mockDBdata.mockReturnValueOnce(fakeDBData1);

    const expectedResult = {
      storedProcedureParameters: [
        { parameterName: '@pMsgGrp', prompt: 'Message Group ID', defaultValue: '??sms_msg_grp_id' },
        {
          parameterName: '@ResvLimit',
          prompt: 'Table reserved space threshold limit',
          defaultValue: '0'
        },
        {
          parameterName: '@Mode',
          prompt: 'Processing object IO) or time (T) based',
          defaultValue: 'O'
        },
        { parameterName: '@ModeNum', prompt: 'Total number of objects or time', defaultValue: '2' },
        {
          parameterName: '@PrintOpt',
          prompt: 'Option to print (1) or execute (0)',
          defaultValue: '0'
        }
      ]
    };

    tester
      .graphql(QUERY_STORED_PROCEDURE_PARAMETER_NAMES)
      .then(result => expect(result.data).toEqual(expectedResult));
  });

  test('test for getStoredProcedureParameters data with objectId validation error handling', async () => {
    const QUERY_STORED_PROCEDURE_PARAMETER_NAMES = `
    query getStoredProcedureParameters{
      storedProcedureParameters(objectId:-15106,objectName:"dbo.ConvertCCISp"){
        parameterName
        prompt
        defaultValue
      }
    }
    `;

    const result = await tester.graphql(QUERY_STORED_PROCEDURE_PARAMETER_NAMES);
    expect(result.errors).not.toBeNull();
  });

  test('should throw error if the sql has an issue getting the data', async () => {
    const QUERY_STORED_PROCEDURE_PARAMETER_NAMES = `
    query getStoredProcedureParameters{
      storedProcedureParameters(objectId:15106,objectName:"dbo.ConvertCCISp"){
        parameterName
        prompt
        defaultValue
      }
    }
    `;

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    mockDBdata.mockImplementation(() => {
      throw new Error('mocker');
    });

    const result = await tester.graphql(QUERY_STORED_PROCEDURE_PARAMETER_NAMES);
    expect(result.errors).not.toBeNull();
  });

  test('should throw error if the sql has an issue getting the data', async () => {
    const QUERY_STORED_PROCEDURE_PARAMETER_NAMES = `
    query getStoredProcedureParameters{
      storedProcedureParameters(objectId:15106,objectName:"dbo.ConvertCCISp"){
        parameterName
        prompt
        defaultValue
      }
    }
    `;

    const mockDBdata = jest.spyOn(DataBaseUtils.prototype, 'getExecuteQuery');

    const fakeDBData = [
      {
        column_name: '@pMsgGrp',
        type_name: 'int',
        localize_type_name: 'int',
        type: 38,
        length: 4,
        prec: 10,
        scale: 0,
        allow_nulls: 1,
        col_id: 1,
        status: 8,
        defaulttext: null
      },
      {
        column_name: '@ResvLimit',
        type_name: 'int',
        localize_type_name: 'int',
        type: 38,
        length: 4,
        prec: 10,
        scale: 0,
        allow_nulls: 1,
        col_id: 2,
        status: 8,
        defaulttext: null
      },
      {
        column_name: '@Mode',
        type_name: 'char',
        localize_type_name: 'char',
        type: 39,
        length: 1,
        prec: 1,
        scale: null,
        allow_nulls: 1,
        col_id: 3,
        status: 40,
        defaulttext: null
      },
      {
        column_name: '@ModeNum',
        type_name: 'smallint',
        localize_type_name: 'smallint',
        type: 38,
        length: 2,
        prec: 5,
        scale: 0,
        allow_nulls: 1,
        col_id: 4,
        status: 8,
        defaulttext: null
      },
      {
        column_name: '@PrintOpt',
        type_name: 'tinyint',
        localize_type_name: 'tinyint',
        type: 38,
        length: 1,
        prec: 3,
        scale: 0,
        allow_nulls: 1,
        col_id: 5,
        status: 8,
        defaulttext: null
      }
    ];

    mockDBdata.mockReturnValueOnce(fakeDBData);

    mockDBdata.mockImplementation(() => {
      throw new Error('mocker');
    });

    const result = await tester.graphql(QUERY_STORED_PROCEDURE_PARAMETER_NAMES);
    expect(result.errors).not.toBeNull();
  });
});
