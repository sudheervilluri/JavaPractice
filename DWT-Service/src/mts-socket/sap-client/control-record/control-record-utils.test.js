import controlRecordUtils from './control-record-utils';
import SapClient from '../sap-client';

describe('parseControlRecord function should parse all control record fields', () => {
  test('parseControlRecord function should parse all control record fields and store it in the SapClient object', () => {
    const sapClient = new SapClient();
    const recordData =
      '01!  0000210C        2 0404201903:11:3300000030119093004014..\\chkpoint\\SMSDHdss2520|..\\log\\sch_SMSDHdss2520.log|..\\data\\task_SMSDHdss2520|..\\data\\notif_SMSDHdss2520|';
    controlRecordUtils.parseControlRecord(recordData, sapClient);

    expect(sapClient.allFiles.schedFile.controlRecord).toMatchObject({
      schedulerLogFilePath: '..\\log\\sch_SMSDHdss2520.log',
      taskFilePath: '..\\data\\task_SMSDHdss2520',
      notificationFilePath: '..\\data\\notif_SMSDHdss2520',
      sleepInterval: 30,
      lastMaintenanceDateTime: 'Apr 04, 2019 03:11:33',
      currentSchedulerDate: 'Thu, Apr 14, 2019',
      checkpointDirectoryPath: '..\\chkpoint\\SMSDHdss2520'
    });
  });
});
